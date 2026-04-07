# Current Phase: Frozen Parity Audit and Benchmark Target Design

This file tracks the active work for Phase 2 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 1 has been archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- The benchmark contract suites are green against the owned-target fixtures, so Phase 2 can start from a stable baseline.
- Step 2.1 established the red-phase contract boundary for missing parity matrices and seed/reset planning artifacts.
- Step 2.2 froze the owned-product feature matrices for `Altitude`, `Switchboard`, and `Foundry`.
- Step 2.3 froze the owned-product API compatibility matrices and adapter inventories for `Altitude`, `Switchboard`, and `Foundry`.
- Step 2.4 froze the owned benchmark journeys and deterministic seed/reset plans for `Altitude`, `Switchboard`, and `Foundry`.
- Next automated step: Step 2.5.
- Known manual blockers: none for Phase 2.

## Phase 2: Frozen Parity Audit and Benchmark Target Design

Goal: convert the parity-products spec into an implementation-grade frozen target for each owned product before building shared platform code.

### Tests First

- [x] Step 2.1: **Automated** Write failing documentation and contract tests for parity artifacts in `docs/parity/`, `packages/benchmark/tests/owned-product-matrix.contract.test.ts`, and `tests/planning/seed-reset.plan.test.ts` covering feature matrices, API resource matrices, benchmark journeys, and deterministic reset requirements.

### Implementation

- [x] Step 2.2: **Automated** Create the frozen feature matrices for `Altitude`, `Switchboard`, and `Foundry` in `docs/parity/altitude-feature-matrix.md`, `docs/parity/switchboard-feature-matrix.md`, and `docs/parity/foundry-feature-matrix.md`.
- [x] Step 2.3: **Automated** Create API compatibility matrices and adapter inventories in `docs/parity/` for the major resources and integrations required by each owned product.
- [x] Step 2.4: **Automated** Define deterministic seed/reset requirements and owned benchmark-critical journey maps in `docs/benchmarks/owned-products.md` and supporting fixture-plan files under `tests/fixtures/`.

### Green

- [ ] Step 2.5: **Automated** Make the parity-audit suites pass and verify that every owned product has a frozen, implementation-testable parity boundary with benchmark journeys and reset expectations.

### Milestone

Acceptance criteria:

- Each owned product has a checked-in frozen feature matrix.
- Each owned product has a major-resource API compatibility matrix.
- Owned benchmark journeys are defined against owned products rather than third-party apps.
- Deterministic seed/reset requirements exist for every benchmark-critical journey.
- All Phase 2 tests pass.
- No regressions occur in Phase 1 suites.

## Next Step Plan

Step 2.5 will run the full Phase 2 parity-audit verification sweep and confirm the frozen parity boundary is implementation-testable end to end.

- What to build: the green-phase verification pass for all Phase 2 parity artifacts, confirming the feature matrices, API matrices, owned benchmark journey map, and deterministic seed/reset plans stay aligned.
- Likely file changes: `tasks/todo.md`, `tasks/history.md`, and possibly `tasks/roadmap.md` if the Phase 2 milestone can be marked complete after the sweep.
- Session-specific context: `docs/parity/`, `docs/benchmarks/owned-products.md`, and `tests/fixtures/*-seed-reset-plan.md` are now present and the full repository test suite is green at 6 files / 20 tests.
- Primary verification command: `pnpm test:run`.
- Scope guard: verify and close the Phase 2 parity-audit milestone only; do not begin shared-platform scaffolding from Phase 3 in the same run.
- Acceptance target: the full parity-audit suites pass without regressions and the project can archive Phase 2 as a frozen, implementation-ready benchmark target definition.
