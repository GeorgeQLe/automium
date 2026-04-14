# MCP Server Plan Interview

## Status

Conducted on April 14, 2026 using the `plan-interview` skill.

## Initial Draft

The initial prompt was `$plan-interview mcp`, following a discussion that confirmed Automium currently lacks an MCP server transport. The working idea was to create a specification for adding MCP support to the repository.

## Context Reviewed

- `.agents/project.json` identifies the project as `devtool` with the devtool pack enabled.
- `research/devtool-integration-map.md`
- `research/devtool-dx-journey.md`
- `specs/agent-native-browser-qa-platform.md`
- `apps/control-plane/src/control-plane-domain.ts`
- `packages/benchmark/src/corpus.ts`
- `packages/benchmark-runner/src/benchmark-runner-domain.ts`
- `apps/replay-console/src/replay-console-domain.ts`
- `packages/artifacts/src/artifacts-domain.ts`
- Current MCP specification pages for transports, tools, resources, and prompts.

## Questions And Decisions

### Question 1: Transport

Question:

Should v1 use stdio-first, or does v1 need remote HTTP/SSE?

Options presented:

- stdio-only for v1
- remote HTTP/SSE in v1

Recommendation:

Use stdio-only for v1 because Automium's current state is local contract/domain proof, and stdio fits coding-agent workflows without requiring production auth, persistence, or deployment.

User response:

The user agreed with the recommendation.

Decision:

v1 MCP server uses stdio transport only. Remote HTTP/SSE is deferred.

### Question 2: Tool Scope

Question:

Should v1 include only contract-safe tools, or include a placeholder `automium_execute_run` that returns `unsupported` until the browser engine exists?

Options presented:

- contract-safe tools only
- include placeholder live-execution tool

Recommendation:

Expose only contract-safe tools:

- `automium_list_apps`
- `automium_list_fixtures`
- `automium_compile_journey`
- `automium_create_run_submission`
- `automium_get_replay_summary`
- `automium_get_artifact_manifest`
- `automium_compare_planners`

Rationale:

These map to current implemented surfaces without pretending to execute a live browser.

User response:

The user agreed with the recommendation.

Decision:

v1 exposes contract-safe tools only. No `automium_execute_run` placeholder in v1.

### Question 3: Primary User

Question:

Should v1 optimize for a coding agent inside the repo, or for QA/operator agents from the start?

Options presented:

- coding agent inside the repo
- QA/operator agent

Recommendation:

Optimize v1 for a coding agent inside the repo. Tools should return schemas, validation errors, fixture IDs, compiled graph nodes, replay summaries, and benchmark reports for implementation and debugging workflows.

User response:

The user agreed with the recommendation.

Decision:

The primary v1 user is a coding agent inside the repository.

### Question 4: SDK And Package Ownership

Question:

Should `packages/mcp-server/` use the official TypeScript MCP SDK and stay a thin adapter over existing Automium package exports?

Recommendation:

Use the official TypeScript MCP SDK and keep `packages/mcp-server/` as a thin adapter. It should own server startup, tool/resource/prompt registration, validation, and response shaping, but not duplicate Automium control-plane logic.

User response:

The user agreed with the recommendation.

Decision:

Use the official TypeScript MCP SDK. Keep MCP logic isolated in `packages/mcp-server/`.

### Question 5: Resources And Prompts

Question:

Should v1 include MCP resources and prompts, not just tools?

Recommendation:

Include read-only resources:

- `automium://apps`
- `automium://fixtures`
- `automium://contracts/planner-adapter-v1`
- `automium://contracts/replay-event-v1`
- `automium://contracts/semantic-snapshot-v1`

Include prompts:

- `draft_journey`
- `debug_failed_run`
- `compare_planner_backends`

Rationale:

Resources and prompts give coding agents enough structured context to use the tools correctly without broad filesystem access.

User response:

The user agreed with the recommendation.

Decision:

v1 includes tools, resources, and prompts.

### Question 6: Safety Boundary

Question:

Should v1 MCP tools be strictly local and non-mutating?

Recommendation:

Yes. v1 should perform no filesystem writes, network calls, browser execution, credential reads, or arbitrary URL access. Inputs should be restricted to the owned benchmark corpus and planner intent vocabulary.

User response:

The user agreed with the recommendation.

Decision:

v1 MCP server is local, read-only/non-mutating, contract-safe, and corpus-bounded.

### Question 7: Spec Detail Level

Question:

Should the spec be documentation/spec only, or include an implementation-ready phase plan with test file names and module names?

Recommendation:

Include an implementation-ready phase plan because the repo's specs often flow into `plan-phases` and `run`.

User response:

The user overrode the recommendation and chose documentation/spec only, explaining that the `roadmap` skill should populate the high-level implementation plan and `plan-phases` should create the phase plan.

Decision:

The MCP spec is documentation/spec only and does not include an implementation phase breakdown.

## Coverage Checkpoint

Covered areas:

- goals and non-goals
- primary user
- transport choice
- SDK choice
- package ownership
- MCP tools
- MCP resources
- MCP prompts
- data and validation rules
- developer workflow
- safety and security boundaries
- error handling
- acceptance criteria
- deferred scope

## Significant Deviations From Initial Draft

- MCP was not treated as a remote production control plane. It was narrowed to local stdio because Automium currently lacks production auth, persistence, and artifact access control.
- Live browser execution was excluded from v1 because the repository only has browser/runtime contracts and domain helpers.
- A placeholder execution tool was rejected to avoid implying runtime capability that does not exist.
- The final spec excludes implementation phases because the user wants `roadmap` and `plan-phases` to own implementation sequencing.
