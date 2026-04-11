# Current Phase: Altitude

This file tracks the active work for Phase 4 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Prior phases are archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- The current repository state is green at 21 passing files / 70 passing tests.
- Next automated step: Step 4.1.
- Known manual blockers: none for Phase 4.

## Phase 4: Altitude

Goal: deliver the first owned parity product, `Altitude`, as the Plane-parity benchmark surface and shared-product proving ground.

### Tests First

- [ ] Step 4.1: **Automated** Write failing API, domain, and UI workflow tests in `apps/altitude/tests/`, `packages/domain-model/tests/altitude/`, and `tests/integration/altitude/` for workspaces, projects, work items, views, cycles, modules, pages, analytics, attachments, notifications, and webhooks.

### Implementation

- [ ] Step 4.2: **Automated** Scaffold `apps/altitude/` plus any product-specific packages needed for project management domain logic, APIs, and UI shells.
- [ ] Step 4.3: **Automated** Implement workspaces, projects, membership, work items, views, saved views, cycles, modules, pages/wiki, attachments, activity history, notifications, and major-resource APIs for `Altitude`.
- [ ] Step 4.4: **Automated** Add deterministic seeds, reset hooks, and benchmark-friendly routes for the `Altitude` benchmark-critical journeys.

### Green

- [ ] Step 4.5: **Automated** Make the `Altitude` suites pass and verify that the owned project-management benchmark journeys run end to end against deterministic fixtures.

### Milestone

Acceptance criteria:

- The frozen `Altitude` feature matrix passes.
- Major-resource API compatibility tests pass for `Altitude`.
- Realtime collaboration works for assignments, comments, activity, and state changes.
- The QA platform can exercise the defined `Altitude` benchmark-critical journeys.
- All Phase 4 tests pass.
- No regressions occur in Phases 1-3 suites.

## Next Step Plan

Awaiting implementation plan from `/plan-phases`.
