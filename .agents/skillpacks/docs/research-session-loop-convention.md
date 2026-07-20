# Research Session Loop Convention

> Companion to `docs/orchestrator-convention.md` (Pattern A), `docs/alignment-page-convention.md`, `docs/alignment-yaml-routing-contract.md`, and `docs/interview-convention.md`.
> This document defines how **Pattern A framework-decomposition research orchestrators** chunk multi-step research across fresh-context sessions **without** the implementation exec loop (`tasks/roadmap.md` + `tasks/todo.md` + `/exec`).

## Why this exists

Research orchestrators (`customer-discovery`, `competitive-analysis`, `positioning`, `journey-map`) historically queued each framework as a step in `tasks/todo.md` and let `/exec` drive execution. That works, but it couples *research* chunking to the *implementation* exec loop, which carries machinery that is dead weight for research:

- execution profiles (`serial`, `agent-team`, `implementation-safe`, …),
- test-strategy steps (`### Tests First` / `### Implementation` / `### Green`),
- `--phase` decomposition and `/plan-phase`,
- the `roadmap.md` ↔ `todo.md` (full plan vs. current phase) split,
- the `/ship` dirty-tree handoff contract.

None of that maps to "research topic 3 of 6." A research chunk needs only: topic, scope, status, output path. The `research-only` execution profile does **not** help — it means "research *then implement in the main agent*," not "research and stop."

The real problem this convention solves is **context-window bloat**: running an interview, framework selection, multiple framework research passes, and synthesis in one agent session (or even a few) accumulates context until quality degrades. The fix is to make each heavy research phase its own fresh-context session.

## Two loops, separated

| | Implementation Exec Loop | Research Session Loop |
|---|---|---|
| **Driver** | `/exec` reads `tasks/todo.md`, runs one step, stops | The orchestrator re-invokes itself; each invocation runs one phase, stops |
| **State store** | `tasks/roadmap.md` + `tasks/todo.md` checkboxes | Selected-set run manifest + canonical-intermediate file existence |
| **Unit of work** | one code step (or one phase) | one heavy research phase (interview, one framework, synthesis) |
| **"Done" means** | tests green / acceptance criteria met | canonical artifact written + alignment page confirmed |
| **Used by** | `type: execution` skills, Pattern B plays | Pattern A research orchestrators |
| **Routing** | recommends the executor | recommends its own re-invocation |

The implementation exec loop's artifacts (`tasks/roadmap.md`, `tasks/todo.md`) belong to `type: execution` work. Pattern A research keeps all of its state in the run manifest and the research artifacts themselves (see "State store" below).

## The unifying rule

Every invocation of a self-advancing research orchestrator is:

```
(consume any pasted YAML from the previous gate)   ← light: read + write a small file, archive
   → (do exactly ONE heavy phase)                  ← the only thing that justifies a fresh session
      → (emit the next gate: alignment page or preliminary handoff)
         → STOP
```

The YAML-in and gate-out are cheap bookends; the **heavy phase in the middle is the only thing that bloats context**, so that is the unit isolated per session. A phase whose context cost is negligible (e.g. recording an approved selection) is **not** given its own session — it folds into the *head* of the next heavy session. Do not spend a fresh-context round-trip on an almost-empty session.

## Stage taxonomy (shared meta-pattern)

This Research Session Loop and the **Design Tree Loop** (`docs/design-tree-loop-convention.md`) are two instances of **one meta-pattern**: `interrogation → research → ⟨transform⟩ → ⟨gate⟩ → implement`. The universal stages are interrogation, research, and implement; the two middle stages vary by phase. The Research phase loop's instance is **interrogation → research → plan → review → implement(docs)**, which maps onto this document's session ladder as:

| Stage word | Research Session Loop reality |
|---|---|
| **interrogation** | state G — the looping stage-zero interrogation page + confidence gate |
| **research** | states F + C — the deep interview and running each selected framework inline |
| **plan** | state E — the framework multi-select page (deciding *which* frameworks; the multi-select approval is the per-set scope plan) |
| **review** | each framework's findings `review` page + the synthesis `review` page — **interleaved per gate**, not one terminal review |
| **implement(docs)** | state A — writing the canonical `research/{orchestrator}.md` |

The Design Tree Loop's instance instead uses **interrogation → research → design → plan → implement(scoped)** with **one binding alignment gate per skill-run-on-a-branch**. The stage words are shared vocabulary so the meta-pattern is legible across both loops; this document remains the **normative** authority for Pattern A research orchestrators (the design doc references this mapping but does not redefine it). See `docs/design-tree-loop-convention.md` §0.

## The session ladder

Because every session starts cold, mode detection must resolve purely from **pasted-YAML + filesystem state**. On each invocation, the orchestrator resolves the first matching state:

| # | Detected state | Heavy phase this session | Emits |
|---|----------------|--------------------------|-------|
| 0 | **Pasted compiled YAML present** | Branch on `approval_status`: `ready-for-agent-review` → apply approval for the gate it answers, then fall through to the next pending phase below. `not-approved` → **amend the named page** (this is a *refinement session*). | amended page, or proceeds ↓ |
| A | Canonical `research/{orchestrator}.md` exists | — | done; emit next-skill route |
| B | All selected framework intermediates exist, no canonical | **synthesize** | canonical-approval (`review`) page |
| C | Selection recorded, ≥1 framework pending | **run next pending framework** — load its subskill inline and enter at its research stage (the multi-select approval already satisfied its scope gate) | that framework's `review` page |
| D | Multi-select page in `review`, selection not yet recorded | — (waiting) | points user to the page |
| E | Preliminary interview handoff exists, no multi-select page | build framework multi-select `review` page | multi-select page |
| F | Interrogation completion handoff exists, no preliminary interview handoff (deep) — or it doubles as the handoff (scoped) | run the deep interview pass (deep orchestrators); scoped orchestrators fold this into state E | preliminary interview handoff, or proceeds ↓ |
| G | **Nothing yet** (genuinely cold, no on-disk artifacts) for an interrogation-page participant | run **one stage-zero interrogation round** (the looping interrogation page) | an `interrogation/{orchestrator}-r{N}-{branch}.html` round page; on confidence-gate pass, the **interrogation completion handoff** |

Resolution order is **YAML first, then most-progressed state backward** (A→G). "Pending framework" = a selected framework whose canonical intermediate file does not yet exist. State G applies only to skills participating in the interrogation-page archetype (`docs/interrogation-page-convention.md`); non-participating orchestrators have no state G and cold-start at state F (deep) or E (scoped) as before.

### Stage-zero interrogation loop (state G)

For interrogation-page participants, a genuinely cold start resolves to **state G**: elicitation runs as the looping HTML interrogation page *before* the framework/scope page. State G is itself a self-advancing sub-loop — each round is one heavy session:

```
state G round = 1
build interrogation/{orchestrator}-r{round}-{branch}.html   (assumptions manifest if round==1, else follow-ups)
STOP → user answers → compiled answers YAML
next session (state 0): write research/_working/interrogation-{orchestrator}-r{round}.yaml,
    run the CONFIDENCE GATE:
        NOT covered → round += 1; build the next round; STOP
        covered/waived → write the interrogation completion handoff; fall through to state F/E
```

- **Round page:** `interrogation/{orchestrator}-r{N}-{branch}.html` (`{branch}` is the product-path slug, or the topic slug in flat mode).
- **Per-round answer sidecar:** `research/_working/interrogation-{orchestrator}-r{N}.yaml` (or `research/{slug}/_working/…`).
- **Interrogation completion handoff:** `research/_working/interrogation-{orchestrator}-handoff.md` (or `research/{slug}/_working/…`) — analogous to the preliminary interview handoff, a complete context transfer summarizing the elicited assumptions, answers, and confidence-gate result. For deep orchestrators it precedes (or doubles as) the preliminary interview handoff; for scoped orchestrators it stands in for the 1–3 scope questions and state E reads it directly.

A round's confidence gate is the loop exit: the orchestrator **cannot advance to state F/E until** at least one interrogation round is completed and every interview area is covered or explicitly waived at the coverage checkpoint. The round page carries `data-interrogation-gate="coverage-checkpoint"` on the exit round; flagging a gap raises the round number and continues the loop.

**Loop continuation reuses the self-advancing exception** (`docs/alignment-yaml-routing-contract.md`): each round ends the terminal message with `## Next Work` only, telling the user to clear context and paste the compiled YAML into a fresh session. The round page's compiled YAML carries a top-level `command` plus `agent_routing.command` naming the same parent orchestrator (never a child framework path command) with `gate_type: interrogation-round`. Detection resolves purely from pasted-YAML + filesystem: the next session reads the pasted round YAML and the on-disk round sidecars to decide whether to emit the next round or write the completion handoff.

### Framework approval granularity

When the loop runs a framework inline (state C), the multi-select approval — recorded in the run manifest — **is** that framework's Stage-1 scope approval. The framework therefore enters at its **research stage** (Stage 2 of the staged research workflow): it performs the research and builds a single findings/artifact `review` page, instead of re-running its own scope gate first. The result is **one approval gate per framework** inside the loop — the multi-select page approves scope for the whole selected set, and each framework then produces exactly one findings page. Standalone (non-loop) invocation of a framework subskill is unchanged: invoked on its own, the subskill runs its full two-stage workflow, including its own scope gate.

### Worked example: `/customer-discovery`

| Session | Entry state | Does | Stops with |
|---|---|---|---|
| 1 | F (cold) | deep interview | writes `research/{slug}/_working/preliminary-customer-discovery-interview.md` |
| 2 | E | reads handoff → builds framework multi-select page | multi-select `review` page; user reviews, compiles YAML |
| 3 | 0 (approved multi-select) → C | records selection (light) → runs framework 1 | framework-1 `review` page |
| 4 | 0 (approved fw-1) → C | writes `research/{slug}/customer-discovery-{fw1}.md` (light) → runs framework 2 | framework-2 `review` page |
| … | … | … per framework … | … |
| N | 0 (approved fw-k) → B | writes last intermediate (light); all done → synthesize | synthesis `review` page |
| N+1 | 0 (approved synthesis) → A | writes canonical `research/{slug}/customer-discovery.md`, archives run manifest, updates `.progress.yaml`, emits route | done |

Session 3's "record the approved selection" is light, so it folds into the head of the run-framework-1 session rather than being its own session.

## State store

Self-advancing orchestrators use **two minimal pieces of state**, and deliberately keep HTML out of the machine path:

1. **Selected-set run manifest** — written when the multi-select YAML is approved. Records *which frameworks were selected* and their intermediate paths. Recommended location:
   - flat mode: `research/_working/{orchestrator}-run.yaml`
   - product-path mode: `research/{slug}/_working/{orchestrator}-run.yaml`

   Shape:
   ```yaml
   orchestrator: customer-discovery
   slug: skills-showcase            # omit in flat mode
   selected_frameworks:
     - slug: w3-hypothesis
       intermediate: research/skills-showcase/customer-discovery-w3-hypothesis.md
     - slug: jtbd
       intermediate: research/skills-showcase/customer-discovery-jtbd.md
   ```
   The manifest stores **selection only, not per-framework status** — status is derived (next item).

2. **Progress = canonical-intermediate file existence.** A selected framework is *done* when its canonical intermediate (`research/{orchestrator}-{framework}.md`) exists, and *pending* otherwise. This is unambiguous because the staged research workflow writes the working packet to `_working/` first and the canonical intermediate **only on approval** — so the canonical file's presence is exactly "approved and done." `pending = selected − existing-intermediates`.

**`.progress.yaml` stays coarse.** Do not push per-framework chunk status into `research/.progress.yaml`. Its `pipeline_stage` field continues to record only *which orchestrator stage* last touched a product path (e.g. `pipeline_stage: customer-discovery`); `afps-status` and other readers keep treating it as a pointer, not the source of truth. The run manifest is the chunk-level state; the manifest is archived at synthesis.

**Why not the HTML alignment page as the store.** The alignment page is an ephemeral, per-topic, confirmed-and-frozen approval record with no progress model, and HTML is a poor agent-writable state surface (it would have to be parsed back each session). The page's job is approval + human-visible progress, not machine state. See "Alignment page role" below.

## File and naming conventions

| Artifact | Flat path | Product-path |
|---|---|---|
| Interrogation round page | `interrogation/{orchestrator}-r{N}-{branch}.html` | `interrogation/{orchestrator}-r{N}-{slug}.html` |
| Interrogation round answer sidecar | `research/_working/interrogation-{orchestrator}-r{N}.yaml` | `research/{slug}/_working/interrogation-{orchestrator}-r{N}.yaml` |
| Interrogation completion handoff | `research/_working/interrogation-{orchestrator}-handoff.md` | `research/{slug}/_working/interrogation-{orchestrator}-handoff.md` |
| Preliminary interview handoff | `research/_working/preliminary-{orchestrator}-interview.md` | `research/{slug}/_working/preliminary-{orchestrator}-interview.md` |
| Selected-set run manifest | `research/_working/{orchestrator}-run.yaml` | `research/{slug}/_working/{orchestrator}-run.yaml` |
| Framework working packet (staged) | `research/_working/preliminary-{framework}-research.md` | `research/{slug}/_working/preliminary-{framework}-research.md` |
| Framework canonical intermediate | `research/{orchestrator}-{framework}.md` | `research/{slug}/{orchestrator}-{framework}.md` |
| Synthesized canonical | `research/{orchestrator}.md` | `research/{slug}/{orchestrator}.md` |

The preliminary interview handoff and the run manifest live under `_working/` and inherit the existing throwaway-packet treatment. The interview handoff must be a **complete context transfer** — the next fresh session builds the framework selection page reading *only* this file, so it must carry: detected mode (e.g. pre-product vs product-exists), context summary, recommended framework subset with rationale, and any user answers that shape the selection.

## Archive timing

**Archive a source only when its consumer's output is committed**, never when the next page is merely built:

- Archive the interrogation completion handoff and its round answer sidecars at **handoff-consume** (when state F/E first reads the completion handoff to produce the preliminary interview handoff or multi-select page). The interrogation round pages themselves are durable per-round artifacts and are not archived on every round; archive a round page only when it is rebuilt before its answers are consumed (see the interrogation convention).
- Archive the preliminary interview handoff at **selection-commit** (when the run manifest is written, step 0 head of the first framework session) — not when session E builds the multi-select page. A rejected multi-select page must still be able to rebuild from the handoff.
- Archive a superseded alignment page at **commit** (when its approved artifact is written), per the alignment-page archive-first rule: `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/{name}-{topic}.html`.
- Archive the run manifest at **synthesis** (when the canonical `research/{orchestrator}.md` is written).

## Alignment page role

The alignment page does exactly what it already does well, and nothing more:

- **Approve** each gate (framework multi-select, each framework's artifact, synthesis) via the standard `review → confirmed → amended` lifecycle and the Response YAML contract.
- **Visualize progress** (optional, `visual` tier): a confirmed framework page may show "framework 2 of 4 complete" derived from intermediate-file existence. This is presentation only; the machine state remains the run manifest + file existence.
- It is **not** the machine state store and **not** a command handoff while in `review`.

## Routing: self-re-invocation

A self-advancing research orchestrator continues its loop by routing to **its own re-invocation**. After consuming approved YAML and writing the artifact for a gate, the confirmed-page handoff and the terminal message name the next command — the same orchestrator — and instruct the user to clear context and re-invoke:

```
✔ Framework 1 (W3 Hypothesis) confirmed and written.
## Next Work
Start a fresh context and let the parent run the next pending framework. Progress: 2 of 4 frameworks complete.

## Recommended Next Command
/customer-discovery
```

This is the defined mechanism for advancing the loop, and `docs/alignment-yaml-routing-contract.md` § Approved Artifact State recognizes a skill's own re-invocation as a valid post-approval route. The cross-skill downstream route is emitted only after final synthesis.

### Post-canonical amendment routing

After final synthesis has been approved and the canonical research artifact has been written, bounded low/medium corrections may route to `research-amend` instead of restarting the whole Pattern A loop. Use this only for narrow amendments to existing canonical research, such as one missed competitor, one corrected source fact, or a small evidence update whose blast radius is known. High-impact or systemic drift still routes to the affected framework, synthesis, or full Pattern A rerun; examples include changed ICP/category strategy, a competitor set that changes positioning, broad source staleness, or conflicts spanning multiple frameworks.

Do not recommend `research-amend` while any Pattern A alignment page is still in `review`. Review-pending pages continue only through compiled YAML pasted into a fresh session; downstream or amendment commands become valid only after approved artifacts are written, or from separate research-health/status scans.

### Self-routing continuation payload

Pattern A review pages should make the bottom compiled YAML **self-routing data** by beginning with `# Invoke with: <parent-command>` followed by a top-level `command` field and an `agent_routing` mapping. The invocation comment gives the user and fresh LLM agent an immediate visual cue, the root `command` gives parsers the exact parent invocation to run with the pasted YAML, and `agent_routing` gives enough context to route back to the parent orchestrator when the user pastes the YAML. The parent orchestrator still owns interpretation, state resolution, artifact writing, archiving, and inline framework loading.

Example for an inline framework findings gate:

```yaml
# Invoke with: $competitive-analysis research/afps-tracker
command: "$competitive-analysis research/afps-tracker"
agent_routing:
  workflow: pattern-a-research-loop
  parent_skill: competitive-analysis
  command: "$competitive-analysis research/afps-tracker"
  product_path: research/afps-tracker
  gate_owner: parent-orchestrator
  gate_type: framework-findings
  framework_slug: swot
  framework_mode: inline-subskill
  run_manifest: research/afps-tracker/_working/competitive-analysis-run.yaml
  next_resolution: parent-resolves-from-yaml-and-filesystem
```

For non-framework gates, use the same mapping and set `gate_type` to the active gate (`framework-selection`, `shortcut-selection`, or `synthesis`); omit `framework_slug` and `framework_mode` when no framework is active. In flat mode, omit `product_path` or set it to an empty value. The top-level `command` and `agent_routing.command` must be the same parent-orchestrator command, including the same product/research path argument when present. It must never be a path-shaped child framework command.

`agent_routing` is routing metadata, not execution authority. The receiving parent still validates `approval_status`, identifies which gate the YAML answers, derives progress from the run manifest plus canonical-intermediate file existence, writes or amends the appropriate artifact, archives consumed sources, and decides whether to load a framework subskill inline. Do not put framework-owned commands, downstream-skill commands, `$exec`, or `/exec` in this mapping.

### Terminal handoff format

Every terminal message for a Pattern A loop stop ends with the applicable sections below:

1. `## Next Work` — always present. For pending `review` approval gates, this is the final section and tells the user to review the page, compile responses, clear context, and paste the compiled YAML into a fresh session. For post-write handoffs, name the immediate next work state: run the next pending framework, build synthesis, or move to the first downstream skill after approved synthesis.
2. `## Recommended Next Command` — use only after approved YAML has been consumed and the approved artifact has been written or updated. Name the same parent orchestrator command while frameworks or synthesis remain; after final synthesis, name the first downstream command selected by the orchestrator's routing tree.

Do not place any other section after the applicable final section. If no command is appropriate after final synthesis, write `No follow-up command recommended` under `## Recommended Next Command`.

For the last framework write, recalculate pending frameworks from the run manifest plus canonical-intermediate existence before writing the handoff. If no frameworks remain and the synthesized canonical artifact is missing, `## Next Work` must say the next run builds the unified synthesis review page, and `## Recommended Next Command` must name the parent synthesis route, for example `/customer-discovery --synthesize` or `/customer-discovery --synthesize research/afps-tracker`.

Framework subskills do not own user-facing routing. When a framework is run inline, its final handoff is still the parent orchestrator's handoff and must use the same two-section format with the parent command only.

### Approval-boundary labels

Use two distinct labels so review pages do not hide the required continuation command:

- Pending `review` approval gates end after `## Next Work`; the compiled YAML itself carries the parent command in `command` and `agent_routing.command`.
- `## Recommended Next Command` appears after the agent has consumed approved YAML, written or updated the approved artifact for the gate, and converted the page to `confirmed`. It names the same parent orchestrator command when the current Research Session Loop still has pending frameworks or synthesis.

While any `review` approval gate is pending, do not route to downstream or cross-skill work. Framework subskills remain downstream-route-free in loop mode: they do not emit `Recommended next skill`, path-shaped child framework commands, `$exec`, `/exec`, or downstream commands. The parent orchestrator is the only user-facing continuation command during framework loops.

### Does the skill need to be re-invoked? Can the agent auto-call it?

- **The skill is required to interpret the YAML.** The rules for what a compiled YAML means (which gate it answers, what to write, what to archive) live in the orchestrator's `SKILL.md`, not in the YAML. The YAML is data.
- **Use compiled YAML as the handoff artifact.** The robust pattern is the **compiled YAML carrying top-level `command` plus `agent_routing`**. The user should paste the compiled YAML into a fresh session after clearing context; the fresh agent uses `command` or `agent_routing` to select the parent skill, then lets that parent resolve state from YAML and filesystem rather than treating the YAML as standalone execution authority.
- **Framework subskills are followed inline, not separately invoked.** When the orchestrator self-advances into a framework (step C), it loads and follows that framework subskill's `SKILL.md` instructions within its own session. The user does not invoke the framework skill; the user only ever invokes the orchestrator.

## Heavy vs. light phases

Isolate **heavy** phases (each consumes meaningful context): the deep interview, each framework's research pass, synthesis. Fold **light** operations into an adjacent session's head/tail:

- recording an approved selection into the run manifest,
- writing an approved framework intermediate from already-reviewed content,
- archiving a consumed source.

If a run is small enough that a phase is trivially cheap (e.g. a 2-framework run), fold rather than spend a round-trip on a near-empty session. The unifying rule gives this judgment automatically: *one heavy phase per session, light bookends*.

## Refinement and synthesis

- **Refinement sessions** are not a separate concept — they are step 0 with `approval_status: not-approved`: amend the named page (`amended` lifecycle state), highlight the diff, stop, ask again. The framework's canonical intermediate is not written until approval, so file-existence inference correctly treats an under-revision framework as still pending.
- **Synthesis** (step B) reads all canonical intermediates, builds a `review` page, and on approval writes the canonical `research/{orchestrator}.md`, archives the run manifest, updates `.progress.yaml` `pipeline_stage`, and emits the downstream next-skill route (the one place cross-orchestrator routing is allowed, per the YAML routing contract).

## Revision hygiene

When user feedback asks to remove, replace, or reduce emphasis on research content, revise the active working packet, alignment page, intermediate, or synthesis toward the requested final state. Keep corrected or rejected claims out of canonical findings, recommendations, framework outputs, synthesis narratives, and future-session instructions. If provenance matters, preserve it in a concise revision note or archive record rather than reintroducing it into the forward-facing research story.

## Relationship to the other conventions

- **`docs/orchestrator-convention.md`** — Pattern A's Execution Model and Operational Modes are defined by *this* document for research orchestrators. Pattern B (intent-router plays) and Pattern C (detect-and-route, single session) are unchanged and may still use `tasks/todo.md` + `/exec`.
- **`docs/interview-convention.md`** — for a self-advancing research orchestrator, the deep-interview intake ends by writing the preliminary interview handoff and stopping (it does not flow straight into the alignment page in the same session).
- **`docs/alignment-page-convention.md`** — the staged research workflow (scope → working packet → approved write) applies *within* each framework session and the synthesis session, unchanged.
- **`docs/alignment-yaml-routing-contract.md`** — self-re-invocation of the orchestrator is the recognized post-approval route for continuing the loop.

## Migration status

This convention is **normative for all Pattern A research orchestrators**. The rollout is **complete**: all four reference orchestrators implement the session ladder (states 0–F), keep their state in the run manifest plus canonical-intermediate existence, and advance by self-re-invocation. New Pattern A research orchestrators follow this convention from creation.

| Orchestrator | Version | Cold entry | Run manifest |
|---|---|---|---|
| `customer-discovery` | v1.13 | state F (deep interview — `context_intake: deep`) | `research/{slug}/_working/customer-discovery-run.yaml` |
| `competitive-analysis` | v0.25 | state E (`context_intake: scoped` — no deep interview) | `research/{slug}/_working/competitive-analysis-run.yaml` |
| `positioning` | v0.23 | state E (`context_intake: scoped` — no deep interview) | `research/{slug}/_working/positioning-run.yaml` |
| `journey-map` | v0.23 | state E (`context_intake: scoped` — no deep interview) | `research/{slug}/_working/journey-map-run.yaml` |

`customer-discovery` is the deep-intake reference (state F → E → C… → B → A); the three scoped-intake orchestrators have no deep-interview phase and resolve a cold start directly to state E. The adjacent `afps-status` reader (base, v0.5) is loop-aware: it reports "k of N frameworks complete" from the run manifest and routes a mid-run loop back to its orchestrator.

### Rollout checklist (the steps each migration followed)

Each of `customer-discovery`, `competitive-analysis`, `positioning`, `journey-map` was migrated by:

1. Replace the "write framework steps to `tasks/todo.md`; `/exec` drives" execution model with the session ladder (states 0–F).
2. Replace the "Parent does not execute frameworks" constraint with "Parent self-advances one phase per invocation and follows the next pending framework subskill inline." The migrated `SKILL.md` should describe self-re-invocation positively (name the orchestrator's own command); it does not need to enumerate what *not* to route to.
3. Add the deep-interview → preliminary-handoff → stop step (state F) and the build-multi-select-from-handoff step (state E).
4. Add the selected-set run manifest write on multi-select approval (state 0/C head) and the file-existence pending-detection (state C).
5. Update synthesis (state B) to archive the run manifest and emit the next-skill route on canonical write.
6. Set terminal handoff routing to self-re-invocation: end every loop stop with `## Next Work` plus the appropriate parent-owned command section.
7. Bump `version:` per `docs/skill-versioning.md` (decimal bump — behavioral change), archive the prior `SKILL.md`, and add a `CHANGELOG.md` entry. Apply the same to each framework subskill when its parent-owned handoff contract changes; subskills remain single-framework staged-research skills and do not become user-facing commands.

### Adjacent updates

- **`afps-status`** (done, v0.5) — when reconciling a research stage in progress, it reads the selected-set run manifest (`research/{slug}/_working/{orchestrator}-run.yaml`), compares against existing canonical intermediates to report "k of N frameworks complete," and routes a mid-run loop back to its orchestrator. `.progress.yaml` stays a pointer.
- **Audit** — `scripts/skill-alignment-routing-audit.mjs` recognizes self-re-invocation routing as valid for these skills, and `scripts/skill-research-loop-handoff-audit.sh` checks the terminal handoff contract.
