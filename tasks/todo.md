# Current Phase: Agent Browser Runtime and Platform Integration

This file tracks the active work for Phase 7 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Prior phases are archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- Phase 4 Altitude parity product is complete and archived in [tasks/phases/phase-4.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-4.md).
- Phase 5 Switchboard parity product is complete and archived in [tasks/phases/phase-5.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-5.md).
- Phase 6 Foundry parity product is complete and archived in [tasks/phases/phase-6.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-6.md).
- Step 7.3 is complete: control-plane journey validation/compilation, natural-language journey compilation, owned-domain policy checks, run submission modeling, and benchmark comparison reports now pass their focused suites.
- The Phase 7 suite now runs 11 files / 23 tests with 9 passing tests and 14 expected failures isolated to later Step 7.4, 7.5, and 7.6 placeholders.
- The Phase 1-6 baseline remains green: `pnpm exec vitest run packages/contracts/tests packages/benchmark/tests packages/realtime/tests packages/jobs/tests packages/auth/tests packages/tenancy/tests packages/rbac/tests packages/search/tests packages/files/tests packages/audit/tests apps/admin-console/tests apps/altitude/tests apps/switchboard/tests apps/foundry/tests tests/integration/altitude tests/integration/switchboard tests/integration/foundry tests/planning` passes at 40 files / 169 tests.
- Workspace TypeScript passes with `pnpm exec tsc --noEmit`.
- Next automated step: Step 7.4.
- Known manual blockers: none for Phase 7.

## Phase 7: Agent Browser Runtime and Platform Integration

Goal: complete the original QA platform vision against owned products instead of third-party benchmark dependencies.

> Test strategy: tdd

### Tests First

- [x] Step 7.1: **Automated** Write failing control-plane, engine, runtime, replay, worker, benchmark-runner, and alpha tests in `apps/control-plane/tests/`, `apps/replay-console/tests/`, `packages/engine/tests/`, `packages/runtime/tests/`, `packages/executor/tests/`, `packages/artifacts/tests/`, `packages/orchestrator/tests/`, and `tests/e2e/alpha/` against the owned product corpus.
  - Files: create `apps/control-plane/tests/control-plane.contract.test.ts`, `apps/replay-console/tests/replay-console.contract.test.ts`, `packages/engine/tests/engine-runtime.contract.test.ts`, `packages/runtime/tests/semantic-runtime.contract.test.ts`, `packages/executor/tests/deterministic-executor.contract.test.ts`, `packages/artifacts/tests/artifacts.contract.test.ts`, `packages/orchestrator/tests/orchestrator.contract.test.ts`, `packages/journey-compiler/tests/journey-compiler.contract.test.ts`, `packages/vision/tests/targeted-vision.contract.test.ts`, `packages/policies/tests/policies.contract.test.ts`, `tests/e2e/alpha/owned-products-alpha.contract.test.ts`
  - Tests cover: journey authoring and compile contracts, job submission/status/artifact route manifests, engine document/session/frame/storage/network/semantic graph contracts, semantic snapshot generation and compaction, supported planner intent vocabulary, deterministic executor action compilation, assertion and recovery policy behavior, replay event stream and artifact bundle manifests, worker isolation/queueing/telemetry/quotas, targeted vision trigger and crop metadata, domain allowlist and authorized-use policies, benchmark runner comparison metrics, and alpha journeys across `Altitude`, `Switchboard`, and `Foundry`.
  - Expected red state: new Phase 7 suites fail on missing integrated-platform modules while the existing Phase 1-6 baseline remains green.

### Implementation

- [x] Step 7.2: **Automated** Scaffold the control plane, replay console, planner-adapter, engine, runtime, executor, assertions, event-stream, artifacts, context-manager, vision, orchestrator, worker, policies, journey-compiler, and benchmark-runner packages and apps needed for the integrated QA platform.
  - Files: create `apps/control-plane/package.json`, `apps/control-plane/tsconfig.json`, `apps/control-plane/src/index.ts`, `apps/replay-console/package.json`, `apps/replay-console/tsconfig.json`, `apps/replay-console/src/index.ts`
  - Files: create package metadata, `tsconfig.json`, source barrels, constants, and domain modules under `packages/engine/`, `packages/runtime/`, `packages/executor/`, `packages/assertions/`, `packages/event-stream/`, `packages/artifacts/`, `packages/context-manager/`, `packages/vision/`, `packages/orchestrator/`, `packages/worker/`, `packages/policies/`, `packages/journey-compiler/`, `packages/benchmark-runner/`, and any planner-adapter extensions needed under `packages/contracts/` or a dedicated `packages/planner-adapter/`.
  - Scaffold contracts should compile cleanly while leaving Step 7.3-7.6 behavior tests intentionally red until their modules are implemented.
- [x] Step 7.3: **Automated** Implement the control plane, shared execution domain model, planner abstraction, and benchmark-run submission flows aligned to the owned benchmark targets.
  - Files likely to change: `apps/control-plane/src/*`, `packages/journey-compiler/src/*`, `packages/orchestrator/src/*`, `packages/benchmark-runner/src/*`, `packages/policies/src/*`, `packages/contracts/src/*`
  - Behavior includes: journey definitions, compiled journey graphs, assertions, recovery rules, fixture/environment references, planner backend metadata, run submission, run status, artifact manifest references, owned-product corpus targeting, and cross-model benchmark request modeling.
- [ ] Step 7.4: **Automated** Implement the browser engine kernel, semantic runtime, deterministic executor, assertions, and bounded recovery for the supported QA web subset exercised primarily against `Altitude`, `Switchboard`, `Foundry`, and any owned support fixtures.
  - Files likely to change: `packages/engine/src/*`, `packages/runtime/src/*`, `packages/executor/src/*`, `packages/assertions/src/*`, `packages/policies/src/*`
  - Behavior includes: document/session/frame/storage/network models, stable interactive element identity, semantic graph generation, actionability scoring, semantic snapshot truncation, supported planner-intent compilation, assertion evaluation, bounded retry/recovery, and unsupported-feature fail-fast outcomes.
- [ ] Step 7.5: **Automated** Implement replay event streams, artifact packaging, replay/debug console surfaces, targeted vision fallback, and context budgeting across owned-product runs.
  - Files likely to change: `apps/replay-console/src/*`, `packages/event-stream/src/*`, `packages/artifacts/src/*`, `packages/vision/src/*`, `packages/context-manager/src/*`, `packages/runtime/src/*`
  - Behavior includes: replay event ordering, semantic snapshot references, targeted crop metadata, network/console/download artifact references, mutation and assertion traces, run summaries, context layers, token/crop caps, and replay-console timeline data.
- [ ] Step 7.6: **Automated** Implement worker isolation, queueing, telemetry, quotas, policy enforcement, natural-language authoring, cross-model benchmark reporting, and alpha hardening for owned-product execution.
  - Files likely to change: `packages/worker/src/*`, `packages/orchestrator/src/*`, `packages/benchmark-runner/src/*`, `packages/journey-compiler/src/*`, `packages/policies/src/*`, `apps/control-plane/src/*`, `tests/e2e/alpha/*`
  - Behavior includes: isolated worker leases, queue priority and concurrency limits, tenant quotas, telemetry summaries, domain allowlists, artifact retention policy, natural-language journey validation/compilation, cross-model pass/repeatability/latency/token/recovery metrics, and alpha journeys over the owned product routes.

### Green

- [ ] Step 7.7: **Automated** Make the integrated platform suites pass and verify that the QA platform can compile, execute, replay, and benchmark journeys across all owned products without relying on third-party benchmark apps.

### Milestone

Acceptance criteria:

- The QA platform can compile and execute benchmark journeys against all owned products.
- Replay and artifact surfaces explain planner intent, executor action, state changes, retries, and verdicts for owned-product runs.
- Worker isolation and policy controls hold under concurrent benchmark execution.
- Cross-model benchmarking works against the owned product corpus with repeatability, latency, recovery, and spend reporting.
- All Phase 7 tests pass.
- No regressions occur in Phases 1-6 suites.

## Review

Step 7.3 replaced the control-plane, journey compiler, policy, and benchmark-runner placeholders with deterministic domain functions. The control plane now validates owned-corpus journey definitions, compiles them into v1 graph metadata, and creates queued run submissions with stable artifact and replay references. The journey compiler validates natural-language journeys against owned fixtures and emits a deterministic graph with assertions and bounded recovery. The policy package enforces the owned-domain allowlist and run submission checks. The benchmark runner now returns cross-planner comparison reports with repeatability, pass-rate, latency, token-spend, and recovery metrics over the owned corpus.

- Validation:
  - `pnpm exec vitest run apps/control-plane/tests packages/journey-compiler/tests packages/policies/tests tests/e2e/alpha` passes at 4 files / 9 tests.
  - `pnpm exec vitest run apps/control-plane/tests apps/replay-console/tests packages/engine/tests packages/runtime/tests packages/executor/tests packages/artifacts/tests packages/orchestrator/tests packages/journey-compiler/tests packages/vision/tests packages/policies/tests tests/e2e/alpha` is expected red at 11 files / 23 tests, with 9 passing tests and 14 expected failures in Step 7.4 browser/runtime/executor, Step 7.5 replay/artifacts/vision/context, and Step 7.6 worker orchestration placeholders.
  - `pnpm exec vitest run packages/contracts/tests packages/benchmark/tests packages/realtime/tests packages/jobs/tests packages/auth/tests packages/tenancy/tests packages/rbac/tests packages/search/tests packages/files/tests packages/audit/tests apps/admin-console/tests apps/altitude/tests apps/switchboard/tests apps/foundry/tests tests/integration/altitude tests/integration/switchboard tests/integration/foundry tests/planning` passes at 40 files / 169 tests.
  - `pnpm exec tsc --noEmit` passes.
- Warnings: none emitted by the validation commands.

## Next Step Plan

Step 7.4 should implement the browser engine kernel, semantic runtime, deterministic executor, assertions, and bounded recovery for the supported QA web subset exercised against the owned products.

- Commands to run:
  - `pnpm exec vitest run packages/engine/tests packages/runtime/tests packages/executor/tests`
  - `pnpm exec vitest run apps/control-plane/tests apps/replay-console/tests packages/engine/tests packages/runtime/tests packages/executor/tests packages/artifacts/tests packages/orchestrator/tests packages/journey-compiler/tests packages/vision/tests packages/policies/tests tests/e2e/alpha`
  - `pnpm exec vitest run packages/contracts/tests packages/benchmark/tests packages/realtime/tests packages/jobs/tests packages/auth/tests packages/tenancy/tests packages/rbac/tests packages/search/tests packages/files/tests packages/audit/tests apps/admin-console/tests apps/altitude/tests apps/switchboard/tests apps/foundry/tests tests/integration/altitude tests/integration/switchboard tests/integration/foundry tests/planning`
  - `pnpm exec tsc --noEmit`
- Files likely to modify:
  - `packages/engine/src/engine-domain.ts`
  - `packages/runtime/src/runtime-domain.ts`
  - `packages/executor/src/executor-domain.ts`
  - `packages/assertions/src/assertions-domain.ts`
  - `packages/policies/src/policies-domain.ts` only if bounded recovery or unsupported-feature policy needs additive shared checks
  - `tasks/todo.md`
  - `tasks/history.md`
- Implementation expectations:
  - Replace the Step 7.4 placeholder throws in the engine, runtime, and executor packages with deterministic pure functions.
  - Model browser document/session/frame/storage/network state and stable interactive element IDs with actionability scoring.
  - Build semantic snapshots from engine state and compact runtime context within token and crop budgets.
  - Compile the supported planner intent vocabulary into deterministic executor actions, including fail-fast unsupported outcomes.
  - Add or wire assertion and bounded recovery helpers only where needed by the Step 7.4 contracts.
  - Keep replay console, artifacts, targeted vision, context-manager, worker leases, and telemetry placeholders red for Steps 7.5-7.6 unless Step 7.4 requires typed references.
  - Re-run the full Phase 7 suite and record that Step 7.4 tests turned green while Step 7.5-7.6 behavior remains intentionally red.
