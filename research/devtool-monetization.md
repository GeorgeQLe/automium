# Automium Devtool Monetization

## Status

Created on 2026-04-14 from the `devtool-monetization` skill.

Primary repo context:

- `research/devtool-user-map.md`
- `research/devtool-integration-map.md`
- `research/devtool-dx-journey.md`
- `research/devtool-adoption.md`
- `research/devtool-positioning.md`
- `specs/agent-native-browser-qa-platform.md`
- `specs/owned-parity-benchmark-products.md`
- `docs/benchmarks/v1-corpus.md`
- `specs/drift-report.md`

External pricing context checked on 2026-04-14:

- [Playwright Apache 2.0 license](https://raw.githubusercontent.com/microsoft/playwright/main/LICENSE)
- [Playwright testing, CLI, and MCP positioning](https://playwright.dev/)
- [Cypress Cloud pricing](https://www.cypress.io/pricing)
- [Browserbase pricing](https://www.browserbase.com/pricing)
- [BrowserStack pricing](https://www.browserstack.com/pricing)
- [Sauce Labs pricing](https://saucelabs.com/pricing)
- [OpenAI API pricing](https://openai.com/api/pricing/)

## Product Context

Automium is a developer-facing browser QA platform for authorized testing of owned or consented web properties. The current repository proves the product through local TypeScript contracts, owned benchmark fixtures, journey compilation, run submission modeling, policy checks, replay and artifact metadata, worker and orchestration models, and planner comparison reports.

The monetization model must separate two maturity stages:

1. Current stage: local contract-level proof, examples, deterministic owned corpus, and planner benchmarking concepts.
2. Future production stage: hosted browser execution, provider-backed planner adapters, persistence, queues, worker pools, object storage, credential vaults, replay access control, redaction, deployed product UIs, and operational dashboards.

The right monetization thesis is not "charge for test cases." Automium should charge for governed agent-native QA execution: planner spend visibility, browser execution, deterministic fixture operations, replay retention, team governance, and enterprise deployment controls.

## Market Pricing Signals

| Reference | Pricing Signal | Automium Implication |
| --- | --- | --- |
| Playwright | The core automation framework is Apache 2.0 and free, with strong local testing, tracing, and agent-facing surfaces. | Automium needs a generous free local layer. Charging before a developer can prove value would lose to the default free framework path. |
| Cypress Cloud | Free starter tier, paid Team and Business plans, included annual test results, additional test result overages, SSO and enterprise features in higher tiers. | Team conversion can be anchored on recorded results, replay, orchestration, analytics, and governance rather than raw local execution. |
| Browserbase | Free, Developer, Startup, and custom Scale plans; charges around browser hours/concurrency, API calls, retention, model gateway pass-through, and enterprise controls. | Automium should expose browser minutes/concurrency and model spend as first-class cost units instead of hiding them inside seats. |
| BrowserStack | Automate pricing scales by product scope and parallel tests, with enterprise inquiry for large teams. | Concurrency is a familiar pricing lever for test infrastructure buyers. |
| Sauce Labs | Live and automated testing packages use parallel test limits, unlimited users/minutes on some plans, and enterprise controls such as SSO, private cloud, analytics, support, and security. | Enterprise packaging should be triggered by security, private networking, high concurrency, support, and governance requirements. |
| OpenAI API | GPT-5.4 family pricing is token-metered, with materially different rates between frontier, mini, and nano models. | Planner costs can dominate browser costs. Automium must make token usage visible and support BYO keys or pass-through model billing. |

## Free And Open-Source Stance

Automium should use an open-core model.

### Free Core

Open-source or source-available under a permissive license once the public release boundary is ready:

- contracts for planner adapters, replay events, artifacts, semantic snapshots, journey definitions, and benchmark reports
- local journey compiler and validation helpers
- deterministic fixture planner
- owned benchmark corpus metadata and sample journeys
- policy evaluator for owned or consented domain checks
- local replay and artifact schemas
- examples for `Altitude`, `Switchboard`, `Foundry`, and `iframe-fixture`
- Playwright/Cypress augmentation examples when built

This layer must remain useful without cloud accounts, model credentials, object storage, queues, or browser sandboxes. The free core is the adoption engine and the trust proof.

### Paid Core

Keep the following in paid cloud or commercial self-hosted packages:

- hosted browser workers and concurrency management
- run history, queueing, retries, and worker telemetry
- hosted replay viewer with retention, sharing, audit, and redaction
- planner provider adapters with managed credentials and cost reporting
- tenant governance, RBAC, quotas, domain approval workflows, and audit trails
- enterprise SSO, SCIM, private networking, data residency, custom retention, and support SLAs
- managed corpus promotion, reset health checks, and benchmark reports for teams

The dividing line is pragmatic: local proof and extensibility are free; operational trust, scale, sensitive data handling, and shared-team governance are paid.

## Packaging

Recommended package names are descriptive and map to adoption stage.

| Package | Buyer | Proposed Price | Included | Limit Rationale |
| --- | --- | ---: | --- | --- |
| Community | Individual developers, contributors, evaluators | Free | Local compiler/contracts, deterministic planner, owned corpus docs, local examples, local replay schema, community support. | Removes adoption friction and competes with free Playwright/Cypress local workflows. |
| Developer Cloud | One developer or very small team | $29-$49/month | 1 user, hosted quickstart runs, 7-day replay retention, low concurrency, managed examples, optional BYO model key. | Lets serious evaluators avoid infrastructure without creating a support-heavy team account. |
| Team | QA, frontend, or AI platform team | $399-$799/month annually | 10 users, shared projects, 30-day replay retention, 2 concurrent hosted workers, included run credits, planner spend reports, email support. | Converts when a team needs shared replay, repeatability metrics, and managed execution. |
| Business | Multiple product teams or DevEx platform | $1,500-$3,000/month annually | 25 users, 90-day replay retention, 5-10 concurrent workers, quota policy, audit logs, SSO, data export, priority support. | Matches the point where governance and reporting matter more than individual productivity. |
| Enterprise | Regulated or high-scale organizations | Custom annual contract | Unlimited or contracted users, custom concurrency, private cloud or hybrid workers, data residency, SCIM, custom retention/redaction, premium support, security review, procurement terms. | Triggered by security, scale, legal, and deployment constraints rather than simple usage. |

Early pricing should bias toward proving willingness to pay, not maximizing near-term revenue. For the first design partners, sell annual pilots with clear success criteria instead of public self-serve plans:

- Pilot: $10k-$25k for 8-12 weeks, scoped to one app, 5-10 journeys, replay review, planner comparison, and security checklist.
- Design partner platform package: $50k-$100k annual, discounted for feedback, with limited support commitments and explicit production-hardening caveats.
- Post-hardening enterprise floor: $75k-$150k annual when Automium handles real customer app runs, sensitive artifacts, private networking, and support SLAs.

## Usage Units And Limits

Automium should not price primarily per seat. Seats are a governance and collaboration proxy, but the real variable costs are runs, browser minutes, planner tokens, targeted vision, artifact storage, and support.

### Primary Billable Unit: Run Credit

Define one run credit as:

- one started journey attempt
- up to 3 hosted browser minutes
- standard replay event capture
- standard artifact metadata
- one planner attempt with deterministic/local planner or BYO model key

Additional metering:

- extra browser time: fractional run credits per minute
- managed model calls: pass-through plus markup, or sold as model credits
- targeted vision crops: separate vision credits or included only in higher tiers
- artifact storage beyond included retention: per GB-month or per retained run bundle
- high concurrency: packaged by worker slots or concurrent browser sessions

This keeps buyer language simple while preserving cost control underneath.

### Suggested Included Limits

| Package | Run Credits | Concurrency | Replay Retention | Model Billing | Artifact Policy |
| --- | ---: | ---: | ---: | --- | --- |
| Community | Local only | Local only | Local only | BYO/local only | Local only |
| Developer Cloud | 500/month | 1 hosted worker | 7 days | BYO key or managed pass-through | Standard logs and lightweight artifacts |
| Team | 5,000/month | 2 workers | 30 days | BYO or managed pass-through plus reports | Standard replay bundles |
| Business | 25,000/month | 5-10 workers | 90 days | BYO or managed pooled billing | Extended artifacts and exports |
| Enterprise | Contracted | Contracted | Custom | Custom, BYO, or committed model pool | Custom redaction, retention, and storage |

Overages should be allowed but visible:

- $20-$50 per 1,000 extra run credits when the customer uses BYO model keys.
- Managed model usage at provider cost plus 20%-30%, reported per planner backend.
- Higher concurrency sold as worker packs instead of surprising per-minute bills.

The product should show estimated cost before a large benchmark run starts: run credits, browser minutes, planner backend, expected token range, targeted vision policy, and retention setting.

## Team Conversion

Automium's free-to-paid conversion should follow the adoption loops already documented.

| Conversion Moment | User Behavior | Paid Feature That Converts |
| --- | --- | --- |
| Local proof becomes shared evaluation | A developer wants teammates to inspect the same run and replay. | Hosted run history, shared replay links, comments, and 30-day retention. |
| Debugging trust becomes release workflow | QA and frontend engineers use replay to triage regressions. | Stable artifact bundles, replay retention, export, and role-based access. |
| Planner benchmarking becomes recurring review | AI platform or QA leads compare model backends weekly. | Repeated benchmark scheduling, cost reports, corpus version history, and backend comparison dashboards. |
| One app pilot becomes multi-team service | DevEx wants central governance across product teams. | Tenancy, quotas, SSO, audit logs, worker pools, and admin console. |
| Security blocks broader adoption | Compliance asks who can access artifacts and where data lives. | Redaction, custom retention, domain approvals, private networking, audit exports, DPA, and data residency. |

The best self-serve conversion offer is "host the evidence." A user should be able to run locally, then upload or reproduce a run in Automium Cloud to get durable replay, shareable triage, benchmark reports, and team controls.

## Enterprise Triggers

Move customers to Enterprise when any of these appear:

- more than 25 users or multiple departments
- more than 10 concurrent hosted workers
- more than 100k run credits per month
- private networking, VPC peering, self-hosted workers, or hybrid deployment
- SSO, SCIM, custom roles, or centralized audit export
- custom artifact retention, redaction, legal hold, or data residency
- regulated data requiring BAA, DPA, vendor security review, or customer-managed keys
- dedicated Slack/Teams support, premium SLA, or implementation services
- custom planner adapters or model procurement through the vendor
- production release gates with formal uptime/support commitments

The enterprise motion should sell risk reduction and operating control, not just higher limits.

## Unit Economics

Automium's hosted gross margin depends on four usage classes.

### Cost Drivers

| Driver | Cost Shape | Margin Risk | Control |
| --- | --- | --- | --- |
| Browser execution | Browser minutes, concurrency, sandbox isolation, proxy/network needs. | Moderate if long-running journeys or private workers are included without limits. | Run credits, browser-minute caps, worker packs, queue priority, max session duration. |
| Planner calls | Input/output tokens, model choice, retries, targeted vision prompts. | High if frontier models are included in flat plans. | BYO keys, managed pass-through, per-backend budgets, cached prompts, smaller default models. |
| Artifacts and replay | Screenshots, logs, downloads, event streams, retained bundles, egress. | Moderate with long retention or video-heavy capture. | Retention tiers, redaction policy, artifact sampling, per-GB storage overage. |
| Support and implementation | Security reviews, pilot setup, journey authoring help, debugging sessions. | High for early enterprise pilots. | Paid onboarding, scoped pilot success criteria, premium support only in Business/Enterprise. |

### Planner Cost Example

Using OpenAI pricing checked on 2026-04-14:

- GPT-5.4 mini: $0.75 per 1M input tokens and $4.50 per 1M output tokens.
- GPT-5.4: $2.50 per 1M input tokens and $15.00 per 1M output tokens.

Example planner call with 30k input tokens and 3k output tokens:

| Model | Input Cost | Output Cost | Total |
| --- | ---: | ---: | ---: |
| GPT-5.4 mini | $0.0225 | $0.0135 | $0.036 |
| GPT-5.4 | $0.075 | $0.045 | $0.120 |

A journey with 3-5 planner calls can therefore cost roughly $0.11-$0.18 on mini or $0.36-$0.60 on frontier before retries, targeted vision, or markup. Browser minutes may be cheaper than tokens for many short journeys, especially if infrastructure resembles browser-hour pricing from dedicated browser platforms. The pricing model should therefore avoid bundling unlimited managed frontier model usage into flat plans.

### Target Gross Margin Rules

- Community: no hosted cost; support stays community-only.
- Developer Cloud: aim for break-even or light margin; cap concurrency and retention tightly.
- Team: target 70%+ gross margin when BYO model keys are used; 50%-65% when managed model billing is included.
- Business: target 75%+ gross margin through annual commitments, included credits, worker packs, and support boundaries.
- Enterprise: target 75%-85% gross margin after implementation services are separated from subscription ARR.

Implementation services should be sold separately or explicitly scoped. Do not hide a large custom journey-authoring project inside a platform subscription.

## Pricing Rules

1. Keep local proof free until the product has enough trust to earn cloud usage.
2. Price the hosted product on run credits plus concurrency, not seats alone.
3. Treat model spend as visible pass-through or BYO, not a mystery bundle.
4. Make replay retention and artifact governance paid because that is where team value and operating cost meet.
5. Keep production security controls in Business and Enterprise; do not give away SSO, audit export, custom retention, private networking, or compliance review.
6. Let customers start with one high-value workflow pilot rather than forcing full-suite migration.
7. Preserve the positioning boundary: Automium augments Playwright/Cypress for agent-native workflow QA and planner benchmarking; it should not be priced as a universal E2E replacement at launch.

## Recommended First Monetization Sequence

1. Keep the repository and local examples free while adding a root quickstart and first-journey examples.
2. Recruit design partners around paid pilots for one authorized app and 5-10 high-value journeys.
3. Add cost reporting to planner benchmark outputs before charging for managed models.
4. Ship hosted replay and shared run history as the first self-serve paid feature.
5. Add Team plan packaging once hosted workers, artifact storage, and replay retention are production-ready.
6. Add Business packaging when SSO, audit, quotas, and export are reliable.
7. Sell Enterprise only when private networking, custom retention/redaction, procurement, and support commitments are supportable.

## Open Monetization Questions

- Should Automium's public open-source license be Apache 2.0, MIT, or a source-available license until the hosted business is established?
- Should the default paid unit be "run credit", "journey result", or "browser minute plus model pass-through"?
- Should managed planner calls be required for benchmark comparability, or should BYO model keys be first-class from day one?
- Which initial buyer has the strongest budget: QA automation, DevEx platform, or AI platform/model evaluation?
- How much implementation help is needed for the first design partners, and should that be sold as paid services?
- What artifact retention and redaction guarantees are required before regulated customers will approve pilots?
- Should self-hosted workers be a Business feature, an Enterprise-only feature, or a separate infrastructure package?
