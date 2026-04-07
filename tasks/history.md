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
- Refreshed the Step 1.5 handoff plan in `tasks/todo.md` so the next run can execute the Phase 1 verification sweep with the command, likely file touch points, and acceptance target already captured.
- Completed Step 1.5 by re-running `pnpm test:run -- packages/contracts/tests packages/benchmark/tests`, confirming 4 passing files / 10 passing tests against the owned-target fixtures, and verifying that the benchmark docs and task files no longer treat third-party SaaS provisioning as a core dependency.
- Archived the completed Phase 1 execution files under `tasks/phases/`, marked the Phase 1 milestone complete in `tasks/roadmap.md`, and regenerated `tasks/todo.md` around the Phase 2 Step 2.1 red-phase parity-audit tests.
- Expanded the Vitest and TypeScript config to include `tests/**/*.test.ts`, then added the Phase 2 contract suites for owned parity artifacts and seed/reset planning under `packages/benchmark/tests/owned-product-matrix.contract.test.ts` and `tests/planning/seed-reset.plan.test.ts`.
- Froze the Phase 2 owned-product parity boundary in `docs/parity/` with feature matrices and API compatibility matrices for `Altitude`, `Switchboard`, and `Foundry`.
- Added `docs/benchmarks/owned-products.md` plus deterministic seed/reset planning artifacts under `tests/fixtures/` for the owned benchmark-critical journeys across `Altitude`, `Switchboard`, and `Foundry`.
- Re-ran `pnpm test:run` after the Phase 2 artifact freeze and confirmed 6 passing files / 20 passing tests with no regressions in the existing contract suites.
- Completed Step 2.5 by re-running `pnpm test:run`, confirming that the Phase 2 parity-audit suites and prior benchmark-contract suites remain green at 6 passing files / 20 passing tests.
- Archived the completed Phase 2 execution file under `tasks/phases/phase-2.md`, marked the Phase 2 milestone complete in `tasks/roadmap.md`, and regenerated `tasks/todo.md` around the Phase 3 Step 3.1 shared-platform red-phase tests.
