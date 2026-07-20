# Founder Devtool Video Prompts Convention

Research date: 2026-06-25.
Parent router: `docs/social-video-content-convention.md`.
Packaged asset: `assets/social/founder-devtool-video-prompts-convention.md`.

Use these prompts only when the source basis exists. Each prompt must be specialized to the selected channel and drafting mode. Approval of a prompt concept is not approval to publish or record private screens.

## Prompt Families

### Before And After

- **Use when:** There is a public or sanitized before/after artifact.
- **Hook:** "This looked simple until we saw the old flow."
- **Structure:** Problem state, constraint, change, result, lesson.
- **Risk:** Medium; before/after claims can overstate impact.
- **Safety checks:** Verify screenshots, metrics, and user/customer context.

### Bug Hunt Or Incident Lesson

- **Use when:** The incident is public or fully sanitized.
- **Hook:** "The bug was not where we expected."
- **Structure:** Symptom, false lead, root cause, fix, prevention.
- **Risk:** High; incidents often expose private data or blame.
- **Safety checks:** Remove customer, uptime, security, and personnel details unless approved.

### Architecture Decision

- **Use when:** There is an approved technical decision or design note.
- **Hook:** "We chose the boring option for a reason."
- **Structure:** Options, constraint, decision, tradeoff, what to revisit.
- **Risk:** Medium; avoid exposing private architecture or security posture.
- **Safety checks:** Keep diagrams sanitized and avoid infrastructure identifiers.

### Changelog Demo

- **Use when:** A feature, skill, package, or workflow change is public.
- **Hook:** "Tiny change, better workflow."
- **Structure:** Before, new behavior, example, why it matters, next safe step.
- **Risk:** Low to medium.
- **Safety checks:** Do not promise availability beyond what is shipped.

### Research Insight

- **Use when:** A research synthesis has approved public-safe findings.
- **Hook:** "The surprising part was not the answer; it was the assumption."
- **Structure:** Question, evidence, insight, implication, caveat.
- **Risk:** Medium to high.
- **Safety checks:** No confidential interview details, customer names, or overgeneralized market claims.

### Benchmark Or Measurement

- **Use when:** Public benchmark methods and results are approved.
- **Hook:** "The number changed only after we measured the right thing."
- **Structure:** Baseline, method, result, caveat, decision.
- **Risk:** High.
- **Safety checks:** Include methodology, avoid cherry-picking, and do not compare competitors without evidence.

### Weekly Work Summary

- **Use when:** There is an approved weekly work summary.
- **Hook:** "This week we learned where the workflow breaks."
- **Structure:** Shipped, learned, changed, still uncertain, next approved question.
- **Risk:** Medium.
- **Safety checks:** Do not disclose private roadmap or unfinished commitments.

## Output Fields

- `prompt_family`
- `source_basis`
- `target_channel`
- `drafting_mode`
- `hook`
- `structure`
- `visual_plan`
- `risk_level`
- `claim_safety_notes`
- `asset_safety_notes`
- `publish_precheck`

## Sources Accessed 2026-06-25

- Sprout Social, [How to Create a Social Media Content Strategy](https://sproutsocial.com/insights/social-media-content-strategy/), published 2026-03-25.
- See selected channel convention for platform-specific official sources.
