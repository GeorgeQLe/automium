# Provider-Backed Planner Execution Spec

## Status

Validated via spec interview on April 25, 2026. This spec covers the production planner adapter layer, superseding the contract-level planner sections of `specs/agent-native-browser-qa-platform.md` with implementation-level decisions.

## Summary

Automium's planner layer connects model providers (Claude, GPT, Gemini) to the deterministic executor through a provider-agnostic adapter contract. Each adapter translates Automium's enriched semantic snapshots into provider-native tool-call prompts and parses structured tool-call responses back into the v1 intent vocabulary.

The contract evolves from v1 (string-based prompt/parse) to v2 (native tool calling with structured output). Claude/Anthropic is the first production adapter. GPT/OpenAI follows as a fast-follow in the same release cycle. Gemini is deferred to v1.1+.

## Strategic Context

All three major providers (Anthropic, OpenAI, Google) now support native tool calling with structured output enforcement. This eliminates the need for fragile text-based JSON parsing and makes the planner adapter contract cleaner:

- **Anthropic Claude**: Tool use with `@anthropic-ai/sdk`, structured output validation via `output_config.format`, vision through image content blocks. Agent SDK available for managed tool loops.
- **OpenAI GPT**: Responses API with function calling, `strict: true` for structured outputs, vision through multimodal messages.
- **Google Gemini**: Function calling with VALIDATED mode, structured output adherence, multimodal messages with image parts.

The adapter abstraction ensures Automium's executor and benchmark systems remain provider-agnostic while each adapter handles provider-specific API mechanics.

## Contract Evolution: v1 → v2

### v1 Contract (Deprecated)

```typescript
interface PlannerAdapter {
  metadata(): PlannerAdapterMetadata;
  buildPrompt(input: PlannerPromptInput): string;
  parsePlannerOutput(output: string): readonly PlannerIntent[];
  compileIntent(intent: PlannerIntent): CompiledPlannerIntent;
  summarizeStep(intent: PlannerIntent, result: "pass" | "fail"): PlannerStepSummary;
}
```

String-based `buildPrompt()` and `parsePlannerOutput()` are fundamentally mismatched with native tool calling. Models return structured tool calls, not free-form text.

### v2 Contract

```typescript
interface PlannerAdapterV2 {
  metadata(): PlannerAdapterMetadata;
  toolDefinitions(): readonly ToolDefinition[];
  buildMessages(input: PlannerPromptInput): PlannerMessages;
  parseToolCalls(calls: readonly ToolCall[]): readonly PlannerIntent[];
  compileIntent(intent: PlannerIntent): CompiledPlannerIntent;
  summarizeStep(intent: PlannerIntent, result: "pass" | "fail"): PlannerStepSummary;
}
```

Changes from v1:

- `buildPrompt() → buildMessages()`: Returns a provider-agnostic message array (system prompt, user message with snapshot/context/vision, tool results from previous steps) instead of a single string.
- `parsePlannerOutput() → parseToolCalls()`: Accepts structured tool call objects instead of raw text. Each tool call maps to one planner intent.
- `toolDefinitions()` (new): Returns the intent vocabulary as tool/function schemas. Each intent (click, navigate, type, etc.) is defined as a tool with typed parameters.
- `compileIntent()` and `summarizeStep()` are unchanged.

### Metadata Extension

```typescript
interface PlannerAdapterMetadata {
  readonly id: string;
  readonly vendor: "anthropic" | "openai" | "google" | "custom";
  readonly model: string;
  readonly intentSchemaVersion: "v1" | "v2";
  readonly supportsVision: boolean;
  readonly supportsToolCalls: boolean;
  readonly defaultModel: string;
}
```

### Tool Definition Schema

Each planner intent becomes a tool definition:

```typescript
interface ToolDefinition {
  readonly name: PlannerIntentName;
  readonly description: string;
  readonly parameters: JSONSchema;
}
```

Example for `click`:

```json
{
  "name": "click",
  "description": "Click an interactive element identified by its stable element ID.",
  "parameters": {
    "type": "object",
    "properties": {
      "target": {
        "type": "string",
        "description": "Stable element ID from the semantic snapshot"
      },
      "reasoning": {
        "type": "string",
        "description": "Why this element should be clicked to advance the journey"
      }
    },
    "required": ["target", "reasoning"]
  }
}
```

### Provider-Agnostic Message Types

```typescript
interface PlannerMessages {
  readonly system: string;
  readonly messages: readonly PlannerMessage[];
}

type PlannerMessage =
  | { role: "user"; content: readonly ContentBlock[] }
  | { role: "assistant"; content: readonly ContentBlock[] }
  | { role: "tool_result"; toolCallId: string; content: readonly ContentBlock[] };

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; source: ImageSource; metadata?: VisionCropMetadata };
```

Each adapter translates these provider-agnostic types into provider-native formats (Anthropic messages, OpenAI Responses API input, Gemini Content objects).

## Prompt Construction Strategy

### System Prompt

The system prompt defines:

- Planner role: "You are a QA journey executor. You navigate web applications by calling tools that represent browser actions."
- Available tools: the intent vocabulary as tool definitions
- Constraints: execution budget (max tokens, remaining steps), allowed domains, journey goal
- Output expectations: call exactly one tool per step, include reasoning

The system prompt is **cacheable** across steps within a journey:

- Anthropic: prompt caching with 5-minute TTL reduces cost for multi-step journeys
- OpenAI: system fingerprint enables caching
- Gemini: system instruction caching

### User Message

Each step's user message contains:

1. **Semantic snapshot**: enriched element list with stable IDs, roles, labels, values, actionability scores
2. **Mutations**: changes since last step (elements added/removed/changed)
3. **Network events**: relevant API responses, errors since last step
4. **Journey context**: current checkpoint, remaining assertions, recovery state
5. **Pinned invariants**: must-hold conditions
6. **Vision crops** (when flagged): image content blocks with semantic annotations

### Multi-Turn Context

The adapter maintains a sliding window of recent steps (previous assistant tool calls + tool results) within the provider's context window. Older steps are summarized by `summarizeStep()` and compressed into a context summary block in the system prompt. This implements the hierarchical context compaction strategy from the platform spec.

## Vision Integration

Vision crops flow through the adapter as image content blocks in the user message:

1. The semantic runtime flags `vision_recommended` on the snapshot with candidate element refs
2. The executor captures targeted crops via `BrowserRuntime.captureElementScreenshot()`
3. Crops are included in the `PlannerPromptInput` as `visionCrops: VisionCrop[]`
4. The adapter's `buildMessages()` inserts image content blocks at the end of the user message, annotated with element context
5. Vision-capable adapters (Claude, GPT, Gemini all support vision) include the blocks
6. Non-vision adapters skip image blocks with a warning logged

Budget: max 2-3 crops per step, each under 100 KB. Enforced before the adapter receives input.

## Provider Adapters

### Package Structure

```
packages/
  planner-adapter/          # Registry/factory, v2 contract re-exports
  planner-adapter-anthropic/ # Claude adapter, depends on @anthropic-ai/sdk
  planner-adapter-openai/    # GPT adapter, depends on openai
  planner-adapter-google/    # Gemini adapter, depends on @google/generative-ai
  planner-adapter-fixture/   # Deterministic CI adapter, no provider SDK
```

Each provider package:

- Depends only on its provider SDK and `packages/contracts/`
- Implements `PlannerAdapterV2`
- Handles provider-specific API mechanics (message format, tool call format, streaming, error handling)
- Reports normalized telemetry through a common `PlannerStepTelemetry` type

The base `packages/planner-adapter/` becomes a registry:

```typescript
function resolvePlannerAdapter(
  vendor: string,
  config: PlannerConfig
): PlannerAdapterV2;
```

### Claude/Anthropic Adapter (First)

- SDK: `@anthropic-ai/sdk`
- Default model: Claude Sonnet (latest)
- Tool calling: native tool use with `tools` parameter
- Structured output: `output_config.format` for schema enforcement
- Vision: image content blocks in messages (base64)
- Prompt caching: system prompt cached across steps (5-minute TTL)
- Token reporting: `usage.input_tokens`, `usage.output_tokens` from response

### GPT/OpenAI Adapter (Fast-Follow)

- SDK: `openai`
- Default model: GPT-4o (latest)
- Tool calling: Responses API with `tools` and `strict: true`
- Vision: image content in user messages
- Token reporting: `usage.prompt_tokens`, `usage.completion_tokens`

### Gemini/Google Adapter (v1.1+)

- SDK: `@google/generative-ai`
- Default model: Gemini 3 Flash
- Tool calling: function calling with VALIDATED mode
- Vision: inline image parts in content
- Token reporting: `usageMetadata.promptTokenCount`, `usageMetadata.candidatesTokenCount`

### Fixture Adapter (CI/Benchmarks)

- No provider SDK dependency
- Accepts a pre-defined `PlannerIntent[]` sequence per journey
- Returns the next intent in sequence at each step, wrapped as a mock tool call
- Implements full v2 contract interface
- Used by benchmark runner for baseline comparison and CI validation
- No API key required

## Cost Controls

### Three-Layer Budget Enforcement

1. **Per-step token cap**: Set `max_tokens` on each provider API call. Prevents any single step from consuming excessive tokens. Default: 4096 tokens.

2. **Per-run token budget**: Track cumulative `input_tokens + output_tokens` across all steps in a journey run. If the budget is exceeded, the executor aborts the journey with a `budget_exceeded` verdict. Default: 100,000 tokens per run (configurable per journey or tenant).

3. **Per-tenant quota**: Enforced at the orchestrator level. Checked before each planner call. Prevents a single tenant from consuming disproportionate resources. Quota period: daily or monthly, configurable.

### Token Reporting

Each adapter extracts token usage from the provider response and returns it in `PlannerStepTelemetry`:

```typescript
interface PlannerStepTelemetry {
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly apiLatencyMs: number;
  readonly timeToFirstTokenMs: number;
  readonly toolCallCount: number;
  readonly visionIncluded: boolean;
  readonly retryCount: number;
}
```

The benchmark runner aggregates telemetry across runs for comparison reports.

## Retry and Fallback Strategy

### Provider-Level Retry

The adapter retries transient failures:

- **Retryable**: 429 (rate limit), 500 (server error), 503 (service unavailable), network timeouts
- **Not retryable**: 400 (content policy, invalid request), 401 (auth failure), 404
- **Strategy**: exponential backoff with jitter, max 3 attempts
- **Rate limit headers**: `Retry-After` header is respected when present

### Journey-Level Fallback

If all provider retries fail, the failure surfaces to the journey executor's recovery policy:

1. Retry the step with the same planner (executor-level retry, different from provider retry)
2. Switch to a fallback planner if configured (e.g., Claude → GPT)
3. Fail the journey with a `planner_unavailable` verdict

Content policy rejections (400) are not retried — they surface as step failures with the rejection reason in telemetry.

## Credential Management

Provider API keys are stored in the same credential vault as application login credentials, under a separate scope:

- Path convention: `planner/{vendor}/api-key` (e.g., `planner/anthropic/api-key`)
- Tenant isolation: each tenant has their own provider credentials
- Audit: credential access is logged per run
- Rotation: vault supports credential rotation without redeploying adapters

At run time:

1. Orchestrator resolves the planner credential for the tenant + vendor
2. Credential is injected into the Firecracker microVM alongside app credentials
3. The adapter reads the credential from the injected secret and initializes the provider SDK client
4. Credential is never logged or included in artifacts

## Model Selection

Each provider adapter has a default model. Tenants can override the model at two levels:

1. **Planner profile**: tenant-level default (e.g., "always use Claude Opus for this tenant")
2. **Run submission**: per-run override (e.g., "use GPT-4o for this benchmark run")

The adapter validates the requested model is supported by the provider and reports the actual model used in step telemetry. Benchmark reports show results at model granularity (Claude Sonnet vs GPT-4o vs Gemini Flash), not just provider level.

## Data Privacy

### Tenant Consent Model

By default, the full semantic snapshot is sent to the planner provider. The tenant consents to this data flow when they:

1. Configure their own provider API key in the credential vault
2. Add their application domain to the domain allowlist
3. Submit runs targeting their own app

### Optional Redaction

Tenants can define field-level redaction policies:

- Pattern-based: redact form values matching email, SSN, credit card, phone patterns
- Role-based: redact all values from elements with specific roles (e.g., `password` inputs always redacted)
- Custom: tenant-defined redaction rules

Redacted fields are replaced with `[REDACTED]` tokens in the snapshot before it reaches the adapter. Redaction metadata is preserved in the replay event stream so debugging is still possible (the debugger shows that a field was redacted, not its value).

## Benchmark Integration

The benchmark runner's `comparePlannerBackends()` function evolves to use v2 adapters:

- Each planner backend resolves to a v2 adapter via the registry
- The runner executes the same owned-corpus journeys across all configured planners
- Per-step telemetry is collected and aggregated into the comparison report
- The fixture adapter provides the deterministic baseline

Comparison report metrics (unchanged from v1 contract):

- Repeatability (across N repetitions)
- Pass rate
- Median journey latency
- Token spend (total and average)
- Recovery success rate

New metrics from v2 telemetry:

- Model-level breakdown (if multiple models used within a provider)
- Vision usage frequency and cost
- Average tool calls per step
- Retry frequency per provider

## v1 Scope Boundary

### Ships with v1

1. **Claude/Anthropic adapter**: full v2 contract, tool calling, vision, prompt caching, telemetry
2. **Fixture adapter**: deterministic intent sequences, full v2 contract, CI/benchmark baseline
3. **v2 contract definition**: in `packages/contracts/`
4. **Adapter registry/factory**: in `packages/planner-adapter/`
5. **Multi-layer cost controls**: per-step, per-run, per-tenant
6. **Rich per-step telemetry**: normalized across providers

### Fast-Follow (Same Release Cycle)

7. **GPT/OpenAI adapter**: full v2 contract, enables first cross-provider benchmark comparison

### Deferred (v1.1+)

8. **Gemini/Google adapter**
9. **Advanced redaction policies** (basic pattern redaction ships with v1)
10. **Model auto-selection** (step complexity-based model routing)
11. **Streaming responses** (current scope is request-response per step)

## Open Questions

- Exact prompt template content for the system prompt (planner role definition, constraint phrasing)
- Context compaction thresholds: how many raw steps to keep vs summarize
- Provider-specific rate limit handling nuances (Anthropic tier limits, OpenAI TPM/RPM, Gemini quota model)
- Prompt caching effectiveness measurement: hit rate tracking per journey
- Optimal default token budgets per journey complexity tier
