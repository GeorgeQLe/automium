# Automium Production Launch — Phase 1: Persistence Foundation

## Priority Task Queue

- [ ] `/plan-phase 1` — Decompose Phase 1 into implementation steps, TDD structure, and file-level detail before starting execution.

## Completed Spec Interviews

- [x] `$spec-interview` — Browser engine / Playwright integration
  - Output: `specs/browser-playwright-integration.md`, `browser-playwright-integration-interview.md`
  - Key decision: Playwright as v1 substrate (not custom engine). Firecracker microVMs. Chromium only. Enriched a11y tree.
- [x] `$spec-interview` — Provider-backed planner execution
  - Output: `specs/provider-backed-planner-execution.md`, `provider-backed-planner-execution-interview.md`
  - Key decision: v2 contract with native tool calling. Claude first, GPT fast-follow. Separate packages per provider. Multi-layer cost controls.
- [x] `$spec-interview` — Production persistence and infrastructure
  - Output: `specs/production-persistence-infrastructure.md`, `production-persistence-infrastructure-interview.md`
  - Key decision: Neon Postgres + BullMQ/Redis + Cloudflare R2 + WorkOS + Hono. Fly.io control plane, bare metal workers. Drizzle ORM. Shared schema + RLS.
- [x] `$spec-interview` — CI/CD integration
  - Output: `specs/ci-cd-integration.md`, `ci-cd-integration-interview.md`
  - Key decision: Standalone `@automium/cli` as thin remote client. Submit+poll+collect. JUnit XML + JSON + terminal. Three-level exit codes. GitHub Actions + GitLab CI examples.

## Completed Prior Work

- [x] MCP Server Transport (4 phases) — archived in `tasks/phases/mcp-phase-{1-4}.md`
- Monorepo health: 56 test files / 241 tests green, TypeScript clean
