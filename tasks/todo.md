# Current Priority: Launch Readiness Spec Interviews

Before planning roadmap phases for the remaining production blockers, validate and complete specs for each launch-critical area via `$spec-interview`.

## Spec Interview Queue

- [x] `$spec-interview` — Browser engine / Playwright integration
  - Output: `specs/browser-playwright-integration.md`, `browser-playwright-integration-interview.md`
  - Key decision: Playwright as v1 substrate (not custom engine). Firecracker microVMs. Chromium only. Enriched a11y tree.
- [ ] `$spec-interview` — Provider-backed planner execution
  - Existing coverage: `specs/agent-native-browser-qa-platform.md` (planner layer), `packages/contracts/src/planner-adapter.ts` (frozen contract)
  - Goal: validate Claude/OpenAI API integration, tool-call strategy, vision support, cost controls, and model-agnostic adapter boundary
- [ ] `$spec-interview` — Production persistence and infrastructure
  - Existing coverage: scattered references in `specs/agent-native-browser-qa-platform.md` and `specs/owned-parity-benchmark-products.md`
  - Goal: dedicated spec covering storage (runs, replays, artifacts), queuing, realtime transport, and deployment topology
- [ ] `$spec-interview` — CI/CD integration
  - Existing coverage: none
  - Goal: CLI runner, exit codes, reporter formats, CI provider examples, and headless browser constraints

## After Interviews

Once specs are validated, decompose each into phased roadmap steps (like the MCP transport work) and load into `tasks/roadmap.md`.

## Completed Work

- [x] MCP Server Transport (4 phases) — archived in `tasks/phases/mcp-phase-{1-4}.md`
- Monorepo health: 56 test files / 241 tests green, TypeScript clean

## Other Deferred Items

- Remote MCP transports (Streamable HTTP, SSE)
- Credential vault and secrets management
- Arbitrary user app targeting (v1 scoped to owned products by design)
