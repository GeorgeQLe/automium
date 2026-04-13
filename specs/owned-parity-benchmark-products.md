# Owned Parity Benchmark Products

## Status

Drafted from plan interview on April 7, 2026.

## Summary

Build three distinct in-house products that replace third-party benchmark dependencies while preserving the workflow and information architecture of the reference products they stand in for:

- `Altitude`: Plane-parity project management workspace
- `Switchboard`: Chatwoot-parity customer support workspace
- `Foundry`: Appsmith-parity internal app builder

These products are internal-first benchmark fixtures for the agent-native browser QA platform, but they must be built cleanly enough to externalize later if desired.

The parity target is frozen to the self-hostable or community-visible product surface of the reference products as it existed on April 7, 2026. This is workflow and information-architecture parity, not pixel-perfect cloning.

## Product Goal

Replace external benchmark dependencies with owned products so the QA platform can benchmark against realistic, durable, legally safe, and fully controlled application surfaces.

## Why This Exists

The Phase 1 benchmark corpus currently depends on provisioned external products and private operational setup. That creates avoidable scope in operations, legal review, environment drift, and repeatability. Building owned benchmark products turns those dependencies into assets.

## Goals

- Preserve the benchmark realism of project-management, support-inbox, and internal-app-builder workflows.
- Remove dependence on third-party product availability, account provisioning, and policy changes.
- Build a shared multi-tenant application platform once and reuse it under all three products.
- Reach parity-complete status through a frozen feature matrix per product.
- Preserve major-resource API compatibility for the main objects and workflows of each product.
- Support realtime collaboration, auditability, and deterministic seeding across all three products.
- Keep the products internal-first, but architect them so later external commercialization remains possible.

## Non-Goals

- Pixel-perfect visual cloning of the reference products.
- Broad import or migration tooling in v1.
- Ongoing parity with future upstream releases after April 7, 2026.
- Rebuilding every external integration as a production connector in the first release.
- Public use of upstream product names, branding, or visual identity.

## Frozen Scope Boundaries

### Parity Basis

Parity is frozen to the self-hostable or community-visible surface that is publicly visible on official docs and product pages as of April 7, 2026.

### Parity Definition

Parity means:

- equivalent core object model
- equivalent navigation and workflow structure
- equivalent operator tasks and state transitions
- equivalent collaboration model where the reference product is collaborative
- equivalent major-resource APIs for main objects and actions
- equivalent admin, tenancy, permissions, and audit surfaces where publicly visible

Parity does not mean:

- identical CSS, layout metrics, or iconography
- compatibility with every undocumented endpoint or edge-case behavior
- identical proprietary AI or enterprise-only features unless clearly part of the frozen public surface

### Completion Rule

A product is parity-complete only when:

- its frozen feature matrix is checked in and approved
- every matrix item maps to an automated contract, integration, or UI test
- the main workflows are benchmarkable through the QA platform
- major-resource API compatibility tests pass
- multi-tenant admin, RBAC, audit, and realtime behavior pass shared platform checks

Adapter-backed integrations may use local or mock implementations initially as long as:

- the product surfaces exist
- the adapter contracts are stable
- the same operator workflows work end to end
- unsupported real providers are explicitly documented

## Product Naming and Legal Boundary

The products must use distinct internal names and branding:

- `Altitude` instead of Plane
- `Switchboard` instead of Chatwoot
- `Foundry` instead of Appsmith

Internal specs may reference the target products for parity purposes. Public-facing UI, docs, and branding must not mimic the upstream names or visual identity.

## Shared Platform Requirements

All three products will sit on one shared platform implemented as a TypeScript monorepo with separate product apps on top.

### Shared Foundation

- authentication and session management
- organizations, workspaces, users, teams, invites, and memberships
- RBAC and per-product permissions
- audit log and event history
- notifications and inbox/event delivery
- websocket or equivalent realtime event bus
- object storage for files, uploads, and artifacts
- search indexing
- background jobs and queue workers
- settings, secrets, and adapter configuration
- admin console and instance-level governance

### Shared Technical Stack

- TypeScript monorepo
- Postgres as the primary relational store
- object storage for attachments and binary assets
- queue workers for async jobs and integrations
- websocket or SSE channel for realtime collaboration
- shared design system and app-shell primitives
- shared API contract layer and domain model packages

### Monorepo Layout

Expected top-level shape:

- `apps/altitude/`
- `apps/switchboard/`
- `apps/foundry/`
- `apps/admin-console/`
- `packages/auth/`
- `packages/tenancy/`
- `packages/rbac/`
- `packages/audit/`
- `packages/realtime/`
- `packages/files/`
- `packages/search/`
- `packages/jobs/`
- `packages/adapters/`
- `packages/ui/`
- `packages/api-contracts/`
- `packages/domain-model/`

## Cross-Product Constraints

- All products must be seedable from deterministic fixtures.
- All products must expose benchmark-friendly stable URLs and predictable state reset hooks.
- All products must support multi-workspace isolation.
- All products must emit auditable activity streams.
- All products must be usable both by humans and by the agent-native QA platform.

## Current Repository Implementation Status

As of April 13, 2026, the repository implements the owned products as TypeScript domain modules, route manifests, deterministic seed/reset fixtures, adapter contracts, and contract/integration suites. The current implementation proves the benchmarkable surface and shared-platform contracts; deployed browser UIs, production persistence, and provider-backed infrastructure remain production-hardening follow-up work.

Implemented shared platform surfaces:

- `apps/admin-console/` registers the three products, composes governance/product navigation, and exposes an admin route manifest for governance state, governance mutations, and product registration.
- `packages/auth/`, `packages/tenancy/`, `packages/rbac/`, `packages/audit/`, `packages/files/`, `packages/search/`, `packages/jobs/`, and `packages/realtime/` cover the shared foundation contracts for identity, membership, permission checks, auditable events, file ownership, search indexing, job lifecycle, and ordered realtime delivery.
- `packages/adapters/`, `packages/api-contracts/`, `packages/domain-model/`, and `packages/ui/` define the shared adapter, API surface, domain resource, and app-shell primitives.

Implemented product surfaces:

- `Altitude` has domain modules, adapter boundaries, realtime events, webhook configuration, 11 API route-manifest entries, eight stable benchmark routes, and deterministic seed/reset fixtures for workspace, project, work item, cycle, module, wiki, attachment, and analytics journeys.
- `Switchboard` has support-domain modules, native website/API/email channels, deferred public-channel adapters, realtime and webhook events, 16 API route-manifest entries, seven stable benchmark routes, and deterministic seed/reset fixtures for inbox, conversation, note, shortcut, automation, and reporting journeys.
- `Foundry` has builder/runtime domain modules, datasource adapters for Postgres, MySQL, and REST, widget/canvas/binding/JavaScript/custom-widget support, branch/deployment/permission/realtime modules, 13 API route-manifest entries, eight stable benchmark routes, and deterministic seed/reset fixtures for builder, datasource, query, CRUD, custom-widget, publish, and runtime journeys.

Known production-hardening gaps are tracked in `tasks/todo.md`: deployed product UIs and UI workflow suites, production persistence/adapters for Postgres/object storage/queues/realtime transports, credential/secret vault integration, and richer operator surfaces for command palette, help-center/self-service, presence/collision handling, and bulk actions.

## Product 1: Altitude

`Altitude` is the Plane-parity product.

### Purpose

Provide a modern multi-project planning workspace with work items, planning views, cycles, modules, documentation, analytics, and collaboration.

### Required Parity Surface

- workspaces and workspace settings
- project creation and project-scoped membership
- work items with types, fields, states, priorities, estimates, labels, dates, assignees, comments, attachments, and activity history
- multiple work item views and saved views
- cycles
- modules
- pages or wiki
- dashboards or analytics views for progress and status
- intake or backlog capture flow
- notifications
- command palette or global action surface
- admin and self-host governance surfaces that are part of the frozen public scope
- REST APIs and webhooks for major resources

### Major Resources Requiring API Compatibility

- workspaces
- projects
- work items
- work item types
- cycles
- modules
- comments or activity entries
- pages
- attachments
- members and roles

### Collaboration Requirements

- concurrent work item edits with visible updates
- comments and activity feed propagation in realtime
- assignment, status, and label changes reflected live
- notifications for mentions, assignments, and watch states

### Integration Model

`Altitude` must support an adapter model for integrations such as source control, chat, alerts, and webhooks. Initial release may ship with local or mock adapters for non-core providers, but the integration points and operator workflows must exist.

### Benchmark-Critical Journeys

- create workspace and project
- create and update work items
- move work items across states and views
- plan a cycle and attach work items
- group work into modules
- create a wiki page linked to a project
- attach a file to a work item
- inspect analytics or progress summaries

## Product 2: Switchboard

`Switchboard` is the Chatwoot-parity product.

### Purpose

Provide a multi-channel support workspace with shared inboxes, contacts, conversations, assignment, internal collaboration, automation, and reporting.

### Required Parity Surface

- accounts and workspace settings
- inbox management
- channel configuration
- contacts and contact profiles
- conversations and threaded messages
- assignments and teams
- labels and tags
- private notes and mentions
- canned responses
- macros
- automation rules
- SLA surfaces and reporting where part of the public surface
- activity and audit history
- help-center or self-service surfaces that are part of the frozen public scope
- REST APIs and webhook surfaces for major resources

### Channels

The channel architecture must support the public channel categories visible in the frozen reference surface:

- website live chat
- API channel
- email
- WhatsApp
- Facebook
- Instagram
- Telegram
- LINE
- SMS
- TikTok
- X or Twitter
- voice or phone where present in the frozen public surface

### Channel Delivery Rule

The first release must include production-grade support for:

- website live chat
- API channel
- email

The remaining channels may initially ship through conformance-checked adapters backed by local or mock providers, provided the configuration flows, message lifecycle, inbox routing, and operator workflows are preserved.

### Major Resources Requiring API Compatibility

- accounts
- users
- inboxes
- contacts
- conversations
- messages
- labels
- canned responses
- macros
- automation rules
- reports

### Collaboration Requirements

- realtime conversation updates
- presence and collision avoidance where practical
- team assignment and reassignment
- internal notes and mentions
- bulk action surfaces
- agent activity visibility

### Benchmark-Critical Journeys

- create and configure inboxes
- receive and manage incoming conversations
- assign, tag, and prioritize conversations
- add internal notes and mention teammates
- use canned responses and macros
- apply automation rules and observe routed outcomes
- resolve, snooze, reopen, and report on conversations

## Product 3: Foundry

`Foundry` is the Appsmith-parity product.

### Purpose

Provide a multi-user internal app builder with a visual editor, runtime app pages, widgets, datasource connections, queries, JavaScript logic, environments, and deployment workflows.

### Required Parity Surface

- organizations or workspaces
- applications and pages
- editor/runtime split
- drag-and-drop canvas and layout system
- widget library
- datasource configuration
- queries and action execution
- JavaScript objects or equivalent embedded logic units
- widget bindings to queries and state
- page navigation, modals, tabs, and forms
- themes and styling
- table, chart, form, list, media, and layout widget families
- custom widget support
- environment and settings management
- version control and branching workflows
- deployment and share or publish workflows
- permissions and app-level access control

### Datasource and Integration Model

`Foundry` must use an adapter-first datasource layer.

Initial release must include production-grade support for:

- Postgres-compatible SQL source
- MySQL-compatible SQL source
- REST API datasource

The architecture must support additional database and API connectors, Git integration, and custom widget packaging without refactoring the editor/runtime model.

### Widget Requirement

`Foundry` must preserve the breadth of the frozen public widget model at the level of category and operator capability. The detailed widget matrix must be checked in as a product artifact before implementation closes, with every widget mapped to editor behavior, runtime behavior, bindings, and automated tests.

### Major Resources Requiring API Compatibility

- workspaces or organizations
- apps
- pages
- widgets
- datasources
- queries
- JavaScript objects
- branches or versions
- deployments
- permissions

### Collaboration Requirements

- concurrent editing safety for builder artifacts
- branch-aware collaboration and version history
- publish and rollback visibility
- shared app access and runtime permissions

### Benchmark-Critical Journeys

- create an app from scratch
- connect a datasource
- create and bind queries
- lay out widgets on a page
- build CRUD flows with table and form surfaces
- use JavaScript logic in builder workflows
- create and use custom widgets
- branch, publish, and view the runtime app

## Shared Security and Governance Requirements

- multi-tenant workspace isolation
- RBAC at workspace, product, and resource scope
- audit logs for sensitive actions
- secret storage for adapters and datasources
- configurable retention for attachments and audit history
- admin console for instance setup and governance

## Realtime Requirements

- all three products must expose a shared eventing model
- state changes must fan out to subscribed clients without full reloads
- audit and activity streams must be reconstructable from persisted events

## Testing Strategy

### Required Artifacts

- `docs/parity/altitude-feature-matrix.md`
- `docs/parity/switchboard-feature-matrix.md`
- `docs/parity/foundry-feature-matrix.md`
- API compatibility suites per product
- UI workflow suites per product
- shared platform tenancy and RBAC suites
- deterministic seed and reset fixtures per product

### Test Layers

1. schema and contract tests
2. service and domain tests
3. API compatibility tests
4. realtime collaboration tests
5. product UI workflow tests
6. browser QA benchmark smoke journeys against each owned product

## Delivery Order

Implementation order is fixed:

1. shared platform foundation
2. `Altitude`
3. `Switchboard`
4. `Foundry`
5. cross-product hardening and benchmark integration

Rationale:

- `Altitude` establishes the project/work-item, activity, attachments, and planning substrate.
- `Switchboard` adds channel routing, message realtime, assignment, and automation complexity.
- `Foundry` is the largest surface and depends on a stable shared platform plus mature realtime and permissions behavior.

## Phases

### Phase A: Frozen Parity Audit

Deliverables:

- checked-in feature matrix for each product
- navigation map for each product
- API resource matrix for each product
- adapter inventory and provider classification

Exit criteria:

- parity scope is frozen and implementation-testable

### Phase B: Shared Platform

Deliverables:

- auth, tenancy, RBAC, audit, files, search, jobs, realtime, admin

Exit criteria:

- platform acceptance tests pass for multi-workspace, invites, roles, audit, and realtime delivery

### Phase C: Altitude

Deliverables:

- project management product parity implementation

Exit criteria:

- frozen `Altitude` feature matrix passes

### Phase D: Switchboard

Deliverables:

- support workspace parity implementation

Exit criteria:

- frozen `Switchboard` feature matrix passes

### Phase E: Foundry

Deliverables:

- app-builder parity implementation

Exit criteria:

- frozen `Foundry` feature matrix passes

### Phase F: Benchmark Integration

Deliverables:

- deterministic seeds
- QA benchmark fixtures
- owned benchmark journeys wired into the platform

Exit criteria:

- the QA platform can run benchmark suites against all three owned products end to end

## Acceptance Criteria

- Three separate branded products exist and run on a shared platform.
- Each product has a checked-in frozen parity matrix and passes it.
- Shared platform tests pass for auth, tenancy, RBAC, audit, jobs, files, search, and realtime.
- Major-resource API compatibility tests pass for all three products.
- All benchmark-critical journeys can be seeded, reset, and exercised by the QA platform.
- No product depends on third-party production SaaS availability to serve as a benchmark target.

## References

Frozen public feature basis consulted on April 7, 2026:

- Appsmith overview and editor model: https://docs.appsmith.com/v/v1.1/third-party-services/github-login
- Appsmith widget surface: https://www.appsmith.com/widgets
- Plane docs overview: https://docs.plane.so/
- Plane API intro: https://developers.plane.so/api-reference/introduction
- Plane projects overview: https://developers.plane.so/api-reference/project/overview
- Plane cycles overview: https://developers.plane.so/api-reference/cycle-issue/overview
- Plane pages overview: https://developers.plane.so/api-reference/page/overview
- Chatwoot features overview: https://www.chatwoot.com/features
- Chatwoot shared inbox: https://www.chatwoot.com/features/shared-inbox/
- Chatwoot channels: https://www.chatwoot.com/features/channels/
- Chatwoot automations: https://www.chatwoot.com/features/automations
- Chatwoot API intro: https://developers.chatwoot.com/api-reference/introduction
