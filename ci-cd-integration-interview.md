# CI/CD Integration — Interview Log

## Interview Date

April 25, 2026

## Interview Context

Topic: CI/CD integration for Automium v1.

Existing coverage: None. This is a greenfield spec.

Prior spec dependencies:

- `specs/browser-playwright-integration.md`: Firecracker microVMs for browser execution (CLI never runs a browser)
- `specs/provider-backed-planner-execution.md`: planner backend selection for runs
- `specs/production-persistence-infrastructure.md`: Hono API (control plane), BullMQ (run dispatch), R2 (artifacts)

Research context consulted:

- `research/devtool-user-map.md` (QA automation engineers, release managers as CI users)
- `research/devtool-dx-journey.md` (install and quickstart journey)
- Web research: JUnit XML format, GitHub Actions test reporting, GitLab CI test reports
- Web research: Playwright CI integration best practices (Docker, headless, artifacts)

## Turn 1: CLI Design + Execution Model

**Question 1:** What should the CLI interface look like?

**Options presented:**

1. **Standalone CLI binary: `automium run` (Recommended)** — Dedicated npm package `@automium/cli`. Standard test tool pattern.
2. **Vitest/Jest plugin** — Journeys alongside unit tests. But fundamentally different execution model.
3. **API-only, no CLI** — Every team writes own CI glue. High friction.

**User selection:** Standalone CLI binary

**Question 2:** How should the CLI interact with the remote execution platform?

**Options presented:**

1. **Submit + poll + collect (Recommended)** — CLI submits to control plane, polls for completion, collects results. No local browser.
2. **Submit + webhook callback** — Requires CI runner to be addressable.
3. **Local execution mode** — Runs Playwright locally. Different product.

**Evidence:** Automium's architecture runs browsers on Firecracker workers, not CI containers. The CLI should be a thin remote client.

**User selection:** Submit + poll + collect

## Turn 2: Report Formats + Exit Codes

**Question 1:** What report formats should the CLI generate?

**Options presented:**

1. **JUnit XML + JSON + terminal summary (Recommended)** — JUnit for CI systems, JSON for tooling, terminal for humans. Multiple simultaneous.
2. **JUnit XML only** — No friendly output or programmatic format.
3. **CTRF** — Emerging standard but not universally supported yet.

**Evidence:** JUnit XML is the universal CI format (GitHub Actions, GitLab CI, Jenkins, CircleCI). JSON enables custom dashboards.

**User selection:** JUnit XML + JSON + terminal summary

**Question 2:** What exit code strategy?

**Options presented:**

1. **Three-level (Recommended)** — 0 pass, 1 test failure, 2 config/infrastructure error. Lets CI distinguish failure types.
2. **Binary** — 0/1 only. Can't distinguish failure types.
3. **Per-journey encoding** — Uncommon. CI doesn't parse beyond 0/non-zero.

**User selection:** Three-level exit codes

## Turn 3: Journey Config + Auth

**Question 1:** How should the CLI discover journeys to run?

**Options presented:**

1. **Config file + CLI filters (Recommended)** — `automium.config.ts` with journey sets and tags. CLI filters: `--tag`, `--journey`, `--app`.
2. **CLI flags only** — Repetitive, no journey sets.
3. **Journey definitions in repo** — Duplicates control plane. Sync problems.

**User selection:** Config file + CLI filters

**Question 2:** How should auth work in CI?

**Options presented:**

1. **API token via env var (Recommended)** — `AUTOMIUM_API_TOKEN`. Standard CI pattern.
2. **OAuth device flow** — Complex for headless CI.
3. **Mutual TLS** — Overkill for v1.

**User selection:** API token via environment variable

## Turn 4: CI Providers + Failure Output

**Question 1:** Which CI providers get documented examples?

**Options presented:**

1. **GitHub Actions + GitLab CI (Recommended)** — Reusable action for GitHub, YAML template for GitLab. Generic CLI for others.
2. **GitHub Actions only** — Alienates GitLab shops.
3. **Generic CLI docs only** — Higher adoption friction.

**User selection:** GitHub Actions + GitLab CI examples

**Question 2:** What should failure output include?

**Options presented:**

1. **Structured summary + dashboard link (Recommended)** — Failed step, intent, assertion, snapshot context, replay URL.
2. **Full step log** — Hundreds of lines per failure. Unreadable.
3. **Failure count + link only** — Forces dashboard for any detail.

**User selection:** Structured failure summary + dashboard link

## Turn 5: Parallelism + Timeouts

**Question 1:** Should journeys run in parallel?

**Options presented:**

1. **Parallel with configurable concurrency (Recommended)** — All submitted simultaneously. `--concurrency` limits in-flight runs. Results stream as they complete.
2. **Sequential** — N times slower. Doesn't leverage platform scale.
3. **Batch submission** — Requires batch API not in route manifest.

**User selection:** Parallel submission, configurable concurrency

**Question 2:** What timeout strategy?

**Options presented:**

1. **Per-journey + overall (Recommended)** — `--timeout` per journey (5m), `--total-timeout` for CLI (30m). Timeouts surface as explicit failures.
2. **Single global** — Can't distinguish stuck journey from slow suite.
3. **No CLI timeout** — Loses Automium-specific context.

**User selection:** Per-journey + overall timeout

## Turn 6: CLI Package + v1 Scope

**Question 1:** How should the CLI package be structured?

**Options presented:**

1. **Dedicated packages/cli/ (Recommended)** — Published as `@automium/cli`. Thin client, no Playwright deps.
2. **Part of control plane** — Mixes server and client.
3. **Separate repository** — Harder to keep in sync.

**User selection:** Dedicated package

**Question 2:** Should the CLI support watch mode for v1?

**Options presented:**

1. **CI-only, watch deferred (Recommended)** — `run`, `validate`, `report` commands. No watch, no interactive UI.
2. **Watch mode from v1** — Adds complexity for secondary use case.
3. **Local execution mode** — Different execution model. Risks divergence.

**User selection:** CI-only for v1

## Turn 7: Coverage Checkpoint

All 12 decision areas confirmed as complete by user.

## Significant Deviations from Original Spec

This is entirely new — no prior spec coverage existed. All decisions are net-new:

1. **CLI as thin remote client**: The CLI never runs a browser. This is a fundamental architectural decision driven by Automium's Firecracker-based execution model. Unlike Playwright or Cypress CLIs that execute tests locally, Automium's CLI is purely an API client.

2. **Three-level exit codes**: Distinguishing test failures (1) from infrastructure errors (2) is not standard in most test runners but is important for Automium because the remote execution model introduces a class of failures (worker unavailable, control plane down) that don't exist in local test runners.

3. **Config file with journey references, not definitions**: The config file points to journeys on the control plane rather than defining them. Journey authoring happens through the Automium API/dashboard, not through the CLI config. This avoids the sync problem of having journey definitions in two places.

4. **Structured failure output with replay links**: The failure output is designed around Automium's replay capability. Instead of dumping verbose logs (which would come from the remote worker), the CLI provides a concise summary with a link to the full causal replay in the dashboard.
