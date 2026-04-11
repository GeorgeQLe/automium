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
- Added the Phase 3 shared-platform contract suites under `packages/auth/tests/`, `packages/tenancy/tests/`, `packages/rbac/tests/`, `packages/audit/tests/`, `packages/realtime/tests/`, and `apps/admin-console/tests/`, and expanded the Vitest/TypeScript config so the new app-level tests are included in the workspace.
- Completed Step 3.2 by scaffolding the shared platform packages plus `apps/admin-console/` with thin contract-shaped module exports for auth, tenancy, RBAC, audit, realtime, files, jobs, search, adapters, UI, API contracts, and domain-model boundaries.
- Re-ran `pnpm test:run` after the scaffold landed and confirmed the repository is green at 12 passing files / 32 passing tests, eliminating the prior missing-module failures from the Phase 3 suites.

## 2026-04-10

- Completed Step 3.3 by implementing 13 behavior modules across all shared platform packages: auth (sessions, invites, state machines), tenancy (organizations, workspaces, memberships, role precedence), RBAC (permission matrix, check function), audit (event factory, 7 action-specific builders), realtime (delivery orchestration, sequence tracker), files (ownership, transfers), search (indexing requests/entries), jobs (lifecycle state machine), adapters (6 typed adapter interfaces, registry), UI (framework-agnostic config builders), domain-model (resource refs, events, ownership scope registry), API contracts (9 seed route manifests, contract registry), and admin-console governance (shell state, section configs, capability mapping).
- All behavior modules use pure functions, deterministic factory IDs, types derived from frozen `as const` constants, and no cross-package imports.
- Updated 13 `src/index.ts` barrels with additive re-exports. No frozen `platform-*.ts` files were modified.
- Confirmed `pnpm test:run` remains green at 12 passing files / 32 passing tests.
- Completed Step 3.4 by adding the admin shell configuration layer and product-level navigation primitives: `admin-shell.ts` (AdminShellConfig composing governance + product nav, ProductContext/ProductRegistration/ProductNavigationConfig, REGISTERED_PRODUCTS seed for Altitude/Switchboard/Foundry, builders and validation), `admin-api-routes.ts` (3 governance mutation routes + 2 product nav routes, AdminRouteManifest merging seed + extended routes), breadcrumb navigation primitives in `packages/ui/src/ui-behavior.ts` (BreadcrumbConfig/BreadcrumbSegment + buildBreadcrumbConfig), and barrel updates in `apps/admin-console/src/index.ts`.
- All new modules follow the Step 3.3 pattern: types from constants, pure functions, no cross-package imports, deterministic params.
- Confirmed `pnpm test:run` remains green at 12 passing files / 32 passing tests.
