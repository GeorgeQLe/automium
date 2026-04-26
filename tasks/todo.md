# Automium Production Launch — Phase 3: Browser Runtime

> Project: Automium Production Launch | Phase: 3 of 8 | Strategy: TDD

## Completed Prior Work

- [x] Phase 1: Persistence Foundation (13 steps) — archived in `tasks/phases/production-phase-1.md`
  - Drizzle schema (17 tables, 12 pgEnums), Neon connection, migration runner, RLS policies
  - AuditSinkAdapter, SearchBackendAdapter, CredentialVault, IdentityProviderAdapter (shape-validated stubs)
  - 274 tests passing, 0 TypeScript errors

- [x] Phase 2: Queue + Worker Infrastructure (8 steps) — archived in `tasks/phases/production-phase-2.md`
  - JobQueueAdapter, RealtimeTransportAdapter, Redis connection factory (shape-validated stubs)
  - Worker process skeleton with heartbeat, orchestrator dispatch wiring
  - 309 tests passing, 0 TypeScript errors

---

## Phase 3: Browser Runtime

**Goal**: Implement the Playwright-backed browser execution layer that runs inside Firecracker microVMs. After this phase, Automium can navigate a web page, produce enriched semantic snapshots, execute planner intents, and capture artifacts.

**Scope**:
- Define `BrowserRuntime` interface (~5-8 methods: navigate, snapshot, executeAction, captureElementScreenshot, getNetworkEvents, getConsoleEvents, getDOMMutations, close)
- Create Playwright adapter implementing BrowserRuntime using Chromium headless shell
- Implement semantic enrichment pipeline: stable ID assignment, actionability scoring, mutation diffing over Playwright's accessibility tree
- Implement CDP observation pipeline: Network, Runtime, DOM, Performance event subscriptions
- Implement targeted vision capture via Playwright element screenshots with bounding box and semantic annotation
- Implement vision trigger heuristics (ambiguity detection, budget enforcement: max 2-3 crops/step, <100KB each)
- Flatten iframe frame hierarchy into unified semantic snapshot
- Build basic Firecracker microVM image with Chromium + Playwright pre-installed
- Wire executor action compilation to BrowserRuntime method calls

> Test strategy: tdd

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests

**Subagent lanes:** none

### Existing Codebase Context

**Engine domain** (`packages/engine/src/engine-domain.ts`):
- `BrowserEngineState`, `BrowserFrameState`, `InteractiveElementDescriptor` — types defined
- `createBrowserEngineState(input)` — wraps raw state into immutable form
- `describeInteractiveElement(input)` — computes stable ID via FNV-1a hash of `route|frameId|role|label`, actionability score (visible+enabled=1.0, one=0.5, neither=0)
- `InteractiveElementInput` requires: role, label, frameId, route, visible, enabled

**Runtime domain** (`packages/runtime/src/runtime-domain.ts`):
- `SemanticSnapshot` (local, simplified) — NOT the frozen contract version
- `buildSemanticSnapshot(input)` — filters to visible elements, copies data
- `compactRuntimeContext(input)` — token/crop budgeting for snapshot retention

**Executor domain** (`packages/executor/src/executor-domain.ts`):
- `SUPPORTED_EXECUTOR_INTENTS`: navigate, click, type/fill, select, upload, press-key, wait-for-condition, assert, extract, branch, recover, finish
- `compilePlannerIntent(input)` — validates intent, maps to opcode (`type/fill` → `fill`, etc.), returns `ExecutorAction`
- `ExecutorAction` is a discriminated union: `{ type, targetElementId?, value?, deterministic: true }` or `{ type: "unsupported", reason, recoverable: false }`

**Vision domain** (`packages/vision/src/vision-domain.ts`):
- `shouldRequestTargetedVision(input)` — triggers if `semanticConfidence < 0.7` or `recentFailures` includes actionability failures
- `createTargetedCropRequest(input)` — wraps crop request with schema version, `fullPage: false`
- `BoundingBox`: x, y, width, height
- `ACTIONABILITY_FAILURES`: not-actionable, not-visible, disabled, covered, ambiguous-target

**Frozen contracts** (`packages/contracts/src/semantic-snapshot.ts`):
- `SemanticSnapshot` — 9 required fields: url, route, frameHierarchy, taskContext, checkpointContext, interactiveElements, recentMutations, relevantNetworkEvents, pinnedInvariants
- `SemanticInteractiveElement` — 11 required fields: id, role, label, value, required, disabled, loading, error, visible, interactable, group
- `SemanticFrameRef` — id, parentFrameId, origin, url
- `SemanticMutationSummary` — mutationId, kind (attribute/child-list/text/visibility), targetId, summary
- `SemanticNetworkEvent` — requestId, method, url, status, category (document/xhr/fetch/websocket/other)

**Adapter registry** (`packages/adapters/src/adapters-behavior.ts`):
- 6 boundaries defined (identity-provider, audit-sink, file-storage, job-queue, search-backend, realtime-transport)
- `AdapterRegistry` with type-safe `register<B>()` / `get<B>()` / `has()` / `boundaries()`
- Phase 3 adds `browser-runtime` boundary

**Phase 1-2 adapter pattern**: factory function → `{ boundary: "xxx" as const, ...methods }`, contract tests verify shape, subpath exports in `package.json`.

### Tests First
- [x] Step 3.1: **Automated** Write failing contract tests for all Phase 3 components.
  - Files: create `packages/browser-runtime/package.json`, `packages/browser-runtime/tsconfig.json`, `packages/browser-runtime/tests/browser-runtime.contract.test.ts` (8 tests: factory, boundary, navigate/snapshot/executeAction/captureElementScreenshot/getNetworkEvents/getConsoleEvents/getDOMMutations/close shape), `packages/browser-runtime/tests/enrichment.contract.test.ts` (8 tests: a11y tree → enriched elements with stable IDs, actionability scores per visibility/enabled matrix, element grouping by frame, mutation diffing between snapshots, network event categorization, enriched output matches SemanticInteractiveElement contract fields), `packages/browser-runtime/tests/frame-flattening.contract.test.ts` (5 tests: single-frame passthrough, multi-frame flattening with frame metadata, nested iframe hierarchy preserved, elements tagged with frame origin, frame hierarchy matches SemanticFrameRef contract), `packages/browser-runtime/tests/vision-capture.contract.test.ts` (5 tests: capture request shape, budget enforcement max 3 crops/step, crop size enforcement <100KB, annotated screenshot with bounding box/semantic context, vision trigger integration with shouldRequestTargetedVision), `packages/browser-runtime/tests/action-bridge.contract.test.ts` (6 tests: navigate intent → BrowserRuntime.navigate call shape, click intent → executeAction call shape, type/fill intent → executeAction with value, assert intent → snapshot + evaluate shape, unsupported intent → fail-fast, executor action result shape)
  - Tests cover: BrowserRuntime interface shape (8 methods), semantic enrichment pipeline (raw a11y → contract-compliant elements), frame hierarchy flattening, vision budget enforcement, executor-to-BrowserRuntime action bridging.

### Implementation
- [x] Step 3.2: **Automated** Scaffold `packages/browser-runtime/` and define BrowserRuntime interface types.
  - Files: create `packages/browser-runtime/src/types.ts`, `packages/browser-runtime/src/index.ts`
  - `BrowserRuntime` interface with 8 methods: `navigate(url, options?)` → `NavigationResult`, `snapshot()` → `RawAccessibilitySnapshot`, `executeAction(action)` → `ActionResult`, `captureElementScreenshot(elementId, options?)` → `ScreenshotResult`, `getNetworkEvents(since?)` → `NetworkEvent[]`, `getConsoleEvents(since?)` → `ConsoleEvent[]`, `getDOMMutations(since?)` → `DOMMutation[]`, `close()` → `void`.
  - Supporting types: `NavigationResult`, `RawAccessibilitySnapshot`, `RawAccessibilityNode`, `ActionResult`, `ScreenshotResult`, `NetworkEvent`, `ConsoleEvent`, `DOMMutation`.
  - `createBrowserRuntimeAdapter(config)` factory stub returning `{ boundary: "browser-runtime" as const, ...methods }`.

- [x] Step 3.3: **Automated** Implement semantic enrichment pipeline — raw accessibility tree to contract-compliant interactive elements.
  - Files: create `packages/browser-runtime/src/enrichment.ts`, modify `packages/browser-runtime/src/index.ts`
  - `enrichAccessibilityTree(rawSnapshot, route, frameId)` — maps `RawAccessibilityNode[]` to `SemanticInteractiveElement[]` using `describeInteractiveElement()` from `packages/engine/` for stable IDs and actionability, then fills remaining contract fields (value, required, disabled, loading, error, interactable, group).
  - `diffMutations(previous, current)` — compares two enriched snapshots, produces `SemanticMutationSummary[]` (attribute changes, child-list changes, text changes, visibility changes).
  - `categorizeNetworkEvent(event)` — maps raw network event to `SemanticNetworkEvent` with category (document/xhr/fetch/websocket/other).

- [ ] Step 3.4: **Automated** Implement frame hierarchy flattening into unified element list with frame metadata.
  - Files: create `packages/browser-runtime/src/frame-flattening.ts`, modify `packages/browser-runtime/src/index.ts`
  - `flattenFrameHierarchy(frames)` — takes array of `{ frameId, parentFrameId, origin, url, elements[] }`, produces unified `SemanticInteractiveElement[]` with elements tagged by frame origin + `SemanticFrameRef[]` matching the frozen contract.
  - Handles nested iframes (depth > 1) by traversing parent chain.

- [ ] Step 3.5: **Automated** Implement targeted vision capture contracts and budget enforcement.
  - Files: create `packages/browser-runtime/src/vision-capture.ts`, modify `packages/browser-runtime/src/index.ts`
  - `createVisionCaptureSession(config)` — factory accepting `{ maxCropsPerStep: 3, maxCropSizeBytes: 102400 }`.
  - `requestCapture(session, elementId, boundingBox, reason)` — checks budget, calls `shouldRequestTargetedVision()` from vision domain, produces `TargetedCropRequest` via `createTargetedCropRequest()`, returns `{ captured: boolean, request?, budgetRemaining }`.
  - `annotateScreenshot(screenshot, semanticContext)` — wraps raw screenshot with element role, label, nearby elements, bounding box, timestamp.

- [ ] Step 3.6: **Automated** Implement executor-to-BrowserRuntime action bridge.
  - Files: create `packages/browser-runtime/src/action-bridge.ts`, modify `packages/browser-runtime/src/index.ts`
  - `bridgeExecutorAction(executorAction, runtime)` — takes `ExecutorAction` from executor domain and a `BrowserRuntime` instance, maps each opcode to the corresponding BrowserRuntime method call: `navigate` → `runtime.navigate(value)`, `click` → `runtime.executeAction({type:"click", targetElementId})`, `fill` → `runtime.executeAction({type:"fill", targetElementId, value})`, `assert` → `runtime.snapshot()` + evaluate assertion, etc.
  - Returns `ActionBridgeResult` with `{ success, executorAction, runtimeResult?, error? }`.
  - Unsupported actions return `{ success: false, error: "unsupported" }` without calling runtime.

- [ ] Step 3.7: **Automated** Implement full BrowserRuntime adapter stub with enrichment pipeline wiring.
  - Files: create `packages/browser-runtime/src/browser-runtime-adapter.ts`, modify `packages/browser-runtime/src/index.ts`
  - `createBrowserRuntimeAdapter(config)` factory returns `{ boundary: "browser-runtime" as const, navigate(), snapshot(), executeAction(), captureElementScreenshot(), getNetworkEvents(), getConsoleEvents(), getDOMMutations(), close() }`.
  - `navigate()` stub returns `{ url, status: 200, timing: { total: 0 } }`.
  - `snapshot()` stub calls enrichment pipeline with empty accessibility tree, producing a valid but empty `RawAccessibilitySnapshot`.
  - `captureElementScreenshot()` stub delegates to vision-capture session for budget checks.
  - Event methods return empty arrays. `close()` is a no-op.
  - Real Playwright wiring deferred to integration phase.

- [ ] Step 3.8: **Automated** Build contract-compliant SemanticSnapshot from enriched browser state.
  - Files: create `packages/browser-runtime/src/snapshot-builder.ts`, modify `packages/browser-runtime/src/index.ts`
  - `buildContractSnapshot(input)` — takes enriched elements, frame hierarchy, mutations, network events, task context, and checkpoint context; produces a full `SemanticSnapshot` matching the frozen contract from `packages/contracts/src/semantic-snapshot.ts`.
  - Validates output has all `semanticSnapshotRequiredFields` and each element has all `interactiveElementRequiredFields`.

### Green
- [ ] Step 3.9: **Automated** Run all tests and verify they pass (green).
- [ ] Step 3.10: **Automated** Refactor pass — verify barrel exports, adapter alignment, no dead code.

---

### Review — Step 3.2

**Result:** Complete. The browser runtime package now exports `BrowserRuntime` types and `createBrowserRuntimeAdapter()` with the required `browser-runtime` boundary and async stub methods.

**Validation:**
- `pnpm test:run packages/browser-runtime/tests/browser-runtime.contract.test.ts` — 1 file / 8 tests passing
- `pnpm exec tsc --noEmit` — clean

**Notes:**
- The remaining Phase 3 browser-runtime suites are expected-red for future steps: enrichment, frame-flattening, vision-capture, and action-bridge.
- `pnpm typecheck` is not defined in this repository; use `pnpm exec tsc --noEmit` for TypeScript validation.

### Review — Step 3.3

**Result:** Complete. The browser runtime package now exports the semantic enrichment helpers required for raw accessibility conversion, mutation summaries, and network-event categorization.

**Validation:**
- `pnpm exec vitest run packages/browser-runtime/tests/enrichment.contract.test.ts` — 1 file / 8 tests passing
- `pnpm test:run packages/browser-runtime/tests/browser-runtime.contract.test.ts` — 1 file / 8 tests passing
- `pnpm exec tsc --noEmit` — clean

**Notes:**
- `enrichAccessibilityTree()` delegates stable ID generation and actionability scoring to `describeInteractiveElement()` from the engine domain.
- `RawAccessibilityNode` and `NetworkEvent` gained small additive fields needed to represent enrichment input without introducing a second local type system.
- Frame flattening, vision capture, and action bridge suites remain expected-red for future steps.

### Next Step Implementation Plan: Step 3.4 — Frame Hierarchy Flattening

**What to build:**
Implement frame hierarchy flattening for `@automium/browser-runtime`: take per-frame enriched elements plus frame metadata and produce a unified element list with a frozen-contract `SemanticFrameRef[]` hierarchy.

**Files to create/modify:**
- Create `packages/browser-runtime/src/frame-flattening.ts`
- Modify `packages/browser-runtime/src/index.ts` to export frame-flattening helpers
- Modify `packages/browser-runtime/src/types.ts` only if shared frame input types are useful and remain additive

**Implementation details:**
- Read `packages/browser-runtime/tests/frame-flattening.contract.test.ts` first and implement only the tested public contract.
- Define `flattenFrameHierarchy(frames)` around input frames shaped like `{ frameId, parentFrameId, origin, url, elements[] }`.
- Return a value containing a unified `elements` array and `frameHierarchy` array unless tests require a more specific shape.
- Emit `SemanticFrameRef` records with `id`, `parentFrameId`, `origin`, and `url`.
- Preserve nested iframe parentage exactly; do not infer or reorder parent links beyond a deterministic traversal needed by the tests.
- Tag each returned element with frame metadata through its `group` field or another tested property without mutating caller-owned element objects.
- Keep this module independent of Playwright; real browser frame discovery remains deferred.

**Acceptance criteria:**
- `pnpm exec vitest run packages/browser-runtime/tests/frame-flattening.contract.test.ts` passes.
- `pnpm exec vitest run packages/browser-runtime/tests/enrichment.contract.test.ts` remains green.
- `pnpm test:run packages/browser-runtime/tests/browser-runtime.contract.test.ts` remains green.
- `pnpm exec tsc --noEmit` remains clean.
- Future-step suites for vision-capture and action-bridge may remain expected-red.

**Ship-one-step handoff contract:** After approval, implement only Step 3.4; validate with focused frame-flattening, enrichment regression, browser-runtime shape, and TypeScript checks; mark done in `tasks/todo.md`; update `tasks/history.md`; commit and push; write the Step 3.5 plan.

---

### Milestone: Phase 3 — Browser Runtime
**Acceptance Criteria:**
- [ ] BrowserRuntime interface is defined and Playwright adapter passes all interface methods *(stub shape validated; real Playwright wiring deferred)*
- [ ] Semantic enrichment produces stable element IDs that persist across page rerenders *(uses engine-domain stableHash)*
- [ ] Actionability scoring correctly identifies interactive vs non-interactive elements *(uses engine-domain scoreActionability)*
- [ ] CDP pipeline captures network requests, console messages, and DOM mutations in real-time *(event types defined; real CDP subscription deferred)*
- [ ] Targeted vision capture produces annotated element screenshots under budget *(budget enforcement validated; real screenshot capture deferred)*
- [ ] Iframe elements appear in the flattened semantic snapshot with frame metadata
- [ ] Can navigate an owned benchmark product URL and produce a complete enriched snapshot *(contract-compliant snapshot shape validated; real navigation deferred)*
- [ ] Executor can compile click, type, navigate, and assert intents into Playwright actions *(action bridge validated; real Playwright execution deferred)*
- [ ] Firecracker VM image boots and runs a Playwright script successfully *(deferred — requires bare-metal KVM server)*
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
