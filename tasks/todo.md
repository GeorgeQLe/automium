# Automium Production Launch — Phase 1: Persistence Foundation

> Project: Automium Production Launch | Phase: 1 of 8 | Strategy: TDD

## Priority Task Queue

- [ ] `/run` — Execute Phase 1 implementation steps starting from Step 1.1.

## Completed Spec Interviews

- [x] `$spec-interview` — Browser engine / Playwright integration
  - Output: `specs/browser-playwright-integration.md`, `browser-playwright-integration-interview.md`
  - Key decision: Playwright as v1 substrate (not custom engine). Firecracker microVMs. Chromium only. Enriched a11y tree.
- [x] `$spec-interview` — Provider-backed planner execution
  - Output: `specs/provider-backed-planner-execution.md`, `provider-backed-planner-execution-interview.md`
  - Key decision: v2 contract with native tool calling. Claude first, GPT fast-follow. Separate packages per provider. Multi-layer cost controls.
- [x] `$spec-interview` — Production persistence and infrastructure
  - Output: `specs/production-persistence-infrastructure.md`, `production-persistence-infrastructure-interview.md`
  - Key decision: Neon Postgres + BullMQ/Redis + Cloudflare R2 + WorkOS + Hono. Fly.io control plane, bare metal workers. Drizzle ORM. Shared schema + RLS.
- [x] `$spec-interview` — CI/CD integration
  - Output: `specs/ci-cd-integration.md`, `ci-cd-integration-interview.md`
  - Key decision: Standalone `@automium/cli` as thin remote client. Submit+poll+collect. JUnit XML + JSON + terminal. Three-level exit codes. GitHub Actions + GitLab CI examples.

## Completed Prior Work

- [x] MCP Server Transport (4 phases) — archived in `tasks/phases/mcp-phase-{1-4}.md`
- Monorepo health: 61 test files / 274 tests (241 green, 33 red TDD stubs), TypeScript clean

---

## Phase 1: Persistence Foundation

**Goal**: Establish the database layer that all other phases depend on. After this phase, Automium can persist tenants, journeys, runs, steps, audit events, and credentials in Postgres.

**Scope**:
- Create `packages/persistence/` with Drizzle ORM schema for all core tables (organizations, workspaces, memberships, sessions, invites, journeys, journey_versions, runs, steps, assertions, recovery_rules, artifact_manifests, audit_events, credentials, files, jobs)
- Implement Neon Postgres connection pool and migration runner
- Create `packages/adapters-postgres/` implementing AuditSinkAdapter and SearchBackendAdapter (Postgres FTS)
- Add Row-Level Security policies for tenant isolation
- Implement encrypted credential vault (AES-256-GCM) in the credentials table
- Create `packages/adapters-workos/` implementing IdentityProviderAdapter for magic-link auth
- Composite indexes on (organization_id, workspace_id) for all tenant-scoped tables

> Test strategy: tdd

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests

**Subagent lanes:** none

### Tests First
- [x] Step 1.1: **Automated** Write failing contract tests for the persistence layer and adapter implementations.
  - Files: create `packages/persistence/tests/schema.contract.test.ts`, `packages/adapters-postgres/tests/audit-sink.contract.test.ts`, `packages/adapters-postgres/tests/search-backend.contract.test.ts`, `packages/persistence/tests/credential-vault.contract.test.ts`, `packages/adapters-workos/tests/identity-provider.contract.test.ts`
  - Tests cover: Drizzle schema exports all table definitions, migration files are generated, AuditSinkAdapter.emit() persists and .query() retrieves events, SearchBackendAdapter.index() inserts and .search() returns tsvector matches, credential vault encrypts on store and decrypts on retrieve with correct scoping, WorkOS adapter returns identity on authenticate and validates tokens, RLS blocks cross-tenant access when session variables differ.

### Implementation
- [x] Step 1.2: **Automated** Scaffold `packages/persistence/` with Drizzle ORM and Neon connection.
  - Files: create `packages/persistence/package.json`, `packages/persistence/tsconfig.json`, `packages/persistence/src/index.ts`, `packages/persistence/src/connection.ts`
  - Add dependencies: `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`
  - Connection module reads `DATABASE_URL` from env, creates Neon pool with `drizzle()` wrapper.

---

## Next Step Plan: Step 1.3 — Define Drizzle Schema for Tenancy Tables

### Context
Step 1.2 scaffolded `packages/persistence/` with 16 stub `pgTable()` definitions in `src/schema/index.ts`. The schema contract tests pass at the export/shape level. Step 1.3 replaces the three tenancy stubs (`organizations`, `workspaces`, `memberships`) with real Drizzle table definitions matching the domain interfaces in `packages/tenancy/src/tenancy-behavior.ts`.

### Domain Interfaces (from `packages/tenancy/`)

**Organization**: `organizationId: string`, `name: string`, `createdAt: string` (ISO)

**Workspace**: `workspaceId: string`, `organizationId: string`, `name: string`, `createdAt: string` (ISO)

**WorkspaceMembership**: `membershipId: string`, `organizationId: string`, `workspaceId: string`, `principalId: string`, `role: "workspace-admin" | "maintainer" | "contributor" | "viewer"`, `status: "active" | "suspended"`

### What to Build

1. **`packages/persistence/src/schema/tenancy.ts`** — New file with real Drizzle `pgTable()` definitions:
   - `organizations`: `id` (text, PK), `name` (text, not null), `created_at` (timestamp, not null, default now)
   - `workspaces`: `id` (text, PK), `organization_id` (text, not null, FK → organizations.id), `name` (text, not null), `created_at` (timestamp, not null, default now)
   - `memberships`: `id` (text, PK), `organization_id` (text, not null, FK → organizations.id), `workspace_id` (text, not null, FK → workspaces.id), `principal_id` (text, not null), `role` (pgEnum: workspace-admin/maintainer/contributor/viewer, not null), `status` (pgEnum: active/suspended, not null, default 'active')
   - Composite index on `(organization_id, workspace_id)` for memberships
   - Index on `organization_id` for workspaces

2. **Update `packages/persistence/src/schema/index.ts`** — Replace the three tenancy stub `pgTable()` calls with re-exports from `./tenancy.ts`.

### Key Technical Decisions
- Column names use snake_case (Postgres convention), domain interfaces use camelCase — Drizzle handles the mapping.
- Use `pgEnum` for `role` and `status` to enforce valid values at the database level.
- Foreign keys reference parent tables for referential integrity.
- Composite index on `(organization_id, workspace_id)` is specified in the Phase 1 scope for tenant-scoped queries.

### Test Strategy (TDD)
No new tests. The existing schema contract tests should continue passing — they check for named exports and truthy table objects with properties, which real `pgTable()` definitions satisfy.

### Acceptance Criteria
- `packages/persistence/src/schema/tenancy.ts` exists with real Drizzle table definitions
- `organizations`, `workspaces`, `memberships` re-exported from `schema/index.ts`
- Schema contract tests still pass (8/8)
- `pnpm exec tsc --noEmit` clean (no new errors in persistence src)
- No regressions in existing 249 passing tests

### Execution Profile
**Parallel mode:** serial | **Conflict risk:** low | **Review gates:** correctness, tests

### Ship-One-Step Handoff Contract
After approval: implement only Step 1.3, validate it, mark Step 1.3 done in `tasks/todo.md`, update `tasks/history.md`, commit and push the completed work, write the Step 1.4 plan, enter plan mode for Step 1.4 approval, and stop before implementing Step 1.4.

- [x] Step 1.3: **Automated** Define Drizzle schema for tenancy tables (organizations, workspaces, memberships).
  - Files: created `packages/persistence/src/schema/tenancy.ts`
  - Mapped domain interfaces from `packages/tenancy/` to real Drizzle table definitions with pgEnum, FK refs, and indexes.
  - Composite index on (organization_id, workspace_id) for memberships. Index on organization_id for workspaces.

---

## Next Step Plan: Step 1.4 — Define Drizzle Schema for Auth Tables

### Context
Step 1.3 shipped real Drizzle table definitions for the three tenancy tables (`organizations`, `workspaces`, `memberships`) in `packages/persistence/src/schema/tenancy.ts` with pgEnums, FK references, and indexes. The pattern established in Step 1.3 carries forward: create a domain-specific schema file, re-export from `schema/index.ts`.

### Domain Interfaces (from `packages/auth/`)

**Session**: `sessionId: string`, `identityId: string`, `provider: "password" | "magic-link" | "sso"`, `state: "pending" | "active" | "revoked" | "expired"`, `createdAt: string` (ISO), `expiresAt: string` (ISO)

**Invite**: `inviteId: string`, `organizationId: string`, `workspaceId: string`, `email: string`, `status: "pending" | "accepted" | "expired" | "revoked"`, `invitedBy: string`, `createdAt: string` (ISO), `expiresAt: string` (ISO)

### What to Build

1. **`packages/persistence/src/schema/auth.ts`** — New file with real Drizzle `pgTable()` definitions:
   - `sessions`: `id` (text, PK), `identity_id` (text, not null), `provider` (pgEnum: password/magic-link/sso, not null), `state` (pgEnum: pending/active/revoked/expired, not null, default 'pending'), `created_at` (timestamp, not null, default now), `expires_at` (timestamp, not null)
   - `invites`: `id` (text, PK), `organization_id` (text, not null, FK → organizations.id), `workspace_id` (text, not null, FK → workspaces.id), `email` (text, not null), `status` (pgEnum: pending/accepted/expired/revoked, not null, default 'pending'), `invited_by` (text, not null), `created_at` (timestamp, not null, default now), `expires_at` (timestamp, not null)
   - Index on `identity_id` for sessions (lookup by identity)
   - Composite index on `(organization_id, workspace_id)` for invites

2. **Update `packages/persistence/src/schema/index.ts`** — Replace the two auth stub `pgTable()` calls with re-exports from `./auth.ts`.

### Acceptance Criteria
- Schema contract tests still pass (8/8)
- No new TS errors in persistence src
- No regressions in 249 passing tests

### Ship-One-Step Handoff Contract
After approval: implement only Step 1.4, validate it, mark Step 1.4 done in `tasks/todo.md`, update `tasks/history.md`, commit and push the completed work, write the Step 1.5 plan, enter plan mode for Step 1.5 approval, and stop before implementing Step 1.5.

- [x] Step 1.4: **Automated** Define Drizzle schema for auth tables (sessions, invites).
  - Files: created `packages/persistence/src/schema/auth.ts`
  - Mapped Session and Invite interfaces from `packages/auth/` to real Drizzle table definitions with pgEnums (`identityProviderEnum`, `sessionStateEnum`, `inviteStatusEnum`), FK refs (invites → organizations, workspaces), and indexes (sessions: identity_id, invites: composite org+workspace).
  - pgEnum values match frozen `as const` arrays in `platform-auth.ts` exactly. Sessions have no FK to tenancy tables (identity-scoped, not tenant-scoped).

- [x] Step 1.5: **Automated** Define Drizzle schema for journey and run tables (journeys, journey_versions, runs, steps, assertions, recovery_rules).
  - Files: created `packages/persistence/src/schema/journeys.ts`, `packages/persistence/src/schema/runs.ts`
  - Mapped domain interfaces from control-plane, journey-compiler, assertions, and contracts packages to real Drizzle table definitions with 4 pgEnums (`runStatusEnum`, `stepVerdictEnum`, `assertionTypeEnum`, `recoveryStrategyEnum`), FK refs (journeys/runs → organizations + workspaces, runs → journeys, steps → runs, assertions/recoveryRules → journeyVersions), and indexes (journeys/runs: composite org+workspace, journeyVersions: journey_id, steps: composite run_id+sequence).
  - pgEnum values match frozen `as const` arrays exactly. steps.verdict nullable (set at execution time). runs.artifact_manifest_ref nullable (populated after completion).

---

## Next Step Plan: Step 1.6 — Define Drizzle Schema for Supporting Tables

### Context
Step 1.5 shipped real Drizzle table definitions for the six journey/run tables in `packages/persistence/src/schema/journeys.ts` and `runs.ts`. Step 1.6 replaces the five remaining stubs (`artifactManifests`, `auditEvents`, `credentials`, `files`, `jobs`) with real Drizzle table definitions, following the same pattern established in Steps 1.3–1.5.

Domain interfaces come from:
- `packages/artifacts/src/artifacts-domain.ts` — `ArtifactManifest`, `ArtifactManifestEntry`, `ArtifactKind`
- `packages/audit/src/audit-behavior.ts` — `AuditEvent`, `AuditedAction`
- `packages/files/src/files-behavior.ts` — `FileOwnership`
- `packages/jobs/src/jobs-behavior.ts` — `Job`, `JobLifecycleState`

### What to Build

1. **`packages/persistence/src/schema/artifacts.ts`** — Drizzle `pgTable()` definitions:
   - pgEnum: `artifactKindEnum` (semantic-snapshot/network-log/console-log/download/targeted-crop/assertion-trace/planner-intent/executor-action)
   - `artifactManifests`: `id` (text PK), `run_id` (text not null, FK → runs.id), `root` (text not null), `schema_version` (text not null, default 'v1'), `created_at` (timestamp w/ tz, not null, default now). Index on `run_id`.
   - `artifactEntries`: `id` (text PK), `manifest_id` (text not null, FK → artifactManifests.id), `kind` (artifactKindEnum, not null), `path` (text not null). Index on `manifest_id`.

2. **`packages/persistence/src/schema/audit.ts`** — Drizzle `pgTable()` definitions:
   - pgEnum: `auditedActionEnum` (invite.sent/invite.accepted/membership.role-changed/file.ownership-transferred/job.scheduled/search.indexed/realtime.event-delivered)
   - `auditEvents`: `id` (text PK), `organization_id` (text not null, FK → organizations.id), `workspace_id` (text not null, FK → workspaces.id), `actor_id` (text not null), `resource_type` (text not null), `resource_id` (text not null), `action` (auditedActionEnum, not null), `summary` (text not null), `metadata` (jsonb), `occurred_at` (timestamp w/ tz, not null, default now). Composite index on `(organization_id, workspace_id)`.

3. **`packages/persistence/src/schema/credentials.ts`** — Drizzle `pgTable()` definitions:
   - `credentials`: `id` (text PK), `organization_id` (text not null, FK → organizations.id), `workspace_id` (text not null, FK → workspaces.id), `scope` (text not null), `purpose` (text not null), `encrypted_value` (text not null), `created_at` (timestamp w/ tz, not null, default now), `updated_at` (timestamp w/ tz, not null, default now). Unique composite index on `(organization_id, workspace_id, scope, purpose)`.

4. **`packages/persistence/src/schema/files.ts`** — Drizzle `pgTable()` definitions:
   - `files`: `id` (text PK), `organization_id` (text not null, FK → organizations.id), `workspace_id` (text not null, FK → workspaces.id), `owner_membership_id` (text not null, FK → memberships.id), `created_at` (timestamp w/ tz, not null, default now). Composite index on `(organization_id, workspace_id)`.

5. **`packages/persistence/src/schema/jobs.ts`** — Drizzle `pgTable()` definitions:
   - pgEnum: `jobStateEnum` (queued/running/completed/failed)
   - `jobs`: `id` (text PK), `organization_id` (text not null, FK → organizations.id), `workspace_id` (text not null, FK → workspaces.id), `type` (text not null), `state` (jobStateEnum, not null, default 'queued'), `payload` (jsonb), `created_at` (timestamp w/ tz, not null, default now), `updated_at` (timestamp w/ tz, not null, default now). Composite index on `(organization_id, workspace_id)`.

6. **Update `packages/persistence/src/schema/index.ts`** — Replace the five remaining stub `pgTable()` calls with re-exports from the new schema files. Remove the now-unused `pgTable`/`text` import.

### Key Decisions
- `artifactManifests` has a separate `artifactEntries` table for the nested entries array (normalized 1:N)
- `auditEvents.metadata` and `jobs.payload` use `jsonb` for flexible semi-structured data
- `credentials` has a unique composite on `(organization_id, workspace_id, scope, purpose)` for scoped lookup
- All tenant-scoped tables get the standard composite index on `(organization_id, workspace_id)`

### Acceptance Criteria
- Schema contract tests still pass (8/8)
- No new TS errors in persistence src (excluding pre-existing credential-vault)
- No regressions in 249 passing tests

### Ship-One-Step Handoff Contract
After approval: implement only Step 1.6, validate it, mark Step 1.6 done in `tasks/todo.md`, update `tasks/history.md`, commit and push the completed work, write the Step 1.7 plan, enter plan mode for Step 1.7 approval, and stop before implementing Step 1.7.

- [ ] Step 1.6: **Automated** Define Drizzle schema for artifact, audit, credential, file, and job tables.
  - Files: create `packages/persistence/src/schema/artifacts.ts`, `packages/persistence/src/schema/audit.ts`, `packages/persistence/src/schema/credentials.ts`, `packages/persistence/src/schema/files.ts`, `packages/persistence/src/schema/jobs.ts`
  - Map from packages/artifacts/, packages/audit/, packages/files/, packages/jobs/ domain types.
  - Credentials table: encrypted_value as text (AES-256-GCM ciphertext), scope + purpose columns with unique composite index.

- [ ] Step 1.7: **Automated** Generate initial migration and add RLS policies.
  - Files: create `packages/persistence/src/migrations/` (generated by drizzle-kit), create `packages/persistence/src/rls.sql`
  - Run `drizzle-kit generate` to produce migration SQL from schema.
  - Add RLS policies for all tenant-scoped tables using `current_setting('app.organization_id')`.
  - Create migration runner in `packages/persistence/src/migrate.ts`.

- [ ] Step 1.8: **Automated** Implement credential vault with AES-256-GCM encryption.
  - Files: create `packages/persistence/src/credential-vault.ts`
  - Functions: `encryptCredential(plaintext, key)`, `decryptCredential(ciphertext, key)`, `storeCredential(pool, params)`, `retrieveCredential(pool, params)`, `rotateCredential(pool, params)`.
  - Encryption key from `CREDENTIAL_ENCRYPTION_KEY` env var.
  - Scoped by (organization_id, workspace_id, scope, purpose).

- [ ] Step 1.9: **Automated** Scaffold `packages/adapters-postgres/` and implement AuditSinkAdapter.
  - Files: create `packages/adapters-postgres/package.json`, `packages/adapters-postgres/tsconfig.json`, `packages/adapters-postgres/src/index.ts`, `packages/adapters-postgres/src/audit-sink.ts`
  - Implements AuditSinkAdapter from `packages/adapters/`.
  - emit(): INSERT into audit_events table. query(): SELECT with filter on organization_id, workspace_id, resource_type, action, date range.

- [ ] Step 1.10: **Automated** Implement SearchBackendAdapter with Postgres FTS.
  - Files: create `packages/adapters-postgres/src/search-backend.ts`
  - index(): INSERT into search_entries with tsvector column generated from content.
  - search(): SELECT using plainto_tsquery with GIN index, filtered by organization_id and workspace_id.

- [ ] Step 1.11: **Automated** Scaffold `packages/adapters-workos/` and implement IdentityProviderAdapter.
  - Files: create `packages/adapters-workos/package.json`, `packages/adapters-workos/tsconfig.json`, `packages/adapters-workos/src/index.ts`, `packages/adapters-workos/src/identity-provider.ts`
  - Add dependency: `@workos-inc/node`
  - authenticate(): Trigger WorkOS passwordless auth or SSO based on credentials. Returns identityId and provider.
  - validateToken(): Validate WorkOS session token. Returns valid boolean and identityId.

### Green
- [ ] Step 1.12: **Automated** Run all tests and verify they pass (green).
  - Run `pnpm test:run` to verify all new contract tests pass.
  - Verify no regressions in existing 241 tests.
  - Verify drizzle-kit generate produces migration SQL without errors.

- [ ] Step 1.13: **Automated** Refactor if needed while keeping tests green.
  - Ensure schema modules re-export cleanly from `packages/persistence/src/index.ts`.
  - Verify all adapter implementations match the exact interface signatures from `packages/adapters/`.

### Milestone: Phase 1 — Persistence Foundation
**Acceptance Criteria:**
- [ ] Drizzle schema compiles and generates migrations for all core tables
- [ ] Migrations run successfully against a Neon Postgres instance
- [ ] AuditSinkAdapter can emit and query audit events through Postgres
- [ ] SearchBackendAdapter can index and query using Postgres tsvector/tsquery
- [ ] Credential vault can store, retrieve, and rotate encrypted secrets
- [ ] RLS policies prevent cross-tenant data access when session variables are set
- [ ] WorkOS adapter authenticates via magic-link and validates session tokens
- [ ] All adapter implementations pass contract tests matching `packages/adapters/` interfaces
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
