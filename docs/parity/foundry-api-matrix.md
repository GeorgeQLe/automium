# Foundry API Compatibility Matrix

## Purpose

`Foundry` needs a frozen builder/runtime API contract before implementation because datasource orchestration, versioned app editing, publish flows, and custom extensibility all depend on stable resource boundaries.

## Major Resource Coverage

| Resource | Compatibility expectation | Notes |
| --- | --- | --- |
| workspaces or organizations | Top-level tenancy, settings, and membership-aware administration APIs | This is the root scope for all app-builder assets. |
| apps | Application CRUD, metadata, and editor bootstrap APIs | The core builder entry point must be scriptable. |
| pages | Page CRUD, ordering, navigation metadata, and runtime lookup APIs | Pages define both editor structure and runtime routing. |
| widgets | Widget tree CRUD, layout metadata, and property-binding APIs | The matrix freezes widget-level automation expectations. |
| datasources | Connection configuration, health, and permission-aware access APIs | Datasources need stable identifiers for seeded fixtures. |
| queries | Query CRUD, execution metadata, and binding-friendly result contracts | Queries anchor data-driven builder flows. |
| JavaScript objects | Embedded logic-unit APIs for reusable client-side behavior | These must be addressable as first-class builder resources. |
| branches or versions | Version-history, branch creation, comparison, and restore APIs | Collaboration depends on explicit version-aware contracts. |
| deployments | Publish, release metadata, and runtime-target APIs | Builder and runtime state must stay linked but distinct. |
| permissions | Editor, viewer, and runtime-consumer access control APIs | Permission semantics need to remain deterministic for benchmarks. |

## Datasource and Integration Coverage

| Datasource or adapter | Compatibility expectation | Freeze notes |
| --- | --- | --- |
| Postgres-compatible SQL source | Structured datasource config plus query execution and schema access | The first SQL benchmark path should target this contract. |
| MySQL-compatible SQL source | Structured datasource config plus query execution and schema access | Keep parameterization and connection metadata aligned with Postgres. |
| REST API datasource | HTTP request configuration, auth metadata, and response binding support | Needed for common app-builder integration flows. |
| Git integration | Branch-aware sync, import, or publish hooks for app definitions | Freeze the seam even if early implementations are minimal. |
| custom widget packaging | Registration, versioning, and runtime loading metadata for extensible widgets | Required to preserve the custom-widget parity boundary. |

## Builder Integration Notes

- The benchmark harness should be able to create apps, pages, widgets, datasources, and queries through APIs without relying on manual editor setup.
- Version-aware resources need stable references so branch comparisons and deployments can be reproduced in deterministic runs.
- Datasource adapters should normalize external connectivity behind one shared contract even when concrete transport implementations arrive later.
