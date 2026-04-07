# Altitude API Compatibility Matrix

## Purpose

`Altitude` needs a frozen API boundary for the Plane-parity surfaces that later domain packages, UI flows, benchmark seeds, and integrations will share. This matrix captures the major resources and the adapter shape expected around them before implementation begins.

## Major Resource Coverage

| Resource | Compatibility expectation | Notes |
| --- | --- | --- |
| workspaces | First-party CRUD API plus stable identifiers for deterministic setup | Includes workspace-level tenancy bootstrap and benchmark fixture ownership. |
| projects | CRUD, membership-aware reads, and lifecycle transitions | Project creation must be scriptable for benchmark setup. |
| work items | Full create/read/update/list flows with filtering and state changes | This is the primary workload surface for the product. |
| work item types | Configurable type metadata and validation-friendly lookup APIs | Required for fixture-safe issue, task, and bug modeling. |
| cycles | Planning-period CRUD and assignment APIs | Needed for planning and progress workflows. |
| modules | Delivery grouping APIs with project scoping | Supports roadmap and milestone grouping. |
| comments or activity entries | Shared collaboration feed endpoints and append-only audit semantics | The benchmark boundary should preserve timeline visibility for teams. |
| pages | Wiki or document CRUD with project-aware routing | Supports knowledge capture in parity workflows. |
| attachments | Upload, metadata lookup, association, and download APIs | Fixtures must be able to attach and verify files deterministically. |
| members and roles | Membership, permission lookup, and role mutation APIs | Must support project-aware access boundaries. |

## Adapter Inventory

| Adapter surface | Expected role in `Altitude` | Freeze notes |
| --- | --- | --- |
| source control | Import, link, or reference project state from external code systems | Keep adapter seams explicit even if the first implementation is stubbed. |
| chat | Send notifications or deep links into surrounding communication tools | Adapter contract should expose stable event payloads. |
| alerts | Publish due-date, assignment, and workflow alerts | Keep this separate from in-product notifications so automation remains testable. |
| webhooks | Outbound event delivery for major resource changes | Webhooks are required for integration-safe automation and benchmark instrumentation. |

## Benchmark Integration Notes

- The seeded benchmark environment should be able to create workspaces, projects, and work items entirely through API calls.
- Resource identifiers need to remain stable enough for downstream automation to bind work item activity, attachments, and planning entities without UI scraping.
- Adapter boundaries should stay narrow so early shared-platform work can implement first-party storage before external integrations are fully productized.
