# Agent-Native Browser QA Platform Roadmap

This plan translates [the finalized product spec](/home/georgeqle/projects/tools/dev/automium/specs/agent-native-browser-qa-platform.md) into execution phases. The repository currently contains planning artifacts only, so the file paths below define the intended package and app layout to create as implementation begins. Manual-only work is tracked separately in [tasks/manual-todo.md](/home/georgeqle/projects/tools/dev/automium/tasks/manual-todo.md).

## Summary

- Deliver a full platform alpha in sequential phases that validate the highest-risk assumptions first: benchmark contracts, engine kernel, semantic runtime, replay, vision, worker scale, and natural-language authoring.
- Keep the browser scope narrow: authenticated React/Vue SaaS apps with dashboards, CRUD flows, forms, sessions, uploads, and common iframes.
- Treat replay/debug, deterministic execution, and cross-model benchmarking as core product surfaces, not post-MVP cleanup.

## Phase Overview

| Phase | Focus | Primary Deliverables | Depends On |
| --- | --- | --- | --- |
| 1 | Benchmark contracts and repo skeleton | Frozen semantic, replay, and KPI contracts; benchmark corpus manifest | Spec approval |
| 2 | Control plane skeleton and shared domain model | Core APIs, entity schemas, planner adapter base, operator shell | Phase 1 |
| 3 | Engine kernel for the QA web subset | HTML/DOM/JS/CSS/network/storage/input/frame runtime for target apps | Phase 1 |
| 4 | Semantic runtime and deterministic executor | Stable semantic IDs, actionability model, executor, assertions, recovery | Phases 2-3 |
| 5 | Replay, artifacts, and causal debugging | Event stream, artifact pipeline, replay console timeline and diffs | Phases 2-4 |
| 6 | Targeted vision and context budgeting | Vision fallback, OCR/disambiguation, compaction, token policies | Phases 4-5 |
| 7 | Worker isolation and large-scale execution | Queueing, isolated workers, tenancy controls, telemetry, fleet runs | Phases 2-6 |
| 8 | Natural-language authoring, benchmarking, and alpha hardening | Journey compiler, cross-model benchmark runner, integrated alpha | Phases 1-7 |

## Phase 1: Benchmark Contracts and Repo Skeleton

Goal: freeze the contracts and benchmark definitions that every later phase will implement, while establishing the initial workspace layout.

### Tests First

- Step 1.1: **Automated** Write failing contract tests in `packages/contracts/tests/semantic-snapshot.contract.test.ts`, `packages/contracts/tests/replay-event.contract.test.ts`, `packages/contracts/tests/planner-adapter.contract.test.ts`, and `packages/benchmark/tests/kpi-harness.test.ts` covering required fields, schema versioning, event ordering, KPI aggregation, and planner intent vocabulary.

### Implementation

- Step 1.2: **Automated** Create the initial workspace structure under `packages/contracts/`, `packages/benchmark/`, `docs/contracts/`, `docs/benchmarks/`, and `tests/fixtures/` so the project has stable homes for contracts, corpus manifests, and golden fixtures.
- Step 1.3: **Automated** Define the v1 benchmark corpus, fixture manifest, verdict taxonomy, KPI formulas, and planner adapter interface in `packages/benchmark/src/corpus.ts`, `packages/benchmark/src/kpis.ts`, `packages/contracts/src/semantic-snapshot.ts`, `packages/contracts/src/replay-event.ts`, and `packages/contracts/src/planner-adapter.ts`.

### Green

- Step 1.4: **Automated** Add golden schema fixtures under `packages/contracts/fixtures/` and `packages/benchmark/fixtures/`, make the new contract suites pass, and align the contract documentation in `docs/contracts/` and `docs/benchmarks/v1-corpus.md` with the frozen interfaces.

### Milestone

Acceptance criteria:

- Contract tests in `packages/contracts/tests/` and `packages/benchmark/tests/` pass against versioned fixtures.
- `docs/benchmarks/v1-corpus.md` maps each benchmark journey to an authorized site profile, fixture set, and expected verdict semantics.
- The semantic snapshot, replay event, and planner adapter contracts are versioned and referenced by path from the benchmark docs.
- All Phase 1 tests pass.
- No regressions are introduced in pre-existing repository checks.

## Phase 2: Control Plane Skeleton and Shared Domain Model

Goal: establish the product shell, shared entities, and planner abstraction so authoring, execution, and replay use the same system model.

### Tests First

- Step 2.1: **Automated** Write failing API and domain tests in `apps/control-plane/tests/journey-api.contract.test.ts`, `packages/domain-model/tests/entities.test.ts`, `packages/planner-adapters/tests/base-adapter.test.ts`, and `apps/replay-console/tests/navigation-shell.test.tsx` for entity schemas, lifecycle states, API payloads, and operator navigation.

### Implementation

- Step 2.2: **Automated** Create the control-plane and shared-model packages under `apps/control-plane/`, `apps/replay-console/`, `packages/domain-model/`, `packages/api/`, and `packages/planner-adapters/`, including workspace manifests and module boundaries.
- Step 2.3: **Automated** Implement `Journey`, `Run`, `Step`, `Assertion`, and `RecoveryRule` schemas plus planner adapter base classes in `packages/domain-model/src/` and `packages/planner-adapters/src/`, and expose typed API contracts from `packages/api/src/`.
- Step 2.4: **Automated** Scaffold the operator-facing surfaces for journey authoring, run listing, and replay entry in `apps/control-plane/src/` and `apps/replay-console/src/`, wired to the shared domain types and placeholder data sources.

### Green

- Step 2.5: **Automated** Make the new API, domain, and UI shell tests pass and verify that a smoke flow can create a draft journey, view a queued run, and open a replay placeholder without schema mismatches.

### Milestone

Acceptance criteria:

- Shared entity schemas define stable lifecycle states for journeys, runs, steps, assertions, and recovery rules.
- Control-plane and replay-console routes use the same typed contracts from `packages/domain-model/` and `packages/api/`.
- Planner adapters share a single base interface compatible with the Phase 1 contract tests.
- All Phase 2 tests pass.
- No regressions occur in Phase 1 contract and benchmark suites.

## Phase 3: Engine Kernel for the QA Web Subset

Goal: deliver the first browser engine kernel capable of loading and operating the narrow SaaS-app subset defined in the spec.

### Tests First

- Step 3.1: **Automated** Write failing engine tests in `packages/engine/tests/html-dom.test.ts`, `packages/engine/tests/layout-saas-subset.test.ts`, `packages/engine/tests/network-session.test.ts`, `packages/engine/tests/input-and-frames.test.ts`, and `tests/integration/engine/authorized-app-smoke.test.ts` for document parsing, layout constraints, session persistence, iframe behavior, and benchmark smoke journeys.

### Implementation

- Step 3.2: **Automated** Implement the engine modules under `packages/engine/src/html/`, `packages/engine/src/dom/`, `packages/engine/src/js/`, `packages/engine/src/css/`, `packages/engine/src/network/`, `packages/engine/src/storage/`, `packages/engine/src/input/`, and `packages/engine/src/frames/`.
- Step 3.3: **Automated** Add support for auth/session flows, SPA navigation, forms, uploads, and common iframe interactions in the engine runtime, and document supported/unsupported behaviors in `docs/compatibility/v1-web-subset.md`.

### Green

- Step 3.4: **Automated** Make the engine suites pass for login, dashboard, CRUD, and form journeys from the Phase 1 corpus, and add controlled failure coverage for unsupported behaviors in `packages/engine/tests/unsupported-behavior.test.ts`.

### Milestone

Acceptance criteria:

- The engine can load benchmark applications, maintain sessions, and execute common SaaS interactions inside the supported subset.
- `docs/compatibility/v1-web-subset.md` lists supported behaviors, known exclusions, and expected failure modes.
- Unsupported features fail in diagnosable, bounded ways instead of silent corruption.
- All Phase 3 tests pass.
- No regressions occur in Phases 1-2 suites.

## Phase 4: Semantic Runtime and Deterministic Executor

Goal: make the engine agent-operable through stable semantic identities, deterministic execution, assertions, and bounded recovery.

### Tests First

- Step 4.1: **Automated** Write failing runtime and execution tests in `packages/runtime/tests/semantic-ids.test.ts`, `packages/runtime/tests/actionability.test.ts`, `packages/executor/tests/action-compiler.test.ts`, `packages/assertions/tests/verdicts.test.ts`, and `tests/integration/journeys/deterministic-run.test.ts`.

### Implementation

- Step 4.2: **Automated** Implement semantic snapshot generation, stable interactive node identity, mutation tracking, and actionability scoring in `packages/runtime/src/`.
- Step 4.3: **Automated** Implement deterministic action compilation, bounded retries, recovery policies, and assertion evaluation in `packages/executor/src/` and `packages/assertions/src/`, consuming the Phase 1 planner intent contract.

### Green

- Step 4.4: **Automated** Make the runtime and journey execution suites pass for core actions (`navigate`, `click`, `type/fill`, `select`, `upload`, `wait for condition`, `assert`, `recover`, `finish`) and verify reproducible outcomes across repeated runs of the same corpus journeys.

### Milestone

Acceptance criteria:

- Semantic snapshots expose stable IDs, frame hierarchy, interactability metadata, recent mutations, relevant network events, and pinned invariants.
- Planner intent and executor action responsibilities are separated by typed contracts and enforced by tests.
- Recovery behavior is explicit, bounded, and replayable for transient failures.
- All Phase 4 tests pass.
- No regressions occur in Phases 1-3 suites.

## Phase 5: Replay, Artifacts, and Causal Debugging

Goal: provide the artifact pipeline and replay surfaces needed to explain what happened during a run and why it passed, failed, or recovered.

### Tests First

- Step 5.1: **Automated** Write failing artifact and replay tests in `packages/event-stream/tests/replay-event-ordering.test.ts`, `packages/artifacts/tests/manifest.test.ts`, `packages/artifacts/tests/retention-policy.test.ts`, `apps/replay-console/tests/step-debugger.test.tsx`, and `tests/integration/replay/failure-diagnosis.test.ts`.

### Implementation

- Step 5.2: **Automated** Implement the replay event stream, artifact manifest, targeted screenshot metadata, network trace packaging, and run summary generation in `packages/event-stream/src/` and `packages/artifacts/src/`.
- Step 5.3: **Automated** Build the replay console timeline, step inspector, semantic before/after diff, mutation log, and planner-versus-executor views in `apps/replay-console/src/`.

### Green

- Step 5.4: **Automated** Make the replay suites pass by reconstructing a failing run from persisted artifacts alone and verifying that the console can explain planner input, executor action, state changes, retries, and final verdict.

### Milestone

Acceptance criteria:

- Every run emits a replay bundle with semantic events, targeted visual artifacts, traces, planner decisions, executor actions, and a verdict summary.
- The replay console can answer what the planner believed, what the executor did, what changed, and why the run failed or recovered.
- Artifact retention behavior is defined and enforced in the artifact pipeline.
- All Phase 5 tests pass.
- No regressions occur in Phases 1-4 suites.

## Phase 6: Targeted Vision and Context Budgeting

Goal: add selective vision fallback and bounded context management without losing determinism or exploding token spend.

### Tests First

- Step 6.1: **Automated** Write failing tests in `packages/vision/tests/targeted-crop-policy.test.ts`, `packages/vision/tests/ocr-disambiguation.test.ts`, `packages/context-manager/tests/budget-compaction.test.ts`, and `tests/integration/journeys/ambiguous-target-recovery.test.ts`.

### Implementation

- Step 6.2: **Automated** Implement targeted crop capture, semantic coordinate mapping, OCR/disambiguation hooks, and ambiguity detection in `packages/vision/src/`.
- Step 6.3: **Automated** Implement pinned invariants, recent raw-step windows, summarized history chapters, per-step token caps, and escalation policies in `packages/context-manager/src/`, integrating with planner adapters and the executor.

### Green

- Step 6.4: **Automated** Make the vision and context suites pass by showing that ambiguous scenarios invoke vision only when semantic resolution fails, and that long journeys remain within configured token budgets without losing required assertions.

### Milestone

Acceptance criteria:

- Vision is invoked only for ambiguity, canvas/image text, or visual-only checks justified by runtime policies.
- Context compaction preserves active assertions and recovery context across long journeys.
- Token and visual-capture budgets are measurable against Phase 1 KPI definitions.
- All Phase 6 tests pass.
- No regressions occur in Phases 1-5 suites.

## Phase 7: Worker Isolation and Large-Scale Execution

Goal: make the platform operationally credible by running isolated journeys across a worker fleet with tenancy, quotas, and telemetry.

### Tests First

- Step 7.1: **Automated** Write failing orchestration and scale tests in `packages/orchestrator/tests/queue-policy.test.ts`, `packages/worker/tests/isolation-boundary.test.ts`, `packages/policies/tests/tenant-guards.test.ts`, and `tests/load/concurrent-runs.test.ts`.

### Implementation

- Step 7.2: **Automated** Implement job queueing, worker assignment, isolated run lifecycles, warm-pool support, and artifact handoff in `packages/orchestrator/src/` and `packages/worker/src/`.
- Step 7.3: **Automated** Implement tenant policies, concurrency controls, quota enforcement, telemetry aggregation, and artifact ownership boundaries in `packages/policies/src/`, `packages/orchestrator/src/telemetry/`, and `apps/control-plane/src/runs/`.

### Green

- Step 7.4: **Automated** Make the orchestration suites pass by running concurrent benchmark journeys in isolated workers, validating telemetry completeness, and confirming that worker failures do not leak state or artifacts across runs or tenants.

### Milestone

Acceptance criteria:

- Journeys execute in isolated environments with clear ownership of state, secrets, and artifacts.
- Queueing, concurrency, and warm-pool behavior are observable from the control plane.
- Tenant and policy boundaries are enforced by tests rather than documentation alone.
- All Phase 7 tests pass.
- No regressions occur in Phases 1-6 suites.

## Phase 8: Natural-Language Authoring, Benchmarking, and Alpha Hardening

Goal: complete the agent-first platform by compiling natural-language QA journeys, benchmarking planners, and hardening the integrated alpha.

### Tests First

- Step 8.1: **Automated** Write failing tests in `packages/journey-compiler/tests/natural-language-compile.test.ts`, `packages/journey-compiler/tests/graph-assembly.test.ts`, `packages/benchmark-runner/tests/cross-model-compare.test.ts`, and `tests/e2e/alpha/full-platform-smoke.test.ts`.

### Implementation

- Step 8.2: **Automated** Implement natural-language journey parsing, graph compilation, fixture and environment binding, and policy profile attachment in `packages/journey-compiler/src/` and `apps/control-plane/src/authoring/`.
- Step 8.3: **Automated** Implement the benchmark runner, cross-model comparison pipeline, KPI reporting, and alpha limitation documentation in `packages/benchmark-runner/src/`, `apps/control-plane/src/benchmarks/`, and `docs/alpha/`.

### Green

- Step 8.4: **Automated** Make the end-to-end alpha suites pass by compiling benchmark journeys, executing them through the worker fleet on multiple planner backends, validating replay/debug output, and generating a benchmark report with repeatability, latency, recovery, and spend metrics.

### Milestone

Acceptance criteria:

- Operators can define benchmark journeys in natural language, inspect the compiled graph, and launch runs without code-first scripting.
- Cross-model benchmark reports compare GPT, Claude, and Gemini under the same fixtures and policies.
- Alpha limitations, supported environments, and operating constraints are documented in `docs/alpha/`.
- All Phase 8 tests pass.
- No regressions occur in Phases 1-7 suites.

## Cross-Phase Concerns

- Keep contract versioning strict across `packages/contracts/`, `packages/domain-model/`, and replay/artifact schemas so fixtures and golden traces remain valid as the system grows.
- Maintain an integration ladder: schema tests first, subsystem tests second, benchmark-journey integration tests third, and cross-model alpha smoke tests last.
- Enforce authorized-use controls, domain allowlists, secret scoping, artifact access rules, and audit logging from the earliest executable phases instead of deferring them to launch hardening.
- Track repeatability, latency, recovery success, and token-spend metrics continuously so every phase can be evaluated against the same KPI definitions from Phase 1.
- Document supported web-surface constraints, unsupported behaviors, and operational limits as code evolves, so benchmark results and alpha expectations remain honest.
