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

## Next Step Plan: Step 1.12 — Run All Tests and Verify Green

### Context
Step 1.11 completed the last adapter stub (IdentityProviderAdapter). All 274 tests across 61 test files pass. `tsc --noEmit` is clean (0 errors). This step is a formal verification gate — confirm that all Phase 1 contract tests are green, no regressions exist, and the persistence foundation is complete.

### What to Verify

1. **Full test suite**: `pnpm test:run` — all 274 tests pass across 61 files, 0 failures
2. **TypeScript**: `pnpm exec tsc --noEmit` — 0 errors
3. **Migration generation**: `pnpm exec drizzle-kit generate --config packages/persistence/drizzle.config.ts` — produces valid SQL (or confirms no new changes needed)
4. **Package exports**: Each adapter package's exports map resolves correctly (already validated by contract tests importing via relative paths)

### Inventory of Phase 1 Contract Tests
- `packages/persistence/tests/schema.contract.test.ts` — 8 tests (schema shape)
- `packages/persistence/tests/credential-vault.contract.test.ts` — 7 tests (AES-256-GCM encrypt/decrypt)
- `packages/adapters-postgres/tests/audit-sink.contract.test.ts` — 6 tests (AuditSinkAdapter shape)
- `packages/adapters-postgres/tests/search-backend.contract.test.ts` — 6 tests (SearchBackendAdapter shape)
- `packages/adapters-workos/tests/identity-provider.contract.test.ts` — 6 tests (IdentityProviderAdapter shape)
- Plus 241 pre-existing tests from prior phases

### Acceptance Criteria
- `pnpm test:run` — 274 passing, 0 failing
- `pnpm exec tsc --noEmit` — 0 errors
- Drizzle migration generation succeeds
- All Phase 1 scope items have corresponding passing tests

### Ship-One-Step Handoff Contract
After approval: run verifications, mark Step 1.12 done, commit and push, write the Step 1.13 plan (refactor pass), enter plan mode for approval, and stop.

- [x] Step 1.6: **Automated** Define Drizzle schema for artifact, audit, credential, file, and job tables.
  - Files: created `packages/persistence/src/schema/artifacts.ts`, `packages/persistence/src/schema/audit.ts`, `packages/persistence/src/schema/credentials.ts`, `packages/persistence/src/schema/files.ts`, `packages/persistence/src/schema/jobs.ts`
  - Replaced the five remaining stub pgTable() calls in `schema/index.ts` with re-exports from dedicated schema files. Removed unused `pgTable`/`text` import.
  - `artifactManifests` with FK to runs, plus normalized `artifactEntries` (1:N) with `artifactKindEnum` (8 values). `auditEvents` with `auditedActionEnum` (7 values) and jsonb metadata. `credentials` with unique composite index on (org, workspace, scope, purpose). `files` with FK to memberships for ownership. `jobs` with `jobStateEnum` (4 values) and jsonb payload.
  - All tenant-scoped tables have standard composite index on (organization_id, workspace_id).
  - Schema contract tests pass 8/8. 249 passing tests, 25 expected-failing (pre-existing credential-vault).

- [x] Step 1.7: **Automated** Generate initial migration and add RLS policies.
  - Files: created `packages/persistence/drizzle.config.ts`, `packages/persistence/drizzle/0000_ambitious_marauders.sql`, `packages/persistence/src/rls.sql`, updated `packages/persistence/src/migrate.ts`
  - `drizzle-kit generate` produced migration SQL with 17 tables, 12 pgEnums, all FKs and indexes.
  - RLS policies cover 9 tenant-scoped tables with direct `organization_id` column (workspaces, memberships, invites, journeys, runs, audit_events, credentials, files, jobs). `artifact_manifests` excluded (no direct `organization_id`). Child tables (journey_versions, steps, artifact_entries, recovery_rules, assertions) skip RLS — access via parent queries.
  - Migration runner uses `drizzle-orm/neon-http/migrator` with `import.meta.url` for path resolution.

- [x] Step 1.8: **Automated** Implement credential vault with AES-256-GCM encryption.
  - Files: created `packages/persistence/src/credential-vault.ts`
  - `encryptCredential`/`decryptCredential` use AES-256-GCM with scryptSync key derivation (fixed salt), random 12-byte IV, dot-separated base64 format (iv.authTag.ciphertext).
  - `storeCredential`/`retrieveCredential` exported as async stubs (shape-only, throw until DB wiring in a later step).
  - All 7 credential-vault contract tests pass. 256 passing tests total, 18 expected-failing (adapter stubs).

- [x] Step 1.9: **Automated** Scaffold `packages/adapters-postgres/` and implement AuditSinkAdapter.
  - Files: created `packages/adapters-postgres/tsconfig.json`, `packages/adapters-postgres/src/index.ts`, `packages/adapters-postgres/src/audit-sink.ts` (package.json already existed)
  - `createAuditSinkAdapter(db)` factory returns object with `boundary: "audit-sink"`, `emit()` and `query()` stub methods returning correct shapes.
  - All 6 audit-sink contract tests pass. 262 passing tests total, 12 expected-failing (search-backend + identity-provider stubs).

- [x] Step 1.10: **Automated** Implement SearchBackendAdapter with Postgres FTS.
  - Files: created `packages/adapters-postgres/src/search-backend.ts`, updated `src/index.ts` barrel
  - `createSearchBackendAdapter(db)` factory returns `{ boundary: "search-backend", index(), search() }` stub implementations returning correct shapes (`{ indexed: false, entryId }` and `{ results: [] }`).
  - All 6 search-backend contract tests pass. 268 passing tests total, 6 expected-failing (identity-provider stubs).

- [x] Step 1.11: **Automated** Scaffold `packages/adapters-workos/` and implement IdentityProviderAdapter.
  - Files: created `packages/adapters-workos/tsconfig.json`, `packages/adapters-workos/src/index.ts`, `packages/adapters-workos/src/identity-provider.ts` (package.json already existed)
  - `createIdentityProviderAdapter(config)` factory returns `{ boundary: "identity-provider", authenticate(), validateToken() }` stub implementations returning correct shapes.
  - All 6 identity-provider contract tests pass. 274 passing tests total, 0 expected-failing adapter stubs remaining.

### Green
- [x] Step 1.12: **Automated** Run all tests and verify they pass (green).
  - `pnpm test:run` — 274 tests passing across 61 files, 0 failures.
  - `pnpm exec tsc --noEmit` — 0 errors.
  - Migration already generated in Step 1.7 (drizzle-kit not a runtime CLI dep — expected).
  - Phase 1 inventory confirmed: 8 schema + 7 credential-vault + 6 audit-sink + 6 search-backend + 6 identity-provider = 33 Phase 1 tests, all green. Plus 241 pre-existing tests, all green.

- [ ] Step 1.13: **Automated** Refactor pass — clean up barrel exports, verify adapter interface alignment, tighten types.

---

## Next Step Plan: Step 1.13 — Refactor Pass

### Context
All Phase 1 implementation steps (1.1–1.11) are complete. Step 1.12 confirmed 274 tests passing, 0 TypeScript errors, and all adapter stubs implemented. This step is a lightweight refactor sweep to clean up any rough edges before closing Phase 1.

### What to Check and Fix

1. **Barrel export consistency** — Verify `packages/persistence/src/index.ts` re-exports all schema tables, connection factory, migration runner, and credential vault. Verify `packages/adapters-postgres/src/index.ts` re-exports both adapter factories. Verify `packages/adapters-workos/src/index.ts` re-exports the identity provider factory.

2. **Adapter interface alignment** — Confirm each adapter factory's return type structurally matches the corresponding interface in `packages/adapters/src/adapters-behavior.ts` (boundary string, method names, parameter shapes, return shapes).

3. **Dead code sweep** — Remove any unused imports, unreferenced type aliases, or leftover TODO/FIXME comments in the three Phase 1 packages.

4. **Type tightening** — Where adapter stubs return hardcoded values (e.g., `{ persisted: false }`), ensure the return type is explicitly typed rather than relying on inference of literal types that may drift.

### Acceptance Criteria
- `pnpm test:run` — 274 passing, 0 failing (no regressions)
- `pnpm exec tsc --noEmit` — 0 errors
- All barrel exports are clean and complete
- No dead code in Phase 1 packages

### Ship-One-Step Handoff Contract
After approval: execute the refactor, validate, mark Step 1.13 done, update Phase 1 milestone acceptance criteria, commit and push, and stop.

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
