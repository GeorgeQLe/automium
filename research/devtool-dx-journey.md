# Automium Devtool DX Journey

## Status

Created on 2026-04-14 from the `devtool-dx-journey` skill.

Primary repo context:

- `research/devtool-user-map.md`
- `research/devtool-integration-map.md`
- `specs/agent-native-browser-qa-platform.md`
- `specs/owned-parity-benchmark-products.md`
- `docs/benchmarks/v1-corpus.md`
- `docs/benchmarks/owned-products.md`
- `docs/contracts/planner-adapter-v1.md`
- `docs/contracts/replay-event-v1.md`
- `docs/contracts/semantic-snapshot-v1.md`
- `tasks/phases/phase-7.md`

## Product Context

Automium is a developer-facing browser QA platform for authorized testing of owned or consented web properties. The current repository implements the platform as TypeScript contracts, domain models, route manifests, deterministic fixtures, replay and artifact metadata, policy checks, and benchmark-runner logic. It proves the platform shape against owned benchmark products, but it is not yet a deployed production browser service.

The DX journey should therefore make the first success contract-level and local:

1. Install dependencies.
2. Run the green contract suite.
3. Pick an owned benchmark product and fixture.
4. Compile a natural-language journey into a graph.
5. Model a run submission through the control-plane contract.
6. Inspect replay and artifact contracts.
7. Compare planner backends against the owned corpus.

Production adoption then requires hardening work around real browser execution, planner provider adapters, persistence, queues, workers, object storage, credential vaults, replay access control, and deployed product UIs.

## DX Principles

- Prove value before infrastructure: the first success should not require cloud accounts, model credentials, object storage, queues, or browser sandboxes.
- Keep owned fixtures central: `Altitude`, `Switchboard`, `Foundry`, and `iframe-fixture` are the stable learning path and benchmark corpus.
- Keep the planner/executor boundary visible: planners emit intent; Automium validates policy, compiles deterministic actions, captures artifacts, and reports comparable metrics.
- Debug through causality, not screenshots alone: replay events, semantic snapshots, executor actions, assertions, network logs, console logs, downloads, and targeted crops are the core failure story.
- Be explicit about current maturity: local contract success is real, while production service readiness is a separate journey.

## Install Journey

| Step | Developer Action | Success Signal | Current Friction | Recommended Improvement |
| --- | --- | --- | --- | --- |
| Discover repository purpose | Read the core spec and research docs. | Developer understands Automium as agent-native browser QA plus owned benchmarks. | There is no root README quickstart. | Add `README.md` with one-paragraph product framing, current maturity, and first-success commands. |
| Install dependencies | Run `pnpm install`. | `node_modules` and workspace dependencies are installed from the lockfile. | `package.json` exposes only `test:run`; install expectations live in task docs. | Document Node and pnpm versions, then pin them with `.nvmrc` or package-manager metadata. |
| Verify workspace | Run `pnpm test:run`. | Full Vitest suite passes across contracts, products, platform, and Phase 7 surfaces. | The suite count is large for a first check, and there is no named quickstart test command. | Add `test:quickstart` for control-plane, journey compiler, replay, artifacts, policies, and alpha benchmark contracts. |
| Inspect corpus | Read `docs/benchmarks/v1-corpus.md`. | Developer can identify app IDs, fixture IDs, environment profiles, and deterministic keys. | The docs are accurate but not packaged as a guided tutorial. | Add a "choose your first fixture" quickstart section with `foundry-baseline-builder`, `altitude-upload-member`, and `switchboard-session-agent`. |

Install journey target: a new contributor can move from clone to passing local contract suite in under 10 minutes without external services.

## Quickstart Journey

The quickest useful Automium path is a contract-level workflow using existing package exports:

1. Choose `foundry`, `altitude`, or `switchboard` from the owned corpus.
2. Choose a matching fixture ID from `packages/benchmark/fixtures/corpus.v1.json`.
3. Validate and compile a natural-language journey through `packages/journey-compiler`.
4. Validate a lower-level journey definition through `apps/control-plane`.
5. Create a run submission with a planner backend reference.
6. Build replay timeline and artifact manifest examples from the run ID.
7. Run a planner comparison through `packages/benchmark-runner`.

Current quickstart surfaces:

| Surface | Current Entry Point | What It Proves |
| --- | --- | --- |
| Natural-language authoring | `validateNaturalLanguageJourney`, `compileNaturalLanguageJourney` | Goal, app, fixture, assertions, and recovery rules compile into a v1 graph. |
| Control-plane contract | `CONTROL_PLANE_ROUTES`, `validateJourneyDefinition`, `compileJourneyDefinition`, `createRunSubmission` | Public run and journey API shape is frozen. |
| Policy checks | `evaluateDomainPolicy`, `evaluateRunPolicy` | Runs stay inside owned-domain and fixture-scoped authorization boundaries. |
| Replay | `buildReplayTimeline`, `summarizeReplayRun` | Planner, executor, runtime, assertion, worker, and artifact events project into stable lanes. |
| Artifacts | `createArtifactManifest`, `calculateArtifactRetention` | Runs produce schema-versioned artifact references and retention metadata. |
| Benchmarking | `comparePlannerBackends` | Planner reports include repeatability, pass rate, latency, token spend, and recovery success metrics. |

Quickstart gap: developers have to infer this flow from tests. The repo should promote one runnable example file or documented `tsx` snippet that compiles and submits a journey against `foundry-baseline-builder`.

## First Successful Journey

Recommended first success: `Foundry` published orders app.

Why this path:

- It uses the default `foundry-baseline-builder` fixture from the v1 corpus.
- It demonstrates the product thesis: compile a goal, target an owned SaaS-style app, create a run, and inspect deterministic debug surfaces.
- It also introduces planner comparison without requiring a real model provider.

Developer story:

| Stage | Action | Expected Result |
| --- | --- | --- |
| Pick fixture | Use `appId: "foundry"` and `fixtureId: "foundry-baseline-builder"`. | The compiler accepts the app and fixture as owned corpus members. |
| State goal | Use a goal like "Open the published orders app and create a new order". | The journey compiler creates navigate, perform, and finish nodes. |
| Add constraints | Include "owned product only" and "no third-party domains". | The journey remains aligned with authorized-use policy. |
| Submit run | Use planner metadata such as `{ id: "local-baseline", vendor: "local", model: "deterministic-fixture" }`. | The control plane returns a queued run with artifact and replay references. |
| Inspect replay | Create a timeline from planner, executor, runtime, and assertion events. | The developer sees causal lanes instead of only video-style evidence. |
| Compare planner | Run `comparePlannerBackends` with `local-baseline` and a future provider backend. | The report shows repeatability, pass rate, median latency, token spend, and recovery success rate. |

Definition of first success: a developer can explain how one natural-language QA goal becomes a graph, a queued run, replay references, artifact metadata, and benchmark metrics.

## Journey Authoring

Authoring should progress from natural language to explicit graph control:

| Authoring Mode | Best For | Current Surface | DX Need |
| --- | --- | --- | --- |
| Natural-language goal | First-time users and product engineers. | `compileNaturalLanguageJourney` creates a simple v1 graph with default assertions and bounded retry. | Provide templates by product and workflow type. |
| Structured journey definition | QA engineers and SDETs. | `JourneyDefinition` supports steps, assertions, recovery, fixtures, and planner intent vocabulary. | Provide examples for uploads, session recovery, iframe workflows, and publish/runtime checks. |
| Benchmark corpus journey | AI platform and benchmark operators. | `benchmarkJourneys` freezes deterministic keys and expected verdicts. | Add corpus authoring rules and review checklist. |
| Production stored journey | DevEx platform teams. | Not yet implemented as persistence. | Add versioned journey storage, API client, import/export, and migration paths. |

The main authoring constraint is the v1 planner intent vocabulary:

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

DX implication: examples should teach users to express behavior through these intents instead of arbitrary browser commands.

## Error Recovery Journey

Automium's recovery story should be taught as bounded and explainable:

| Failure Point | Developer Sees | Recovery Path | Current Maturity |
| --- | --- | --- | --- |
| Invalid app or fixture | Validation error from journey compiler or control plane. | Choose an app and fixture from the owned corpus. | Implemented. |
| Unsupported intent | Validation error or executor fail-fast behavior. | Rewrite the step using the v1 intent vocabulary. | Implemented at contract level. |
| Unauthorized domain | Policy denial with `domain-not-authorized`. | Use `https://owned.local/<appId>` or add a future approved domain policy. | Implemented for owned local domains. |
| Session churn | Journey-level bounded recovery rule. | Retry or recover inside the allowed strategy. | Modeled through Switchboard corpus and recovery metadata. |
| Ambiguous semantic target | Runtime can request targeted vision metadata. | Use targeted crops as fallback, not full-page screenshot-first execution. | Modeled, not connected to real capture. |
| Assertion failure | Replay timeline shows assertion verdict and artifact references. | Inspect semantic snapshots, planner intent, executor action, network log, console log, downloads, and targeted crops. | Implemented as replay/artifact contracts. |
| Worker or quota denial | Orchestrator and policy surfaces deny unsafe or over-quota requests. | Adjust tenant quota, capabilities, priority, or worker lease. | Modeled, not production-operated. |

The debugging quickstart should include a deliberately invalid fixture and a deliberately unsupported intent so developers learn the error model before they hit real failures.

## Debugging And Replay Journey

Debugging should start from a run ID:

1. Open run status through `/runs/:runId`.
2. Open artifact manifest through `/runs/:runId/artifacts`.
3. Open replay stream through `/runs/:runId/replay`.
4. Review timeline lanes in order: planner, executor, runtime, assertions, worker, artifacts.
5. Compare pre-state and post-state semantic snapshots.
6. Inspect planner intent versus executor action.
7. Review assertion traces and recovery attempts.
8. Use targeted crops only when semantic state is insufficient.
9. Export or retain the artifact bundle according to tenant policy.

Required artifact types:

- semantic snapshots
- planner intents
- executor actions
- assertion traces
- network log
- console log
- downloads
- targeted crops

Current DX gap: replay is contract-shaped but not an interactive UI workflow. The next developer-facing step is a sample replay JSONL plus a static replay-console example that demonstrates one passing run and one failed run.

## Production Adoption Journey

Production adoption should be staged because the current repo proves contracts, not live infrastructure.

| Stage | Adoption Goal | Required Capabilities | Current Status |
| --- | --- | --- | --- |
| Local proof | Prove compilation, run modeling, replay metadata, policy checks, and benchmark metrics. | `pnpm install`, `pnpm test:run`, owned corpus docs, local TypeScript examples. | Ready. |
| Internal pilot | Run a narrow set of workflows against one owned or consented app. | Provider planner adapter, real browser engine execution, credential handling, artifact storage, minimal worker runtime. | Hardening required. |
| Team service | Offer run submission and replay to multiple product teams. | Persistence, queues, worker leases, tenant quotas, RBAC, audit, replay access control, retention enforcement. | Contracts modeled; production adapters required. |
| Release gate | Use Automium as part of release confidence. | Stable pass/fail/inconclusive semantics, flake reporting, alerting, baseline comparison, run history. | KPI and verdict contracts exist; operational surface required. |
| Benchmark platform | Compare planner backends across corpus versions. | Provider-backed adapters, repetitions, corpus promotion policy, cost reporting, reproducible reset checks. | Local benchmark contracts ready; provider integration required. |

Production readiness blockers:

- executable HTML/CSS/JS parsing and real browser sandboxing
- provider-backed planner calls for GPT, Claude, Gemini, and local/custom planners
- persistent journey, run, tenant, audit, and artifact storage
- queue transport and worker pools with leases and heartbeats
- object storage and artifact retention enforcement
- credential vault integration for logins, datasources, channels, and planner credentials
- deployed product UIs and browser-driven UI workflow suites
- replay console access control, redaction, and export workflows

## Team Rollout Journey

| Team | First Job | Enablement Needed | Success Metric |
| --- | --- | --- | --- |
| QA automation | Convert one flaky high-value flow into an Automium journey. | Structured journey examples, assertion patterns, replay triage guide. | Fewer ambiguous failures and faster root cause review. |
| Frontend/product engineering | Validate a release-critical workflow without writing selector-heavy tests. | Product-specific templates and fixture selection guide. | One workflow runs consistently before release. |
| DevEx/platform | Stand up Automium as a governed internal service. | Control-plane API docs, worker/queue deployment guide, quota and retention defaults. | Multiple teams submit runs through the same service. |
| AI platform | Compare planner providers under identical workloads. | Planner adapter examples, corpus versioning, token and latency reporting. | Repeatable cross-model reports with cost visibility. |
| Security/compliance | Approve authorized automation and artifact handling. | Domain allowlist model, credential scope, audit events, retention and redaction policy. | Pilot approval for owned or consented domains. |

Rollout sequence:

1. Start with owned corpus demos for all teams.
2. Pick one internal app and two high-value journeys.
3. Add provider-backed planner and fixture/local planner side by side.
4. Run repeated executions to establish baseline repeatability.
5. Review replay artifacts with QA, product, and security stakeholders.
6. Add tenant policy, retention, RBAC, and audit requirements.
7. Expand to a shared service only after operational controls are visible.

## Retention Journey

Developers will keep using Automium if it reliably reduces triage time and proves planner quality over time.

Retention loops:

| Loop | Habit | Product Signal |
| --- | --- | --- |
| Daily debugging | Engineers open replay timelines for failed journeys before opening raw logs. | Replay explains planner intent, executor action, state transitions, assertion verdicts, and artifacts. |
| Weekly benchmark review | AI and QA leads compare planner backends against the same corpus. | Reports preserve repeatability, pass rate, latency, token spend, and recovery success by corpus version. |
| Release readiness | Release managers review journey verdict summaries before ship decisions. | Runs are stable enough to distinguish product regressions from unsupported or inconclusive automation. |
| Fixture maintenance | Benchmark owners update deterministic seeds and reset checks with product changes. | Corpus drift is visible and versioned. |
| Cost governance | Platform owners watch token spend, targeted vision use, worker utilization, and artifact retention. | Automium remains predictable as execution volume grows. |

Retention risks:

- Replay artifacts do not explain failures clearly enough.
- Planner nondeterminism looks like product flake.
- Fixture reset drift breaks repeatability.
- Production browser compatibility grows beyond the supported SaaS subset too quickly.
- Artifact privacy or credential handling blocks broader rollout.
- Teams expect Automium to replace every Playwright or Cypress test instead of focusing on high-value workflow QA.

## Documentation And Example Backlog

Highest-impact DX additions:

1. Root `README.md` with install, current maturity, and one local first-success path.
2. `examples/first-journey.ts` showing `foundry-baseline-builder` compile, run submission, replay summary, artifact manifest, and planner comparison.
3. `pnpm test:quickstart` for the minimum first-success contract slice.
4. Product-specific journey templates for `Altitude`, `Switchboard`, and `Foundry`.
5. Error recovery tutorial with invalid fixture, unauthorized domain, unsupported intent, and assertion failure examples.
6. Replay artifact sample bundle for one pass and one fail.
7. Planner adapter authoring guide for GPT, Claude, Gemini, and deterministic fixture planners.
8. Production deployment guide covering persistence, queues, workers, object storage, credential vaults, RBAC, audit, retention, and redaction.
9. Migration guide for augmenting Playwright or Cypress suites with Automium journeys.

## Open DX Questions

- Should the first public quickstart use `Foundry` because it exercises the richest app-builder workflow, or `Altitude` because the attachment journey is simpler?
- Should the default local planner be a deterministic fixture planner, a provider-backed GPT adapter, or both?
- What is the smallest replay artifact bundle that proves causal debugging without overwhelming first-time users?
- Which production packaging should come first: hosted control plane, self-hosted workers, or fully self-hosted deployment?
- What import path should be prioritized for existing QA teams: Playwright tests, Cypress tests, plain English scenarios, or checked-in YAML/JSON journeys?
