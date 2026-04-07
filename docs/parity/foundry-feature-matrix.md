# Foundry Feature Matrix

## Purpose

`Foundry` is the owned internal app-builder benchmark target. This matrix freezes the Appsmith-parity surface for builder, runtime, publishing, and integration workflows before platform code is implemented.

## Required Parity Surface

- The tenancy model must support organizations or workspaces.
- Builder assets must include applications and pages.
- The product must preserve an editor/runtime split so authoring and published execution remain distinct.
- Authoring must center on a drag-and-drop canvas and layout system.
- UI construction must include a widget library.
- External data access must include datasource configuration.
- App logic must support queries and action execution.
- Builder extensibility must include JavaScript objects or equivalent embedded logic units.
- Dynamic UI behavior must support widget bindings to queries and state.
- Navigation and interaction flows must cover page navigation, modals, tabs, and forms.
- Extensibility must include custom widget support.
- Team development must include version control and branching workflows.
- Release management must include deployment and share or publish workflows.

## Datasource and Integration Model

- `Foundry` must support first-party datasource connections, external APIs, and execution paths that can be seeded deterministically for benchmark runs.
- Datasource, query, and publish operations need stable identifiers and automation hooks so fixtures can reproduce both builder and runtime states.

## Widget Requirement

- Widgets must be configurable, bindable, and composable within page layouts, including standard table, form, button, modal, navigation, and chart surfaces.
- The widget system must support reusable composition patterns and the extension path needed for custom widget support.

## Major Resources Requiring API Compatibility

- The API boundary covers organizations, applications, pages, widgets, datasources, queries, JavaScript logic units, bindings, branches, deployments, permissions, and publish metadata.
- API access must support deterministic benchmark setup for builder state, runtime state, publishing, and datasource orchestration.

## Collaboration Requirements

- Teams must be able to collaborate on builder assets, branching decisions, and publish flows without ambiguity about the active version.
- Permissioning should distinguish editors, viewers, and runtime consumers while preserving predictable benchmark fixtures.
- Collaboration history must make branch, deployment, and datasource changes auditable during shared work.

## Benchmark-Critical Journeys

- create an app from scratch
- connect a datasource
- build a page with bound widgets, actions, and navigation
- create and use custom widgets
- branch, publish, and view the runtime app
