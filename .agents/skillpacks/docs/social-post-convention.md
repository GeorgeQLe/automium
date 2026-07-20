# Social Post Convention

Research date: 2026-06-25.
Canonical package asset: `assets/social-post-convention.md`.
Channel docs directory: `docs/social/` in a source checkout, `assets/social/` in a packaged install.

This is the thin router and shared contract for alignment-producing agents that draft source-safe text/community posts. Load this file first. Load only the selected channel docs from `docs/social/` or `assets/social/`.

For cross-run memory of what has already been drafted, approved, posted, and promoted — and for public-safe alignment context links — also load the system-of-record contract `docs/social-ledger-convention.md` (`assets/social-ledger-convention.md` in a packaged install). It defines ledger resolution, the post record schema, account-scoped duplicate detection, the gBrain public archive link, and the public/private boundary.

## Routing Rule

Do not load every social channel convention by default. After the user selects target channels, load only the matching channel files:

| Target channel | Source checkout doc | Packaged asset |
| --- | --- | --- |
| LinkedIn posts | `docs/social/linkedin-post-convention.md` | `assets/social/linkedin-post-convention.md` |
| X posts | `docs/social/x-post-convention.md` | `assets/social/x-post-convention.md` |
| Bluesky posts | `docs/social/bluesky-convention.md` | `assets/social/bluesky-convention.md` |
| Threads posts | `docs/social/threads-convention.md` | `assets/social/threads-convention.md` |
| Mastodon posts | `docs/social/mastodon-convention.md` | `assets/social/mastodon-convention.md` |
| Reddit posts | `docs/social/reddit-convention.md` | `assets/social/reddit-convention.md` |
| Hacker News submissions/comments | `docs/social/hacker-news-convention.md` | `assets/social/hacker-news-convention.md` |
| YouTube Community posts | `docs/social/youtube-community-convention.md` | `assets/social/youtube-community-convention.md` |

If a target channel is not listed, do not infer a channel profile. Ask for approval to create a new channel convention or draft from this shared contract only with explicit `unsupported_channel` risk.

## Rules Vs Norms

- **Platform official guidance** is treated as a rule or hard constraint. It includes help-center docs, community guidelines, product docs, and explicit platform policy.
- **Creator/practitioner norms** are optional style guidance. They can improve fit, but they are not policy and must never override platform rules, user instructions, source safety, or accuracy.
- If official guidance and practitioner advice conflict, follow official guidance and explain the tradeoff in the draft review.
- If a platform limit is account-, client-, subscription-, region-, or server-dependent, draft below the conservative default and tell the user what to verify before publishing.

## Agent Source-Safety Rules

Every proposed post must be safe to publish from the evidence the agent can actually see.

Do not include:

- Unsupported performance, adoption, revenue, benchmark, security, or quality claims.
- Private user, customer, repo, incident, prompt, or session context.
- Secrets, credentials, tokens, hostnames, account identifiers, private URLs, screenshots with sensitive data, or proprietary implementation details.
- Confidential research inputs, interview quotes, customer names, company names, or logos without permission.
- Unverifiable metrics, "first", "best", "only", "guaranteed", or "production-ready" claims without source evidence.
- Premature commitments about roadmap, launch date, pricing, compliance, availability, or support.
- Deceptive AI, sponsorship, employment, affiliation, or paid-promotion framing.

Each post option must include:

- `target_channel`: platform or community.
- `drafting_mode`: `platform_aligned` or `creator_inspired`.
- `source_basis`: the specific work artifact, finding, changelog item, commit, public source, or approved user statement supporting the post.
- `fresh_audience_context`: the plain-language project/work context a reader needs before the post makes sense.
- `jargon_expansion`: acronyms, internal labels, and project-specific terms expanded or replaced with public wording.
- `public_significance`: why the work matters to the target audience without relying on private project history.
- `risk_level`: `low`, `medium`, or `high`.
- `claim_safety_notes`: what was omitted, softened, or needs human approval.
- `publish_precheck`: account/community-specific checks before posting.

## Drafting Modes

`platform_aligned`:

- Stays close to official platform rules, product constraints, and community standards.
- Uses conservative length and media choices.
- Avoids growth hacks, engagement bait, vague virality tactics, or unverified trend participation.
- Prefers clarity, accessibility, attribution, and explicit source boundaries.

`creator_inspired`:

- May use current creator/operator norms, such as stronger hooks, opinionated framing, narrative arcs, "what changed" posts, or native-format repurposing.
- Must label the basis as practitioner norm, not platform policy.
- Must keep claims source-safe and avoid bait, exaggeration, or community-hostile self-promotion.

When useful, generate both modes side by side so the user can choose between conservative platform fit and a more expressive creator version.

## Cross-Channel Defaults

- Start from the work, not the channel. Identify the approved artifact, evidence, or outcome first.
- Write for a fresh audience by default. If a post depends on internal context, add a short setup clause, define the term, or reject the angle as not publicly legible.
- Prefer one clear idea per post. For multi-part work, create a thread, carousel, separate posts, or community discussion prompt only when the platform supports it and the user approves.
- Use links as evidence or next action, not as the whole post. Avoid link-only posts except where community norms explicitly favor source submission.
- Avoid unrelated hashtags. Use zero to two where hashtags are useful and accepted; use more only if the platform/community norm clearly supports it.
- Add alt text or accessible text equivalents for images when the platform supports it.
- Do not ask for votes, upvotes, artificial engagement, brigading, or coordinated amplification.
- For cross-posting, rewrite natively for each channel. Do not paste the same copy across platforms without adapting length, tone, link behavior, and community expectations.

## Post Plus Replies And Context Links

Some channels support a `post_plus_replies` shape: a standalone main post, a first reply that adds a public-safe alignment context link, and an optional contextual skill-promo reply. Where the channel supports threading (for example X), prefer this shape over packing a link into the main post.

- **Main post**: stands alone as the insight, lesson, result, or decision. Do not make it depend on the link.
- **Context reply**: links a public-safe alignment doc (the gBrain projection, `https://6eorge.com/brain/<project-id>/<doc>.html`) only when that doc is approved for public viewing and synced or approved to sync. See `docs/social-ledger-convention.md`.
- **Skill-promo reply** (optional): only when the post is genuinely about Agentic Skills, the workflow, or a reusable skill. Use rotated wording — npm (`https://www.npmjs.com/package/skillpacks`) when install/use is the point, GitHub when source/docs/contribution context matters. Never reuse identical promo wording across recent posts on the same account.

Record the chosen `post_mode`, `main_post`, and `reply_chain` (each reply tagged with a `purpose`) in the ledger per `docs/social-ledger-convention.md`.

## Review Output Shape

When an alignment page uses this convention, render channel decisions in a table or cards with these fields:

- `channel`
- `drafting_mode`
- `angle`
- `source_basis`
- `audience`
- `fresh_audience_context`
- `jargon_expansion`
- `public_significance`
- `format`
- `draft`
- `risk_level`
- `claim_safety_notes`
- `platform_or_community_precheck`
- `loaded_channel_convention`
- `post_mode`: `single_post` or `post_plus_replies`
- `reply_chain`: ordered replies, each with `purpose` (`full_alignment_doc`, `skill_promo`, or other), `text`, and optional `url` (for `post_plus_replies`)
- `user_decision`: `approve`, `revise`, `reject`, or `not-now`

Final YAML should preserve selected channels, loaded convention paths, user selections, rejected angles, requested edits, and any channel-specific pre-publish checks.
