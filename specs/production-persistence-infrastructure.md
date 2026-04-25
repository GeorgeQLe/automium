# Production Persistence and Infrastructure Spec

## Status

Validated via spec interview on April 25, 2026. This spec covers all infrastructure backing for Automium's production deployment, implementing the six adapter contracts defined in `packages/adapters/`.

## Summary

Automium's production infrastructure is built on five external services: Postgres (Neon), Redis, Cloudflare R2, WorkOS, and Fly.io — plus bare-metal KVM hosts for Firecracker browser workers. The architecture preserves the existing adapter registry pattern: each infrastructure backing is a separate package implementing the contract from `packages/adapters/`.

The core pipeline for v1 enables: submit a journey → queue a run → dispatch to a Firecracker worker → execute via Playwright → store artifacts in R2 → persist results in Postgres → stream status via Redis pub/sub.

## Infrastructure Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Primary database | Postgres via Neon | Tenants, journeys, runs, steps, audit, RBAC, credential vault, search |
| Job queue | BullMQ on Redis | Run dispatch, worker leasing, async tasks |
| Object storage | Cloudflare R2 | Replay artifacts, screenshots, traces, downloads |
| Realtime transport | Redis pub/sub + WebSocket gateway | Live run status, workspace events |
| Identity provider | WorkOS | Magic-link auth, SSO/SAML for enterprise |
| API framework | Hono | Control plane REST API |
| ORM | Drizzle ORM | Type-safe schema, migrations |
| Observability | OpenTelemetry + Grafana Cloud | Traces, metrics, logs |
| Control plane hosting | Fly.io | API server, WebSocket gateway, BullMQ workers |
| Browser workers | Bare-metal KVM hosts | Firecracker microVMs with Chromium/Playwright |

## Database: Postgres via Neon

### Why Neon

- Managed PostgreSQL with scale-to-zero (costs drop to near-zero when idle)
- Storage/compute separation for independent scaling
- Branching for dev/test environments (branch a full database for feature work)
- Standard Postgres wire protocol — no vendor lock-in
- Row-Level Security (RLS) for tenant isolation at the database level

### Schema Design

Shared schema with row-level tenant scoping. Every table includes `organization_id` and `workspace_id` columns. Postgres RLS policies enforce that queries only return rows matching the authenticated tenant context.

### Core Tables

```
organizations
  id, name, created_at

workspaces
  id, organization_id, name, created_at

memberships
  id, organization_id, workspace_id, principal_id, role, status, created_at

sessions
  id, identity_id, provider, state, expires_at, created_at

invites
  id, organization_id, workspace_id, email, status, invited_by, expires_at, created_at

journeys
  id, organization_id, workspace_id, name, natural_language_source, created_at, updated_at

journey_versions
  id, journey_id, version, compiled_graph, assertions, fixture_schema, policy_profile, created_at

runs
  id, journey_id, journey_version_id, organization_id, workspace_id,
  environment, planner_backend, status, final_verdict, metrics_json,
  artifact_manifest_path, created_at, started_at, completed_at

steps
  id, run_id, organization_id, workspace_id, sequence,
  planner_input_summary, planner_output_intent, executor_action,
  pre_state_snapshot_ref, post_state_snapshot_ref, visual_artifact_refs,
  timing_json, token_cost, result, created_at

assertions
  id, journey_id, type, condition, scope, severity

recovery_rules
  id, journey_id, trigger, strategy, retry_limit

artifact_manifests
  id, run_id, organization_id, workspace_id, root_path, entries_json,
  retention_expires_at, created_at

audit_events
  id, organization_id, workspace_id, actor_id, resource_type, resource_id,
  action, summary, metadata_json, occurred_at

credentials
  id, organization_id, workspace_id, scope, purpose, encrypted_value,
  created_at, rotated_at

files
  id, organization_id, workspace_id, owner_membership_id, name, storage_location,
  size_bytes, content_type, created_at

jobs
  id, organization_id, workspace_id, type, state, payload_json,
  priority, created_at, started_at, completed_at
```

### Indexes

- Every table: composite index on `(organization_id, workspace_id)`
- `runs`: index on `(journey_id, status)`, `(created_at)` for time-range queries
- `steps`: index on `(run_id, sequence)` for ordered step retrieval
- `audit_events`: index on `(resource_type, resource_id)`, `(occurred_at)` for audit queries
- `credentials`: unique index on `(organization_id, workspace_id, scope, purpose)`

### Row-Level Security

```sql
CREATE POLICY tenant_isolation ON runs
  USING (organization_id = current_setting('app.organization_id')::uuid);
```

Applied to all tenant-scoped tables. The application sets `app.organization_id` and `app.workspace_id` session variables after authenticating the request.

## ORM: Drizzle

### Schema Package

Schema definitions live in `packages/persistence/src/schema/`. Each domain area has its own schema file:

- `tenancy.ts` — organizations, workspaces, memberships
- `auth.ts` — sessions, invites
- `journeys.ts` — journeys, journey_versions, assertions, recovery_rules
- `runs.ts` — runs, steps
- `artifacts.ts` — artifact_manifests
- `audit.ts` — audit_events
- `credentials.ts` — credentials (encrypted vault)
- `files.ts` — files
- `jobs.ts` — jobs

### Migrations

Drizzle-kit generates migrations from schema diffs:

```
packages/persistence/
  src/
    schema/        # Drizzle schema definitions
    migrations/    # Generated SQL migrations
    connection.ts  # Neon connection pool
    index.ts       # Schema + migration exports
```

Migrations run at deployment time via a startup script before the API server accepts traffic.

## Job Queue: BullMQ on Redis

### Queue Architecture

```
┌──────────────────┐     ┌─────────┐     ┌────────────────┐
│  Control Plane   │────▶│  Redis   │◀────│  Worker Fleet  │
│  (enqueue runs)  │     │  BullMQ  │     │  (dequeue +    │
│                  │     │  queues  │     │   execute)     │
└──────────────────┘     └─────────┘     └────────────────┘
```

### Queues

- `journey-runs` — main queue for run execution. Priority-ordered (high/normal/low).
- `artifact-upload` — queue for uploading run artifacts to R2 after execution.
- `data-lifecycle` — scheduled queue for migrating aged run data from Postgres to R2 and cleaning expired artifacts.
- `audit-sink` — queue for async audit event persistence (non-blocking).

### Job Data

```typescript
interface RunJobData {
  runId: string;
  journeyId: string;
  journeyVersionId: string;
  organizationId: string;
  workspaceId: string;
  environment: string;
  plannerBackend: { vendor: string; model: string };
  credentialRefs: { scope: string; purpose: string }[];
  priority: "high" | "normal" | "low";
}
```

### Worker Processing

1. BullMQ worker dequeues a run job
2. Resolves credentials from the vault
3. Boots a Firecracker microVM with Chromium + Playwright
4. Injects credentials into the VM
5. Executes the journey via the BrowserRuntime adapter
6. Collects artifacts and telemetry
7. Uploads artifacts to R2 (via artifact-upload queue)
8. Updates run status in Postgres
9. Tears down the microVM

### Concurrency and Rate Limiting

- Per-worker concurrency: configurable (default 2 concurrent runs per worker host)
- Per-tenant rate limiting: BullMQ rate limiter prevents a single tenant from monopolizing the queue
- Priority ordering: high > normal > low, enforced by BullMQ's priority system

## Object Storage: Cloudflare R2

### Why R2

- S3-compatible API — uses `@aws-sdk/client-s3` with R2 endpoint
- Zero egress fees — replay artifacts are read-heavy (developers inspect failures repeatedly)
- Competitive storage pricing ($0.015/GB/month)
- Lifecycle rules for automatic retention enforcement
- Workers integration for edge-served artifacts (future replay console optimization)

### Bucket Structure

```
automium-artifacts/
  {organizationId}/
    {workspaceId}/
      runs/
        {runId}/
          manifest.json
          semantic-snapshots/
            step-{sequence}.json
          network-logs/
            step-{sequence}.json
          console-logs/
            step-{sequence}.json
          targeted-crops/
            step-{sequence}-{elementRef}.png
          assertion-traces/
            step-{sequence}.json
          planner-intents/
            step-{sequence}.json
          executor-actions/
            step-{sequence}.json
          playwright-trace.zip
```

### Retention Enforcement

R2 lifecycle rules implement the artifact retention policy:

- Pass runs: delete after 14 days
- Failed runs: delete after 30 days
- Unsupported runs: delete after 7 days

Objects are tagged with `retention-class` and `expires-at` at upload time. A lifecycle rule deletes objects past their expiration.

### FileStorageAdapter Implementation

```typescript
class R2FileStorageAdapter implements FileStorageAdapter {
  private client: S3Client; // @aws-sdk/client-s3 pointed at R2

  async store(fileId, data, metadata) {
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: this.keyFor(fileId),
      Body: data,
      Metadata: metadata,
      Tagging: `retention-class=${metadata.retentionClass}`
    }));
    return { stored: true, location: this.keyFor(fileId) };
  }

  async retrieve(fileId) { /* GetObjectCommand */ }
  async remove(fileId) { /* DeleteObjectCommand */ }
}
```

## Realtime: Redis Pub/Sub + WebSocket Gateway

### Architecture

```
┌──────────────┐    ┌─────────┐    ┌──────────────────┐    ┌─────────────┐
│ Control Plane │──▶│  Redis   │──▶│  WebSocket       │──▶│  Clients    │
│ (publish)     │   │  pub/sub │   │  Gateway         │   │  (browsers) │
└──────────────┘    └─────────┘    └──────────���───────┘    └─────────────┘
```

### Topics

Mapped from the existing realtime contract:

- `run.{runId}.status` — live run progress (step completed, verdict, error)
- `workspace.{workspaceId}.jobs` — job queue activity
- `workspace.{workspaceId}.audit` — audit event stream
- `workspace.{workspaceId}.files` — file upload/delete notifications

### WebSocket Gateway

- Built with the `ws` library (or Socket.io if client-side convenience is needed)
- Authenticates connections via session token (validated against Postgres sessions)
- Subscribes to Redis channels matching the user's tenant scope
- Fans out events to connected clients with sequence numbers
- Handles reconnection with sequence-based catch-up from Redis streams

### Delivery Guarantees

The existing realtime contract specifies:

- `permission-checked`: gateway verifies the client's RBAC permissions before delivering events
- `ordered-per-topic`: sequence numbers per topic/workspace, verified by the gateway
- `at-least-once`: Redis pub/sub is fire-and-forget; the gateway uses Redis Streams for durability when needed

## Authentication: WorkOS

### Why WorkOS

- Magic-link auth out of the box (matches the auth package's `magic-link` provider)
- SSO/SAML integration for enterprise tenants (matches `sso` provider)
- Organization and user management
- Session handling
- TypeScript SDK

### IdentityProviderAdapter Implementation

```typescript
class WorkOSIdentityProviderAdapter implements IdentityProviderAdapter {
  async authenticate(credentials) {
    // For magic-link: trigger WorkOS passwordless auth
    // For SSO: redirect to WorkOS SSO flow
    // Returns: { identityId, provider }
  }

  async validateToken(token) {
    // Validate WorkOS session token
    // Returns: { valid, identityId, expiresAt }
  }
}
```

### Session Flow

1. User requests magic-link → WorkOS sends email
2. User clicks link → WorkOS validates, returns session
3. Automium creates a `Session` record in Postgres (state: active)
4. Session token is set as HTTP-only cookie
5. API middleware validates session on every request

## Credential Vault

### Encrypted Postgres Table

Credentials are stored as AES-256-GCM encrypted values in the `credentials` table:

- Encryption key sourced from environment variable (or KMS in production)
- Each credential has: `organization_id`, `workspace_id`, `scope`, `purpose`
- Scopes: `app/{appId}/login`, `planner/{vendor}/api-key`, `datasource/{name}/connection`
- Credentials are decrypted at read time in the adapter, never stored in plaintext

### Access Control

- Only `workspace-admin` and above can create/update/rotate credentials
- Credential reads are audit-logged
- Credentials are injected into Firecracker VMs at boot time via the worker process
- Credential values are never included in API responses, artifacts, or logs

## RBAC Enforcement

### Two-Layer Model

1. **Middleware layer**: Hono middleware extracts the user's role from the session, calls `checkPermission(role, resource, action)`, returns 403 with denial reason if not allowed.

2. **Database layer**: Postgres RLS policies enforce tenant isolation at the query level. Even if middleware is bypassed, RLS prevents cross-tenant data access.

### Middleware Application

```typescript
const rbacMiddleware = (resource: string, action: string) => {
  return async (c: Context, next: Next) => {
    const { role } = c.get("session");
    const result = checkPermission(role, resource, action);
    if (!result.allowed) {
      return c.json({ error: result.reason }, 403);
    }
    await next();
  };
};

app.get("/journeys", rbacMiddleware("journey", "list"), listJourneys);
```

## API Framework: Hono

### Why Hono

- TypeScript-first with strong type inference
- Lightweight (~14KB), fast (near-native performance)
- Built-in middleware (CORS, auth, compression, logging)
- OpenAPI schema generation via `@hono/zod-openapi`
- Multi-runtime: runs on Node, Bun, Cloudflare Workers
- Good fit for Fly.io deployment

### Route Structure

The existing `CONTROL_PLANE_ROUTES` manifest maps to Hono routes:

```
/api/v1/
  journeys/        POST, GET, GET/:id, PUT/:id
  journeys/:id/compile  POST
  runs/            POST, GET, GET/:id
  runs/:id/status  GET
  runs/:id/artifacts  GET
  runs/:id/replay  GET
  benchmarks/      POST, GET/:id
  tenants/         GET, PUT (admin only)
  credentials/     POST, PUT/:id, DELETE/:id (no GET value)
```

## Observability: OpenTelemetry + Grafana Cloud

### Instrumentation

- `@opentelemetry/sdk-node` for automatic instrumentation
- `@opentelemetry/instrumentation-http` for API request tracing
- `@opentelemetry/instrumentation-pg` for database query tracing
- Custom spans for: BullMQ job processing, Firecracker VM lifecycle, planner API calls, artifact uploads

### Logging

- `pino` for structured JSON logging
- Log levels: error, warn, info, debug
- Every log entry includes: `traceId`, `organizationId`, `workspaceId`, `runId` (when applicable)
- Logs exported to Grafana Cloud via OpenTelemetry log bridge

### Key Dashboards

- **Run throughput**: runs submitted/completed/failed per hour, by tenant
- **Step latency**: P50/P95/P99 step execution time, by planner backend
- **Worker health**: active workers, lease status, queue depth, VM boot time
- **Provider API**: planner API latency, error rate, token usage, by provider
- **Infrastructure**: Postgres connections, Redis memory, R2 storage usage

## Deployment Topology

### Control Plane (Fly.io)

```
┌──────────────────────────���──────────────────┐
│  Fly.io                                     │
│  ┌───────��─────┐  ┌─────────────────────┐  │
│  │  Hono API   │  │  WebSocket Gateway  │  │
│  │  (2+ nodes) │  │  (2+ nodes)         │  │
│  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │  BullMQ     │  │  Data Lifecycle     │  │
│  │  Dispatcher │  │  Worker             │  │
│  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────┘
         │                    │
    ┌────▼────┐         ┌────▼────┐
    │  Neon   │         │  Redis  │
    │ Postgres│         │ (Upstash│
    │         │         │  or Fly)│
    └─────────┘         └─────────┘
```

### Worker Fleet (Bare Metal)

```
┌──────────────────────────────────────┐
│  Bare Metal Host (KVM-capable)       │
│  ┌──────────────────────────────┐   │
│  │  Worker Process (Node.js)    │   │
│  │  - Dequeues from BullMQ      │   │
│  │  - Manages Firecracker VMs   │   │
│  │  - Uploads artifacts to R2   │   │
│  │  - Sends heartbeats via HTTP │   │
│  └──────────────────────────────┘   │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ FC VM  │ │ FC VM  │ │ FC VM  │  │
│  │Chromium│ │Chromium│ │Chromium│  │
│  └────────┘ └────────┘ └────────┘  │
└──────────────────────────────────────┘
```

Workers connect to the control plane over the public internet:

- BullMQ connection to Redis for job dispatch
- HTTP heartbeats to the Hono API
- R2 uploads for artifacts
- Neon connection for run status updates

### Why Bare Metal for Workers

- Firecracker requires `/dev/kvm` (hardware virtualization)
- Cloud VMs typically don't expose KVM to nested VMs
- Bare metal providers (Hetzner, OVH) offer cost-effective KVM-capable servers
- Each host runs 2+ concurrent Firecracker VMs depending on RAM/CPU

## Data Lifecycle

### Tiers

| Tier | Storage | Duration | Content |
| --- | --- | --- | --- |
| Hot | Postgres | <30 days | Full run data: steps, telemetry, metadata |
| Warm | R2 | 30 days to retention limit | Step-level data migrated from Postgres, summary stays |
| Archive/Delete | R2 lifecycle | Past retention limit | Artifacts auto-deleted by R2 lifecycle rules |

### Migration Process

A scheduled BullMQ job (`data-lifecycle` queue) runs daily:

1. Query Postgres for completed runs older than 30 days
2. Export step-level data as JSONL to R2
3. Delete step rows from Postgres (keep run summary row)
4. Update run record with `archived_at` timestamp and R2 path
5. Log migration in audit events

### Deferred for v1

Data lifecycle tiering is deferred. In v1, all data stays in Postgres. The tiering infrastructure ships when run volume justifies it.

## Search: Postgres Full-Text Search

### v1 Implementation

Use Postgres `tsvector` columns with GIN indexes for full-text search on:

- Journey names and natural-language source text
- Run verdicts and error summaries
- Audit event summaries
- File names

### SearchBackendAdapter Implementation

```typescript
class PostgresSearchAdapter implements SearchBackendAdapter {
  async index(entry) {
    // INSERT into search_entries with tsvector column
  }

  async search(query, filters) {
    // SELECT using tsquery with organization_id/workspace_id filters
  }
}
```

### Upgrade Path

If search complexity outgrows Postgres FTS, migrate to Typesense or Meilisearch. The SearchBackendAdapter contract isolates the switch.

## Package Structure

```
packages/
  adapters/                    # Contracts + registry (existing, unchanged)
  persistence/                 # NEW: Drizzle schema, migrations, connection
    src/
      schema/
        tenancy.ts
        auth.ts
        journeys.ts
        runs.ts
        artifacts.ts
        audit.ts
        credentials.ts
        files.ts
        jobs.ts
      migrations/
      connection.ts
      index.ts
  adapters-postgres/           # NEW: audit-sink, search-backend implementations
  adapters-r2/                 # NEW: file-storage implementation
  adapters-bullmq/             # NEW: job-queue implementation
  adapters-redis/              # NEW: realtime-transport implementation
  adapters-workos/             # NEW: identity-provider implementation
```

Each adapter package:

- Depends only on its technology SDK and `packages/adapters/` (for the contract interface)
- `packages/persistence/` is shared by all Postgres-backed adapters
- The control plane app (`apps/control-plane/`) registers all adapters at startup

## v1 Scope Boundary

### Ships with v1

1. Postgres persistence (Neon) — tenants, journeys, runs, steps, audit, credentials
2. BullMQ job queue (Redis) — run dispatch, artifact upload, audit sink
3. R2 file storage — artifact upload and retrieval
4. Redis pub/sub + WebSocket gateway — live run status
5. WorkOS auth — magic-link login, session management
6. RBAC middleware — checkPermission() + RLS
7. Hono API server — control plane routes
8. Drizzle schema + migrations
9. OpenTelemetry instrumentation
10. Credential vault (encrypted Postgres)

### Deferred

- Postgres FTS (use simple LIKE queries initially)
- Data lifecycle tiering (all data stays in Postgres for v1)
- WebSocket replay streaming (REST polling for v1 replay console)
- Advanced audit queries and dashboards
- SSO/SAML via WorkOS (magic-link only for v1, SSO when enterprise tenants arrive)
- Credential rotation automation
- Worker autoscaling

## Open Questions

- Redis hosting choice: Upstash (serverless, Fly.io integration) vs Fly.io Redis vs self-managed
- Neon pricing tier and connection pooling strategy for production load
- Bare-metal provider selection and geographic distribution for workers
- Firecracker VM image distribution to worker hosts (pre-baked AMI vs image registry)
- Backup and disaster recovery strategy for Postgres and Redis
- R2 bucket naming and access control for multi-tenant artifact isolation
