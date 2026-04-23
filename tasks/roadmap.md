# Automium MCP Server Transport Roadmap

This plan translates [specs/mcp-server.md](/home/georgeqle/projects/tools/dev/automium/specs/mcp-server.md) into an execution-grade phased plan for the local Automium MCP server. The implementation must expose Automium's existing contract and domain surfaces through a stdio-only Model Context Protocol boundary without adding live browser execution, provider calls, persistence, arbitrary filesystem access, or repository mutation through MCP.

## Summary

- Create `packages/mcp-server/` as the only package that depends on the official TypeScript MCP SDK.
- Reuse existing Automium modules for corpus discovery, journey compilation, modeled run submission, replay summaries, artifact manifests, and benchmark comparison reports.
- Keep v1 local and contract-safe: all tools are read-only or modeled, and every response must avoid implying live browser evidence.
- Register a fixed set of MCP tools, resources, and prompts over stdio with deterministic validation and MCP-safe error conversion.
- Preserve the implementation boundary documented in `tasks/lessons.md`: MCP transport is a runtime entrypoint, not proof that production browser execution exists.

## Phase Overview

| Phase | Focus | Primary Deliverables | Depends On |
| --- | --- | --- | --- |
| 1 | Package shell and MCP registry foundation | Workspace package, server factory, schema/error boundary, failing registration tests | `specs/mcp-server.md` |
| 2 | Tool adapters | Seven v1 tools backed by existing Automium modules, validation failures, modeled-output markers | Phase 1 |
| 3 | Resources and prompts | Fixed v1 resources and prompt templates with registration tests and no arbitrary file reads | Phase 2 |
| 4 | Stdio entrypoint and hardening | SDK transport wiring, executable package entrypoint, smoke tests, safety audit, docs | Phase 3 |

## Phase 1: Package Shell And MCP Registry Foundation

Goal: introduce the `packages/mcp-server/` package and a testable server-registration boundary before implementing individual tool behavior.

> Test strategy: tdd

### Tests First

- Step 1.1: **Automated** Write failing package and registry tests for the MCP server shell.
  - Files: create `packages/mcp-server/tests/mcp-server-registration.contract.test.ts`
  - Tests cover: package exports a server factory, v1 capability manifest exists, tool/resource/prompt registries can be inspected in tests without starting stdio, and the package does not register unsupported remote transports.

### Implementation

- Step 1.2: **Automated** Scaffold `packages/mcp-server/` using the existing workspace package conventions.
  - Files: create `packages/mcp-server/package.json`, `packages/mcp-server/tsconfig.json`, `packages/mcp-server/src/index.ts`
  - Include package exports and a future `bin` entry, but do not wire stdio process startup until Phase 4.
- Step 1.3: **Automated** Add the MCP SDK dependency boundary and server factory.
  - Files: create `packages/mcp-server/src/server.ts`
  - The server factory should isolate SDK-specific construction inside `packages/mcp-server/` and expose a test-friendly registration surface.
- Step 1.4: **Automated** Define v1 schema, error, and capability primitives for the MCP boundary.
  - Files: create `packages/mcp-server/src/schemas.ts`, `packages/mcp-server/src/errors.ts`
  - Schemas cover supported tool names, fixed resource URIs, prompt names, modeled-output metadata, planner references, journey input shapes, replay summary input, artifact manifest input, and benchmark comparison input.
  - Errors cover invalid app ID, fixture/app mismatch, unsupported planner intent, invalid artifact kind, unsupported corpus version, malformed planner metadata, unsupported resource URI, and unsupported v1 operation.
- Step 1.5: **Automated** Register placeholder descriptors for the v1 tools, resources, and prompts without implementing domain behavior yet.
  - Files: create `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/resources.ts`, `packages/mcp-server/src/prompts.ts`
  - Descriptors must include every v1 name from the spec and must keep remote Streamable HTTP/SSE out of scope.

### Green

- Step 1.6: **Automated** Make the Phase 1 registration tests pass and run targeted workspace validation.
  - Commands: `pnpm exec vitest run packages/mcp-server/tests/mcp-server-registration.contract.test.ts`, `pnpm exec tsc --noEmit`

### Milestone

- [x] Phase 1 milestone completed on 2026-04-14.

Acceptance criteria:

- `packages/mcp-server/` exists in the workspace.
- The package exports a server factory and a test-inspectable v1 registration surface.
- All v1 tool, resource, and prompt names are present as descriptors.
- No remote MCP transport is registered.
- All phase tests pass.
- No regressions.

## Phase 2: Tool Adapters

Goal: implement the seven v1 MCP tools by validating inputs at the MCP boundary and delegating behavior to existing Automium package exports.

> Test strategy: tdd

### Tests First

- Step 2.1: **Automated** Write failing tool contract tests for successful calls and validation failures.
  - Files: create `packages/mcp-server/tests/mcp-tools.contract.test.ts`
  - Tests cover: `automium_list_apps`, `automium_list_fixtures`, `automium_compile_journey`, `automium_create_run_submission`, `automium_get_replay_summary`, `automium_get_artifact_manifest`, and `automium_compare_planners`.
  - Failure coverage includes unauthorized app IDs, fixture/app mismatch, unsupported planner intents, malformed planner metadata, unsupported artifact kinds, absolute artifact entry paths, unsupported corpus versions, empty required fields, and repetitions normalized to at least one.

### Implementation

- Step 2.2: **Automated** Implement corpus discovery tools over the owned benchmark package.
  - Files: modify `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/schemas.ts`, `packages/mcp-server/src/errors.ts`
  - Reuse `packages/benchmark/src/corpus.ts` exports for app, fixture, environment profile, and corpus version data.
- Step 2.3: **Automated** Implement `automium_compile_journey` over the control-plane compiler contract.
  - Files: modify `packages/mcp-server/src/tools.ts`
  - Reuse `apps/control-plane/src/control-plane-domain.ts` for `validateJourneyDefinition` and `compileJourneyDefinition`, while preserving the spec input shape and validation error response.
- Step 2.4: **Automated** Implement `automium_create_run_submission` over the control-plane run model.
  - Files: modify `packages/mcp-server/src/tools.ts`
  - Reuse `createRunSubmission` and add MCP boundary validation that planner metadata includes non-empty `id`, `vendor`, and `model`.
- Step 2.5: **Automated** Implement replay and artifact tools over replay-console and artifacts contracts.
  - Files: modify `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/schemas.ts`
  - Reuse `apps/replay-console/src/replay-console-domain.ts` for `summarizeReplayRun` and `packages/artifacts/src/artifacts-domain.ts` for `ARTIFACT_KINDS` and `createArtifactManifest`.
  - Reject absolute artifact paths and unsupported artifact kinds before domain delegation.
- Step 2.6: **Automated** Implement `automium_compare_planners` over the benchmark-runner report model.
  - Files: modify `packages/mcp-server/src/tools.ts`
  - Reuse `packages/benchmark-runner/src/benchmark-runner-domain.ts` and add deterministic MCP-safe errors for unsupported corpus versions and malformed planner metadata.
- Step 2.7: **Automated** Add modeled-output markers to every tool that models instead of executes work.
  - Files: modify `packages/mcp-server/src/tools.ts`, `packages/mcp-server/src/schemas.ts`
  - The run, replay, artifact, and planner-comparison responses must explicitly state that no browser execution, provider calls, persistence, queueing, or artifact fetching occurred.

### Green

- Step 2.8: **Automated** Make the MCP tool suites pass and verify no regressions in reused domain packages.
  - Commands: `pnpm exec vitest run packages/mcp-server/tests/mcp-tools.contract.test.ts apps/control-plane/tests packages/artifacts/tests apps/replay-console/tests packages/benchmark-runner/tests packages/benchmark/tests packages/contracts/tests`, `pnpm exec tsc --noEmit`

### Milestone

- [x] Phase 2 milestone completed on 2026-04-23.

Acceptance criteria:

- All seven v1 tools are callable through the MCP server registration surface.
- Tool calls validate app IDs, fixture IDs, planner intent vocabulary, planner metadata, corpus version, artifact kinds, and relative artifact paths.
- Tool calls delegate to existing Automium domain functions where those functions exist.
- Modeled responses clearly say they were not live browser executions.
- All phase tests pass.
- No regressions.

## Phase 3: Resources And Prompts

Goal: register the fixed v1 MCP resources and prompt templates without exposing arbitrary repository reads or speculative live-runtime guidance.

> Test strategy: tdd

### Tests First

- Step 3.1: **Automated** Write failing resource and prompt contract tests.
  - Files: create `packages/mcp-server/tests/mcp-resources-prompts.contract.test.ts`
  - Tests cover: `automium://apps`, `automium://fixtures`, `automium://contracts/planner-adapter-v1`, `automium://contracts/replay-event-v1`, `automium://contracts/semantic-snapshot-v1`, `draft_journey`, `debug_failed_run`, and `compare_planner_backends`.
  - Failure coverage includes unsupported resource URIs and prompt inputs that omit required identifiers.

### Implementation

- Step 3.2: **Automated** Implement fixed resource handlers from package exports and compact contract summaries.
  - Files: modify `packages/mcp-server/src/resources.ts`, `packages/mcp-server/src/schemas.ts`, `packages/mcp-server/src/errors.ts`
  - Reuse `packages/benchmark/src/corpus.ts`, `packages/contracts/src/planner-adapter.ts`, `packages/contracts/src/replay-event.ts`, and `packages/contracts/src/semantic-snapshot.ts`.
  - Do not read arbitrary files or expose filesystem paths beyond checked-in contract references already represented by package exports.
- Step 3.3: **Automated** Implement prompt handlers for journey drafting, failed-run debugging, and planner comparison.
  - Files: modify `packages/mcp-server/src/prompts.ts`
  - Prompts should guide coding agents toward the owned corpus, frozen planner intent vocabulary, bounded recovery, artifact/replay interpretation, and modeled planner comparison.
- Step 3.4: **Automated** Ensure prompt copy preserves v1 maturity boundaries.
  - Files: modify `packages/mcp-server/src/prompts.ts`
  - Prompt guidance must avoid claiming live browser evidence, production artifact retrieval, credential access, or provider-backed planner execution.

### Green

- Step 3.5: **Automated** Make the resource and prompt suites pass and run the full MCP package test slice.
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

## Phase 4: Stdio Entrypoint And Hardening

Goal: wire the official SDK stdio transport, add executable package entrypoints, verify local coding-agent startup, and document the safe v1 operating boundary.

> Test strategy: tdd

### Tests First

- Step 4.1: **Automated** Write failing stdio startup and safety regression tests.
  - Files: create `packages/mcp-server/tests/mcp-stdio.contract.test.ts`, `packages/mcp-server/tests/mcp-safety.contract.test.ts`
  - Startup tests cover server metadata, stdio wiring, registered capabilities, and clean failure behavior without hanging test processes.
  - Safety tests cover no browser driver imports, no provider SDK imports, no credential access helpers, no network transport registration, no filesystem writes, no arbitrary resource URI support, and modeled-output disclaimers on modeled tools.

### Implementation

- Step 4.2: **Automated** Implement the stdio runtime entrypoint.
  - Files: create `packages/mcp-server/src/stdio.ts`, modify `packages/mcp-server/src/index.ts`, modify `packages/mcp-server/package.json`
  - The entrypoint should start only stdio transport and should not start HTTP/SSE listeners.
- Step 4.3: **Automated** Document local setup and supported client configuration.
  - Files: create `packages/mcp-server/README.md`, modify `tasks/todo.md`
  - Documentation should include stdio command shape, supported tools/resources/prompts, v1 safety boundaries, and deferred remote transport scope.

### Green

- Step 4.4: **Automated** Make the stdio and safety suites pass, then run MCP package tests, targeted dependent suites, TypeScript, formatting checks, and diff checks.
  - Commands: `pnpm exec vitest run packages/mcp-server/tests apps/control-plane/tests apps/replay-console/tests packages/artifacts/tests packages/benchmark-runner/tests packages/benchmark/tests packages/contracts/tests packages/journey-compiler/tests`, `pnpm exec tsc --noEmit`, `git diff --check`

### Milestone

- [ ] Stdio entrypoint and hardening complete.

Acceptance criteria:

- The MCP server starts over stdio.
- The server registers the v1 tools, resources, and prompts listed in the spec.
- The implementation has no provider API calls, browser driver calls, filesystem writes, remote artifact reads, or credential reads.
- README instructions describe local stdio usage and v1 limitations.
- All phase tests pass.
- No regressions.

## Cross-Phase Concerns

- Keep `packages/mcp-server/` as the only package that imports the MCP SDK.
- Use existing Automium domain exports instead of copying control-plane, benchmark, artifact, replay, or benchmark-runner logic.
- Preserve fixed v1 boundaries: stdio only, local only, non-mutating, no arbitrary filesystem reads, no network calls, no browser execution, no credential reads, no provider-backed planner execution.
- Every modeled response should include explicit metadata or copy stating that the output was modeled and not executed.
- Add or update tests whenever validation behavior is introduced at the MCP boundary.
- Before claiming completion, run the relevant MCP test slice, reused-domain regression tests, `pnpm exec tsc --noEmit`, and `git diff --check`.
