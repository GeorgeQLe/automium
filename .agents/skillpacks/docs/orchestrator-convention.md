# Orchestrator Convention

> Companion to `docs/skill-anatomy.md` § Delegation Patterns.
> This document covers operational details for skills that coordinate other skills.

## Pattern Overview

Three orchestrator patterns exist. Each differs in how it selects targets, what it routes to, and whether it synthesizes outputs.

| Dimension | Pattern A: Framework Decomposition | Pattern B: Intent Router | Pattern C: Detect-and-Route |
|-----------|-----------------------------------|--------------------------|----------------------------|
| **Routing signal** | User multi-select from mode-appropriate defaults | Intent classification via signal words or flags | Codebase grep for dependencies/imports |
| **Target type** | Framework subskills in `frameworks/` | Peer skills in same or cross-pack | Framework subskills in `frameworks/` |
| **Subskill ownership** | Parent owns `frameworks/` dir | No ownership — routes to independent skills | Parent owns `frameworks/` dir |
| **Synthesis** | Yes — `--synthesize` reads all intermediates | No — each routed skill produces independent output | No separate synthesis — parent skill produces unified output inline |
| **Artifacts** | Framework intermediates + synthesized canonical | Routed skills own their own artifacts | Parent produces structured plan document |
| **Execution driver** | Self-advancing — Research Session Loop (re-invokes itself) | Queued play, driven downstream | Single inline session |
| **`tasks/todo.md` usage** | **None** — uses the Research Session Loop | Writes multi-step plays (Modes B–E) | Does not use `tasks/todo.md` |
| **Frontmatter** | `invocation: orchestrator` | `type: router` | `invocation: orchestrator` |
| **Reference implementations** | customer-discovery, competitive-analysis, positioning, journey-map | youtube | animation-design-planner |

**Variant: Thin Workflow Router** — a lightweight subset of Pattern B used by `devtool-workflow` and `game-workflow`. Uses project-type detection instead of intent classification, recommends one skill at a time (no multi-step plays), and does not use `tasks/todo.md`. See [Pattern B § Variant](#variant-thin-workflow-router) below.

### Which pattern should I use?

- **Multiple named frameworks the user selects between, with a synthesis step?** → Pattern A.
- **Free-text or flag-based intent that routes to independent peer skills?** → Pattern B.
- **Project-type detection that recommends the next skill in a domain workflow?** → Pattern B, Thin Workflow Router variant.
- **Codebase detection that selects one framework within a larger parent workflow?** → Pattern C.

---

## Pattern A — Framework Decomposition + Synthesis

> **Execution model:** Pattern A research orchestrators advance through their frameworks using the **Research Session Loop** — each invocation runs one heavy phase and stops, and the orchestrator re-invokes itself to continue. State lives in a run manifest plus the research artifacts themselves, so there is no separate task queue. The full ladder, state-detection precedence, run-manifest contract, and naming/archive rules are defined in `docs/research-session-loop-convention.md`. This section summarizes the responsibilities and modes; that document is authoritative for the loop.

### Frontmatter Contract

Orchestrators use `invocation: orchestrator` in frontmatter. Framework subskills use `invocation: sub-skill` and `parent: {orchestrator-name}`.

### Directory Structure

```
packs/<pack>/claude/<orchestrator>/
  SKILL.md                          # orchestrator — mode detection, selection, synthesis
  CHANGELOG.md
  ALIGNMENT-PAGE.md
  archive/
  frameworks/
    <framework-slug>/
      SKILL.md                      # sub-skill — single framework analysis
      CHANGELOG.md
      ALIGNMENT-PAGE.md
      archive/
```

### Orchestrator Responsibilities

1. **Mode detection** — inspect project state (codebase, research artifacts, customer feedback, arguments) to determine which mode applies (e.g. pre-product vs product-exists).
2. **Framework recommendation** — present available frameworks as a multi-select alignment page with mode-appropriate defaults pre-checked and optional frameworks available.
3. **Self-advancing execution** — record the approved framework selection in a run manifest, then advance one phase per invocation: each re-invocation runs the next pending framework's subskill inline (following its staged research workflow) and stops. State is the run manifest plus canonical-intermediate file existence — no separate task queue. Progress is derived from which intermediates exist. See `docs/research-session-loop-convention.md`.
4. **Synthesis** — once every selected framework intermediate exists (auto-detected; an explicit `--synthesize` may also be accepted), read all intermediates and synthesize into the canonical deliverable. Present via alignment page before writing, then archive the run manifest.
5. **Terminal handoff** — pending review gates end with `## Next Work` only: tell the user to review the page, clear context, and paste the compiled YAML into a fresh session. The compiled YAML includes the parent command in `command` and `agent_routing.command`, so do not add a separate review-pending command section. After an approved artifact write, use `## Recommended Next Command`. Cross-skill routing appears only after synthesis is approved and written. To continue the loop before then, route to the orchestrator's **own** re-invocation.
6. **Post-canonical amendment routing** — after synthesis is approved and canonical research exists, bounded low/medium corrections such as one missed competitor or one corrected source fact may route to `research-amend`. High-impact or systemic changes still route to affected framework/synthesis reruns or a full Pattern A rerun. Pending `review` pages never use amendment/downstream routing; they use only the approval YAML path.

### Subskill Responsibilities

1. **Inherit product-path scope** from the orchestrator's scope resolution convention.
2. **Own framework-specific analysis** — each subskill applies one named framework or methodology.
3. **Write to intermediate path** — `research/{orchestrator}-{framework-slug}.md` (or `research/{slug}/{orchestrator}-{framework-slug}.md` in product-path mode).
4. **Follow staged research workflow** — working packet → alignment page → approved write.
5. **Parent-owned handoff only** — subskills do not emit `Recommended next skill`, child framework commands, or downstream commands. When run inline, their pending-review handoff uses the parent orchestrator's `## Next Work` YAML-paste instruction; the orchestrator handles downstream routing after synthesis.

### Deliverable Naming

| Artifact | Path |
|----------|------|
| Framework intermediate | `research/{orchestrator}-{framework-slug}.md` |
| Synthesized canonical | `research/{orchestrator}.md` |
| Product-path intermediate | `research/{slug}/{orchestrator}-{framework-slug}.md` |
| Product-path canonical | `research/{slug}/{orchestrator}.md` |

### Execution Model — the Research Session Loop

Each invocation runs **one heavy phase** and stops; the orchestrator re-invokes itself to continue, so every phase gets a fresh context window. Each session is `(consume any pasted gate YAML) → (one heavy phase) → (emit next gate) → stop`.

```
Session 1   /orchestrator               → deep interview → write preliminary handoff → stop
Session 2   /orchestrator               → read handoff → build framework multi-select page → stop
Session 3   /orchestrator (+ YAML)      → record selection (light) → run framework 1 inline → page → stop
Session 4…N /orchestrator (+ YAML)      → write prior intermediate (light) → run next pending framework → stop
Session N+1 /orchestrator (+ YAML)      → all intermediates exist → synthesize → page → write canonical → stop
```

State is resolved on each invocation from pasted-YAML + filesystem (the run manifest plus which canonical intermediates exist), not from flags. The full ladder and precedence are in `docs/research-session-loop-convention.md`.

### Shortcut Modes

Orchestrators may define shortcut invocations (e.g. `/journey-map product`) that skip the interview and multi-select and record a fixed framework set directly into the run manifest. Shortcuts then enter the same self-advancing loop — each subsequent re-invocation runs the next pending framework, driven by the run manifest.

### Operational Modes Summary

Mode is auto-detected from pasted-YAML + filesystem state on each invocation (the Research Session Loop ladder):

| State | Detected from | Behavior |
|-------|---------------|----------|
| Interview | no prior artifacts | deep interview → preliminary handoff → stop |
| Select | handoff exists, no selection recorded | build multi-select alignment page → stop |
| Advance | selection recorded, ≥1 framework pending | run next pending framework inline → page → stop |
| Synthesize | all selected intermediates exist, no canonical | synthesize → alignment page → write canonical |
| Shortcut | per-orchestrator keyword | record fixed framework set → enter Advance |

A pasted compiled YAML is consumed first: `ready-for-agent-review` applies the gate then falls through to the next state; `not-approved` amends the named page (a refinement session). Pattern A compiled YAML may include `agent_routing.workflow: pattern-a-research-loop` and a parent `command` to help a fresh agent select the parent orchestrator, but this metadata does not replace parent-owned interpretation. The parent still validates the YAML, resolves the active gate from the run manifest and filesystem, writes or amends artifacts, archives consumed sources, and decides whether to load a framework subskill inline.

---

## Pattern B — Intent Router + Play Composer

### Frontmatter Contract

Intent routers use `type: router` in frontmatter. They do **not** use `invocation: orchestrator` — the `type: router` field distinguishes them from framework-decomposition orchestrators. Routed-to skills are independent peer skills with their own invocation types (typically `primary` or `chained`).

### Directory Structure

Flat — no `frameworks/` directory. The router lives alongside its peer skills in the same pack or routes cross-pack.

```
packs/<pack>/claude/<router>/
  SKILL.md                          # router — intent classification, play composition
  CHANGELOG.md
  archive/
```

### Router Responsibilities

1. **Intent classification** — match user input against a table of intents, signal words, and target skills. The table maps natural-language signals (e.g. "audit", "cadence", "compare") to specific skill invocations.
2. **Single-skill routing** — when intent maps to one skill, recommend it inline with a brief explanation of why.
3. **Play composition** — when a goal requires multiple skills in sequence, compose a named "play" — an ordered checklist of 3–5 skill invocations. Plays are written to `tasks/todo.md` as `- [ ]` items for `/exec` to drive.
4. **Play approval gate** — before writing a play, check for existing unfinished items in `tasks/todo.md`. Present the play steps to the user and write only on approval.
5. **Flag-based modes** — support explicit flags (e.g. `--health`, `--concept`, `--launch`) that bypass intent classification and route directly to predefined plays.

### Status Mode

Routers may define a read-only status mode (e.g. `--status`) that scans research artifacts and reports coverage, staleness, and gaps without writing any files.

### No Synthesis

Pattern B routers do not synthesize outputs. Each routed skill produces independent artifacts. The router is a planning and dispatching layer only.

### Variant: Thin Workflow Router

`devtool-workflow` and `game-workflow` are lightweight routers that share Pattern B's "recommend peer skills" model but differ in key ways:

| Dimension | Full Intent Router (youtube) | Thin Workflow Router |
|-----------|------------------------------|----------------------|
| **Frontmatter** | `type: router` | `invocation: orchestrator`, `type: planning` |
| **Routing signal** | Intent classification table | Project-type check via `.agents/project.json` |
| **Output** | Single skill or multi-step play | Single next-skill recommendation |
| **`tasks/todo.md`** | Writes play checklists | Does not use |
| **Status mode** | Yes (`--status`) | No |
| **Pack guard** | Checks `enabled_packs` before cross-pack routing | Auto-installs own pack if missing |

Thin Workflow Routers are stateless "what's next" advisors. They read project state (existing research artifacts, completed steps) and recommend the single next skill to run, with a brief explanation of the missing artifact or decision that makes it next. They may organize available skills into phases (e.g. early research → prototype → launch) to guide the recommendation.

**When to use the thin variant:** when a domain pack has 5+ skills with a natural ordering but no synthesis step — the router helps users discover the right next skill without requiring them to know the full pack contents.

### Reference Implementations

- `packs/youtube-ops/claude/youtube/` — full intent router with current-meta routing, named plays, status mode, and cross-pack routing
- `packs/devtool/claude/devtool-workflow/` — thin workflow router, project-type guard, implicit skill ordering
- `packs/game/claude/game-workflow/` — thin workflow router, project-type guard, explicit three-phase skill ordering

---

## Pattern C — Detect-and-Route

### Frontmatter Contract

Same as Pattern A: `invocation: orchestrator`. The parent skill uses `type: planning` (not `type: router`). Framework subskills use `invocation: sub-skill` and `parent: {orchestrator-name}`.

### Directory Structure

Same as Pattern A — the parent owns a `frameworks/` directory with child subskills.

```
packs/base/claude/<orchestrator>/
  SKILL.md                          # orchestrator — domain workflow + framework detection
  CHANGELOG.md
  ALIGNMENT-PAGE.md
  archive/
  frameworks/
    <framework-slug>/
      SKILL.md                      # sub-skill — framework-specific guardrails
      CHANGELOG.md
      ALIGNMENT-PAGE.md
      archive/
```

### Key Difference from Pattern A

Pattern A presents frameworks as a multi-select menu and delegates full execution to each selected subskill. Pattern C runs its own multi-step workflow and injects exactly one subskill's content at a specific step based on codebase detection.

The parent skill does the substantive domain work — routing is one step in a larger workflow, not the skill's primary purpose.

### Detection Responsibilities

1. **Dependency grep** — scan `package.json`, import statements, or build config for framework-specific identifiers, following a defined detection order.
2. **Single selection** — route to exactly one framework subskill. Pattern C does not support multi-select.
3. **Disambiguation** — when multiple frameworks are detected, ask the user which to use.
4. **Graceful fallback** — if no subskill matches the detected framework (or no framework is detected), the parent delivers value using baseline guardrails. The parent skill is useful even without any subskill match.

### Subskill Responsibilities

Same as Pattern A: `invocation: sub-skill`, `parent:` field. But subskills in Pattern C typically provide guardrails, constraints, or framework-specific best practices rather than independent research artifacts. The parent integrates their content into its own output.

### No Separate Synthesis

Unlike Pattern A, there is no `--synthesize` mode. The parent skill produces a unified output document that already incorporates the selected subskill's guardrails. There is no intermediate-then-merge workflow.

### Reference Implementation

- `packs/base/claude/animation-design-planner/` — 7-step animation planning workflow, detects motion framework via codebase grep, injects framework-specific guardrails from one of 5 subskills (`motion-framer`, `css-transitions`, `gsap`, `web-animations-api`, `threejs`), produces structured plan with motion contract + storyboard + guardrails + proof gate

---

## Reference Implementations

| Skill | Pack | Pattern | Key traits |
|-------|------|---------|------------|
| `customer-discovery` | business-research | A | 6 frameworks, pre-product/product-exists modes, synthesis |
| `competitive-analysis` | business-research | A | 4 frameworks, market-structure/comparison modes, synthesis |
| `positioning` | business-research | A | 5 frameworks, market/product modes, synthesis |
| `journey-map` | customer-lifecycle | A | 5 frameworks, pre-product/product-exists modes, synthesis |

> **Migration status.** The Research Session Loop is normative for Pattern A. The four Pattern A orchestrators above are migrating from the legacy `tasks/todo.md` + `/exec` execution model to the loop; until each skill's `SKILL.md` is updated it still implements the legacy model. The per-orchestrator rollout checklist is in `docs/research-session-loop-convention.md` § Migration status. Patterns B and C are unaffected.
| `youtube` | youtube-ops | B | current-meta route, named plays, status mode |
| `devtool-workflow` | devtool | B (thin) | Project-type guard, implicit skill ordering |
| `game-workflow` | game | B (thin) | Project-type guard, explicit three-phase ordering |
| `animation-design-planner` | base | C | 5 framework subskills, codebase grep detection, inline guardrail injection |
