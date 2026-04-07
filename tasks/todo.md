# Current Phase: Benchmark Contracts and Repo Skeleton

This file tracks the active work for Phase 1 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Manual blockers and follow-up approvals are tracked in [tasks/manual-todo.md](/home/georgeqle/projects/tools/dev/automium/tasks/manual-todo.md).

## Current Status

- Phase planning is complete; [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md) is now the source of truth for the full build sequence.
- Next automated step: Step 1.4.
- Known manual blockers: Step 1.4 depends on provisioned benchmark accounts and fixtures.

## Phase 1: Benchmark Contracts and Repo Skeleton

Goal: freeze the contracts and benchmark definitions that every later phase will implement, while establishing the initial workspace layout.

### Tests First

- [x] Step 1.1: **Automated** Write failing contract tests in `packages/contracts/tests/semantic-snapshot.contract.test.ts`, `packages/contracts/tests/replay-event.contract.test.ts`, `packages/contracts/tests/planner-adapter.contract.test.ts`, and `packages/benchmark/tests/kpi-harness.test.ts` covering required fields, schema versioning, event ordering, KPI aggregation, and planner intent vocabulary.

### Implementation

- [x] Step 1.2: **Automated** Create the initial workspace structure under `packages/contracts/`, `packages/benchmark/`, `docs/contracts/`, `docs/benchmarks/`, and `tests/fixtures/` so the project has stable homes for contracts, corpus manifests, and golden fixtures.
- [x] Step 1.3: **Automated** Define the v1 benchmark corpus, fixture manifest, verdict taxonomy, KPI formulas, and planner adapter interface in `packages/benchmark/src/corpus.ts`, `packages/benchmark/src/kpis.ts`, `packages/contracts/src/semantic-snapshot.ts`, `packages/contracts/src/replay-event.ts`, and `packages/contracts/src/planner-adapter.ts`.

### Green

- [ ] Step 1.4: **Automated** Add golden schema fixtures under `packages/contracts/fixtures/` and `packages/benchmark/fixtures/`, make the new contract suites pass, and align the contract documentation in `docs/contracts/` and `docs/benchmarks/v1-corpus.md` with the frozen interfaces.

### Milestone

Acceptance criteria:

- Contract tests in `packages/contracts/tests/` and `packages/benchmark/tests/` pass against versioned fixtures.
- `docs/benchmarks/v1-corpus.md` maps each benchmark journey to an authorized site profile, fixture set, and expected verdict semantics.
- The semantic snapshot, replay event, and planner adapter contracts are versioned and referenced by path from the benchmark docs.
- All Phase 1 tests pass.
- No regressions are introduced in pre-existing repository checks.
