# Current Phase: Altitude

This file tracks the active work for Phase 4 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Prior phases are archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- The current repository state is at 26 passing files / 95 passing tests (25 tests passing across 5 Altitude unit contract files; 4 expected failures remain in the Step 4.6 benchmark journey contract).
- Next automated step: Step 4.6.
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
- [x] Step 4.4: **Automated** Implement views, saved views, cycles, modules, pages, notifications, analytics, webhooks, and realtime events for Altitude.
  - Files: create `apps/altitude/src/altitude-views.ts` (createView, createSavedView, VIEW_TYPES, validateView), `apps/altitude/src/altitude-cycles.ts` (createCycle, CYCLE_STATES, transitionCycleState, attachWorkItemToCycle, validateCycle), `apps/altitude/src/altitude-modules.ts` (createModule, addWorkItemToModule, validateModule), `apps/altitude/src/altitude-pages.ts` (createPage, validatePage), `apps/altitude/src/altitude-notifications.ts` (createNotification, NOTIFICATION_TYPES, validateNotification), `apps/altitude/src/altitude-analytics.ts` (createAnalyticsSummary, computeProjectProgress, validateAnalyticsSummary), `apps/altitude/src/altitude-webhooks.ts` (createWebhookConfig, ALTITUDE_WEBHOOK_EVENTS, validateWebhookConfig)
  - Files: modify `apps/altitude/src/index.ts` (re-export new modules)
- [x] Step 4.5: **Automated** Implement the Altitude API route manifest and adapter boundaries. (Realtime module pulled forward to Step 4.4.)
  - Files: create `apps/altitude/src/altitude-api-routes.ts` (ALTITUDE_API_ROUTES manifest for projects, work-items, cycles, modules, pages, views, comments, attachments, notifications, analytics, webhooks), `apps/altitude/src/altitude-adapters.ts` (adapter interfaces: SourceControlAdapter, ChatNotificationAdapter, AlertAdapter, WebhookDeliveryAdapter; adapter registry factory)
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

Step 4.6 will add deterministic seed/reset support and benchmark-friendly route definitions for the Altitude benchmark-critical journeys. After this step, `tests/integration/altitude/altitude-benchmark-journeys.contract.test.ts` (4 tests) should go green.

- Files to create:
  - `apps/altitude/src/altitude-seed.ts` — `seedAltitudeBenchmarkEnvironment()` returning a deterministic workspace, project, work-item presets, cycles, modules, page root, attachment bucket, and analytics snapshot; `resetAltitudeBenchmarkEnvironment()` clearing mutations and rebuilding the deterministic seed.
  - `apps/altitude/src/altitude-benchmark-routes.ts` — `ALTITUDE_BENCHMARK_ROUTES` covering 8 journey URLs: workspace landing, project backlog, board/list view, cycle planning, module detail, wiki, work-item detail, and analytics.
- Files to modify:
  - `apps/altitude/src/index.ts` — add re-exports for seed and benchmark-routes modules.
- Acceptance criteria:
  - `altitude-benchmark-journeys.contract.test.ts` goes from 4 failures to 0.
  - Full `pnpm test:run` reaches all Phase 4 tests green if no further Step 4.7 stabilization issues remain.
  - Phase 1-3 suites remain green. No regressions.
