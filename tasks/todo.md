# Current Phase: Shared Multi-Tenant Product Platform

This file tracks the active work for Phase 3 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 1 has been archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md) and Phase 2 in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- The repository baseline was green at 6 passing files / 20 passing tests before shared-platform work began.
- Shared platform packages and the admin shell scaffold now exist with frozen contract exports for auth, tenancy, RBAC, audit, realtime, and admin-console governance.
- The current repository state is green at 12 passing files / 32 passing tests after Step 3.4 admin shell and product primitives landed.
- Next automated step: Step 3.5.
- Known manual blockers: none for Phase 3.

## Phase 3: Shared Multi-Tenant Product Platform

Goal: build the common application platform that all three owned products will reuse.

### Tests First

- [x] Step 3.1: **Automated** Write failing platform tests in `packages/auth/tests/`, `packages/tenancy/tests/`, `packages/rbac/tests/`, `packages/audit/tests/`, `packages/realtime/tests/`, and `apps/admin-console/tests/` covering auth, invites, memberships, permissions, audit trails, files, jobs, search, and realtime delivery.

### Implementation

- [x] Step 3.2: **Automated** Scaffold the shared platform packages and admin shell under `apps/admin-console/`, `packages/auth/`, `packages/tenancy/`, `packages/rbac/`, `packages/audit/`, `packages/files/`, `packages/search/`, `packages/jobs/`, `packages/realtime/`, `packages/adapters/`, `packages/ui/`, `packages/api-contracts/`, and `packages/domain-model/`.
- [x] Step 3.3: **Automated** Implement authentication, sessions, organizations, workspaces, invites, memberships, RBAC, audit logging, file ownership, search indexing, jobs, and realtime event delivery across the shared packages.
- [x] Step 3.4: **Automated** Build the admin shell and shared product primitives for configuration, governance, and product-level navigation.

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

Step 3.5 will make the shared platform suites pass and verify that multi-workspace tenancy, permissions, audit, files, jobs, search, and realtime behavior are stable enough to support all owned products.

- What to build: verify and extend existing platform contract tests to exercise the full behavior module surface, ensure admin shell and product navigation primitives are covered, and confirm no regressions across Phases 1-2 suites.
- Likely file changes: test files under `packages/*/tests/` and `apps/admin-console/tests/`, possible minor fixes in behavior modules if test coverage reveals gaps.
- Key technical decisions or risks: Step 3.5 is the green phase — no new features, only verification and stabilization. Tests should exercise the builders, validators, and state machines from Steps 3.2-3.4.
- Session-specific context: `pnpm test:run` is green at 12 passing files / 32 passing tests. Step 3.4 added admin shell config composition (governance + product nav + UI), product registration (Altitude/Switchboard/Foundry), governance mutation and product navigation API routes, and breadcrumb navigation primitives in the UI package.
- Acceptance target: all Phase 3 acceptance criteria met — multi-workspace tenancy, RBAC, audit, files, jobs, search, realtime, and admin shell pass platform suites with no regressions in Phases 1-2.
