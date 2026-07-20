# Design Tree Loop Convention

> Authority for the **design-phase** product-design and product-testing skills.
> Companion to `docs/interview-convention.md`, `docs/interrogation-page-convention.md`,
> `docs/alignment-page-convention.md`, `docs/alignment-yaml-routing-contract.md`,
> `docs/orchestrator-convention.md`, and `docs/skill-next-step-contracts.md`.
>
> This document **supersedes** `docs/prototype-session-loop-convention.md` (now a thin
> redirect) and absorbs its intra-skill substep mechanics. It does **not** touch
> `docs/research-session-loop-convention.md` — business-research Pattern A orchestrators
> stay on the Research Session Loop and are out of scope here.

## Why this exists

The design-phase skills — `user-flow-map`, `key-moments`, `state-model`, `ux-variations`, `ui-interview`,
`build-ui-screens`, `logic-wiring`, `consolidate-prototypes`, `spec-interview`, optional inspiration
feeders (`brainstorm-inspirations`, `take-inspiration`), and `uat` — were previously split across three loop conventions
(Pattern A research substeps, the prototype session loop, and the implementation exec loop).
They share one job: **grow a design tree from a product concept to a runnable, validated,
spec-ready MVP**, branching through user flows, per-flow domain models, UX variations, UI
experiments, runnable prototypes, consolidation, and specification.

This convention unifies them into **one tree-growing pattern**. Every pipeline skill runs the
**same 5-stage session flow within its own scope** and grows a shared **design tree**.
Research and implementation — formerly split — become two stages of one flow.

The state lives with the design artifacts, never in `tasks/todo.md`:

- `design/**/flow-tree-*.yaml` — the design-tree manifest (branch + decision + model-attachment + platform-fit state).
- `design/**/model-tree-*-{branch}.yaml` — the per-user-flow-branch domain/state/logic model.
- `design/**/*.md` — canonical per-node design artifacts (user-flow doc, UX variation specs, UI experiment packets, build-plan slices).
- `prototypes/{topic}/` — runnable prototype output (owned by `logic-wiring` / `consolidate-prototypes`).
- `research/**/uat-*.md` — UAT plans and human evidence logs.
- `tasks/manual-todo.md` — human-only UAT / prototype evaluation tasks an agent must not mark complete.

`tasks/roadmap.md` and `tasks/todo.md` remain **implementation-execution** surfaces. Do not
use them for design-tree branch progress.

---

## 0. The Meta-Pattern: Two Phase-Loops, One Shape

The design-tree loop and the **Research Session Loop** (`docs/research-session-loop-convention.md`)
are two instances of **one meta-pattern**. Every self-advancing skill in either loop runs a
fixed sequence of heavy phases, one per cold session, bookended by cheap YAML-in / gate-out:

```
interrogation → research → ⟨transform⟩ → ⟨gate⟩ → implement
```

The universal stages are **interrogation**, **research**, and **implement**; the two middle
stages vary by phase. The two concrete instances:

| Phase loop | Stage sequence | `⟨transform⟩` | `⟨gate⟩` | `implement` deliverable |
|---|---|---|---|---|
| **Design / prototype** *(this doc)* | interrogation → research → **design** → **plan** → implement(scoped) | author the scoped design (flow, model, UX, UI, consolidation) | the build-plan slice the implement stage/`logic-wiring` realizes | scoped canonical artifact + tree growth; **runnable** for `logic-wiring` / `consolidate-prototypes` |
| **Research** *(Pattern A — `docs/research-session-loop-convention.md`, normative there; referenced here, not redefined)* | interrogation → research → **plan** → **review** → implement(docs) | run the selected frameworks | framework multi-select = the plan; each framework's + synthesis alignment page = review | canonical research doc (`research/{orchestrator}.md`) |

**Does the research mapping match reality?** Yes — it is the Research Session Loop's session
ladder relabelled: state G = interrogation, states F+C = research (deep interview + run each
framework), state E = plan (framework multi-select), the per-framework + synthesis alignment
pages = review, state A = implement(docs). The one nuance: in the research loop **review fires
per framework and again at synthesis** (interleaved with research), not as a single terminal
review. The design loop's gate is instead **one binding alignment gate per skill-run-on-a-branch**
(§4). Both keep the same outer shape: interrogation and research up front, implement at the end,
two domain-specific middle stages.

This document is **normative only for the design/prototype phase loop**. The research phase loop
stays owned by `docs/research-session-loop-convention.md`; the table above cross-references it so
the shared meta-pattern is visible, but does not restate or override it.

## 0a. Communication Surfaces (what talks to the user, and how)

The primary structured user↔agent channel is **HTML pages**, but with deliberately scoped roles
— HTML is *not* a blanket "everything goes on a page," and it is explicitly *not* the machine
state store (`docs/research-session-loop-convention.md` "Why not the HTML alignment page as the
store").

| Surface | Owns | Lifecycle |
|---|---|---|
| **Interrogation page** (`interrogation/{skill}-r{N}-{branch}.html`) | Stage-0 elicitation — one looping HTML round per turn until the confidence gate passes. The primary surface for stage-0 alignment. | `docs/interrogation-page-convention.md`; `data-open-input` per round; coverage checkpoint exits the loop |
| **Alignment page** (`alignment/{name}-{topic}.html`) | The **binding approval gate** — the single stage-4 whole-unit review per skill-run-on-a-branch. The primary surface where the user approves/rejects/modifies a scoped deliverable. | `docs/alignment-page-convention.md`; `review → confirmed → amended`; compiled Response YAML authorizes canonical writes |
| **Terminal text** | **Interviewing** (`docs/interview-convention.md` — all interviewing happens in the terminal *before* the alignment page), **confirmation manifests/checklists** (render inline as turn-final message text per the Manifest Visibility Rule), self-routing handoffs (`## Next Work` / `## Invoke With YAML`), and optional human-review recaps for chunked handoffs. | turn-final message |
| **Manifests** (`design/**/*.yaml`, `_working/` briefs) | Machine state + pure-context briefs. Never HTML. | filesystem; never a rival page |

So: **HTML alignment + interrogation pages are the primary surface for binding gates and
stage-0 elicitation; the terminal owns interviewing, inline confirmation manifests, and
handoffs; YAML/markdown manifests own machine state.** A skill never pushes branch progress or
machine state onto an HTML page, and never moves interviewing onto a page.

---

## 1. The Design Tree

The design tree is the single source of truth for design-phase progress. Its **cursor is
filesystem existence** of canonical per-node artifacts plus the flow-tree manifest — there is
no `tasks/todo.md` ledger for branch progress.

### Node types

```
root (one per topic)
└── user-flow branch            ← user-flow-map grows these (one per flow)
    │                             key-moments ranks/orders the branches by proof priority (trunk)
    │                             Platform Fit ranks candidate product platforms (trunk)
    ├── model attachment        ← state-model attaches one per promoted user-flow branch (model_ref, JIT)
    └── ux-variation branch     ← ux-variations grows up to 5 per modelled flow
        └── ui-experiment branch ← ui-interview grows these per UX variation
            └── build leaf       ← build-ui-screens builds the visual screens, then logic-wiring
                                   wires them into a clickable, state-backed runnable artifact
                └── platform probe ← optional thin build item for platform-specific risk evidence
```

| Node | Manifest location | Grown by | Canonical artifact |
|---|---|---|---|
| **root** | flow-tree manifest itself | `user-flow-map` | `design/**/flow-tree-{topic}.yaml` + `design/user-flow-{topic}.md` |
| **platform fit** | `platform_fit` | `user-flow-map` | ranked matrix in `design/user-flow-{topic}.md` + manifest recommendation |
| **user-flow branch** | `branches[]` | `user-flow-map` | flow doc section; `model_ref` filled by `state-model` |
| **model attachment** | `branches[].model_ref` → `model-tree-{topic}-{branch}.yaml` | `state-model` | per-branch model-tree manifest + canonical model doc |
| **ux-variation branch** | `branches[].ux_variations[]` | `ux-variations` | `design/ux-variations-{topic}.md` |
| **ui-experiment branch** | `branches[].ux_variations[].ui_experiments[]` | `ui-interview` | `design/ui-{topic}.md`, `design/ui-requirements-{topic}.md` |
| **ui screens** | `ui_experiments[].build_ledger[]` | `build-ui-screens` | visual screens under `experiments/{topic}/{id}/` or a project-native route |
| **prototype** | `prototype_build_plan.items[]` | `logic-wiring` | `prototypes/{topic}/variation-{N}/` |
| **platform probe** | `prototype_build_plan.items[].platform_probe` | `logic-wiring` | smallest runnable probe surface: web/mobile clickable HTML, CLI script, API mock + curl, SDK sample, extension simulation, desktop/local shell, or marketplace two-sided flow |
| **consolidated MVP** | manifest status `consolidated` | `consolidate-prototypes` | `prototypes/{topic}/consolidated/` |
| **AFPS graduation** | downstream of MVP approval | `consolidate-prototypes` | `design/afps-graduation-{topic}.md` or `design/{slug}/afps-graduation-{topic}.md` |
| **spec** | downstream of MVP approval | `spec-interview` | `specs/{topic}.md` |

### Key-moments proof ordering (trunk)

`key-moments` runs **after `user-flow-map`** and **before `state-model`/`ux-variations`**. It is a
**trunk** skill: it needs only the flow map and writes **existing** flow-tree fields
(`journey_sequence`, `evaluation_priority`, `branch_order_override`, `priority_rationale`) — no
schema change. It ranks the user-flow branches by **proof priority** (value × risk × frequency),
orders the branches and gates variation breadth, and **promotes or prunes** flows. The point is
that the rest of the tree grows in proof order: state-model attaches just-in-time only to
**promoted** flows, and `ux-variations` spends its variation budget on the moments that most need
proof. `key-moments` is **not a route position** — like `state-model`, it is invoked from
`user-flow-map`'s handoff and does not occupy one of the six fixed route steps.

### Platform Fit Workshop (trunk)

The **Platform Fit Workshop** is owned by `user-flow-map` and runs after the surface/channel
inventory is clear and before prototype-build-plan synthesis. It is a **trunk concern**, not a
new route position. It writes optional/additive `platform_fit` state into the flow-tree manifest
and a ranked platform matrix into `design/user-flow-{topic}.md`.

The candidate set starts broad: `web_app`, `mobile_web_pwa`, `native_mobile`, `native_desktop`,
`cli`, `api`, `sdk`, `browser_extension`, `marketplace_multi_sided`,
`integration_automation`, `game_playable`, and `other`. Deck/project type may set defaults, but
must not filter candidates by itself. User evidence can override the default rank.

Scoring uses evidence already gathered by AFPS/design work: user context, moment of need,
surface/channel inventory, journey map, ICP/devtool audience, adoption path, permissions and
trust burden, distribution, monetization, and technical leverage. Each candidate records
`fit` (`high | medium | low | rejected`), a rationale across those dimensions, fatal risks,
the required probe if any, and `status` (`recommended | probe | defer | reject | selected`).

Platform probes are **thin artifacts that test platform-specific risks**, not full parallel
products. Only `high` or unresolved `medium` candidates get probes; `low` and `rejected`
candidates stay documented with rationale. When more than one serious platform remains,
`user-flow-map --prototype-build-plan` creates explicit `prototype_build_plan.items[]` with
`platform_probe` metadata. A probe may be non-visual and can omit `ui_experiment_id` only when
`platform_probe.non_visual: true`; ordinary UI build items still link to an approved UI
experiment.

### Per-user-flow-branch model attachment

The domain/state/logic model is a property of the **flow**, not of any UI presentation — UX
variations re-skin the same entities, actions, and states. So `state-model` attaches **one
model per user-flow branch** via `branches[].model_ref` (a repo-relative path to that branch's
`design/**/model-tree-{topic}-{branch}.yaml`). This per-branch `model_ref` is the **primary**
linkage. The legacy top-level `model_tree_ref` is retained as **optional back-compat only**
(single-model repos predating per-branch attachment); new work uses `model_ref`.

`state-model` attaches **just-in-time per promoted flow**: it models only flows `key-moments`
promotes (never pruned flows), and later flows **extend** the core model rather than restate it.
For CRUD-trivial domains a **fast-pass fold** is allowed — a quick data-shape confirmation instead
of a full multi-framework modelling session — distinct from the existing framework-count (≥3)
chunk fold. A per-screen `model_ref` may also attach on the `ui_experiment` node when a single
screen needs its own model slice.

`ux-variations` will not grow UX branches on a user-flow branch until that branch's model is
attached and confirmed.

### Validation layer (`logic-wiring`) and feedback loops

`logic-wiring` owns the literal runnable prototype: it **consumes the visual screens built by
`build-ui-screens`** and wires them into a clickable, state-backed artifact (plus runnable
CLI/API/infra logic). For `platform_probe` build items, it dispatches to the smallest
appropriate probe artifact: web/mobile clickable HTML, CLI script, API mock + curl, SDK sample,
browser-extension simulation, desktop/local shell, integration automation harness, or
marketplace two-sided flow. Each prototype or platform probe is built narrow-scope so a
human can **validate / approve / reject / modify-back** it. Validation decisions are recorded
as `decisions[]` in the manifest and **can flow back up the tree**: a `modify` decision names
`targets[]` — the upstream node(s) (a `state-model` model attachment, `platform_fit`, or a
`user-flow` branch) to **re-open** — returning that node to a pending status so the owning skill
re-runs its 5-stage flow on it. See §4.

### Consolidation and spec

`consolidate-prototypes` converges the validated tree into a cohesive **MVP** at
`prototypes/{topic}/consolidated/`. It compares any platform-probe evidence against
`platform_fit.recommendation` and records the recommended platform strategy in AFPS graduation.
On MVP approval, it also writes the AFPS graduation document at
`design/afps-graduation-{topic}.md` or `design/{slug}/afps-graduation-{topic}.md`. That
graduation document is the durable marker that research/prototyping is complete.
`research-roadmap --post-prototype` then runs the narrow cleanup pass before `spec-interview`
formalizes the MVP into a **production-ready v1** specification at `specs/{topic}.md`.
`spec-interview` must require the AFPS graduation platform strategy, resolve any remaining
platform risks, and lock the final production platform decision in the Production Ready Approval.

---

## 2. The Universal 5-Stage Per-Skill Session Flow

Every **pipeline** skill (and the orchestrator) runs the **design/prototype instance** of the
§0 meta-pattern — the five stages **interrogation → research → design → plan → implement(scoped)**
— scoped to whatever the skill owns. The stage names are normative: a skill's process section
labels its phases with these five words so the shared shape is legible across skills. Each stage
is a **heavy phase that runs and stops**; the skill **self-re-invokes one heavy phase per
session** (cold start → resolve state from filesystem → run one phase → stop), exactly as the
research loop does. Light adjacent stages may **fold** into one session when each is individually
cheap (same near-empty-session judgment as `docs/research-session-loop-convention.md`).

| Stage | Name | What it does | Heavy? |
|---|---|---|---|
| **0** | **Interrogation** | The stage-zero user↔agent alignment loop (`INTERROGATION-PAGE.md`): build one HTML round page per turn at `interrogation/{skill}-r{N}-{branch}.html`, loop until the **confidence gate** passes. Cannot advance until every interview area is covered or waived. | usually folds with stage 1 setup |
| **1** | **Research** | Gather what the skill needs that is not derivable from the repo — inspiration artifacts (`brainstorm-inspirations`, `take-inspiration`), prior art, domain evidence, framework selection. Run **as needed**; skip when the repo already carries the context. | as needed |
| **2** | **Design** | Author the scoped design — the per-node `_working` drafts: flow structure, the domain model, the UX variations, the UI experiment, the consolidation choices. | yes |
| **3** | **Plan-to-implement** | Produce the **build-plan slice** the implement stage (or downstream `logic-wiring`) will realize: ordered, scoped, with acceptance criteria. | folds with stage 2 for small scope |
| **4** | **Implement (scoped)** | Produce the skill's scope-appropriate deliverable (see below), grow the tree's child nodes, and pass the **single binding alignment gate** (§4) before any canonical write. | yes |

### The "implement (scoped)" deliverable per skill

**The literal runnable prototype is owned by `logic-wiring`.** For the upstream design skills,
"implement" means the **scoped canonical design artifact + tree-branch growth + the build-plan
slice `logic-wiring` will later realize** — not runnable code.

| Skill | Stage-4 "implement" deliverable |
|---|---|
| `user-flow-map` | Flow doc + flow-tree root + one user-flow branch per flow + Platform Fit Workshop matrix/recommendation + the prototype build-plan scaffold |
| `key-moments` | Proof-priority ordering written to existing flow-tree fields (`journey_sequence`, `evaluation_priority`, `branch_order_override`, `priority_rationale`) — orders branches, gates variation breadth, promotes/prunes flows. No new artifact, no schema change. |
| `state-model` | Per-branch `model-tree` manifest + canonical model doc, attached via `branches[].model_ref` (JIT per promoted flow; fast-pass fold for CRUD-trivial domains) |
| `ux-variations` | UX variation specs + up to 5 `ux_variation` child branches on the modelled flow |
| `ui-interview` | UI experiment packet(s) + `ui_experiment` child branches under the UX variation + the per-screen batch plan |
| `build-ui-screens` | Visual UI screens for one approved UI branch, built as an ordered element-batch loop (one flow step per batch, per-batch visual checkpoint, minimum-UI stop) with `ui_experiments[].build_ledger[]` written, using fake, fixture, local, or in-memory data |
| `logic-wiring` | **Runnable** narrow-scope prototype under `prototypes/{topic}/variation-{N}/` — wires the `build-ui-screens` screens clickable/state-backed + build-plan + decision; for platform probes, builds the smallest surface/channel artifact that tests the named platform risk |
| `consolidate-prototypes` | **Runnable** consolidated MVP under `prototypes/{topic}/consolidated/` plus AFPS graduation under `design/`, including recommended platform strategy when probes exist |
| `spec-interview` | Production-ready specification under `specs/{topic}.md`, including the final production platform decision |

### Intra-skill substep chunking (absorbed from the prototype loop)

When a skill's stage-2/4 heavy phase fans out into **N independent fully-specified per-unit
artifacts** (e.g. `ux-variations` authoring five build-grade variation specs, or `state-model`
running one framework per session), split it into a setup session, one spec session per unit,
and a final assemble+approve session — each carrying only a small **shared context brief**
(`design/{slug}/_working/{skill}-{topic}-brief.md`, pure context, **no step list, no status
field**) plus the one unit it works on. The cursor is filesystem existence of the per-unit
intermediates (`design/{slug}/{skill}-{topic}/{unit-id}.md`): `pending = planned-units −
existing-intermediates`. Fold for small N — do not spend a fresh-context round-trip on a
near-empty session. Archive the brief and intermediates at canonical write (final approval), so
a rejected final page can still rebuild. This adds **no schema change** and **no new alignment
gate**.

### Ordered, dependent per-unit intermediates (batches)

The chunking above covers **independent** per-unit artifacts. `build-ui-screens` is the
**ordered, dependent** case: its units are **batches**, and **one batch = one flow step**. Batches
are built in flow order, each layered on the screens the prior batches established, so they are
not independent — a later batch reads the earlier screens as context. Each batch:

- adds only the visual elements that one flow step needs;
- pauses at a **per-batch visual checkpoint** before the next batch begins;
- stops at the **minimum UI** that lets the flow step read as real (the **minimum-UI stop rule**);
- records itself as one `ui_experiments[].build_ledger[]` entry (`flow_step`, `elements_added[]`,
  status `minimum-ui-reached` / `parked`).

The acceptance bar for the whole run is **moment-level end-to-end**: the flow's moments read as
real screens before `logic-wiring` makes them clickable. The `build_ledger_status` lifecycle
(`pending → in-progress → minimum-ui-reached → wired`, plus the `parked` off-ramp) is how the stop
rule and park decision are machine-expressible; `logic-wiring` advances `minimum-ui-reached →
wired`.

### HTML-first canonical write rule

Chunked design skills may write `_working/` briefs and per-unit Markdown intermediates before
approval because those files are durable cursors, not approved deliverables. The final assembled
deliverable remains **proposed review content** until it is rendered in
`alignment/{skill}-{topic}.html` and confirmed through the single binding alignment gate.
Canonical `design/**/*.md` and `design/**/*.yaml` writes, flow-tree child growth or back-pointer
updates, glossary write-forward, and archive-at-canonical-write cleanup happen only after that
confirmed alignment approval. Pre-approval assemble wording must describe proposed content for
the HTML page, not replacement of canonical design Markdown/YAML.

---

## 3. Orchestrator vs. Pipeline vs. Subskill

| Role | Skills | Contract |
|---|---|---|
| **Root orchestrator** | `user-flow-map` | Creates the design-tree root and the `flow-tree-{topic}.yaml` manifest; grows one user-flow branch per flow. Owns the build-plan scaffold (`--prototype-build-plan`). `invocation: orchestrator`. |
| **Pipeline** | `key-moments`, `state-model`, `ux-variations`, `ui-interview`, `build-ui-screens`, `logic-wiring`, `consolidate-prototypes`, `spec-interview` | Resolves the **next pending branch** from the tree, runs its 5-stage flow on that branch, grows the branch's children, and **stops**. One branch per heavy session. `key-moments` and `state-model` are pipeline skills but **not route positions** — they are invoked from `user-flow-map`'s handoff, not from a fixed route step. |
| **Optional feeder/amendment** | `brainstorm-inspirations`, `take-inspiration` | Invoked when the user or an owning design-tree skill needs external inspiration evidence. They write approved artifacts into `design/**` and add those paths to flow-tree `source_artifacts[]`; they do **not** occupy the fixed route tuple, do not add schema fields, and route actual tree mutations to the owning skill. |
| **Subskill** | `uat` (parents: `logic-wiring`, `consolidate-prototypes`, exec-loop) | Invoked **inline by a parent**; enters at its own checklist stage; does **no downstream routing** — it returns control to the parent, which owns the handoff. |

### Per-branch iteration contract (pipeline skills)

Each pipeline-skill session:

1. **Cold start** — read the flow-tree manifest (and, where relevant, the per-branch
   `model_ref` and parent artifacts).
2. **Resolve next pending branch** — the branch whose status indicates this skill's work
   is due, selected through the deterministic branch-selection stack below (e.g. `state-model`
   selects a user-flow branch with no confirmed `model_ref`; `ux-variations` selects a modelled
   branch whose `ux_variations[]` work is due; `ui-interview` selects the UX variation whose
   `ui_experiments[]` work is due; `build-ui-screens` selects an approved UI experiment with no
   built screens; `logic-wiring` selects a `pending` / `needs-revision` build item;
   etc.). Honor any explicit branch argument the user passed.
3. **Run the 5-stage flow** scoped to that branch (folding light stages).
4. **Grow children** — write the scoped canonical artifact and the child nodes on final
   approval.
5. **Stop** and emit the self-routing handoff (§5).

A skill that finds **no pending branch** for its role reports the tree is current for its
stage and routes to the next skill in the route.

### Deterministic branch selection

Pipeline skills must not depend on raw manifest array order as the default selector. Resolve
the next child branch with this stable priority stack:

1. **Explicit user override** — if the user names a branch or the manifest records a
   `branch_order_override` for the relevant level, select that branch and record schema-backed
   override metadata in the owning artifact, interview log, and flow-tree manifest:
   `ordered_branch_ids`, `override_rationale`, `recorded_at`, and optional `parent_branch_id`.
2. **Journey or evaluation order** — for `user-flow` branches, sort by ascending
   `journey_sequence`; for `ux_variation` branches, sort by ascending `evaluation_priority`.
3. **First-value and activation fit** — prefer branches with stronger `first_value_fit` and
   `activation_fit` when sequence/priority ties or when the user asks for the fastest path to
   value.
4. **Current status** — prefer work that is explicitly pending or needs revision before
   deferred, dropped, approved, or otherwise terminal branches.
5. **Stable array order** — use manifest array order only as the final tiebreaker after the
   deterministic metadata above.

`user-flow-map` is responsible for authoring `branches[]` in journey progression by default.
`ux-variations`, `ui-interview`, and downstream prototype-facing skills must use the metadata
rather than "first pending" shortcuts when recommending a child branch.

### Progressive review for dense UI surfaces

Complex UI artifacts must introduce the interface in a staged sequence before asking the user
to approve dense secondary controls. For each user-flow and UX-variation branch, carry
`progressive_review` guidance that names the first-value step, the primary task path, staged
disclosure notes, and the evidence required before moving deeper. Review surfaces should first
show the first-value moment, then the primary path, then secondary controls and edge cases.
Visual UI screen work belongs to `build-ui-screens` after the UI branch is approved (then
`logic-wiring` wires those screens clickable); default `ui-interview` runs stop at requirements,
branch packet, bounded visual review, the per-screen batch plan, and branch decision capture.

---

## 4. Approval Gates and the Modify-Back Path

### One binding gate per skill-run-on-a-branch

There is **exactly one** binding alignment gate per skill-run on a branch (the stage-4
assemble+approve gate), preserving **whole-unit review** — the user approves the whole scoped
deliverable (all 5 UX variations, the whole model, the whole UI packet) at once. Stage-0/1/2/3
checkpoints are **confirmations, not approvals**: they confirm a draft is ready for the next
step but never authorize a canonical write. `_working/`-band drafts and per-unit intermediates
are pre-approval; canonical artifacts and child-node growth happen only after the single gate
passes (final compiled alignment YAML for staged-page skills; explicit in-artifact transition
+ manifest update for inline-confirmation skills).

### The modify-back decision path

Validation decisions live in `decisions[]`. The enum is **`approve | reject | retry | modify`**:

- **`approve`** — the node is validated; advance.
- **`reject`** — the node is abandoned; prune that branch.
- **`retry`** — re-run the **same** node's flow (no upstream change).
- **`modify`** *(new)* — re-open an **upstream** node. A `modify` decision **requires
  `targets[]`**, each pointing at the upstream node to re-open (a `state-model` model
  attachment or a `user-flow` branch). Recording a `modify` returns each target to a pending
  status, so the owning skill re-runs its 5-stage flow on it; descendant branches below the
  re-opened node are marked stale for re-validation. This is how validation **flows back up**
  the tree.

---

## 5. Self-Routing Handoff Format

Every stop ends with the standard self-routing handoff so the user (or a continuation agent)
can advance without knowing internal IDs. Reuse the existing payload shape:

- **`## Next Work`** — what was just written (canonical artifact / intermediate path), the next
  pending branch **in plain English** (name it and describe it — never only an internal
  `{branch-id}`), and whether to continue-now or clear-context-first.
- **`## Invoke With YAML`** — the clean-context routing artifact for the next invocation:
  include the exact resolved next-invocation command with `{slug}` / `{topic}` / branch filled
  to literal values (claude `/skill ...`, codex `$skill ...`) in `agent_routing.command`.
  Paste the YAML into a fresh/cleared agent context when you want the next agent to inherit
  routing hints. Do not also provide a separate freeform "exact next command" line for the same
  handoff; the YAML is the single copy/paste artifact, while the durable filesystem cursor
  remains the progress ledger.

When the next invocation is UAT variant evaluation, `## Next Work` must include the UAT Pack
Availability Guard in plain human-facing text: first check whether `uat` is directly available
in the active skill list/session; if not, identify it as provided by `product-testing`; tell
the user to run `npx skillpacks install product-testing`, then `$uat --variant-evaluation` for
Codex or `/uat --variant-evaluation` for Claude. Codex handoffs must also say that if `$uat`
remains unavailable after install, start a fresh Codex CLI session and retry. Do not tell users
to install the `uat` skill directly. An `agent_routing` YAML payload may repeat the resolved UAT
command, but it cannot be the only human-facing UAT command or install guidance.

### Handoff Verification

Immediately before any terminal `## Next Work`, `## Recommended next command`,
`## Recommended Next Command`, or `agent_routing` payload that could advance beyond prototype
evaluation, run a handoff verification pass against the current design-tree artifacts. The
source of truth is `design/**/flow-tree-*.yaml`, `research/**/uat-variant-evaluation-*.md`,
and `tasks/manual-todo.md`. Do not use `research/.progress.yaml` for UX branch state, prototype
readiness, UAT status, or consolidation readiness; it tracks active product paths/product lines
only.

Classify the current state as exactly one of:

- `continue-design-branch`: unresolved approved UX/UI/user-flow branches remain and need the
  next owning design skill before consolidation can be considered.
- `manual-uat-needed`: a built prototype exists, but a UAT result log is `Not run`, missing
  evidence, or blocked by an unchecked human evaluation item.
- `single-variant-convergence-needs-explicit-scope`: exactly one built variant has evidence,
  but sibling approved branches are unbuilt or deferred and the user has not explicitly chosen
  single-variant MVP scope with an exclude/defer/spec-only decision for every sibling branch.
- `ready-for-consolidation`: UAT evidence exists and every approved branch is evaluated,
  excluded from MVP, deferred from MVP, or marked spec-only by explicit user decision.

Every terminal handoff that names a downstream command must include a compact readiness line
before the command, for example:

```markdown
Handoff verification: manual-uat-needed; `$consolidate-prototypes` is blocked until Trust-First evidence is recorded or single-variant MVP scope is explicit.
```

If artifacts are missing, stale, or contradictory, choose the conservative route: manual
UAT/evidence capture or the next unresolved approved UX/UI/user-flow branch, never
`consolidate-prototypes`.

For any self-routing stop inside **intra-skill substep chunking** (setup stop, per-unit stop,
or assemble handoff), `## Next Work` must begin with a visible **Progress Handoff Block** before
the prose handoff. Use this structure:

```markdown
**Progress Handoff — <skill/topic/branch label>**
- Completed: <completed unit count> / <total unit count>.
- Durable cursor: <exact brief path and intermediate directory checked>.
- Current phase complete: <setup | unit name | assemble prep> is complete.
- Next phase: <plain-English description of the next unit or assemble+approve work>.
- Why repeat this command: the repeated command is intentional; the skill cold-starts, reads the durable cursor, and advances the next pending unit.
- Session guidance: continue in a fresh session — clear context (`/clear`), then paste the `## Invoke With YAML` block below. It gives the cold agent the resolved command and routing context, while the durable cursor remains authoritative. Staying in this session is exceptional and allowed only for small folded runs where context is still clearly sufficient.
```

The block is required even when the next command is the same as the command that produced the
handoff. The first line is the progress label; `Completed`, `Durable cursor`, `Current phase
complete`, `Next phase`, `Why repeat this command`, and `Session guidance` are required fields.
The next phase must be in plain English, not only an internal
`{unit-id}` / `{framework}` / `{variation-id}`. The durable cursor line must state that the
brief path and intermediate directory were checked, because those filesystem facts are the
only progress ledger.

**Assemble-ready review-gate exception.** The one exception is the **assemble+approve** stop
whose deliverable alignment page is in `review`: the binding review gate is the next action, so
the alignment convention's **Pre-approval stop** governs (`docs/alignment-page-convention.md`).
Keep the progress fields (`Completed`, `Durable cursor`, `Current phase complete`, `Next phase`)
but drop the `Why repeat this command` / `Session guidance` repeat-command lines and the
`## Invoke With YAML` payload as the presented next action; foreground "Review required" and
present only the page's compiled response YAML.

The `Session guidance` line is an **action directive**, not a passive recommendation: it tells
the user the physical handoff — clear context (`/clear`) and paste the `## Invoke With YAML`
block in a fresh session, where the skill cold-starts and resolves state from the durable
cursor. The continuation mechanism in this loop is **re-running the command named in YAML**;
the `## Invoke With YAML` payload is clean-context routing metadata for a fresh agent (it helps
a cold agent self-route), not consumed state like the research loop's compiled alignment YAML.

### Optional Human Review Summary

Every intra-skill chunked stop — setup stop, per-unit stop, and assemble-ready handoff — must
append this prompt after the `## Invoke With YAML` block (at the assemble-ready stop governed by
the Assemble-ready review-gate exception above there is no `## Invoke With YAML` block, so append
it after the review-gate handoff / compiled response YAML instead):

```markdown
**Optional Human Review**

Do you want a summary of what was executed this step before continuing?
```

If the user says yes, answer with a terminal-only summary. The summary is a non-approval and non-canonical review aid: it makes no approval decision, performs no file writes, and creates no
HTML page unless the user explicitly requests one. It is not a per-section HTML review page, a
new alignment gate, or a substitute for final assemble+approve.

Derive the summary only from the just-written intermediate plus the shared context brief /
durable cursor. Include:

- what was produced in the just-completed chunk;
- decisions, structures, or constraints introduced by that chunk;
- why the chunk matters downstream;
- reviewer inspection points for a human reading before continuation;
- file links to the intermediate, brief, and relevant cursor paths;
- what remains unapproved until final assemble+approve.

**Setup-stop one-time tradeoff note.** The **first** handoff — the setup / scope-checkpoint
stop only — additionally states the single-session tradeoff once: you *can* run the whole loop
in one continuous session (or pass `--no-chunk`), but later phases risk poorer quality and
higher token cost from context bloat as the session fills, so a fresh session per phase is
recommended. State this only at the setup stop; do not repeat it at every per-unit stop.

Continue-vs-stop framing follows the routing rules: when the stop carries heavy build context,
offer stop/clear-context-versus-continue; when already cold, default to continue-now with the
resolved command in `## Invoke With YAML`. Only the setup stop carries the one-time single-session tradeoff note above. Optional inspiration feeders emit owner-routed recommendations only, and `uat` emits a **parent-owned** handoff
only — they hand results back to the invoking/owning skill and do **not** route downstream on their own.

---

## 6. Routing Rules

- Route downstream only after the upstream skill has written **approved/canonical** artifacts.
- Prefer **fresh context** for heavy branch work: new user-flow branch, per-branch model,
  multiple UX variants, full UI experiment, prototype build, consolidation, spec.
- Allow **continue-now** only for small adjacent work and only when the next skill still runs
  its own interrogation, design, approval, or evidence gates.
- `user-flow-map` hands off to `key-moments` to rank/order the flows by proof priority before
  `state-model`/`ux-variations` grow the promoted branches. `key-moments` writes only existing
  flow-tree ordering fields and is **not a route position**.
- `brainstorm-inspirations` and `take-inspiration` are optional feeder/amendment skills. They
  read `design/**/flow-tree-*.yaml`, write approved inspiration artifacts under `design/**`, and
  add those artifacts to `source_artifacts[]`; they are **not route positions** and any actual
  branch, UI, design-system, prototype, or spec mutation routes to the owning design-tree skill.
- `ux-variations` requires the branch's `model_ref` confirmed; do not grow UX branches first.
- Route an approved UI branch to `build-ui-screens` to build the visual screens, then to
  `logic-wiring` to wire them clickable. `build-ui-screens` is a branch screen builder, not a
  replacement top-level route position; the canonical route still reaches build sequencing
  through `user-flow-map --prototype-build-plan` and `logic-wiring`.
- Do not route to `logic-wiring` before the build-plan slice exists unless the user explicitly
  accepts an untracked ad hoc prototype run.
- Do not route from built variants directly to `consolidate-prototypes`; route through
  `uat` (variant evaluation). Consolidation readiness requires recorded UAT evidence plus
  explicit handling of every approved branch: evaluated in MVP scope, explicitly excluded
  from MVP, deferred from MVP, or included only as a spec reference. A single-variant MVP is
  valid only when the user explicitly chooses that convergence scope and names how the
  unbuilt/deferred approved branches are handled. Before any handoff recommends
  `consolidate-prototypes`, it must pass Handoff Verification as `ready-for-consolidation`.
  UAT routing must use the Pack Availability Guard in `## Next Work`:
  install `product-testing` with `npx skillpacks install product-testing` if `uat` is not
  directly available, then run the agent-native UAT command (`$uat --variant-evaluation` for
  Codex, `/uat --variant-evaluation` for Claude). Codex must include the fresh Codex CLI
  session retry fallback.
- Do not route design-tree branch progress through `/exec`, `$exec`, `tasks/roadmap.md`, or
  `tasks/todo.md`.
- The top-level `route` tuple stays the **6-skill sequence** (`user-flow-map → ux-variations →
  ui-interview → logic-wiring → consolidate-prototypes → spec-interview`), with
  `research-roadmap --post-prototype` as the graduation-aware cleanup pass between
  consolidation and specification. `state-model` and `key-moments` are
  **invoked from `user-flow-map`'s handoff**, while `brainstorm-inspirations` and
  `take-inspiration` are optional feeder/amendment invocations; none of them are route
  positions, keeping the route stable while the model rides each branch and proof-ordering shapes
  branch growth.

---

## 7. Task Rules

- Human prototype review, UAT execution, screenshot/recording capture, and subjective
  evaluation go in `tasks/manual-todo.md`. Never in `tasks/todo.md`.
- Implementation/documentation fixes may enter `tasks/todo.md` only after human evidence exists
  and a fix has been explicitly promoted into execution work.
- One-time non-journey evidence capture may use `tasks/record-todo.md`; recurring acceptance
  checks `tasks/recurring-todo.md` only with a real release cadence.

---

## 8. Artifact Rules

- Pre-prototype flow maps, model trees, UX variation plans, UI experiment packets, UI
  requirements packets, branch decisions, mockup references, flow-tree manifests, and build
  plans live in `design/`.
- Runnable prototype output lives in `prototypes/`.
- UAT plans and result logs live in `research/`.
- Finalized production specifications live in `specs/`.
- `research/.progress.yaml` remains product-path/product-line tracking only — never ordinary
  UX/UI/build branch progress, prototype readiness, UAT status, or consolidation readiness.

---

## 9. Migration Note

- `docs/prototype-session-loop-convention.md` is now a **thin redirect** to this document. Its
  intra-skill substep + shared-context-brief mechanics are absorbed into §2.
- Per-skill bundles move from `PROTOTYPE-SESSION-LOOP.md` to **`DESIGN-TREE-LOOP.md`**, generated
  by `scripts/upgrade-design-tree-loop.mjs` (mirroring the retired
  `scripts/upgrade-prototype-session-loop.mjs`).
- `docs/research-session-loop-convention.md` (business-research Pattern A) is **unchanged** and
  out of scope.
- **Flow-walk routing (flow-tree schema v0.4).** The build leaf is **`logic-wiring`**
  (route step 4) and the visual screen builder feeding it is **`build-ui-screens`**.
  Deprecated alias skill directories are archived out of active discovery.
  A new trunk skill **`key-moments`** ranks flows by proof priority after
  `user-flow-map`. The word "prototype" is intentionally retained as artifact/phase vocabulary
  (`prototype_build_plan`, `prototypes/`, prototype build-plan, runnable prototype); only the
  skill/route command is `logic-wiring`. The six-step route tuple and three-role model are unchanged.
- **Platform Fit Workshop (flow-tree schema v0.5).** `user-flow-map` owns additive
  `platform_fit` state and broad platform ranking as a trunk concern after surface/channel
  inventory. Platform probes are thin `prototype_build_plan.items[].platform_probe` artifacts
  built by `logic-wiring`; `consolidate-prototypes` carries probe evidence into AFPS graduation,
  and `spec-interview` locks the final production platform decision. The six-step route tuple is
  unchanged.
- **Inspiration workflow hard rename.** The active `design-inspirations` skill was hard-renamed
  to `brainstorm-inspirations` and narrowed to a survey-and-compare inspiration board. A separate
  `take-inspiration` skill studies one user-named reference through an approved lens. Both are
  optional feeder/amendment skills that write approved artifacts to `source_artifacts[]`; neither
  appears in the six-step route tuple.
