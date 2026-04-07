# Altitude Feature Matrix

## Purpose

`Altitude` is the owned project-management benchmark target. This matrix freezes the minimum Plane-parity surface needed before implementation so later domain, API, and UI work stays aligned to one benchmarkable contract.

## Required Parity Surface

- `Altitude` must support workspaces and workspace settings as the top-level tenancy model.
- Users must be able to handle project creation and project-scoped membership without leaving the core product shell.
- The core domain is work items with types, fields, states, priorities, estimates, labels, dates, assignees, comments, attachments, and activity history.
- Teams need multiple work item views and saved views so the same data can be planned, triaged, and reviewed in different ways.
- Planning flows must include cycles.
- Delivery grouping must include modules.
- Knowledge capture must include pages or wiki.
- The product must expose dashboards or analytics views for progress and status.
- New work must enter through an intake or backlog capture flow.
- User-facing updates must include notifications.
- Power-user navigation must include a command palette or global action surface.

## Major Resources Requiring API Compatibility

- The frozen API boundary covers workspaces, workspace settings, projects, memberships, work items, comments, attachments, cycles, modules, pages, notifications, analytics summaries, and related metadata.
- `Altitude` must expose REST APIs and webhooks for major resources so automation, integration, and benchmark setup can operate without UI-only shortcuts.

## Collaboration Requirements

- Collaboration must support shared assignment, concurrent editing expectations, comment visibility, and activity review for project teams.
- Membership and permission behavior should remain project-aware so cross-workspace access does not leak into benchmark fixtures.
- Attachment, comment, and state-change flows must remain legible to multiple collaborators reviewing the same project.

## Integration Model

- The integration model centers on first-party APIs, webhook delivery, imports from surrounding platform services, and automation-friendly identifiers for seeded benchmark data.
- Analytics, notifications, and command flows must remain reachable through stable application routes so deterministic runs can observe consistent product state.

## Benchmark-Critical Journeys

- create workspace and project
- create and update work items across the standard planning surfaces
- move work through cycles, modules, and saved-view contexts
- attach a file to a work item
- inspect analytics or progress summaries
