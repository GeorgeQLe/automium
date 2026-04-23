# Archived Phase: MCP Server Tool Adapters

This file archives Phase 2 of the MCP Server Transport roadmap in [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 2 was completed on 2026-04-23. The owned-products roadmap's Phase 2 archive remains at [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md); this file exists separately so the MCP archive does not overwrite the earlier roadmap artifact.

## Phase 2: Tool Adapters

Goal: implement the seven v1 MCP tools by validating inputs at the MCP boundary and delegating behavior to existing Automium package exports.

> Test strategy: tdd

### Tests First

- [x] Step 2.1: **Automated** Write failing tool contract tests for successful calls and validation failures.
  - Files: created `packages/mcp-server/tests/mcp-tools.contract.test.ts`
  - Tests cover: `automium_list_apps`, `automium_list_fixtures`, `automium_compile_journey`, `automium_create_run_submission`, `automium_get_replay_summary`, `automium_get_artifact_manifest`, and `automium_compare_planners`.
  - Failure coverage includes unauthorized app IDs, fixture/app mismatch, unsupported planner intents, malformed planner metadata, unsupported artifact kinds, absolute artifact entry paths, unsupported corpus versions, empty required fields, and repetitions normalized to at least one.

### Implementation

- [x] Step 2.2: Corpus discovery tools (`automium_list_apps`, `automium_list_fixtures`) over `packages/benchmark/src/corpus.ts`.
- [x] Step 2.3: `automium_compile_journey` via `compileJourneyDefinition` from `apps/control-plane/src/control-plane-domain.ts`.
- [x] Step 2.4: `automium_create_run_submission` via `createRunSubmission` with MCP-boundary planner-metadata validation.
- [x] Step 2.5: `automium_get_replay_summary` via `summarizeReplayRun` and `automium_get_artifact_manifest` via `createArtifactManifest`.
- [x] Step 2.6: `automium_compare_planners` via `comparePlannerBackends` from `packages/benchmark-runner/src/benchmark-runner-domain.ts`.
- [x] Step 2.7: Extended the shared modeled-output marker set with `queued: false` and `artifactsFetched: false` on every modeled tool response.

### Green

- [x] Step 2.8: Re-ran the reused-domain matrix and full-repo checks on 2026-04-23.
  - `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts apps/control-plane/tests packages/artifacts/tests apps/replay-console/tests packages/benchmark-runner/tests packages/benchmark/tests packages/contracts/tests` → 9 files / 48 tests green.
  - `pnpm exec tsc --noEmit` → pass.
  - `pnpm test:run` → 53 files / 221 tests green.
  - `git diff --check` → clean.

### Milestone

- [x] Phase 2 milestone completed on 2026-04-23.

Acceptance criteria (all met):

- All seven v1 tools are callable through the MCP server registration surface.
- Tool calls validate app IDs, fixture IDs, planner intent vocabulary, planner metadata, corpus version, artifact kinds, and relative artifact paths.
- Tool calls delegate to existing Automium domain functions where those functions exist.
- Modeled responses carry the full six-marker metadata: `modeled: true`, `liveBrowserExecuted: false`, `providerCallsMade: false`, `filesystemMutated: false`, `queued: false`, `artifactsFetched: false`.
- All phase tests pass.
- No regressions.
