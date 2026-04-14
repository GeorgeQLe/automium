# Current Phase: MCP Server Package Shell And Registry Foundation

This file tracks Phase 1 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). The full phased plan is in `tasks/roadmap.md`; this active document intentionally contains only the current phase.

## Phase 1: Package Shell And MCP Registry Foundation

Goal: introduce the `packages/mcp-server/` package and a testable server-registration boundary before implementing individual tool behavior.

> Test strategy: tdd

### Tests First

- [x] Step 1.1: **Automated** Write failing package and registry tests for the MCP server shell.
  - Files: create `packages/mcp-server/tests/mcp-server-registration.contract.test.ts`
  - Tests cover: package exports a server factory, v1 capability manifest exists, tool/resource/prompt registries can be inspected in tests without starting stdio, and the package does not register unsupported remote transports.

### Implementation

- [x] Step 1.2: **Automated** Scaffold `packages/mcp-server/` using the existing workspace package conventions.
  - Files: create `packages/mcp-server/package.json`, `packages/mcp-server/tsconfig.json`, `packages/mcp-server/src/index.ts`
  - Include package exports and a future `bin` entry, but do not wire stdio process startup until Phase 4.
- [x] Step 1.3: **Automated** Add the MCP SDK dependency boundary and server factory.
  - Files: create `packages/mcp-server/src/server.ts`
  - The server factory should isolate SDK-specific construction inside `packages/mcp-server/` and expose a test-friendly registration surface.
- [x] Step 1.4: **Automated** Define v1 schema, error, and capability primitives for the MCP boundary.
  - Files: create `packages/mcp-server/src/schemas.ts`, `packages/mcp-server/src/errors.ts`
  - Schemas cover supported tool names, fixed resource URIs, prompt names, modeled-output metadata, planner references, journey input shapes, replay summary input, artifact manifest input, and benchmark comparison input.
  - Errors cover invalid app ID, fixture/app mismatch, unsupported planner intent, invalid artifact kind, unsupported corpus version, malformed planner metadata, unsupported resource URI, and unsupported v1 operation.
- [x] Step 1.5: **Automated** Register placeholder descriptors for the v1 tools, resources, and prompts without implementing domain behavior yet.
  - Files: create `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/resources.ts`, `packages/mcp-server/src/prompts.ts`
  - Descriptors must include every v1 name from the spec and must keep remote Streamable HTTP/SSE out of scope.

### Green

- [x] Step 1.6: **Automated** Make the Phase 1 registration tests pass and run targeted workspace validation.
  - Commands: `pnpm exec vitest run packages/mcp-server/tests/mcp-server-registration.contract.test.ts`, `pnpm exec tsc --noEmit`

### Milestone

- [x] Package shell and MCP registry foundation complete.

Acceptance criteria:

- `packages/mcp-server/` exists in the workspace.
- The package exports a server factory and a test-inspectable v1 registration surface.
- All v1 tool, resource, and prompt names are present as descriptors.
- No remote MCP transport is registered.
- All phase tests pass.
- No regressions.

## Review

Phase 1 completed on 2026-04-14. The MCP package shell now exists with the official v1 TypeScript SDK dependency isolated inside `packages/mcp-server/`, a test-inspectable server factory, fixed v1 tool/resource/prompt descriptors, schema primitives, and MCP-safe error primitives. The server factory creates the SDK server object without starting stdio; stdio wiring remains intentionally deferred to Phase 4.

Validation performed for this planning step:

- Read `/home/georgeqle/projects/tools/dev/agentic-skills/global/codex/plan-phases/SKILL.md`.
- Read `tasks/lessons.md` and preserved the production-readiness boundary around MCP transport.
- Read `specs/mcp-server.md`.
- Inspected existing package exports in `packages/benchmark/`, `apps/control-plane/`, `apps/replay-console/`, `packages/artifacts/`, `packages/benchmark-runner/`, and `packages/contracts/`.
- `rg -n "Automium MCP Server Transport Roadmap|Phase Overview|## Phase 1: Package Shell And MCP Registry Foundation|## Phase 4: Stdio Entrypoint And Hardening|## Cross-Phase Concerns|Current Phase: MCP Server Package Shell And Registry Foundation|Review" tasks/roadmap.md tasks/todo.md`
- `git diff --check`
- Initial red check: `pnpm exec vitest run packages/mcp-server/tests/mcp-server-registration.contract.test.ts` failed at 1 file / 4 tests because `packages/mcp-server/src/index.ts` did not exist.
- `pnpm exec vitest run packages/mcp-server/tests/mcp-server-registration.contract.test.ts` passes at 1 file / 4 tests.
- `pnpm exec tsc --noEmit` passes.
- `git diff --check`
- `pnpm test:run` passes at 52 files / 196 tests.

## Next Action

- [ ] Begin Phase 2 tool adapters from `tasks/roadmap.md`, starting with Step 2.1 failing tool contract tests.
