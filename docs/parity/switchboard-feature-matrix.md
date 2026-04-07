# Switchboard Feature Matrix

## Purpose

`Switchboard` is the owned support-workspace benchmark target. This matrix freezes the Chatwoot-parity surface required for messaging, routing, and operator workflows before implementation starts.

## Required Parity Surface

- `Switchboard` must model accounts and workspace settings for tenant-level administration.
- Operators need inbox management as a first-class workflow.
- Administrators must be able to handle channel configuration across supported inbound sources.
- Support teams require contacts and contact profiles with durable identity and history.
- The messaging core is conversations and threaded messages.
- Work allocation must include assignments and teams.
- Internal collaboration must include private notes and mentions.
- Operator speed tools must include canned responses.
- Reusable action bundles must include macros.
- Routing and triage controls must include automation rules.
- Supervisors need activity and audit history for review and compliance.

## Channels

- Core production coverage must include website live chat.
- Programmatic inbound traffic must include API channel.
- Standard asynchronous support must include email.
- Messaging distribution must include WhatsApp.
- Messaging distribution must include Telegram.
- The channel model should leave room for additional public adapters without redefining the core conversation contract.

## Major Resources Requiring API Compatibility

- The API boundary covers accounts, users, inboxes, contacts, conversations, messages, assignments, teams, notes, labels, canned responses, macros, automation policies, reports, and audit entries.
- `Switchboard` must expose REST APIs and webhook surfaces for major resources so inbox seeding, channel automation, and benchmark instrumentation do not depend on manual setup.

## Collaboration Requirements

- Multiple operators must be able to review, assign, and update the same conversation set without losing state.
- Notes, mentions, and assignment changes must behave as shared workspace events rather than private local state.
- Reporting and audit views must preserve who changed routing, status, and ownership decisions.

## Benchmark-Critical Journeys

- create and configure inboxes for the supported support workspace
- receive and manage incoming conversations
- coordinate assignment, notes, and automation behavior during active work
- resolve, snooze, reopen, and report on conversations
