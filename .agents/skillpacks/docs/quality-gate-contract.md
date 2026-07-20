# Quality Gate Contract

This contract defines the default quality gate for mutation and shipping skills. It exists to make implementation quality diff-aware, evidence-based, and hard to satisfy with task bookkeeping alone.

## Scope

Apply this contract to every non-trivial mutation before commit, push, deploy, or handoff as "done".

A mutation is non-trivial when it meets any of these conditions:

- It changes source code, scripts, configuration, schemas, generated runtime assets, or deploy behavior.
- It changes more than one file or crosses package, app, skill, or workflow boundaries.
- It affects user-facing behavior, data shape, authentication, billing, permissions, deployment, or automation.
- It introduces or changes an abstraction, dependency, test contract, validation rule, or command surface.
- It touches files outside the planned scope, even if the change is small.

A mutation can be treated as trivial only when it is limited to a narrow text fix, task checkbox, typo, formatting-only edit, or documentation-only clarification that does not alter executable behavior or workflow policy. When in doubt, treat the work as non-trivial.

## Required Flow

Non-trivial mutations must pass this sequence:

1. **Plan:** State scope, non-goals, risks, files expected to change, and verification commands before editing.
2. **Implement:** Keep the diff to the smallest coherent change. Avoid opportunistic refactors and unrelated cleanup.
3. **Self-review:** Walk through each changed file and ask what could be wrong, including missed edge cases, stale assumptions, and accidental scope growth.
4. **Quality sweep:** Run a targeted `quality-sweep audit`, `$expert-review`, reviewer/subagent lane, or explicitly justified equivalent adversarial review before commit or push.
5. **Verification:** Run executable checks that match the risk. Use manual or visual checks where they are the meaningful proof. Documentation-only or task-only checks are not enough for source changes.
6. **Ship manifest:** Record the commit boundary, changed files, evidence, residual risk, and next command before shipping.

## Ship Manifest

Every non-trivial mutation needs a manifest with these fields:

- **User goal:** The request or accepted plan the work satisfies.
- **Changed files:** Exact changed files in the shipping boundary.
- **Per-file purpose:** Why each changed file had to change.
- **User-goal mapping:** How each change traces back to the user goal or accepted plan.
- **Tests run:** Exact commands, checks, or manual/visual inspections that were completed, with results.
- **Skipped tests:** Checks that were relevant but not run, with a concrete rationale.
- **Adversarial review:** The review method used, findings, and any fixes or accepted residual concerns.
- **Residual risk:** Remaining risk after verification, including any untested behavior or assumptions.
- **Rollback note:** How to revert or neutralize the change if it causes trouble.
- **Next command:** The next concrete command or route for continuing the project.

For unrelated pre-existing worktree changes, the manifest must separate ownership. It must state which changes are included in the ship boundary, which are left untouched, and why committing or pushing is still safe. If that boundary cannot be proven, stop instead of shipping.

## Skipped-Test Standard

Skipped tests are acceptable only when the manifest explains why the check was not useful, unavailable, redundant with stronger evidence, or blocked by an external dependency. "Not run" by itself is not a rationale.

Examples of acceptable skipped-test rationales:

- The change is documentation-only and no executable behavior changed.
- A visual check is not applicable because no UI or rendered artifact changed.
- A full integration test requires unavailable production credentials, and a local contract test covered the changed behavior.
- A broader suite was already run in the same session against the same diff and is referenced by command and result.

## Residual-Risk Standard

Residual risk must be specific enough for the next operator to act on. Avoid generic statements such as "low risk" without evidence.

Good residual-risk entries identify:

- The behavior most likely to fail.
- The user or workflow that would notice it.
- The reason current verification does or does not cover it.
- The first follow-up command or manual check if risk needs more proof.

If no meaningful residual risk remains, state why based on the checks run.

## Adversarial Review

The review must be failure-oriented. It should look for ways the diff could satisfy the checklist while still missing the user goal or harming existing behavior.

Use the smallest review method that matches the risk:

- Use a changed-file self-review plus targeted scans for small documentation or workflow-policy edits.
- Use `quality-sweep audit`, `$expert-review`, or a reviewer/subagent lane for non-trivial code, multi-file workflow contracts, shared scripts, or cross-package changes.
- Use a domain-specific equivalent when it is stronger than the generic review path, and state why it is equivalent.

The review is not complete until findings are either fixed or explicitly accepted in the manifest as residual risk.

## User Corrections

When the user corrects the agent, update `tasks/lessons.md` with the repeatable pattern before shipping any related work. The lesson must name the behavior to avoid, the preferred replacement behavior, and the trigger that should make future agents apply it.

User corrections are presumed repeatable until the ship manifest proves otherwise. A correction follow-up must not be committed or pushed unless the exact shipping boundary includes:

- A `tasks/lessons.md` update for the current correction.
- Either a relevant skill contract, validation script, fixture, or test enforcement update; or an explicit **Correction enforcement:** manifest entry explaining why no repository enforcement update applies.

Treat repeated mistakes in planning, blocker routing, verification, commit/push behavior, deployment handling, or next-step routing as workflow failures unless the manifest proves otherwise. If an enforcement update would apply but cannot be shipped in the same boundary, stop unless the manifest includes **Correction enforcement:** with the blocker, why it cannot be encoded now, and the concrete follow-up file or command that will close it.

If claiming the correction is already covered by an existing rule, cite the exact file and rule, script, fixture, or test, and explain why it would have prevented the corrected behavior. A final-response rationale is acceptable only for non-shipping review or advice work where no commit or push occurs; mutation shipping requires the rationale in the pre-commit ship manifest.

Corrections should not stop at memory. The quality gate should turn repeated mistakes into enforceable workflow changes whenever practical.

## Direct-To-Primary Compatibility

This contract does not replace the repository's direct-to-primary shipping flow. It defines the proof required before a mutation is committed and pushed to `main` or `master`.

For direct-to-primary work:

- Build the manifest from the exact diff that will be committed.
- Do not use a feature branch as a substitute for the quality gate. `agent-team` lane branches add isolation and PR review, but the final shipping boundary still needs this manifest.
- Do not commit or push with known lint, type, test, build, or review failures.
- Do not include unrelated tracked changes unless the manifest explicitly proves the ownership boundary and the operator accepts it.
- Preserve the required next-step routing so the next operator has one concrete continuation path.
