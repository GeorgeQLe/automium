# Agent-Native Browser QA Platform

## Status

Drafted from plan interview on April 7, 2026.

## Summary

Build a new browser engine and runtime from scratch for LLM agents, not humans. The product is a cloud-scale QA platform that executes realistic website journeys using a hybrid semantic-state and targeted-vision interface, with a pluggable planner layer for GPT, Claude, and Gemini.

The system is optimized for:

- repeatability across large numbers of runs
- low token spend relative to screenshot-first approaches
- fast execution and recovery
- strong debugging, replay, and causal inspection

The first benchmark is automated website QA on authorized properties at very large scale, with human-like interaction patterns but without stealth/evasion as a product goal.

## Product Thesis

Human browsers optimize for pixels, tabs, and manual interaction. Agent browsers should optimize for:

- structured world state over raw pixels
- action determinism over pointer freedom
- causal observability over opaque automation
- bounded context windows over unconstrained logs
- isolated large-scale execution over local desktop assumptions

The browser should therefore be treated as an agent execution substrate with:

- a native semantic state graph
- targeted visual perception only when semantics are insufficient
- deterministic action compilation
- replayable event streams
- benchmarkable cross-model execution

## Evidence and Rationale

The product direction is informed by current frontier patterns:

- OpenAI moved agent capabilities into the primary ChatGPT user flow and then into Atlas, emphasizing built-in memory, page visibility controls, and agent mode inside a browser context rather than separate robotic tooling.
- Anthropic’s computer-use pattern centers on a model loop around a controlled computer environment rather than a consumer browser UI.
- Google’s Gemini in Chrome direction emphasizes an in-browser assistant and policy controls rather than a separate automation platform.

These patterns suggest the main leverage is not a human browser shell. The leverage is the execution model, structured state surface, safety controls, and orchestration. This spec accepts a new engine/runtime as a strategic bet but keeps semantic observability and agent efficiency as the actual differentiator.

Reference links:

- https://openai.com/index/introducing-chatgpt-atlas/
- https://openai.com/index/equip-responses-api-computer-environment/
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
- https://cloud.google.com/blog/products/chrome-enterprise/supercharging-employee-productivity-with-ai-securely-with-gemini-in-chrome-enterprise
- https://playwright.dev/agents/playwright-mcp-browser-automation

## Goals

### Primary Goal

Provide the highest-performance agent-operable browser runtime for QA workflows while minimizing token spend.

### Success Criteria

Primary KPI:

- repeatability across 10,000 runs of the same journey

Secondary KPIs:

- cost per completed QA journey
- median time to complete a journey
- assertion pass rate under seeded nondeterminism
- recovery success rate after transient failures

### User Outcomes

- define QA journeys in natural language
- run those journeys across large fleets in isolated environments
- inspect failures with causal replay rather than raw video alone
- compare planner quality across GPT, Claude, and Gemini using identical workloads

## Non-Goals

- general-purpose consumer browsing
- anti-bot evasion or abuse of third-party sites
- perfect compatibility with the entire modern web in v1
- replacing Playwright/Cypress for all engineering use cases in v1
- full human-first browser UX parity

## Target Users

### Primary User

Developers and QA/platform teams testing their own or consented web properties.

### Initial Site Profile

Authenticated React/Vue SaaS applications with:

- login and session handling
- dashboards
- CRUD flows
- forms and validations
- file uploads
- SPA navigation
- common iframe usage

## v1 Scope

### Compatibility Target

QA-optimized web subset, specifically:

- standards-compliant HTML and forms
- modern JS application execution
- CSS layout sufficient for enterprise/SaaS apps
- cookies, local storage, session storage
- file upload/download metadata handling
- iframe support
- fetch/XHR/WebSocket visibility

### Explicitly Deferred

- full browser extension ecosystem
- advanced graphics-heavy consumer apps
- full canvas-native semantic introspection
- media-heavy gaming or streaming sites
- native mobile browser emulation beyond responsive web

## Core Principles

1. Semantic state is a first-class runtime artifact.
2. Vision is selective, local, and justified.
3. Planner and executor are separate.
4. Runs must be replayable and causally inspectable.
5. Isolation is the default unit of correctness.
6. Token budgets are enforced at the runtime layer, not left to prompt luck.
7. The system must benchmark models, not couple itself to one model vendor.

## Product Surface

v1 includes:

- new browser engine and runtime
- cloud orchestration platform
- journey authoring API
- natural-language scenario compiler
- model-planner abstraction for GPT, Claude, Gemini
- replay/debug console
- job control plane and worker fleet

### Current Repository Implementation Status

As of April 13, 2026, the repository implements the v1 platform as TypeScript contract, domain, route-manifest, fixture, and benchmark-runner surfaces. The current code is sufficient for contract-level benchmark validation against owned fixtures, but it is not yet a deployed production browser service.

Implemented surfaces:

- `packages/engine/` models browser session, document, frame, storage, network, stable interactive element identity, and actionability scoring.
- `packages/runtime/` builds compact semantic snapshots and applies token/crop-budget compaction.
- `packages/contracts/` freezes the semantic snapshot, replay event, and planner adapter contracts.
- `packages/executor/` compiles supported planner intents into deterministic executor actions and rejects unsupported capabilities.
- `apps/control-plane/` exposes the v1 route manifest for journey compilation, run submission, run status, artifacts, and replay.
- `packages/journey-compiler/` validates natural-language journey inputs and compiles them into graph nodes, assertions, recovery rules, and fixture references.
- `packages/orchestrator/`, `packages/worker/`, and `packages/policies/` model worker leasing, queue policy, telemetry, tenancy quota checks, owned-domain authorization, and fixture-scoped run policy.
- `packages/artifacts/`, `packages/event-stream/`, and `apps/replay-console/` model artifact manifests, retention, replay event streams, replay timelines, and run summaries.
- `packages/benchmark/` and `packages/benchmark-runner/` define the owned benchmark corpus and compare planner backends by repeatability, pass rate, latency, token spend, and recovery success.

Production hardening still tracked outside this spec includes executable HTML/CSS/JS parsing, real browser sandboxing, deployed worker pools, provider-backed planner calls, credential vault integration, and production persistence.

## System Architecture

## High-Level Components

### 1. Browser Engine

A new browser engine optimized for agent observability.

Responsibilities:

- parse and execute HTML/CSS/JS for the v1 compatibility target
- maintain a native semantic state graph alongside DOM/layout/runtime state
- expose element identity, role, interactability, visibility, and state transitions
- emit deterministic action targets and mutation events

### 2. Semantic Runtime Layer

Agent-facing abstraction over the engine.

Responsibilities:

- generate compact semantic snapshots
- assign stable element IDs
- compute action affordances
- track page/task invariants
- trigger targeted vision capture when semantics are insufficient

### 3. Vision Service

Fallback visual understanding for ambiguous or non-semantic regions.

Responsibilities:

- capture targeted crops, not full screenshots by default
- annotate crops with semantic coordinates and timestamps
- support OCR, visual disambiguation, and layout verification
- return bounded visual summaries

### 4. Planner Layer

Model-agnostic planning interface for GPT, Claude, and Gemini.

Responsibilities:

- translate journey state into model prompts/tool calls
- generate high-level intent steps
- consume compacted context and pinned invariants
- support benchmarking across providers

### 5. Deterministic Executor

Runtime that converts planner intents into engine actions.

Responsibilities:

- compile semantic intents into exact engine operations
- perform retries and recoveries under policy
- enforce allowed action schemas
- emit structured step outcomes

### 6. Orchestrator / Control Plane

Cloud service managing jobs and workers.

Responsibilities:

- schedule journeys onto isolated workers
- manage queues, concurrency, priorities, tenancy, and quotas
- collect telemetry and artifacts
- expose APIs for job submission, status, artifacts, and replay

### 7. Replay and Debug Console

Primary debugging UI for operators.

Responsibilities:

- replay runs step-by-step
- show planner command, executor action, semantic state, visual crops, network trace, and mutations
- explain failure causality
- support comparison across successful and failed runs

## Engine Design

The engine is intentionally new, but v1 should still bound scope.

### Required Subsystems

- HTML parser
- DOM representation
- JS execution environment
- CSS parser and limited layout engine
- network stack
- storage/session layer
- event/input system
- frame/iframe model
- semantic graph generator

### Agent-First Engine Features

- semantic state graph built natively, not derived later from an accessibility tree
- stable identity for interactive nodes across rerenders
- actionability scoring as a runtime primitive
- direct subscription to state transitions relevant to QA assertions
- deterministic execution modes for reproducible runs

### Strategic Constraint

This is a large systems bet. The engine should target narrow compatibility depth before broad compatibility width. “Works reliably on target SaaS apps” is more important than “loads arbitrary websites poorly.”

## Agent Interface Contract

The default model interface is hybrid semantic state plus targeted vision.

### Semantic Snapshot Contents

Each planner step receives a bounded semantic payload containing:

- page URL and route identity
- frame hierarchy
- task and checkpoint context
- stable interactive element list
- roles, labels, values, required/disabled/loading/error states
- visibility and interactability metadata
- nearby structural grouping
- recent mutations
- relevant network events
- pinned invariants and assertions

### Targeted Vision Trigger Conditions

Vision capture is allowed when:

- semantics are missing or ambiguous
- canvas/image text must be interpreted
- visual regressions or overlap issues matter
- multiple semantic candidates are otherwise equivalent

### Default Action Schema

Supported planner intents:

- navigate
- click
- type/fill
- select
- upload
- press-key
- wait-for-condition
- assert
- extract
- branch
- recover
- finish

The planner should not emit raw pointer paths as a default primitive.

## Authoring Model

### Primary Authoring Interface

Natural-language spec compiled into a journey graph.

Example authoring shape:

1. describe actor, entrypoint, fixtures, and environment
2. describe goals and checkpoints
3. define expected assertions
4. allow optional setup/teardown and policy hints

### Journey Graph

Each journey is compiled into:

- nodes for goals/checkpoints/assertions
- edges for expected transitions
- recovery branches for transient failures
- terminal states for pass/fail/inconclusive

### Why Journey Graphs

They handle:

- branching UI states
- flaky async timing
- recoverable authentication/session issues
- benchmarkable replay across models

### Benchmark Corpus Current Scope

The v1 checked-in corpus targets only owned or controlled surfaces:

- `Altitude`, `Switchboard`, and `Foundry` as the owned benchmark products.
- `iframe-fixture` as a controlled support fixture for cross-frame and session edge-case coverage.
- Environment profiles for owned baseline data, uploads, session churn, and iframe execution.

## Execution Model

### Isolation Unit

One isolated browser VM/container per journey.

Reasons:

- determinism
- fault isolation
- security boundary
- easier replay and artifact ownership

### Scale Model

Hybrid worker strategy:

- ephemeral workers by default
- warm pools for common workloads and repeated sites

### Oversight Model

Fully unattended execution with post-run review.

Live takeover is supported in replay/debug mode later, but not as the primary v1 flow.

## Context Compaction and Token Budgeting

### Strategy

Hierarchical summaries with pinned invariants and recent raw steps.

### Context Layers

- pinned run metadata: journey goal, tenant, fixtures, policies
- pinned invariants: must-hold assumptions and active assertions
- current semantic page state
- recent raw step window
- summarized prior chapters of the run

### Budget Controls

- per-step token cap
- semantic snapshot truncation rules
- visual crop cap
- optional model escalation only on ambiguity
- context compaction thresholds based on run length and mutation volume

## Debugging and Replay

Replay is a causal debugger, not just a session video.

### Persisted Artifacts

- full semantic event log
- targeted screenshots/crops
- network trace
- final video
- planner decisions
- executor actions
- run-level summary and verdict

### Debug Console Features

- timeline scrubber
- step-by-step command inspection
- view of semantic state before and after each step
- visual crop overlay with target selection
- mutation log explaining what changed
- assertion and recovery trace
- comparison of multiple runs on the same journey

### Debug Questions It Must Answer

- what did the planner think was true
- what did the executor actually do
- what changed in the page/runtime
- why did the journey fail, retry, or recover

## APIs

## Public APIs

### Journey Authoring API

Create, update, validate, and compile natural-language journey specs.

### Job Submission API

Start runs with:

- journey ID
- fixtures
- environment
- planner backend
- concurrency
- policy profile

### Job Status API

Retrieve:

- queue state
- worker assignment
- run status
- partial checkpoints
- final verdict

### Artifact API

Access:

- replay bundles
- logs
- screenshots/crops
- traces
- summaries

### Benchmark API

Run the same journey across multiple planner backends and compare:

- pass rate
- repeatability
- latency
- token spend
- recovery rate

## Internal APIs

- engine runtime API
- semantic snapshot API
- vision capture API
- planner adapter API
- executor action API
- replay/event-stream API

## Data Model

### Core Entities

#### Journey

- id
- name
- natural-language source
- compiled graph
- assertions
- fixture schema
- policy profile

#### Run

- id
- journey_id
- environment
- planner_backend
- status
- final_verdict
- metrics
- artifact manifest

#### Step

- id
- run_id
- planner_input_summary
- planner_output_intent
- executor_action
- pre_state_snapshot
- post_state_snapshot
- visual_artifacts
- timing
- token_cost
- result

#### Assertion

- id
- journey_id
- type
- condition
- scope
- severity

#### Recovery Rule

- id
- trigger
- strategy
- retry_limit

## UX Flows

### 1. Author Journey

Operator writes a natural-language QA scenario, reviews the compiled graph, adds assertions/fixtures if needed, and saves.

### 2. Execute at Scale

Operator selects environment, planner backend, and concurrency, then launches runs across the worker fleet.

### 3. Inspect Failure

Operator opens replay/debug console, scrubs to the failure, inspects planner thought/action/state/mutations, and identifies root cause.

### 4. Benchmark Models

Operator runs the same journey on GPT, Claude, and Gemini under the same fixtures and compares repeatability, latency, and spend.

## Security and Abuse Constraints

The system is for authorized QA and testing on owned or consented properties.

### Hard Constraints

- no anti-bot bypass as a product feature
- no credential theft, stealth, or policy circumvention features
- tenant and environment isolation by default
- secrets scoped per run or per environment
- audited access to replay artifacts and traces

### Required Controls

- tenant policy profiles
- domain allowlists
- credential vault integration
- artifact retention controls
- audit logs

## Reliability and Recovery

### Failure Types

- transient network failure
- delayed SPA state change
- auth/session expiration
- stale element identity after rerender
- ambiguous target
- unsupported web feature
- planner hallucination or invalid action

### Recovery Policies

- semantic re-resolve of target
- bounded retry with jitter
- route refresh or wait-for-condition
- fallback targeted vision
- alternate graph edge
- fail-fast if unsupported invariant is violated

## Performance Strategy

### Speed

- semantic snapshots instead of full screenshots by default
- bounded context payloads
- deterministic executor
- warm worker pools for repeated workloads

### Accuracy

- stable element IDs
- actionability scoring
- assertion-aware execution
- targeted visual fallback

### Consistency

- isolated workers
- deterministic runtime modes
- explicit recovery policies
- replayable event stream

### Cost

- hierarchical context compaction
- selective vision use
- planner abstraction for cost/performance routing
- artifact tiering and retention policy

## Phased Build Plan

### Phase 0: Architecture and Benchmarks

- define journey corpus
- define KPI harness
- implement planner abstraction and benchmark framework
- select initial target sites/apps

Exit criteria:

- repeatable benchmark suite defined
- semantic snapshot contract frozen for v1

### Phase 1: Minimal Engine for Target SaaS Apps

- HTML/DOM/JS/CSS/layout primitives for target apps
- network/session/storage support
- interactive node identity and semantic graph generation
- basic navigation, forms, auth flows

Exit criteria:

- can load and operate target SaaS apps reliably

### Phase 2: Deterministic Executor and Journey Runtime

- action compiler
- recovery policies
- journey graph executor
- assertion engine

Exit criteria:

- end-to-end unattended journeys run with meaningful pass/fail verdicts

### Phase 3: Vision Fallback and Context Compaction

- targeted crops
- OCR/visual disambiguation
- hierarchical summaries and token budgeting

Exit criteria:

- token spend materially below screenshot-first baselines

### Phase 4: Control Plane and Worker Fleet

- job queueing
- worker orchestration
- concurrency and tenancy controls
- benchmark execution across model backends

Exit criteria:

- large parallel runs supported with acceptable isolation and cost

### Phase 5: Replay and Causal Debugger

- event log viewer
- step debugger
- mutation diffing
- multi-run comparison

Exit criteria:

- failures are diagnosable without re-running locally

## Open Questions and Follow-Up

These are tracked for the next production-hardening planning pass:

- exact JS engine strategy: embed an existing engine versus implement a new one
- exact CSS/layout coverage target for v1
- browser security sandbox architecture at the engine level
- fixture/environment specification format beyond the current checked-in corpus manifest
- benchmark corpus publication policy beyond the current owned-only corpus
- enterprise deployment timeline for single-tenant/private environments

## Acceptance Criteria for the Spec

This spec is ready to guide initial architecture and phased implementation if:

- the team accepts the new-engine strategic bet
- the v1 compatibility target remains narrowly QA-focused
- authorized-use constraints are enforced
- semantic-first execution remains the core optimization target

## Coverage Checkpoint

Covered areas:

- goals and success metrics
- target users and scope boundaries
- architecture and component responsibilities
- engine/runtime assumptions
- model interface design
- data model and APIs
- UX and replay/debug flows
- security, reliability, and performance strategy
- phased implementation plan

Areas to revisit next:

- engine subsystem implementation choices
- benchmark corpus design
- enterprise packaging and pricing
