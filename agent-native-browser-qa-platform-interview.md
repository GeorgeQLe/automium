# Agent-Native Browser QA Platform Interview Log

## Date

April 7, 2026

## Initial Draft

Create a web browser from scratch that is agent first and designed for LLM agents, with the best user interfaces inspired by GPT, Claude, and Gemini.

## Interview Progression

### Round 1

Question:

Who is the first customer, what should v1 be, and how autonomous should it be?

Options presented:

- developers/agent builders vs ops teams vs consumers
- cloud browser runtime/API/review UI vs desktop Chromium browser vs browser extension/sidebar
- supervised by default vs policy-based autonomy vs fully autonomous

Recommendation given:

- developers/agent builders first
- cloud browser runtime + API + review UI
- supervised by default

User response:

Rejected the product framing as too incremental and restated the goal: build from first principles for the most optimized agent interface with the highest performance and lowest token spend.

Significance:

The direction shifted from a pragmatic browser-runtime wedge to a more ambitious foundational systems play.

### Round 2

Question:

What does “from scratch” mean, what should the model’s primary state representation be, and what is the first hard benchmark?

Options presented:

- agent runtime from scratch on Chromium vs Chromium fork vs new browser engine/runtime
- hybrid semantic state + targeted vision vs semantic only vs vision first
- authenticated SaaS task completion vs open-web research vs cross-site transactional workflows

Recommendation given:

- runtime from scratch on Chromium
- hybrid semantic state + targeted vision
- authenticated SaaS task completion

User response:

Chose:

- new browser engine and runtime
- hybrid semantic state + targeted vision
- automated website QA matching human-like activity at incredible scale

Significance:

This made the new engine an explicit strategic bet and changed the first benchmark from general agent productivity to cloud-scale QA.

### Round 3

Question:

What compatibility target should v1 have, what should make the engine architecturally new, and what is the primary scale model?

Options presented:

- QA-optimized web subset vs near-full modern web vs deterministic enterprise subset
- new DOM/layout/execution pipeline built for agent observability vs new agent runtime around existing renderer vs distributed browser kernel
- massive parallel ephemeral sessions vs persistent warm workers vs hybrid

Recommendation given:

- QA-optimized web subset
- new DOM/layout/execution pipeline built for agent observability
- hybrid scale model

User response:

Agreed with all recommendations.

### Round 4

Question:

Which sites should v1 optimize for, what should the primary KPI be, and how should human oversight work?

Options presented:

- authenticated React/Vue SaaS apps vs marketing/ecommerce vs consumer web
- cost per completed journey vs repeatability across 10,000 runs vs median journey time
- unattended execution with post-run review vs approval before destructive actions vs live copilot mode

Recommendation given:

- authenticated React/Vue SaaS apps
- primary KPI: repeatability across 10,000 runs
- unattended execution with post-run review

User response:

Agreed with all recommendations.

### Round 5

Question:

How should scenarios be authored, what should the runtime isolation unit be, and what should the core execution abstraction be?

Options presented:

- natural-language spec compiled into plans vs code-first DSL vs recorded user flows
- one isolated browser VM/container per journey vs shared workers vs pooled site/session workers
- journey graph vs linear script vs explicit state machine

Recommendation given:

- natural-language spec compiled into executable plans
- one isolated browser VM/container per journey
- journey graph

User response:

Agreed with all recommendations and added a replay-side debug menu idea showing each command and its browser effects.

Significance:

Replay/debug became a first-class product surface rather than an auxiliary log viewer.

### Round 6

Question:

What should the planner/executor split be, what should be persisted from runs, and how should context compaction work?

Options presented:

- high-level planner plus deterministic executor vs single agent loop vs mostly deterministic compiler
- full semantic event log plus targeted screenshots/network trace/video vs video only vs everything at every tick
- hierarchical summaries with pinned invariants and recent raw steps vs raw window only vs aggressive summarization

Recommendation given:

- high-level planner + deterministic executor
- full semantic event log + targeted screenshots + network trace + final video
- hierarchical summaries with pinned invariants and recent raw steps

User response:

Agreed with all recommendations.

### Round 7

Question:

How should model support work, what deployment model should v1 target, and what should the product boundary be?

Options presented:

- planner abstraction with GPT/Claude/Gemini backends vs OpenAI first vs ensemble by default
- cloud control plane + isolated worker fleet vs on-prem first vs local cluster
- engine + runtime + orchestration + replay/debug + authoring API vs narrower boundaries

Recommendation given:

- planner abstraction with GPT, Claude, and Gemini backends
- cloud control plane + isolated worker fleet
- engine + runtime + orchestration + replay/debug + authoring API

User response:

Agreed with all recommendations.

## Final Decisions

- Build a new browser engine and runtime from scratch.
- Optimize for agents, not human browsing.
- Use hybrid semantic state + targeted vision as the core model interface.
- Focus v1 on automated QA for authorized websites at very large scale.
- Target authenticated React/Vue SaaS apps first.
- Optimize primarily for repeatability across 10,000 runs.
- Author scenarios in natural language and compile them to journey graphs.
- Use one isolated browser VM/container per journey.
- Separate high-level planner from deterministic executor.
- Persist semantic event logs, targeted screenshots, network traces, and final video.
- Use hierarchical context compaction with pinned invariants.
- Support GPT, Claude, and Gemini via a pluggable planner abstraction.
- Deploy as a cloud control plane with isolated worker fleet.
- Include replay/debug as a first-class causal debugger.

## Significant Deviations From Initial Draft

1. The original idea centered on an “agent-first browser” inspired by GPT, Claude, and Gemini interfaces.
Reason for change:
The interview sharpened the product into a QA platform rather than a general assistant browser, because that gives a concrete benchmark, clearer KPIs, and stronger fit for cloud-scale agent execution.

2. The original framing implied a human-visible browser UI as the main product.
Reason for change:
The final direction treats replay/debug and authoring as the main operator surfaces, while the browser itself is primarily an execution runtime.

3. The initial idea could have been implemented atop an existing browser.
Reason for change:
The user explicitly chose a new engine and runtime as the strategic differentiator, with semantic observability native to the engine.

4. The original brief referenced “best user interfaces” from frontier assistants.
Reason for change:
The spec reframed “UI” as an agent interface contract and a causal replay debugger, which are more meaningful for performance, token efficiency, and QA operations.

## Coverage Summary

Covered:

- product goal
- target user and benchmark
- scope and non-goals
- architecture
- engine/runtime contract
- planner/executor split
- data and APIs
- replay/debug UX
- deployment model
- safety constraints
- implementation phases

Remaining follow-up topics:

- exact engine implementation choices
- benchmark suite design
- enterprise packaging and pricing
