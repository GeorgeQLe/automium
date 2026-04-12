# Current Phase: Switchboard

This file tracks the active work for Phase 5 from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). Prior phases are archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- Phase 4 Altitude parity product is complete and archived in [tasks/phases/phase-4.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-4.md).
- Step 5.1 red-phase Switchboard contract tests are complete. The existing repository baseline remains green at 27 passing files / 99 passing tests, while the remaining Switchboard suites intentionally fail on missing Phase 5 implementation modules.
- Step 5.2 Switchboard scaffold is complete. The focused domain contract is green at 1 passing file / 6 passing tests, and the existing repository baseline remains green at 27 passing files / 99 passing tests.
- Step 5.3 Switchboard operational resource modules are complete. The implemented Switchboard scope is green at 4 passing files / 21 passing tests, and the existing Phase 1-4 baseline remains green at 27 passing files / 99 passing tests.
- Step 5.4 Switchboard channel modules are complete. Native website/API/email channels, public channel adapter boundaries, and webhook event normalization are green with the implemented Switchboard scope at 5 passing files / 27 passing tests. The existing Phase 1-4 baseline remains green at 27 passing files / 99 passing tests. The Step 5.5 seed/benchmark suite remains intentionally red on missing modules for the next implementation step.
- Next automated step: Step 5.5.
- Known manual blockers: none for Phase 5.

## Phase 5: Switchboard

Goal: deliver the second owned parity product, `Switchboard`, as the Chatwoot-parity support workspace and realtime messaging benchmark surface.

> Test strategy: tdd

### Tests First

- [x] Step 5.1: **Automated** Write failing API, adapter, and UI workflow tests in `apps/switchboard/tests/`, `packages/adapters/tests/switchboard/`, and `tests/integration/switchboard/` for inboxes, channels, contacts, conversations, assignments, notes, canned responses, macros, automation, and reporting.
  - Files: create `apps/switchboard/tests/switchboard-domain.contract.test.ts`, `apps/switchboard/tests/switchboard-api.contract.test.ts`, `apps/switchboard/tests/switchboard-conversations.contract.test.ts`, `apps/switchboard/tests/switchboard-automation.contract.test.ts`, `apps/switchboard/tests/switchboard-channels.contract.test.ts`, `tests/integration/switchboard/switchboard-benchmark-journeys.contract.test.ts`
  - Tests cover: account/user/inbox/channel/contact/conversation/message/team/assignment/note/label/canned-response/macro/automation/report domain shapes, API route manifest completeness, core channel contracts for website live chat/API/email, adapter-ready public channel boundaries, realtime conversation and assignment events, automation and macro execution contracts, reporting summaries, deterministic seed/reset hooks, and benchmark route definitions

### Implementation

- [x] Step 5.2: **Automated** Scaffold `apps/switchboard/` and any supporting channel, messaging, and automation modules needed for the support workspace surface.
  - Files: create `apps/switchboard/package.json`, `apps/switchboard/tsconfig.json`, `apps/switchboard/src/switchboard-constants.ts`, `apps/switchboard/src/switchboard-domain.ts`, `apps/switchboard/src/index.ts`
  - Constants include: conversation statuses, priorities, channel types, message directions/types, assignment statuses, automation trigger/action types, report metrics, realtime topics, webhook events
  - Domain interfaces include: Account, User, Team, Inbox, ChannelConfig, Contact, Conversation, Message, Assignment, Note, Label, CannedResponse, Macro, AutomationRule, ReportSummary, SwitchboardRealtimeEvent, SwitchboardApiRoute, SwitchboardBenchmarkRoute
- [x] Step 5.3: **Automated** Implement accounts, inboxes, contacts, conversations, threaded messages, teams, assignments, labels, notes, canned responses, macros, automation rules, reporting, realtime events, and major-resource APIs for `Switchboard`.
  - Files: create `apps/switchboard/src/switchboard-accounts.ts`, `apps/switchboard/src/switchboard-users.ts`, `apps/switchboard/src/switchboard-teams.ts`, `apps/switchboard/src/switchboard-inboxes.ts`, `apps/switchboard/src/switchboard-contacts.ts`, `apps/switchboard/src/switchboard-conversations.ts`, `apps/switchboard/src/switchboard-messages.ts`, `apps/switchboard/src/switchboard-assignments.ts`, `apps/switchboard/src/switchboard-notes.ts`, `apps/switchboard/src/switchboard-labels.ts`, `apps/switchboard/src/switchboard-canned-responses.ts`, `apps/switchboard/src/switchboard-macros.ts`, `apps/switchboard/src/switchboard-automation.ts`, `apps/switchboard/src/switchboard-reports.ts`, `apps/switchboard/src/switchboard-realtime.ts`, `apps/switchboard/src/switchboard-api-routes.ts`
  - Files: modify `apps/switchboard/src/index.ts` to re-export all modules
- [x] Step 5.4: **Automated** Implement production-grade support for website live chat, API channel, and email, plus adapter-backed operator flows for the remaining public channel categories.
  - Files: create `apps/switchboard/src/switchboard-channels.ts`, `apps/switchboard/src/switchboard-channel-adapters.ts`, `apps/switchboard/src/switchboard-webhooks.ts`
  - Native channel factories cover website live chat session metadata, API channel ingest payloads, and email threading metadata
  - Adapter contracts cover WhatsApp, Facebook, Instagram, Telegram, LINE, SMS, TikTok, X/Twitter, and voice/phone event normalization into contacts, conversations, and messages
  - Files: modify `apps/switchboard/src/index.ts` to re-export channel modules
- [ ] Step 5.5: **Automated** Add deterministic seeds, reset hooks, and benchmark-friendly routes for the `Switchboard` benchmark-critical journeys.
  - Files: create `apps/switchboard/src/switchboard-seed.ts`, `apps/switchboard/src/switchboard-benchmark-routes.ts`
  - Seed covers one account, operators, supervisor, teams, core channels, inbox defaults, contacts, conversation starters, message payloads, labels, SLA metadata, triage states, collaborator identities, canned responses, macros, automation rules, open and historical conversations, and reporting snapshot
  - Routes cover inbox administration, conversation list, active conversation, notes/collaboration, operator shortcuts, automation rules, and reporting URLs
  - Files: modify `apps/switchboard/src/index.ts` to re-export seed and route modules

### Green

- [ ] Step 5.6: **Automated** Make the `Switchboard` suites pass and verify that owned conversation-routing benchmarks run end to end with realtime updates and stable fixtures.

### Milestone

Acceptance criteria:

- The frozen `Switchboard` feature matrix passes.
- Major-resource API compatibility tests pass for `Switchboard`.
- Realtime conversation, assignment, notes, and inbox-routing behavior works under shared platform constraints.
- Core channel support works end to end for website live chat, API, and email.
- All Phase 5 tests pass.
- No regressions occur in Phases 1-4 suites.

## Next Step Plan

Step 5.5 adds deterministic Switchboard seed/reset state and benchmark-friendly route definitions. Keep this work scoped to stable fixtures and URLs for benchmark-critical journeys; Step 5.6 will be the full green verification sweep after the seed and routes exist.

- Commands to run:
  - `pnpm exec vitest run tests/integration/switchboard/switchboard-benchmark-journeys.contract.test.ts`
  - Expect this Step 5.5 suite to pass after implementation.
  - Re-run `pnpm exec vitest run apps/switchboard/tests/switchboard-domain.contract.test.ts apps/switchboard/tests/switchboard-api.contract.test.ts apps/switchboard/tests/switchboard-conversations.contract.test.ts apps/switchboard/tests/switchboard-automation.contract.test.ts apps/switchboard/tests/switchboard-channels.contract.test.ts tests/integration/switchboard/switchboard-benchmark-journeys.contract.test.ts` to confirm all Phase 5 Switchboard suites pass together.
  - Re-run `pnpm exec vitest run packages apps/admin-console apps/altitude tests/integration/altitude tests/planning` to confirm the existing 27 files / 99 tests remain green.
- Files to create:
  - `apps/switchboard/src/switchboard-seed.ts`
  - `apps/switchboard/src/switchboard-benchmark-routes.ts`
- Files to modify:
  - `apps/switchboard/src/index.ts`
- Implementation expectations:
  - `switchboard-benchmark-routes.ts` should export `SWITCHBOARD_BENCHMARK_ROUTES` with 7 stable routes whose ids are exactly `["inbox-administration", "conversation-list", "active-conversation", "notes-collaboration", "operator-shortcuts", "automation-rules", "reporting"]`.
  - Each benchmark route should have a `/switchboard/` path, a user-facing `name`, and non-empty `requiredSeedKeys`.
  - `switchboard-seed.ts` should expose `seedSwitchboardBenchmarkEnvironment()`, `resetSwitchboardBenchmarkEnvironment()`, and `verifySwitchboardBenchmarkSeed(env)`.
  - The seed should use deterministic IDs and existing Switchboard factories for one account, at least two operators, one supervisor, teams, website/API/email channels, at least three inboxes, contacts, open and historical conversations, messages, labels, canned responses, macros, automation rules, and a report summary.
  - Include benchmark-critical metadata needed for inbox administration, conversation list unread counts, active conversation state, notes/collaboration, operator shortcuts, automation rules, SLA/triage state, collaborator identities, and reporting.
  - `resetSwitchboardBenchmarkEnvironment()` should rebuild the same deterministic state as `seedSwitchboardBenchmarkEnvironment()`, preserving account ID, conversation IDs, and report metrics across calls.
  - `verifySwitchboardBenchmarkSeed(env)` should return `{ ready, checked, errors }`, with checks including `unread-counts`, `assignee-state`, `automation-rules`, and `report-summary`.
  - Update the Switchboard barrel to re-export seed and benchmark route modules.
