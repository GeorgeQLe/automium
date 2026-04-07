# Current Phase: Benchmark Foundation Reset

This file tracks the active work for Phase 1 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Manual blockers and follow-up approvals are tracked in [tasks/manual-todo.md](/home/georgeqle/projects/tools/dev/automium/tasks/manual-todo.md).

## Current Status

- Phase planning is complete; [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md) is now the source of truth for the full build sequence.
- Completed Phase 1 foundation work already covers most of the contract and fixture layer from the earlier external-benchmark plan.
- Next automated step: Step 1.4.
- Known manual blockers: none for the remaining Phase 1 automation.

## Phase 1: Benchmark Foundation Reset

Goal: preserve the benchmark contract work already completed, finish the fixture and documentation layer, and formally pivot the benchmark corpus away from provisioned third-party products toward owned benchmark targets.

### Tests First

- [x] Step 1.1: **Automated** Freeze the benchmark contract tests in `packages/benchmark/tests/` and `packages/contracts/tests/` around schema versions, KPI expectations, fixture-backed corpus shape, and contract documentation references so Phase 1 has an executable baseline before the owned-target corpus pivot.

### Implementation

- [x] Step 1.2: **Automated** Finalize the checked-in schema fixtures and contract documentation under `packages/contracts/fixtures/`, `packages/benchmark/fixtures/`, `docs/contracts/`, and `docs/benchmarks/` so the current benchmark foundation is green and versioned.
- [x] Step 1.3: **Automated** Replace the external benchmark corpus assumptions in `packages/benchmark/src/corpus.ts`, `packages/benchmark/fixtures/corpus.v1.json`, and `docs/benchmarks/v1-corpus.md` with owned-target entries for `Altitude`, `Switchboard`, `Foundry`, and any owned support fixtures required for coverage.
- [ ] Step 1.4: **Automated** Update planning and task-tracking files in `tasks/todo.md`, `tasks/manual-todo.md`, and `tasks/history.md` so obsolete third-party provisioning blockers are removed and the new owned-target benchmark strategy is reflected everywhere.

### Green

- [ ] Step 1.5: **Automated** Make the benchmark contract suites pass against the owned-target fixtures and verify that the docs and task files no longer describe third-party SaaS provisioning as a core benchmark dependency.

### Milestone

Acceptance criteria:

- Benchmark contract tests in `packages/contracts/tests/` and `packages/benchmark/tests/` pass against versioned fixtures.
- `docs/benchmarks/v1-corpus.md` references owned benchmark targets rather than provisioned Appsmith, Plane, and Chatwoot instances.
- The benchmark corpus strategy is consistent with `specs/owned-parity-benchmark-products.md`.
- All Phase 1 tests pass.
- No regressions are introduced in pre-existing repository checks.

## Next Step Plan

Step 1.4 will finish the planning-file cleanup that follows the owned-target corpus pivot.

- Update `tasks/roadmap.md`, `tasks/manual-todo.md`, and `tasks/history.md` so no active Phase 1 blocker still assumes provisioned third-party SaaS environments.
- Re-check `tasks/todo.md` status text and milestone wording against the owned-target strategy before marking Step 1.4 complete.
- Keep the scope to planning and tracking artifacts only; do not start the Step 1.5 verification sweep in the same run.
- Re-run the benchmark contract suites after the tracking updates to confirm the docs and fixtures still align with the frozen v1 corpus.
