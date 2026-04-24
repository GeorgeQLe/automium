# Archived Phase: MCP Server Stdio Entrypoint And Hardening

This file archives Phase 4 of the MCP Server Transport roadmap in [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 4 was completed on 2026-04-24. The owned-products roadmap's Phase 4 archive remains at [tasks/phases/phase-4.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-4.md); this file exists separately so the MCP archive does not overwrite the earlier roadmap artifact.

## Phase 4: Stdio Entrypoint And Hardening

Goal: wire the official SDK stdio transport, add executable package entrypoints, verify local coding-agent startup, and document the safe v1 operating boundary.

> Test strategy: tdd

### Tests First

- [x] Step 4.1: Wrote failing stdio startup and safety regression tests.
  - Files: created `packages/mcp-server/tests/mcp-stdio.contract.test.ts`, `packages/mcp-server/tests/mcp-safety.contract.test.ts`
  - Startup tests cover server metadata, stdio wiring, registered capabilities, and clean failure behavior without hanging test processes.
  - Safety tests cover no browser driver imports, no provider SDK imports, no credential access helpers, no network transport registration, no filesystem writes, no arbitrary resource URI support, and modeled-output disclaimers on modeled tools.

### Implementation

- [x] Step 4.2: Implemented the stdio runtime entrypoint.
  - Files: created `packages/mcp-server/src/stdio.ts`, modified `packages/mcp-server/src/index.ts`, `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/resources.ts`, `packages/mcp-server/src/prompts.ts`
  - The entrypoint exports `startAutomiumMcpStdioServer()` returning `{ server, transport, close }` with three thin SDK registration helpers bridging existing pure handlers to the SDK server.
- [x] Step 4.3: Documented local setup and supported client configuration.
  - Files: created `packages/mcp-server/README.md`
  - Documentation includes stdio command shape, client configuration for Claude Desktop and Claude Code, all v1 tools/resources/prompts, safety boundaries, and deferred scope.

### Green

- [x] Step 4.4: All verification checks passed on first run with no code changes.
  - MCP package tests: 5 files / 49 tests green.
  - Reused-domain matrix: 9 files / 25 tests green.
  - Full monorepo: 56 files / 241 tests green.
  - TypeScript: `pnpm exec tsc --noEmit` clean.
  - Whitespace: `git diff --check` clean.

### Milestone

- [x] Phase 4 milestone completed on 2026-04-24.

Acceptance criteria (all met):

- The MCP server starts over stdio via `startAutomiumMcpStdioServer()`.
- The server registers all v1 tools, resources, and prompts listed in the spec.
- The implementation has no provider API calls, browser driver calls, filesystem writes, remote artifact reads, or credential reads.
- README instructions describe local stdio usage and v1 limitations.
- All phase tests pass (5 files / 49 tests).
- No regressions (56 files / 241 tests monorepo-wide).
