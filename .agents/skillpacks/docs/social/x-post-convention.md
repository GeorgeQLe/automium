# X Post Convention

Research date: 2026-06-25.
Parent router: `docs/social-post-convention.md`.
Packaged asset: `assets/social/x-post-convention.md`.

## Rules Vs Norms

- Platform official guidance comes from X Help and X policy docs.
- Practitioner norms for hooks, threads, and fast commentary are optional and must not override X rules or source safety.

## Channel Profile

**Audience expectation:** Fast-moving public conversation, concise takes, live build notes, technical debates, launch updates, and short threads.

**Format patterns:** Single sharp post, short thread, quote/reply to public source, changelog note, screenshot plus context, or question framed for technical discussion.

**Length guidance:** X Help lists 280 characters for standard posts and longer post limits for premium surfaces. Default to 280 characters for portable drafts unless the user selects a long-post mode.

**Link, hashtag, and media norms:** X posts can include text, links, photos, GIFs, and video. X Help recommends no more than two hashtags as a best practice. Practitioner norm is to lead with the takeaway, put the link after context, and use threads only when the post needs multiple beats.

**Tone:** Direct, concise, and conversational. Technical specificity beats broad claims.

**Spam triggers:** X policy calls out platform manipulation, repetitive posts, link-only or duplicate content, unrelated hashtags, deceptive links, and artificial engagement.

**Source-safety risks:** Screenshots can leak private repo or customer details. Hot takes can overstate evidence. Threads can compound unsupported claims.

## Drafting Modes

**`platform_aligned`:** Draft one concise post under the standard limit with no more than two relevant hashtags and no engagement bait.

**`creator_inspired`:** Draft a short hook plus useful technical lesson, optionally with a thread outline that each carries one sourced claim.

## Post Plus Replies Pattern

The preferred X shape for build-in-public is `post_plus_replies`:

1. **Main post** — a standalone insight, lesson, result, or decision under the standard 280-character limit. It must read fully on its own without the link.
2. **First reply** — public alignment context via a gBrain URL (`https://6eorge.com/brain/<project-id>/<doc>.html`), used only when the alignment doc is approved for public viewing and synced or approved to sync.
3. **Optional second reply** — a contextual skill/package link, used only when the post is genuinely about Agentic Skills, the workflow, or a reusable skill. Rotate wording; default to npm for install/use and GitHub for source/docs/contribution. Do not reuse identical promo wording across recent posts on the same account.

Use a single post when there is no public-safe context link and no genuine skill relevance. Record `post_mode` and the `reply_chain` (each reply tagged with a `purpose`) per `docs/social-ledger-convention.md`.

## Publish Precheck

- Verify the account supports any requested long-post format.
- Confirm screenshots are redacted.
- Keep hashtags relevant and limited.

## Sources Accessed 2026-06-25

- X Help, [How to Post](https://help.x.com/en/using-x/how-to-post), [How to Use Hashtags](https://help.x.com/en/using-x/how-to-use-hashtags), [The X Rules](https://help.x.com/en/rules-and-policies/x-rules), and [Authenticity / Platform Manipulation and Spam](https://help.x.com/en/rules-and-policies/platform-manipulation).
- Sprout Social, [How to Create a Social Media Content Strategy](https://sproutsocial.com/insights/social-media-content-strategy/), published 2026-03-25.
