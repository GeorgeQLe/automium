# Current Phase: Benchmark Foundation Reset

This file tracks the active work for Phase 1 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Manual blockers and follow-up approvals are tracked in [tasks/manual-todo.md](/home/georgeqle/projects/tools/dev/automium/tasks/manual-todo.md).

## Current Status

- Phase planning is complete; [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md) is now the source of truth for the full build sequence.
- Completed Phase 1 foundation work already covers most of the contract and fixture layer from the earlier external-benchmark plan.
- Next automated step: Step 1.5.
- Known manual blockers: none for the remaining Phase 1 automation.

## Phase 1: Benchmark Foundation Reset

Goal: preserve the benchmark contract work already completed, finish the fixture and documentation layer, and formally pivot the benchmark corpus away from provisioned third-party products toward owned benchmark targets.

### Tests First

- [x] Step 1.1: **Automated** Freeze the benchmark contract tests in `packages/benchmark/tests/` and `packages/contracts/tests/` around schema versions, KPI expectations, fixture-backed corpus shape, and contract documentation references so Phase 1 has an executable baseline before the owned-target corpus pivot.

### Implementation

- [x] Step 1.2: **Automated** Finalize the checked-in schema fixtures and contract documentation under `packages/contracts/fixtures/`, `packages/benchmark/fixtures/`, `docs/contracts/`, and `docs/benchmarks/` so the current benchmark foundation is green and versioned.
- [x] Step 1.3: **Automated** Replace the external benchmark corpus assumptions in `packages/benchmark/src/corpus.ts`, `packages/benchmark/fixtures/corpus.v1.json`, and `docs/benchmarks/v1-corpus.md` with owned-target entries for `Altitude`, `Switchboard`, `Foundry`, and any owned support fixtures required for coverage.
- [x] Step 1.4: **Automated** Update planning and task-tracking files in `tasks/todo.md`, `tasks/manual-todo.md`, and `tasks/history.md` so obsolete third-party provisioning blockers are removed and the new owned-target benchmark strategy is reflected everywhere.

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

Step 1.5 will run the Phase 1 verification sweep against the owned-target benchmark foundation.

- Run the benchmark contract suites and fix any regressions that prevent the owned-target fixtures from passing.
- Re-verify that `docs/benchmarks/v1-corpus.md`, `tasks/todo.md`, `tasks/manual-todo.md`, and `tasks/history.md` consistently describe the owned benchmark strategy.
- Keep the scope to Phase 1 verification only; do not begin Phase 2 parity-audit artifact work in the same run.
- If the benchmark suites pass cleanly, close the Phase 1 milestone and confirm the repository stays green.
