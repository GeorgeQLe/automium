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

**Acceptance Criteria:**
- [ ] BrowserRuntime interface is defined and Playwright adapter passes all interface methods
- [ ] Semantic enrichment produces stable element IDs that persist across page rerenders
- [ ] Actionability scoring correctly identifies interactive vs non-interactive elements
- [ ] CDP pipeline captures network requests, console messages, and DOM mutations in real-time
- [ ] Targeted vision capture produces annotated element screenshots under budget
- [ ] Iframe elements appear in the flattened semantic snapshot with frame metadata
- [ ] Can navigate an owned benchmark product URL and produce a complete enriched snapshot
- [ ] Executor can compile click, type, navigate, and assert intents into Playwright actions
- [ ] Firecracker VM image boots and runs a Playwright script successfully

> Test strategy: tdd

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests

**Subagent lanes:** none

### Steps

*Phase 3 step breakdown to be planned in a subsequent session.*

---

### Milestone: Phase 3 — Browser Runtime
**Acceptance Criteria:** (see above)

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
