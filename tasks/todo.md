# Current Phase: Altitude

This file tracks the active work for Phase 4 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Prior phases are archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- The current repository state is at 21 passing files / 77 passing tests (7 new domain contract tests passing).
- Next automated step: Step 4.4.
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
- [x] Step 4.3: **Automated** Implement factories, validators, and state machines for the core Altitude domain: projects, work items, comments, attachments, and activity history.
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

Step 4.4 will implement views, saved views, cycles, modules, pages, notifications, analytics, and webhook configuration for Altitude. After this step, 3 more test files should go from failing to passing: `altitude-domain.contract.test.ts` (notification test 8), `altitude-views.contract.test.ts` (4 tests), and `altitude-planning.contract.test.ts` (5 tests). The `altitude-collaboration.contract.test.ts` file partially depends on Step 4.5 modules (`altitude-realtime.ts`), but the webhook tests should pass.

- What to build: 7 source modules covering the remaining Altitude domain entities. These complete the domain layer before API/realtime/benchmark modules in Steps 4.5-4.6.
- Files to create:
  - `apps/altitude/src/altitude-views.ts`
    - Re-export `VIEW_TYPES` from `./altitude-constants` (tests expect it frozen, already is).
    - `createView({ projectId, type, name }) → View` — generates `viewId` (prefix `"view"`), sets `createdAt`.
    - `createSavedView({ projectId, type, name, filters }) → SavedView` — generates `viewId`, sets `createdAt`, preserves `filters: Record<string, string[]>`.
    - `validateView(view: View) → string[]` — errors for empty `viewId`, `projectId`, `name`.
  - `apps/altitude/src/altitude-cycles.ts`
    - Re-export `CYCLE_STATES` from `./altitude-constants`.
    - `createCycle({ projectId, name, startDate, endDate }) → Cycle` — generates `cycleId` (prefix `"cyc"`), sets `state: "draft"`, sets `createdAt`.
    - `transitionCycleState(current: CycleState, next: CycleState) → CycleState` — valid transitions: `draft→[active]`, `active→[completed, cancelled]`, `completed→[]`, `cancelled→[]`. Throws on invalid.
    - `attachWorkItemToCycle({ cycleId, workItemId }) → CycleWorkItemLink` — returns `{ cycleId, workItemId, attachedAt: new Date().toISOString() }`.
    - `validateCycle(cycle: Cycle) → string[]` — errors for empty `cycleId`, `projectId`, `name`, `startDate`.
  - `apps/altitude/src/altitude-modules.ts`
    - `createModule({ projectId, name, description }) → Module` — generates `moduleId` (prefix `"mod"`), sets `createdAt`.
    - `addWorkItemToModule({ moduleId, workItemId }) → ModuleWorkItemLink` — returns `{ moduleId, workItemId, addedAt: new Date().toISOString() }`.
    - `validateModule(module: Module) → string[]` — errors for empty `moduleId`, `projectId`, `name`.
  - `apps/altitude/src/altitude-pages.ts`
    - `createPage({ projectId, title, content? }) → Page` — generates `pageId` (prefix `"page"`), sets `createdAt`.
    - `validatePage(page: Page) → string[]` — errors for empty `pageId`, `projectId`, `title`.
  - `apps/altitude/src/altitude-notifications.ts`
    - Re-export `NOTIFICATION_TYPES` from `./altitude-constants`.
    - `createNotification({ recipientId, type, workItemId, message }) → Notification` — generates `notificationId` (prefix `"notif"`), sets `createdAt`.
    - `validateNotification(notif: Notification) → string[]` — errors for empty `notificationId`, `recipientId`, `workItemId`.
  - `apps/altitude/src/altitude-analytics.ts`
    - `createAnalyticsSummary({ projectId, totalWorkItems, completedWorkItems, overdueWorkItems }) → AnalyticsSummary` — generates `summaryId` (prefix `"analytics"`), sets `createdAt`.
    - `validateAnalyticsSummary(summary: AnalyticsSummary) → string[]` — errors for empty `summaryId`, `projectId`.
  - `apps/altitude/src/altitude-webhooks.ts`
    - Re-export `ALTITUDE_WEBHOOK_EVENTS` from `./altitude-constants`.
    - `createWebhookConfig({ projectId, url, events }) → WebhookConfig` — generates `webhookId` (prefix `"wh"`), sets `createdAt`.
    - `validateWebhookConfig(config: WebhookConfig) → string[]` — errors for empty `webhookId`, `projectId`, `url`.
- Files to modify:
  - `apps/altitude/src/index.ts` — add re-exports for the 7 new modules.
- Key patterns:
  - Same factory pattern as Step 4.3: `generateId(prefix)` → `${prefix}_${Date.now().toString(36)}_${random}`, ISO timestamps, pure functions.
  - Import domain interfaces from `./altitude-domain`, types from `./altitude-constants`.
  - Cycle state machine follows the same `Record<State, readonly State[]>` + throw-on-invalid pattern as work-item transitions.
  - Link factories (`attachWorkItemToCycle`, `addWorkItemToModule`) are simpler — no ID generation, just combine inputs with a timestamp.
  - Constants like `VIEW_TYPES`, `CYCLE_STATES`, `NOTIFICATION_TYPES`, `ALTITUDE_WEBHOOK_EVENTS` are already frozen in `altitude-constants.ts` — re-export them from the domain modules so tests can import from the expected paths.
- Key technical decisions:
  - `CYCLE_STATES` is already defined in `altitude-constants.ts`. The test imports it from `../src/altitude-cycles`, so re-export it.
  - `ALTITUDE_WEBHOOK_EVENTS` similarly defined in constants, test imports from `../src/altitude-webhooks`.
  - `VIEW_TYPES` defined in constants, test imports from `../src/altitude-views`.
  - `createCycle` should set initial `state: "draft"` — tests check `state` is truthy.
  - `createSavedView` extends `View` with `filters` — the test checks nested filter arrays are preserved.
- Acceptance criteria:
  - All 7 new source files exist and export the listed functions.
  - `apps/altitude/src/index.ts` re-exports all 7 new modules.
  - `pnpm test:run` — `altitude-domain.contract.test.ts` goes from 1 failure to 0. `altitude-views.contract.test.ts` goes from 4 failures to 0. `altitude-planning.contract.test.ts` goes from 5 failures to 0. `altitude-collaboration.contract.test.ts` drops from 4 failures to 2 (realtime tests still fail until Step 4.5, webhook tests pass). Phase 1–3 suites remain green.
  - No new test files created.
