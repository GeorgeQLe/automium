# Switchboard Seed and Reset Plan

`Switchboard` needs deterministic support-workspace fixtures and a routing-safe reset hook so operator benchmarks always see the same inbox and conversation state.

## Seed Data

- Seed one account with deterministic operators, supervisors, teams, and permissions.
- Seed supported channels, credential placeholders, and inbox defaults needed to create and configure inboxes.
- Seed known contacts, conversation starters, and message payloads to receive and manage incoming conversations.
- Seed labels, SLA metadata, and triage states to assign, tag, and prioritize conversations.
- Seed collaborator identities and mentionable users so operators can add internal notes and mention teammates.
- Seed canned response libraries and macro definitions to use canned responses and macros.
- Seed automation policies, assignment targets, and routing fixtures to apply automation rules and observe routed outcomes.
- Seed open and historical conversations so the workspace can resolve, snooze, reopen, and report on conversations.

## Reset Workflow

- Invoke an account-scoped reset hook before each run to clear mutated conversations, assignments, notes, automations, and reporting counters.
- Recreate the canonical inbox, contact, and conversation fixtures immediately after the reset hook so channel state is deterministic.
- Replay automation seeds and canned-response catalogs to keep routing and operator shortcuts identical across runs.
- Verify unread counts, assignee state, and report snapshots before execution begins.

## Stable URLs

- Inbox administration URL to create and configure inboxes.
- Conversation list URL to receive and manage incoming conversations.
- Active conversation URL to assign, tag, and prioritize conversations.
- Notes and collaboration URL to add internal notes and mention teammates.
- Operator shortcuts URL to use canned responses and macros.
- Automation rules URL to apply automation rules and observe routed outcomes.
- Reporting URL to resolve, snooze, reopen, and report on conversations.

## Journey Coverage

- create and configure inboxes
- receive and manage incoming conversations
- assign, tag, and prioritize conversations
- add internal notes and mention teammates
- use canned responses and macros
- apply automation rules and observe routed outcomes
- resolve, snooze, reopen, and report on conversations

Each journey depends on deterministic fixtures and a reset hook that restores the support workspace to the same operator-visible baseline.
