# Current Phase: Altitude

This file tracks the active work for Phase 4 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Prior phases are archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- The current repository state is green at 21 passing files / 70 passing tests.
- Next automated step: Step 4.1.
- Known manual blockers: none for Phase 4.

## Phase 4: Altitude

Goal: deliver the first owned parity product, `Altitude`, as the Plane-parity benchmark surface and shared-product proving ground.

> Test strategy: tdd

### Tests First

- [x] Step 4.1: **Automated** Write failing contract and domain tests for `Altitude` covering the project management domain model, major-resource API contracts, planning entities, collaboration events, and benchmark journey entry points.
  - Files: create `apps/altitude/tests/altitude-domain.contract.test.ts`, `apps/altitude/tests/altitude-api.contract.test.ts`, `apps/altitude/tests/altitude-views.contract.test.ts`, `apps/altitude/tests/altitude-planning.contract.test.ts`, `apps/altitude/tests/altitude-collaboration.contract.test.ts`, `tests/integration/altitude/altitude-benchmark-journeys.contract.test.ts`
  - Tests cover: project/work-item/cycle/module/page/view/attachment/notification domain shapes, API route manifest completeness, saved-view configuration, cycle/module planning flows, realtime event shapes for collaboration, and benchmark journey seed/reset/route contracts

### Implementation

- [x] Step 4.2: **Automated** Scaffold `apps/altitude/` with frozen constants, the product domain model, and barrel exports following the shared-platform package pattern.
  - Files: create `apps/altitude/src/altitude-constants.ts` (frozen domain arrays: work item types, states, priorities, view types, planning entities), `apps/altitude/src/altitude-domain.ts` (interfaces: Project, WorkItem, WorkItemType, WorkItemState, Cycle, Module, Page, View, SavedView, Comment, Attachment, Notification, AnalyticsSummary, WebhookConfig), `apps/altitude/src/index.ts` (barrel)
  - Files: create `apps/altitude/package.json`, `apps/altitude/tsconfig.json`
- [ ] Step 4.3: **Automated** Implement factories, validators, and state machines for the core Altitude domain: projects, work items, comments, attachments, and activity history.
  - Files: create `apps/altitude/src/altitude-projects.ts` (createProject, validateProject, project membership helpers), `apps/altitude/src/altitude-work-items.ts` (createWorkItem, transitionWorkItemState, VALID_WORK_ITEM_TRANSITIONS, validateWorkItem, assignWorkItem, labelWorkItem), `apps/altitude/src/altitude-comments.ts` (createComment, validateComment), `apps/altitude/src/altitude-attachments.ts` (createAttachment, linkAttachmentToWorkItem, validateAttachment)
  - Files: modify `apps/altitude/src/index.ts` (re-export new modules)
- [ ] Step 4.4: **Automated** Implement views, saved views, cycles, modules, pages, notifications, analytics, and webhook configuration for Altitude.
  - Files: create `apps/altitude/src/altitude-views.ts` (createView, createSavedView, VIEW_TYPES, validateView), `apps/altitude/src/altitude-cycles.ts` (createCycle, CYCLE_STATES, transitionCycleState, attachWorkItemToCycle, validateCycle), `apps/altitude/src/altitude-modules.ts` (createModule, addWorkItemToModule, validateModule), `apps/altitude/src/altitude-pages.ts` (createPage, validatePage), `apps/altitude/src/altitude-notifications.ts` (createNotification, NOTIFICATION_TYPES, validateNotification), `apps/altitude/src/altitude-analytics.ts` (createAnalyticsSummary, computeProjectProgress, validateAnalyticsSummary), `apps/altitude/src/altitude-webhooks.ts` (createWebhookConfig, ALTITUDE_WEBHOOK_EVENTS, validateWebhookConfig)
  - Files: modify `apps/altitude/src/index.ts` (re-export new modules)
- [ ] Step 4.5: **Automated** Implement the Altitude API route manifest, adapter boundaries, and realtime collaboration event model.
  - Files: create `apps/altitude/src/altitude-api-routes.ts` (ALTITUDE_API_ROUTES manifest for projects, work-items, cycles, modules, pages, views, comments, attachments, notifications, analytics, webhooks), `apps/altitude/src/altitude-adapters.ts` (adapter interfaces: SourceControlAdapter, ChatNotificationAdapter, AlertAdapter, WebhookDeliveryAdapter; adapter registry factory), `apps/altitude/src/altitude-realtime.ts` (ALTITUDE_REALTIME_TOPICS, createAltitudeRealtimeEvent for work-item-changed, comment-added, assignment-changed, cycle-updated, module-updated)
  - Files: modify `apps/altitude/src/index.ts` (re-export new modules)
- [ ] Step 4.6: **Automated** Add deterministic seeds, reset hooks, and benchmark-friendly route definitions for the Altitude benchmark-critical journeys.
  - Files: create `apps/altitude/src/altitude-seed.ts` (seedAltitudeBenchmarkEnvironment: creates workspace, project, work-item presets, cycles, modules, page root, attachment bucket, analytics snapshot; resetAltitudeBenchmarkEnvironment: clears mutations and rebuilds seed), `apps/altitude/src/altitude-benchmark-routes.ts` (ALTITUDE_BENCHMARK_ROUTES: workspace landing, project backlog, board/list view, cycle planning, module detail, wiki, work-item detail, analytics URLs)
  - Files: modify `apps/altitude/src/index.ts` (re-export new modules)

### Green

- [ ] Step 4.7: **Automated** Make all Altitude suites pass and verify that benchmark journeys, domain logic, API contracts, planning flows, and collaboration events are stable with no regressions in Phases 1-3 suites.

### Milestone

Acceptance criteria:

- The frozen `Altitude` feature matrix passes.
- Major-resource API compatibility tests pass for `Altitude`.
- Realtime collaboration works for assignments, comments, activity, and state changes.
- The QA platform can exercise the defined `Altitude` benchmark-critical journeys.
- All Phase 4 tests pass.
- No regressions occur in Phases 1-3 suites.

## Next Step Plan

Step 4.3 will implement factories, validators, and state machines for the core Altitude domain.

- What to build: 4 source modules with factory functions, validators, and a work-item state machine. These are the first modules that tests can actually call. After this step, `altitude-domain.contract.test.ts` tests 1–7 (project, work-item, comment, attachment factories + state transition + validators) should go from failing to passing. The notification test (test 8) stays failing — `altitude-notifications.ts` is Step 4.4.
- Files to create:
  - `apps/altitude/src/altitude-projects.ts`
    - `createProject(input: { name, organizationId, workspaceId }) → Project` — generates deterministic `projectId` (e.g. `"proj_" + counter`), sets `createdAt` to ISO string.
    - `validateProject(project: Project) → string[]` — returns errors for empty `projectId`, `name`, `organizationId`. Does NOT check `workspaceId` (test passes `"ws_1"` for it).
  - `apps/altitude/src/altitude-work-items.ts`
    - `createWorkItem(input: { projectId, title, type, state, priority }) → WorkItem` — generates `workItemId`, sets `createdAt`.
    - `transitionWorkItemState(from: WorkItemState, to: WorkItemState) → WorkItemState` — valid paths include `backlog→in-progress` and `in-progress→done`. Invalid path `done→backlog` must throw.
    - `validateWorkItem(item: WorkItem) → string[]` — returns errors for empty `workItemId`, `projectId`, `title`.
    - Exports `VALID_WORK_ITEM_TRANSITIONS` map (not tested directly but used internally).
  - `apps/altitude/src/altitude-comments.ts`
    - `createComment(input: { workItemId, authorId, body }) → Comment` — generates `commentId`, sets `createdAt`.
  - `apps/altitude/src/altitude-attachments.ts`
    - `createAttachment(input: { workItemId, fileName, fileSize, mimeType, uploadedBy }) → Attachment` — generates `attachmentId`, sets `createdAt`.
- Files to modify:
  - `apps/altitude/src/index.ts` — add re-exports for the 4 new modules.
- Key patterns:
  - Follow `packages/tenancy/src/tenancy-behavior.ts` factory pattern: pure functions, deterministic ID generation (prefix + incrementing counter), ISO timestamp via `new Date().toISOString()`.
  - Import domain interfaces from `./altitude-domain` and types from `./altitude-constants`.
  - State machine: define a `Map<WorkItemState, WorkItemState[]>` of allowed transitions. `transitionWorkItemState` checks the map and throws if the transition is not in the allowed list.
  - Validators return `string[]` of error messages, not throwing. Each checks required string fields for falsy/empty values.
- Key technical decisions:
  - The test for `transitionWorkItemState` checks `backlog→in-progress→done` as valid and `done→backlog` as invalid. The transition map must allow at minimum these forward paths. A reasonable full map: `backlog→[todo, in-progress]`, `todo→[in-progress, backlog]`, `in-progress→[in-review, done, backlog]`, `in-review→[done, in-progress]`, `done→[cancelled]`, `cancelled→[]`.
  - `createNotification` is imported from `altitude-notifications.ts` in the test — that file is Step 4.4, so test 8 (notification) will still fail after 4.3.
  - Tests import directly from `../src/altitude-projects` etc., not from the barrel. But barrel re-exports are still needed for downstream consumers.
- Test strategy: tdd — the 8 tests in `altitude-domain.contract.test.ts` are the target. Tests 1–7 should pass after this step. Test 8 (notification) remains failing until Step 4.4.
- Acceptance criteria:
  - All 4 new source files exist and export the listed functions.
  - `apps/altitude/src/index.ts` re-exports all 4 modules.
  - `pnpm test:run` — `altitude-domain.contract.test.ts` drops from 8 failures to 1 (the notification test). Other 5 altitude test files still fail. Phase 1–3 suites remain green.
  - No new test files created.
