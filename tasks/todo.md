# Automium Production Launch — Phase 2: Queue + Worker Infrastructure

> Project: Automium Production Launch | Phase: 2 of 8 | Strategy: TDD

## Completed Prior Work

- [x] Phase 1: Persistence Foundation (13 steps) — archived in `tasks/phases/production-phase-1.md`
  - Drizzle schema (17 tables, 12 pgEnums), Neon connection, migration runner, RLS policies
  - AuditSinkAdapter, SearchBackendAdapter, CredentialVault, IdentityProviderAdapter (shape-validated stubs)
  - 274 tests passing, 0 TypeScript errors

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

> Test strategy: tdd

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests

**Subagent lanes:** none

### Existing Codebase Context

**Adapter interfaces** (`packages/adapters/src/adapters-behavior.ts`):
- `JobQueueAdapter`: `boundary: "job-queue"`, `enqueue(job)` → `{ enqueued, jobId }`, `dequeue()` → `{ job | null }`, `acknowledge(jobId)` → `{ acknowledged }`
- `RealtimeTransportAdapter`: `boundary: "realtime-transport"`, `publish(topic, payload, audience)` → `{ published, recipientCount }`, `subscribe(topic, recipientId)` → `{ subscribed }`, `unsubscribe(topic, recipientId)` → `{ unsubscribed }`

**Job lifecycle** (`packages/jobs/src/jobs-behavior.ts`):
- `JOB_LIFECYCLE_STATES`: queued → running → completed/failed; failed → queued (retry)
- `createJob()`, `transitionJobState()`, `validateJob()` — complete state machine

**Worker types** (`packages/worker/src/worker-domain.ts`):
- `WorkerRuntimeConfig`, `WorkerQueuePolicy`, `WorkerLeaseTelemetry` — types only, no logic

**Orchestrator** (`packages/orchestrator/src/orchestrator-domain.ts`):
- `leaseWorker(input)` → `WorkerLeaseDecision` — full capability/quota/placement logic
- `WorkerLeasePriority`: "low" | "normal" | "high"
- `DEFAULT_QUOTA`, `QUEUE_PRIORITY_WEIGHT` — already defined

**Realtime** (`packages/realtime/src/realtime-behavior.ts`):
- `createRealtimeEvent()`, `evaluateDelivery()`, sequence tracking — full pub/sub contracts

**Phase 1 adapter pattern**: factory function → `{ boundary, ...methods }`, `as const` boundary, contract tests, subpath exports in `package.json`.

### Tests First
- [x] Step 2.1: **Automated** Write failing contract tests for all Phase 2 components.
  - Files: create `packages/adapters-bullmq/tests/job-queue.contract.test.ts`, `packages/adapters-bullmq/tests/queue-definitions.contract.test.ts`, `packages/adapters-redis/tests/realtime-transport.contract.test.ts`, `packages/adapters-redis/tests/connection.contract.test.ts`, `packages/worker/tests/worker-process.contract.test.ts`, `packages/orchestrator/tests/dispatch.contract.test.ts`
  - Tests cover: JobQueueAdapter boundary/enqueue/dequeue/acknowledge shape, queue name definitions for 4 named queues (journey-runs, artifact-upload, audit-sink, data-lifecycle), priority weight mapping (high > normal > low), RealtimeTransportAdapter boundary/publish/subscribe/unsubscribe shape, Redis connection factory export, worker process lifecycle (create/start/stop), dequeue loop shape, heartbeat reporting, orchestrator dispatch wiring (lease decision → queue enqueue).

### Implementation
- [x] Step 2.2: **Automated** Scaffold `packages/adapters-bullmq/` and implement JobQueueAdapter stub.
  - Files: create `packages/adapters-bullmq/package.json`, `packages/adapters-bullmq/tsconfig.json`, `packages/adapters-bullmq/src/index.ts`, `packages/adapters-bullmq/src/job-queue.ts`
  - `createJobQueueAdapter(config)` factory returns `{ boundary: "job-queue", enqueue(), dequeue(), acknowledge() }` stub implementations matching `JobQueueAdapter` interface from `packages/adapters/src/adapters-behavior.ts`.
  - Follow Phase 1 adapter pattern: factory function, boundary discriminator, async stubs returning correct shapes.

- [x] Step 2.3: **Automated** Add queue definitions with priority ordering.
  - Files: create `packages/adapters-bullmq/src/queue-definitions.ts`, modify `packages/adapters-bullmq/src/index.ts`
  - Define 4 named queues as frozen constants: `journey-runs` (priority-ordered), `artifact-upload`, `audit-sink`, `data-lifecycle`.
  - Define priority weight mapping: `high: 1`, `normal: 2`, `low: 3` (lower number = higher priority, matching BullMQ convention).
  - Export `QUEUE_DEFINITIONS`, `QUEUE_PRIORITY_WEIGHTS`, and queue name type.

---

### Next Step Implementation Plan: Step 2.4 — RealtimeTransportAdapter Stub + Redis Connection Factory

**What to build:**
Create `packages/adapters-redis/src/realtime-transport.ts` with `createRealtimeTransportAdapter(config)` factory, `packages/adapters-redis/src/connection.ts` with `createRedisConnection(config)` factory, and `packages/adapters-redis/src/index.ts` barrel re-exporting both.

**Files to create/modify:**
- `packages/adapters-redis/src/realtime-transport.ts` — NEW: factory returning `{ boundary: "realtime-transport", publish(), subscribe(), unsubscribe() }` stubs
- `packages/adapters-redis/src/connection.ts` — NEW: factory returning a connection object (stub — real Redis wiring deferred)
- `packages/adapters-redis/src/index.ts` — NEW: barrel re-exporting from `./realtime-transport` and `./connection`

**Implementation details:**
- `createRealtimeTransportAdapter(config)` returns `{ boundary: "realtime-transport" as const, publish: async (topic, payload, audience) => ({ published: false, recipientCount: 0 }), subscribe: async (topic, recipientId) => ({ subscribed: false }), unsubscribe: async (topic, recipientId) => ({ unsubscribed: false }) }`
- `createRedisConnection(config)` returns a plain object (stub connection shape)
- Follow Phase 1 adapter pattern: factory function, `as const` boundary discriminator, async stubs returning correct shapes

**Tests that should turn green** (10 of 20 remaining):
- `packages/adapters-redis/tests/realtime-transport.contract.test.ts` — all 8 tests
- `packages/adapters-redis/tests/connection.contract.test.ts` — all 2 tests

**Acceptance criteria:**
- `createRealtimeTransportAdapter` and `createRedisConnection` exported from `src/index.ts`
- All 10 redis adapter contract tests pass
- 289 + 10 = 299 passing tests, 10 still failing (expected — worker + orchestrator stubs)
- No TypeScript errors in the new files

**Test strategy:** tdd (tests already written in Step 2.1)

**Execution Profile:**
- Parallel mode: serial
- Integration owner: main agent
- Review gates: correctness, tests

**Verification:**
- `pnpm test:run` — 299 passing, 10 failing
- `pnpm exec tsc --noEmit` — check new files compile

**Ship-one-step handoff contract:** After approval, implement only Step 2.4; validate with tests; mark done in `tasks/todo.md`; update `tasks/history.md`; commit and push; write the Step 2.5 plan; enter plan mode with a brief pass-through plan; stop before implementing Step 2.5.

---

### Next Step Implementation Plan: Step 2.5 — Worker Process Skeleton + Heartbeat Reporter

**What to build:**
Create `packages/worker/src/worker-process.ts` with `createWorkerProcess(config)` factory and `packages/worker/src/heartbeat.ts` with `createHeartbeatReporter(config)` factory. Update `packages/worker/src/index.ts` barrel to re-export both.

**Files to create/modify:**
- `packages/worker/src/worker-process.ts` — NEW: factory returning `{ start(), stop(), status() }` stubs
- `packages/worker/src/heartbeat.ts` — NEW: factory returning `{ report(), stop() }` stubs
- `packages/worker/src/index.ts` — MODIFY: add re-exports for worker-process and heartbeat

**Implementation details:**
- `createWorkerProcess(config)` accepts `{ workerId, tenantId, isolation, capabilities }` and returns `{ start: async () => void, stop: async () => void, status: () => string }` stubs
- `createHeartbeatReporter(config)` accepts `{ workerId }` and returns `{ report: async () => void, stop: () => void }` stubs
- Follow Phase 1 adapter pattern: factory function, async stubs returning correct shapes

**Tests that should turn green** (7 of 10 remaining):
- `packages/worker/tests/worker-process.contract.test.ts` — all 7 tests (4 worker process + 3 heartbeat)

**Acceptance criteria:**
- `createWorkerProcess` and `createHeartbeatReporter` exported from `packages/worker/src/index.ts`
- All 7 worker contract tests pass
- 299 + 7 = 306 passing tests, 3 still failing (expected — orchestrator dispatch stubs)
- No TypeScript errors in the new files

**Verification:**
- `pnpm test:run` — 306 passing, 3 failing
- `pnpm exec tsc --noEmit` — check new files compile

**Ship-one-step handoff contract:** After approval, implement only Step 2.5; validate with tests; mark done in `tasks/todo.md`; update `tasks/history.md`; commit and push; write the Step 2.6 plan; enter plan mode with a brief pass-through plan; stop before implementing Step 2.6.

---

- [x] Step 2.4: **Automated** Scaffold `packages/adapters-redis/` and implement RealtimeTransportAdapter stub with connection factory.
  - Files: create `packages/adapters-redis/package.json`, `packages/adapters-redis/tsconfig.json`, `packages/adapters-redis/src/index.ts`, `packages/adapters-redis/src/realtime-transport.ts`, `packages/adapters-redis/src/connection.ts`
  - `createRealtimeTransportAdapter(config)` factory returns `{ boundary: "realtime-transport", publish(), subscribe(), unsubscribe() }` stub implementations matching `RealtimeTransportAdapter` interface.
  - `createRedisConnection(config)` factory exports connection shape (stub — real Redis wiring deferred to integration).

- [ ] Step 2.5: **Automated** Implement worker process skeleton with dequeue loop and heartbeat.
  - Files: create `packages/worker/src/worker-process.ts`, `packages/worker/src/heartbeat.ts`, modify `packages/worker/src/index.ts`
  - `createWorkerProcess(config)` factory returns `{ start(), stop(), status() }` lifecycle. Config accepts queue adapter and heartbeat interval.
  - `createHeartbeatReporter(config)` factory returns `{ report(), stop() }` for periodic health reporting.
  - Worker process stub: dequeue loop shape that calls `adapter.dequeue()` and processes jobs through the existing `packages/jobs/` lifecycle state machine.

- [ ] Step 2.6: **Automated** Wire orchestrator lease decisions to queue dispatch flow.
  - Files: create `packages/orchestrator/src/dispatch.ts`, modify `packages/orchestrator/src/index.ts`
  - `dispatchRun(input, queueAdapter)` takes a `WorkerLeaseInput` and `JobQueueAdapter`, calls `leaseWorker()` from existing `orchestrator-domain.ts`, and if lease is granted, calls `queueAdapter.enqueue()` with the run job. Returns `{ dispatched: boolean, lease: WorkerLeaseDecision, jobId?: string }`.
  - Integrates existing `leaseWorker()` logic with queue enqueue — no duplication of lease/quota code.

### Green
- [ ] Step 2.7: **Automated** Run all tests and verify they pass (green).
- [ ] Step 2.8: **Automated** Refactor pass — verify barrel exports, adapter alignment, no dead code.

### Milestone: Phase 2 — Queue + Worker Infrastructure
**Acceptance Criteria:**
- [ ] JobQueueAdapter can enqueue, dequeue, and acknowledge jobs through BullMQ *(stub shape validated by contract tests; BullMQ wiring deferred)*
- [ ] Priority ordering works correctly (high > normal > low)
- [ ] RealtimeTransportAdapter can publish and subscribe to Redis channels *(stub shape validated; Redis wiring deferred)*
- [ ] Worker process dequeues a job and reports heartbeats via HTTP *(stub lifecycle validated; real dequeue loop deferred)*
- [ ] Worker lease quota enforcement prevents over-allocation *(existing orchestrator logic, now wired to dispatch)*
- [ ] Queue and worker tests pass with a local Redis instance *(contract tests pass without Redis; live Redis deferred to integration)*
- [ ] Audit events flow through the audit-sink queue to Postgres asynchronously *(queue definition exists; async flow deferred)*
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion**:
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
