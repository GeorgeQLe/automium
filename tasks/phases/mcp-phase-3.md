# Archived Phase: MCP Server Resources And Prompts

This file archives Phase 3 of the MCP Server Transport roadmap in [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Phase 3 was completed on 2026-04-24. The owned-products roadmap's Phase 3 archive remains at [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md); this file exists separately so the MCP archive does not overwrite the earlier roadmap artifact.

## Phase 3: Resources And Prompts

Goal: register the fixed v1 MCP resources and prompt templates without exposing arbitrary repository reads or speculative live-runtime guidance.

> Test strategy: tdd

### Tests First

- [x] Step 3.1: **Automated** Wrote failing resource and prompt contract tests.
  - Files: created `packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts`
  - Tests cover: `automium://apps`, `automium://fixtures`, `automium://contracts/planner-adapter-v1`, `automium://contracts/replay-event-v1`, `automium://contracts/semantic-snapshot-v1`, `draft_journey`, `debug_failed_run`, and `compare_planner_backends`.
  - Failure coverage includes unsupported resource URIs and prompt inputs that omit required identifiers.

### Implementation

- [x] Step 3.2: Implemented `readAutomiumMcpResource(server, uri)` in `packages/mcp-server/src/resources.ts` dispatching over the five fixed v1 URIs, sourcing payloads exclusively from existing package exports (`packages/benchmark/src/corpus.ts`, `packages/contracts/src/planner-adapter.ts`, `packages/contracts/src/replay-event.ts`, `packages/contracts/src/semantic-snapshot.ts`). No filesystem reads. Unsupported URIs throw `AutomiumMcpError("unsupported_resource_uri", …)`.
- [x] Step 3.3: Implemented `getAutomiumMcpPrompt(server, name, args)` in `packages/mcp-server/src/prompts.ts` dispatching over `draft_journey`, `debug_failed_run`, `compare_planner_backends` with pre-domain validation throwing `AutomiumMcpError("unsupported_v1_operation", …)` for missing required identifiers and unknown prompt names.
- [x] Step 3.4: Hardened prompt copy to preserve v1 maturity boundaries. Added a module-level `MODELED_V1_DISCLAIMER` constant appended as a trailing system message to all three prompts, and normalized copy to forbid live-execution imperatives (open/launch/navigate/click/type, call/invoke/execute/run the planner, fetch from storage, retrieve credentials, log streaming).

### Green

- [x] Step 3.5: Re-ran the MCP package test slice and the full-repo checks on 2026-04-24.
  - `pnpm exec vitest run packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts` → 11/11 green.
  - `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts` → 25/25 green.
  - `pnpm exec vitest run packages/mcp-server/tests` → 3 files / 40 tests green.
  - `pnpm exec tsc --noEmit` → pass.
  - `pnpm test:run` → 54 files / 232 tests green.
  - `git diff --check` → clean.

### Milestone

- [x] Phase 3 milestone completed on 2026-04-24.

Acceptance criteria (all met):

- All five v1 resources are registered and limited to the fixed URI set.
- All three v1 prompts are registered and validate required inputs.
- Resources do not expose arbitrary filesystem reads.
- Prompt guidance separates modeled contract outputs from live execution via the shared `MODELED_V1_DISCLAIMER`.
- All phase tests pass.
- No regressions.
