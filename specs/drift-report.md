# Spec Drift Report

Generated on April 13, 2026 for `$spec-drift fix all`.

## Scope

- `specs/agent-native-browser-qa-platform.md`
- `specs/owned-parity-benchmark-products.md`
- Significant public implementation surfaces under `apps/`, `packages/`, `docs/`, and `tests/`

Skipped non-spec planning files and interviews.

## Summary

| Category | Count | Result |
| --- | ---: | --- |
| Verified claims | 29 | Implementation evidence found |
| Errors | 0 | No unresolved code-vs-spec contradiction requiring a code-right/spec-right decision |
| Warnings | 6 | Deferred to `tasks/todo.md` |
| Info | 5 | Specs updated with completed implementation details |
| Removed claims | 0 | No intentional removals found |

## Resolved Documentation Drift

### Info 1: Current QA Platform Implementation Was Underdocumented

Spec quote: "v1 includes: new browser engine and runtime ... cloud orchestration platform ... journey authoring API ... replay/debug console ... job control plane and worker fleet"

Evidence:

- `packages/engine/src/engine-domain.ts:1` defines the browser engine schema version.
- `packages/runtime/src/runtime-domain.ts:1` defines the semantic runtime schema version.
- `apps/control-plane/src/control-plane-domain.ts:9` defines control-plane routes for compile, runs, artifacts, and replay.
- `packages/benchmark-runner/src/benchmark-runner-domain.ts:7` defines the benchmark report version.

Resolution: added a current implementation status section to `specs/agent-native-browser-qa-platform.md` documenting the contract/domain implementation and separating it from production hardening.

### Info 2: Planner Intent Tokens Needed Exact Contract Names

Spec quote: "Supported planner intents: ... press key ... wait for condition"

Evidence:

- `packages/contracts/src/planner-adapter.ts:3` freezes `PLANNER_INTENT_VOCABULARY`.
- `packages/executor/src/executor-domain.ts:1` freezes `SUPPORTED_EXECUTOR_INTENTS`.

Resolution: normalized the spec tokens to `press-key` and `wait-for-condition`.

### Info 3: Owned Benchmark Corpus Included A Support Fixture Not Named In The Spec

Spec quote: "The first benchmark is automated website QA on authorized properties at very large scale"

Evidence:

- `packages/benchmark/src/corpus.ts:9` includes `iframe-fixture` in `AuthorizedBenchmarkAppId`.
- `packages/benchmark/src/corpus.ts:101` defines the Iframe Fixture App as a controlled owned fixture.
- `packages/policies/src/policies-domain.ts:5` includes `iframe-fixture` in authorized app IDs.

Resolution: added the current benchmark corpus scope to `specs/agent-native-browser-qa-platform.md`.

### Info 4: Owned Product Route Manifests Were More Specific Than The Spec

Spec quote: "REST APIs and webhooks for major resources"

Evidence:

- `apps/altitude/src/altitude-api-routes.ts:3` defines 11 Altitude route-manifest entries.
- `apps/switchboard/src/switchboard-api-routes.ts:4` defines 16 Switchboard route-manifest entries.
- `apps/foundry/src/foundry-api-routes.ts:3` defines 13 Foundry route-manifest entries.

Resolution: added the product implementation checkpoint to `specs/owned-parity-benchmark-products.md`.

### Info 5: Admin Console API Surface Was Underdocumented

Spec quote: "admin console and instance-level governance"

Evidence:

- `apps/admin-console/src/admin-api-routes.ts:14` defines governance mutation and product navigation routes.
- `apps/admin-console/src/admin-api-routes.ts:88` builds the admin route manifest.

Resolution: documented the admin-console implementation in `specs/owned-parity-benchmark-products.md`.

## Deferred Warnings

### Warning 1: Browser Engine Subsystems Are Contract-Level, Not Executable Runtime

Spec quote: "parse and execute HTML/CSS/JS for the v1 compatibility target"

Evidence:

- `packages/engine/src/engine-domain.ts:19` models `BrowserEngineStateInput`.
- `packages/engine/src/engine-domain.ts:87` creates a browser engine state object.
- `packages/engine/src/engine-domain.ts:108` describes interactive elements and actionability.

No parser, JS execution environment, CSS parser, layout engine, or event dispatch implementation was found. Follow-up added to `tasks/todo.md`.

### Warning 2: Orchestration Is A Domain Contract, Not A Deployed Cloud Service

Spec quote: "Cloud service managing jobs and workers"

Evidence:

- `apps/control-plane/src/control-plane-domain.ts:208` creates run submissions.
- `packages/orchestrator/src/orchestrator-domain.ts:143` leases workers through a domain function.
- `packages/worker/src/worker-domain.ts:1` defines worker runtime config/contracts.

No deployed service, queue transport, or persistent worker fleet was found. Follow-up added to `tasks/todo.md`.

### Warning 3: Credential Vault Integration Remains A Placeholder

Spec quote: "credential vault integration"

Evidence:

- `packages/policies/src/policies-domain.ts:72` evaluates run policy with tenant, app, fixture, and capability checks.
- `apps/foundry/src/foundry-seed.ts:20` models datasource credentials through `secretRef`.

No runtime credential vault integration was found. Follow-up added to `tasks/todo.md`.

### Warning 4: Product UI Workflow Layer Is Not Yet Deployed

Spec quote: "product UI workflow tests"

Evidence:

- `apps/altitude/tests/altitude-domain.contract.test.ts:58` tests Altitude domain contracts.
- `apps/switchboard/tests/switchboard-domain.contract.test.ts:25` tests Switchboard domain contracts.
- `apps/foundry/tests/foundry-builder.contract.test.ts:58` tests Foundry builder contracts.

The repository has contract/domain/integration tests, but no deployed browser UI workflow layer for the three owned products. Follow-up added to `tasks/todo.md`.

### Warning 5: Production Persistence And Infrastructure Adapters Remain Deferred

Spec quote: "Postgres as the primary relational store ... object storage ... queue workers ... websocket or SSE channel"

Evidence:

- `packages/adapters/src/adapters-behavior.ts:75` creates adapter registries for integration boundaries.
- `packages/files/src/files-behavior.ts:28` models file ownership.
- `packages/jobs/src/jobs-behavior.ts:47` models job lifecycle.
- `packages/realtime/src/realtime-behavior.ts:42` creates ordered realtime events.

The shared platform has contracts and local behavior, but production backing services are not wired. Follow-up added to `tasks/todo.md`.

### Warning 6: Several Operator Surfaces Remain Spec-Level

Spec quote: "command palette or global action surface"; "help-center or self-service surfaces"; "presence and collision avoidance"; "bulk action surfaces"

Evidence:

- `docs/parity/altitude-feature-matrix.md:19` preserves the command-palette requirement.
- `docs/parity/switchboard-api-matrix.md:12` preserves presence-ready operator identity.
- `apps/switchboard/src/switchboard-seed.ts:97` models collaborator identities for benchmark fixtures.

Explicit implementation for these operator surfaces was not found beyond specs, parity matrices, and seed metadata. Follow-up added to `tasks/todo.md`.

## Verified Claims

- Spec quote: "semantic state is a first-class runtime artifact"  
  Evidence: `packages/contracts/src/semantic-snapshot.ts:1`, `packages/runtime/src/runtime-domain.ts:53`

- Spec quote: "Vision is selective, local, and justified"  
  Evidence: `packages/vision/src/vision-domain.ts:37`, `packages/vision/tests/targeted-vision.contract.test.ts:15`

- Spec quote: "Planner and executor are separate"  
  Evidence: `packages/contracts/src/planner-adapter.ts:76`, `packages/executor/src/executor-domain.ts:58`

- Spec quote: "Runs must be replayable and causally inspectable"  
  Evidence: `packages/contracts/src/replay-event.ts:1`, `packages/event-stream/src/event-stream-domain.ts:1`, `apps/replay-console/src/replay-console-domain.ts:86`

- Spec quote: "domain allowlists"  
  Evidence: `packages/policies/src/policies-domain.ts:46`

- Spec quote: "artifact retention controls"  
  Evidence: `packages/artifacts/src/artifacts-domain.ts:64`

- Spec quote: "Run the same journey across multiple planner backends and compare"  
  Evidence: `packages/benchmark-runner/src/benchmark-runner-domain.ts:48`

- Spec quote: "authentication and session management"  
  Evidence: `packages/auth/src/auth-behavior.ts:61`, `packages/auth/src/auth-behavior.ts:77`

- Spec quote: "organizations, workspaces, users, teams, invites, and memberships"  
  Evidence: `packages/tenancy/src/tenancy-behavior.ts:53`, `packages/tenancy/src/tenancy-behavior.ts:64`, `packages/tenancy/src/tenancy-behavior.ts:77`

- Spec quote: "RBAC and per-product permissions"  
  Evidence: `packages/rbac/src/rbac-behavior.ts:105`, `apps/foundry/src/foundry-permissions.ts:18`

- Spec quote: "audit log and event history"  
  Evidence: `packages/audit/src/audit-behavior.ts:27`

- Spec quote: "object storage for files, uploads, and artifacts"  
  Evidence: `packages/files/src/files-behavior.ts:28`, `packages/artifacts/src/artifacts-domain.ts:53`

- Spec quote: "search indexing"  
  Evidence: `packages/search/src/search-behavior.ts:41`, `packages/search/src/search-behavior.ts:59`

- Spec quote: "background jobs and queue workers"  
  Evidence: `packages/jobs/src/jobs-behavior.ts:47`, `packages/worker/src/worker-domain.ts:1`

- Spec quote: "all three products must expose a shared eventing model"  
  Evidence: `packages/realtime/src/realtime-behavior.ts:42`, `apps/altitude/src/altitude-realtime.ts:8`, `apps/switchboard/src/switchboard-realtime.ts:8`, `apps/foundry/src/foundry-realtime.ts:6`

- Spec quote: "`Altitude` is the Plane-parity product"  
  Evidence: `apps/altitude/src/altitude-domain.ts:11`, `apps/altitude/src/altitude-seed.ts:28`

- Spec quote: "work items with types, fields, states, priorities"  
  Evidence: `apps/altitude/src/altitude-constants.ts:1`, `apps/altitude/src/altitude-work-items.ts:19`

- Spec quote: "cycles" and "modules"  
  Evidence: `apps/altitude/src/altitude-cycles.ts:16`, `apps/altitude/src/altitude-modules.ts:7`

- Spec quote: "`Switchboard` is the Chatwoot-parity product"  
  Evidence: `apps/switchboard/src/switchboard-domain.ts:13`, `apps/switchboard/src/switchboard-seed.ts:61`

- Spec quote: "website live chat ... API channel ... email"  
  Evidence: `apps/switchboard/src/switchboard-channels.ts:60`, `apps/switchboard/src/switchboard-channels.ts:87`, `apps/switchboard/src/switchboard-channels.ts:116`

- Spec quote: "remaining channels may initially ship through conformance-checked adapters"  
  Evidence: `apps/switchboard/src/switchboard-channel-adapters.ts:15`, `apps/switchboard/src/switchboard-channel-adapters.ts:64`

- Spec quote: "automation rules"  
  Evidence: `apps/switchboard/src/switchboard-automation.ts:40`, `apps/switchboard/src/switchboard-automation.ts:51`

- Spec quote: "`Foundry` is the Appsmith-parity product"  
  Evidence: `apps/foundry/src/foundry-domain.ts:16`, `apps/foundry/src/foundry-seed.ts:85`

- Spec quote: "editor/runtime split"  
  Evidence: `apps/foundry/src/foundry-runtime.ts:77`, `apps/foundry/src/foundry-publishing.ts:31`

- Spec quote: "Postgres-compatible SQL source ... MySQL-compatible SQL source ... REST API datasource"  
  Evidence: `apps/foundry/src/foundry-constants.ts:31`, `apps/foundry/src/foundry-datasource-adapters.ts:86`

- Spec quote: "custom widget support"  
  Evidence: `apps/foundry/src/foundry-custom-widgets.ts:18`, `apps/foundry/src/foundry-widgets.ts:13`

- Spec quote: "branch-aware collaboration and version history"  
  Evidence: `apps/foundry/src/foundry-branches.ts:43`, `apps/foundry/src/foundry-branches.ts:57`, `apps/foundry/src/foundry-branches.ts:95`

- Spec quote: "deployment and share or publish workflows"  
  Evidence: `apps/foundry/src/foundry-deployments.ts:17`, `apps/foundry/src/foundry-publishing.ts:31`, `apps/foundry/src/foundry-publishing.ts:61`

- Spec quote: "All benchmark-critical journeys can be seeded, reset, and exercised by the QA platform"  
  Evidence: `apps/altitude/src/altitude-seed.ts:201`, `apps/switchboard/src/switchboard-seed.ts:127`, `apps/foundry/src/foundry-seed.ts:630`, `tests/e2e/alpha/owned-products-alpha.contract.test.ts:19`

## Downstream Impact

- `research/journey-map.md` and `research/metrics.md` do not exist in this repository, so there is no downstream research file to update.
- `tasks/roadmap.md` now includes the maintenance plan for this spec-drift pass.
- `tasks/todo.md` now tracks deferred production-hardening work and this task's validation checklist.

## Remaining Status

All detected drift has been resolved as either:

- verified implementation evidence,
- spec documentation updates for completed behavior, or
- deferred follow-up tasks in `tasks/todo.md`.
