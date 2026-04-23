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

- [ ] Step 2.2: **Automated** Implement corpus discovery tools over the owned benchmark package.
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

## Next Step Plan — Step 2.2 (Corpus Discovery Tools)

### Execution Profile
- **Mode:** implementation-safe (serial, single-package edits, no cross-package surface changes)
- **Depends on:** Step 2.1 red (complete on master at `a5bb126`)
- **Owns:** `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/schemas.ts`, `packages/mcp-server/src/errors.ts`

### What to build
Introduce the `callAutomiumMcpTool(server, name, args)` helper in `packages/mcp-server/src/tools.ts` and wire up the two corpus-discovery tools (`automium_list_apps`, `automium_list_fixtures`). This helper is the test-only dispatch surface the Step 2.1 contract tests depend on; Steps 2.3–2.7 will extend it with additional tool branches without changing the helper signature.

### Files to create/modify
- `packages/mcp-server/src/tools.ts` — add the `callAutomiumMcpTool` dispatcher and implement `automium_list_apps` + `automium_list_fixtures`. Preserve the existing `automiumMcpToolDescriptors` export. Other tool branches should throw `AutomiumMcpError("unsupported_v1_operation", …)` as a placeholder to be replaced in Steps 2.3–2.7.
- `packages/mcp-server/src/schemas.ts` — no change expected in 2.2 unless a corpus-discovery response shape needs a named type; if added, keep naming consistent with `AutomiumModeledOutputMetadata`.
- `packages/mcp-server/src/errors.ts` — no change expected; reuse `invalid_app_id` and `fixture_app_mismatch`.

### Technical decisions
- Dispatcher signature: `function callAutomiumMcpTool(server: AutomiumMcpServer, name: string, args: unknown): unknown`. It should not depend on `server.sdkServer`; the `server` parameter is threaded through so Step 4 stdio wiring can reuse the same helper. For now treat unknown tool names as `AutomiumMcpError("unsupported_v1_operation", …)`.
- Response shape (must match the Step 2.1 tests exactly):
  - `automium_list_apps` → `{ apps: readonly AuthorizedBenchmarkApp[] }`; reject any `appId` filter not in `authorizedBenchmarkApps` with `invalid_app_id`.
  - `automium_list_fixtures` → `{ fixtures: readonly BenchmarkFixtureDefinition[] }`; if `appId` filter is present, validate against the authorized set (`invalid_app_id` on miss); if both `appId` and `fixtureId` are supplied, require the fixture to belong to that app (`fixture_app_mismatch` on miss).
- Input parsing: accept `unknown` and narrow with explicit checks (no zod dependency). Missing optional fields are fine; unknown extra fields are ignored.
- Do NOT import the SDK for the helper — it's a pure function over domain data.

### Test expectations
- Step 2.1 tests for `automium_list_apps` (2 tests) and `automium_list_fixtures` (4 tests) must go green.
- The remaining 19 tests for tools 2.3–2.7 will still fail with `unsupported_v1_operation` (different failure signature than the current "helper missing" error). That is expected and will be resolved in subsequent steps; do not over-implement.

### Acceptance criteria
- `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` — at minimum the 6 `automium_list_apps` / `automium_list_fixtures` tests pass. Document the per-test pass/fail breakdown in `tasks/history.md`.
- `pnpm exec tsc --noEmit` passes.
- `git diff --check` clean.
- `pnpm test:run` — no regressions in other suites (expected: 52 files, 196 tests were passing at end of Phase 1 + 25 failing MCP tool contract tests from Step 2.1; after Step 2.2 the failing count should drop by 6).

### Ship-one-step handoff contract
After approval, the fresh-context implementation session must:
1. Implement only Step 2.2 as scoped above.
2. Validate: run the MCP tool contract tests + `pnpm exec tsc --noEmit` + `git diff --check` + `pnpm test:run`.
3. Mark Step 2.2 done in `tasks/todo.md` and update `tasks/history.md`.
4. Commit and push to `master` via `/commit-and-push-by-feature`.
5. Skip deploy (no `deploy.md` or `tasks/deploy.md` contract exists).
6. Write the Step 2.3 plan into `tasks/todo.md` (self-contained, file paths, tests to target, acceptance criteria).
7. Ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`.
8. Call `EnterPlanMode`, write a brief pass-through plan referencing `tasks/todo.md`, call `ExitPlanMode`, and stop before implementing Step 2.3. Do not call `ExitPlanMode` from normal mode. If `EnterPlanMode` is denied, stop and ask the user to explicitly run `/plan` for Step 2.3.
