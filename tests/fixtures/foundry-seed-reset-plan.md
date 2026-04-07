# Foundry Seed and Reset Plan

`Foundry` needs deterministic builder and runtime fixtures plus a publish-aware reset hook so app-builder benchmarks can exercise the same authored state every time.

## Seed Data

- Seed one workspace with deterministic editors, viewers, and runtime consumers.
- Seed one starter application shell and page graph to create an app from scratch from a known baseline.
- Seed datasource credentials, mock endpoints, and schema metadata to connect a datasource.
- Seed query templates, action permissions, and sample bindings to create and bind queries.
- Seed page layout regions, navigation state, and widget defaults to lay out widgets on a page.
- Seed table, form, and mutation fixtures to build CRUD flows with table and form surfaces.
- Seed JavaScript object templates and event handlers to use JavaScript logic in builder workflows.
- Seed one custom widget package and registry entry to create and use custom widgets.
- Seed branch and deployment metadata to branch, publish, and view the runtime app.

## Reset Workflow

- Invoke a workspace-scoped reset hook before each run to clear builder mutations, transient queries, published snapshots, and runtime caches.
- Recreate the canonical app shell, datasource bindings, widget tree, and branch metadata after the reset hook finishes.
- Republish the baseline runtime snapshot so published URLs and runtime content remain deterministic.
- Verify that datasource credentials, sample rows, and publish status all match the frozen fixture contract before execution begins.

## Stable URLs

- Builder home URL to create an app from scratch.
- Datasource configuration URL to connect a datasource.
- Query editor URL to create and bind queries.
- Page builder URL to lay out widgets on a page.
- CRUD workspace URL to build CRUD flows with table and form surfaces.
- Logic editor URL to use JavaScript logic in builder workflows.
- Custom widget management URL to create and use custom widgets.
- Branch and publish URL to branch, publish, and view the runtime app.

## Journey Coverage

- create an app from scratch
- connect a datasource
- create and bind queries
- lay out widgets on a page
- build CRUD flows with table and form surfaces
- use JavaScript logic in builder workflows
- create and use custom widgets
- branch, publish, and view the runtime app

Each journey depends on deterministic builder/runtime fixtures and a reset hook that restores `Foundry` to the same publish-ready state.
