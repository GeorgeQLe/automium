# Current Phase: Frozen Parity Audit and Benchmark Target Design

This file tracked the active work for Phase 2 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 1 has been archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- The benchmark contract suites and parity-audit verification sweep are green against the owned-target fixtures and planning artifacts.
- Next automated step: none; Phase 2 is ready to close.
- Known manual blockers: none for the remaining Phase 2 automation.

## Phase 2: Frozen Parity Audit and Benchmark Target Design

Goal: convert the parity-products spec into an implementation-grade frozen target for each owned product before building shared platform code.

### Tests First

- [x] Step 2.1: **Automated** Write failing documentation and contract tests for parity artifacts in `docs/parity/`, `packages/benchmark/tests/owned-product-matrix.contract.test.ts`, and `tests/planning/seed-reset.plan.test.ts` covering feature matrices, API resource matrices, benchmark journeys, and deterministic reset requirements.

### Implementation

- [x] Step 2.2: **Automated** Create the frozen feature matrices for `Altitude`, `Switchboard`, and `Foundry` in `docs/parity/altitude-feature-matrix.md`, `docs/parity/switchboard-feature-matrix.md`, and `docs/parity/foundry-feature-matrix.md`.
- [x] Step 2.3: **Automated** Create API compatibility matrices and adapter inventories in `docs/parity/` for the major resources and integrations required by each owned product.
- [x] Step 2.4: **Automated** Define deterministic seed/reset requirements and owned benchmark-critical journey maps in `docs/benchmarks/owned-products.md` and supporting fixture-plan files under `tests/fixtures/`.

### Green

- [x] Step 2.5: **Automated** Make the parity-audit suites pass and verify that every owned product has a frozen, implementation-testable parity boundary with benchmark journeys and reset expectations.

### Milestone

Acceptance criteria:

- Each owned product has a checked-in frozen feature matrix.
- Each owned product has a major-resource API compatibility matrix.
- Owned benchmark journeys are defined against owned products rather than third-party apps.
- Deterministic seed/reset requirements exist for every benchmark-critical journey.
- All Phase 2 tests pass.
- No regressions occur in Phase 1 suites.

## Next Step Plan

Phase 2 verification completed on 2026-04-07.

- Verified command: `pnpm test:run`.
- Result: parity-audit and prior benchmark-contract suites passed with 6 passing files / 20 passing tests.
- Artifact boundary check: the frozen feature matrices, API compatibility matrices, owned benchmark-critical journey map, and deterministic seed/reset plans are all checked in and covered by executable tests.
- Milestone status: Phase 2 is ready to close. The next automated work should begin with Phase 3 shared-platform red-phase tests.
