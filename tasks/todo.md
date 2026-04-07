# Current Phase: Frozen Parity Audit and Benchmark Target Design

This file tracks the active work for Phase 2 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 1 has been archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- The benchmark contract suites are green against the owned-target fixtures, so Phase 2 can start from a stable baseline.
- Next automated step: Step 2.1.
- Known manual blockers: none for Phase 2.

## Phase 2: Frozen Parity Audit and Benchmark Target Design

Goal: convert the parity-products spec into an implementation-grade frozen target for each owned product before building shared platform code.

### Tests First

- [ ] Step 2.1: **Automated** Write failing documentation and contract tests for parity artifacts in `docs/parity/`, `packages/benchmark/tests/owned-product-matrix.contract.test.ts`, and `tests/planning/seed-reset.plan.test.ts` covering feature matrices, API resource matrices, benchmark journeys, and deterministic reset requirements.

### Implementation

- [ ] Step 2.2: **Automated** Create the frozen feature matrices for `Altitude`, `Switchboard`, and `Foundry` in `docs/parity/altitude-feature-matrix.md`, `docs/parity/switchboard-feature-matrix.md`, and `docs/parity/foundry-feature-matrix.md`.
- [ ] Step 2.3: **Automated** Create API compatibility matrices and adapter inventories in `docs/parity/` for the major resources and integrations required by each owned product.
- [ ] Step 2.4: **Automated** Define deterministic seed/reset requirements and owned benchmark-critical journey maps in `docs/benchmarks/owned-products.md` and supporting fixture-plan files under `tests/fixtures/`.

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

Step 2.1 will establish the red-phase test boundary for the owned-product parity artifacts.

- What to build: failing tests that lock the required shape of the feature matrices, API matrices, benchmark journeys, and deterministic reset requirements before any Phase 2 documentation is written.
- Likely file changes: `packages/benchmark/tests/owned-product-matrix.contract.test.ts`, `tests/planning/seed-reset.plan.test.ts`, and any shared test helpers or placeholder directories needed to express the missing parity artifacts.
- Session-specific context: `docs/parity/` and `tests/planning/` do not exist yet, while the Phase 1 benchmark suites are already green; Step 2.1 should preserve that baseline and add only intentional red-phase failures for the new parity-artifact surface.
- Primary red-phase command: `pnpm test:run -- packages/benchmark/tests/owned-product-matrix.contract.test.ts tests/planning/seed-reset.plan.test.ts`.
- Scope guard: stop after the new tests fail for the expected missing-documentation reasons; do not begin writing the actual parity matrices or journey plans in the same run.
- Acceptance target: the new Step 2.1 tests fail in a targeted way, clearly naming the missing Phase 2 artifacts, while the existing Phase 1 contract suites remain green.
