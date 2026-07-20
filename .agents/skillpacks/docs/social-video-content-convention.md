# Social Video Content Convention

Research date: 2026-06-25.
Canonical package asset: `assets/social-video-content-convention.md`.
Channel docs directory: `docs/social/` in a source checkout, `assets/social/` in a packaged install.

This is the thin router and shared contract for alignment-producing agents that draft source-safe video ideas, outlines, hooks, and scripts. Load this file first. Load only the selected channel or prompt docs from `docs/social/` or `assets/social/`. This convention covers ideation and scripting guidance only; it does not authorize auto-publishing, video production, scraping, uploading, or account operations.

## Routing Rule

Do not load every social video convention by default. After the user selects target channels or prompt families, load only the matching files:

| Target channel or prompt family | Source checkout doc | Packaged asset |
| --- | --- | --- |
| YouTube long-form | `docs/social/youtube-long-form-convention.md` | `assets/social/youtube-long-form-convention.md` |
| YouTube Shorts | `docs/social/youtube-shorts-convention.md` | `assets/social/youtube-shorts-convention.md` |
| TikTok | `docs/social/tiktok-convention.md` | `assets/social/tiktok-convention.md` |
| Instagram Reels | `docs/social/instagram-reels-convention.md` | `assets/social/instagram-reels-convention.md` |
| LinkedIn video | `docs/social/linkedin-video-convention.md` | `assets/social/linkedin-video-convention.md` |
| Founder/devtool reusable video prompts | `docs/social/founder-devtool-video-prompts-convention.md` | `assets/social/founder-devtool-video-prompts-convention.md` |

If a target channel is not listed, do not infer a channel profile. Ask for approval to create a new channel convention or draft from this shared contract only with explicit `unsupported_channel` risk.

## Rules Vs Norms

- **Platform official guidance** is treated as rule-level guidance: help-center docs, product docs, advertising specs, creator safety docs, and community guidelines.
- **Creator/practitioner norms** are optional style guidance: hook patterns, pacing, repurposing tactics, caption habits, thumbnail conventions, and common duration preferences.
- If official guidance conflicts with creator advice, use official guidance and explain the conflict.
- If a limit varies by account verification, region, app surface, ad format, or current experiment, draft conservatively and mark the pre-publish check.

## Agent Source-Safety Rules

Video ideas are high leak-risk because scripts often reference screens, metrics, customers, and demos. Do not propose or script:

- Private dashboards, customer data, repo internals, incident timelines, prompts, logs, secrets, tokens, hostnames, keys, or unredacted terminal output.
- Customer names, logos, testimonials, quotes, or usage metrics without explicit approval.
- Benchmark, performance, security, compliance, quality, or adoption claims without a named source basis.
- Unannounced launch dates, roadmap promises, pricing, support commitments, or integration promises.
- AI-generated likeness, voice, screenshot, or synthetic demonstration without disclosure and platform-specific AI/synthetic media compliance.
- Music, clips, memes, watermarked footage, or third-party assets without rights.

Every video concept must include:

- `target_channel`
- `drafting_mode`: `platform_aligned` or `creator_inspired`
- `source_basis`
- `fresh_audience_context`: the plain-language project/work context a viewer needs before the idea makes sense.
- `jargon_expansion`: acronyms, internal labels, and project-specific terms expanded or replaced with public wording.
- `public_significance`: why the work matters to the target audience without relying on private project history.
- `format`: long-form, short-form, native feed video, poll/post-adjacent video, or reusable prompt
- `hook`
- `outline_or_script`
- `visual_plan`
- `risk_level`
- `claim_safety_notes`
- `asset_safety_notes`
- `publish_precheck`
- `loaded_channel_convention`

## Drafting Modes

`platform_aligned`:

- Follows official constraints and safety guidance.
- Uses conservative duration, aspect ratio, title, description, caption, disclosure, and copyright assumptions.
- Prioritizes accessibility, clear metadata, and accurate source boundaries.

`creator_inspired`:

- May use current creator/operator norms: faster hooks, before/after structure, behind-the-scenes narrative, screen-recording pacing, native captions, and repurposed cuts.
- Must label those as practitioner norms, not platform policy.
- Must not use bait, fake urgency, misleading retention tactics, or unsupported claims.

## Cross-Channel Defaults

- Confirm the publish goal before scripting: teach, announce, demo, recruit feedback, summarize research, or invite discussion.
- Assume viewers have no project history. Put the setup, term definitions, and stakes in the hook or first beat; reject ideas that only make sense to insiders.
- Make one core claim per short video and one coherent arc per long-form video.
- Write the claim before the hook. Hooks may be punchy, but they must remain true.
- Include caption/subtitle notes whenever the platform supports or expects silent playback.
- Mark any screen capture as `needs-redaction-review` unless the content is already public or explicitly approved.
- Prefer showing a public artifact, sanitized diagram, public changelog, or recreated demo data over recording private product state.
- Include "what not to show" notes for every demo concept.
- Do not promise a follow-up video, launch, benchmark, or feature unless the user approves the commitment.

## Review Output Shape

When an alignment page uses this convention, render video ideas with these fields:

- `channel`
- `drafting_mode`
- `format`
- `idea_title`
- `source_basis`
- `fresh_audience_context`
- `jargon_expansion`
- `public_significance`
- `hook`
- `outline_or_script`
- `visual_plan`
- `caption_or_description`
- `risk_level`
- `claim_safety_notes`
- `asset_safety_notes`
- `publish_precheck`
- `loaded_channel_convention`
- `user_decision`: `approve`, `revise`, `reject`, or `not-now`

Final YAML should preserve selected video ideas, rejected ideas, user edits, mode decisions, target channel decisions, loaded convention paths, and publish-readiness checks. Approval of a video idea is not approval to publish; it only authorizes the producing skill to record the approved content decisions and continue the alignment flow.
