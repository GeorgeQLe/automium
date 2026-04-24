# Current Phase: MCP Server Resources and Prompts

This file tracks Phase 3 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 2 has been archived in [tasks/phases/mcp-phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/mcp-phase-2.md); the full phased plan remains in `tasks/roadmap.md`.

## Phase 3: Resources And Prompts

Goal: register the fixed v1 MCP resources and prompt templates without exposing arbitrary repository reads or speculative live-runtime guidance.

> Test strategy: tdd

### Tests First

- [x] Step 3.1: **Automated** Write failing resource and prompt contract tests.
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

## Next Step Plan — Step 3.2 (Phase 3 green-phase resource handler implementation)

### Execution Profile
- **Mode:** implementation-safe (test-green; additive changes under `packages/mcp-server/src/`; reuse existing package exports — no filesystem reads)
- **Depends on:** Step 3.1 red-phase suite landed at `packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts`
- **Owns:** `packages/mcp-server/src/resources.ts`, `packages/mcp-server/src/schemas.ts` (optional type additions only), `packages/mcp-server/src/errors.ts` (already has `unsupported_resource_uri`)

### What to build
Flip the 5 resource happy-path tests + the 1 resource-failure test from red to green by implementing a `readAutomiumMcpResource(server, uri)` helper in `packages/mcp-server/src/resources.ts`. The function must dispatch on the URI string and return compact summaries sourced from existing package exports — **no filesystem reads**, no dynamic file path resolution, no arbitrary repository access. Prompts (3 happy-path + 2 failure tests) remain red and will be handled in Steps 3.3–3.4.

### Files to create/modify
- `packages/mcp-server/src/resources.ts` — add `export function readAutomiumMcpResource(server: AutomiumMcpServer, uri: string): AutomiumMcpResourcePayload`. Dispatch switch over `uri`:
  - `"automium://apps"` → `{ authorizedBenchmarkApps }` from `packages/benchmark/src/corpus.ts`, shaped with `{ id, name, kind, environmentProfileId }` per entry.
  - `"automium://fixtures"` → `{ benchmarkFixtureManifest }` from the same corpus, shaped with `{ id, appId, description }` per entry (include any additional fields present in the source so tests that look at shape still pass).
  - `"automium://contracts/planner-adapter-v1"` → `{ intentVocabulary: [...PLANNER_INTENT_VOCABULARY], intentSchemaVersion, requiredMethods, metadataFields }` (reuse `PLANNER_INTENT_VOCABULARY`, `plannerAdapterRequiredMethods`, `plannerAdapterMetadataFields`, and the `PLANNER_ADAPTER_INTENT_SCHEMA_VERSION`-equivalent export from `packages/contracts/src/planner-adapter.ts`; grep the file before picking the exact constant name).
  - `"automium://contracts/replay-event-v1"` → `{ schemaVersion: REPLAY_EVENT_SCHEMA_VERSION, requiredFields: [...replayEventRequiredFields], phases: [...replayEventPhaseOrder] }`.
  - `"automium://contracts/semantic-snapshot-v1"` → `{ schemaVersion: SEMANTIC_SNAPSHOT_SCHEMA_VERSION, requiredFields: [...semanticSnapshotRequiredFields], interactiveElementRequiredFields: [...interactiveElementRequiredFields] }`.
  - Anything else → `throw new AutomiumMcpError("unsupported_resource_uri", …)`.
- `packages/mcp-server/src/schemas.ts` — optional: add a `AutomiumMcpResourcePayload` union type if it helps typing. Keep minimal.
- `packages/mcp-server/src/errors.ts` — no change (`unsupported_resource_uri` already exists).
- Do **not** touch `prompts.ts` — prompts stay red through Step 3.3.

### Technical decisions
- **Server arg is unused but required** for symmetry with `callAutomiumMcpTool(server, name, args)`. Accept it and ignore it (or put the resource registry behind the server later). Do not add SDK dependencies.
- **No dynamic file reads.** All payload data comes from TypeScript `import`s of existing constants/types.
- **Shape > exact fields.** The Step 3.1 tests only check that required fields are present and have the right type; additional descriptive fields are fine. Match each source export exactly and `as const` / spread into mutable arrays where needed so the payload is JSON-serializable.
- **Error path:** URI validation is a simple `switch`/equality check against the 5 frozen strings. Do not try to parse traversal-style URIs — just reject anything not in the set.

### Test expectations
- `pnpm exec vitest run packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts` → 6 passing (5 resource happy + 1 resource failure) / 5 failing (3 prompt happy + 2 prompt failure, awaiting Step 3.3).
- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` → still 25/25 passing.
- `pnpm exec tsc --noEmit` → pass.
- `pnpm test:run` → 53 passing files + 1 still-expected-failing new MCP resources/prompts file, 227 passing / 5 failing total; no regressions elsewhere.
- `git diff --check` → clean.

### Acceptance criteria
- `readAutomiumMcpResource` exported from `packages/mcp-server/src/resources.ts`.
- All 5 resource URIs return payloads sourced from existing package exports, no filesystem access.
- Unsupported URIs throw `AutomiumMcpError("unsupported_resource_uri", …)`.
- Prompt tests remain failing as intended for Step 3.3.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 3.2 as scoped above.
2. Validate: resource tests green + 25 MCP tool tests still green + `pnpm exec tsc --noEmit` + `git diff --check` + `pnpm test:run` shape matches expectation.
3. Mark Step 3.2 done in `tasks/todo.md` and append the green-phase breakdown to `tasks/history.md`.
4. Commit and push to `master` via `/commit-and-push-by-feature`.
5. Skip deploy (no `deploy.md` or `tasks/deploy.md` contract exists).
6. Write the Step 3.3 plan (prompt handler implementation) into `tasks/todo.md` as a self-contained handoff.
7. Ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Call `EnterPlanMode`, write a brief pass-through plan referencing `tasks/todo.md`, call `ExitPlanMode`, and stop before implementing Step 3.3.
