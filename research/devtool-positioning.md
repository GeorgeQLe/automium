# Automium Devtool Positioning

## Status

Created on 2026-04-14 from the `devtool-positioning` skill.

Primary repo context:

- `research/devtool-user-map.md`
- `research/devtool-integration-map.md`
- `research/devtool-dx-journey.md`
- `research/devtool-adoption.md`
- `specs/agent-native-browser-qa-platform.md`
- `specs/owned-parity-benchmark-products.md`
- `docs/benchmarks/v1-corpus.md`
- `specs/drift-report.md`

External reference context:

- [Playwright coding agents](https://playwright.dev/docs/getting-started-cli)
- [Playwright test generator](https://playwright.dev/docs/codegen)
- [Playwright locators and ARIA snapshots](https://playwright.dev/python/docs/api/class-locator)
- [Cypress AI](https://docs.cypress.io/cloud/features/cypress-ai-features)
- [Browserbase overview](https://docs.browserbase.com/welcome/what-is-browserbase)
- [Selenium documentation](https://www.selenium.dev/documentation/)
- [MDN WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver)
- [Claude computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)

## Product Context

Automium is a developer-facing browser QA platform for authorized testing of owned or consented web properties. The current repository proves the platform through TypeScript contracts, domain models, route manifests, deterministic owned benchmark fixtures, journey compilation, run submission modeling, policy checks, replay and artifact metadata, worker and orchestration models, and planner comparison reports.

Automium should not be positioned as a drop-in replacement for Playwright, Cypress, Selenium, Browserbase, or model-native computer-use tools. Its clearest wedge is governed agent-native workflow QA:

1. Developers describe high-value product journeys.
2. Planner adapters produce normalized intent.
3. Automium enforces policy and compiles deterministic actions.
4. Runs produce semantic snapshots, replay events, artifacts, and verdicts.
5. Teams compare planner backends on the same owned benchmark corpus.

The honest maturity claim is: Automium is ready for local contract-level proof and positioning research, while production pilots still require executable browser runtime hardening, provider-backed planner adapters, persistence, queues, worker pools, object storage, credential vaults, replay access control, deployed product UIs, redaction, and operational dashboards.

## Market Map

| Category | Representative Alternatives | Developer Mental Model | Where They Win | Automium Position |
| --- | --- | --- | --- | --- |
| Selector-first E2E frameworks | Playwright, Cypress, Selenium/WebDriver | Write or generate browser tests in code. | Mature ecosystem, real-browser compatibility, CI familiarity, direct assertions, broad community trust. | Augment them for high-value agent-authored workflows where replay causality and planner benchmarking matter more than full test-suite replacement. |
| Agent-facing browser automation | Playwright CLI/MCP, Browserbase Stagehand, browser-agent SDKs | Give an agent a controllable browser and page state. | Fast adoption, real browser sessions, natural-language selectors, hosted browser infrastructure, agent-friendly primitives. | Own the QA platform layer: fixtures, authorization policy, deterministic executor boundary, verdicts, replay, and cross-planner comparability. |
| Hosted browser infrastructure | Browserbase, BrowserStack, Sauce Labs, LambdaTest | Run browser sessions at scale without owning infrastructure. | Production browser fleets, device/browser matrices, recordings, logs, parallelism, support. | Integrate with or complement hosted browsers, but differentiate through QA-specific semantic runtime, model adapter benchmarking, and causal artifacts. |
| Synthetic monitoring and production checks | Checkly, Datadog Synthetics, New Relic Synthetics | Continuously check user flows from production locations. | Uptime and regression monitoring, alerting, dashboards, operational integration. | Focus earlier in the lifecycle on authored QA journeys, replayable failure triage, and planner quality measurement before production monitoring. |
| Low-code and AI-assisted QA platforms | mabl, Testim, Functionize, Reflect-style tools | Let non-specialists create and maintain tests with AI or recorders. | Adoption by QA teams, visual authoring, self-healing claims, managed test operations. | Stay developer-platform oriented: versioned contracts, API-first workflows, owned fixtures, policy controls, and measurable planner/backend reports. |
| Model-native computer-use loops | Claude computer use, OpenAI computer-use style APIs, Gemini/Chrome agent features | Let the model see and control a desktop or browser. | Generality, quick demos, low custom runtime investment, model-vendor velocity. | Provide the governed QA substrate around models: authorized domains, fixture reset, deterministic action compilation, replay artifacts, and benchmark metrics. |
| Benchmark harnesses and browser-agent evaluations | Web task benchmarks, internal model eval harnesses, custom QA eval suites | Compare agent performance across repeatable tasks. | Research credibility and model-selection utility. | Combine benchmark harness and QA product: owned SaaS-style fixtures plus replay, policy, artifacts, and production adoption path. |

## Alternative Analysis

### Playwright

Playwright is the strongest default alternative for developer-owned E2E testing. It has mature real-browser automation, auto-waiting locators, test generation, traces, code-first assertions, CI patterns, and increasingly agent-oriented entry points. Playwright's own docs now describe agent-facing CLI workflows and token-efficient snapshots for coding agents.

Automium should not attack Playwright on browser compatibility or developer trust. Playwright wins there today. The positioning should be:

- Use Playwright for broad selector-level regression suites, compatibility coverage, and code-owned tests.
- Use Automium for high-value workflows where the test authoring unit is a product goal, the runtime must explain planner intent versus executor action, and the team needs planner quality and cost metrics.
- Provide a future Playwright augmentation path rather than a rip-and-replace migration story.

### Cypress

Cypress has a strong workflow around local developer feedback, app-centric debugging, cloud analytics, and now AI-assisted test authoring, summaries, failure explanation, Cloud MCP, and selector self-healing. Cypress AI explicitly targets faster test writing, easier failure understanding, coverage gap discovery, and reduced maintenance without changing the Cypress workflow.

Automium should not claim "AI test generation" as a sufficient differentiator. Cypress already owns that language for Cypress users. The positioning should be:

- Cypress helps teams write and maintain Cypress tests faster.
- Automium evaluates full agent-planned journeys and planner backends under governed fixtures.
- Cypress failure summaries explain failed Cypress tests; Automium replay should explain the causal chain across planner intent, semantic state, executor action, assertion, artifact, worker, and policy events.

### Selenium And WebDriver

Selenium and WebDriver remain the standards-backed, broad-language browser automation foundation. MDN describes WebDriver as a platform-neutral browser automation interface, and Selenium provides tools, libraries, Grid, and vendor-backed WebDriver infrastructure across major browsers.

Automium should respect this ecosystem and avoid broad compatibility claims before the production engine is ready. The positioning should be:

- WebDriver/Selenium are the portability and browser-vendor standard layer.
- Automium is a specialized QA execution substrate for agent planners, deterministic fixtures, replay, and benchmarks.
- Automium's v1 compatibility target is intentionally narrower: authenticated SaaS-style workflows on owned or consented properties.

### Browserbase And Stagehand

Browserbase is the clearest alternative in AI-native browser automation. Its docs position it as a platform for building and deploying agents that browse like humans, with headless browser fleets, search/fetch, identity, model access, functions, observability, and Stagehand primitives such as `act`, `extract`, and `observe`.

Automium should not try to sound more general than Browserbase. Browserbase is a broad browser-agent platform. The positioning should be:

- Browserbase helps teams build agents that browse the web.
- Automium helps QA and AI platform teams evaluate and operate agent-driven browser QA on authorized product journeys.
- Browserbase can be future infrastructure underneath Automium-style execution; Automium's differentiation is the QA contract layer: corpus, fixtures, verdicts, replay, policy, and planner reports.

### Model-Native Computer Use

Model-native computer-use tools let models control screens through screenshots, mouse, and keyboard actions. Claude's computer-use documentation frames it as a beta capability for interacting with desktop environments and explicitly calls out security controls such as isolated environments, sensitive-data limits, and domain allowlists.

Automium should treat model-native computer use as a planner or execution option, not as the product category. The positioning should be:

- Computer-use tools provide general screen-control capability.
- Automium supplies the QA-specific operating model around that capability: authorized scopes, deterministic fixtures, action schemas, bounded recovery, artifact policy, and comparable metrics.
- The buyer is not asking "can a model click around?" They are asking "can we trust, debug, govern, and compare agentic QA runs?"

### Low-Code QA Platforms

Low-code QA platforms sell faster test creation, visual authoring, self-healing, and managed operations. They can be attractive to QA organizations that want less code ownership and more vendor-managed workflows.

Automium should not position as a no-code QA suite. The strongest lane is developer-platform trust:

- Versioned contracts and route manifests.
- Fixture and reset determinism.
- API-first journey and run surfaces.
- Policy, quota, tenant, artifact, and replay models.
- Planner adapter and benchmark transparency.

## Unique Workflow Advantages

Automium's positioning should center on workflows that existing tools do not combine cleanly.

### Natural-Language Journey To Governed Run

Automium turns a product-level goal into a validated journey graph and run submission instead of only generating test code. That distinction matters because the governance surface starts before execution:

- app and fixture validation
- owned-domain authorization
- planner intent vocabulary enforcement
- recovery rule validation
- artifact and replay references
- planner backend metadata

### Planner/Executor Separation

Automium's cleanest technical claim is the separation between model planning and deterministic execution:

- Planners emit normalized intents.
- Automium compiles supported intents into deterministic actions.
- Unsupported capabilities fail fast.
- Policy checks stay outside model discretion.
- Replay can compare what the planner intended with what the executor did.

This is stronger than "AI writes tests" because it gives teams a reviewable boundary for agent behavior.

### Owned Benchmark Products

The owned corpus is a major positioning asset. `Altitude`, `Switchboard`, `Foundry`, and the iframe fixture let Automium demonstrate realistic SaaS workflows without third-party product drift or scraping-style ambiguity.

The pitch:

- `Altitude` proves planning, uploads, work-item state, wiki, analytics, and collaboration patterns.
- `Switchboard` proves support conversations, session churn, realtime updates, routing, notes, automation, and reporting.
- `Foundry` proves app-builder workflows, datasource/query setup, widgets, custom components, publish/runtime behavior, and permissions.
- `iframe-fixture` proves controlled cross-frame interaction.

### Causal Replay

Most test tools can show logs, screenshots, videos, traces, or generated summaries. Automium's intended advantage is replay that binds those artifacts to agent-specific causality:

- planner intent
- executor action
- semantic snapshot
- assertion trace
- recovery attempt
- worker event
- artifact manifest
- policy decision

The message is not "more debugging data." It is "the failure is explainable as a chain of decisions and state transitions."

### Cross-Planner Benchmarking

Automium can be valuable even before it is a full production QA service because AI platform teams need comparable planner evaluation:

- same owned corpus
- same fixture reset rules
- same intent vocabulary
- same verdict semantics
- repeatability, pass rate, latency, token spend, and recovery success

This gives Automium a second buyer path beyond QA automation: model selection and agent strategy evaluation.

## Ecosystem Fit

Automium should be framed as a layer in the developer toolchain, not a closed island.

| Ecosystem Surface | Fit |
| --- | --- |
| Playwright and Cypress suites | Start by augmenting selected flaky or high-value workflows. Future migration guides should show side-by-side journeys rather than wholesale rewrites. |
| Browser infrastructure | Production Automium could run on its own engine/runtime, hosted browser providers, or hybrid worker fleets as long as semantic snapshots, replay events, and policy decisions remain normalized. |
| Planner providers | GPT, Claude, Gemini, local planners, and custom agents should enter through adapters with stable metadata, token/cost reporting, and intent schema versions. |
| CI and release workflows | Automium should emit verdicts, artifacts, replay URLs, and benchmark reports that release systems can consume without requiring teams to inspect raw browser sessions. |
| Security and compliance | Domain allowlists, tenant policy, RBAC, audit events, retention, and credential vault integration should be first-class rollout artifacts. |
| Benchmark and AI evaluation | Corpus versioning, fixture reset health, and repeated planner runs make Automium useful to AI platform teams independently of a full QA migration. |

## Trust Claims

Automium should make claims in two tiers.

### Claims Supported By Current Repo

- Contract-level journey compilation, run submission modeling, policy checks, replay/artifact metadata, worker/orchestration modeling, and benchmark comparison logic exist.
- Owned benchmark fixtures exist for `Altitude`, `Switchboard`, `Foundry`, and `iframe-fixture`.
- Planner intent vocabulary and replay/semantic/artifact contracts are versioned.
- Full local test coverage currently validates the contract and domain surfaces.
- The product intentionally restricts scope to owned or consented web properties.

### Claims To Defer Until Production Hardening

- Live browser execution reliability.
- Broad real-world web compatibility.
- Production-scale worker pools.
- Provider-backed planner quality across GPT, Claude, Gemini, and local planners.
- Credential vault integration.
- Durable run, replay, artifact, tenant, and audit persistence.
- Replay console access control, redaction, and retention enforcement.
- Production security review for customer data.

The positioning must keep this boundary visible. Overclaiming production browser maturity would weaken trust with exactly the developers Automium needs to convince.

## Switching Cost

Automium should reduce switching anxiety by selling adoption as augmentation.

| Existing Investment | Likely Concern | Positioning Response |
| --- | --- | --- |
| Playwright or Cypress tests | "Do we need to rewrite everything?" | No. Start with two to five high-value journeys that are flaky, hard to debug, or expensive to maintain. Keep broad regression suites where they work. |
| Selenium/Grid infrastructure | "Will this replace our browser grid?" | Not initially. Automium can complement grid-style automation by adding agent planning, fixtures, replay causality, and planner metrics. |
| Browserbase or hosted browser stack | "We already have browser sessions." | Automium can be the QA and benchmark layer above browser infrastructure if the runtime emits normalized snapshots, events, and artifacts. |
| Manual QA scripts | "Can non-engineers use it?" | Automium can compile natural-language journeys, but current packaging is developer-platform oriented. Low-code authoring should come after the API and examples are clear. |
| Internal model evals | "Why use a QA product for model evaluation?" | Automium provides realistic owned SaaS workflows plus repeatability, fixture reset, replay, and token/cost reporting. |
| Security approval process | "Can browser agents touch customer systems?" | Early use should stay on owned fixtures or explicitly consented domains with allowlists, tenant policy, audit, and retention controls. |

Recommended migration ladder:

1. Local proof on `foundry-baseline-builder`.
2. One failing and one passing replay sample.
3. Planner comparison on deterministic fixture planners.
4. One internal authorized app and two high-value workflows.
5. Security review for domains, credentials, artifacts, and retention.
6. Provider-backed planner pilot.
7. Shared service rollout only after persistence, queues, workers, vault, redaction, and access controls exist.

## Concise Positioning

### One-Liner

Automium is an agent-native browser QA platform for turning product goals into governed, replayable, benchmarkable workflow runs on owned or consented web apps.

### Short Pitch

Automium helps QA, DevEx, and AI platform teams test high-value SaaS workflows with agent planners without handing correctness to the model. Planners propose intent; Automium validates scope, compiles deterministic actions, captures semantic replay artifacts, and compares planner backends on controlled owned fixtures.

### Category

Agent-native workflow QA and browser-planner benchmarking.

### Not The Category

Not a general browser automation library, not a low-code QA recorder, not a hosted browser fleet, not a model-vendor computer-use wrapper, and not a full replacement for existing selector-level E2E suites.

### Primary Differentiators

- Planner/executor separation.
- Semantic-first runtime and targeted vision model.
- Causal replay across planner, executor, runtime, assertion, worker, artifact, and policy events.
- Owned SaaS-style benchmark products with deterministic seeds and resets.
- Cross-planner metrics for repeatability, pass rate, latency, token spend, and recovery success.
- Authorized-use, tenant, quota, audit, retention, and policy framing.

### Persona Messaging

| Persona | Message |
| --- | --- |
| QA automation engineer | Keep broad Playwright or Cypress coverage, but move the most brittle workflow checks into goal-driven journeys with causal replay. |
| Frontend engineer | Validate a release-critical product flow and see whether a failure came from planner intent, UI state, assertion logic, or policy. |
| DevEx platform owner | Offer agentic QA as a governed service with APIs, quotas, workers, replay artifacts, and tenant controls. |
| AI platform engineer | Compare planners on realistic browser workflows with repeatability, latency, token spend, and recovery metrics. |
| Security reviewer | Start from owned fixtures and consented domains, with explicit allowlists, audit, retention, and credential-scope requirements. |
| Engineering leader | Add workflow-level confidence and planner evaluation without forcing teams to rewrite every existing E2E test. |

## Positioning Rules

- Lead with workflow QA and planner benchmarking, not generic browser automation.
- Say "augment Playwright and Cypress" before saying "replace."
- Treat Browserbase/Stagehand as a complementary browser-agent platform and infrastructure reference, not an enemy.
- Tie every AI claim to deterministic boundaries: fixtures, intent schema, policy, replay, and metrics.
- Keep authorized-use language close to the top.
- Separate "implemented in repo today" from "production pilot requires hardening."
- Avoid broad "self-healing" claims until recovery behavior is proven in live execution.
- Avoid "human-like browsing" unless immediately scoped to authorized QA workflows and not stealth/evasion.

## Positioning Backlog

1. Add a root `README.md` that uses the one-liner, short pitch, maturity boundary, and first local proof.
2. Create a comparison page: "Automium, Playwright, Cypress, Browserbase, and computer-use tools."
3. Create a migration guide for augmenting Playwright/Cypress with two to five high-value Automium journeys.
4. Create a planner benchmark explainer using `foundry-baseline-builder`, `altitude-upload-member`, and `switchboard-session-agent`.
5. Create replay sample bundles that demonstrate the causal debugging claim.
6. Create a security review packet covering authorized domains, credentials, artifact retention, redaction, RBAC, and audit.
7. Create a production readiness checklist that prevents sales or docs from overclaiming current maturity.

## Open Positioning Questions

- Should Automium's first public comparison lead with Playwright/Cypress augmentation or Browserbase/Stagehand differentiation?
- Which proof will be more persuasive for early adopters: failure-triage replay or planner benchmark reports?
- Should the first production pilot use hosted browser infrastructure, Automium's own runtime, or both behind the same event and artifact contracts?
- What terminology best avoids confusion with low-code QA tools: "agent-native workflow QA," "browser-planner benchmark platform," or "semantic QA runtime"?
- Which security claim is needed first for pilots: domain allowlists, credential vault integration, artifact redaction, or replay access control?
