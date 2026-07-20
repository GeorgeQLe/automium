# Briefing Slides Convention

This file is the **single authoring source** for the briefing-slides convention. Source checkouts load it from `docs/briefing-slides-convention.md`; packaged installs load the same content from `assets/briefing-slides-convention.md`. Briefing slides are the slide-first review surface for dense alignment pages, interrogation pages, research findings, framework/workshop artifacts, specs, reports, and documentation plans.

Briefing slides do **not** replace dense artifacts. They make review more visual and navigable while preserving dense `alignment/*.html`, `interrogation/*.html`, markdown reports, specs, research notes, and source documents as linked canonical backup/reference surfaces.

## Briefing-First Review Surface

Where this convention is installed, the briefing deck is the **primary review surface** at each interrogation and alignment step, and the dense page is the canonical backup/reference surface. When a producing skill reaches a review/open step and this convention is present, it applies briefing-first:

- The producing skill first authors its dense `interrogation/*.html` or `alignment/*.html` page inline via the shared interrogation-page / alignment-page conventions, exactly as it otherwise would. The dense page remains the canonical backup/reference surface and is never skipped.
- After the dense page exists and has been verified, build `briefing-slides/<skill>-<topic>.html` as the primary review surface for that step, where `<skill>` is the producing command's slug and `<topic>` is the step's topic slug.
- Open **only** the deck. Do not auto-open the dense page or any other linked reference. The dense page stays available as a drill-down fallback surface the reviewer can open manually.
- Link the dense page and every source artifact from the deck using relative reference links/chips (`../interrogation/<page>.html`, `../alignment/<page>.html`, `../research/<file>.md`, etc.), not embeds.
- The compiled full-deck YAML routes back to the **producing command** (not `$create-briefing-slides`, `/create-briefing-slides`, or any other briefing-slides command) via the `command` field, and carries `reference_pages` (the dense page plus every linked page) and `source_artifacts` so the producing skill can resume from the deck.
- Preserve every unanswered gate and all slide feedback across amendments: re-authoring the deck after feedback must not drop unanswered required gates or previously captured feedback/marks/annotations.
- Mark the deck ready for agent review (`approval_status: ready-for-agent-review`) only when **every required gate is approved** and no unresolved revise/down/clarification feedback remains, per the YAML Contract.

This behavior activates purely from the presence of this convention. When this convention is absent (for example on a stable install where the asset is stripped), producing skills fall back to the dense page as the primary review surface with no briefing behavior.

## Gate Parity And Partial Decks

A briefing-first deck must faithfully represent the dense page's review gates.

- **Full parity (default).** A full-review deck must cover **every active required gate** present on the dense page it reviews. For each covered gate, the deck must preserve the gate's identity (the same gate/question), its required-vs-optional status, its approval effect (what approving it authorizes), and its target path (the artifact or destination the gate governs). A full-review deck must carry `data-full-deck-yaml` and may emit `approval_status: ready-for-agent-review` once all required gates are approved.
- **Partial decks.** A reduced-scope deck that intentionally covers only a subset of the dense page's required gates is allowed **only when explicitly labeled partial** (mark the deck with `data-partial-deck` and state the reduced scope on the deck). A partial deck:
  - must emit a partial/incomplete `approval_status` (for example `partial` or `incomplete`) and must **never** emit `ready-for-agent-review`;
  - must preserve the unanswered required gates it does not cover — list them in `unanswered_required_questions` so they are not silently dropped — and must not represent partial coverage as full approval.

## Output Path

Write decks under `briefing-slides/`.

- Default path: `briefing-slides/<owner-or-topic>.html`.
- User-provided output paths must be repo-relative, directly under `briefing-slides/`, and end in `.html`.
- Before replacing an existing deck, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/briefing-slides/<filename>.html`.
- When amending after feedback, visibly mark what changed in the new deck.

## Source And Reference Handling

Identify source artifacts, dense review pages, owning skill or workflow, topic slug, and output path before authoring the deck.

- If a dense `alignment/*.html` or `interrogation/*.html` page exists, read it and use it as a linked reference source.
- If a dense review page is expected but missing, create or ask the owning producing skill to create the dense page first according to its normal convention. Do not replace dense pages with slides.
- Keep dense pages and source documents canonical. Link them from the deck using relative links such as `../alignment/<page>.html`, `../interrogation/<page>.html`, or `../research/<file>.md`.
- Do not embed dense pages with `<iframe>`, `<object>`, or `<embed>`.
- Do not auto-open linked references. After writing or amending artifacts, agents attempt to open only the slide deck.

## Presentation Experience

Build a self-contained HTML slideshow that works from `file://` with no external runtime dependency.

Required presentation controls:

- Full-screen slide-by-slide layout.
- One primary idea per slide.
- Each slide root must carry `data-briefing-slide`.
- Strong visual hierarchy with concise slide notes instead of wall-of-text prose.
- Authored slide content must intentionally fit within the visible slide area at normal desktop and mobile-sized review viewports.
- Do not use hidden overflow, clipped containers, tiny text, or scroll traps as a substitute for making slide content fit.
- Use compact visual structures, short labels, and per-element reference links or chips so slides summarize decisions while dense artifacts carry the detail.
- Previous/next buttons.
- Previous and next controls should expose `data-slide-prev` and `data-slide-next` for static auditing.
- Keyboard navigation: `ArrowLeft`, `ArrowRight`, `A`, `D`, `Home`, `End`, and `Space`.
- Empty-stage click navigation: clicking the deck stage around the visible slide advances to the next slide.
- Stage-click navigation must not hijack clicks inside the slide, links, buttons, form controls, filmstrip controls, topbar, footer, or review inputs.
- Persistent slide counter and progress track.
- The counter and progress track should expose `data-slide-counter` and `data-slide-progress`.
- Hash or local browser state so the current slide can be resumed or linked.
- Agenda or filmstrip navigation when the deck has more than five slides.
- A references slide and per-slide reference chips.
- Reference chips should expose `data-reference-chip`; a references slide should expose `data-references-slide`.
- Print CSS that produces one slide per page.

Use purpose-built visual structures where they clarify the material: decision cards, evidence matrices, comparison tables, canvases, workshop boards, scored options, risk/assumption registers, and compact charts. Avoid using the deck as a raw markdown dump.

## Fit-To-Slide Content

Slides are briefing surfaces, not dense artifacts. Author each slide so the content can be read without scrolling the slide body or discovering hidden overflow.

- Keep headings short, labels compact, and body copy selective.
- Prefer matrices, cards, chips, badges, charts, and concise lists over paragraphs of explanation.
- Link relevant slide elements to `SKILL.md`, convention docs, source markdown, dense review pages, reports, specs, or metadata files for deeper detail.
- Move dense rationale, evidence, edge cases, and procedural detail into linked artifacts instead of stuffing them into the slide.
- A bounded code, YAML, or copy-fallback area may scroll internally only when it is the explicit tool surface for that slide and does not force the slide layout itself to overflow.
- If a slide cannot fit without hiding content, split it into multiple slides or link the detail out.

## Deck Patterns

Choose the pattern that matches the source material.

**Alignment briefing:** problem frame, source/evidence summary, findings, decision options, recommendation, risks/assumptions, proposed artifacts/file changes, gates, references, final response compiler.

**Interrogation briefing:** context, what is being tested, question groups, why each question matters, answer fields, open-question markers, evidence gaps, next-step gates, references, final response compiler.

**Framework/workshop briefing:** framework lens, canvas or matrix, scored options, tradeoffs, implications, workshop decisions, unresolved prompts, references, final response compiler.

**Documentation briefing:** intended audience, source inputs, document structure, claims/evidence map, proposed outline, unresolved decisions, destination paths, references, final response compiler.

## Review Controls

Every deck must support review and feedback directly on the relevant slide.

- Every slide must expose a slide-scoped feedback trigger, such as a Feedback button or chip, marked `data-feedback-trigger`.
- Gate questions must be answerable inline with radio, select, or freeform controls.
- Any slide that contains a required gate question must carry `data-required-gate-slide` on the slide root and maintain `data-gate-status="unanswered"` until every required gate question on that slide has an answer. When all required gate questions on that slide have answers, update the slide root to `data-gate-status="answered"`.
- Required gate slides must show the gate status as a slide-level border: unanswered required gates use a red border, and answered required gates use a green border. Use stable status selectors such as `[data-required-gate-slide][data-gate-status="unanswered"]` and `[data-required-gate-slide][data-gate-status="answered"]` so the static audit can verify both states.
- Slide feedback controls must support at least `emphasize`, `revise`, `needs-clarification`, and freeform notes.
- Marking controls must support per-slide statuses such as `important`, `question`, `approved`, or `skip`, stored in local browser state.
- Annotation controls must allow per-slide notes that are included in compiled YAML.
- Selecting any feedback, mark, annotation, or clarification action must open a slide-scoped sidebar or drawer for the active slide, marked `data-slide-feedback-panel`.
- The sidebar or drawer must update when the active slide changes, preserve inline gate questions on their original slides, and provide the active slide's feedback controls, marks, note field, local slide-feedback YAML, and copy controls.
- The persistent footer or bottom bar may show navigation, progress, slide count, and a compact feedback status or trigger affordance only. When present, mark it `data-briefing-footer`. It must not contain required feedback controls, required gate answers, final approval controls, or compiled YAML output.
- Copy controls must support copying the slide title, selected text where possible, references, and compiled YAML.
- Clipboard writes must use the Clipboard API when available and fall back to selecting a read-only textarea.

Do not use sticky or fixed compile banners. Put compile controls in normal slide flow.

## YAML Contract

Compiled YAML is produced only by local slide-feedback YAML controls in the slide sidebar or near-slide feedback surface, marked `data-slide-feedback-yaml`, and by the final full-deck compiler on the response or final slide, marked `data-full-deck-yaml`. The final full-deck compiler remains in normal slide flow on the last slide or an explicit response slide.

Do not render prior compiled YAML sidecars, answer sidecars, or generated review YAML files as primary slide cards, action chips, or navigation links. If they are needed as provenance, include them in compiled `source_artifacts` and optionally in a dedicated References slide with non-action wording.

Every compiled YAML payload begins with:

```yaml
# Invoke with: <owning-command>
command: "<owning-command>"
briefing_slides: briefing-slides/<name>.html
```

Include:

- `reference_pages`: every dense page or source artifact path linked by the deck.
- `source_artifacts`: source artifact paths or identifiers used to build the deck.
- `gate_answers`: answered gate questions.
- `slide_feedback`: per-slide feedback entries.
- `annotations`: per-slide notes.
- `marked_slides`: per-slide status marks.
- `unanswered_required_questions`: required questions still unanswered.
- `approval_status`: `not-approved` or `ready-for-agent-review`. A partial deck (see Gate Parity And Partial Decks) instead emits a partial/incomplete status such as `partial` or `incomplete` and must never emit `ready-for-agent-review`.

Route review YAML to the owning producing workflow when one exists. Use the briefing-slides skill command only for ad hoc decks that the briefing-slides skill owns.

Set `approval_status: ready-for-agent-review` only when every required gate has an approving answer and there is no unresolved revise, down, or clarification feedback.

## Verification And Opening

Before handoff:

- Run the static convention audit with `npx skillpacks briefing slides audit` from the repository root when the packaged CLI is available. In this source checkout, `node scripts/audit-briefing-slides.mjs` is the direct fallback.
- Re-open the written deck textually and confirm it contains navigation controls, gate controls, feedback controls, YAML compiler, reference links, and print CSS.
- Verify every slide has a feedback trigger and that activating it opens the slide-scoped sidebar or drawer.
- Verify slides with required gate questions visibly change their slide-level border from red when unanswered to green when answered.
- Verify footer or bottom-bar markup does not contain required feedback inputs, required gate inputs, or YAML output textareas.
- Verify prior YAML sidecars are not promoted as primary reference or action links outside a dedicated references or provenance area.
- Confirm every linked dense reference path exists when it is repo-local, or mark missing references visibly in the deck.
- Verify authored slide content fits without incoherent overlap, clipped text, hidden overflow, or slide-body scrolling at a normal desktop viewport and a mobile-sized viewport. Internal scrolling is allowed only for explicit bounded tool surfaces such as YAML output or copy fallback controls.
- Attempt to open only the deck with `npx skillpacks alignment pages open briefing-slides/<name>.html --browser auto`.
- In this source checkout only, if the packaged CLI is unavailable, fall back to `node scripts/open-html-page.mjs briefing-slides/<name>.html --browser auto`.
- Report opener status exactly as `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.

The opener may use the existing alignment page open helper because it is the repository's generic HTML opener; this does not make the deck an alignment page and does not authorize opening dense reference pages.

## Manifest-Driven Skill Decks (this repo)

The `briefing-slides/` skill-deck gallery in this repository — the per-skill decks that summarize each AFPS skill — is **generated**, not hand-authored. It flows manifest → generator → rotating archetypes so ~42 decks read as one designed folder instead of 42 identical layouts. Ad hoc briefing decks that producing skills author for a specific review step (everything above) are unaffected by this section; this pipeline governs only the repo's batch-generated skill gallery.

**Source of truth.** `briefing-slides/_deck-manifest.json` is the hand-editable manifest of skill-deck entries (slug, command, title, family grouping/order, blurb, chips, `skillPath`, `nextSkill`, lead, and the six content `beats`). Edit this file to change deck content; do not hand-edit generated decks.

**Scripts.**

- `scripts/extract-deck-manifest.mjs` — re-runnable, read-only extractor over the legacy hand-authored `afps-skill-*.html` decks. Parses their stable anchors plus `index.html` grouping and `SKILL.md` frontmatter into `_deck-manifest.json` (overwrites it). The bespoke flagship decks are intentionally excluded (see below).
- `scripts/generate-briefing-decks.mjs` — the single generation entry point. No-arg runs a full batch: every manifest deck plus the overviews deck and the index. Flags: `--deck <slug>` (one deck from flagships or manifest), `--manifest`/`--batch` (explicit full batch), `--gallery` (living style-guide `slide-template-gallery.html`), `--flagships` (bespoke flagship decks), `--audit-variety` (report archetype variety).
- `scripts/briefing-deck-manifest.mjs` — maps each manifest entry onto the shared archetype toolbox with rotating archetypes, and builds the manifest-derived overviews deck and theme-aware index.
- `scripts/briefing-deck-flagships.mjs` — the bespoke `FLAGSHIP_DECKS` content (`idea-scope-brief`, `create-briefing-slides`, `release-lane-change-boundary`). These stay bespoke and are **not** folded into the manifest.

**Locked chrome.** Design tokens/chrome CSS live in `scripts/briefing-deck-base.css` and runtime chrome JS in `scripts/briefing-deck-chrome.js`. Both are injected verbatim into every generated deck so there is one place to edit the mechanics. Every emitted deck is theme-aware (light + dark), self-contained (works from `file://`), and conforms to `scripts/audit-briefing-slides.mjs`.

**Rotating-archetype variety rule.** The six fixed content beats map to slides as: 1 overview → `hero` (fixed), 2 when-to-use → rotate POOL2, 3 session → rotate POOL3, 4 expect → rotate POOL4, 5 handoff → rotate POOL5, 6a references → `references` (fixed), 6b gate → `compiler` (fixed). Rotation is `pool[(deckIndex + beatOffset) % pool.length]`: adjacent beat pools are disjoint so neighboring slides in one deck never collide, and the manifest-order `deckIndex` offset makes adjacent folder decks differ. The rotating pools deliberately exclude `meterRow` and `scorecard` — those render numeric gauges/scores and the extracted beat copy carries no honest numbers; `bigStat` is used only as labeled icon tiles, never fabricated metrics.

**Generated decks are not hand-edited.** To change a deck, edit `_deck-manifest.json` (content) or the generator/mapper/chrome scripts (structure or mechanics), then re-run `node scripts/generate-briefing-decks.mjs` and `node scripts/audit-briefing-slides.mjs`.
