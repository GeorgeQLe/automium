# History

## 2026-04-07

- Converted the outline roadmap into an execution-grade phased plan in `tasks/roadmap.md`.
- Extracted Phase 1 into `tasks/todo.md` and split human-only dependencies into `tasks/manual-todo.md`.
- Prepared the repository for first-time shipping by capturing current phase status and handoff context.
- Bootstrapped a minimal pnpm/Vitest workspace for executable red-phase tests and added the initial Phase 1 contract suites under `packages/contracts/tests/` and `packages/benchmark/tests/`.
- Marked Step 1.1 complete in `tasks/todo.md`; the new suites intentionally fail until the Phase 1 contract modules and KPI harness are implemented.
- Created the initial Phase 1 workspace skeleton under `packages/contracts/`, `packages/benchmark/`, `docs/contracts/`, `docs/benchmarks/`, and `tests/fixtures/`.
- Added placeholder contract and KPI source modules so the red suites fail on contract assertions instead of missing imports or paths.
- Marked Step 1.2 complete in `tasks/todo.md` and advanced the next automated step to Step 1.3, which remains blocked on selecting the initial authorized benchmark apps and environments.
- Frozen the Phase 1 v1 contracts for semantic snapshots, replay events, planner adapters, benchmark verdicts, and KPI aggregation in `packages/contracts/src/` and `packages/benchmark/src/`.
- Captured the approved provisional benchmark corpus for Appsmith, Plane, Chatwoot, and an owned iframe fixture app, and marked Step 1.3 complete in `tasks/todo.md`.
