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
- [ ] Step 2.3: **Automated** Implement `automium_compile_journey` over the control-plane compiler contract.
  - Files: modify `packages/mcp-server/src/tools.ts`
  - Reuse `apps/control-plane/src/control-plane-domain.ts` for `validateJourneyDefinition` and `compileJourneyDefinition`, while preserving the spec input shape and validation error response.
- [ ] Step 2.4: **Automated** Implement `automium_create_run_submission` over the control-plane run model.
  - Files: modify `packages/mcp-server/src/tools.ts`
  - Reuse `createRunSubmission` and add MCP boundary validation that planner metadata includes non-empty `id`, `vendor`, and `model`.
- [ ] Step 2.5: **Automated** Implement replay and artifact tools over replay-console and artifacts contracts.
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

## Next Step Plan — Step 2.3 (automium_compile_journey)

### Execution Profile
- **Mode:** implementation-safe (serial, single-package edits, no cross-package surface changes)
- **Depends on:** Step 2.2 (dispatcher landed with corpus-discovery branches green)
- **Owns:** `packages/mcp-server/src/tools.ts` (primary), `packages/mcp-server/src/schemas.ts` (named modeled-output type only if needed)

### What to build
Replace the `unsupported_v1_operation` placeholder for `automium_compile_journey` with a real branch that delegates to `compileJourneyDefinition` from `apps/control-plane/src/control-plane-domain.ts`, preserves the spec input shape, and maps validation failures to MCP-safe error codes. This keeps the dispatcher signature from Step 2.2 unchanged.

### Files to create/modify
- `packages/mcp-server/src/tools.ts` — add a new branch handler `handleCompileJourney(args)` called from the `"automium_compile_journey"` switch case. Keep existing corpus-discovery branches and the `unsupported_v1_operation` placeholders for Steps 2.4–2.7.
- `packages/mcp-server/src/schemas.ts` — add a named `AutomiumModeledOutputMetadata` type if not already present (check before adding; Step 2.1 test uses `expectModeledMetadata` with `{ modeled, liveBrowserExecuted, providerCallsMade, filesystemMutated }`). The response shape attached to the compile output must satisfy that.
- `packages/mcp-server/src/errors.ts` — no change expected; reuse `invalid_app_id`, `fixture_app_mismatch`, `unsupported_planner_intent`, and `unsupported_v1_operation`.

### Technical decisions
- Response shape (must match Step 2.1 tests exactly):
  - `{ compiled: CompiledJourneyDefinition, modeled: true, liveBrowserExecuted: false, providerCallsMade: false, filesystemMutated: false }`.
  - Build a reusable helper `modeledMetadata()` or a single constant inside `tools.ts` so Steps 2.4–2.7 can reuse it.
- Input parsing: accept `unknown` and narrow defensively without zod. Parse `id`, `appId`, `fixtureId`, `goal`, `steps`, `assertions`, `recovery` from the record with explicit type checks. Coerce arrays defensively; reject malformed shapes with `unsupported_v1_operation`.
- Pre-domain validation order (to map domain errors to distinct MCP codes before hitting `compileJourneyDefinition`):
  1. If `id` or `goal` is missing/empty → `unsupported_v1_operation` (matches Step 2.1 "rejects empty required identifiers" test that uses the `unsupported_v1_operation` code).
  2. If `appId` is not in `authorizedBenchmarkApps` → `invalid_app_id`.
  3. If `fixtureId` doesn't match an authorized fixture for `appId` → `fixture_app_mismatch`.
  4. If any step intent is outside `PLANNER_INTENT_VOCABULARY` (imported from `packages/contracts/src/planner-adapter`) → `unsupported_planner_intent`.
  5. Any other domain validation failure from `compileJourneyDefinition` → `unsupported_v1_operation`.
- Delegate the successful path to `compileJourneyDefinition(journey)` and wrap the result as `{ compiled, ...modeledMetadata }`.
- Do NOT import the SDK; the helper remains a pure function. Keep no reliance on `server.sdkServer`.

### Test expectations
After Step 2.3, the 5 `automium_compile_journey` tests must go green:
- "compiles a corpus-fixture journey" — result matches `compileJourneyDefinition(validJourneyInput)` + modeled metadata true/false flags.
- "rejects unsupported planner intents" — throws `unsupported_planner_intent`.
- "rejects fixture/app mismatch" — throws `fixture_app_mismatch`.
- "rejects unauthorized app ids" — throws `invalid_app_id`.
- "rejects empty required identifiers" — throws `unsupported_v1_operation` (for both empty `id` and empty `goal`).

The remaining 14 tests (for `automium_create_run_submission`, `automium_get_replay_summary`, `automium_get_artifact_manifest`, `automium_compare_planners`) stay failing, but the net failing count should drop to around 10–11 since some of those tests will still pass via the residual `unsupported_v1_operation` fallback on expected-error paths.

### Acceptance criteria
- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` — the 5 compile-journey tests pass; record the new pass/fail breakdown in `tasks/history.md`.
- `pnpm exec tsc --noEmit` passes.
- `git diff --check` clean.
- `pnpm test:run` — no regressions in other suites.

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 2.3 as scoped above.
2. Validate: MCP tool contract tests + `pnpm exec tsc --noEmit` + `git diff --check` + `pnpm test:run`.
3. Mark Step 2.3 done in `tasks/todo.md` and update `tasks/history.md`.
4. Commit and push to `master` via `/commit-and-push-by-feature`.
5. Skip deploy (no `deploy.md` or `tasks/deploy.md` contract exists).
6. Write the Step 2.4 plan (`automium_create_run_submission`) into `tasks/todo.md` as a self-contained handoff.
7. Ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Call `EnterPlanMode`, write a brief pass-through plan referencing `tasks/todo.md`, call `ExitPlanMode`, and stop before implementing Step 2.4. Do not call `ExitPlanMode` from normal mode. If `EnterPlanMode` is denied, stop and ask the user to explicitly run `/plan` for Step 2.4.
