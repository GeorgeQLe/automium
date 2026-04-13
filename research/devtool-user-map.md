# Automium Devtool User Map

## Status

Created on 2026-04-13 from the `devtool-user-map` skill.

Primary repo context:

- `specs/agent-native-browser-qa-platform.md`
- `specs/owned-parity-benchmark-products.md`
- `docs/benchmarks/owned-products.md`
- `tasks/roadmap.md`
- `tasks/phases/phase-7.md`

## Product Context

Automium is an agent-native browser QA platform for authorized testing of owned or consented web properties. The platform compiles natural-language QA journeys into executable journey graphs, runs them through a semantic browser/runtime and deterministic executor, captures replayable artifacts, and benchmarks planner backends across repeatability, latency, token spend, pass rate, and recovery rate.

Automium also includes owned benchmark products:

- `Altitude`: project-management workspace for planning and collaboration journeys.
- `Switchboard`: multi-channel support workspace for realtime conversation and automation journeys.
- `Foundry`: internal app builder for datasource, widget, binding, publish, and runtime journeys.

The initial adoption motion should therefore sell two connected ideas: a QA execution substrate for agent-driven browser testing, and a controlled benchmark corpus that proves agent reliability without relying on third-party SaaS drift.

## Primary Developer Users

| User | Core Job | What They Need From Automium | Adoption Trigger |
| --- | --- | --- | --- |
| QA automation engineers and SDETs | Convert product workflows into stable automated checks and debug failures quickly. | Natural-language journey authoring, deterministic execution, assertions, retries, replay artifacts, and low-flake semantics. | Existing Playwright or Cypress suites are expensive to maintain, flaky on SPAs, or too brittle for broad workflow coverage. |
| Frontend and full-stack product engineers | Validate critical user journeys before release without writing large amounts of test glue. | Reusable journey definitions, fixture-aware execution, clear failure causality, and artifacts that point to UI, network, or state changes. | A team ships frequent UI changes and needs fast confidence on login, forms, dashboards, CRUD, uploads, and SPA navigation. |
| Developer productivity and platform engineers | Offer browser QA as an internal service across product teams. | Tenant isolation, job submission APIs, worker leases, quota controls, artifact retention, policy enforcement, and benchmark reporting. | Multiple teams duplicate QA infrastructure or need a centralized service with governance and visibility. |
| AI/agent platform engineers | Compare model planners and agent strategies under identical browser workloads. | Planner abstraction, semantic snapshots, token budget controls, targeted vision fallback, cross-model benchmark reports, and reproducible fixtures. | The organization is evaluating GPT, Claude, Gemini, or custom planners for browser automation quality and cost. |
| Test architects and QA leads | Define a durable test strategy for realistic product journeys. | Journey graphs, recovery policies, assertion modeling, corpus-level coverage, repeatability metrics, and debug/replay review workflows. | Manual regression suites or brittle scripted tests no longer scale with product complexity. |
| Reliability and release engineers | Gate releases against business-critical flows and inspect regression causes. | Stable execution environments, pass/fail/inconclusive verdicts, telemetry summaries, and artifact bundles tied to run IDs. | Release failures need clearer root cause than screenshots or raw videos can provide. |

## Secondary Users

| User | Core Job | What They Need From Automium |
| --- | --- | --- |
| Support engineering teams | Reproduce support-reported workflow failures in SaaS apps. | Saved journeys, replay bundles, environment fixtures, and failure summaries that can be shared with product teams. |
| Solutions engineers for devtool sales | Demonstrate value on realistic SaaS workflows. | Owned benchmark products, canned journeys, planner comparisons, and before/after cost or reliability evidence. |
| Security engineers | Ensure automated browser execution is restricted to authorized use. | Domain allowlists, tenant policy profiles, credential scoping, audit logs, and artifact retention controls. |
| Compliance and privacy reviewers | Approve capture, retention, and access rules for replay artifacts. | Retention metadata, auditable artifact access, tenant isolation, and redaction or credential-handling boundaries. |
| Open-source or ecosystem contributors, if externalized later | Extend adapters, planner integrations, benchmark fixtures, and docs. | Stable contracts, fixture examples, package boundaries, and clear contribution ownership. |

## Economic Buyers

| Buyer | Budget Rationale | Success Proof |
| --- | --- | --- |
| VP Engineering or Head of Engineering | Reduce release risk and make regression coverage scale with product surface area. | Repeatability across large journey sets, lower escaped defects, faster failure triage, and reduced manual regression load. |
| Head of QA or Quality Engineering | Modernize automation around realistic workflows instead of brittle selector scripts. | More critical journeys covered, fewer flaky failures, faster root cause analysis, and clearer ownership of defects. |
| Head of Developer Productivity or Platform | Centralize browser QA infrastructure with policy, quotas, and reusable services. | Higher internal adoption, stable APIs, predictable worker costs, and governance across teams. |
| CTO or technical founder | Bet on agent-native QA as a strategic advantage over human-browser automation. | Strong benchmark results, lower token spend, credible engine/runtime differentiation, and an adoption path from pilot to platform. |
| Engineering finance or operations leader | Control the cost of large-scale QA and model evaluation. | Cost per completed journey, worker utilization, token spend reporting, and lower labor spent maintaining brittle suites. |

## Champions

| Champion | Why They Push Automium | Enablement They Need |
| --- | --- | --- |
| Senior SDET or QA automation lead | They feel the pain of flaky end-to-end suites and slow failure diagnosis directly. | Migration examples from existing E2E tests, journey authoring templates, replay demos, and flake-reduction data. |
| DevEx platform owner | They can turn Automium into a shared internal capability. | API-first docs, tenancy and quota examples, rollout playbooks, and operational dashboards. |
| AI tooling lead | They want objective planner comparisons across model vendors. | Cross-model benchmark workflows, stable corpus fixtures, token/cost reports, and planner adapter examples. |
| Frontend tech lead | They need confidence on complex SPA flows without owning a custom test framework. | Product-specific starter journeys, assertion examples, and readable failure artifacts. |
| QA manager | They need to justify automation investment with measurable coverage and triage wins. | Coverage maps, repeatability metrics, defect examples, and before/after manual effort estimates. |

## Maintainers And Contributors

| Maintainer Group | Owned Surface | Main Risk |
| --- | --- | --- |
| Engine and runtime maintainers | Browser state, semantic graph, stable element identity, snapshots, targeted vision triggers, actionability scoring. | Compatibility scope creep and semantic regressions that reduce determinism. |
| Executor and policy maintainers | Intent compilation, retries, recovery, assertions, allowlists, quotas, credential and artifact policy. | Unsafe automation scope, over-broad actions, or recovery behavior that hides real failures. |
| Planner adapter maintainers | GPT, Claude, Gemini, and future planner interfaces. | Vendor-specific coupling that weakens benchmark comparability. |
| Benchmark and corpus maintainers | Owned benchmark journeys, deterministic fixtures, KPI definitions, and comparison reports. | Fixture drift that makes results less reproducible or less representative. |
| Owned product maintainers | `Altitude`, `Switchboard`, `Foundry`, shared tenancy/RBAC/audit/realtime/files/search/jobs packages. | Product surface drift away from the frozen parity contract or gaps that weaken benchmark realism. |
| Replay and artifact maintainers | Event streams, artifact manifests, replay timelines, targeted crops, network traces, and retention metadata. | Debug views that fail to explain causality or expose sensitive data too broadly. |
| Documentation and examples maintainers | Quickstarts, journey templates, migration guides, planner examples, and operating runbooks. | Users fail before first successful journey because setup and authoring concepts are unclear. |

## Operational Stakeholders

| Operator | Responsibilities | Required Controls |
| --- | --- | --- |
| QA platform admin | Manage tenants, fixtures, environments, job queues, and artifact access. | Tenant isolation, quotas, retention settings, role-based access, audit trails, and worker health visibility. |
| Release manager | Decide whether release-blocking journeys pass, fail, or need manual review. | Run status, final verdicts, assertion summaries, replay links, and confidence metrics by journey. |
| Infrastructure operator | Keep workers, queues, object storage, and event streams reliable. | Worker lease status, queue placement, concurrency limits, telemetry summaries, and artifact storage limits. |
| Security operator | Enforce authorized-use boundaries. | Domain allowlists, policy decisions, credential scope, audit events, and artifact retention controls. |
| Benchmark operator | Run planner comparisons across owned corpus versions. | Corpus versioning, planner backend metadata, repetitions, metrics, and reproducible fixture reset hooks. |

## High-Value Use Cases

1. Author a natural-language journey for an authenticated SaaS workflow, compile it to a graph, and run it against deterministic fixtures.
2. Execute the same journey many times to measure repeatability under controlled worker isolation.
3. Debug a failed journey with replay events, semantic snapshots, planner intent, executor action, targeted visual crops, mutations, and artifacts.
4. Compare GPT, Claude, Gemini, or custom planners on the same owned benchmark corpus.
5. Replace third-party SaaS benchmark dependencies with `Altitude`, `Switchboard`, and `Foundry` fixtures that can be seeded and reset locally.
6. Centralize QA execution for multiple teams with tenant isolation, quota controls, run policies, and artifact governance.
7. Validate complex SPA patterns: login, dashboards, CRUD flows, file uploads, iframe usage, WebSocket-visible state, and async UI transitions.

## Adoption Blockers

| Blocker | Who Feels It | Why It Matters | Mitigation |
| --- | --- | --- | --- |
| Trust in a new browser engine | QA leads, platform engineers, CTOs | Teams will doubt compatibility until their own app workflows run reliably. | Start with the documented SaaS subset, publish compatibility boundaries, and provide pilot journeys against target app profiles. |
| Migration cost from Playwright or Cypress | QA automation engineers, frontend teams | Existing tests and team habits create switching costs. | Provide migration guides, side-by-side examples, and a path where Automium first covers high-value flaky journeys. |
| Agent nondeterminism concerns | QA leaders, release managers | Release gates need explainable pass/fail behavior. | Emphasize deterministic executor boundaries, semantic snapshots, recovery policies, replay causality, and benchmark repeatability. |
| Security and consent boundaries | Security, compliance, platform admins | Browser agents can look risky if scope is unclear. | Keep authorized-use policy explicit with domain allowlists, tenant isolation, credential scoping, and audited artifacts. |
| Artifact privacy and retention | Compliance, support, platform admins | Replays may contain sensitive app data. | Make retention, access control, redaction boundaries, and audit trails part of deployment planning. |
| Cost predictability | Economic buyers, platform owners | Large-scale model-backed QA can become expensive. | Report token spend, cost per completed journey, worker utilization, and targeted vision usage. |
| Fixture realism | AI platform engineers, QA architects | Benchmarks are only useful if they represent real workflows. | Maintain owned parity matrices, deterministic seed/reset plans, and benchmark-critical journey coverage. |
| Operational maturity | Infrastructure operators, DevEx teams | A QA platform must be reliable enough to become shared infrastructure. | Expose queueing, worker leases, quotas, telemetry summaries, and artifact storage controls early. |
| Positioning versus established E2E tools | Buyers, QA automation teams | Automium must not look like a slower replacement for all browser testing. | Position it around agent-native workflow QA, causal replay, model benchmarking, and high-value journeys rather than replacing every selector-level test. |

## Adoption Sequence

1. Prove benchmark credibility on the owned corpus: run `Altitude`, `Switchboard`, and `Foundry` journeys with repeatable pass rates and clear replay artifacts.
2. Pilot on one authorized customer or internal SaaS app with a narrow workflow set: login, create/edit records, upload files, and verify dashboard state.
3. Add planner comparison reporting to show quality and cost tradeoffs across model backends.
4. Integrate platform operations: tenant policy, domain allowlist, quota defaults, worker lease visibility, and artifact retention.
5. Expand from a few painful flaky journeys into a shared QA service for product teams.

## Messaging By Persona

| Persona | Message |
| --- | --- |
| QA automation engineer | Write fewer brittle selectors, get clearer failure causality, and focus automation effort on product behavior. |
| Frontend engineer | Validate real user journeys and see exactly what changed when a run fails. |
| DevEx platform owner | Offer browser QA as a governed internal service with APIs, quotas, workers, and artifacts. |
| AI platform engineer | Compare planners under identical, reproducible browser workloads with token and recovery metrics. |
| Engineering leader | Increase workflow coverage and reduce release risk without scaling manual regression effort linearly. |
| Security reviewer | Keep agent execution scoped to authorized domains with audit, isolation, and retention controls. |

## Open Research Questions

- Which initial customer segment has the strongest pain: QA automation teams replacing flaky E2E suites, DevEx teams centralizing QA, or AI teams benchmarking browser agents?
- What minimum compatibility proof is required before teams trust the new browser engine against their own SaaS apps?
- Should early packaging emphasize hosted cloud execution, self-hosted/on-prem deployment, or a hybrid worker model?
- Which migration story is most compelling: Playwright/Cypress augmentation, manual regression replacement, or planner benchmark infrastructure?
- What artifact redaction and retention guarantees are required for regulated customers?
