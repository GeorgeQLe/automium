# Browser Engine / Playwright Integration Spec

## Status

Validated via spec interview on April 25, 2026. This spec supersedes the browser engine sections of `specs/agent-native-browser-qa-platform.md` for v1 implementation.

## Summary

Automium v1 uses Playwright on Chromium as the browser execution substrate instead of building a custom browser engine. Automium's differentiator — semantic state graphs, stable element identity, deterministic execution, causal replay, and model benchmarking — is built as an enrichment layer on top of Playwright's accessibility tree and Chrome DevTools Protocol.

A thin `BrowserRuntime` abstraction boundary keeps the custom engine option open for v2+ without coupling Automium code to Playwright directly.

Each journey run executes in an ephemeral Firecracker microVM with a cold-booted Chromium instance for maximum determinism and isolation.

## Strategic Rationale

The original spec committed to building a new browser engine from scratch. This interview validated a different approach:

- Playwright now ships accessibility-tree snapshots (2-5 KB per interaction), MCP tooling, and headless Chromium with ~125ms cold starts — covering much of the parsing/layout/JS execution burden.
- A custom engine requires 12-18+ months of HTML/CSS/JS/layout work before the first real QA journey runs. Product-market fit risk outweighs engine control benefits.
- The agent-native value (semantic enrichment, deterministic executor, causal replay, planner benchmarking) is independent of whether the underlying engine is Playwright or custom.
- The `BrowserRuntime` interface preserves the strategic option to swap engines later.

## Architecture

### Layer Model

```
┌─────────────────────────────────────────┐
│           Planner Layer                 │
│   (GPT / Claude / Gemini adapters)      │
├─────────────────────────────────────────┤
│        Deterministic Executor           │
│   (intent → BrowserRuntime actions)     │
├─────────────────────────────────────────┤
│       Semantic Runtime Layer            │
│   (enriched snapshots, stable IDs,      │
│    actionability, mutation diffs,        │
│    vision triggers)                     │
├─────────────────────────────────────────┤
│       BrowserRuntime Interface          │
│   (navigate, snapshot, execute,         │
│    capture, observe)                    │
├─────────────────────────────────────────┤
│       Playwright Adapter                │
│   (Locator API + CDP subscriptions)     │
├─────────────────────────────────────────┤
│       Chromium (headless shell)         │
├─────────────────────────────────────────┤
│       Firecracker microVM               │
└─────────────────────────────────────────┘
```

### BrowserRuntime Interface

A thin adapter with approximately 5-8 methods. Automium code never imports Playwright directly — only the adapter.

Required methods:

- `navigate(url: string, options?: NavigateOptions): Promise<NavigationResult>`
- `snapshot(): Promise<RawAccessibilitySnapshot>`
- `executeAction(action: ExecutorAction): Promise<ActionResult>`
- `captureElementScreenshot(selector: ElementRef, options?: CropOptions): Promise<ScreenshotArtifact>`
- `getNetworkEvents(since?: Timestamp): Promise<NetworkEvent[]>`
- `getConsoleEvents(since?: Timestamp): Promise<ConsoleEvent[]>`
- `getDOMMutations(since?: Timestamp): Promise<DOMMutation[]>`
- `close(): Promise<void>`

The interface is intentionally narrow. Features like cookie manipulation, storage access, or JS evaluation are exposed only if a planner intent requires them, not as general-purpose engine access.

### Playwright Adapter Implementation

The adapter implements `BrowserRuntime` using:

- **Actions**: Playwright's high-level Locator API (`getByRole`, `getByLabel`, `getByText`, `locator.click()`, `page.fill()`, etc.). Playwright handles actionability checks (visible, enabled, stable), auto-waiting, and retry.
- **Observation**: Chrome DevTools Protocol subscriptions for:
  - `Network` domain: request, response, failure events for fetch/XHR/WebSocket traffic
  - `Runtime` domain: console messages and exceptions
  - `DOM` domain: attribute modifications, child node insertions/removals (mutation tracking)
  - `Performance` domain: timing metrics
- **Vision**: Playwright's `locator.screenshot()` for targeted element crops with `locator.boundingBox()` for coordinates.
- **Tracing**: Playwright's built-in tracing (`trace.zip`) captured as a supplementary debug artifact alongside Automium's primary event stream.

### Semantic Runtime Layer

Built on top of the `BrowserRuntime` interface, the semantic layer enriches Playwright's raw accessibility tree into the agent-native snapshot contract.

#### Enrichment Pipeline

1. **Raw snapshot**: Call `snapshot()` to get Playwright's accessibility tree (roles, names, refs).
2. **Stable ID assignment**: Assign persistent element IDs using DOM attribute + position + role heuristics. IDs survive rerenders as long as the element's semantic identity is preserved.
3. **Actionability scoring**: Derive per-element actionability scores from Playwright's actionability checks (visible, enabled, stable, not obscured) combined with semantic role and ARIA state.
4. **Mutation diffing**: Compare current snapshot against previous snapshot. Tag elements as added, removed, or changed. Correlate with CDP DOM mutation events for timing precision.
5. **Network correlation**: Attach relevant network events (API responses, errors) to the snapshot context for the current step.
6. **Frame flattening**: Elements from all frames (including iframes) are included in a single unified element list, tagged with frame origin and nesting depth. The planner sees one flat list and does not need to manage frame boundaries. Frame metadata is preserved for replay and cross-origin security checks.
7. **Vision trigger evaluation**: Apply runtime heuristics to flag ambiguity:
   - Multiple elements match the target intent
   - Element has no accessible name or role
   - Custom component lacks ARIA attributes
   - Visually overlapping candidates
   
   Attach `vision_recommended: true` with candidate element refs. Budget-capped: max 2-3 crops per step, each under 100 KB.

#### Semantic Snapshot Output

Each planner step receives the enriched snapshot containing:

- Page URL and route identity
- Frame hierarchy metadata (flattened)
- Task and checkpoint context
- Stable interactive element list with IDs
- Roles, labels, values, required/disabled/loading/error states
- Actionability scores
- Visibility and interactability metadata
- Nearby structural grouping
- Recent mutations (diffed)
- Correlated application-level network events
- Pinned invariants and assertions
- Vision recommendation flags (when applicable)

## Sandboxing Model

### Isolation Unit

One Firecracker microVM per journey run.

- **Boot**: Fresh microVM per run (~125ms VM boot + ~1-2s Chromium launch + ~1-2s first navigation ≈ <5s cold start)
- **Kernel**: Dedicated Linux kernel per VM. A compromised browser cannot escape to the host or affect other runs.
- **Lifecycle**: VM is created, journey executes, artifacts are collected, VM is destroyed. No state persists between runs.
- **Image**: Pre-built microVM image containing Chromium headless shell, Playwright runtime, and the Automium adapter. Image is versioned and immutable.

### Why Firecracker

- Industry consensus for untrusted agent workloads in 2026
- Minimal overhead: <5 MiB per VM, ~125ms boot
- Hard isolation boundary: separate kernel, no shared-kernel attack surface
- Works naturally with the ephemeral worker model from the orchestration spec
- Determinism: no state leaks between runs

### Target Scope Constraint

v1 supports only owned or consented properties:

- Automium benchmark products: Altitude, Switchboard, Foundry, iframe-fixture
- Customer's own web applications where the customer controls the domain

Domain allowlist is mandatory and enforced at the policy layer before the BrowserRuntime receives a navigation URL. This constraint reduces the browser security threat model significantly — the sandboxed Chromium only loads known, authorized applications.

## Executor Integration

### Action Compilation

The deterministic executor compiles planner intents into `BrowserRuntime` method calls:

| Planner Intent | BrowserRuntime Action |
| --- | --- |
| `navigate` | `navigate(url)` |
| `click` | `executeAction({ type: 'click', target: elementRef })` |
| `type/fill` | `executeAction({ type: 'fill', target: elementRef, value })` |
| `select` | `executeAction({ type: 'select', target: elementRef, value })` |
| `upload` | `executeAction({ type: 'upload', target: elementRef, files })` |
| `press-key` | `executeAction({ type: 'pressKey', key })` |
| `wait-for-condition` | `executeAction({ type: 'waitFor', condition })` |
| `assert` | Evaluated against semantic snapshot (no browser action) |
| `extract` | Read from semantic snapshot or `executeAction({ type: 'extract', target })` |
| `branch` | Control flow (no browser action) |
| `recover` | Re-snapshot + retry or alternate path |
| `finish` | `close()` + artifact collection |

The executor uses Playwright's Locator API under the hood, which provides auto-waiting and actionability checks. The executor adds:

- Intent validation against the allowed schema
- Retry with jitter under recovery policy
- Step outcome recording for the replay event stream
- Token cost attribution

### Vision Capture Flow

1. Semantic runtime flags `vision_recommended` with candidate element refs
2. Executor checks vision budget (max crops per step)
3. Executor calls `captureElementScreenshot(elementRef)` via BrowserRuntime
4. Screenshot artifact is annotated with semantic context (role, label, nearby elements, bounding box, timestamp)
5. Annotated crop is included in the planner's next prompt
6. Crop is also stored as a replay artifact regardless of whether it was sent to the planner

## Authentication Model

Credentials are resolved from a scoped vault (per-tenant, per-environment) and injected into the Firecracker microVM at boot time as environment variables or a mounted secrets file.

- The journey's login step uses Playwright to perform real authentication against the target application
- Session cookies are ephemeral — they die with the VM
- No credential or session state persists across runs
- Credential vault integration is a hard prerequisite for production deployment

This model ensures that:

- Login is tested as part of every journey (not skipped via stored sessions)
- Credential scope is enforced at the infrastructure level
- Session state cannot leak between tenants or runs

## Network Observation

Application-level traffic only:

- **Captured**: fetch, XHR, and WebSocket requests/responses via CDP Network domain
- **Ignored**: static asset loads (images, CSS bundles, JS bundles) unless they fail
- **Recorded**: request URL, method, status code, timing, response size, and response body for API calls
- **Exceptions**: static asset failures (4xx, 5xx, timeouts) are captured as error events

This keeps the network trace focused on QA-relevant data (API responses, error codes, data payloads) and reduces artifact size. Static asset failures surface as exceptions rather than noise.

## Trace and Replay Artifacts

### Primary: Automium Event Stream

The custom replay event stream is the primary artifact for causal debugging:

- Planner intents with input context
- Executor actions with timing and outcome
- Semantic snapshots (before and after each step)
- Assertion evaluations and verdicts
- Recovery decisions and retry traces
- Vision capture metadata and crops
- Correlated network events
- Console messages and errors
- DOM mutation summaries

### Supplementary: Playwright Trace

Playwright's `trace.zip` is captured for each run as a supplementary artifact:

- Full DOM snapshots at each action
- Network waterfall
- Console log
- Action log with screenshots

The Playwright trace is available for deep debugging (CSS/layout issues, timing problems) but is not the primary interface for failure diagnosis. The Automium replay console consumes the Automium event stream; the Playwright trace viewer can be opened separately when needed.

## Browser Engine Scope

### v1: Chromium Only

- Chrome for Testing headless shell via Playwright
- Single browser engine simplifies semantic enrichment, CDP integration, and microVM image management
- Target SaaS apps (React/Vue) behave identically on Chromium

### v2+: Multi-Browser

- Firefox and WebKit via Playwright's existing multi-browser support
- Requires per-engine microVM images and semantic layer testing
- Cross-browser QA value but not needed for v1 product validation

### v2+ Strategic Option: Custom Engine

The `BrowserRuntime` interface is designed so a custom engine implementation can replace the Playwright adapter without changing any Automium code above the interface. This preserves the original spec's strategic vision while removing it from the critical path for v1.

A custom engine becomes justified when:

- Playwright's abstractions actively block a required optimization
- Semantic graph generation needs to be native to the rendering pipeline
- The product has proven market fit and can invest in engine R&D

## Performance Targets

| Metric | Target | Rationale |
| --- | --- | --- |
| Cold start (VM + Chromium + first navigation) | <5 seconds | Acceptable for QA workloads. Achievable with Firecracker + pre-built Chromium image. |
| Semantic snapshot generation | <200ms per step | Enrichment pipeline on a11y tree should be fast; most cost is in the Playwright snapshot call. |
| Journey step execution | <2 seconds median | Excluding network wait (target app response time). Playwright Locator API is fast. |
| Full journey (10-step login + CRUD) | <30 seconds median | Covers real SaaS workflow with login, navigation, form fills, assertions. |
| Targeted vision capture | <500ms per crop | Playwright element screenshot is fast; annotation adds minimal overhead. |

## Revised Phased Build Plan

The original spec's Phase 1 (custom engine construction) is replaced:

### Phase 1: BrowserRuntime Adapter + Enriched Snapshots

Deliverables:

1. `BrowserRuntime` interface definition (~5-8 methods)
2. Playwright adapter implementing the interface
3. Semantic snapshot enrichment layer (stable IDs, actionability scores, mutation diffs)
4. CDP observation pipeline (network, console, DOM mutations)
5. Targeted vision capture via Playwright screenshots
6. Basic Firecracker microVM image with Chromium + Playwright pre-installed

Exit criteria:

- Can navigate an owned benchmark product (Altitude, Switchboard, or Foundry)
- Produces enriched semantic snapshots with stable element IDs
- Executes planner intents via Playwright Locator API
- Captures replay artifacts (Automium event stream + Playwright trace)
- Runs inside a Firecracker microVM with clean teardown

### Subsequent Phases

Phases 2-5 from the original spec (executor runtime, vision/compaction, control plane, replay console) proceed as designed, now targeting the Playwright-backed BrowserRuntime instead of a custom engine. The scope of each phase is reduced because Playwright handles HTML/CSS/JS/layout execution.

## Compatibility with Existing Contracts

The existing `packages/engine/`, `packages/runtime/`, and `packages/contracts/` surfaces model browser state, semantic snapshots, and stable element identity at the contract level. The Playwright integration implements these contracts rather than replacing them:

- `SemanticSnapshot` contract: populated by the enrichment pipeline over Playwright's a11y tree
- `BrowserSession`, `Document`, `Frame`, `Storage`, `Network` models: backed by Playwright + CDP state
- `StableElementId` and `ActionabilityScore`: computed by the enrichment layer
- `ExecutorAction` compilation: routes through BrowserRuntime instead of a custom engine API

No contract changes are required. The implementation layer beneath the contracts changes from "future custom engine" to "Playwright adapter."

## Open Questions

- Exact Firecracker microVM image build pipeline and versioning strategy
- CDP subscription performance impact under high-mutation pages
- Stable ID assignment algorithm specifics (DOM attribute weighting, position tolerance)
- Playwright version pinning and upgrade cadence
- Cross-origin iframe handling under domain allowlist policy
