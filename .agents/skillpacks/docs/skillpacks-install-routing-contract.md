# Skillpacks Install Routing Contract

Status: active contract for skill wording remediation
Last updated: 2026-06-13
Primary source: `research/skillpack-cli-routing-audit.md`

This contract defines the canonical wording for install-route guidance in active `SKILL.md` files and supporting docs. The standard agent-facing install route is now `npx skillpacks install <pack-or-skill>` from the target project shell. Runner-native `/pack install` and `$pack install` wording is legacy and must appear only in archived snapshots, explicit legacy explanations, or allowlisted fixtures.

The scoped alias package `@glexcorp/gskp` is published from the same release artifact and version. It is valid equivalent user guidance when package identity matters, but the default public examples should use `npx skillpacks ...`.

## Terms

- **Project shell route:** the standard command the user runs from the target project directory through the published package, such as `npx skillpacks install <pack>`.
- **Source-checkout route:** a command the user runs from or through a local clone of this repository, such as `scripts/pack.sh install <pack>`.
- **Legacy in-agent route:** a deprecated command the user runs inside Claude Code or Codex, such as `/pack install <pack>` or `$pack install <pack>`.
- **Deck route:** a curated deck install command, always expressed as `npx skillpacks install-deck <deck>`.

## Wording Matrix

| Scenario | Canonical wording |
| --- | --- |
| Pack install | `If the target pack is not enabled, recommend npx skillpacks install <pack> from the project shell.` |
| Individual skill install | `If only this skill is needed, recommend npx skillpacks install <skill> from the project shell.` |
| Missing skill fallback | `If found in an uninstalled pack, recommend npx skillpacks install <skill> for just that skill or npx skillpacks install <pack> for the full pack.` |
| Source-checkout maintenance | `For explicit source-checkout maintenance, scripts/pack.sh install <pack-or-skill> remains supported. Do not present it as the standard agent-facing route.` |
| Legacy route explanation | `Legacy /pack install and $pack install wording may be mentioned only to explain old snapshots or migrations, not as active guidance.` |
| Deck install | `For curated workflow decks, use npx skillpacks install-deck <deck>. Do not describe deck installation as /pack install <deck>, $pack install <deck>, or npx skillpacks install <deck>.` |

## Pack Availability Guard Boilerplate

Claude-facing skills should use this pattern when they recommend a skill from a pack that may not be enabled:

```markdown
## Pack Availability Guard

When recommending a skill from another pack, verify the target pack is installed via `.agents/project.json` `enabled_packs`. If it is not enabled, recommend `npx skillpacks install <pack>` from the project shell. After install, tell Claude users to run `/reload-skills`, then `/clear` or restart if the skill remains invisible.
```

Codex-facing skills should use the same structure with Codex syntax:

```markdown
## Pack Availability Guard

When recommending a skill from another pack, verify the target pack is installed via `.agents/project.json` `enabled_packs`. If it is not enabled, recommend `npx skillpacks install <pack>` from the project shell. After install, tell Codex users to start a fresh Codex CLI session if the `$` skill list remains stale.
```

Use `<skill>` instead of `<pack>` when the intended install unit is one individual skill. Use `<pack-or-skill>` only in general-purpose installer or discovery docs where both units are explicitly valid.

## Decision Rules

- Use `npx skillpacks install <pack-or-skill>` for active agent-facing pack or skill install guidance.
- Preserve `scripts/pack.sh` only where text is explicitly about this source checkout, local development, or shell-backed compatibility behavior.
- Treat `/pack install`, `$pack install`, and generic `pack install` as legacy guidance requiring an explicit allowlist when present in active files.
- Use `npx skillpacks install-deck <deck>` only for deck installs. Deck wording must not be satisfied by `npx skillpacks install <pack-or-skill>`.
- Do not update active `SKILL.md` content without applying skill versioning: archive current `SKILL.md`, bump the active `version:`, and update the skill `CHANGELOG.md` where applicable.
- Exclude `archive/**` snapshots from active-routing remediation and validation unless the task explicitly audits historical wording.

## Validation Targets

The follow-up validation rule should scan active `SKILL.md` files under `base/` and `packs/`, excluding `archive/**`, and report install-route wording that omits the relevant npm CLI route.

Candidate trigger text:

- `/pack install`
- `$pack install`
- `pack install`
- `scripts/pack.sh install`
- `Pack Availability Guard`
- `Missing Skill Fallback`
- `install-deck`

Expected npm evidence:

- Pack or individual skill installs mention `npx skillpacks install`.
- Deck installs mention `npx skillpacks install-deck`.
- Source-checkout-only exceptions are explicit and auditable through an allowlist or fixture comment.
- Legacy `/pack install` and `$pack install` guidance fails unless explicitly allowlisted.
