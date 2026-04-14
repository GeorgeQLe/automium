# Automium MCP Server

## Status

Drafted from plan interview on April 14, 2026.

## Summary

Add an Automium MCP server as the first coding-agent integration layer over the existing local contract/domain surfaces. The MCP server exposes Automium's owned benchmark corpus, journey compilation, run-submission modeling, replay summaries, artifact manifests, and planner comparison reports to coding agents through the Model Context Protocol.

v1 is intentionally local, stdio-only, and contract-safe. It must not claim live browser execution, remote service operation, credential access, or production artifact retrieval. The server adapts current Automium package exports into MCP tools, resources, and prompts so coding agents can understand and use the platform without reading arbitrary repository files.

## Product Context

Automium currently proves the QA platform through TypeScript contracts, domain models, route manifests, deterministic owned fixtures, policy checks, replay and artifact metadata, and benchmark-runner logic. It is not yet a deployed production browser service.

The MCP server should therefore make the local contract-level value accessible to coding agents:

1. Discover supported owned benchmark apps and fixtures.
2. Draft and validate journeys against the owned corpus.
3. Compile supported journeys into Automium graph nodes.
4. Model run submissions without executing a browser.
5. Inspect replay and artifact schema outputs.
6. Compare planner backends using deterministic benchmark reports.

## Goals

- Provide a local MCP entrypoint for coding agents working inside the Automium repository.
- Wrap existing control-plane, benchmark, replay, artifact, and benchmark-runner functions without duplicating business logic.
- Keep v1 safe to run locally by avoiding live browser execution, network calls, credential reads, arbitrary URLs, and filesystem writes.
- Make Automium's contract-level flow easier to explore through tools, resources, and prompts.
- Preserve the current platform maturity boundary: v1 models runs; it does not execute live browser workflows.

## Non-Goals

- No live browser execution.
- No Playwright, Puppeteer, Chromium, WebDriver, or custom browser-engine integration.
- No remote MCP HTTP/SSE transport in v1.
- No production authentication, authorization, or multi-tenant server deployment.
- No persistence, queue transport, artifact storage backend, credential vault, or object storage integration.
- No provider-backed planner API calls.
- No arbitrary user-provided URL execution.
- No mutation of repository files or benchmark fixtures through MCP tools.

## Primary User

The primary v1 user is a coding agent operating inside this repository. The agent needs structured access to Automium's contracts and benchmark corpus while implementing, debugging, or planning related code.

QA operator workflows are deferred until Automium has real run storage, replay access control, browser execution, and production artifact handling.

## Transport

v1 uses stdio transport only.

Rationale:

- stdio matches local coding-agent workflows.
- it avoids premature server deployment, authentication, and session-management concerns.
- it aligns with the current repo maturity, which is local contract/domain proof.

Remote Streamable HTTP or SSE transport is deferred until production persistence, authentication, artifact access control, and audit logging exist.

## Package Boundary

Create a future `packages/mcp-server/` package that owns only the MCP boundary:

- server entrypoint
- stdio transport setup
- MCP tool registration
- MCP resource registration
- MCP prompt registration
- request input validation at the MCP boundary
- response shaping for MCP clients
- error conversion from Automium domain functions to MCP-safe errors

The package must import and reuse existing Automium modules rather than copying domain logic.

Expected source ownership:

- `packages/mcp-server/src/server.ts`
- `packages/mcp-server/src/tools.ts`
- `packages/mcp-server/src/resources.ts`
- `packages/mcp-server/src/prompts.ts`
- `packages/mcp-server/src/schemas.ts`
- `packages/mcp-server/src/errors.ts`
- `packages/mcp-server/src/index.ts`

The exact implementation file list may change during planning, but the spec-level boundary is fixed: MCP adapts existing Automium capabilities; it does not become a second control plane.

## SDK

Use the official TypeScript MCP SDK for v1.

The server should use the SDK's supported server, stdio transport, tool, resource, and prompt abstractions. If SDK APIs evolve, the implementation should isolate SDK-specific calls inside `packages/mcp-server/` so Automium domain packages remain independent of MCP.

## Tools

### `automium_list_apps`

Returns the authorized benchmark apps from the owned corpus.

Input:

- none

Output:

- corpus version
- app IDs
- display names
- hosting type
- rationale
- supported capabilities

Constraints:

- read-only
- returns only checked-in corpus entries

### `automium_list_fixtures`

Returns benchmark fixtures, optionally filtered by app ID.

Input:

- optional `appId`

Output:

- corpus version
- fixture IDs
- app IDs
- environment profile IDs
- seed refs
- account refs
- artifact roots

Validation:

- if `appId` is provided, it must be one of the authorized benchmark app IDs.

Constraints:

- read-only
- does not open or resolve credentials
- does not seed or reset external state

### `automium_compile_journey`

Validates and compiles a journey using the current control-plane domain functions.

Input:

- `id`
- `appId`
- `fixtureId`
- `goal`
- `steps`
- `assertions`
- `recovery`

Output:

- validation result
- compiled journey definition when valid
- validation errors when invalid

Validation:

- `appId` must be in the owned benchmark corpus.
- `fixtureId` must belong to `appId`.
- every step intent must be in the frozen planner intent vocabulary.
- required fields must be present and non-empty.

Constraints:

- does not execute a browser
- does not persist the journey
- does not call a planner provider

### `automium_create_run_submission`

Creates a modeled run submission from an already defined journey and planner reference.

Input:

- `journeyId`
- `appId`
- `fixtureId`
- `planner`
- `environmentProfileId`

Output:

- modeled run ID
- journey ID
- app ID
- fixture ID
- planner reference
- environment profile ID
- initial status
- artifact manifest reference
- replay stream reference

Validation:

- `appId` must be authorized.
- `fixtureId` must belong to `appId`.
- planner reference must include ID, vendor, and model.

Constraints:

- returns a modeled run submission only
- does not enqueue real work
- does not lease workers
- does not execute browser actions
- does not write artifacts

### `automium_get_replay_summary`

Builds a contract-shaped replay summary from caller-provided run metadata.

Input:

- `runId`
- `verdict`
- `retryCount`
- `artifactManifestRef`

Output:

- run ID
- verdict
- retry count
- artifact manifest reference
- required replay artifact kinds

Constraints:

- does not read a replay file
- does not fetch remote artifacts
- does not require persistence

### `automium_get_artifact_manifest`

Builds a contract-shaped artifact manifest from caller-provided entries.

Input:

- `runId`
- `root`
- `entries`

Output:

- schema version
- run ID
- artifact root
- artifact entries

Validation:

- each artifact kind must be one of the supported artifact kinds.
- entry paths must be relative artifact paths, not absolute filesystem paths.

Constraints:

- does not write files
- does not read files
- does not upload artifacts

### `automium_compare_planners`

Creates a benchmark comparison report using the existing benchmark-runner logic.

Input:

- `corpusVersion`
- `appIds`
- `planners`
- `repetitions`

Output:

- report version
- corpus version
- planner reports
- repeatability
- pass rate
- median journey latency
- token spend
- recovery success rate

Validation:

- corpus version must be supported.
- app IDs must be authorized.
- planner entries must include ID, vendor, and model.
- repetitions must be normalized to at least one.

Constraints:

- modeled comparison only
- does not call real planner APIs
- does not execute journeys

## Resources

### `automium://apps`

Read-only resource returning the authorized benchmark apps and supported capabilities.

### `automium://fixtures`

Read-only resource returning benchmark fixtures and environment profiles.

### `automium://contracts/planner-adapter-v1`

Read-only resource returning or summarizing the planner adapter contract.

### `automium://contracts/replay-event-v1`

Read-only resource returning or summarizing the replay event contract.

### `automium://contracts/semantic-snapshot-v1`

Read-only resource returning or summarizing the semantic snapshot contract.

Resources must not expose arbitrary file reads. The resource set is fixed in v1.

## Prompts

### `draft_journey`

Guides a coding agent to draft a valid Automium journey for a selected app and fixture.

Expected inputs:

- app ID
- fixture ID
- user goal

Expected guidance:

- use the owned corpus
- use the frozen planner intent vocabulary
- include assertions
- include bounded recovery
- avoid arbitrary URLs and unsupported browser commands

### `debug_failed_run`

Guides a coding agent through replay and artifact interpretation.

Expected inputs:

- run ID
- verdict
- replay summary or event snippets
- artifact manifest reference

Expected guidance:

- classify failure as product issue, fixture issue, planner issue, unsupported intent, policy denial, or runtime gap
- inspect planner, executor, runtime, assertion, worker, and artifact lanes
- avoid claiming live browser evidence when only modeled outputs exist

### `compare_planner_backends`

Guides a coding agent to compare planner backends against the owned corpus.

Expected inputs:

- app IDs
- planner metadata
- repetitions

Expected guidance:

- keep corpus version fixed
- compare repeatability, pass rate, latency, token spend, and recovery success
- treat v1 reports as modeled until provider-backed planners and live execution exist

## Data And Validation Rules

- All app IDs must come from the owned benchmark corpus.
- All fixture IDs must belong to the selected app.
- All journey intents must come from the frozen planner intent vocabulary.
- Artifact kinds must come from the artifact manifest contract.
- Resource URIs must match the fixed v1 resource list.
- Tool outputs must include schema or version fields when the underlying domain model exposes them.
- Tool errors should be structured, deterministic, and safe to show to coding agents.

## Safety And Security

v1 MCP tools must be local and non-mutating.

Hard boundaries:

- no filesystem writes
- no arbitrary filesystem reads
- no network calls to planner providers or web targets
- no browser execution
- no credential reads
- no secret resolution
- no fixture mutation
- no arbitrary URL access
- no remote artifact fetches

The server may read checked-in Automium data through imported package exports or fixed contract resources. It must not expose general-purpose file access.

## Error Handling

The MCP boundary should convert domain errors into clear tool errors:

- invalid app ID
- fixture/app mismatch
- unsupported planner intent
- invalid artifact kind
- unsupported corpus version
- malformed planner metadata
- unsupported resource URI
- unsupported v1 operation

For operations that users might confuse with live execution, responses must explicitly say when the output is modeled and not executed.

## Developer Experience

A coding agent should be able to:

1. Inspect `automium://apps`.
2. Inspect `automium://fixtures`.
3. Use `draft_journey` to form a journey.
4. Call `automium_compile_journey`.
5. Call `automium_create_run_submission`.
6. Call `automium_get_replay_summary`.
7. Call `automium_get_artifact_manifest`.
8. Call `automium_compare_planners`.

The happy path should work without external services, model credentials, browser dependencies, queues, object storage, or a database.

## Acceptance Criteria

- `packages/mcp-server/` exists as a package in the workspace.
- The MCP server starts over stdio.
- The server registers the v1 tools listed in this spec.
- The server registers the v1 resources listed in this spec.
- The server registers the v1 prompts listed in this spec.
- Tool calls validate app IDs, fixture IDs, planner intent vocabulary, planner metadata, corpus version, and artifact kinds.
- Tool calls delegate to existing Automium domain functions where those functions exist.
- Tool responses clearly identify modeled outputs and never imply live browser execution.
- v1 tests cover successful calls and validation failures for every tool.
- v1 tests cover resource and prompt registration.
- The implementation has no provider API calls, browser driver calls, filesystem writes, remote artifact reads, or credential reads.

## Deferred Scope

- Streamable HTTP or SSE MCP transport.
- Authentication and authorization for remote MCP clients.
- Live browser execution through Playwright, Puppeteer, Chromium, WebDriver, or a purpose-built Automium engine.
- Provider-backed planner execution for Claude, GPT, Gemini, or local/custom planners.
- Persistent journeys, runs, replays, artifacts, tenants, and audit logs.
- Queue transport and deployed worker pools.
- Artifact storage, replay access control, retention enforcement, and redaction.
- Credential vault integration.
- QA operator-oriented MCP workflows against real production runs.

## Open Questions For Future Planning

- Should remote MCP transport require the same tenant/RBAC model as the future control plane API?
- Should live execution enter MCP as `automium_execute_run`, or should MCP submit to a separate production control plane once that exists?
- Should resources expose full contract markdown content or compact summaries optimized for context budgets?
- Should planner-provider adapters be callable through MCP, or should planner execution remain behind the Automium run pipeline?
- Should MCP expose write operations once persistence exists, such as saving journeys or annotating replay triage?
