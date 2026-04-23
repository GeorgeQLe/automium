# Current Phase: MCP Server Tool Adapters

This file tracks Phase 2 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). The full phased plan is in `tasks/roadmap.md`; this active document intentionally contains only the current phase.

## Phase 2: Tool Adapters

Goal: implement the seven v1 MCP tools by validating inputs at the MCP boundary and delegating behavior to existing Automium package exports.

> Test strategy: tdd

### Tests First

- [x] Step 2.1: **Automated** Write failing tool contract tests for successful calls and validation failures.
  - Files: create `packages/mcp-server/tests/mcp-tools.contract.test.ts`
  - Tests cover: `automium_list_apps`, `automium_list_fixtures`, `automium_compile_journey`, `automium_create_run_submission`, `automium_get_replay_summary`, `automium_get_artifact_manifest`, and `automium_compare_planners`.
  - Failure coverage includes unauthorized app IDs, fixture/app mismatch, unsupported planner intents, malformed planner metadata, unsupported artifact kinds, absolute artifact entry paths, unsupported corpus versions, empty required fields, and repetitions normalized to at least one.

### Implementation

- [x] Step 2.2: **Automated** Implement corpus discovery tools over the owned benchmark package.
  - Files: modify `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/schemas.ts`, `packages/mcp-server/src/errors.ts`
  - Reuse `packages/benchmark/src/corpus.ts` exports for app, fixture, environment profile, and corpus version data.
- [x] Step 2.3: **Automated** Implement `automium_compile_journey` over the control-plane compiler contract.
  - Files: modify `packages/mcp-server/src/tools.ts`
  - Reuse `apps/control-plane/src/control-plane-domain.ts` for `validateJourneyDefinition` and `compileJourneyDefinition`, while preserving the spec input shape and validation error response.
- [x] Step 2.4: **Automated** Implement `automium_create_run_submission` over the control-plane run model.
  - Files: modify `packages/mcp-server/src/tools.ts`
  - Reuse `createRunSubmission` and add MCP boundary validation that planner metadata includes non-empty `id`, `vendor`, and `model`.
- [x] Step 2.5: **Automated** Implement replay and artifact tools over replay-console and artifacts contracts.
  - Files: modify `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/schemas.ts`
  - Reuse `apps/replay-console/src/replay-console-domain.ts` for `summarizeReplayRun` and `packages/artifacts/src/artifacts-domain.ts` for `ARTIFACT_KINDS` and `createArtifactManifest`.
  - Reject absolute artifact paths and unsupported artifact kinds before domain delegation.
- [ ] Step 2.6: **Automated** Implement `automium_compare_planners` over the benchmark-runner report model.
  - Files: modify `packages/mcp-server/src/tools.ts`
  - Reuse `packages/benchmark-runner/src/benchmark-runner-domain.ts` and add deterministic MCP-safe errors for unsupported corpus versions and malformed planner metadata.
- [ ] Step 2.7: **Automated** Add modeled-output markers to every tool that models instead of executes work.
  - Files: modify `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/schemas.ts`
  - The run, replay, artifact, and planner-comparison responses must explicitly state that no browser execution, provider calls, persistence, queueing, or artifact fetching occurred.

### Green

- [ ] Step 2.8: **Automated** Make the MCP tool suites pass and verify no regressions in reused domain packages.
  - Commands: `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts apps/control-plane/tests packages/artifacts/tests apps/replay-console/tests packages/benchmark-runner/tests packages/benchmark/tests packages/contracts/tests`, `pnpm exec tsc --noEmit`

### Milestone

- [ ] Tool adapters complete.

Acceptance criteria:

- All seven v1 tools are callable through the MCP server registration surface.
- Tool calls validate app IDs, fixture IDs, planner intent vocabulary, planner metadata, corpus version, artifact kinds, and relative artifact paths.
- Tool calls delegate to existing Automium domain functions where those functions exist.
- Modeled responses clearly say they were not live browser executions.
- All phase tests pass.
- No regressions.

## Step 2.1 Red Confirmation

- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` → failed at 1 file / 25 tests (expected red). All failures root-caused to the missing `callAutomiumMcpTool` export from `packages/mcp-server/src/tools.ts` (to be implemented in Step 2.2+). No syntax or import typos: imported domain helpers (`compileJourneyDefinition`, `createRunSubmission`, `summarizeReplayRun`, `createArtifactManifest`, `comparePlannerBackends`, corpus/artifact constants, `AutomiumMcpError`) resolve cleanly.
- `pnpm exec tsc --noEmit` → passes.
- `git diff --check` → clean.

## Step 2.2 Completion Summary

- Implemented `callAutomiumMcpTool(server, name, args)` dispatcher in `packages/mcp-server/src/tools.ts` plus `automium_list_apps` + `automium_list_fixtures` branches. Other tools throw `AutomiumMcpError("unsupported_v1_operation", …)` placeholders.
- Contract suite breakdown: 10 passing / 15 failing in `packages/mcp-server/tests/mcp-tools.contract.test.ts` (the expected 6 corpus-discovery tests plus 4 later-step tests whose expected error happens to be `unsupported_v1_operation`).
- `pnpm exec tsc --noEmit` → pass. `git diff --check` → clean. `pnpm test:run` → 206 passing / 15 failing (MCP suite in-progress); no regressions elsewhere.

## Step 2.3 Completion Summary

- Implemented `handleCompileJourney(args)` in `packages/mcp-server/src/tools.ts` and wired it into the `automium_compile_journey` dispatch branch. The handler parses inputs defensively from `unknown` and enforces validation order: empty-required → `invalid_app_id` → `fixture_app_mismatch` → `unsupported_planner_intent` → `unsupported_v1_operation`. Happy path delegates to `compileJourneyDefinition` and wraps with shared `modeledMetadata` (`modeled: true`, `liveBrowserExecuted: false`, `providerCallsMade: false`, `filesystemMutated: false`).
- Contract suite breakdown: 14 passing / 11 failing in `packages/mcp-server/tests/mcp-tools.contract.test.ts` (5 compile-journey tests flipped green on top of Step 2.2's 10).
- `pnpm exec tsc --noEmit` → pass. `git diff --check` → clean. `pnpm test:run` → 210 passing / 11 failing; no regressions outside the in-progress MCP suite.

## Step 2.4 Completion Summary

- Implemented `handleCreateRunSubmission(args)` in `packages/mcp-server/src/tools.ts` and wired it into the `automium_create_run_submission` dispatch branch. The handler parses run inputs defensively from `unknown` and applies pre-domain validation in the order non-object-args/empty-required → `malformed_planner_metadata` → `invalid_app_id` → `fixture_app_mismatch` → `unsupported_v1_operation`. Happy path delegates to `createRunSubmission` and wraps with shared `modeledMetadata` as `{ submission, ...modeledMetadata }`.
- Contract suite breakdown: 17 passing / 8 failing in `packages/mcp-server/tests/mcp-tools.contract.test.ts` (3 create-run-submission tests flipped green on top of Step 2.3's 14).
- `pnpm exec tsc --noEmit` → pass. `git diff --check` → clean. `pnpm test:run` → 213 passing / 8 failing; no regressions outside the in-progress MCP suite.

## Next Step Plan — Step 2.6 (automium_compare_planners)

### Execution Profile
- **Mode:** implementation-safe (serial, single-package edits, no cross-package surface changes)
- **Depends on:** Step 2.5 (dispatcher + replay/artifact branches landed, `modeledMetadata` constant in place)
- **Owns:** `packages/mcp-server/src/tools.ts` (primary)

### What to build
Replace the `unsupported_v1_operation` placeholder for `automium_compare_planners` with a real handler that delegates to `comparePlannerBackends` from `packages/benchmark-runner/src/benchmark-runner-domain.ts`. Enforce MCP boundary validation for unsupported corpus versions, malformed planner metadata, and empty `appIds` arrays. Leave Step 2.7 placeholder alone.

### Files to create/modify
- `packages/mcp-server/src/tools.ts` — add `handleComparePlanners(args)` and wire it into the `automium_compare_planners` switch case. Add import for `BENCHMARK_CORPUS_VERSION` from `packages/benchmark/src/corpus` and `comparePlannerBackends` + `BenchmarkComparisonReport` from `packages/benchmark-runner/src/benchmark-runner-domain`. Reuse existing helpers (`isPlainObject`, `readRequiredString`, `readArray`, `parsePlannerMetadata`, `modeledMetadata`).

### Technical decisions

**Response shape (exact):** `{ report: BenchmarkComparisonReport, modeled: true, liveBrowserExecuted: false, providerCallsMade: false, filesystemMutated: false }`.

**Input parsing:** narrow `unknown` to `{ corpusVersion, appIds, planners, repetitions }`:
- `corpusVersion`: required non-empty string. If not equal to `BENCHMARK_CORPUS_VERSION` → `unsupported_corpus_version`.
- `appIds`: required array of strings. If empty → `unsupported_v1_operation`. (Do not reject unknown app IDs at the boundary — the domain filters them; the contract test passes `["foundry", "altitude"]`.)
- `planners`: required array of at least one planner metadata object; each validated with existing `parsePlannerMetadata` helper → `malformed_planner_metadata` on any violation.
- `repetitions`: required finite number (can be `0`; domain normalizes to `>= 1`). Non-number → `unsupported_v1_operation`.

**Pre-domain validation order:**
1. `args` not a plain object → `unsupported_v1_operation`.
2. Missing/empty `corpusVersion` or `appIds` not an array → `unsupported_v1_operation`.
3. `corpusVersion` !== `BENCHMARK_CORPUS_VERSION` → `unsupported_corpus_version`.
4. `appIds` empty array → `unsupported_v1_operation`.
5. Any `appId` entry not a string → `unsupported_v1_operation`.
6. `planners` not an array or empty → `unsupported_v1_operation`.
7. Any planner entry fails `parsePlannerMetadata` → `malformed_planner_metadata`.
8. `repetitions` not a finite number → `unsupported_v1_operation`.
9. Any other domain failure → `unsupported_v1_operation`.

Delegate successful path to `comparePlannerBackends({ corpusVersion, appIds, planners, repetitions })` and wrap as `{ report, ...modeledMetadata }`.

Do NOT import the SDK; keep the dispatcher a pure function.

### Test expectations
After Step 2.6 the 4 `automium_compare_planners` tests must go green:
- "returns a modeled comparison report" — `result.report` equals `comparePlannerBackends(validCompareInput)` and `reportVersion === "v1"`, modeled metadata matches.
- "rejects unsupported corpus versions" — throws `unsupported_corpus_version` for `corpusVersion: "v0"`.
- "rejects malformed planner metadata" — throws `malformed_planner_metadata` when a planner has empty `vendor`.
- "normalizes repetitions to at least one" — `result.report.plannerReports[*].repetitions >= 1` when `repetitions: 0` is passed.
- "rejects empty appIds arrays" — throws `unsupported_v1_operation` for `appIds: []`.

After Step 2.6 the net MCP suite should be 25 passing / 0 failing. (Step 2.7 adds modeled-output markers, which are already present in all modeled handlers — confirm during 2.7 that no additional test fixtures are affected.)

### Acceptance criteria
- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` — all 25 tests pass; record the pass/fail breakdown in `tasks/history.md`.
- `pnpm exec tsc --noEmit` passes.
- `git diff --check` clean.
- `pnpm test:run` — no regressions in other suites.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 2.6 as scoped above.
2. Validate: MCP tool contract tests + `pnpm exec tsc --noEmit` + `git diff --check` + `pnpm test:run`.
3. Mark Step 2.6 done in `tasks/todo.md` and update `tasks/history.md`.
4. Commit and push to `master` via `/commit-and-push-by-feature`.
5. Skip deploy (no `deploy.md` or `tasks/deploy.md` contract exists).
6. Write the Step 2.7 plan (modeled-output markers audit) into `tasks/todo.md` as a self-contained handoff.
7. Ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Call `EnterPlanMode`, write a brief pass-through plan referencing `tasks/todo.md`, call `ExitPlanMode`, and stop before implementing Step 2.7. Do not call `ExitPlanMode` from normal mode. If `EnterPlanMode` is denied, stop and ask the user to explicitly run `/plan` for Step 2.7.

---

## Prior Plan (archived) — Step 2.5 (automium_get_replay_summary + automium_get_artifact_manifest)

### Execution Profile
- **Mode:** implementation-safe (serial, single-package edits, no cross-package surface changes)
- **Depends on:** Step 2.4 (dispatcher + create-run-submission branch landed, `modeledMetadata` constant in place)
- **Owns:** `packages/mcp-server/src/tools.ts` (primary), `packages/mcp-server/src/schemas.ts` (if any new tool descriptor fields required — unlikely)

### What to build
Replace the `unsupported_v1_operation` placeholders for `automium_get_replay_summary` and `automium_get_artifact_manifest` with real handlers that delegate to `summarizeReplayRun` (from `apps/replay-console/src/replay-console-domain.ts`) and `createArtifactManifest` (from `packages/artifacts/src/artifacts-domain.ts`). Enforce MCP boundary validation: empty required fields → `unsupported_v1_operation`; unsupported artifact kinds → `invalid_artifact_kind`; absolute artifact paths → `unsupported_v1_operation`; unauthorized owning app IDs → `invalid_app_id`. Steps 2.6–2.7 placeholders untouched.

### Files to create/modify
- `packages/mcp-server/src/tools.ts` — add `handleGetReplaySummary(args)` and `handleGetArtifactManifest(args)`, wire both into the switch. Reuse existing helpers (`isPlainObject`, `readRequiredString`, `readArray`, `assertAuthorizedAppId`, `modeledMetadata`).

### Technical decisions

**`automium_get_replay_summary`**
- Response shape: `{ summary: ReplaySummary, ...modeledMetadata }`.
- Input parsing: narrow `unknown` to `{ runId, verdict, retryCount, artifactManifestRef }`. Validate `runId`, `verdict`, `artifactManifestRef` are non-empty strings; `retryCount` is a non-negative finite number (or allow delegation to the domain if already validated there — verify).
- Empty-required-field → `unsupported_v1_operation`.
- Delegate to `summarizeReplayRun(input)` and wrap as `{ summary, ...modeledMetadata }`. Any domain throw → `unsupported_v1_operation`.

**`automium_get_artifact_manifest`**
- Response shape: `{ manifest: ArtifactManifest, ...modeledMetadata }`.
- Input parsing: narrow `unknown` to `{ runId, appId, root, entries }` where `entries: { kind, path }[]`.
- Pre-domain validation order:
  1. `args` not a plain object → `unsupported_v1_operation`.
  2. Missing/empty required string field (`runId`, `appId`, `root`) → `unsupported_v1_operation`.
  3. Unauthorized `appId` → `invalid_app_id`.
  4. `entries` not an array or any entry not a plain object → `unsupported_v1_operation`.
  5. Any entry `kind` not in `ARTIFACT_KINDS` → `invalid_artifact_kind`.
  6. Any entry `path` absolute (starts with `/`) → `unsupported_v1_operation`.
  7. Any other domain failure → `unsupported_v1_operation`.
- Delegate to `createArtifactManifest({ runId, root, entries })` (appId used only for authorization check, not passed to domain). Wrap as `{ manifest, ...modeledMetadata }`.

### Test expectations
After Step 2.5, the 2 replay + 4 artifact tests must go green (6 new passes):
- `automium_get_replay_summary`: happy path, rejects empty required fields (3 fields × 1 assertion = 3 error assertions in one test).
- `automium_get_artifact_manifest`: happy path, rejects unsupported artifact kinds (`invalid_artifact_kind`), rejects absolute entry paths (`unsupported_v1_operation`), rejects unauthorized owning app IDs (`invalid_app_id`).

After Step 2.5 the net MCP suite should be roughly 23 passing / 2 failing (the remaining 2 failing tests in `automium_compare_planners` await Step 2.6).

### Acceptance criteria
- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` — the 6 replay + artifact tests pass; record the new pass/fail breakdown in `tasks/history.md`.
- `pnpm exec tsc --noEmit` passes.
- `git diff --check` clean.
- `pnpm test:run` — no regressions in other suites.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 2.5 as scoped above.
2. Validate: MCP tool contract tests + `pnpm exec tsc --noEmit` + `git diff --check` + `pnpm test:run`.
3. Mark Step 2.5 done in `tasks/todo.md` and update `tasks/history.md`.
4. Commit and push to `master` via `/commit-and-push-by-feature`.
5. Skip deploy (no `deploy.md` or `tasks/deploy.md` contract exists).
6. Write the Step 2.6 plan (`automium_compare_planners`) into `tasks/todo.md` as a self-contained handoff.
7. Ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Call `EnterPlanMode`, write a brief pass-through plan referencing `tasks/todo.md`, call `ExitPlanMode`, and stop before implementing Step 2.6. Do not call `ExitPlanMode` from normal mode. If `EnterPlanMode` is denied, stop and ask the user to explicitly run `/plan` for Step 2.6.

---

## Prior Plan (archived) — Step 2.4 (automium_create_run_submission)

### Execution Profile
- **Mode:** implementation-safe (serial, single-package edits, no cross-package surface changes)
- **Depends on:** Step 2.3 (dispatcher + compile-journey branch landed, `modeledMetadata` constant in place)
- **Owns:** `packages/mcp-server/src/tools.ts` (primary)

### What to build
Replace the `unsupported_v1_operation` placeholder for `automium_create_run_submission` with a real branch that delegates to `createRunSubmission` from `apps/control-plane/src/control-plane-domain.ts`, adds MCP boundary validation for planner metadata, and wraps the output with the shared modeled metadata. Leave Steps 2.5–2.7 placeholders alone.

### Files to create/modify
- `packages/mcp-server/src/tools.ts` — add a new branch handler `handleCreateRunSubmission(args)` called from the `"automium_create_run_submission"` switch case. Reuse the existing `modeledMetadata`, `isPlainObject`, `readRequiredString`, and `assertAuthorizedAppId` helpers. Keep compile-journey and corpus-discovery branches unchanged.

### Technical decisions
- Response shape (must match Step 2.1 tests exactly): `{ submission: RunSubmission, modeled: true, liveBrowserExecuted: false, providerCallsMade: false, filesystemMutated: false }` — i.e. `{ submission, ...modeledMetadata }`.
- Input parsing: accept `unknown` and narrow to `{ journeyId, appId, fixtureId, planner, environmentProfileId }`. Use `readRequiredString` for top-level string fields; reject non-object `args` with `unsupported_v1_operation`.
- Planner metadata validation (MCP boundary, before domain): planner must be a plain object with non-empty string `id`, `vendor`, and `model`. Missing field, wrong type, or empty string on any of the three → `malformed_planner_metadata`. The Step 2.1 test exercises an object with no `id` key, which must also error out with `malformed_planner_metadata` rather than a type-level crash.
- Pre-domain validation order:
  1. `args` not a plain object → `unsupported_v1_operation`.
  2. Missing/empty required string field on top-level (`journeyId`, `appId`, `fixtureId`, `environmentProfileId`) → `unsupported_v1_operation`.
  3. Malformed planner (missing key, wrong type, or empty string) → `malformed_planner_metadata`.
  4. Unauthorized `appId` → `invalid_app_id` (via `assertAuthorizedAppId`).
  5. Fixture/app mismatch (`fixtureMatchesApp` equivalent via `benchmarkFixtureManifest.find`) → `fixture_app_mismatch`.
  6. Any other domain failure from `createRunSubmission` → `unsupported_v1_operation`.
- Delegate the successful path to `createRunSubmission({ journeyId, appId, fixtureId, planner, environmentProfileId })` and wrap the result as `{ submission, ...modeledMetadata }`.
- Do NOT import the SDK; the helper stays a pure function.

### Test expectations
After Step 2.4, the 3 `automium_create_run_submission` tests must go green:
- "returns a contract-shaped submission with modeled metadata" — `result.submission` equals `createRunSubmission(validRunInput)` and modeled metadata flags match.
- "rejects malformed planner metadata" — each of `{id: ""}`, `{vendor: ""}`, `{model: ""}`, and the key-missing `{vendor, model}` case throws `malformed_planner_metadata`.
- "rejects unauthorized app ids" — throws `invalid_app_id`.

After Step 2.4 the net MCP suite should drop to roughly 8 failing / 17 passing (since Steps 2.5–2.7 still fall through to `unsupported_v1_operation`, some of their expected-error tests remain incidentally green).

### Acceptance criteria
- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` — the 3 create-run-submission tests pass; record the new pass/fail breakdown in `tasks/history.md`.
- `pnpm exec tsc --noEmit` passes.
- `git diff --check` clean.
- `pnpm test:run` — no regressions in other suites.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 2.4 as scoped above.
2. Validate: MCP tool contract tests + `pnpm exec tsc --noEmit` + `git diff --check` + `pnpm test:run`.
3. Mark Step 2.4 done in `tasks/todo.md` and update `tasks/history.md`.
4. Commit and push to `master` via `/commit-and-push-by-feature`.
5. Skip deploy (no `deploy.md` or `tasks/deploy.md` contract exists).
6. Write the Step 2.5 plan (`automium_get_replay_summary` + `automium_get_artifact_manifest`) into `tasks/todo.md` as a self-contained handoff.
7. Ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Call `EnterPlanMode`, write a brief pass-through plan referencing `tasks/todo.md`, call `ExitPlanMode`, and stop before implementing Step 2.5. Do not call `ExitPlanMode` from normal mode. If `EnterPlanMode` is denied, stop and ask the user to explicitly run `/plan` for Step 2.5.

