# Current Phase: MCP Server Stdio Entrypoint And Hardening

This file tracks Phase 4 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 3 has been archived in [tasks/phases/mcp-phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/mcp-phase-3.md); the full phased plan remains in `tasks/roadmap.md`.

## Phase 4: Stdio Entrypoint And Hardening

Goal: wire the official SDK stdio transport, add executable package entrypoints, verify local coding-agent startup, and document the safe v1 operating boundary.

> Test strategy: tdd

### Tests First

- [x] Step 4.1: **Automated** Write failing stdio startup and safety regression tests.
  - Files: create `packages/mcp-server/tests/mcp-stdio.contract.test.ts`, `packages/mcp-server/tests/mcp-safety.contract.test.ts`
  - Startup tests cover server metadata, stdio wiring, registered capabilities, and clean failure behavior without hanging test processes.
  - Safety tests cover no browser driver imports, no provider SDK imports, no credential access helpers, no network transport registration, no filesystem writes, no arbitrary resource URI support, and modeled-output disclaimers on modeled tools.

### Implementation

- [ ] Step 4.2: **Automated** Implement the stdio runtime entrypoint.
  - Files: create `packages/mcp-server/src/stdio.ts`, modify `packages/mcp-server/src/index.ts`, modify `packages/mcp-server/package.json`
  - The entrypoint should start only stdio transport and should not start HTTP/SSE listeners.
- [ ] Step 4.3: **Automated** Document local setup and supported client configuration.
  - Files: create `packages/mcp-server/README.md`, modify `tasks/todo.md`
  - Documentation should include stdio command shape, supported tools/resources/prompts, v1 safety boundaries, and deferred remote transport scope.

### Green

- [ ] Step 4.4: **Automated** Make the stdio and safety suites pass, then run MCP package tests, targeted dependent suites, TypeScript, formatting checks, and diff checks.
  - Commands: `pnpm exec vitest run packages/mcp-server/tests apps/control-plane/tests apps/replay-console/tests packages/artifacts/tests packages/benchmark-runner/tests packages/benchmark/tests packages/contracts/tests packages/journey-compiler/tests`, `pnpm exec tsc --noEmit`, `git diff --check`

### Milestone

- [ ] Stdio entrypoint and hardening complete.

Acceptance criteria:

- The MCP server starts over stdio.
- The server registers the v1 tools, resources, and prompts listed in the spec.
- The implementation has no provider API calls, browser driver calls, filesystem writes, remote artifact reads, or credential reads.
- README instructions describe local stdio usage and v1 limitations.
- All phase tests pass.
- No regressions.

## Next Step Plan — Step 4.2 (Phase 4 green-phase stdio runtime entrypoint)

### Execution Profile
- **Mode:** tdd-green (turn the Step 4.1 red-phase stdio suite green; do not regress the 45 existing MCP tests; keep the safety suite's forbidden-import scan clean)
- **Depends on:** Step 4.1 (new `mcp-stdio.contract.test.ts` + `mcp-safety.contract.test.ts` landed, 4 expected failures); Phase 3 capability registration surface in `packages/mcp-server/src/server.ts`, `resources.ts`, `prompts.ts`, `tools.ts`
- **Owns:** `packages/mcp-server/src/stdio.ts` (new), `packages/mcp-server/src/index.ts` (re-export), `packages/mcp-server/package.json` (already points `bin` at `./src/stdio.ts` — leave as-is unless a shebang-compatible wrapper is needed)

### What to build

1. Create `packages/mcp-server/src/stdio.ts` exporting `async function startAutomiumMcpStdioServer(): Promise<{ server: AutomiumMcpServer; transport: StdioServerTransport; close: () => Promise<void> }>`.
   - Build the server via `createAutomiumMcpServer()`.
   - Wire every v1 tool, resource, and prompt into the underlying `McpServer` (via `registerAutomiumMcpTools(server)`, `registerAutomiumMcpResources(server)`, `registerAutomiumMcpPrompts(server)` — add those registration helpers in the respective source files if not already exported). The registration helpers must use the existing `callAutomiumMcpTool`, `readAutomiumMcpResource`, and `getAutomiumMcpPrompt` handlers so there is no duplicated business logic.
   - Connect the stdio transport (`StdioServerTransport` from `@modelcontextprotocol/sdk/server/stdio.js`) to the SDK server via `sdkServer.connect(transport)` — only import from the SDK, no raw `process.stdin`/`process.stdout` wiring.
   - Track the transport on the returned handle and expose a `close()` that awaits `sdkServer.close()` (or `transport.close()`) and resolves without leaving handles open — the contract test's 1s timeout must pass.
   - Do NOT import `http`, `https`, `net`, `express`, `fastify`, `ws`, `SSEServerTransport`, or `StreamableHTTPServerTransport`. Do NOT read env vars. Do NOT write files.

2. Re-export the stdio surface from `packages/mcp-server/src/index.ts` (`export * from "./stdio";`) so the dynamic-import fallback in the contract test still resolves.

3. If the stdio source file needs a shebang for the `bin` target (`#!/usr/bin/env node`), add it on line 1. If not, leave `package.json` `bin` unchanged. Do not restructure the bin shape.

### Files to create/modify
- Create `packages/mcp-server/src/stdio.ts`.
- Modify `packages/mcp-server/src/index.ts` (add the `export * from "./stdio";` line).
- Modify `packages/mcp-server/src/tools.ts`, `resources.ts`, and `prompts.ts` ONLY to add `registerAutomiumMcp*` helpers that wire the existing pure handlers into the SDK server — do not touch business logic or error handling.
- Leave `package.json` alone unless the stdio file needs a shebang-compatible runner.

### Technical decisions
- **Reuse the pure handlers.** Registration helpers are thin adapters that call the existing pure functions and translate errors into SDK responses. This keeps the Phase 3 contract tests for handlers green and avoids a second source of truth.
- **No child process spawn in tests.** The stdio contract test constructs the transport + server in-process. Make sure `close()` is synchronous-ish (resolves within the 1s test budget) and does not leave the Vitest process hanging.
- **Keep the forbidden-import surface clean.** The only new import permitted by the safety scan is `@modelcontextprotocol/sdk/server/stdio.js`. Double-check the scan regexes won't match it.
- **Handle `StdioServerTransport` construction carefully.** If the SDK's default constructor reads from `process.stdin`, the test must still be able to close cleanly — verify with a local run; if not, accept an optional injected `input`/`output` stream pair.

### Test expectations
- `pnpm exec vitest run packages/mcp-server/tests/mcp-stdio.contract.test.ts` → all 4 tests green.
- `pnpm exec vitest run packages/mcp-server/tests/mcp-safety.contract.test.ts` → all 5 tests green (`stdio.ts` now exists; no new forbidden imports added).
- `pnpm exec vitest run packages/mcp-server/tests` → 5 files / 49 tests green.
- `pnpm exec tsc --noEmit` → pass.
- `pnpm test:run` → 56 files / 241 tests green.
- `git diff --check` → clean.

### Acceptance criteria
- Stdio entrypoint lands; contract suite is green.
- Safety scan still passes with the new file in place.
- All existing MCP tests (40) remain green.
- No regressions in the 54 previously-passing monorepo test files.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 4.2 as scoped above.
2. Validate: both new suites fully green, existing MCP + monorepo tests still green, `pnpm exec tsc --noEmit` + `git diff --check` clean, `pnpm test:run` at 56 files / 241 tests green.
3. Mark Step 4.2 done in `tasks/todo.md` and append the green-phase breakdown to `tasks/history.md`.
4. Commit and push to `master` via `/commit-and-push-by-feature`. Skip deploy.
5. Write the Step 4.3 plan (README docs for local stdio usage and v1 safety boundaries) into `tasks/todo.md` as a self-contained handoff.
6. Ensure `.claude/settings.local.json` retains `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
7. Enter plan mode, write a brief pass-through plan referencing `tasks/todo.md`, exit plan mode, and stop before implementing Step 4.3.

---

## Previous Step Plan (shipped) — Step 4.1 (Phase 4 red-phase stdio + safety contract tests)

Shipped in this session. Added `packages/mcp-server/tests/mcp-stdio.contract.test.ts` (4 tests: dynamic-import loader for `startAutomiumMcpStdioServer`, v1 capability registration through stdio, `package.json` `bin` entry, 1s-budget clean shutdown) and `packages/mcp-server/tests/mcp-safety.contract.test.ts` (5 tests: deterministic forbidden-import static scan over `src/*.ts`, dedicated `stdio.ts` source-file presence, 8-input adversarial resource-URI rejection via `readAutomiumMcpResource`, modeled-output six-marker coverage across every `modeled: true` tool descriptor with a valid invocation fixture, and a meta-test pinning that fixture coverage to descriptor set). Validated: `pnpm exec vitest run packages/mcp-server/tests` at 45 passing / 4 failing (expected red-phase signal — 3 stdio "handler missing" + 1 "stdio.ts source missing"), `pnpm exec tsc --noEmit` (clean; variable-specifier dynamic import sidesteps the missing-module resolution error), `git diff --check` (clean), `pnpm test:run` at 54 passing files + 2 expected-failing new files / 237 passing + 4 failing tests.

---

## Previous Step Plan (shipped) — Step 4.1 original plan (Phase 4 red-phase stdio + safety contract tests)

### Execution Profile
- **Mode:** tdd-red (additive tests only; no `src/` edits expected beyond what's needed to make the test files type-check; expected to fail at assertion time, not at import/syntax)
- **Depends on:** Phase 3 complete (resources + prompts landed); `packages/mcp-server/src/server.ts`, `resources.ts`, `prompts.ts`, `tools.ts`, `schemas.ts`, `errors.ts` exporting the current v1 surface
- **Owns:** two new test files under `packages/mcp-server/tests/`

### What to build
Add two failing Vitest contract suites that pin down the Phase 4 expectations before any stdio wiring or safety-audit logic lands:

1. `packages/mcp-server/tests/mcp-stdio.contract.test.ts` — startup/wiring contract.
   - Asserts that `packages/mcp-server/src/index.ts` (or `packages/mcp-server/src/stdio.ts`, whichever becomes the runtime entrypoint) exports a not-yet-implemented `startAutomiumMcpStdioServer()` helper with a documented return shape (e.g. `{ server, transport, close }`).
   - Asserts the helper registers every v1 tool, resource, and prompt name from the spec through the existing registration surface (reuse inspection helpers from `mcp-server-registration.contract.test.ts`).
   - Asserts that `package.json` exposes a `bin` entry pointing at a compiled stdio entrypoint.
   - Asserts clean shutdown: calling `close()` does not hang the test process and does not leave open handles.
   - Use dynamic-import loader pattern (like Step 3.1) so missing exports surface as clean "handler missing" errors instead of module-resolution failures.

2. `packages/mcp-server/tests/mcp-safety.contract.test.ts` — safety regression contract.
   - Static source scan over `packages/mcp-server/src/**/*.ts` asserting none of the following appear: browser driver imports (`playwright`, `puppeteer`, `webdriverio`, `selenium-webdriver`), provider SDK imports (`@anthropic-ai/*`, `openai`, `@google/generative-ai`, etc.), credential access helpers (`process.env.*_API_KEY`, `dotenv`, keytar), network transport registration (`http`, `https`, `net`, `ws`, `express`, `fastify`, SSE wiring), filesystem writes (`fs.write*`, `fs.promises.write*`, `writeFileSync`, `createWriteStream`).
   - Assert the resource registry only accepts the five frozen `automium://…` URIs — reuse `readAutomiumMcpResource` with a set of adversarial inputs.
   - Assert every modeled tool response carries the full six-marker modeled-output metadata set.
   - Keep the scan deterministic: read the file list via `fs.readdir` inside the test and snapshot the forbidden-import list as an exported constant.

### Files to create/modify
- Create `packages/mcp-server/tests/mcp-stdio.contract.test.ts`.
- Create `packages/mcp-server/tests/mcp-safety.contract.test.ts`.
- Do **not** modify `packages/mcp-server/src/` — Steps 4.2–4.3 own those changes.

### Technical decisions
- **Dynamic-import loader.** Mirror the `loadResourceReader()` / `loadPromptGetter()` pattern from Step 3.1 so missing `startAutomiumMcpStdioServer` surfaces as a clean red-phase signal.
- **Safety scan reads source, not built output.** The assertion runs against `.ts` files in `packages/mcp-server/src/` to catch regressions before transpile.
- **Do not actually spawn stdio.** The startup test should construct the transport wrapper and assert on registered capabilities, not fork a child process.
- **Modeled-output scan reuses Step 2.7 markers.** Import the shared `AutomiumModeledOutputMetadata` shape from `packages/mcp-server/src/schemas.ts` so the safety test stays in sync with the source of truth.

### Test expectations
- `pnpm exec vitest run packages/mcp-server/tests/mcp-stdio.contract.test.ts` → all new tests failing on missing `startAutomiumMcpStdioServer` export (handler-missing signal).
- `pnpm exec vitest run packages/mcp-server/tests/mcp-safety.contract.test.ts` → the forbidden-import scan passes already (current `src/` is clean); the resource-URI adversarial test and modeled-output marker assertions pass against current behavior; tests that pin Phase 4 additions (e.g. stdio entrypoint source existing) fail as expected.
- `pnpm exec vitest run packages/mcp-server/tests` → existing 40 tests still green, plus the new files report red-phase failures.
- `pnpm exec tsc --noEmit` → pass.
- `pnpm test:run` → 54 files + 2 new expected-failing files; count failures match the new assertions only.
- `git diff --check` → clean.

### Acceptance criteria
- Two new failing Vitest suites landed under `packages/mcp-server/tests/`.
- Failures are assertion-time, not import/syntax errors.
- Existing 40 MCP tests and the rest of the monorepo remain green.
- No `packages/mcp-server/src/` edits.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 4.1 as scoped above.
2. Validate: new suites fail as designed, existing 40 MCP tests still green, `pnpm exec tsc --noEmit` + `git diff --check` clean, `pnpm test:run` shape matches expectation.
3. Mark Step 4.1 done in `tasks/todo.md` and append the red-phase breakdown to `tasks/history.md`.
4. Commit and push to `master` via `/commit-and-push-by-feature`.
5. Skip deploy.
6. Write the Step 4.2 plan (stdio runtime entrypoint implementation) into `tasks/todo.md` as a self-contained handoff.
7. Ensure `.claude/settings.local.json` retains `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Enter plan mode, write a brief pass-through plan referencing `tasks/todo.md`, exit plan mode, and stop before implementing Step 4.2.

---

## Previous Step Plan (shipped) — Step 3.5 (Phase 3 green milestone verification sweep)

Shipped in this session. Pure verification-only step; no `src/` edits. Re-ran the resources+prompts contract suite (11/11), MCP tools contract suite (25/25), full MCP package test slice (3 files / 40 tests), `pnpm exec tsc --noEmit` (clean), full monorepo `pnpm test:run` (54 files / 232 tests), and `git diff --check` (clean) — all green on the first run. Marked the Phase 3 milestone complete in `tasks/roadmap.md`, archived Phase 3 under `tasks/phases/mcp-phase-3.md` (mirroring `tasks/phases/mcp-phase-2.md`), appended the verification breakdown to `tasks/history.md`, and regenerated this file around Phase 4.

---

## Previous Step Plan (shipped) — Step 3.4 (Phase 3 prompt-copy maturity-boundary audit)

Shipped prior to this session. Added a module-level `MODELED_V1_DISCLAIMER` constant in `packages/mcp-server/src/prompts.ts` and appended it as a trailing system message to all three prompts. Normalized copy in each `build*Prompt` helper to reject forbidden live-execution imperatives and reframed references as modeled / checked-in / identifier-only.
