# Current Phase: Foundry

This file tracks the active work for Phase 6 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Prior phases are archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- Phase 4 Altitude parity product is complete and archived in [tasks/phases/phase-4.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-4.md).
- Phase 5 Switchboard parity product is complete and archived in [tasks/phases/phase-5.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-5.md).
- The Phase 1-5 baseline remains green at 33 passing files / 132 passing tests.
- The Step 6.2 Foundry domain/constants suite is green at 1 passing file / 5 passing tests.
- The remaining Phase 6 Foundry suites are intentionally failing at 6 files / 32 tests on missing future implementation modules.
- Next automated step: Step 6.3.
- Known manual blockers: none for Phase 6.

## Phase 6: Foundry

Goal: deliver the third owned parity product, `Foundry`, as the Appsmith-parity internal app builder and the most complex benchmark target.

> Test strategy: tdd

### Tests First

- [x] Step 6.1: **Automated** Write failing editor, runtime, datasource, and publish-flow tests in `apps/foundry/tests/`, `packages/adapters/tests/foundry/`, and `tests/integration/foundry/` for apps, pages, widgets, datasources, queries, JavaScript logic, bindings, branching, deployment, and permissions.
  - Files: create `apps/foundry/tests/foundry-domain.contract.test.ts`, `apps/foundry/tests/foundry-api.contract.test.ts`, `apps/foundry/tests/foundry-builder.contract.test.ts`, `apps/foundry/tests/foundry-runtime.contract.test.ts`, `apps/foundry/tests/foundry-datasources.contract.test.ts`, `apps/foundry/tests/foundry-collaboration.contract.test.ts`, `tests/integration/foundry/foundry-benchmark-journeys.contract.test.ts`
  - Tests cover: workspace/application/page/widget/datasource/query/JavaScript object/binding/theme/environment/branch/deployment/permission domain shapes, API route manifest completeness, drag-and-drop canvas and widget layout contracts, editor/runtime split, datasource adapters for Postgres-compatible SQL, MySQL-compatible SQL, and REST APIs, query execution and bindings, custom widget registration, branch/version collaboration, publish/share/runtime metadata, deterministic seed/reset hooks, and benchmark route definitions.
  - Expected red state: new Foundry suites fail on missing Phase 6 implementation modules while the existing Phase 1-5 baseline remains green.

### Implementation

- [x] Step 6.2: **Automated** Scaffold `apps/foundry/` with frozen constants, the product domain model, package metadata, and barrel exports following the shared-platform and owned-product package pattern.
  - Files: create `apps/foundry/package.json`, `apps/foundry/tsconfig.json`, `apps/foundry/src/foundry-constants.ts`, `apps/foundry/src/foundry-domain.ts`, `apps/foundry/src/index.ts`
  - Constants include: workspace roles, application states, page types, widget families, datasource types, query runtimes, binding scopes, branch statuses, deployment statuses, permission actions, realtime topics, and benchmark route categories.
  - Domain interfaces include: Workspace, FoundryUser, Application, Page, Widget, WidgetBinding, Datasource, Query, JavaScriptObject, Theme, Environment, Branch, Deployment, PermissionGrant, CustomWidgetPackage, FoundryRealtimeEvent, FoundryApiRoute, FoundryBenchmarkRoute.
  - Validation: `pnpm exec vitest run apps/foundry/tests/foundry-domain.contract.test.ts` passes at 1 file / 5 tests; focused TypeScript check for the new `apps/foundry/src/*.ts` files passes; future Foundry suites remain red only on modules planned for Steps 6.3-6.5; Phase 1-5 baseline remains green at 33 files / 132 tests.
- [ ] Step 6.3: **Automated** Implement organizations or workspaces, applications, pages, editor/runtime split, visual canvas, widget system, datasources, queries, JavaScript logic units, bindings, themes, environments, permissions, and major-resource APIs for `Foundry`.
  - Files: create `apps/foundry/src/foundry-workspaces.ts`, `apps/foundry/src/foundry-users.ts`, `apps/foundry/src/foundry-applications.ts`, `apps/foundry/src/foundry-pages.ts`, `apps/foundry/src/foundry-widgets.ts`, `apps/foundry/src/foundry-canvas.ts`, `apps/foundry/src/foundry-datasources.ts`, `apps/foundry/src/foundry-queries.ts`, `apps/foundry/src/foundry-javascript.ts`, `apps/foundry/src/foundry-bindings.ts`, `apps/foundry/src/foundry-themes.ts`, `apps/foundry/src/foundry-environments.ts`, `apps/foundry/src/foundry-permissions.ts`, `apps/foundry/src/foundry-api-routes.ts`, `apps/foundry/src/foundry-realtime.ts`
  - Files: modify `apps/foundry/src/index.ts` to re-export all modules.
- [ ] Step 6.4: **Automated** Implement versioning, branching, deployment, publish/share flows, custom-widget hooks, and production-grade datasource support for Postgres-compatible SQL, MySQL-compatible SQL, and REST APIs.
  - Files: create `apps/foundry/src/foundry-branches.ts`, `apps/foundry/src/foundry-deployments.ts`, `apps/foundry/src/foundry-publishing.ts`, `apps/foundry/src/foundry-runtime.ts`, `apps/foundry/src/foundry-custom-widgets.ts`, `apps/foundry/src/foundry-datasource-adapters.ts`
  - Adapter contracts cover schema introspection, parameterized query execution, REST request configuration, auth metadata, result normalization, custom widget packaging, and runtime loading metadata.
  - Files: modify `apps/foundry/src/index.ts` to re-export branch, deployment, runtime, custom-widget, and adapter modules.
- [ ] Step 6.5: **Automated** Add deterministic seeds, reset hooks, and benchmark-friendly routes for the `Foundry` builder and runtime benchmark-critical journeys.
  - Files: create `apps/foundry/src/foundry-seed.ts`, `apps/foundry/src/foundry-benchmark-routes.ts`
  - Seed covers one workspace, deterministic editors/viewers/runtime consumers, starter app shell, page graph, datasource credentials, mock endpoint metadata, schema metadata, query templates, action permissions, sample bindings, layout regions, widget defaults, CRUD table/form fixtures, JavaScript object templates, event handlers, custom widget package/registry entry, branch metadata, deployment metadata, and a published runtime snapshot.
  - Routes cover builder home, datasource configuration, query editor, page builder, CRUD workspace, logic editor, custom widget management, branch/publish, and published runtime URLs.
  - Files: modify `apps/foundry/src/index.ts` to re-export seed and route modules.

### Green

- [ ] Step 6.6: **Automated** Make the `Foundry` suites pass and verify that builder, publish, and runtime journeys run end to end against deterministic fixtures.

### Milestone

Acceptance criteria:

- The frozen `Foundry` feature matrix passes.
- Major-resource API compatibility tests pass for `Foundry`.
- Builder/runtime workflows, publish flows, and branch-aware collaboration behave consistently under shared platform constraints.
- Core datasource and widget workflows work end to end against deterministic fixtures.
- All Phase 6 tests pass.
- No regressions occur in Phases 1-5 suites.

## Next Step Plan

Step 6.3 implements the Foundry builder/editor resource layer and major-resource APIs on top of the Step 6.2 domain scaffolding.

- Commands to run:
  - `pnpm exec vitest run apps/foundry/tests/foundry-domain.contract.test.ts`
  - `pnpm exec vitest run apps/foundry/tests/foundry-builder.contract.test.ts apps/foundry/tests/foundry-datasources.contract.test.ts apps/foundry/tests/foundry-collaboration.contract.test.ts`
  - `pnpm exec vitest run apps/foundry/tests/foundry-api.contract.test.ts apps/foundry/tests/foundry-builder.contract.test.ts apps/foundry/tests/foundry-runtime.contract.test.ts apps/foundry/tests/foundry-datasources.contract.test.ts apps/foundry/tests/foundry-collaboration.contract.test.ts tests/integration/foundry/foundry-benchmark-journeys.contract.test.ts`
  - `pnpm exec vitest run packages apps/admin-console apps/altitude apps/switchboard tests/integration/altitude tests/integration/switchboard tests/planning`
- Files to create:
  - `apps/foundry/src/foundry-workspaces.ts`
  - `apps/foundry/src/foundry-users.ts`
  - `apps/foundry/src/foundry-applications.ts`
  - `apps/foundry/src/foundry-pages.ts`
  - `apps/foundry/src/foundry-widgets.ts`
  - `apps/foundry/src/foundry-canvas.ts`
  - `apps/foundry/src/foundry-datasources.ts`
  - `apps/foundry/src/foundry-queries.ts`
  - `apps/foundry/src/foundry-javascript.ts`
  - `apps/foundry/src/foundry-bindings.ts`
  - `apps/foundry/src/foundry-themes.ts`
  - `apps/foundry/src/foundry-environments.ts`
  - `apps/foundry/src/foundry-permissions.ts`
  - `apps/foundry/src/foundry-api-routes.ts`
  - `apps/foundry/src/foundry-realtime.ts`
- Files to modify:
  - `apps/foundry/src/index.ts`
- Implementation expectations:
  - Follow the pure-function module pattern used by `apps/altitude/src/` and `apps/switchboard/src/`: import types from `foundry-domain.ts` and constants from `foundry-constants.ts`, return new immutable-ish objects, and keep generated IDs/timestamps deterministic enough for contract assertions.
  - Resource modules should re-export or wrap the Step 6.2 domain factories where that keeps behavior consistent: workspaces/users/applications/pages/widgets/datasources/queries/themes/environments.
  - `foundry-api-routes.ts` should define `FOUNDRY_API_ROUTES` with 13 resources: workspaces, applications, pages, widgets, datasources, queries, javascript-objects, bindings, branches, deployments, permissions, publish-metadata, and custom-widgets. Include auth, seedability, methods, and actions required by `foundry-api.contract.test.ts`.
  - `foundry-canvas.ts` should support canvas creation, widget placement, resize updates, regions, z-index ordering, and layout-stable widget positions.
  - `foundry-widgets.ts`, `foundry-bindings.ts`, and `foundry-javascript.ts` should satisfy the builder tests for standard widget library metadata, widget instances, binding evaluation against simple dotted expressions, and JavaScript action invocation metadata.
  - `foundry-datasources.ts` and `foundry-queries.ts` should satisfy datasource factory and query binding tests, while `foundry-datasource-adapters.ts` remains for Step 6.4.
  - `foundry-permissions.ts` and `foundry-realtime.ts` should satisfy the permission policy and realtime collaboration tests, while branch lifecycle helpers remain for Step 6.4.
  - Expected result: domain and API suites pass; builder, datasource, and collaboration suites have only the expected Step 6.4 missing-module failures (`foundry-custom-widgets.ts`, `foundry-datasource-adapters.ts`, `foundry-branches.ts`); runtime and benchmark suites remain red until Steps 6.4-6.5; Phase 1-5 baseline remains green.
