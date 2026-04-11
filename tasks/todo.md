# Current Phase: Shared Multi-Tenant Product Platform

This file tracks the active work for Phase 3 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 1 has been archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md) and Phase 2 in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- The repository baseline was green at 6 passing files / 20 passing tests before shared-platform work began.
- Shared platform packages and the admin shell scaffold now exist with frozen contract exports for auth, tenancy, RBAC, audit, realtime, and admin-console governance.
- The current repository state is green at 12 passing files / 32 passing tests after Step 3.3 behavior modules landed.
- Next automated step: Step 3.4.
- Known manual blockers: none for Phase 3.

## Phase 3: Shared Multi-Tenant Product Platform

Goal: build the common application platform that all three owned products will reuse.

### Tests First

- [x] Step 3.1: **Automated** Write failing platform tests in `packages/auth/tests/`, `packages/tenancy/tests/`, `packages/rbac/tests/`, `packages/audit/tests/`, `packages/realtime/tests/`, and `apps/admin-console/tests/` covering auth, invites, memberships, permissions, audit trails, files, jobs, search, and realtime delivery.

### Implementation

- [x] Step 3.2: **Automated** Scaffold the shared platform packages and admin shell under `apps/admin-console/`, `packages/auth/`, `packages/tenancy/`, `packages/rbac/`, `packages/audit/`, `packages/files/`, `packages/search/`, `packages/jobs/`, `packages/realtime/`, `packages/adapters/`, `packages/ui/`, `packages/api-contracts/`, and `packages/domain-model/`.
- [x] Step 3.3: **Automated** Implement authentication, sessions, organizations, workspaces, invites, memberships, RBAC, audit logging, file ownership, search indexing, jobs, and realtime event delivery across the shared packages.
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

Step 3.4 will build the admin shell and shared product primitives for configuration, governance, and product-level navigation.

- What to build: admin shell governance state management, section configuration, product-level navigation primitives, shared product configuration interfaces, and wiring the governance shell to the UI primitives already defined in `packages/ui/`.
- Likely file changes: new modules in `apps/admin-console/src/` for admin shell logic and product navigation, possible additions to `packages/ui/src/` for shared product navigation primitives, and barrel updates in both locations.
- Key technical decisions or risks: keep the admin shell self-contained (no cross-package behavior imports beyond types), build on the governance-behavior.ts patterns established in Step 3.3, and ensure the admin shell can be extended per-product in Phases 4-6.
- Session-specific context: `pnpm test:run` is green at 12 passing files / 32 passing tests. Step 3.3 established the pattern of behavior modules with types derived from frozen `as const` constants, factory functions, state machines, and validation. All 13 packages have behavior modules. Packages without a `platform-*.ts` file use local `const` declarations in the behavior file to avoid circular imports with `index.ts`.
- Acceptance target: the admin shell exposes governance configuration, section management, and product-level navigation primitives that can be exercised in the Step 3.5 green phase without breaking the current suite.
