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

- [ ] Step 4.2: **Automated** Scaffold `apps/altitude/` with frozen constants, the product domain model, and barrel exports following the shared-platform package pattern.
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

Step 4.2 will scaffold `apps/altitude/` with frozen constants and the product domain model.

- What to build: 2 source modules that define the Altitude domain's frozen constant arrays and TypeScript interfaces, plus update the barrel. `apps/altitude/package.json` and `apps/altitude/tsconfig.json` already exist from Step 4.1.
- Files to create:
  - `apps/altitude/src/altitude-constants.ts` — frozen `as const` arrays for all domain enumerations:
    - `WORK_ITEM_TYPES`: `["issue", "task", "epic", "story", "bug"]`
    - `WORK_ITEM_STATES`: `["backlog", "todo", "in-progress", "in-review", "done", "cancelled"]`
    - `WORK_ITEM_PRIORITIES`: `["none", "low", "medium", "high", "urgent"]`
    - `VIEW_TYPES`: `["board", "list", "table", "calendar", "timeline"]`
    - `CYCLE_STATES`: `["draft", "active", "completed", "cancelled"]`
    - `NOTIFICATION_TYPES`: `["assignment", "mention", "state-change", "comment", "due-date"]`
    - `ALTITUDE_REALTIME_TOPICS`: `["work-item-changed", "comment-added", "assignment-changed", "cycle-updated", "module-updated"]`
    - `ALTITUDE_WEBHOOK_EVENTS`: `["project.created", "project.updated", "work-item.created", "work-item.updated", "work-item.deleted", "comment.created", "cycle.created", "cycle.updated", "module.created", "module.updated"]`
    - Derived union types for each: `type WorkItemType = (typeof WORK_ITEM_TYPES)[number]`, etc.
  - `apps/altitude/src/altitude-domain.ts` — TypeScript interfaces for all domain entities:
    - `Project`: `{ projectId, name, description?, organizationId, workspaceId, createdAt }`
    - `WorkItem`: `{ workItemId, projectId, title, description?, type: WorkItemType, state: WorkItemState, priority: WorkItemPriority, assigneeId?, labels?, createdAt }`
    - `Comment`: `{ commentId, workItemId, authorId, body, createdAt }`
    - `Attachment`: `{ attachmentId, workItemId, fileName, fileSize, mimeType, uploadedBy, createdAt }`
    - `View`: `{ viewId, projectId, type: ViewType, name, createdAt }`
    - `SavedView`: `View & { filters: Record<string, string[]> }`
    - `Cycle`: `{ cycleId, projectId, name, startDate, endDate, state: CycleState, createdAt }`
    - `Module`: `{ moduleId, projectId, name, description, createdAt }`
    - `Page`: `{ pageId, projectId, title, content?, createdAt }`
    - `Notification`: `{ notificationId, recipientId, type: NotificationType, workItemId, message, createdAt }`
    - `AnalyticsSummary`: `{ summaryId, projectId, totalWorkItems, completedWorkItems, overdueWorkItems, createdAt }`
    - `WebhookConfig`: `{ webhookId, projectId, url, events: string[], createdAt }`
    - `CycleWorkItemLink`: `{ cycleId, workItemId, attachedAt }`
    - `ModuleWorkItemLink`: `{ moduleId, workItemId, addedAt }`
    - `AltitudeRealtimeEvent`: `{ eventId, organizationId, workspaceId, topic: AltitudeRealtimeTopic, payload: Record<string, unknown>, occurredAt }`
    - `AltitudeApiRoute`: `{ path, methods: string[], description? }`
    - `AltitudeBenchmarkRoute`: `{ path, name }`
    - All interfaces import types from `altitude-constants.ts`.
- Files to modify:
  - `apps/altitude/src/index.ts` — replace empty barrel with `export * from "./altitude-constants"` and `export * from "./altitude-domain"`.
- Key patterns:
  - Follow `packages/tenancy/src/platform-tenancy.ts` pattern for frozen constants (array `as const`, derived union type).
  - Follow `packages/tenancy/src/tenancy-behavior.ts` pattern for interfaces (domain entity shapes with ID, timestamps, tenancy fields).
  - No factory functions, validators, or state machines yet — those come in Steps 4.3–4.6.
  - Constants file is the source of truth for all enum-like values. Domain file imports types from constants.
- Key technical decisions:
  - Tests will still fail after this step (missing factory/validator exports) — this is expected. Step 4.2 only establishes types and constants.
  - `VIEW_TYPES` and `CYCLE_STATES` must match what the test files assert: `["board", "list", "table", "calendar", "timeline"]` and `["draft", "active", "completed", "cancelled"]` respectively.
  - `ALTITUDE_REALTIME_TOPICS` must be `["work-item-changed", "comment-added", "assignment-changed", "cycle-updated", "module-updated"]`.
  - `ALTITUDE_WEBHOOK_EVENTS` must contain at minimum the 10 events tested in `altitude-collaboration.contract.test.ts`.
- Acceptance criteria:
  - `apps/altitude/src/altitude-constants.ts` exists with all frozen arrays and derived types.
  - `apps/altitude/src/altitude-domain.ts` exists with all interfaces importing types from constants.
  - `apps/altitude/src/index.ts` re-exports both modules.
  - `pnpm test:run` shows 27 files (21 passing + 6 failing). The 6 altitude test files still fail because factories/validators are not yet implemented. The 21 existing files remain green at 70 tests.
  - No new test files are created in this step.
