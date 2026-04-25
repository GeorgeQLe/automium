# Browser Engine / Playwright Integration — Interview Log

## Interview Date

April 25, 2026

## Interview Context

Topic: Browser engine / Playwright integration for Automium v1.

Existing coverage: `specs/agent-native-browser-qa-platform.md` contains comprehensive architecture at the contract level, but commits to building a new browser engine from scratch. This interview validates whether that engine bet is correct for v1 and fills in execution-level details.

Research context consulted:

- `specs/agent-native-browser-qa-platform.md` (full platform spec)
- `research/devtool-user-map.md` (user personas and adoption blockers)
- `research/devtool-dx-journey.md` (developer experience journey)
- `research/devtool-integration-map.md` (integration surfaces and priorities)
- Web research on Playwright 2026 capabilities (MCP, a11y snapshots, agent CLI)
- Web research on custom browser engines vs Playwright trade-offs
- Web research on Firecracker/gVisor sandboxing for AI agents

## Turn 1: Engine Strategy

**Question:** The spec commits to building a new browser engine from scratch. Given Playwright's 2026 capabilities (a11y tree snapshots, MCP tooling, headless Chromium with ~125ms cold starts), should v1 use Playwright as the substrate or commit to the custom engine?

**Options presented:**

1. **Playwright substrate (Recommended)** — Use Playwright's Chromium runtime for HTML/CSS/JS/layout. Build Automium's semantic layer on top. Custom engine becomes v2+ option.
2. **Custom engine (original spec)** — Build everything from scratch. Maximum control but 12-18+ months before first real journey.
3. **Hybrid: Playwright now, custom later** — Ship on Playwright with an abstraction boundary for future swap.

**Evidence:** Playwright now provides 2-5 KB accessibility snapshots per interaction (vs 500 KB+ screenshots), has MCP server integration for agent workflows, and ships Chrome for Testing headless builds. The custom engine work (HTML parser, DOM, JS runtime, CSS layout, network stack) is estimated at 12-18+ months.

**User selection:** Playwright substrate

**Rationale:** Product-market fit risk outweighs engine control benefits. The agent-native differentiator (semantic enrichment, deterministic executor, causal replay) is independent of the underlying engine.

## Turn 2: Semantic Layer + Abstraction Boundary

**Question 1:** How should Automium's semantic layer relate to Playwright's accessibility tree?

**Options presented:**

1. **Enrich Playwright's a11y tree (Recommended)** — Use a11y tree as base, add stable IDs, actionability scoring, mutation diffs, correlated network events.
2. **Parallel DOM extraction via CDP** — Build separate semantic graph from live DOM. More control but duplicates work.
3. **Playwright a11y tree as-is, defer enrichment** — Ship raw snapshots. Fastest but weaker planner context.

**User selection:** Enrich Playwright's a11y tree

**Question 2:** How thick should the BrowserRuntime abstraction be?

**Options presented:**

1. **Thin adapter interface (Recommended)** — ~5-8 methods. Automium never imports Playwright directly.
2. **Full engine abstraction** — Abstract every capability. Maximum portability but heavyweight.
3. **No abstraction** — Import Playwright throughout. Fastest but locks in.

**User selection:** Thin adapter interface

## Turn 3: Sandboxing + Target Scope

**Question 1:** What isolation boundary for each journey run?

**Options presented:**

1. **Firecracker microVM (Recommended)** — Dedicated kernel per run, ~125ms boot, <5 MiB overhead. Industry consensus for untrusted agent workloads.
2. **gVisor container** — Syscall interception, lighter than microVMs, 20-50% overhead. Weaker isolation.
3. **Playwright BrowserContext** — Shared Chromium process. No OS-level isolation. Only safe for trusted properties.
4. **Docker container per run** — Shared kernel with namespace isolation. Not recommended for untrusted workloads.

**User selection:** Firecracker microVM

**Question 2:** Should v1 support only owned/controlled properties or arbitrary third-party sites?

**Options presented:**

1. **Owned/consented only (Recommended)** — Benchmark products + customer's own domains. Mandatory allowlist.
2. **Any site with allowlist** — Broader utility but increases threat surface.

**User selection:** Owned/consented only

## Turn 4: Browser Lifecycle + Engine Scope

**Question 1:** How should the browser lifecycle work within a Firecracker microVM?

**Options presented:**

1. **Cold boot per run (Recommended)** — Fresh VM + Chromium per run. ~2-3s startup. Maximum determinism.
2. **Warm pool with state reset** — Pre-booted VMs, reset browser state. Faster but risk of state leaks.
3. **Hybrid** — Warm for benchmarks, cold for production.

**User selection:** Cold boot per run

**Question 2:** Should v1 support multiple browser engines?

**Options presented:**

1. **Chromium only (Recommended)** — One engine to optimize against. Target SaaS apps run identically on Chromium.
2. **Chromium + Firefox** — Cross-browser value but doubles testing surface.
3. **All three engines** — Full coverage but triples integration work.

**User selection:** Chromium only

## Turn 5: Executor API + Observability

**Question 1:** Should the executor use Playwright's high-level API or lower-level CDP commands?

**Options presented:**

1. **Playwright high-level API (Recommended)** — Locator API with role-based selectors. Playwright handles actionability, waiting, retry.
2. **CDP direct commands** — Maximum control but rebuilds actionability from scratch.
3. **Hybrid: Playwright actions + CDP observation** — Actions through Playwright, observation through CDP.

**User selection:** Playwright high-level API (with CDP observation as the natural complement)

**Question 2:** How should Automium capture mutations and network events?

**Options presented:**

1. **CDP event subscriptions (Recommended)** — Subscribe to Network, Runtime, DOM, Performance domains alongside Playwright actions.
2. **Playwright event listeners only** — Simpler but less granular (no DOM mutation events).
3. **Post-step snapshot diffing** — No real-time events. Simpler but loses timing.

**User selection:** CDP event subscriptions

## Turn 6: Vision Capture + Trigger

**Question 1:** How should targeted vision capture work with Playwright?

**Options presented:**

1. **Playwright element screenshots + bounding box (Recommended)** — `locator.screenshot()` for targeted crops. Budget: max 2-3 crops per step, each under 100KB.
2. **CDP-level screencapture with manual cropping** — More control but unnecessary.
3. **Full page screenshot with ROI extraction** — Wastes bandwidth for the common case.

**User selection:** Playwright element screenshots + bounding box

**Question 2:** Who decides when to trigger vision capture?

**Options presented:**

1. **Runtime heuristic (Recommended)** — Automatic ambiguity detection (multiple matches, missing names, no ARIA). Planner can also request. Budget-capped.
2. **Planner-only decision** — Full model control but adds round-trip.
3. **Always capture, selectively send** — Higher storage cost but crops always available.

**User selection:** Runtime heuristic

## Turn 7: Trace Format + Iframe Handling

**Question 1:** Should Automium use Playwright's trace format or build a custom event stream?

**Options presented:**

1. **Custom event stream, Playwright trace as supplementary (Recommended)** — Automium's event stream for causal replay. Playwright trace.zip for deep DOM/layout debugging.
2. **Playwright trace as primary** — Lower cost but couples replay to Playwright's format.
3. **Custom event stream only** — Simplest but loses Playwright's DOM snapshot history.

**User selection:** Custom event stream, Playwright trace as supplementary

**Question 2:** How should iframes be handled in the semantic snapshot?

**Options presented:**

1. **Flatten frame hierarchy (Recommended)** — Unified element list from all frames, tagged with frame origin and depth. Planner sees one flat list.
2. **Separate snapshots per frame** — Planner navigates frames explicitly. More overhead.
3. **Top frame only** — Defers iframe support. Conflicts with spec requirements and benchmark corpus.

**User selection:** Flatten frame hierarchy

## Turn 8: Auth Model + Network Scope

**Question 1:** How should Automium handle authentication in the Playwright/Firecracker model?

**Options presented:**

1. **Credential vault injection at VM boot (Recommended)** — Scoped vault, injected at boot, real login per run, ephemeral sessions.
2. **Pre-authenticated storage state** — Playwright storageState injection. Faster but skips login testing and sessions expire.
3. **Hybrid** — Real login for validation, storage state for speed runs.

**User selection:** Credential vault injection at VM boot

**Question 2:** What network traffic should be recorded?

**Options presented:**

1. **Application-level only (Recommended)** — Fetch, XHR, WebSocket. Ignore static assets unless they fail.
2. **All traffic with filtering** — Record everything, filter in replay view.
3. **Only failed requests** — Smallest artifacts but loses success context.

**User selection:** Application-level only

## Turn 9: Phase 1 Scope + Performance Targets

**Question 1:** What should the revised Phase 1 deliver?

**Options presented:**

1. **BrowserRuntime adapter + enriched snapshots (Recommended)** — Interface + adapter + semantic enrichment + CDP pipeline + vision capture + Firecracker image. Exit: navigate owned product, produce snapshots, execute intents, capture artifacts.
2. **Adapter only, defer enrichment** — Faster but delays differentiator.
3. **Full stack through replay** — Ambitious, proves full loop but risks scope creep.

**User selection:** BrowserRuntime adapter + enriched snapshots

**Question 2:** What performance targets for v1?

**Options presented:**

1. **Practical QA targets (Recommended)** — <5s cold start, <200ms snapshots, <2s steps, <30s full journey, <500ms vision.
2. **Aggressive targets** — <2s cold start, <50ms snapshots. Requires warm pools.
3. **No targets** — Measure first, set later.

**User selection:** Practical QA targets

## Turn 10: Coverage Checkpoint

All 16 decision areas confirmed as complete by user.

## Significant Deviations from Original Spec

1. **Engine strategy (MAJOR):** Original spec committed to building a new browser engine from scratch. Validated spec uses Playwright on Chromium as the v1 substrate. Custom engine becomes a v2+ strategic option behind the BrowserRuntime interface.

2. **Phase 1 scope (MAJOR):** Original Phase 1 was "Minimal Engine for Target SaaS Apps" (HTML/DOM/JS/CSS/layout primitives). Revised Phase 1 is "BrowserRuntime Adapter + Enriched Snapshots" — dramatically reduced scope that leverages Playwright for all parsing/rendering work.

3. **Sandboxing model (NEW):** Original spec mentioned "isolated browser VM/container per journey" without specifics. Validated spec commits to Firecracker microVMs with cold boot per run.

4. **Semantic layer source (REFINED):** Original spec described semantic state graph "built natively, not derived later from an accessibility tree." Validated spec enriches Playwright's accessibility tree with stable IDs, actionability scoring, and mutation tracking — a pragmatic alternative that preserves the agent-native value.

5. **Browser engine scope (NEW):** Chromium only for v1. Firefox/WebKit deferred. Not addressed in original spec.

6. **Network observation scope (NEW):** Application-level traffic only. Original spec listed "fetch/XHR/WebSocket visibility" but did not specify filtering strategy.

7. **Trace format (NEW):** Dual artifact strategy — custom Automium event stream as primary, Playwright trace as supplementary. Not addressed in original spec.

8. **Performance targets (NEW):** Concrete targets set (<5s cold start, <200ms snapshots, <2s steps, <30s journey). Original spec had no performance SLAs.
