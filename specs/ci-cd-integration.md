# CI/CD Integration Spec

## Status

Validated via spec interview on April 25, 2026. This is a new spec with no prior coverage.

## Summary

Automium ships a standalone CLI (`@automium/cli`) that integrates into CI/CD pipelines as a thin remote client. The CLI submits journey runs to the Automium control plane, polls for completion, collects results, and generates reports in JUnit XML, JSON, and terminal summary formats. No browser runs locally in CI — all execution happens on Firecracker workers.

The CLI is the primary adoption surface for QA automation engineers and release managers integrating Automium into their release process.

## CLI Design

### Package

- Package: `packages/cli/` in the monorepo
- Published as: `@automium/cli` on npm
- Binary: `automium`
- Install: `npm i -g @automium/cli` or `npx @automium/cli run`
- Dependencies: HTTP client, CLI framework (citty or commander), JUnit XML writer, JSON serializer
- No Playwright, no engine code, no provider SDKs — the CLI is a thin remote client

### Commands

#### `automium run`

Execute journeys against the Automium platform.

```
automium run [options]

Options:
  --config <path>       Config file path (default: automium.config.ts)
  --tag <tags>          Filter journeys by tag (comma-separated)
  --journey <ids>       Filter by journey ID (comma-separated)
  --app <apps>          Filter by app ID (comma-separated)
  --planner <backend>   Override planner backend
  --environment <env>   Target environment
  --concurrency <n>     Max parallel runs (default: 10)
  --timeout <seconds>   Per-journey timeout (default: 300)
  --total-timeout <s>   Overall CLI timeout (default: 1800)
  --reporter <types>    Report formats: terminal,junit,json (default: terminal)
  --output <path>       Output directory for report files (default: ./automium-results)
  --verbose             Print step-by-step progress for each journey
```

#### `automium validate`

Validate journey definitions and config without executing.

```
automium validate [options]

Options:
  --config <path>       Config file path
  --journey <ids>       Validate specific journeys
```

Checks: config file parses correctly, control plane is reachable, API token is valid, referenced journeys exist, journey definitions compile successfully.

#### `automium report`

Generate reports from a previous run.

```
automium report <run-id> [options]

Options:
  --reporter <types>    Report formats
  --output <path>       Output directory
```

Fetches run results from the control plane API and generates reports locally. Useful for re-generating reports or converting formats.

### Exit Codes

| Code | Meaning | CI Interpretation |
| --- | --- | --- |
| 0 | All journeys passed | Pipeline continues |
| 1 | One or more journeys failed | Test failure — developer action needed |
| 2 | Configuration or infrastructure error | Platform issue — ops action needed |

Exit code 1 covers: assertion failures, journey timeouts, planner errors, step execution failures.

Exit code 2 covers: invalid config file, auth failure, control plane unreachable, worker allocation failure, invalid journey reference.

## Execution Model

### Submit + Poll + Collect

The CLI never runs a browser. All execution happens on Firecracker workers managed by the control plane.

```
┌─────────────┐    ┌─────────────────┐    ┌────────────────┐
│  CI Runner  │    │  Control Plane   │    │  Worker Fleet  │
│  (CLI)      │    │  (Hono API)      │    │  (Firecracker) │
│             │    │                  │    │                │
│  1. Submit  │───▶│  2. Queue runs   │───▶│  3. Execute    │
│             │    │                  │    │                │
│  4. Poll    │◀──▶│  5. Return       │◀───│  6. Report     │
│             │    │     status       │    │     results    │
│  7. Collect │◀───│  8. Return       │    │                │
│     results │    │     artifacts    │    │                │
└─────────────┘    └─────────────────┘    └────────────────┘
```

Flow:

1. CLI reads config, resolves journey set from filters
2. CLI submits all journeys to the control plane API in parallel
3. Control plane queues runs onto BullMQ, workers dequeue and execute
4. CLI polls run status at 2-second intervals
5. As runs complete, CLI collects results and streams progress to terminal
6. When all runs complete (or timeout), CLI generates reports and exits

### Parallel Execution

All matching journeys are submitted simultaneously. The `--concurrency` flag limits how many runs are in-flight at once (default: 10). The control plane's tenant quota provides an additional cap.

Results stream to the terminal as they complete:

```
✓ login-flow (altitude) — passed in 12.3s (8 steps)
✓ create-project (altitude) — passed in 18.7s (14 steps)
✗ upload-attachment (altitude) — FAILED in 9.2s (step 6: click on upload-button)
  → Assertion violated: file-list should contain "report.pdf"
  → View: https://app.automium.dev/runs/abc123/replay
✓ crud-datasource (foundry) — passed in 22.1s (16 steps)
```

### Timeouts

Two timeout levels:

- **Per-journey** (`--timeout`, default 300s): if a single journey hasn't completed in this time, it's marked as `timed-out` in results. The control plane is asked to cancel the run.
- **Overall** (`--total-timeout`, default 1800s): if all journeys haven't completed, the CLI exits with code 1 and reports which runs are still in progress.

Timeouts appear as explicit failures in JUnit output, not silent hangs.

## Configuration

### Config File

`automium.config.ts` (or `.automiumrc.json`):

```typescript
import { defineConfig } from "@automium/cli";

export default defineConfig({
  controlPlane: {
    url: "https://app.automium.dev",
    // Token read from AUTOMIUM_API_TOKEN env var
  },

  defaults: {
    planner: "anthropic/claude-sonnet",
    environment: "staging",
    timeout: 300,
    concurrency: 10,
  },

  journeys: [
    {
      id: "login-flow",
      app: "altitude",
      tags: ["smoke", "release-gate"],
    },
    {
      id: "create-project",
      app: "altitude",
      tags: ["regression"],
    },
    {
      id: "upload-attachment",
      app: "altitude",
      tags: ["regression", "release-gate"],
    },
    {
      id: "crud-datasource",
      app: "foundry",
      tags: ["smoke", "regression"],
    },
  ],

  reporters: {
    terminal: { verbose: false },
    junit: { output: "./automium-results/junit.xml" },
    json: { output: "./automium-results/results.json" },
  },
});
```

### Environment Variables

| Variable | Purpose | Required |
| --- | --- | --- |
| `AUTOMIUM_API_TOKEN` | API token for control plane auth | Yes |
| `AUTOMIUM_CONTROL_PLANE_URL` | Override control plane URL | No (uses config) |
| `AUTOMIUM_PLANNER` | Override default planner | No |
| `AUTOMIUM_ENVIRONMENT` | Override target environment | No |

Environment variables override config file values. CLI flags override both.

### Authentication

API tokens are scoped per organization + workspace. Created in the Automium dashboard under workspace settings. Tokens are long-lived (90-day expiry, rotatable) and carry the permissions of the workspace role they were created under.

In CI: the token is stored as a CI secret (`AUTOMIUM_API_TOKEN`) and injected as an environment variable.

## Report Formats

### Terminal Summary (Default)

Printed to stdout during and after execution:

```
Automium v1.0.0 — running 4 journeys (concurrency: 10)

✓ login-flow (altitude) — passed in 12.3s (8 steps)
✓ create-project (altitude) — passed in 18.7s (14 steps)
✗ upload-attachment (altitude) — FAILED in 9.2s
  Step 6: click → upload-button
  Assertion: file-list should contain "report.pdf"
  Snapshot: upload-button was visible, enabled, actionability=0.95
  View: https://app.automium.dev/runs/abc123/replay
✓ crud-datasource (foundry) — passed in 22.1s (16 steps)

Results: 3 passed, 1 failed (62.4s total)
Reports: ./automium-results/junit.xml, ./automium-results/results.json
```

### JUnit XML

Standard JUnit XML for CI systems:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="automium" tests="4" failures="1" time="62.4">
  <testsuite name="altitude" tests="3" failures="1">
    <testcase name="login-flow" classname="altitude" time="12.3"/>
    <testcase name="create-project" classname="altitude" time="18.7"/>
    <testcase name="upload-attachment" classname="altitude" time="9.2">
      <failure message="Assertion: file-list should contain report.pdf">
Step 6: click → upload-button
Assertion violated: file-list should contain "report.pdf"
Last snapshot: upload-button visible, enabled, actionability=0.95
View: https://app.automium.dev/runs/abc123/replay
      </failure>
    </testcase>
  </testsuite>
  <testsuite name="foundry" tests="1" failures="0">
    <testcase name="crud-datasource" classname="foundry" time="22.1"/>
  </testsuite>
</testsuites>
```

### JSON

Machine-readable results:

```json
{
  "version": "v1",
  "timestamp": "2026-04-25T10:30:00Z",
  "summary": {
    "total": 4,
    "passed": 3,
    "failed": 1,
    "timedOut": 0,
    "duration": 62400
  },
  "journeys": [
    {
      "id": "upload-attachment",
      "app": "altitude",
      "verdict": "fail",
      "duration": 9200,
      "steps": 8,
      "failedStep": {
        "sequence": 6,
        "intent": "click",
        "target": "upload-button",
        "error": "Assertion: file-list should contain \"report.pdf\""
      },
      "runId": "abc123",
      "replayUrl": "https://app.automium.dev/runs/abc123/replay"
    }
  ]
}
```

## Failure Output

On failure, the CLI prints a structured summary for each failed journey:

1. **Journey name and app**
2. **Failed step**: sequence number, planner intent, target element
3. **Error**: assertion violated or error message
4. **Snapshot context**: target element's state (visible, enabled, actionability score)
5. **Dashboard link**: direct URL to the run's replay page

The JUnit XML `<failure>` element includes the same information so CI systems display it in PR checks.

## CI Provider Examples

### GitHub Actions

Reusable action: `@automium/github-action`

```yaml
name: QA
on: [push, pull_request]

jobs:
  automium:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Automium journeys
        uses: automium/github-action@v1
        with:
          tag: smoke
          reporter: junit,terminal
        env:
          AUTOMIUM_API_TOKEN: ${{ secrets.AUTOMIUM_API_TOKEN }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: automium-results
          path: automium-results/

      - name: Publish test report
        if: always()
        uses: dorny/test-reporter@v1
        with:
          name: Automium QA
          path: automium-results/junit.xml
          reporter: java-junit
```

The GitHub Action wraps:

1. Install `@automium/cli`
2. Run `automium run --tag <tag> --reporter <reporters>`
3. Report files are available for upload

### GitLab CI

```yaml
automium:
  stage: test
  image: node:22-slim
  script:
    - npx @automium/cli run --tag smoke --reporter junit,terminal --output ./automium-results
  variables:
    AUTOMIUM_API_TOKEN: $AUTOMIUM_API_TOKEN
  artifacts:
    when: always
    paths:
      - automium-results/
    reports:
      junit: automium-results/junit.xml
```

### Generic CI

Any CI system that can run Node.js:

```bash
npx @automium/cli run \
  --tag release-gate \
  --reporter junit,json,terminal \
  --output ./automium-results

# Exit code tells the CI whether to continue
```

## Security

### Token Scoping

API tokens carry the workspace role of the user who created them. A token with `contributor` role can submit runs but cannot modify journeys or access other workspaces.

### No Secrets in Config

The config file (`automium.config.ts`) never contains secrets. All sensitive values come from environment variables. The config file is safe to commit to version control.

### Network

The CLI makes HTTPS requests to the control plane API only. No direct connection to workers, Redis, or Postgres. The control plane validates every request against the token's permissions.

## v1 Scope

### Ships with v1

1. `@automium/cli` package with `run`, `validate`, `report` commands
2. `automium.config.ts` support with journey sets and tag filtering
3. JUnit XML, JSON, and terminal reporters
4. Three-level exit codes (0/1/2)
5. Parallel submission with configurable concurrency
6. Per-journey and overall timeouts
7. Structured failure output with dashboard links
8. GitHub Actions reusable action
9. GitLab CI YAML template
10. API token authentication via environment variable

### Deferred

- Watch mode for local development
- Local execution mode (Playwright without Firecracker)
- CTRF report format
- Interactive TUI progress display
- Sharding across CI runners
- OAuth device flow for local auth
- Custom reporter plugin API
- Slack/Teams notification integration

## Package Dependencies

```
@automium/cli
├── citty (or commander)     # CLI framework
├── ofetch (or undici)       # HTTP client
├── fast-xml-parser          # JUnit XML generation
├── picocolors               # Terminal colors
└── c12                      # Config file loading (supports .ts, .json, .yaml)
```

No Playwright. No engine. No provider SDKs. The CLI is a pure API client.

## Open Questions

- Should the CLI support streaming WebSocket connection for real-time progress (vs HTTP polling)?
- Token rotation and expiry notification strategy
- Rate limiting on the control plane API for CLI polling
- Should `automium validate` do a dry-run submission to verify worker availability?
- Artifact download command (`automium artifacts <run-id>`) for local inspection
