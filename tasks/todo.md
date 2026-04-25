# Current Priority: Launch Readiness Spec Interviews

Before planning roadmap phases for the remaining production blockers, validate and complete specs for each launch-critical area via `$spec-interview`.

## Spec Interview Queue

- [x] `$spec-interview` — Browser engine / Playwright integration
  - Output: `specs/browser-playwright-integration.md`, `browser-playwright-integration-interview.md`
  - Key decision: Playwright as v1 substrate (not custom engine). Firecracker microVMs. Chromium only. Enriched a11y tree.
- [x] `$spec-interview` — Provider-backed planner execution
  - Output: `specs/provider-backed-planner-execution.md`, `provider-backed-planner-execution-interview.md`
  - Key decision: v2 contract with native tool calling. Claude first, GPT fast-follow. Separate packages per provider. Multi-layer cost controls.
- [x] `$spec-interview` — Production persistence and infrastructure
  - Output: `specs/production-persistence-infrastructure.md`, `production-persistence-infrastructure-interview.md`
  - Key decision: Neon Postgres + BullMQ/Redis + Cloudflare R2 + WorkOS + Hono. Fly.io control plane, bare metal workers. Drizzle ORM. Shared schema + RLS.
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
