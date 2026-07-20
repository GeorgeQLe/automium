# Social Ledger Convention

Research date: 2026-06-26.
Canonical package asset: `assets/social-ledger-convention.md`.
Parent router: `docs/social-post-convention.md`.

This is the system-of-record contract for alignment-producing agents that draft, approve, post, and promote social content. It defines how an agent finds prior posts, avoids duplicates, records what was drafted and published, links public-safe context, and keeps canonical records private. Load this file when a social drafting workflow needs cross-run memory of social activity or a public alignment context link; it is not needed to draft a single one-off post with no ledger.

## Resolution Order

Resolve the ledger by **posting identity first, then project**. A single account can post about multiple projects, so duplicate detection and promo cadence are account-scoped, not only repo-scoped. A project that owns its own account can keep a project-local ledger with no central account ledger.

Resolve scope from project config **before drafting**, not by asking on every run. Read these fields from `.agents/project.json` under a `social_ledger` key (or a project-documented equivalent):

| Field | Meaning | Example |
| --- | --- | --- |
| `mode` | `local`, `central`, or `both` | `central` |
| `account_id` | Posting identity that owns the ledger | `george-x` |
| `central_repo` | Private repo holding central account ledgers | `GeorgeQLe/me` |
| `central_path` | Path template inside the central repo | `social-ledger/accounts/<account-id>/posts` |
| `local_path` | Path for project-local records | `social/posts` |

If config is missing, default to the **local project ledger** unless the user explicitly selects a central account ledger, and offer to persist the resolved scope to project config so later runs do not re-ask.

## Ledger Scope

| Scope | Use When | Canonical Path | Agent Behavior |
| --- | --- | --- | --- |
| Project-local ledger | The project owns the posting account, or posts do not need cross-project dedupe. | `social/posts/*.yaml` in the project repo. | Read and write only local records for that project/account. |
| Central account ledger | One personal or brand account posts across many projects. | `social-ledger/accounts/<account-id>/posts/*.yaml` in the configured private central repo, defaulting to `GeorgeQLe/me`. | Read account-wide history before drafting; write approved drafts and posted URLs to the central account ledger. |
| Both local and central | The project needs local provenance and the shared account needs account-wide dedupe. | Local mirror plus central canonical account record. | Prefer central for dedupe and status; keep a local pointer or copy for project provenance. |
| Public gBrain projection | A public-safe alignment doc should provide context for a post. | `https://6eorge.com/brain/<project-id>/<doc>.html`. | Link only approved public-safe docs; never publish private ledger records. |

The canonical ledger is **private by default**. The only public surface is the sanitized alignment archive link and any post metadata the user explicitly approves.

## Record Shape

Each record must be stable enough for a later agent to answer what has already been drafted, approved, posted, linked, and promoted.

```yaml
id: 2026-06-25-social-ledger-public-archive
account_id: george-x
project_id: agentic-skills
channel: x
topic: Social ledger and public archive
status: approved_draft
source_alignment_page: alignment/social-ledger-public-archive.html
public_alignment_url: https://6eorge.com/brain/agentic-skills/social-ledger-public-archive.html
drafting_mode: creator_inspired
post_mode: post_plus_replies
main_post: "..."
reply_chain:
  - purpose: full_alignment_doc
    text: "Full alignment doc for context: ..."
    url: https://6eorge.com/brain/agentic-skills/social-ledger-public-archive.html
  - purpose: skill_promo
    text: "The workflow is powered by skillpacks: ..."
    url: https://www.npmjs.com/package/skillpacks
published_urls: []
dedupe_fingerprint: "x:agentic-skills:social-ledger-public-archive"
risk_notes: []
```

**Statuses:** `draft`, `approved_draft`, `posted`, `skipped`, `needs_revision`, `retired`. `published_urls` stays empty until a human posts manually and records the live URL.

**`reply_chain` purposes:** `full_alignment_doc` (public gBrain context link), `skill_promo` (contextual install/source link), or another labeled purpose. Keep one purpose per reply.

## Duplicate Detection

Before drafting, read the resolved ledger (account-wide for `central`/`both`, project-local for `local`) and check the `dedupe_fingerprint` of prior records.

- Fingerprint shape: `<channel>:<project_id>:<topic-slug>`.
- If a matching fingerprint already has a `posted` record, do not re-draft the same angle silently. Surface the prior post (and its `published_urls`) and ask whether to skip, post a genuinely new angle, or follow up.
- Promo cadence is account-scoped: avoid repeating the same skill-promo wording across recent posts on the same account even when projects differ.

## Public Archive Link Handling

Public-safe alignment context links resolve to the gBrain archive at `https://6eorge.com/brain/<project-id>/<doc>.html`, served from the private `GeorgeQLe/me` repo's `/brain` route. The `agentic-skills` source alignment HTML is synced into gBrain by the configured alignment-archive sync.

Before proposing a `public_alignment_url`, the agent must verify the source page is safe for public viewing and is either already synced to gBrain or approved to sync. Do not invent a public URL for a page that has not been published.

## Public Safety Boundary

Keep canonical ledger records private. Publish only public-safe alignment docs and post metadata the user explicitly approves — users approve what is put out publicly.

Do not publish: secrets, credentials, internal account tokens, private repo details, confidential customer names, private research inputs, unverifiable metrics, or recurring reply templates that create spam risk. This boundary is in addition to, not a replacement for, the source-safety rules in `docs/social-post-convention.md`.

## X Posting Pattern

The preferred X output is `post_plus_replies`: a main insight post, a first reply carrying the public alignment context link, and an optional second reply with a relevant skill/package link. See `docs/social/x-post-convention.md` for the channel-level shape; this convention governs how those parts are recorded in the ledger.

- **Main post** must stand alone as the insight, lesson, result, or decision. It must not depend on the link to be useful.
- **First reply** uses a public gBrain URL only when the alignment doc is approved for public context.
- **Optional skill reply** is used only when the post is actually about Agentic Skills, the workflow, or a reusable skill. Rotate wording to avoid repetitive promo.

## Skill Promo Policy

Contextual skill-promo replies are allowed with rotated wording. Default the promo target by intent:

- **npm** (`https://www.npmjs.com/package/skillpacks`) when install or use is the point.
- **GitHub** when source, docs, or contribution context matters.

Do not generate a promo reply when the post is not genuinely about the skills/workflow, and do not reuse identical promo wording across recent posts on the same account.

## Out Of Scope (This Build)

Automation scripts (ledger YAML validation, account-history summary, central sync/read helpers) are deferred. This convention defines the contract; add scripts only under separate approval.
