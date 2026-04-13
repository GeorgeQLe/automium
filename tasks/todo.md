# Current Phase: Complete

This file tracks active execution work from [tasks/roadmap.md](/home/georgeqle/projects/tools/dev/automium/tasks/roadmap.md). All roadmap phases are complete and archived in [tasks/phases/](/home/georgeqle/projects/tools/dev/automium/tasks/phases/).

## Active Task: Spec Drift Fix All

Goal: reconcile the specs with the completed implementation and produce an audit trail without changing production code.

### Plan

- [x] Inventory spec claims in `specs/agent-native-browser-qa-platform.md` and `specs/owned-parity-benchmark-products.md`.
- [x] Verify claims against implemented apps, packages, fixtures, docs, and tests.
- [x] Identify divergences, unimplemented claims, removed claims, and significant undocumented public surfaces.
- [x] Update specs only for completed behavior that is missing or stale, and add follow-up todos for unresolved work.
- [x] Write `specs/drift-report.md` with verified, resolved, deferred, and remaining findings.
- [x] Run documentation checks plus TypeScript/Vitest verification.
- [x] Commit and push intended changes to `master`.

### Deferred Spec-Drift Follow-Up

- [ ] Production browser engine: implement executable HTML/CSS/JS parsing, layout, event/input dispatch, and semantic graph generation beyond the current engine state and interactive-element contract.
- [ ] Production orchestration: deploy real worker pools, queue transports, concurrency controls, telemetry persistence, and tenant quota enforcement beyond the current domain contracts.
- [ ] Production persistence and infrastructure adapters: wire Postgres, object storage, job queues, realtime transports, and search backends behind the checked-in shared platform contracts.
- [ ] Credential and secret vault integration: replace current seed `secretRef` metadata and policy placeholders with scoped runtime secret retrieval.
- [ ] Product UI workflow layer: add deployed browser UIs and browser-driven UI workflow suites for `Altitude`, `Switchboard`, and `Foundry` instead of only domain/contract/integration tests.
- [ ] Operator surface hardening: add explicit command palette/global action support, help-center/self-service flows, presence/collision handling, and bulk action surfaces where still represented only by specs or parity matrices.

## Current Status

- Phase 1 benchmark foundation reset is complete and archived in [tasks/phases/phase-1.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-1.md).
- Phase 2 frozen parity audit and benchmark target design is complete and archived in [tasks/phases/phase-2.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-2.md).
- Phase 3 shared multi-tenant product platform is complete and archived in [tasks/phases/phase-3.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-3.md).
- Phase 4 Altitude parity product is complete and archived in [tasks/phases/phase-4.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-4.md).
- Phase 5 Switchboard parity product is complete and archived in [tasks/phases/phase-5.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-5.md).
- Phase 6 Foundry parity product is complete and archived in [tasks/phases/phase-6.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-6.md).
- Phase 7 agent browser runtime and platform integration is complete and archived in [tasks/phases/phase-7.md](/home/georgeqle/projects/tools/dev/automium/tasks/phases/phase-7.md).
- Final Phase 7 suite: `pnpm exec vitest run apps/control-plane/tests apps/replay-console/tests packages/engine/tests packages/runtime/tests packages/executor/tests packages/artifacts/tests packages/orchestrator/tests packages/journey-compiler/tests packages/vision/tests packages/policies/tests tests/e2e/alpha` passes at 11 files / 23 tests.
- Final Phase 1-6 baseline: `pnpm exec vitest run packages/contracts/tests packages/benchmark/tests packages/realtime/tests packages/jobs/tests packages/auth/tests packages/tenancy/tests packages/rbac/tests packages/search/tests packages/files/tests packages/audit/tests apps/admin-console/tests apps/altitude/tests apps/switchboard/tests apps/foundry/tests tests/integration/altitude tests/integration/switchboard tests/integration/foundry tests/planning` passes at 40 files / 169 tests.
- Workspace TypeScript passes with `pnpm exec tsc --noEmit`.
- Known manual blockers: none.

## Priority Documentation Todo

- [x] `$pack install devtool` - verified `.agents/project.json` declares `project_type: "devtool"` with `enabled_packs: ["devtool"]`, and `pack status` confirms the local Claude/Codex devtool skill links exist.
- [x] `$devtool-user-map` - created `research/devtool-user-map.md` using the installed `devtool-user-map` skill.
- [ ] `$devtool-integration-map` - create `research/devtool-integration-map.md` using the installed `devtool-integration-map` skill.
- [ ] `$devtool-dx-journey` - create `research/devtool-dx-journey.md` using the installed `devtool-dx-journey` skill.
- [ ] `$devtool-adoption` - create `research/devtool-adoption.md` using the installed `devtool-adoption` skill.
- [ ] `$devtool-positioning` - create `research/devtool-positioning.md` using the installed `devtool-positioning` skill.
- [ ] `$devtool-monetization` - create `research/devtool-monetization.md` using the installed `devtool-monetization` skill.
- [x] `$spec-drift fix all` - reconciled specs against implementation because `specs/agent-native-browser-qa-platform.md` and `specs/owned-parity-benchmark-products.md` were last updated on 2026-04-07, while the implementation and phase archives were completed through 2026-04-13.

## Review

Step 7.7 completed the final integrated-platform verification sweep. The QA platform can compile, execute, replay, and benchmark journeys across `Altitude`, `Switchboard`, `Foundry`, and the owned support fixture without relying on third-party benchmark apps.

`$devtool-user-map` completed the developer-facing audience map for Automium, covering primary developer users, secondary users, economic buyers, champions, maintainers, operational stakeholders, high-value use cases, adoption blockers, adoption sequencing, persona messaging, and open research questions.

`$spec-drift fix all` completed the spec-to-code reconciliation pass. The drift report recorded 29 verified claims, 0 unresolved errors, 6 deferred production-hardening warnings, and 5 resolved documentation drift items. The specs now document the current contract/domain implementation status, exact planner intent tokens, owned benchmark corpus scope, product route-manifest coverage, deterministic seed/reset surfaces, and explicit hardening follow-ups.

- Validation:
  - `test -f specs/drift-report.md`
  - `rg -n "Current Repository Implementation Status|Benchmark Corpus Current Scope|press-key|wait-for-condition|Production hardening|Spec Drift Report|Deferred Warnings|Verified Claims" specs tasks`
  - `pnpm test:run` passes at 51 files / 192 tests.
  - `test -f research/devtool-user-map.md`
  - `rg -n "Primary Developer Users|Economic Buyers|Champions|Maintainers And Contributors|Operational Stakeholders|Adoption Blockers" research/devtool-user-map.md`
  - `pnpm exec vitest run apps/control-plane/tests apps/replay-console/tests packages/engine/tests packages/runtime/tests packages/executor/tests packages/artifacts/tests packages/orchestrator/tests packages/journey-compiler/tests packages/vision/tests packages/policies/tests tests/e2e/alpha` passes at 11 files / 23 tests.
  - `pnpm exec vitest run packages/contracts/tests packages/benchmark/tests packages/realtime/tests packages/jobs/tests packages/auth/tests packages/tenancy/tests packages/rbac/tests packages/search/tests packages/files/tests packages/audit/tests apps/admin-console/tests apps/altitude/tests apps/switchboard/tests apps/foundry/tests tests/integration/altitude tests/integration/switchboard tests/integration/foundry tests/planning` passes at 40 files / 169 tests.
  - `pnpm exec tsc --noEmit` passes.
- Warnings: none emitted by the validation commands.

## Next Action

- [ ] Run `$devtool-integration-map` from the priority documentation queue.

### Next Step Implementation Plan

1. Read the `devtool-integration-map` skill instructions and the core product context in `specs/agent-native-browser-qa-platform.md`, `specs/owned-parity-benchmark-products.md`, `tasks/phases/phase-7.md`, and the implemented app/package boundaries.
2. Create `research/devtool-integration-map.md` covering planner integrations, owned benchmark products, runtime/control-plane APIs, artifacts/replay, policy/governance, and potential downstream platform integrations.
3. Update this file and `tasks/history.md` with the completed research artifact, then run lightweight documentation validation before committing and pushing to `master`.
