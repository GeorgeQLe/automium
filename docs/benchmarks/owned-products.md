# Owned Product Benchmark Journeys

Phase 2 freezes the benchmark target around owned products so later platform and product work can reuse one deterministic fixture model instead of ad hoc benchmark setup.

## Owned Benchmark Journeys

### Altitude

`Altitude` benchmark coverage centers on these owned, benchmark-critical journeys:

- create workspace and project
- create and update work items
- move work items across states and views
- plan a cycle and attach work items
- group work into modules
- create a wiki page linked to a project
- attach a file to a work item
- inspect analytics or progress summaries

### Switchboard

`Switchboard` benchmark coverage centers on these owned, benchmark-critical journeys:

- create and configure inboxes
- receive and manage incoming conversations
- assign, tag, and prioritize conversations
- add internal notes and mention teammates
- use canned responses and macros
- apply automation rules and observe routed outcomes
- resolve, snooze, reopen, and report on conversations

### Foundry

`Foundry` benchmark coverage centers on these owned, benchmark-critical journeys:

- create an app from scratch
- connect a datasource
- create and bind queries
- lay out widgets on a page
- build CRUD flows with table and form surfaces
- use JavaScript logic in builder workflows
- create and use custom widgets
- branch, publish, and view the runtime app

## Deterministic Seed and Reset Requirements

- Every benchmark journey must start from deterministic fixtures that define tenant identity, seeded records, permissions, and integration credentials without relying on mutable external state.
- Every owned product needs stable URLs for the setup view, execution view, and verification view so benchmark runners can enter the same route shape on every run.
- Every seeded environment must expose reset hooks that rebuild the expected state between benchmark attempts without manual cleanup.
- Fixture builders must preserve deterministic fixtures for users, permissions, seeded content, attachments, and automation side effects so later product suites can share the same baseline.
- Seed workflows must produce automation-friendly identifiers, auditable timestamps, and predictable naming conventions for all benchmark-visible records.
- Reset behavior must clear cross-run mutations, replay any required seed data, and verify that the benchmark surface is ready before execution starts.

## Fixture Plan References

- [Altitude seed/reset plan](/home/georgeqle/projects/tools/dev/automium/tests/fixtures/altitude-seed-reset-plan.md) defines the seeded workspace, project, planning data, and stable URLs for `Altitude`.
- [Switchboard seed/reset plan](/home/georgeqle/projects/tools/dev/automium/tests/fixtures/switchboard-seed-reset-plan.md) defines inbox, contact, conversation, and automation reset hooks for `Switchboard`.
- [Foundry seed/reset plan](/home/georgeqle/projects/tools/dev/automium/tests/fixtures/foundry-seed-reset-plan.md) defines builder/runtime seeds, datasource state, and publish reset hooks for `Foundry`.
