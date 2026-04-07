# Switchboard API Compatibility Matrix

## Purpose

`Switchboard` needs a frozen API and channel boundary for the Chatwoot-parity support workspace so inbox seeding, message routing, operator tooling, and channel adapters can be built against one durable contract.

## Major Resource Coverage

| Resource | Compatibility expectation | Notes |
| --- | --- | --- |
| accounts | Tenant bootstrap, settings, and identity-scoped administration APIs | The account boundary controls workspace-level support configuration. |
| users | Operator profiles, presence-ready identity data, and permission-aware reads | Users must remain distinct from end-customer contacts. |
| inboxes | CRUD, routing, channel binding, and ownership configuration APIs | Inboxes are the top-level operator work queues. |
| contacts | Durable external identity, profile enrichment, and merge-safe lookup APIs | Required for cross-channel support history. |
| conversations | Stateful lifecycle APIs for open, snoozed, resolved, and reopened work | Conversation state is the primary benchmarked resource. |
| messages | Threaded inbound and outbound message APIs with author metadata | Must support both human and automation-authored events. |
| labels | Tagging and filtering APIs for triage workflows | Supports queue management and reporting. |
| canned responses | Stored reply templates with operator-friendly retrieval | Needed for speed-oriented support workflows. |
| macros | Multi-action operator commands spanning routing, replies, and labels | Must remain automation-safe and auditable. |
| automation rules | Rule configuration and execution metadata APIs | Defines routing and state transitions without manual operator action. |
| reports | Reporting and summary endpoints for inbox, SLA, and operator performance | Frozen now so later analytics work has a stable target. |

## Channel Coverage

| Channel or adapter | Compatibility expectation | Freeze notes |
| --- | --- | --- |
| website live chat | Native realtime chat ingress with widget/session metadata | This is the first-class owned channel for benchmark runs. |
| API channel | Programmatic message ingress for synthetic and system-driven workloads | Enables deterministic fixture injection. |
| email | Async message threading, contact resolution, and outbound reply support | Must preserve conversation linkage across replies. |
| Facebook | Adapter-ready boundary for public social messaging | Freeze the domain contract even if the first adapter is deferred. |
| Instagram | Adapter-ready boundary for social direct messaging | Shares conversation semantics with other external channels. |
| LINE | Adapter-ready boundary for regional messaging support | Needs normalized contact and message payload mapping. |
| SMS | Phone-number-based messaging adapter boundary | Should map cleanly into conversations and assignments. |
| TikTok | Adapter-ready social messaging coverage | Keep the integration seam explicit for later channel packages. |
| X or Twitter | Adapter-ready public/support messaging coverage | Freeze naming and payload expectations before implementation. |
| voice or phone | Call-linked conversation records, events, and resolution metadata | The API boundary can begin with event summaries before full telephony. |

## Adapter Inventory Notes

- Channel adapters should normalize every inbound event into the shared accounts, inboxes, contacts, conversations, and messages resource model.
- Operator tooling depends on stable event payloads for macros, automation rules, and reports even when a public channel adapter is only partially implemented.
- The benchmark harness should be able to seed inboxes and drive conversation state without needing browser-only setup.
