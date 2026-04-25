# Roadmap: Automium Production Launch

> Generated from: `specs/browser-playwright-integration.md`, `specs/provider-backed-planner-execution.md`, `specs/production-persistence-infrastructure.md`, `specs/ci-cd-integration.md`
> Date: 2026-04-25
> Total Phases: 8

## Summary

This roadmap turns the four validated spec interviews into an executable build plan for Automium's production platform. The sequencing prioritizes infrastructure foundations first (persistence, queue), then execution capabilities (browser runtime, planner adapters), then user-facing surfaces (API, CLI), then integration (artifacts, end-to-end). Each phase is small and serial, following the MCP transport pattern that proved effective.

## Phase Overview

| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1 | Persistence Foundation | production-persistence-infrastructure | Drizzle schema, Neon Postgres, adapter implementations | L |
| 2 | Queue + Worker Infrastructure | production-persistence-infrastructure | BullMQ queues, Redis, worker process skeleton | M |
| 3 | Browser Runtime | browser-playwright-integration | BrowserRuntime interface, Playwright adapter, semantic enrichment | L |
| 4 | Planner Adapters | provider-backed-planner-execution | v2 contract, Claude adapter, fixture adapter, telemetry | M |
| 5 | Control Plane API | production-persistence-infrastructure | Hono server, WorkOS auth, RBAC middleware, API routes | M |
| 6 | Object Storage + Artifacts | production-persistence-infrastructure | R2 adapter, artifact upload pipeline, retention lifecycle | M |
| 7 | CLI + CI Integration | ci-cd-integration | @automium/cli, reporters, GitHub Actions, GitLab CI template | M |
| 8 | End-to-End Integration | all specs | Wire full pipeline, run owned benchmark corpus, verify replay | L |

---

## Phase 1: Persistence Foundation

**Goal**: Establish the database layer that all other phases depend on. After this phase, Automium can persist tenants, journeys, runs, steps, audit events, and credentials in Postgres.

**Scope**:
- Create `packages/persistence/` with Drizzle ORM schema for all core tables (organizations, workspaces, memberships, sessions, invites, journeys, journey_versions, runs, steps, assertions, recovery_rules, artifact_manifests, audit_events, credentials, files, jobs)
- Implement Neon Postgres connection pool and migration runner
- Create `packages/adapters-postgres/` implementing AuditSinkAdapter and SearchBackendAdapter (Postgres FTS)
- Add Row-Level Security policies for tenant isolation
- Implement encrypted credential vault (AES-256-GCM) in the credentials table
- Create `packages/adapters-workos/` implementing IdentityProviderAdapter for magic-link auth
- Composite indexes on (organization_id, workspace_id) for all tenant-scoped tables

**Acceptance Criteria:**
- [ ] Drizzle schema compiles and generates migrations for all core tables
- [ ] Migrations run successfully against a Neon Postgres instance
- [ ] AuditSinkAdapter can emit and query audit events through Postgres
- [ ] SearchBackendAdapter can index and query using Postgres tsvector/tsquery
- [ ] Credential vault can store, retrieve, and rotate encrypted secrets
- [ ] RLS policies prevent cross-tenant data access when session variables are set
- [ ] WorkOS adapter authenticates via magic-link and validates session tokens
- [ ] All adapter implementations pass contract tests matching `packages/adapters/` interfaces

**Parallelization:** serial

**Coordination Notes:** This phase touches the most packages and establishes patterns (Drizzle schema, adapter implementation, connection management) that all later phases follow. Must be serial to avoid conflicting patterns.

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 2: Queue + Worker Infrastructure

**Goal**: Enable job dispatch and worker orchestration so journey runs can be queued and picked up by workers.

**Scope**:
- Create `packages/adapters-bullmq/` implementing JobQueueAdapter backed by BullMQ on Redis
- Define BullMQ queues: journey-runs (priority-ordered), artifact-upload, audit-sink, data-lifecycle
- Create `packages/adapters-redis/` implementing RealtimeTransportAdapter (Redis pub/sub)
- Implement worker process skeleton in `packages/worker/` that dequeues jobs from BullMQ
- Implement HTTP heartbeat endpoint and client for worker health reporting
- Wire worker lease decisions from `packages/orchestrator/` to the BullMQ dispatch flow
- Configure Redis connection management (shared between BullMQ and pub/sub)

**Acceptance Criteria:**
- [ ] JobQueueAdapter can enqueue, dequeue, and acknowledge jobs through BullMQ
- [ ] Priority ordering works correctly (high > normal > low)
- [ ] RealtimeTransportAdapter can publish and subscribe to Redis channels
- [ ] Worker process dequeues a job and reports heartbeats via HTTP
- [ ] Worker lease quota enforcement prevents over-allocation
- [ ] Queue and worker tests pass with a local Redis instance
- [ ] Audit events flow through the audit-sink queue to Postgres asynchronously

**Parallelization:** serial

**Coordination Notes:** Depends on persistence (Phase 1) for run status updates and audit persistence. Redis connection patterns established here are reused by the realtime transport in Phase 5.

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 3: Browser Runtime

**Goal**: Implement the Playwright-backed browser execution layer that runs inside Firecracker microVMs. After this phase, Automium can navigate a web page, produce enriched semantic snapshots, execute planner intents, and capture artifacts.

**Scope**:
- Define `BrowserRuntime` interface (~5-8 methods: navigate, snapshot, executeAction, captureElementScreenshot, getNetworkEvents, getConsoleEvents, getDOMMutations, close)
- Create Playwright adapter implementing BrowserRuntime using Chromium headless shell
- Implement semantic enrichment pipeline: stable ID assignment, actionability scoring, mutation diffing over Playwright's accessibility tree
- Implement CDP observation pipeline: Network, Runtime, DOM, Performance event subscriptions
- Implement targeted vision capture via Playwright element screenshots with bounding box and semantic annotation
- Implement vision trigger heuristics (ambiguity detection, budget enforcement: max 2-3 crops/step, <100KB each)
- Flatten iframe frame hierarchy into unified semantic snapshot
- Build basic Firecracker microVM image with Chromium + Playwright pre-installed
- Wire executor action compilation to BrowserRuntime method calls

**Acceptance Criteria:**
- [ ] BrowserRuntime interface is defined and Playwright adapter passes all interface methods
- [ ] Semantic enrichment produces stable element IDs that persist across page rerenders
- [ ] Actionability scoring correctly identifies interactive vs non-interactive elements
- [ ] CDP pipeline captures network requests, console messages, and DOM mutations in real-time
- [ ] Targeted vision capture produces annotated element screenshots under budget
- [ ] Iframe elements appear in the flattened semantic snapshot with frame metadata
- [ ] Can navigate an owned benchmark product URL and produce a complete enriched snapshot
- [ ] Executor can compile click, type, navigate, and assert intents into Playwright actions
- [ ] Firecracker VM image boots and runs a Playwright script successfully

**Parallelization:** serial

**Coordination Notes:** This is the largest phase. The BrowserRuntime interface is the primary abstraction boundary — all Automium code above this layer must not import Playwright directly. Firecracker image building may require bare-metal access for testing.

**Manual Tasks** (if any):
- Provision a bare-metal KVM-capable server (Hetzner/OVH) for Firecracker VM testing _(blocks: Firecracker VM image acceptance criterion)_

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 4: Planner Adapters

**Goal**: Implement the v2 planner adapter contract and the first production adapter (Claude/Anthropic), enabling real model-backed journey planning.

**Scope**:
- Define PlannerAdapterV2 contract in `packages/contracts/` (buildMessages, toolDefinitions, parseToolCalls, compileIntent, summarizeStep)
- Define provider-agnostic message types (PlannerMessages, ContentBlock, ToolCall, ToolDefinition)
- Create `packages/planner-adapter-anthropic/` implementing PlannerAdapterV2 using @anthropic-ai/sdk
- Create `packages/planner-adapter-fixture/` with deterministic intent sequences for CI
- Implement tool definitions for all 12 planner intents as JSON Schema
- Implement prompt construction: cacheable system prompt + structured user message with snapshot/context/vision
- Implement per-step telemetry reporting (tokens, latency, model version, tool calls, vision usage, retries)
- Implement multi-layer cost controls: per-step token cap, per-run budget, per-tenant quota
- Implement provider-level retry (3x exponential backoff for 429/500/503) with rate limit header respect
- Update adapter registry to resolve v2 adapters by vendor
- Mark v1 string-based contract methods as deprecated

**Acceptance Criteria:**
- [ ] PlannerAdapterV2 contract is defined and exported from packages/contracts/
- [ ] Claude adapter produces valid tool-call prompts from enriched semantic snapshots
- [ ] Claude adapter parses tool-call responses into PlannerIntent objects
- [ ] Fixture adapter returns deterministic intent sequences matching v2 contract
- [ ] Vision crops are included as image content blocks when flagged by the runtime
- [ ] Per-step telemetry accurately reports tokens, latency, and model version from Claude API
- [ ] Per-run budget enforcement aborts a journey when cumulative tokens exceed the limit
- [ ] Provider retry handles 429 rate limits with exponential backoff
- [ ] Adapter registry resolves Claude and fixture adapters by vendor string
- [ ] Benchmark runner works with v2 adapters for planner comparison

**Parallelization:** serial

**Coordination Notes:** Depends on Browser Runtime (Phase 3) for semantic snapshots that feed the planner, and Persistence (Phase 1) for cost control quota enforcement. The Claude adapter requires an Anthropic API key.

**Manual Tasks** (if any):
- Provision an Anthropic API key for development and store in the credential vault _(blocks: Claude adapter acceptance criteria)_

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 5: Control Plane API

**Goal**: Stand up the production Hono API server with authentication, authorization, and all v1 routes wired to real implementations.

**Scope**:
- Create Hono application in `apps/control-plane/` with middleware stack (CORS, auth, RBAC, logging, error handling)
- Implement WorkOS session validation middleware
- Implement RBAC middleware using existing `checkPermission()` from `packages/rbac/`
- Wire all v1 API routes to real Postgres-backed implementations: journeys CRUD, journey compilation, run submission, run status, artifacts, benchmarks, tenants, credentials
- Implement run submission flow: validate journey → resolve credentials → enqueue BullMQ job
- Implement WebSocket gateway for live run status using Redis pub/sub from Phase 2
- Implement OpenAPI schema generation via @hono/zod-openapi
- Configure Postgres RLS session variables from authenticated request context
- Add OpenTelemetry instrumentation for API request tracing
- Add pino structured logging with traceId, organizationId, workspaceId

**Acceptance Criteria:**
- [ ] Hono server starts and serves all v1 routes
- [ ] WorkOS authentication rejects unauthenticated requests with 401
- [ ] RBAC middleware enforces role-based access per the permission matrix
- [ ] Journey CRUD operations persist to and read from Postgres
- [ ] Run submission enqueues a job in BullMQ and returns a run ID
- [ ] Run status endpoint returns real-time status from Postgres
- [ ] WebSocket gateway streams run progress events from Redis pub/sub
- [ ] OpenAPI spec is generated and accessible at /api/v1/openapi.json
- [ ] API requests are traced end-to-end via OpenTelemetry
- [ ] Credential CRUD endpoint encrypts values and never returns plaintext

**Parallelization:** serial

**Coordination Notes:** This phase wires together everything from Phases 1-4. The API server is the integration point where persistence, queue, and domain logic meet HTTP requests. Deploy target: Fly.io.

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 6: Object Storage + Artifacts

**Goal**: Implement the artifact upload and retrieval pipeline using Cloudflare R2, enabling replay data to be stored and served.

**Scope**:
- Create `packages/adapters-r2/` implementing FileStorageAdapter using @aws-sdk/client-s3 with R2 endpoint
- Implement artifact upload flow: worker collects artifacts → enqueues upload job → uploads to R2
- Implement R2 bucket structure: {orgId}/{workspaceId}/runs/{runId}/...
- Implement retention tagging at upload time (retention-class, expires-at)
- Implement R2 lifecycle rules for automatic retention enforcement (14d pass, 30d fail, 7d unsupported)
- Wire artifact retrieval through the control plane API (signed URL or proxy)
- Implement Playwright trace.zip capture and upload as supplementary artifact
- Implement Automium event stream serialization (JSONL) and upload

**Acceptance Criteria:**
- [ ] FileStorageAdapter stores and retrieves files from R2 via S3-compatible API
- [ ] Artifact upload job processes correctly after a journey run completes
- [ ] Artifacts are organized in the correct bucket structure with org/workspace scoping
- [ ] Retention tags are set on upload and R2 lifecycle rules are configured
- [ ] Control plane API serves artifact downloads for authenticated, authorized users
- [ ] Playwright trace.zip is captured and uploaded alongside Automium event stream
- [ ] Automium replay event stream is serialized as JSONL and retrievable per run

**Parallelization:** serial

**Coordination Notes:** Depends on the worker pipeline (Phase 2-3) for artifact generation and the control plane (Phase 5) for serving artifacts. R2 bucket creation and lifecycle rule configuration are one-time setup.

**Manual Tasks** (if any):
- Create Cloudflare R2 bucket and configure API credentials _(blocks: R2 adapter acceptance criteria)_

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 7: CLI + CI Integration

**Goal**: Ship the `@automium/cli` package that CI pipelines use to submit and monitor journey runs.

**Scope**:
- Create `packages/cli/` with `automium` binary entry point
- Implement `automium run` command: config loading, journey filtering, parallel submission, polling, result collection
- Implement `automium validate` command: config check, API reachability, journey validation
- Implement `automium report` command: fetch results and generate reports from past runs
- Implement `automium.config.ts` config file format with defineConfig helper
- Implement three reporters: terminal summary (default), JUnit XML, JSON
- Implement three-level exit codes: 0 (pass), 1 (test failure), 2 (infrastructure error)
- Implement per-journey timeout (--timeout, default 300s) and overall timeout (--total-timeout, default 1800s)
- Implement parallel submission with configurable concurrency (--concurrency, default 10)
- Implement structured failure output: failed step, intent, assertion, snapshot context, dashboard link
- Create GitHub Actions reusable action (@automium/github-action)
- Create GitLab CI YAML template
- Implement AUTOMIUM_API_TOKEN environment variable authentication

**Acceptance Criteria:**
- [ ] `automium run --tag smoke` submits journeys, polls, and exits with correct exit code
- [ ] `automium validate` reports config and connectivity issues with actionable messages
- [ ] JUnit XML output is parseable by GitHub Actions test-reporter and GitLab CI
- [ ] JSON output contains all journey results with run IDs and replay URLs
- [ ] Terminal output streams journey completion with pass/fail indicators
- [ ] Exit code 1 on test failure, exit code 2 on auth/infra error
- [ ] Per-journey timeout surfaces as an explicit failure in all reporters
- [ ] Parallel submission respects concurrency limit and tenant quota
- [ ] GitHub Actions example workflow runs successfully in a test repository
- [ ] CLI has zero Playwright/engine/provider SDK dependencies

**Parallelization:** serial

**Coordination Notes:** Depends on the Control Plane API (Phase 5) being deployed and accessible. The CLI is a pure HTTP client against the control plane.

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 8: End-to-End Integration

**Goal**: Wire the full Automium pipeline together and validate with the owned benchmark corpus. After this phase, a real QA journey can be authored, submitted, executed on a Firecracker worker, planned by Claude, and debugged via replay artifacts.

**Scope**:
- Wire the complete run pipeline: CLI submit → API → BullMQ → Worker → Firecracker VM → Playwright → Claude planner → Executor → Artifacts → R2 → Replay
- Run the owned benchmark corpus (Altitude, Switchboard, Foundry) end-to-end with the fixture planner
- Run at least one journey with the Claude planner against an owned benchmark product
- Verify replay event stream completeness (planner intents, executor actions, snapshots, assertions, network, vision)
- Verify artifact lifecycle (upload, retrieval, retention tagging)
- Verify benchmark comparison between fixture and Claude planners
- Verify multi-tenant isolation (two tenants, separate runs, no data leakage)
- Performance validation against spec targets: <5s cold start, <200ms snapshots, <2s steps, <30s journey
- Fix integration issues discovered during end-to-end testing
- Update the GPT/OpenAI adapter as fast-follow (if time permits)

**Acceptance Criteria:**
- [ ] A journey authored via the API executes end-to-end and produces a pass/fail verdict
- [ ] Owned benchmark corpus (Altitude, Switchboard, Foundry) runs with fixture planner
- [ ] At least one journey completes with Claude planner producing real tool-call intents
- [ ] Replay artifacts are complete: event stream, targeted crops, network log, Playwright trace
- [ ] Artifacts are retrievable via the API and respect tenant authorization
- [ ] Benchmark comparison report shows meaningful metrics across fixture and Claude planners
- [ ] Two tenants can submit runs simultaneously with no cross-tenant data access
- [ ] Cold start meets <5s target, full 10-step journey meets <30s target
- [ ] CLI can submit, monitor, and report on the end-to-end run with correct exit codes

**Parallelization:** serial

**Coordination Notes:** This is the integration phase that validates all previous phases work together. Expect to discover and fix issues at the seams between phases. This phase may take longer than others due to debugging integration problems.

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Deferred / Future Work

- GPT/OpenAI planner adapter (fast-follow after Phase 8 if not completed during integration)
- Gemini/Google planner adapter (v1.1+)
- Firefox and WebKit browser support (v2+)
- Custom browser engine (v2+ strategic option behind BrowserRuntime interface)
- Data lifecycle tiering (hot Postgres → warm R2 → delete)
- WebSocket replay streaming (v1 uses REST polling)
- Postgres full-text search (v1 uses LIKE queries, FTS is ready when needed)
- Watch mode for CLI (`automium run --watch`)
- Local execution mode for CLI (Playwright without Firecracker)
- SSO/SAML via WorkOS (magic-link only for v1)
- Credential rotation automation
- Worker autoscaling
- Remote MCP transports (Streamable HTTP, SSE)
- Advanced audit queries and dashboards
- CTRF report format
- Sharding across CI runners
- Slack/Teams notification integration

## Cross-Phase Concerns

### Integration Tests
- Phase 2: queue → worker integration test (enqueue job, worker dequeues and reports)
- Phase 3: browser → semantic enrichment integration test (navigate page, verify snapshot)
- Phase 5: API → queue → worker integration test (submit run via API, verify dispatch)
- Phase 8: full pipeline integration test (CLI → API → worker → planner → artifacts → replay)

### Non-Functional Requirements
- **Security**: RLS in Phase 1, RBAC in Phase 5, credential encryption in Phase 1, tenant isolation verified in Phase 8
- **Performance**: Targets validated in Phase 8 (<5s cold start, <200ms snapshots, <2s steps)
- **Observability**: OpenTelemetry added in Phase 5, verified across the full pipeline in Phase 8
- **Cost controls**: Per-step/run/tenant budgets implemented in Phase 4, verified in Phase 8
