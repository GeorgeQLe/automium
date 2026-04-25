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
- [ ] Step 1.2: **Automated** Scaffold `packages/persistence/` with Drizzle ORM and Neon connection.
  - Files: create `packages/persistence/package.json`, `packages/persistence/tsconfig.json`, `packages/persistence/src/index.ts`, `packages/persistence/src/connection.ts`
  - Add dependencies: `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`
  - Connection module reads `DATABASE_URL` from env, creates Neon pool with `drizzle()` wrapper.

- [ ] Step 1.3: **Automated** Define Drizzle schema for tenancy tables (organizations, workspaces, memberships).
  - Files: create `packages/persistence/src/schema/tenancy.ts`
  - Map existing domain interfaces from `packages/tenancy/` to Drizzle table definitions.
  - Composite index on (organization_id, workspace_id) for memberships.

- [ ] Step 1.4: **Automated** Define Drizzle schema for auth tables (sessions, invites).
  - Files: create `packages/persistence/src/schema/auth.ts`
  - Map Session and Invite interfaces from `packages/auth/` to Drizzle tables.
  - Session: pgEnum for state (pending/active/revoked/expired). Invite: pgEnum for status.

- [ ] Step 1.5: **Automated** Define Drizzle schema for journey and run tables (journeys, journey_versions, runs, steps, assertions, recovery_rules).
  - Files: create `packages/persistence/src/schema/journeys.ts`, `packages/persistence/src/schema/runs.ts`
  - Map from `packages/journey-compiler/` and `packages/contracts/` domain types.
  - Composite indexes on (organization_id, workspace_id) for journeys and runs.
  - Index on (run_id, sequence) for steps.

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
