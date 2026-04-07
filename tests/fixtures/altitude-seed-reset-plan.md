# Altitude Seed and Reset Plan

`Altitude` needs deterministic seed data and a product-level reset hook so project-management benchmark journeys can run repeatedly against the same owned surface.

## Seed Data

- Seed one benchmark workspace with deterministic members, roles, and workspace settings.
- Seed one primary project plus a backlog project view for create workspace and project verification.
- Seed work item types, states, labels, priorities, estimates, and date presets needed to create and update work items.
- Seed view definitions so benchmarks can move work items across states and views without generating one-off metadata.
- Seed one active cycle and one future cycle to plan a cycle and attach work items.
- Seed module shells so benchmarks can group work into modules with stable identifiers.
- Seed one project knowledge space so the runner can create a wiki page linked to a project.
- Seed one attachment bucket with deterministic file metadata so benchmarks can attach a file to a work item.
- Seed one summary dashboard so the runner can inspect analytics or progress summaries after workflow mutations.

## Reset Workflow

- Invoke a workspace-scoped reset hook before each run to remove created records, rebuild the seeded planning graph, and restore deterministic identifiers.
- Recreate the canonical project, work item presets, cycle definitions, module shells, and wiki roots after the reset hook completes.
- Rehydrate attachment metadata and analytics snapshot inputs so generated summaries remain deterministic after every reset.
- Verify that seeded permissions and notification subscriptions match the baseline before the benchmark starts.

## Stable URLs

- Workspace landing URL for create workspace and project setup.
- Project backlog URL for create and update work items.
- Board or list view URL to move work items across states and views.
- Cycle planning URL to plan a cycle and attach work items.
- Module detail URL to group work into modules.
- Wiki URL to create a wiki page linked to a project.
- Work item detail URL to attach a file to a work item.
- Analytics URL to inspect analytics or progress summaries.

## Journey Coverage

- create workspace and project
- create and update work items
- move work items across states and views
- plan a cycle and attach work items
- group work into modules
- create a wiki page linked to a project
- attach a file to a work item
- inspect analytics or progress summaries

Each journey depends on deterministic seed data and a reset hook that returns `Altitude` to the same benchmark-ready state.
