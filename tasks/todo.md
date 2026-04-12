# Current Phase: Foundry

This file tracks the active work for Phase 6 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Prior phases are archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- Phase 4 Altitude parity product is complete and archived in [tasks/phases/phase-4.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-4.md).
- Phase 5 Switchboard parity product is complete and archived in [tasks/phases/phase-5.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-5.md).
- The repository is green at 33 passing files / 132 passing tests after Phase 5.
- Next automated step: Step 6.1.
- Known manual blockers: none for Phase 6.

## Phase 6: Foundry

Goal: deliver the third owned parity product, `Foundry`, as the Appsmith-parity internal app builder and the most complex benchmark target.

> Test strategy: tdd

### Tests First

- [ ] Step 6.1: **Automated** Write failing editor, runtime, datasource, and publish-flow tests in `apps/foundry/tests/`, `packages/adapters/tests/foundry/`, and `tests/integration/foundry/` for apps, pages, widgets, datasources, queries, JavaScript logic, bindings, branching, deployment, and permissions.
  - Files: create `apps/foundry/tests/foundry-domain.contract.test.ts`, `apps/foundry/tests/foundry-api.contract.test.ts`, `apps/foundry/tests/foundry-builder.contract.test.ts`, `apps/foundry/tests/foundry-runtime.contract.test.ts`, `apps/foundry/tests/foundry-datasources.contract.test.ts`, `apps/foundry/tests/foundry-collaboration.contract.test.ts`, `tests/integration/foundry/foundry-benchmark-journeys.contract.test.ts`
  - Tests cover: workspace/application/page/widget/datasource/query/JavaScript object/binding/theme/environment/branch/deployment/permission domain shapes, API route manifest completeness, drag-and-drop canvas and widget layout contracts, editor/runtime split, datasource adapters for Postgres-compatible SQL, MySQL-compatible SQL, and REST APIs, query execution and bindings, custom widget registration, branch/version collaboration, publish/share/runtime metadata, deterministic seed/reset hooks, and benchmark route definitions.
  - Expected red state: new Foundry suites fail on missing Phase 6 implementation modules while the existing Phase 1-5 baseline remains green.

### Implementation

- [ ] Step 6.2: **Automated** Scaffold `apps/foundry/` with frozen constants, the product domain model, package metadata, and barrel exports following the shared-platform and owned-product package pattern.
  - Files: create `apps/foundry/package.json`, `apps/foundry/tsconfig.json`, `apps/foundry/src/foundry-constants.ts`, `apps/foundry/src/foundry-domain.ts`, `apps/foundry/src/index.ts`
  - Constants include: workspace roles, application states, page types, widget families, datasource types, query runtimes, binding scopes, branch statuses, deployment statuses, permission actions, realtime topics, and benchmark route categories.
  - Domain interfaces include: Workspace, FoundryUser, Application, Page, Widget, WidgetBinding, Datasource, Query, JavaScriptObject, Theme, Environment, Branch, Deployment, PermissionGrant, CustomWidgetPackage, FoundryRealtimeEvent, FoundryApiRoute, FoundryBenchmarkRoute.
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

Step 6.1 is the Phase 6 red phase. It should create contract tests first, then run them to confirm they fail only because the Foundry implementation modules do not exist yet.

- Commands to run:
  - `pnpm exec vitest run apps/foundry/tests/foundry-domain.contract.test.ts apps/foundry/tests/foundry-api.contract.test.ts apps/foundry/tests/foundry-builder.contract.test.ts apps/foundry/tests/foundry-runtime.contract.test.ts apps/foundry/tests/foundry-datasources.contract.test.ts apps/foundry/tests/foundry-collaboration.contract.test.ts tests/integration/foundry/foundry-benchmark-journeys.contract.test.ts`
  - `pnpm exec vitest run packages apps/admin-console apps/altitude apps/switchboard tests/integration/altitude tests/integration/switchboard tests/planning`
- Files to create:
  - `apps/foundry/tests/foundry-domain.contract.test.ts`
  - `apps/foundry/tests/foundry-api.contract.test.ts`
  - `apps/foundry/tests/foundry-builder.contract.test.ts`
  - `apps/foundry/tests/foundry-runtime.contract.test.ts`
  - `apps/foundry/tests/foundry-datasources.contract.test.ts`
  - `apps/foundry/tests/foundry-collaboration.contract.test.ts`
  - `tests/integration/foundry/foundry-benchmark-journeys.contract.test.ts`
- Implementation expectations:
  - Follow the red-phase pattern from Altitude Step 4.1 and Switchboard Step 5.1: test imports should clearly name the expected future modules and throw helpful missing-module errors.
  - Keep tests grounded in `docs/parity/foundry-feature-matrix.md`, `docs/parity/foundry-api-matrix.md`, `tests/fixtures/foundry-seed-reset-plan.md`, and `docs/benchmarks/owned-products.md`.
  - Do not create implementation modules in Step 6.1.
  - Mark Step 6.1 complete only after the new Foundry suites fail for expected missing-module reasons and the existing Phase 1-5 baseline remains green.
