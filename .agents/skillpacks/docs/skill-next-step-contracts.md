# Skill Next-Step Contracts

> Audit date: 2026-04-20
> Scope: 205 `SKILL.md` files under `base/` and `packs/`
> Purpose: define when a skill may recommend another skill, when it must say there is no valid follow-up, and how multi-state outputs choose the next step.

## Summary

Recommended next steps are valid only when they match the skill's current end state and all prerequisites for the recommended skill can be satisfied from the project state.

This audit checked:

- Every command-style skill reference in `SKILL.md` files resolves to an existing skill name.
- Next-step guidance does not recommend a command before its prerequisite artifact exists.
- Multi-state skills document a valid recommendation for each expected end state.
- Research/spec outputs either end with `## Next Steps` or explicitly explain why no follow-up skill exists.
- Downstream-impact recommendations are based on an actual impact classification, not a speculative one.

## Universal Rules

1. A recommended skill must exist in the active platform or pack context. Base skills are valid from any pack. Pack skills are valid only when that pack is installed or the text explicitly says to install it first.
2. A recommendation must name the artifact or condition that makes it valid, for example `research/icp.md exists`, `specs/` is empty, or `tasks/roadmap.md exists`.
3. If a skill has multiple end states, recommendation logic must branch by end state. A single "always recommend" command is invalid when any state makes that command premature or misleading.
4. If no useful follow-up exists, the valid recommendation is `No follow-up skill recommended` with a short reason. Do not invent work to keep the chain going.
5. If a recommendation depends on downstream impact, the skill must first classify impact as `None`, `Minor`, or `Major`. `Major` may recommend `reconcile-research`; `Minor` may annotate stale suggestions; `None` should not mention reconciliation.
6. Experiment result branches belong in `## Decision Rules` until results exist. A newly designed experiment's current next step is to run the experiment.
7. Human, one-time future, and recurring obligations must follow the task classification rules in the writing skill: `tasks/manual-todo.md`, `tasks/record-todo.md`, or `tasks/recurring-todo.md` as appropriate, not unconditional current `tasks/todo.md` work.
8. Default AFPS business-product route: `customer-discovery -> competitive-analysis -> journey-map -> positioning -> user-flow-map -> state-model [topic] (optional sibling) -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation] -> user-flow-map --prototype-build-plan [topic] -> logic-wiring -> uat --variant-evaluation -> consolidate-prototypes -> research-roadmap --post-prototype -> spec-interview -> research-roadmap --post-spec -> roadmap`. `state-model` is an orthogonal sibling that authors the flow-anchored logical domain model (entities, state machines, events, logical contracts) once before variation work; it attaches the model per user-flow branch via `branches[].model_ref` (the primary flow-tree write) plus an optional top-level `model_tree_ref` back-compat pointer, and never alters the flow-tree `route` array, so it is recommended-but-skippable, not a route enum member. `consolidate-prototypes` writes AFPS graduation under `design/` after MVP approval; readiness requires recorded UAT evidence plus explicit handling of unbuilt/deferred approved branches as excluded from MVP, deferred from MVP, build/evaluate first, or spec-only references. A single-variant MVP requires the user's explicit convergence choice and explicit handling of all other approved branches. Before any terminal handoff names `consolidate-prototypes`, the producing skill must emit Handoff Verification from `design/**/flow-tree-*.yaml`, `research/**/uat-variant-evaluation-*.md`, and `tasks/manual-todo.md`, classified as `continue-design-branch`, `manual-uat-needed`, `single-variant-convergence-needs-explicit-scope`, or `ready-for-consolidation`; contradictory artifacts conservatively route to manual UAT or the next unresolved approved branch, never consolidation. `research/.progress.yaml` must not be used for UAT/prototype/consolidation readiness because it tracks product paths/product lines only. `research-roadmap --post-prototype` reads that document and queues only contradicted, stale, or pre-spec-blocking research. Optional research/framework detours are allowed only when their trigger would change positioning, product-loop direction, flow/design shape, or prototype choices. `ui-interview --requirements-only` and `ux-variations --layout-mode` remain valid only as explicit bounded detours when a fixed content/data/action contract and layout-only alternatives are needed.

## Optional AFPS Research Trigger Map

`journey-map` owns the first broad lifecycle pass. When it exposes a blocking optional research trigger, route to the existing framework owner instead of inventing a new skill:

| Trigger surfaced by journey-map | Existing framework owner | Routing rule |
| --- | --- | --- |
| Weak or disputed jobs/pains/gains, aha moment, or solution-customer fit | `value-prop-canvas` | Optional Strategyzer-style detour before positioning/UX. |
| Material revenue, channel, cost, defensibility, or unfair-advantage uncertainty | `lean-canvas` | Optional Ash Maurya Lean Canvas detour before UX/prototype work. |
| Signup, activation, first-success, evaluation, payment, retention, expansion, or instrumentation risk | `onboarding-map`, `conversion-map`, `transaction-map`, `retention-map`, `expansion-map`, or `lifecycle-metrics` | Use the most specific customer-lifecycle stage skill, not the full journey map again. |
| Consumer/PLG repeat-use value depends on habit formation, engagement loops, retention triggers, saved state, social rewards, or investment compounding | `hook-model` | Conditional pre-UX business-growth detour. If `business-growth` is unavailable, recommend `npx skillpacks install business-growth` first. |
| Enterprise, infrastructure, transactional, procurement-driven, or naturally infrequent use needs retention clarity | `lifecycle-metrics` or `metrics` | Do not force `hook-model`; prefer lifecycle measurement or the broader success metrics framework. |
| Pricing gates, packaging, free-to-paid timing, acquisition channel, launch path, or early traction mechanism changes the product direction | `monetization` or `gtm` | Use business-growth only when the journey evidence makes pricing/GTM a blocker before UX/prototype choices. |

`hook-model` is not mandatory and is not a post-spec default. It is a product-loop design input before UX/prototype choices harden, only when repeat behavior is central to product value.

## Fork Detection Convention

When a research skill's alignment page responses or findings indicate divergent products, ICPs, or value wedges that cannot coexist in a single path, the skill should suggest `/fork-idea-branch` as an alternative next step. This applies when: (a) the alignment page's assumptions/confidence gate reveals distinct ICP hypotheses requiring separate validation, (b) competitive analysis or positioning evidence shows the concept serves fundamentally different markets, or (c) the user's feedback explicitly identifies a split. Skills with ICP, positioning, or market-structure evidence should add a conditional to their next-step routing: "If alignment page evidence or user feedback indicates divergent products/ICPs/value wedges, suggest `/fork-idea-branch --from {skill-name}`."

## Expected End States

| Skill family | Expected end states | Valid next-step contract |
| --- | --- | --- |
| Base planning/execution (`idea-scope-brief`, `user-flow-map`, `spec-interview`, `ux-variations`, `ui-interview`, `logic-wiring`, `consolidate-prototypes`, `roadmap`, `plan-phase`, `run`, `ship`, `ship-end`) | Concept needed, flow map needed, UX branches needed, branch UI review needed, prototype build plan needed, variant evaluation needed, prototype needed, execution ready, shipping ready, next phase ready, mode unset | Use mode-aware routing from `docs/operating-modes.md`: `claude-only` stays on Claude, `codex-only` stays on Codex, `hybrid` delegates from Claude to Codex, unset presents all viable paths. For user-facing product work, idea scope brief precedes customer discovery when no concept brief, downstream research, or specs exist; the canonical pipeline after positioning is: user-flow-map -> state-model [topic] (optional logical-model sibling) -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation] -> user-flow-map --prototype-build-plan [topic] -> logic-wiring -> uat --variant-evaluation -> consolidate-prototypes -> research-roadmap --post-prototype -> spec-interview -> research-roadmap --post-spec -> roadmap. Built UI variants must route through logic-wiring and UAT/evaluation evidence before `consolidate-prototypes`; consolidation is valid only after UAT evidence exists and every approved unbuilt/deferred branch has an explicit user decision: exclude/defer from MVP, build/evaluate first, or include as spec-only. Single-variant MVP convergence requires the user's explicit scope choice. `spec-interview` requires the consolidated prototype, AFPS graduation or equivalent readiness evidence, and no unchecked blocking post-prototype cleanup items. |
| Base audits/reviews (`debug`, `investigate`, `trace`, `session-triage`, `affected`, `dead-code`, `slim-audit`, `expert-review`, `regression-check`, `spec-drift`, `reconcile-dev-docs`, `hygiene`) | Findings, no findings, fix required, blocked | Recommend the smallest skill that can address the highest-severity finding. If no findings remain, say no follow-up or point to the appropriate roadmap/status skill only when lifecycle work remains. |
| Base project operations (`sync`, `deploy`, `release`, `decommission`, `migrate`, `scaffold`, `pack`, `provision-agentic-config`, `commit-and-push-by-feature`, `handoff`, `guide`, `uat-guide`, `analyze-sessions`) | Completed, blocked, needs confirmation, no-op | Next step must be an operational continuation of the completed state. Confirmation-only states must ask for confirmation, not recommend an automatic command. |
| Kanban variants | Card created, moved, blocked/punted, done, board unavailable | Recommend the next same-platform kanban variant when board state can advance. If board tooling is unavailable, use the documented non-kanban degraded path. |
| Research documents | New document, updated document, downstream conflicts, no follow-up | End the canonical output with `## Next Steps` unless the document is append-style. Select recommendations from current files and findings only. |
| Append-style research documents (`customer-feedback`, `runway-model`, `cohort-review`, `retro`) | New session/snapshot, cumulative synthesis updated, stale research found, no stale research | Put next steps in the current synthesis/snapshot. Do not rewrite old sessions. Recommendations must use cumulative state, not only the latest entry. |
| Code-quality pack | Audit only, fix mode, no safe refactor, refactor complete | Audit mode recommends specific fix/refactor work only when findings exist. Fix mode recommends `regression-check` after behavior-preserving changes. |
| Game and devtool packs | Strategy artifact created, validation artifact created, roadmap ready, launch/docs audit complete | Follow the default flow in `docs/skills-reference.md`; if the final pack artifact is complete, recommend roadmap/execution only when a build plan is still missing. |

## Multi-State Skill Rules

| Skill | End states | Valid recommendation |
| --- | --- | --- |
| `video-script` | Script approved, no upstream artifacts, user declined | Approved -> `video-build`. No artifacts -> recommend prerequisite (`creator-positioning`, `product-led-media-map`, or `series-spec`). Declined -> no follow-up. |
| `video-build` | Build complete, script missing, user declined | Complete -> `creator-metrics-review` + task items in `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/recurring-todo.md`. Missing -> `video-script`. Declined -> no follow-up. |

`youtube-format-research`, `video-script`, and `video-build` live in the `remotion` pack. Creator-media skills that recommend them should mention enabling `remotion` when it is not installed.

| Skill | End states | Valid recommendation |
| --- | --- | --- |
| `idea-scope-brief` | Business research lane missing, business research enabled, project type unclear, divergent paths detected | Pack missing -> `npx skillpacks install business-research`. Pack enabled -> `customer-discovery` using `research/idea-brief.md`. Project unclear -> `pack recommend`. Divergent paths -> `/fork-idea-branch`. |
| `fork-idea-branch` | No active research, fork approved, fork declined | No research -> `/idea-scope-brief`. Approved -> restart checklist with `/idea-scope-brief {slug}` per branch. Declined -> no follow-up. |
| `competitive-analysis` concept-validation mode | `Proceed to customer discovery`, `Pivot concept`, `Abandon` | `Proceed` -> `customer-discovery`; `Pivot` -> `brainstorm`; `Abandon` -> `No follow-up skill recommended` unless the user wants a new concept. Standard-mode re-run is valid only after `customer-discovery` creates `research/icp.md`. |
| `competitive-analysis` standard mode | Journey missing, positioning missing, flow map missing, contested solution fit, GTM missing, codebase exists | Missing journey is first: if `customer-lifecycle` is unavailable, recommend `npx skillpacks install customer-lifecycle`; if it is already enabled, recommend `journey-map`. Then route to `positioning`, `user-flow-map`, optional `value-prop-canvas` only for contested solution-fit evidence, `gtm`, `mvp-gap`. |
| `experiment` | Designed, validated, invalidated, inconclusive | Designed -> run the experiment manually. Validated -> log evidence with `customer-feedback`, update `assumption-tracker`, or plan/spec the validated opportunity. Invalidated -> update `assumption-tracker` and return to the domain skill for the failed assumption. Inconclusive -> `experiment [follow-up]` or `customer-feedback`. |
| `reconcile-research` | Actionable conflicts, deferred-only, resolved, no findings | Conflicts -> recommend the producer skill with the highest conflict count. Deferred-only or fully resolved -> `research-roadmap`. No remaining work -> `No follow-up skill recommended`. |
| `customer-feedback` | Major impact, stale ICP, stale journey, new needs, no stale findings, experiment feedback | Major -> `reconcile-research`. Stale ICP -> `customer-discovery`. Stale journey -> `journey-map`. New needs -> `brainstorm` or `ux-variations`. No stale findings -> `research-roadmap`. Experiment feedback -> `assumption-tracker`. |
| `metrics` | Instrumentation gaps, roadmap missing, GTM missing, roadmap exists, live product with data | Gaps -> `roadmap`. No roadmap -> `roadmap`. No GTM -> `gtm`. Roadmap exists -> `run`. Live data -> `cohort-review`. |
| `gtm` | Major downstream conflict, growth-model missing, roadmap missing, metrics missing, open research question, roadmap exists | Major -> `reconcile-research`. Growth-model missing -> `growth-model`. Roadmap missing with specs -> `roadmap`. Metrics missing -> `metrics`. Open question -> `experiment [topic]`. Roadmap exists -> `run`. |
| `monetization` | GTM missing, GTM stale, metrics missing, roadmap missing, live revenue | GTM missing/stale -> `gtm`. Metrics missing -> `metrics`. Specs without roadmap -> `roadmap`. Live revenue -> `runway-model`. |
| `journey-map` | Blocking optional research trigger, positioning missing, flow map missing, enterprise/infrequent measurement needed | First classify optional research triggers from the trigger map. Habit-suitable repeat-use risk -> `hook-model` when `business-growth` is enabled, otherwise `npx skillpacks install business-growth`; enterprise/infrastructure/transactional/naturally infrequent products skip `hook-model` and prefer `lifecycle-metrics` or `metrics`. If no blocking trigger exists, missing positioning -> `positioning`, then route to `user-flow-map`. |
| `positioning` (market mode — framework selection) | Framework selection complete, journey missing | After framework selection: use the Research Session Loop in `docs/research-session-loop-convention.md`; record selected frameworks in the run manifest and re-invoke `positioning` for each next heavy phase. Missing journey -> `journey-map` before framework selection. No downstream routing until synthesis. |
| `positioning` (synthesis mode) | Synthesis complete, flow map missing, contested solution fit, business-model risk, GTM missing, GTM exists, monetization missing, codebase exists, major downstream conflict | Major -> `reconcile-research`. Missing journey -> `journey-map`. Default -> `user-flow-map` when `product-design` is enabled, otherwise `npx skillpacks install product-design`. Include `value-prop-canvas` only for weak/disputed fit, `lean-canvas` only for revenue/channel/cost/defensibility risks, `monetization` only when pricing is central to positioning. |
| `positioning` (product mode) | Framework selection complete (obviously-awesome queued), synthesis complete | Same as synthesis mode end states after synthesis completes. Framework selection uses the Research Session Loop and records the single obviously-awesome step in the run manifest, not `tasks/todo.md`. |
| `mvp-gap` | Missing specs, missing journey/competitive/metrics context, downstream conflict, roadmap ready | Top unspecced flow/design-shape gap -> `user-flow-map`; top gap with accepted flow but missing layout alternatives -> `ux-variations --layout-mode`. Missing context -> corresponding research skill. Major conflict -> `reconcile-research`. Otherwise -> `roadmap`. |
| `scale-audit` | Enterprise blockers lacking specs, missing enterprise journey/metrics/startup gap context, roadmap ready | Top blocker with missing flow/design shape -> `user-flow-map`; blocker with accepted flow but missing layout alternatives -> `ux-variations --layout-mode`. Missing context -> `journey-map enterprise`, `mvp-gap`, or `metrics`. Otherwise -> `roadmap`. |
| `burn-rate` | Major conflict, monetization missing/stale, GTM missing, metrics missing, complex infra, unclear revenue | Major -> `reconcile-research`. Monetization missing/stale -> `monetization`. GTM missing -> `gtm`. Metrics missing -> `metrics`. Complex infra -> `scale-audit`. Unclear revenue model -> `brainstorm` only when no monetization path is plausible. |
| `value-prop-canvas` | Positioning missing, gaps identified, competitive-analysis missing, positioning exists | Optional detour only for contested solution-fit evidence. After fit scoring, return to `positioning` when missing or `user-flow-map` when positioning exists. If gaps identified -> `positioning` or `user-flow-map`. If no competitive-analysis -> `competitive-analysis`. |
| `lean-canvas` | Flow map missing, journey-map missing, monetization missing, positioning missing, riskiest hypothesis | Optional detour only for material business-model risk. After synthesis, return to `user-flow-map` when upstream AFPS evidence exists. Include `journey-map`, `positioning`, `monetization`, or `experiment [riskiest hypothesis]` only when conditions hold. |
| `hook-model` | B2B/enterprise (skippable), metrics missing, engagement mechanism, monetization missing | B2B -> offer skip to `metrics`. Otherwise `metrics` is always the next step. Include `roadmap` or `monetization` when conditions hold. |
| `growth-model` | Top growth mechanism, specs exist, live product | `experiment [top growth mechanism]` is the recommended next step when the mechanism is not already specced. Include `roadmap` when specs exist, `experiment [growth hypothesis]` for live products. |
| `pmf-assessment` | Weak PMF, moderate PMF, strong PMF, pre-launch | Weak -> skill addressing weakest area (`customer-feedback`, `customer-discovery`). Moderate -> `growth-model` or `hook-model`. Strong -> `growth-model` or `roadmap`. Pre-launch -> design framework for future use. |
| `platform-strategy` | Top expansion candidate, enterprise target, no assumption tracker, specs exist | Recommend `experiment [top candidate]` because expansion must be validated before build. Include `enterprise-icp`, `assumption-tracker`, `competitive-analysis [adjacent category]`, `customer-discovery [new audience]`, or `roadmap` only when their conditions hold. |

## Audit Evidence

Command-reference validation:

```bash
scripts/skill-deps.sh --broken
scripts/skill-pack-routing-audit.sh
```

Expected result:

```text
No broken references found.
```

Manual semantic audit findings fixed in this pass:

- Concept-validation `competitive-analysis` now handles `Proceed`, `Pivot`, and `Abandon` distinctly.
- `experiment` now separates design-stage next steps from result-state decision rules.
- `reconcile-research` now documents resolved/no-work end states.
- Downstream-impact next steps now require an actual proposed-output impact check before selecting `reconcile-research` or stale annotations.
