# Alignment YAML Routing Contract

Alignment pages are the durable cross-session review artifact for skills that produce research, specs, reports, planning artifacts, prototypes, or other reviewable outputs.

## Review State

While an alignment page is in `review`, the page owns the next action:

- Section-feedback YAML asks the agent to revise, investigate, or clarify the page.
- Final compiled YAML approves the complete reviewed artifact set.
- Downstream routing is blocked until final compiled YAML approval is consumed and approved canonical artifacts are written or updated.

Skills must not use a `review` alignment page as a downstream command handoff. Do not include `Recommended next skill`, `Recommended next command`, `$exec`, `/exec`, or equivalent execution-loop routing inside the review page before final compiled YAML approval. The exception is the compiled YAML's invocation cue and top-level `command` field: payloads begin with `# Invoke with: <command>` for human/LLM attention, then `command: "<command>"` as the first real YAML key for machine-readable continuation metadata. The comment is not downstream routing and parsers must not depend on it; the producing skill or parent orchestrator still validates the root `command`.

Exception: self-advancing Pattern A research orchestrators may include `agent_routing` metadata in the compiled YAML and may end the **terminal message outside the page** with `## Next Work` while a review gate is pending. `## Next Work` owns the review/compile/clear-context/paste instruction. Do not add a separate review-pending command section: the compiled YAML itself must begin with `# Invoke with: <parent-orchestrator-command>`, followed by a top-level `command` field carrying that same parent-orchestrator command; when `agent_routing.command` is present, root `command` and `agent_routing.command` must match exactly. The command value must name the parent orchestrator, never a child framework path command; the parent still interprets the YAML and filesystem state before writing artifacts or loading framework subskills inline.

## Approved Artifact State

After final compiled YAML approval:

- Apply approved edits.
- Archive or remove non-canonical working packets according to the skill contract.
- Write or update the approved canonical artifacts.
- Convert the alignment page to `confirmed` with the approval record preserved.
- Only then emit downstream routing based on the approved artifact state.

A skill's own re-invocation is a valid downstream route. Self-advancing Pattern A research orchestrators (`docs/research-session-loop-convention.md`) continue their loop by naming their own command as the next action once a gate's artifact is written (e.g. `Next: clear context, then run /customer-discovery`).

## Non-Exec Skills

Non-exec skills may write YAML, task, roadmap, or play artifacts that describe executable work. They must not recommend `$exec` or `/exec` directly as the next action. The approved artifact is the routing boundary; the user or active executor consumes that artifact later.

Execution-loop skills are the exception. Skills under `packs/exec-loop/**` and skills with `type: execution` may document and recommend execution-loop commands because running those commands is their purpose.

## Audit

Run:

```bash
node scripts/skill-alignment-routing-audit.mjs
```

The audit scans active `base/**/SKILL.md` and `packs/**/SKILL.md`, excluding archives and generated local install roots. It fails when active non-exec skills recommend direct `$exec`/`/exec` handoffs, and it checks the game artifact skills plus staged approval-gated skills for the pre-approval YAML stop contract.
