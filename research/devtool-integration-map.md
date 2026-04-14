# Automium Devtool Integration Map

## Status

Created on 2026-04-13 from the `devtool-integration-map` skill.

Primary repo context:

- `specs/agent-native-browser-qa-platform.md`
- `specs/owned-parity-benchmark-products.md`
- `docs/benchmarks/v1-corpus.md`
- `docs/benchmarks/owned-products.md`
- `docs/contracts/semantic-snapshot-v1.md`
- `docs/contracts/replay-event-v1.md`
- `docs/contracts/planner-adapter-v1.md`
- `docs/parity/*-api-matrix.md`
- `tasks/phases/phase-7.md`

## Product Context

Automium sits between product teams, model planners, owned or consented web properties, and QA platform operators. Its integration strategy should preserve one clear separation: planners decide intent, while Automium owns policy, deterministic execution, artifacts, replay, fixtures, and benchmark comparability.

The current repository implements these integrations as TypeScript contract, domain, route-manifest, fixture, and benchmark-runner surfaces. Production service adapters for browser sandboxing, persistence, queues, object storage, realtime transports, credential vaults, and provider-backed planner calls remain hardening work.

## Integration Map

| Integration Area | Current Repo Surface | Integration Owner | Current Maturity | Next Hardening Need |
| --- | --- | --- | --- | --- |
| Planner backends | `packages/contracts/src/planner-adapter.ts`, `packages/planner-adapter/src/`, `packages/benchmark-runner/src/` | AI platform or Automium planner maintainers | Contract-level metadata, prompt, parse, compile, and summary requirements are frozen. | Provider-backed adapters for GPT, Claude, Gemini, and local/custom planners, with comparable cost, latency, tool-call, and vision metadata. |
| Journey authoring and compilation | `apps/control-plane/src/`, `packages/journey-compiler/src/` | QA platform and product teams | Natural-language journey inputs compile into graph nodes, assertions, recovery rules, and fixture references. | Public API client, validation UX, versioned journey storage, and import paths from existing test suites. |
| Owned benchmark products | `apps/altitude/`, `apps/switchboard/`, `apps/foundry/`, `apps/admin-console/` | Owned product maintainers | Domain modules, API route manifests, adapter boundaries, deterministic seeds, reset hooks, and benchmark routes exist. | Deployed browser UIs and browser-driven UI workflow suites for all three products. |
| Benchmark corpus and fixtures | `packages/benchmark/src/`, `packages/benchmark/fixtures/`, `docs/benchmarks/` | Benchmark maintainers | Owned app corpus covers `Altitude`, `Switchboard`, `Foundry`, and `iframe-fixture` with stable fixture IDs and deterministic keys. | Corpus versioning workflow, publication policy, fixture promotion rules, and reset health checks in service environments. |
| Browser engine and semantic runtime | `packages/engine/src/`, `packages/runtime/src/`, `packages/contracts/src/semantic-snapshot.ts` | Engine/runtime maintainers | Browser state, sessions, frames, storage, network metadata, semantic snapshots, stable element IDs, actionability, and context compaction are modeled. | Executable HTML/CSS/JS parsing, layout, event dispatch, sandboxing, and semantic graph generation from real pages. |
| Deterministic executor and assertions | `packages/executor/src/`, `packages/assertions/src/`, `packages/contracts/src/planner-adapter.ts` | Executor/policy maintainers | Supported planner intents compile into deterministic actions and unsupported intents fail fast. | Runtime action application against the production engine, richer assertion libraries, and recovery policy controls that cannot mask true failures. |
| Replay and artifacts | `packages/event-stream/src/`, `packages/artifacts/src/`, `apps/replay-console/src/`, `docs/contracts/replay-event-v1.md` | Debug/replay maintainers | Replay event ordering, timeline lanes, artifact manifests, retention metadata, summaries, and replay references are contract-shaped. | Object storage, access control, redaction policy, streaming replay transport, and artifact viewer workflows. |
| Targeted vision | `packages/vision/src/`, `packages/runtime/src/` | Vision/runtime maintainers | Targeted crop request metadata and bounded fallback triggers are modeled. | Real crop capture, OCR or visual model adapter calls, crop caching, and spend controls tied to planner prompts. |
| Orchestration and workers | `packages/orchestrator/src/`, `packages/worker/src/` | Platform infrastructure operators | Worker leases, priority queue placement, capability checks, tenant quotas, concurrency decisions, and telemetry summaries are modeled. | Real queue transport, worker pools, lease heartbeats, retries, autoscaling, isolation runtime, and operational dashboards. |
| Policy and governance | `packages/policies/src/`, `packages/rbac/src/`, `packages/tenancy/src/`, `packages/audit/src/`, `apps/admin-console/src/` | Security, compliance, and platform admins | Owned-domain allowlists, fixture-scoped run policy, tenant checks, RBAC, audit events, and admin route manifests are present. | Credential vault integration, tenant-specific policy profiles, artifact access audit, retention enforcement, and approval flows for new domains. |
| Shared product platform | `packages/auth/`, `packages/tenancy/`, `packages/rbac/`, `packages/audit/`, `packages/realtime/`, `packages/files/`, `packages/search/`, `packages/jobs/`, `packages/adapters/`, `packages/api-contracts/`, `packages/domain-model/`, `packages/ui/` | Shared platform maintainers | Foundation contracts cover identity, membership, permissions, audit, event delivery, files, jobs, search, adapters, API surfaces, and app shell primitives. | Postgres, object storage, queue, search, and realtime transport adapters behind the checked-in contracts. |

## Planner And Model Ecosystem

Automium should expose planner integrations as adapters, not as privileged model-specific execution paths. The frozen planner contract requires stable metadata, prompt construction, planner output parsing, intent compilation, and step summarization. The allowed v1 intent vocabulary is:

- `navigate`
- `click`
- `type/fill`
- `select`
- `upload`
- `press-key`
- `wait-for-condition`
- `assert`
- `extract`
- `branch`
- `recover`
- `finish`

Required planner adapter compatibility:

| Concern | Requirement |
| --- | --- |
| Backend identity | Every adapter reports vendor, model, and intent schema version so benchmark reports stay comparable. |
| Tool calling | Tool-call output must normalize into the same planner intent envelope used by non-tool-call planners. |
| Vision support | Vision-capable planners should consume targeted crops only when the runtime says semantics are insufficient. |
| Cost reporting | Token spend and vision usage must be reported per run and per planner backend. |
| Determinism boundary | Planners may be nondeterministic, but executor actions, snapshots, artifacts, and verdicts must remain deterministic enough to replay. |

Early adapter priority should be GPT, Claude, Gemini, then local or fixture planners for offline regression tests. Vendor-specific features should be captured as metadata and policy inputs rather than leaking into the executor action model.

## Product Integration Surfaces

### Altitude

`Altitude` exposes the planning-workspace integration surface:

- API route manifest for projects, work items, cycles, modules, pages, views, comments, attachments, notifications, analytics, and webhooks.
- Adapter boundaries for source control, chat notifications, alerts, and webhook delivery.
- Deterministic seed/reset hooks for workspace, project, work-item, cycle, module, wiki, attachment, and analytics journeys.
- Stable benchmark routes for workspace landing, backlog, board/list view, cycle planning, module detail, wiki, work-item detail, and analytics.

Main external integration opportunities:

- Source control issue linking and branch/commit references.
- Chat notification delivery for assignments, mentions, and due-date alerts.
- Webhook delivery for resource changes and benchmark instrumentation.
- File storage for attachments and download metadata.

### Switchboard

`Switchboard` exposes the support-workspace integration surface:

- API route manifest for accounts, users, inboxes, channels, contacts, conversations, messages, teams, assignments, notes, labels, canned responses, macros, automation, reports, and webhooks.
- Native website live chat, API channel, and email channel contracts.
- Adapter-ready public-channel boundaries for social, messaging, SMS, and voice-style channels.
- Deterministic seed/reset hooks for inbox, conversation, note, shortcut, automation, and reporting journeys.

Main external integration opportunities:

- Website widget embedding and realtime message ingress.
- Programmatic API channel for synthetic or system-originated support events.
- Email threading and outbound reply delivery.
- Public messaging adapters normalized into contact, conversation, and message contracts.
- Webhook delivery for `message.created`, `conversation.updated`, `assignment.changed`, `automation.executed`, and report events.

### Foundry

`Foundry` exposes the app-builder integration surface:

- API route manifest for workspaces, apps, pages, widgets, datasources, queries, JavaScript objects, branches, deployments, runtime sessions, permissions, custom widgets, and audit/activity.
- Datasource adapters for Postgres-compatible SQL, MySQL-compatible SQL, and REST APIs.
- Builder/runtime split with deployment, publish/share, runtime bootstrap, custom widget, branch/version, and permission contracts.
- Deterministic seed/reset hooks for builder, datasource, query, CRUD, custom-widget, publish, and runtime journeys.

Main external integration opportunities:

- Database and REST datasource connectivity through one adapter contract.
- Credential vault resolution for datasource secrets.
- Git-style import, sync, or publish hooks for app definitions.
- Custom widget package registry and runtime loading.
- Runtime event and artifact capture for published apps.

## Setup Path

The ideal first-success path should prove an integration without requiring production infrastructure:

1. Install dependencies with `pnpm install`.
2. Run `pnpm test:run` to verify the contract/domain suite.
3. Inspect the owned corpus in `docs/benchmarks/v1-corpus.md`.
4. Pick one owned fixture and route set from `Altitude`, `Switchboard`, or `Foundry`.
5. Define a natural-language journey against that fixture.
6. Compile the journey through the control-plane or journey-compiler surface.
7. Run it with a fixture planner backend or local planner adapter.
8. Inspect replay events and artifact manifest references.
9. Compare at least two planner backends through the benchmark-runner report.

The production setup path will need additional steps:

- Provision persistence for tenants, journeys, runs, artifacts, and audit events.
- Configure object storage and artifact retention.
- Configure queue transport and worker pool leases.
- Configure credential vault integration for login sessions and product adapters.
- Register authorized domains and fixture policies.
- Register planner providers and model credentials.
- Enable replay console access controls.

## Compatibility Constraints

| Constraint | Why It Matters | Current Guidance |
| --- | --- | --- |
| Authorized-use boundary | Browser agents are risky if they can target arbitrary domains. | Keep owned-domain and fixture-scoped policy checks mandatory. |
| Frozen planner intent vocabulary | Benchmark comparability depends on all planners targeting the same action model. | Extend through versioned schema changes only. |
| Deterministic fixtures | Repeatability metrics are only meaningful when state resets cleanly. | Preserve stable fixture IDs, deterministic keys, and reset readiness checks. |
| Contract versioning | Snapshots, replay events, planner adapters, artifacts, and corpus manifests need migration paths. | Treat every public schema change as versioned. |
| Product parity boundary | Owned products are benchmark fixtures and must not drift casually. | Keep parity matrices and benchmark route manifests in sync with product modules. |
| Semantic-first runtime | Token efficiency depends on structured state, not screenshots by default. | Use targeted vision only for ambiguity or semantic gaps. |
| Credential isolation | Product runs will need secrets for login, datasources, and channels. | Replace seed `secretRef` placeholders with scoped vault retrieval before production. |
| Artifact privacy | Replay data may include sensitive product state. | Retention, access audit, and redaction rules must ship before external use. |
| Infrastructure adapter swap | The repo currently models contracts, not production transports. | Keep Postgres, object storage, queue, realtime, and search behind narrow interfaces. |

## Migration And Adoption Risks

| Risk | Likely Owner | Impact | Mitigation |
| --- | --- | --- | --- |
| Teams expect Playwright/Cypress parity for all tests | QA platform and positioning owners | Automium may be judged against the wrong job. | Position around agent-native workflow QA, replay causality, and planner benchmarking first. |
| Existing selector-based tests are hard to translate | QA automation engineers | Migration stalls before first value. | Provide journey templates, side-by-side examples, and an augmentation path for flaky high-value flows. |
| Planner outputs diverge across model providers | Planner maintainers | Benchmark reports become hard to compare. | Keep adapter metadata strict and normalize all outputs through the same intent vocabulary. |
| Owned fixture realism decays | Benchmark and product maintainers | Benchmark credibility erodes. | Maintain parity matrices, route manifests, fixture checks, and corpus versioning together. |
| Artifact and replay data exposes sensitive state | Security and compliance owners | External pilots may be blocked. | Prioritize artifact retention, redaction, RBAC, audit events, and scoped replay access. |
| Production engine scope grows too quickly | Engine/runtime maintainers | Compatibility work may swamp the QA v1 subset. | Keep v1 focused on authenticated React/Vue SaaS workflows and owned benchmark products. |
| Infrastructure contracts do not match real transports | Platform operators | Queue, storage, and worker behavior may need rewrites. | Add adapters behind current interfaces before expanding product surface. |
| Credential vault arrives late | Security and product integration owners | Real product and datasource journeys stay blocked. | Treat vault-backed secret resolution as a prerequisite for production pilots. |

## Integration Priorities

1. Provider-backed planner adapters for GPT, Claude, Gemini, plus a fixture/local adapter for deterministic CI-style checks.
2. Production persistence and artifact storage behind the existing run, replay, audit, and manifest contracts.
3. Queue and worker infrastructure that implements the current lease, quota, concurrency, and telemetry model.
4. Credential vault integration for product logins, datasource secrets, channel adapters, and planner credentials.
5. Browser UI workflow suites for `Altitude`, `Switchboard`, and `Foundry`.
6. Replay console access control, redaction, retention enforcement, and exportable run bundles.
7. Import or migration examples from Playwright/Cypress for high-value journeys.

## Open Questions

- Which planner provider should become the first production adapter target?
- Should early pilots run through hosted workers, customer-managed workers, or a hybrid worker model?
- What minimum artifact redaction model is acceptable before real customer app runs?
- Which existing test format should get the first migration example: Playwright, Cypress, or manually authored natural-language journeys?
- How should corpus versions be promoted when owned products add new routes, fixtures, or parity surfaces?
- What service-level health checks should gate worker pools, queue transports, artifact storage, and fixture reset readiness?
