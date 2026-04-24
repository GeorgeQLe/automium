# @automium/mcp-server

Automium MCP server — exposes benchmark corpus discovery, modeled journey compilation, run submission, replay, artifact manifests, and planner comparison over the [Model Context Protocol](https://modelcontextprotocol.io/).

## Quick Start

```bash
# From the monorepo root
pnpm exec automium-mcp-server
```

The server communicates over **stdio** using JSON-RPC framing via `StdioServerTransport` from `@modelcontextprotocol/sdk`. It does not start HTTP, SSE, or WebSocket listeners.

## Client Configuration

### Claude Desktop / `mcp.json`

```json
{
  "mcpServers": {
    "automium": {
      "command": "pnpm",
      "args": ["--filter", "@automium/mcp-server", "exec", "automium-mcp-server"]
    }
  }
}
```

### Claude Code

```json
{
  "mcpServers": {
    "automium": {
      "command": "pnpm",
      "args": ["--filter", "@automium/mcp-server", "exec", "automium-mcp-server"],
      "type": "stdio"
    }
  }
}
```

## Tools

All tools are read-only. Tools marked **modeled** return `AutomiumModeledOutputMetadata` confirming no live execution occurred.

| Tool | Modeled | Description |
|---|---|---|
| `automium_list_apps` | no | Return authorized checked-in benchmark apps. |
| `automium_list_fixtures` | no | Return checked-in benchmark fixtures, optionally filtered by app. |
| `automium_compile_journey` | yes | Validate and compile a journey definition without browser execution. |
| `automium_create_run_submission` | yes | Create a contract-shaped run submission without queueing work. |
| `automium_get_replay_summary` | yes | Build a replay summary from caller-provided run metadata. |
| `automium_get_artifact_manifest` | yes | Build an artifact manifest from caller-provided entries. |
| `automium_compare_planners` | yes | Create a modeled benchmark comparison report. |

### Modeled Output Metadata

Every modeled tool response includes these markers:

```json
{
  "modeled": true,
  "liveBrowserExecuted": false,
  "providerCallsMade": false,
  "filesystemMutated": false,
  "queued": false,
  "artifactsFetched": false
}
```

## Resources

All resources return `application/json`. Only the five URIs below are accepted — any other URI is rejected with `unsupported_resource_uri`.

| URI | Description |
|---|---|
| `automium://apps` | Authorized benchmark apps and supported capabilities. |
| `automium://fixtures` | Benchmark fixtures and environment profiles. |
| `automium://contracts/planner-adapter-v1` | Planner adapter v1 contract: intent vocabulary, required methods, metadata fields. |
| `automium://contracts/replay-event-v1` | Replay event v1 contract: schema version, required fields, phases. |
| `automium://contracts/semantic-snapshot-v1` | Semantic snapshot v1 contract: schema version, required fields, interactive element fields. |

## Prompts

| Prompt | Required Arguments | Description |
|---|---|---|
| `draft_journey` | `appId`, `fixtureId`, `goal` | Guide a coding agent to draft a valid owned-corpus journey. |
| `debug_failed_run` | `runId`, `verdict`, `artifactManifestRef` | Guide replay and artifact interpretation for a failed run. |
| `compare_planner_backends` | `appIds`, `planners`, `repetitions` | Guide modeled planner comparison against the owned corpus. |

## V1 Safety Boundaries

This server is **modeled-only**. The v1 surface does not and cannot:

- **Execute a browser** — no Playwright, Puppeteer, WebDriver, or Selenium imports.
- **Call provider APIs** — no Anthropic, OpenAI, Google, or Cohere SDK imports.
- **Access credentials** — no `dotenv`, `keytar`, or `process.env.*_API_KEY` reads.
- **Write to the filesystem** — no `fs.write*`, `writeFileSync`, or `createWriteStream`.
- **Open network listeners** — no `http`/`https`/`net`/`ws`/`express`/`fastify`; no `SSEServerTransport` or `StreamableHTTPServerTransport`.
- **Fetch remote artifacts** — artifact manifests are constructed from caller-provided entries, not retrieved from storage.

These boundaries are enforced by static source scans in `tests/mcp-safety.contract.test.ts`.

## Deferred Scope

The following are planned for future phases and are **not part of v1**:

- **Remote transports** — SSE and Streamable HTTP for hosted deployments.
- **Provider-backed planner execution** — live planner calls via Anthropic/OpenAI APIs.
- **Live browser execution** — real browser sessions for journey runs.
- **Production artifact retrieval** — reading artifacts from remote storage.
