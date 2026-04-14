# Automium Devtool Adoption Plan

## Status

Created on 2026-04-14 from the `devtool-adoption` skill.

Primary repo context:

- `research/devtool-user-map.md`
- `research/devtool-integration-map.md`
- `research/devtool-dx-journey.md`
- `specs/agent-native-browser-qa-platform.md`
- `specs/owned-parity-benchmark-products.md`
- `docs/benchmarks/v1-corpus.md`
- `specs/drift-report.md`

## Product Context

Automium is a developer-facing browser QA platform for authorized testing of owned or consented web properties. The current repository proves the platform through TypeScript contracts, domain models, route manifests, deterministic owned benchmark fixtures, replay and artifact metadata, policy checks, orchestration models, and benchmark comparison logic.

The adoption plan should be honest about maturity:

- Ready now: local contract-level proof, owned benchmark corpus, journey compilation, run submission modeling, policy checks, replay/artifact contracts, and planner comparison reports.
- Hardening required before production pilots: executable browser engine, provider-backed planner adapters, persistence, queues, worker pools, object storage, credential vaults, replay access control, deployed product UIs, redaction, and operational dashboards.

The right early adoption motion is not "replace every end-to-end test." It is "prove agent-native workflow QA on high-value journeys, with causal replay and planner benchmarking."

## Adoption Thesis

Automium adoption should move developers through five proofs:

| Proof | Developer Question | Automium Answer |
| --- | --- | --- |
| First local proof | Can I run this repo and understand the platform shape quickly? | `pnpm install`, `pnpm test:run`, owned corpus docs, and one first-journey example. |
| Workflow proof | Can a natural-language goal become a structured journey and run request? | Journey compiler and control-plane contracts turn app, fixture, goal, assertions, and recovery into a versioned graph and run submission. |
| Debug proof | Will failures be explainable? | Replay lanes, artifact manifests, semantic snapshots, executor actions, assertion traces, and targeted vision metadata show causality. |
| Benchmark proof | Can planner quality and cost be compared fairly? | Owned corpus runs compare repeatability, pass rate, latency, token spend, and recovery success by planner backend. |
| Platform proof | Can this become governed QA infrastructure? | Tenancy, policy, quotas, audit, retention, worker leases, and artifact contracts define the operating model before production adapters arrive. |

Adoption should start with developers who already feel the pain of flaky workflow tests, opaque browser-agent failures, or model planner comparisons. Broader team rollout should wait until production hardening closes the runtime and infrastructure gaps documented in `specs/drift-report.md`.

## Adoption Loops

### Loop 1: Local First Success

Goal: make a new contributor reach a green local proof and understand the product in under 10 minutes.

Trigger:

- A developer reads the repo, a post, or an internal demo and wants to see what Automium actually does.

Loop:

1. Clone and install dependencies.
2. Run the contract suite.
3. Inspect the owned benchmark corpus.
4. Run or read a first-journey example using `foundry-baseline-builder`.
5. Inspect the generated journey graph, run submission, replay summary, artifact manifest, and benchmark comparison.

Retention hook:

- The contributor can modify one goal or fixture and see deterministic contract feedback immediately.

Required assets:

- Root quickstart.
- `examples/first-journey.ts`.
- `pnpm test:quickstart` focused on compiler, control plane, policies, replay, artifacts, and benchmark runner.

### Loop 2: Debugging Trust

Goal: teach users that Automium explains failures through causality rather than screenshots alone.

Trigger:

- A QA engineer or frontend engineer sees a failed journey or deliberately runs an invalid fixture/tutorial case.

Loop:

1. Open run status.
2. Open replay events.
3. Review planner, executor, runtime, assertion, worker, and artifact lanes.
4. Compare semantic snapshots and executor actions.
5. Inspect assertion traces, recovery attempts, and targeted crop requests.
6. Decide whether the cause is product regression, unsupported intent, fixture drift, policy denial, or inconclusive automation.

Retention hook:

- Engineers start checking replay timelines before raw logs or video.

Required assets:

- Passing replay sample bundle.
- Failing replay sample bundle.
- Error recovery tutorial with invalid fixture, unauthorized domain, unsupported intent, and assertion failure examples.
- Replay triage checklist.

### Loop 3: Planner Benchmark Review

Goal: create a repeatable habit for AI platform and QA leaders to compare planner backends.

Trigger:

- A team is choosing between GPT, Claude, Gemini, local planners, or custom browser agents.

Loop:

1. Select a corpus version.
2. Choose planner backends.
3. Run repeated owned-product journeys.
4. Compare repeatability, pass rate, latency, token spend, recovery success, and targeted vision usage.
5. Review replay artifacts for representative failures.
6. Promote or reject a planner backend for a use case.

Retention hook:

- Weekly planner reports become the source of truth for model quality and cost.

Required assets:

- Planner adapter authoring guide.
- Deterministic fixture planner.
- Provider-backed GPT, Claude, and Gemini adapters when production hardening begins.
- Benchmark report template.
- Corpus promotion checklist.

### Loop 4: High-Value Journey Pilot

Goal: let one team augment an existing QA strategy without forcing a full migration.

Trigger:

- A team has a flaky, expensive, or manually tested workflow such as account setup, CRUD, upload, dashboard verification, publish/runtime, support triage, or cross-frame interaction.

Loop:

1. Pick one authorized app and two high-value workflows.
2. Express each workflow as a natural-language journey and structured fallback.
3. Run repeated baseline checks.
4. Review failure artifacts with QA, frontend, and security stakeholders.
5. Decide whether Automium should own that workflow, augment existing Playwright/Cypress tests, or remain a benchmark-only tool for now.

Retention hook:

- The team sees lower ambiguity in failures and less selector-maintenance work on selected flows.

Required assets:

- Playwright or Cypress augmentation guide.
- Product-specific journey templates.
- Pilot scorecard for coverage, failure clarity, repeatability, and maintenance effort.
- Security and consent checklist.

### Loop 5: Platform Rollout

Goal: turn Automium into a governed internal QA service after runtime and infrastructure hardening.

Trigger:

- Multiple teams want run submission, artifact access, planner comparison, and quota-governed worker execution.

Loop:

1. Configure tenants, domain allowlists, credential scopes, quotas, retention, and RBAC.
2. Run a controlled pilot with self-hosted or managed workers.
3. Add journey storage, run history, artifact storage, and replay access control.
4. Publish team onboarding templates and runbooks.
5. Review adoption and cost metrics monthly.

Retention hook:

- Product teams submit runs through one governed control plane instead of building separate browser QA stacks.

Required assets:

- Production deployment guide.
- Worker and queue operations guide.
- Artifact retention and redaction policy.
- Security review packet.
- Team rollout playbook.

## Examples

| Example | Audience | Purpose | Current Status |
| --- | --- | --- | --- |
| `examples/first-journey.ts` | New contributors, QA engineers, frontend engineers | Compile a `Foundry` journey, create a run submission, summarize replay, create artifact metadata, and compare fixture planners. | Needed. |
| `examples/altitude-upload-journey.ts` | QA engineers, frontend engineers | Show upload and work-item state verification against `altitude-upload-member`. | Needed. |
| `examples/switchboard-session-recovery.ts` | QA engineers, support engineering | Show bounded recovery on the `switchboard-session-agent` fixture. | Needed. |
| `examples/foundry-publish-runtime.ts` | AI platform, QA architects | Show a richer builder/runtime journey with datasource and publish semantics. | Needed. |
| `examples/replay-triage.ts` | QA engineers, release engineers | Turn replay events and artifact manifests into a failure summary. | Needed. |
| `examples/planner-comparison.ts` | AI platform engineers | Compare deterministic fixture planners first, then provider-backed adapters later. | Needed. |
| `examples/policy-denial.ts` | Security reviewers, platform admins | Demonstrate authorized-domain enforcement and fixture-scoped run policy. | Needed. |

The first example should avoid external services and model credentials. It should use the local contract surfaces already implemented so adoption does not depend on production infrastructure.

## Templates

### Journey Template

Use for natural-language and structured journey authoring:

- App ID and fixture ID.
- Authorized domain profile.
- User goal.
- Preconditions.
- Steps or intent hints.
- Assertions.
- Recovery rules.
- Expected verdict.
- Artifact expectations.

### Fixture Template

Use when adding owned benchmark coverage:

- Fixture ID.
- Deterministic key.
- Seed data.
- Reset behavior.
- Authorized routes.
- Expected semantic state.
- Recovery conditions.
- Corpus version impact.

### Replay Triage Template

Use for debugging failed or inconclusive runs:

- Run ID.
- Final verdict.
- Failed assertion or unsupported intent.
- Last planner intent.
- Executor action.
- Semantic snapshot delta.
- Recovery attempts.
- Artifact references.
- Product issue, fixture issue, planner issue, policy issue, or runtime issue.

### Planner Adapter Template

Use for GPT, Claude, Gemini, local, or custom planner adapters:

- Vendor and model metadata.
- Intent schema version.
- Prompt construction.
- Output parser.
- Tool-call normalization.
- Vision support flags.
- Token and cost reporting.
- Failure and retry semantics.

### Benchmark Report Template

Use for weekly model-quality review:

- Corpus version.
- Planner backends.
- Repetition count.
- Pass rate.
- Repeatability.
- Median and p95 latency.
- Token spend.
- Targeted vision usage.
- Recovery success rate.
- Representative replay links.

### Pilot Rollout Template

Use before production adoption:

- Target team and champion.
- Authorized app and domains.
- Two to five high-value journeys.
- Security approval status.
- Credential and fixture plan.
- Run volume and quota expectations.
- Artifact retention settings.
- Success metrics and exit criteria.

## Community Channels

Early Automium community should be oriented around proof artifacts, not broad forum volume.

| Channel | Audience | Purpose | Operating Rule |
| --- | --- | --- | --- |
| Examples gallery | Developers evaluating the tool | Show complete local workflows and expected outputs. | Every example must run locally or state its hardening dependency. |
| Corpus review notes | Benchmark maintainers, AI platform engineers | Discuss owned fixture quality, route coverage, and corpus version changes. | Every corpus change needs deterministic seed/reset evidence. |
| Planner adapter notes | AI platform engineers, contributors | Coordinate provider adapters and output normalization. | Adapter behavior must not leak vendor-specific actions into the executor model. |
| Replay case studies | QA engineers, release engineers | Teach failure diagnosis through replay timelines and artifacts. | Include at least one passing and one failing case. |
| Security review packet | Security and compliance reviewers | Explain authorized use, domain allowlists, credentials, audit, retention, and redaction. | Keep current gaps explicit until production hardening lands. |
| Migration discussions | QA automation engineers | Share Playwright/Cypress augmentation patterns. | Position Automium around high-value workflow QA rather than blanket replacement. |

For an internal rollout, these channels can start as checked-in docs and recurring review meetings. For an external community, they should become examples, guides, discussions, and RFC-style change proposals after the production hardening path is clearer.

## Proof Artifacts

Proof artifacts are the evidence that lets developers trust a new testing platform.

### Available Now

- Full contract suite: `pnpm test:run` currently validates contracts, owned products, shared platform packages, Phase 7 runtime surfaces, and alpha owned-product paths.
- TypeScript check: `pnpm exec tsc --noEmit` validates the workspace public surfaces.
- Owned benchmark corpus: `docs/benchmarks/v1-corpus.md` and `packages/benchmark/fixtures/corpus.v1.json`.
- Contract docs: semantic snapshot, replay event, and planner adapter v1 docs.
- Parity matrices for `Altitude`, `Switchboard`, and `Foundry`.
- Spec drift report with verified claims and deferred production warnings.
- Research artifacts for users, integration map, and DX journey.

### Needed Next

- Root quickstart with current maturity and local first-success flow.
- First journey example that produces graph, run submission, replay summary, artifact manifest, and benchmark comparison.
- Product-specific journey templates for the three owned products.
- Replay sample bundles for passing and failing runs.
- Planner adapter guide and deterministic local planner example.
- Migration guide for augmenting Playwright/Cypress with Automium journeys.
- Production hardening proof: provider adapters, executable browser runtime, persistence, queues, workers, object storage, credential vault, deployed product UIs, retention/redaction, and replay access control.

## Activation Metrics

Activation should measure real progress toward trust, not vanity usage.

| Stage | Metric | Target Signal |
| --- | --- | --- |
| Install | Time from clone to green local check | New contributor can run the focused quickstart suite in under 10 minutes. |
| First journey | Time to compile and inspect one owned-product journey | Developer can explain graph, run submission, replay, artifact, and benchmark outputs. |
| Debugging | Percentage of failed examples with a classified cause | Failures are attributed to product, fixture, planner, policy, or runtime. |
| Benchmarking | Planner comparison reports produced per corpus version | AI/QA leads use repeatability, latency, spend, pass rate, and recovery data. |
| Pilot | High-value journeys running repeatedly for one authorized app | Team sees stable verdicts and clearer failure triage than previous workflow. |
| Team rollout | Teams submitting runs through one control plane | Shared service adoption grows with quota, audit, retention, and artifact controls. |
| Retention | Repeat usage of replay and benchmark reports | Engineers use Automium outputs in debugging, release, and model-selection decisions. |

Early activation gates:

1. A new developer can run local checks and find the owned corpus without help.
2. A QA engineer can adapt a template to one high-value workflow.
3. An AI platform engineer can compare two planner backends on the same corpus.
4. A security reviewer can identify the authorized-use and artifact-retention boundaries.
5. A platform owner can list the hardening work required before production rollout.

## Adoption Risks

| Risk | Adoption Impact | Mitigation |
| --- | --- | --- |
| Automium is judged as a universal Playwright/Cypress replacement | Early users reject it for the wrong job. | Position around high-value workflow QA, causal replay, and planner benchmarking. |
| Current repo maturity is overstated | Production pilots fail trust review. | Keep contract-level proof separate from runtime/infrastructure hardening. |
| First success requires too much inference from tests | Developers churn before seeing value. | Add README, examples, quickstart command, and product templates. |
| Replay artifacts are too abstract | QA engineers do not trust failure diagnosis. | Provide sample replay bundles and triage guides with product-level causes. |
| Planner nondeterminism looks like platform flake | Release managers hesitate to use verdicts. | Publish benchmark repeatability, recovery, and inconclusive classifications. |
| Security concerns block pilots | Browser agents seem unsafe without controls. | Lead with domain allowlists, tenant policy, credential scope, audit, retention, and redaction. |
| Fixture realism decays | Benchmarks stop persuading AI/QA teams. | Treat corpus versioning, parity matrices, seed/reset checks, and route manifests as one review surface. |

## Recommended Adoption Backlog

1. Add root `README.md` with maturity, install, local proof, and first-success path.
2. Add `examples/first-journey.ts` backed by existing contract surfaces.
3. Add `test:quickstart` for the smallest first-success contract slice.
4. Add product-specific journey templates for `Altitude`, `Switchboard`, and `Foundry`.
5. Add replay sample bundles and replay triage guide.
6. Add planner adapter authoring guide and deterministic local planner example.
7. Add Playwright/Cypress augmentation guide focused on high-value flaky workflows.
8. Add security review packet for authorized use, credentials, artifacts, retention, redaction, and audit.
9. Convert the deferred production hardening warnings into an execution roadmap before external pilots.

## Open Adoption Questions

- Which first audience should the examples optimize for: QA automation engineers, AI platform engineers, or DevEx platform owners?
- Should the first public proof center on `Foundry` for richness or `Altitude` for simplicity?
- What is the smallest replay bundle that makes causal debugging obvious without overwhelming first-time users?
- Should provider-backed planner adapters ship before or after the deterministic local planner example?
- What minimum security packet is required before an internal pilot against a real consented app?
- Should community activity begin as internal corpus/planner/replay reviews before any public contributor motion?
