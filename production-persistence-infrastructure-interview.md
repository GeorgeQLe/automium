# Production Persistence and Infrastructure — Interview Log

## Interview Date

April 25, 2026

## Interview Context

Topic: Production persistence and infrastructure for Automium v1.

Existing coverage: The codebase has six adapter contracts in `packages/adapters/` (identity-provider, audit-sink, file-storage, job-queue, search-backend, realtime-transport) with a registry pattern but zero backing implementations. Domain models in `packages/domain-model/`, `packages/jobs/`, `packages/orchestrator/`, `packages/worker/`, `packages/auth/`, `packages/tenancy/`, `packages/rbac/`, `packages/audit/`, `packages/artifacts/`, `packages/files/`, `packages/realtime/`, and `packages/search/` define comprehensive contracts and domain logic.

Prior spec dependencies:

- `specs/browser-playwright-integration.md`: Firecracker microVMs, credential vault injection, R2 for Playwright traces
- `specs/provider-backed-planner-execution.md`: credential vault for planner API keys, per-tenant quota enforcement

Research context consulted:

- `research/devtool-user-map.md` (operational stakeholders)
- `research/devtool-integration-map.md` (infrastructure adapter priorities)
- Web research: Postgres (Neon) vs CockroachDB vs PlanetScale for multi-tenant SaaS
- Web research: S3 vs R2 vs GCS for artifact storage
- Web research: BullMQ vs SQS vs Cloud Tasks for TypeScript job queues

## Turn 1: Database + Queue

**Question 1:** What primary database should back persistence?

**Options presented:**

1. **Postgres via Neon (Recommended)** — Managed, scale-to-zero, branching. Domain models use shared-schema scoping. Drizzle ORM for TypeScript schema.
2. **Postgres self-managed (RDS/Cloud SQL)** — Proven, no scale-to-zero. Higher base cost.
3. **CockroachDB** — Globally distributed. Overkill for v1.

**Evidence:** Domain models already scope by organizationId/workspaceId, mapping naturally to Postgres RLS. Neon's scale-to-zero keeps costs low during early adoption.

**User selection:** Postgres via Neon

**Question 2:** What should back the job queue?

**Options presented:**

1. **BullMQ on Redis (Recommended)** — TypeScript-native, priorities, dependencies, rate limiting. Redis also covers realtime needs.
2. **AWS SQS + Step Functions** — Managed but lacks priorities, dependencies, rate limiting.
3. **RabbitMQ** — Cross-language. Not needed for TypeScript monorepo.

**Evidence:** BullMQ is the standard for Node.js/TypeScript. The existing job state machine (queued→running→completed/failed with priority tiers) maps directly to BullMQ features.

**User selection:** BullMQ on Redis

## Turn 2: Object Storage + Realtime

**Question 1:** What should back object storage for artifacts?

**Options presented:**

1. **Cloudflare R2 (Recommended)** — S3-compatible, zero egress. Replay artifacts are read-heavy.
2. **AWS S3** — Industry standard. $0.09/GB egress adds up.
3. **GCS** — Highest egress ($0.12/GB). Only if GCP-native.

**Evidence:** Replay artifacts have a read-heavy access pattern (developers inspect failures repeatedly). R2's zero egress is a significant cost advantage.

**User selection:** Cloudflare R2

**Question 2:** What should power realtime transport?

**Options presented:**

1. **Redis pub/sub + WebSocket gateway (Recommended)** — Reuses same Redis as BullMQ. No new dependency.
2. **Ably or Pusher** — Managed but adds cost and dependency.
3. **Server-Sent Events** — Simpler but unidirectional only.

**User selection:** Redis pub/sub + WebSocket gateway

## Turn 3: ORM + Search

**Question 1:** What ORM should bridge domain models to Postgres?

**Options presented:**

1. **Drizzle ORM (Recommended)** — Type-safe TypeScript schema, migration generation, lightweight.
2. **Prisma** — Mature, .prisma schema files, heavy runtime.
3. **Kysely** — Type-safe query builder, no migration tooling.

**User selection:** Drizzle ORM

**Question 2:** What should back full-text search?

**Options presented:**

1. **Postgres FTS (Recommended)** — Built-in tsvector/tsquery. No additional service for v1's scope.
2. **Typesense** — Better search UX. Adds another service.
3. **Elasticsearch** — Overkill for v1.

**User selection:** Postgres full-text search

## Turn 4: Deployment + Worker Communications

**Question 1:** What deployment topology for v1?

**Options presented:**

1. **Fly.io for control plane + bare metal for workers (Recommended)** — Fly.io for stateless API. Bare metal (Hetzner/OVH/AWS) for Firecracker (requires /dev/kvm).
2. **AWS end-to-end** — ECS/EKS + bare-metal EC2. Higher cost.
3. **Kubernetes everywhere** — Firecracker in K8s is complex.

**Evidence:** Firecracker requires /dev/kvm which cloud VMs typically don't expose. Bare-metal providers offer cost-effective KVM-capable servers.

**User selection:** Fly.io + bare metal

**Question 2:** How should workers communicate with the control plane?

**Options presented:**

1. **BullMQ job dispatch + HTTP heartbeat (Recommended)** — Queue for work, HTTP for health/status.
2. **gRPC bidirectional streaming** — Lower latency but complex connection management.
3. **Redis Streams for everything** — Simpler but conflates communication patterns.

**User selection:** BullMQ job dispatch + HTTP heartbeat

## Turn 5: Schema Design + Data Lifecycle

**Question 1:** How should the Postgres schema be organized?

**Options presented:**

1. **Shared schema with row-level scoping (Recommended)** — All tenants in one schema. RLS policies. Matches domain model scoping.
2. **Schema-per-workspace** — Stronger isolation. Complicates migrations.
3. **Database-per-org** — Maximum isolation. Not practical for multi-tenant SaaS.

**User selection:** Shared schema with row-level scoping

**Question 2:** Data lifecycle strategy?

**Options presented:**

1. **Hot/warm/archive tiers (Recommended)** — Postgres (<30d), R2 (>30d), delete past retention.
2. **Everything in Postgres with partitioning** — Simpler but Postgres becomes bottleneck.
3. **Postgres metadata only, R2 for all step data** — Smallest Postgres but higher latency for recent runs.

**User selection:** Hot/warm/archive tiers (deferred to post-v1 implementation)

## Turn 6: Auth + RBAC

**Question 1:** What should implement identity and secrets?

**Options presented:**

1. **WorkOS for auth, encrypted Postgres table for vault (Recommended)** — Magic-link + SSO ready. Vault is simple, auditable, no additional service.
2. **Clerk + AWS Secrets Manager** �� Polished but two external services.
3. **Custom password + HashiCorp Vault** — Maximum control but heavy engineering.

**User selection:** WorkOS + encrypted Postgres vault

**Question 2:** How should RBAC be enforced?

**Options presented:**

1. **Middleware + checkPermission() (Recommended)** — Existing domain function as middleware. RLS as second layer.
2. **External policy engine (OPA/Cedar)** — Overkill for the matrix size.
3. **Database-only (RLS)** — Can't return meaningful errors.

**User selection:** Middleware + checkPermission()

## Turn 7: API Framework + Observability

**Question 1:** What HTTP framework for the API server?

**Options presented:**

1. **Hono (Recommended)** — TypeScript-first, lightweight, multi-runtime. OpenAPI via zod-openapi.
2. **Fastify** — Mature, fast. Node-only.
3. **Express** — Industry standard. Slower, weaker TypeScript.

**User selection:** Hono

**Question 2:** What observability stack?

**Options presented:**

1. **OpenTelemetry + Grafana Cloud (Recommended)** — Vendor-neutral. Free tier covers early usage. Pino for structured logs.
2. **Datadog** — Full-stack but expensive.
3. **Self-hosted Prometheus + Grafana + Loki** — Zero cost but high ops overhead.

**User selection:** OpenTelemetry + Grafana Cloud

## Turn 8: Package Structure + v1 Scope

**Question 1:** How should infrastructure implementations be organized?

**Options presented:**

1. **New persistence package + per-technology adapter packages (Recommended)** — `packages/persistence/` for schema. `packages/adapters-{tech}/` for each backing.
2. **All in packages/adapters/** — Mixes contracts with infrastructure.
3. **Single packages/infrastructure/** — Giant dependency graph.

**User selection:** New persistence package + per-technology adapter packages

**Question 2:** v1 scope boundary?

**Options presented:**

1. **Core pipeline first (Recommended)** — Postgres + BullMQ + R2 + Redis + WorkOS + RBAC. Deferred: FTS, tiering, streaming replay.
2. **Full stack** — Everything. Delays v1.
3. **Persistence + queue only** — Not deployable as a service.

**User selection:** Core pipeline first

## Turn 9: Coverage Checkpoint

All 16 decision areas confirmed as complete by user.

## Significant Deviations from Original Spec

1. **Infrastructure choices (ALL NEW):** The original spec mentioned "production persistence" as a future concern with no technology choices. This interview establishes the complete stack: Neon Postgres, BullMQ/Redis, Cloudflare R2, WorkOS, Hono, Drizzle, Fly.io.

2. **Credential vault approach (NEW):** Prior specs referenced a "credential vault" without implementation detail. Validated as an encrypted Postgres table rather than a separate secrets management service — simpler for v1 with an upgrade path to HashiCorp Vault or KMS.

3. **Deployment topology (NEW):** Split deployment — Fly.io for stateless API tier, bare-metal for KVM-dependent Firecracker workers. Not a single-provider deployment.

4. **Schema design (NEW):** Shared schema with Postgres RLS for tenant isolation. The domain models implied this scoping pattern but never specified the database-level enforcement mechanism.

5. **Data lifecycle (NEW):** Three-tier hot/warm/archive strategy using Postgres and R2. Deferred to post-v1 but the architecture supports it from day one via the artifact retention policies already in the contract.

6. **Search (SIMPLIFIED):** The search package implied a separate search engine. Validated as Postgres FTS for v1 — no additional service. The SearchBackendAdapter contract preserves the upgrade path.

7. **API framework (NEW):** Hono selected over Express or Fastify. Not mentioned in any prior spec. Chosen for TypeScript alignment and multi-runtime support.

8. **Observability (NEW):** OpenTelemetry + Grafana Cloud. Not addressed in any prior spec. Establishes distributed tracing across the full pipeline (API → queue → worker → VM).
