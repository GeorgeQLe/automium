# Agent-Native Browser QA Platform Roadmap

This plan translates [the finalized core platform spec](/home/georgeqle/projects/tools/dev/automium/specs/agent-native-browser-qa-platform.md) and [the owned parity benchmark products spec](/home/georgeqle/projects/tools/dev/automium/specs/owned-parity-benchmark-products.md) into an execution-grade phased plan. The repository already contains early benchmark contract work, so Phase 1 preserves that foundation while pivoting the benchmark surface from provisioned third-party apps to owned parity products.

## Summary

- Keep the benchmark contract work already completed, but retarget the benchmark corpus to owned products.
- Build the owned benchmark targets before the browser-engine-heavy phases so the QA platform validates against durable, controlled applications.
- Sequence work as benchmark foundation reset, parity audit, shared platform, `Altitude`, `Switchboard`, `Foundry`, then browser/runtime integration.
- Treat replay/debug, deterministic execution, benchmarking, and worker isolation as core platform surfaces once owned benchmark products exist.

## Phase Overview

| Phase | Focus | Primary Deliverables | Depends On |
| --- | --- | --- | --- |
| 1 | Benchmark foundation reset | Owned-target benchmark corpus, completed contract fixtures/docs alignment, obsolete third-party blockers removed | Specs approval |
| 2 | Frozen parity audit and benchmark target design | Checked-in parity matrices, API matrices, seed/reset model, owned benchmark journey map | Phase 1 |
| 3 | Shared multi-tenant product platform | Auth, tenancy, RBAC, audit, files, search, jobs, realtime, admin shell | Phase 2 |
| 4 | `Altitude` parity product | Plane-parity project management workspace on the shared platform | Phase 3 |
| 5 | `Switchboard` parity product | Chatwoot-parity support workspace with realtime messaging and automation | Phases 3-4 |
| 6 | `Foundry` parity product | Appsmith-parity internal app builder with editor/runtime split | Phases 3-5 |
| 7 | Agent browser runtime and platform integration | Control plane, engine, semantic runtime, replay, benchmarking, and alpha on owned products | Phases 1-6 |

## Phase 1: Benchmark Foundation Reset

Goal: preserve the benchmark contract work already completed, finish the fixture and documentation layer, and formally pivot the benchmark corpus away from provisioned third-party products toward owned benchmark targets.

### Tests First

- Step 1.1: **Automated** Freeze the benchmark contract tests in `packages/benchmark/tests/` and `packages/contracts/tests/` around schema versions, KPI expectations, fixture-backed corpus shape, and contract documentation references so Phase 1 has an executable baseline before the owned-target corpus pivot.

### Implementation

- Step 1.2: **Automated** Finalize the checked-in schema fixtures and contract documentation under `packages/contracts/fixtures/`, `packages/benchmark/fixtures/`, `docs/contracts/`, and `docs/benchmarks/` so the current benchmark foundation is green and versioned.
- Step 1.3: **Automated** Replace the external benchmark corpus assumptions in `packages/benchmark/src/corpus.ts`, `packages/benchmark/fixtures/corpus.v1.json`, and `docs/benchmarks/v1-corpus.md` with owned-target entries for `Altitude`, `Switchboard`, `Foundry`, and any owned support fixtures required for coverage.
- Step 1.4: **Automated** Update planning and task-tracking files in `tasks/todo.md`, `tasks/manual-todo.md`, and `tasks/history.md` so obsolete third-party provisioning blockers are removed and the new owned-target benchmark strategy is reflected everywhere.

### Green

- Step 1.5: **Automated** Make the benchmark contract suites pass against the owned-target fixtures and verify that the docs and task files no longer describe third-party SaaS provisioning as a core benchmark dependency.

### Milestone

- [x] Phase 1 milestone completed on 2026-04-07.

Acceptance criteria:

- Benchmark contract tests in `packages/contracts/tests/` and `packages/benchmark/tests/` pass against versioned fixtures.
- `docs/benchmarks/v1-corpus.md` references owned benchmark targets rather than provisioned Appsmith, Plane, and Chatwoot instances.
- The benchmark corpus strategy is consistent with `specs/owned-parity-benchmark-products.md`.
- All Phase 1 tests pass.
- No regressions are introduced in pre-existing repository checks.

## Phase 2: Frozen Parity Audit and Benchmark Target Design

Goal: convert the parity-products spec into an implementation-grade frozen target for each owned product before building shared platform code.

### Tests First

- Step 2.1: **Automated** Write failing documentation and contract tests for parity artifacts in `docs/parity/`, `packages/benchmark/tests/owned-product-matrix.contract.test.ts`, and `tests/planning/seed-reset.plan.test.ts` covering feature matrices, API resource matrices, benchmark journeys, and deterministic reset requirements.

### Implementation

- Step 2.2: **Automated** Create the frozen feature matrices for `Altitude`, `Switchboard`, and `Foundry` in `docs/parity/altitude-feature-matrix.md`, `docs/parity/switchboard-feature-matrix.md`, and `docs/parity/foundry-feature-matrix.md`.
- Step 2.3: **Automated** Create API compatibility matrices and adapter inventories in `docs/parity/` for the major resources and integrations required by each owned product.
- Step 2.4: **Automated** Define deterministic seed/reset requirements and owned benchmark-critical journey maps in `docs/benchmarks/owned-products.md` and supporting fixture-plan files under `tests/fixtures/`.

### Green

- Step 2.5: **Automated** Make the parity-audit suites pass and verify that every owned product has a frozen, implementation-testable parity boundary with benchmark journeys and reset expectations.

### Milestone

Acceptance criteria:

- Each owned product has a checked-in frozen feature matrix.
- Each owned product has a major-resource API compatibility matrix.
- Owned benchmark journeys are defined against owned products rather than third-party apps.
- Deterministic seed/reset requirements exist for every benchmark-critical journey.
- All Phase 2 tests pass.
- No regressions occur in Phase 1 suites.

## Phase 3: Shared Multi-Tenant Product Platform

Goal: build the common application platform that all three owned products will reuse.

### Tests First

- Step 3.1: **Automated** Write failing platform tests in `packages/auth/tests/`, `packages/tenancy/tests/`, `packages/rbac/tests/`, `packages/audit/tests/`, `packages/realtime/tests/`, and `apps/admin-console/tests/` covering auth, invites, memberships, permissions, audit trails, files, jobs, search, and realtime delivery.

### Implementation

- Step 3.2: **Automated** Scaffold the shared platform packages and admin shell under `apps/admin-console/`, `packages/auth/`, `packages/tenancy/`, `packages/rbac/`, `packages/audit/`, `packages/files/`, `packages/search/`, `packages/jobs/`, `packages/realtime/`, `packages/adapters/`, `packages/ui/`, `packages/api-contracts/`, and `packages/domain-model/`.
- Step 3.3: **Automated** Implement authentication, sessions, organizations, workspaces, invites, memberships, RBAC, audit logging, file ownership, search indexing, jobs, and realtime event delivery across the shared packages.
- Step 3.4: **Automated** Build the admin shell and shared product primitives for configuration, governance, and product-level navigation.

### Green

- Step 3.5: **Automated** Make the shared platform suites pass and verify that multi-workspace tenancy, permissions, audit, files, jobs, search, and realtime behavior are stable enough to support all owned products.

### Milestone

Acceptance criteria:

- Multi-workspace tenancy works across the shared platform.
- RBAC and audit coverage exist for shared resource types and sensitive actions.
- Files, jobs, search, and realtime delivery pass platform acceptance suites.
- An admin shell exists for instance-level setup and governance.
- All Phase 3 tests pass.
- No regressions occur in Phases 1-2 suites.

## Phase 4: Altitude

Goal: deliver the first owned parity product, `Altitude`, as the Plane-parity benchmark surface and shared-product proving ground.

### Tests First

- Step 4.1: **Automated** Write failing API, domain, and UI workflow tests in `apps/altitude/tests/`, `packages/domain-model/tests/altitude/`, and `tests/integration/altitude/` for workspaces, projects, work items, views, cycles, modules, pages, analytics, attachments, notifications, and webhooks.

### Implementation

- Step 4.2: **Automated** Scaffold `apps/altitude/` plus any product-specific packages needed for project management domain logic, APIs, and UI shells.
- Step 4.3: **Automated** Implement workspaces, projects, membership, work items, views, saved views, cycles, modules, pages/wiki, attachments, activity history, notifications, and major-resource APIs for `Altitude`.
- Step 4.4: **Automated** Add deterministic seeds, reset hooks, and benchmark-friendly routes for the `Altitude` benchmark-critical journeys.

### Green

- Step 4.5: **Automated** Make the `Altitude` suites pass and verify that the owned project-management benchmark journeys run end to end against deterministic fixtures.

### Milestone

Acceptance criteria:

- The frozen `Altitude` feature matrix passes.
- Major-resource API compatibility tests pass for `Altitude`.
- Realtime collaboration works for assignments, comments, activity, and state changes.
- The QA platform can exercise the defined `Altitude` benchmark-critical journeys.
- All Phase 4 tests pass.
- No regressions occur in Phases 1-3 suites.

## Phase 5: Switchboard

Goal: deliver the second owned parity product, `Switchboard`, as the Chatwoot-parity support workspace and realtime messaging benchmark surface.

### Tests First

- Step 5.1: **Automated** Write failing API, adapter, and UI workflow tests in `apps/switchboard/tests/`, `packages/adapters/tests/switchboard/`, and `tests/integration/switchboard/` for inboxes, channels, contacts, conversations, assignments, notes, canned responses, macros, automation, and reporting.

### Implementation

- Step 5.2: **Automated** Scaffold `apps/switchboard/` and any supporting channel, messaging, and automation modules needed for the support workspace surface.
- Step 5.3: **Automated** Implement accounts, inboxes, contacts, conversations, threaded messages, teams, assignments, labels, notes, canned responses, macros, automation rules, reporting, and major-resource APIs for `Switchboard`.
- Step 5.4: **Automated** Implement production-grade support for website live chat, API channel, and email, plus adapter-backed operator flows for the remaining public channel categories.
- Step 5.5: **Automated** Add deterministic seeds, reset hooks, and benchmark-friendly routes for the `Switchboard` benchmark-critical journeys.

### Green

- Step 5.6: **Automated** Make the `Switchboard` suites pass and verify that owned conversation-routing benchmarks run end to end with realtime updates and stable fixtures.

### Milestone

Acceptance criteria:

- The frozen `Switchboard` feature matrix passes.
- Major-resource API compatibility tests pass for `Switchboard`.
- Realtime conversation, assignment, notes, and inbox-routing behavior works under shared platform constraints.
- Core channel support works end to end for website live chat, API, and email.
- All Phase 5 tests pass.
- No regressions occur in Phases 1-4 suites.

## Phase 6: Foundry

Goal: deliver the third owned parity product, `Foundry`, as the Appsmith-parity internal app builder and the most complex benchmark target.

### Tests First

- Step 6.1: **Automated** Write failing editor, runtime, datasource, and publish-flow tests in `apps/foundry/tests/`, `packages/adapters/tests/foundry/`, and `tests/integration/foundry/` for apps, pages, widgets, datasources, queries, JavaScript logic, bindings, branching, deployment, and permissions.

### Implementation

- Step 6.2: **Automated** Scaffold `apps/foundry/` and any supporting packages for widgets, datasources, query execution, builder state, and publish/runtime flows.
- Step 6.3: **Automated** Implement organizations or workspaces, applications, pages, editor/runtime split, visual canvas, widget system, datasources, queries, JavaScript logic units, bindings, themes, environments, permissions, and major-resource APIs for `Foundry`.
- Step 6.4: **Automated** Implement versioning, branching, deployment, publish/share flows, custom-widget hooks, and production-grade datasource support for Postgres-compatible SQL, MySQL-compatible SQL, and REST APIs.
- Step 6.5: **Automated** Add deterministic seeds, reset hooks, and benchmark-friendly routes for the `Foundry` builder and runtime benchmark-critical journeys.

### Green

- Step 6.6: **Automated** Make the `Foundry` suites pass and verify that builder, publish, and runtime journeys run end to end against deterministic fixtures.

### Milestone

Acceptance criteria:

- The frozen `Foundry` feature matrix passes.
- Major-resource API compatibility tests pass for `Foundry`.
- Builder/runtime workflows, publish flows, and branch-aware collaboration behave consistently under shared platform constraints.
- Core datasource and widget workflows work end to end against deterministic fixtures.
- All Phase 6 tests pass.
- No regressions occur in Phases 1-5 suites.

## Phase 7: Agent Browser Runtime and Platform Integration

Goal: complete the original QA platform vision against owned products instead of third-party benchmark dependencies.

### Tests First

- Step 7.1: **Automated** Write failing control-plane, engine, runtime, replay, worker, benchmark-runner, and alpha tests in `apps/control-plane/tests/`, `apps/replay-console/tests/`, `packages/engine/tests/`, `packages/runtime/tests/`, `packages/executor/tests/`, `packages/artifacts/tests/`, `packages/orchestrator/tests/`, and `tests/e2e/alpha/` against the owned product corpus.

### Implementation

- Step 7.2: **Automated** Scaffold the control plane, replay console, planner-adapter, engine, runtime, executor, assertions, event-stream, artifacts, context-manager, vision, orchestrator, worker, policies, journey-compiler, and benchmark-runner packages and apps needed for the integrated QA platform.
- Step 7.3: **Automated** Implement the control plane, shared execution domain model, planner abstraction, and benchmark-run submission flows aligned to the owned benchmark targets.
- Step 7.4: **Automated** Implement the browser engine kernel, semantic runtime, deterministic executor, assertions, and bounded recovery for the supported QA web subset exercised primarily against `Altitude`, `Switchboard`, `Foundry`, and any owned support fixtures.
- Step 7.5: **Automated** Implement replay event streams, artifact packaging, replay/debug console surfaces, targeted vision fallback, and context budgeting across owned-product runs.
- Step 7.6: **Automated** Implement worker isolation, queueing, telemetry, quotas, policy enforcement, natural-language authoring, cross-model benchmark reporting, and alpha hardening for owned-product execution.

### Green

- Step 7.7: **Automated** Make the integrated platform suites pass and verify that the QA platform can compile, execute, replay, and benchmark journeys across all owned products without relying on third-party benchmark apps.

### Milestone

Acceptance criteria:

- The QA platform can compile and execute benchmark journeys against all owned products.
- Replay and artifact surfaces explain planner intent, executor action, state changes, retries, and verdicts for owned-product runs.
- Worker isolation and policy controls hold under concurrent benchmark execution.
- Cross-model benchmarking works against the owned product corpus with repeatability, latency, recovery, and spend reporting.
- All Phase 7 tests pass.
- No regressions occur in Phases 1-6 suites.

## Cross-Phase Concerns

- Keep contract versioning strict across benchmark, product, domain, replay, and artifact schemas.
- Preserve deterministic seed and reset hooks for every owned benchmark journey as product complexity grows.
- Enforce legal, branding, and naming boundaries so owned parity products remain distinct from the upstream products they reference internally.
- Treat shared platform quality as a force multiplier: shortcuts in tenancy, audit, realtime, or permissions will multiply across all three products.
- Maintain an integration ladder: contract tests first, subsystem tests second, owned-product integration suites third, and full alpha smoke tests last.
