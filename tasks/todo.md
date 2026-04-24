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

- [x] Step 3.2: **Automated** Implement fixed resource handlers from package exports and compact contract summaries.
  - Files: modify `packages/mcp-server/src/resources.ts`, `packages/mcp-server/src/schemas.ts`, `packages/mcp-server/src/errors.ts`
  - Reuse `packages/benchmark/src/corpus.ts`, `packages/contracts/src/planner-adapter.ts`, `packages/contracts/src/replay-event.ts`, and `packages/contracts/src/semantic-snapshot.ts`.
  - Do not read arbitrary files or expose filesystem paths beyond checked-in contract references already represented by package exports.
- [x] Step 3.3: **Automated** Implement prompt handlers for journey drafting, failed-run debugging, and planner comparison.
  - Files: modify `packages/mcp-server/src/prompts.ts`
  - Prompts should guide coding agents toward the owned corpus, frozen planner intent vocabulary, bounded recovery, artifact/replay interpretation, and modeled planner comparison.
- [x] Step 3.4: **Automated** Ensure prompt copy preserves v1 maturity boundaries.
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

## Next Step Plan — Step 3.5 (Phase 3 green milestone verification sweep)

### Execution Profile
- **Mode:** verification-only (no `src/` edits; no new tests; no behavior changes)
- **Depends on:** Steps 3.1–3.4 landed; `packages/mcp-server/src/resources.ts` and `packages/mcp-server/src/prompts.ts` exporting the v1 handlers with maturity-boundary copy
- **Owns:** nothing — this step runs commands and updates docs/roadmap; only `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, and potentially a new `tasks/phases/mcp-phase-3.md` archive may be touched

### What to build
Run the Phase 3 green milestone verification sweep and close out the phase. No implementation changes are expected. The goal is to prove that the full resource + prompt suite, the MCP tool suite, typecheck, and the full monorepo test run are all green, then mark the Phase 3 milestone complete in `tasks/roadmap.md`, archive Phase 3 under `tasks/phases/mcp-phase-3.md`, and regenerate `tasks/todo.md` around the next roadmap phase.

### Files to create/modify
- No `packages/mcp-server/src/` edits expected.
- `tasks/todo.md` — mark Step 3.5 done after verification; if Phase 3 is the final phase in the MCP roadmap, collapse and archive per the existing archival pattern (see `tasks/phases/mcp-phase-2.md`).
- `tasks/roadmap.md` — mark Phase 3 milestone complete.
- `tasks/phases/mcp-phase-3.md` — new archive of the completed Phase 3 plan, mirroring the structure of `tasks/phases/mcp-phase-2.md`.
- `tasks/history.md` — append the verification-sweep breakdown.

### Technical decisions
- **Pure verification.** If any of the commands below fail or reveal a regression, do NOT patch silently — STOP and re-plan. The Step 3.5 ship contract assumes all checks pass on the first run because Steps 3.1–3.4 already verified the same commands.
- **No new tests.** The optional maturity-boundary assertions were skipped in Step 3.4; if you want to add them, open a new red-phase step, do not smuggle them into the verification sweep.
- **Archival pattern.** Use `tasks/phases/mcp-phase-2.md` as the exact shape template for `tasks/phases/mcp-phase-3.md`. Keep the existing `tasks/phases/phase-*.md` files (from the owned-products roadmap) untouched.

### Test expectations
- `pnpm exec vitest run packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts` → 11/11 passing.
- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` → 25/25 passing.
- `pnpm exec vitest run packages/mcp-server/tests` → both suites green, total 36/36 passing.
- `pnpm exec tsc --noEmit` → pass.
- `pnpm test:run` → 54 passing files, 232/232 passing, 0 failing.
- `git diff --check` → clean.

### Acceptance criteria
- All verification commands green on the first run.
- Phase 3 milestone marked complete in `tasks/roadmap.md`.
- Phase 3 archived under `tasks/phases/mcp-phase-3.md`.
- `tasks/todo.md` regenerated around the next roadmap phase (or closed out if Phase 3 was the final MCP phase).
- `tasks/history.md` appended with the Step 3.5 breakdown.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Run the verification commands above; if any fail, STOP and re-plan.
2. Mark Step 3.5 done in `tasks/todo.md`, mark the Phase 3 milestone done in `tasks/roadmap.md`, archive Phase 3 under `tasks/phases/mcp-phase-3.md`, and append the verification breakdown to `tasks/history.md`.
3. Commit and push to `master` via `/commit-and-push-by-feature`.
4. Skip deploy.
5. Regenerate `tasks/todo.md` around the next roadmap phase (or close out Phase 3 as the final MCP phase) as a self-contained handoff.
6. Ensure `.claude/settings.local.json` retains `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
7. Enter plan mode, write a brief pass-through plan, exit plan mode, and stop before implementing the next step.

---

## Previous Step Plan (shipped) — Step 3.4 (Phase 3 prompt-copy maturity-boundary audit)

Shipped in this session. Added a module-level `MODELED_V1_DISCLAIMER` constant in `packages/mcp-server/src/prompts.ts` and appended it as a trailing system message to all three prompts. Normalized copy in each `build*Prompt` helper to reject forbidden live-execution imperatives ("open", "launch", "navigate", "click", "type", "call/invoke/execute/run the planner", "fetch from storage", "retrieve credentials", "log streaming") and reframed references as modeled / checked-in / identifier-only. Preserved all test-required tokens, function signatures, return shape, error codes, and validation flow. No touches to `resources.ts`, `tools.ts`, `errors.ts`, `schemas.ts`, or `server.ts`. 11/11 resource+prompt suite green, 25/25 tool suite green, `tsc --noEmit` clean, full `pnpm test:run` at 54 files / 232 tests green.

---

## Previous Step Plan (shipped) — Step 3.3 (Phase 3 green-phase prompt handler implementation)

Shipped in `21e1ed7 feat(mcp-server): implement v1 prompt handlers from package exports` and `a7d0dbf docs(tasks): close MCP Step 3.3 and record green-phase breakdown`. Added `getAutomiumMcpPrompt(server, name, args)` in `packages/mcp-server/src/prompts.ts` dispatching the three fixed v1 prompt names, validating required identifiers with `AutomiumMcpError("unsupported_v1_operation", …)`, and embedding the test-required tokens. Phase 3 contract suite at 11/11; full suite at 54 files / 232 tests.

---

## Previous Step Plan (shipped) — Step 3.2 (Phase 3 green-phase resource handler implementation)

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
