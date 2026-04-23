# Current Phase: MCP Server Resources and Prompts

This file tracks Phase 3 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 2 has been archived in [tasks/phases/mcp-phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/mcp-phase-2.md); the full phased plan remains in `tasks/roadmap.md`.

## Phase 3: Resources And Prompts

Goal: register the fixed v1 MCP resources and prompt templates without exposing arbitrary repository reads or speculative live-runtime guidance.

> Test strategy: tdd

### Tests First

- [ ] Step 3.1: **Automated** Write failing resource and prompt contract tests.
  - Files: create `packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts`
  - Tests cover: `automium://apps`, `automium://fixtures`, `automium://contracts/planner-adapter-v1`, `automium://contracts/replay-event-v1`, `automium://contracts/semantic-snapshot-v1`, `draft_journey`, `debug_failed_run`, and `compare_planner_backends`.
  - Failure coverage includes unsupported resource URIs and prompt inputs that omit required identifiers.

### Implementation

- [ ] Step 3.2: **Automated** Implement fixed resource handlers from package exports and compact contract summaries.
  - Files: modify `packages/mcp-server/src/resources.ts`, `packages/mcp-server/src/schemas.ts`, `packages/mcp-server/src/errors.ts`
  - Reuse `packages/benchmark/src/corpus.ts`, `packages/contracts/src/planner-adapter.ts`, `packages/contracts/src/replay-event.ts`, and `packages/contracts/src/semantic-snapshot.ts`.
  - Do not read arbitrary files or expose filesystem paths beyond checked-in contract references already represented by package exports.
- [ ] Step 3.3: **Automated** Implement prompt handlers for journey drafting, failed-run debugging, and planner comparison.
  - Files: modify `packages/mcp-server/src/prompts.ts`
  - Prompts should guide coding agents toward the owned corpus, frozen planner intent vocabulary, bounded recovery, artifact/replay interpretation, and modeled planner comparison.
- [ ] Step 3.4: **Automated** Ensure prompt copy preserves v1 maturity boundaries.
  - Files: modify `packages/mcp-server/src/prompts.ts`
  - Prompt guidance must avoid claiming live browser evidence, production artifact retrieval, credential access, or provider-backed planner execution.

### Green

- [ ] Step 3.5: **Automated** Make the resource and prompt suites pass and run the full MCP package test slice.
  - Commands: `pnpm exec vitest run packages/mcp-server/tests`, `pnpm exec tsc --noEmit`

### Milestone

- [ ] Resources and prompts complete.

Acceptance criteria:

- All five v1 resources are registered and limited to the fixed URI set.
- All three v1 prompts are registered and validate required inputs.
- Resources do not expose arbitrary filesystem reads.
- Prompt guidance separates modeled contract outputs from live execution.
- All phase tests pass.
- No regressions.

## Next Step Plan — Step 3.1 (Phase 3 red-phase resource + prompt contract tests)

### Execution Profile
- **Mode:** implementation-safe (test-only edits, no behavior changes under `packages/mcp-server/src/`)
- **Depends on:** Phase 2 complete — seven v1 tools green, modeled metadata wired through every modeled tool response
- **Owns:** `packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts` (new)

### What to build
Step 3.1 is the red phase for Phase 3. Write a single new vitest contract suite that exercises the five fixed v1 resources and three prompt templates. The suite MUST fail at first run because the resource and prompt handlers do not yet exist — in Phase 1 only descriptors were registered in `packages/mcp-server/src/resources.ts` and `packages/mcp-server/src/prompts.ts`; call-time handlers (the equivalent of `callAutomiumMcpTool`) do not exist yet. The suite lands the shape that Step 3.2/3.3 will fill in.

### Files to create/modify
- `packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts` — new file. Mirror the shape of `packages/mcp-server/tests/mcp-tools.contract.test.ts` (`describe` per resource/prompt, use a shared `createAutomiumMcpServer()` helper plus the not-yet-exported `readAutomiumMcpResource(server, uri)` / `getAutomiumMcpPrompt(server, name, args)` helpers — Step 3.2/3.3 will add those exports to `resources.ts` and `prompts.ts`).
- No `src/` edits in Step 3.1. If the not-yet-exported test helpers cause TypeScript module-resolution errors that block vitest from even loading the file, introduce minimal skeleton exports in `resources.ts` / `prompts.ts` that throw `AutomiumMcpError("unsupported_v1_operation", …)` — mirror the Step 2.2 skeleton pattern.

### Technical decisions

**Resources covered (5 tests, one per resource URI)**
- `automium://apps` — happy path: resource payload contains `authorizedBenchmarkApps` entries with `id`, `name`, `kind`, `environmentProfileId`.
- `automium://fixtures` — happy path: payload contains `benchmarkFixtureManifest` entries with `id`, `appId`, `description`.
- `automium://contracts/planner-adapter-v1` — happy path: payload surfaces a compact summary of `packages/contracts/src/planner-adapter.ts` exports (intents, envelope schema version) without filesystem reads.
- `automium://contracts/replay-event-v1` — happy path: payload surfaces the replay event contract version and kinds.
- `automium://contracts/semantic-snapshot-v1` — happy path: payload surfaces the semantic snapshot contract version and shape.

**Resources failure coverage (1 test)**
- Any URI outside the fixed v1 set (e.g. `automium://unknown`, `automium://apps/../etc/passwd`, `file:///etc/passwd`) throws `AutomiumMcpError("unsupported_resource_uri", …)`.

**Prompts covered (3 happy-path tests)**
- `draft_journey` — accepts `{ appId, fixtureId, intent, goal }`, returns a messages array that references the owned corpus plus the frozen planner intent vocabulary. Modeled; must NOT imply live browser execution.
- `debug_failed_run` — accepts `{ runId, artifactManifestRef, verdict }`, returns guidance referencing artifact/replay interpretation and bounded recovery.
- `compare_planner_backends` — accepts `{ appIds, planners, corpusVersion }`, returns guidance referencing `comparePlannerBackends` semantics plus modeled-output disclaimers.

**Prompts failure coverage (2 tests)**
- Required-identifier omission — each prompt rejects empty-string / missing required fields with `AutomiumMcpError("unsupported_v1_operation", …)` or a dedicated prompt-input error class if Step 3.3 adds one. Use `unsupported_v1_operation` for Step 3.1 assertions and upgrade if Step 3.3 introduces a better error code.
- Unknown prompt name — requesting a prompt not in the v1 set throws `AutomiumMcpError("unsupported_v1_operation", …)`.

**Total: 11 failing tests at Step 3.1 red** (5 resource happy + 1 resource failure + 3 prompt happy + 2 prompt failure).

### Test expectations
- `pnpm exec vitest run packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts` → 1 file / 11 tests failing cleanly with missing-export or unsupported-operation errors (NOT import/syntax errors).
- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` → still 25/25 passing.
- `pnpm exec tsc --noEmit` → pass (may require the minimal skeleton exports noted above).
- `pnpm test:run` → 53 passing files + 1 expected-failing new file, 221 passing / 11 failing tests total; no regressions elsewhere.
- `git diff --check` → clean.

### Acceptance criteria
- New test file exists, imports compile, vitest loads the file.
- All 11 tests fail with a clean "handler missing" or `unsupported_v1_operation` signal.
- No `src/` behavior changes beyond optional skeleton exports.
- `pnpm test:run` shows no regressions in the 25 MCP tool tests or any other suite.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 3.1 as scoped above.
2. Validate: new resource/prompt suite fails as expected + MCP tool suite still green + `pnpm exec tsc --noEmit` + `git diff --check` + `pnpm test:run`.
3. Mark Step 3.1 done in `tasks/todo.md` and update `tasks/history.md` with the red-phase breakdown.
4. Commit and push to `master` via `/commit-and-push-by-feature`.
5. Skip deploy (no `deploy.md` or `tasks/deploy.md` contract exists).
6. Write the Step 3.2 plan (resource handler implementation) into `tasks/todo.md` as a self-contained handoff.
7. Ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Call `EnterPlanMode`, write a brief pass-through plan referencing `tasks/todo.md`, call `ExitPlanMode`, and stop before implementing Step 3.2. Do not call `ExitPlanMode` from normal mode. If `EnterPlanMode` is denied, stop and ask the user to explicitly run `/plan` for Step 3.2.
