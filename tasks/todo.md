# Current Phase: Shared Multi-Tenant Product Platform

This file tracks the active work for Phase 3 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 1 has been archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md) and Phase 2 in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- The repository baseline is green at 6 passing files / 20 passing tests before shared-platform work begins.
- Shared platform implementation has not started; Phase 3 begins by defining the executable failing-test boundary for the common platform surfaces.
- Next automated step: Step 3.1.
- Known manual blockers: none for Phase 3.

## Phase 3: Shared Multi-Tenant Product Platform

Goal: build the common application platform that all three owned products will reuse.

### Tests First

- [ ] Step 3.1: **Automated** Write failing platform tests in `packages/auth/tests/`, `packages/tenancy/tests/`, `packages/rbac/tests/`, `packages/audit/tests/`, `packages/realtime/tests/`, and `apps/admin-console/tests/` covering auth, invites, memberships, permissions, audit trails, files, jobs, search, and realtime delivery.

### Implementation

- [ ] Step 3.2: **Automated** Scaffold the shared platform packages and admin shell under `apps/admin-console/`, `packages/auth/`, `packages/tenancy/`, `packages/rbac/`, `packages/audit/`, `packages/files/`, `packages/search/`, `packages/jobs/`, `packages/realtime/`, `packages/adapters/`, `packages/ui/`, `packages/api-contracts/`, and `packages/domain-model/`.
- [ ] Step 3.3: **Automated** Implement authentication, sessions, organizations, workspaces, invites, memberships, RBAC, audit logging, file ownership, search indexing, jobs, and realtime event delivery across the shared packages.
- [ ] Step 3.4: **Automated** Build the admin shell and shared product primitives for configuration, governance, and product-level navigation.

### Green

- [ ] Step 3.5: **Automated** Make the shared platform suites pass and verify that multi-workspace tenancy, permissions, audit, files, jobs, search, and realtime behavior are stable enough to support all owned products.

### Milestone

Acceptance criteria:

- Multi-workspace tenancy works across the shared platform.
- RBAC and audit coverage exist for shared resource types and sensitive actions.
- Files, jobs, search, and realtime delivery pass platform acceptance suites.
- An admin shell exists for instance-level setup and governance.
- All Phase 3 tests pass.
- No regressions occur in Phases 1-2 suites.

## Next Step Plan

Step 3.1 will write the red-phase shared-platform suites that define the common platform boundary before any scaffolding begins.

- What to build: failing tests for auth, organization/workspace tenancy, invites, memberships, RBAC permissions, audit trails, file ownership metadata, search indexing, job scheduling, realtime delivery, and admin-console governance flows.
- Likely file changes: new test files under `packages/auth/tests/`, `packages/tenancy/tests/`, `packages/rbac/tests/`, `packages/audit/tests/`, `packages/realtime/tests/`, and `apps/admin-console/tests/`, plus any minimal workspace config needed so Vitest discovers the new suites.
- Key technical decisions or risks: keep Step 3.1 at the contract level so the tests describe platform behavior without prematurely locking in internal implementations; make the suite boundaries explicit enough to drive the later package scaffolding in Steps 3.2-3.4.
- Session-specific context: the current green baseline is `pnpm test:run` with 6 passing files / 20 passing tests covering benchmark contracts and parity-planning artifacts only.
- Tests to write first: auth/session lifecycle, invite acceptance, organization and workspace membership, permission checks, audit-event emission, file ownership constraints, search-job contracts, realtime event delivery, and admin-console governance smoke coverage.
- Acceptance target: Phase 3 has executable failing tests that capture the shared platform surface while preserving the existing Phase 1-2 green baseline outside the intentional red suites.
