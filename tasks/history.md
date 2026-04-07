# History

## 2026-04-07

- Converted the outline roadmap into an execution-grade phased plan in `tasks/roadmap.md`.
- Extracted Phase 1 into `tasks/todo.md` and split human-only dependencies into `tasks/manual-todo.md`.
- Prepared the repository for first-time shipping by capturing current phase status and handoff context.
- Bootstrapped a minimal pnpm/Vitest workspace for executable red-phase tests and added the initial Phase 1 contract suites under `packages/contracts/tests/` and `packages/benchmark/tests/`.
- Marked Step 1.1 complete in `tasks/todo.md`; the new suites intentionally fail until the Phase 1 contract modules and KPI harness are implemented.
- Created the initial Phase 1 workspace skeleton under `packages/contracts/`, `packages/benchmark/`, `docs/contracts/`, `docs/benchmarks/`, and `tests/fixtures/`.
- Added placeholder contract and KPI source modules so the red suites fail on contract assertions instead of missing imports or paths.
- Marked Step 1.2 complete in `tasks/todo.md` and advanced the next automated step to Step 1.3 under the original external-benchmark plan before the owned-target pivot retired that environment-selection blocker.
- Frozen the Phase 1 v1 contracts for semantic snapshots, replay events, planner adapters, benchmark verdicts, and KPI aggregation in `packages/contracts/src/` and `packages/benchmark/src/`.
- Captured the approved provisional benchmark corpus for Appsmith, Plane, Chatwoot, and an owned iframe fixture app, and marked Step 1.3 complete in `tasks/todo.md`.
- Added versioned schema fixtures and contract documentation for the Phase 1 benchmark foundation while the plan still assumed one final external-environment provisioning dependency before the later owned-target reset removed it.
- Added the owned parity benchmark products spec and interview log, defining `Altitude`, `Switchboard`, and `Foundry` as owned replacements for third-party benchmark dependencies.
- Rewrote `tasks/roadmap.md` to pivot from external-benchmark-first sequencing to an owned-products-first roadmap: benchmark foundation reset, parity audit, shared platform, owned products, then browser/runtime integration.
- Expanded the owned-products-first roadmap into execution-ready phase steps and regenerated `tasks/todo.md` and `tasks/manual-todo.md` around the new Phase 1 benchmark reset.
- Retargeted the frozen benchmark corpus, KPI sample inputs, and supporting contract fixtures from Appsmith, Plane, and Chatwoot to the owned benchmark targets `Foundry`, `Altitude`, and `Switchboard`, while preserving the owned iframe support fixture for coverage.
- Cleared the obsolete Phase 1 provisioning narrative from `tasks/todo.md`, `tasks/manual-todo.md`, and `tasks/history.md`, confirming that no manual blockers remain before the owned-target verification sweep in Step 1.5.
- Re-ran the benchmark contract suites after the planning-file cleanup to confirm the owned-target fixtures and task docs still align.
