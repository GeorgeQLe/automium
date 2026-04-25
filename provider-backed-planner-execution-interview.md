# Provider-Backed Planner Execution — Interview Log

## Interview Date

April 25, 2026

## Interview Context

Topic: Provider-backed planner execution for Automium v1.

Existing coverage:

- `specs/agent-native-browser-qa-platform.md` — planner layer architecture (contract-level)
- `packages/contracts/src/planner-adapter.ts` — frozen v1 planner adapter contract
- `packages/planner-adapter/src/planner-adapter-domain.ts` — domain layer with supported backends
- `docs/contracts/planner-adapter-v1.md` — contract documentation
- `packages/benchmark-runner/src/benchmark-runner-domain.ts` — benchmark comparison function

Research context consulted:

- `research/devtool-user-map.md` (AI platform engineer persona)
- `research/devtool-integration-map.md` (planner adapter integration priorities)
- `specs/browser-playwright-integration.md` (vision capture decisions from prior interview)
- Web research: Claude API tool use and Agent SDK (2026)
- Web research: OpenAI Responses API tool calling and structured output (2026)
- Web research: Gemini API function calling and structured output (2026)

## Turn 1: First Provider + Calling Mode

**Question 1:** Which provider should be the first production adapter?

**Options presented:**

1. **Claude / Anthropic first (Recommended)** — Tool-use API maps to intent vocabulary. Structured output validation. Agent SDK. Native vision. TypeScript SDK.
2. **GPT / OpenAI first (original priority)** — Mature Responses API. Largest ecosystem. API surface has churned.
3. **All three in parallel** — Proves abstraction from day one. Higher upfront cost.

**Evidence:** All three providers support tool calling with structured output. Anthropic's tool-use contract is the cleanest fit. Research docs suggested GPT first but didn't account for Claude's 2026 improvements.

**User selection:** Claude / Anthropic first

**Question 2:** Should adapters use tool-call mode or text-completion mode?

**Options presented:**

1. **Tool-call mode with structured output (Recommended)** — Intent vocabulary as tool schemas. Provider enforces output format. Requires contract update.
2. **Text completion with JSON parsing** — Keep v1 string contract. Fragile parsing.
3. **Hybrid** — Tool-call preferred, text fallback. Two code paths.

**User selection:** Tool-call mode with structured output

## Turn 2: Contract Evolution + Vision Flow

**Question 1:** How should the contract change from v1's string-based interface?

**Options presented:**

1. **New v2 contract, v1 deprecated (Recommended)** — buildMessages(), toolDefinitions(), parseToolCalls(). Clean break from string-based methods.
2. **Extend v1 with optional methods** — Avoids version bump but messy interface.
3. **Keep v1, adapt internally** — String bottleneck hides structured nature.

**User selection:** New v2 contract, v1 deprecated

**Question 2:** How should vision crops reach the planner?

**Options presented:**

1. **Image content blocks in messages (Recommended)** — Crops as image blocks in user message. All three providers support multimodal. Vision-capable adapters include them.
2. **Separate vision API call** — Two round-trips. Keeps text/vision separate.
3. **Vision as tool result** — Model requests via tool call. Conflicts with runtime-triggered vision decision.

**User selection:** Image content blocks in messages

## Turn 3: Cost Controls + Retry Policy

**Question 1:** How should Automium enforce cost controls?

**Options presented:**

1. **Multi-layer budget enforcement (Recommended)** — Per-step cap, per-run budget, per-tenant quota. Adapters report actual usage.
2. **Per-step cap only** — Simple but no total protection.
3. **Per-run budget only** — No individual step protection.

**User selection:** Multi-layer budget enforcement

**Question 2:** What retry and fallback strategy?

**Options presented:**

1. **Provider-level retry with journey-level fallback (Recommended)** — 3x exponential backoff for transient. Journey executor handles persistent. Content policy not retried.
2. **No retry at adapter level** — All failures to executor. Slower recovery.
3. **Aggressive retry with circuit breaker** — Complex to tune.

**User selection:** Provider-level retry with journey-level fallback

## Turn 4: Credentials + Metrics

**Question 1:** How should provider API keys be managed?

**Options presented:**

1. **Same vault, different scope (Recommended)** — Shared vault with app credentials. `planner/{vendor}/api-key` path. Tenant isolation. Audit-logged.
2. **Separate planner credential store** — Different access policies. More operational overhead.
3. **Environment-level provider keys** — Shared across tenants. No per-tenant tracking.

**User selection:** Same vault, different scope

**Question 2:** What metrics should each adapter report?

**Options presented:**

1. **Rich per-step telemetry (Recommended)** — Tokens, latency, model version, tool call count, vision usage, retries.
2. **Token + latency only** — Sufficient for cost/speed but loses behavior detail.
3. **Provider-native passthrough** — Maximum fidelity but inconsistent across providers.

**User selection:** Rich per-step telemetry

## Turn 5: Prompt Design + Fixture Planner

**Question 1:** How should the adapter construct prompts?

**Options presented:**

1. **System prompt + structured user message (Recommended)** — System: role, tools, constraints (cacheable). User: snapshot, context, vision crops. Maps to all providers.
2. **Single combined prompt** — Loses caching and system/user separation.
3. **Multi-turn conversation history** — Grows linearly. Conflicts with compaction strategy.

**User selection:** System prompt + structured user message

**Question 2:** How should the fixture planner work in v2?

**Options presented:**

1. **Deterministic intent sequence (Recommended)** — Pre-defined intents per journey. Returns next in sequence. Mock tool calls. Full v2 contract. No API key.
2. **Snapshot-matching planner** — Matches snapshot to intent rules. Complex to maintain.
3. **Record-replay planner** — Replay recorded sessions. Fragile to snapshot changes.

**User selection:** Deterministic intent sequence

## Turn 6: Data Privacy + Packaging

**Question 1:** Should snapshots be sanitized before sending to providers?

**Options presented:**

1. **Tenant consent model with optional redaction (Recommended)** — Full snapshot by default (tenant consents via key + allowlist). Optional field-level redaction policies.
2. **Always redact sensitive fields** — Safer but may degrade planner accuracy.
3. **No redaction, full trust** — Simplest. Tenants control data flow.

**User selection:** Tenant consent model with optional redaction

**Question 2:** How should provider adapters be packaged?

**Options presented:**

1. **Separate packages per provider (Recommended)** — `planner-adapter-anthropic/`, `planner-adapter-openai/`, etc. Isolated SDK dependencies. Base package as registry.
2. **Single package, all providers** — Simpler structure. Larger dependency surface.
3. **Plugin architecture** — Dynamic loading. Over-engineered for three providers.

**User selection:** Separate packages per provider

## Turn 7: Model Selection + v1 Scope

**Question 1:** Should Automium expose model selection or fix one model per adapter?

**Options presented:**

1. **Tenant-configurable with defaults (Recommended)** — Default per adapter (Sonnet, GPT-4o, Flash). Tenant override at profile or run level. Benchmarks at model granularity.
2. **Fixed model per adapter** — One model = one adapter. More adapters to maintain.
3. **Auto-select based on complexity** — Cost-optimal but breaks benchmark comparability.

**User selection:** Tenant-configurable with defaults

**Question 2:** What's the v1 scope boundary?

**Options presented:**

1. **Claude + fixture, GPT fast-follow (Recommended)** — Claude + fixture ship first. GPT in same release cycle. Gemini v1.1+.
2. **All three for v1** — Full comparison from day one. Triples integration work.
3. **Claude + fixture only** — Fastest but delays cross-provider benchmarking.

**User selection:** Claude + fixture, GPT fast-follow

## Turn 8: Coverage Checkpoint

All 14 decision areas confirmed as complete by user.

## Significant Deviations from Original Spec/Contract

1. **Contract version (MAJOR):** v1 string-based contract (`buildPrompt`/`parsePlannerOutput`) is deprecated in favor of v2 tool-call-native contract (`buildMessages`/`toolDefinitions`/`parseToolCalls`). This is driven by all three providers now supporting structured tool calling.

2. **First provider priority (CHANGED):** Research docs and domain layer listed OpenAI first. Interview validated Claude/Anthropic as first adapter based on API fit and SDK alignment.

3. **Adapter packaging (NEW):** Original code has all planner logic in `packages/planner-adapter/`. Validated spec splits into per-provider packages with the base becoming a registry.

4. **Vision integration (NEW):** Not addressed in original planner contract. Validated as image content blocks in the message array, flowing through the same `buildMessages()` path.

5. **Cost control layers (NEW):** Original contract had `executionBudget.maxTokens` per step only. Validated spec adds per-run budget and per-tenant quota layers.

6. **Telemetry richness (NEW):** Original benchmark runner reports aggregate metrics only. Validated spec adds per-step telemetry with model version, latency breakdown, vision usage, and retry count.

7. **Credential management (NEW):** Not addressed in original spec. Validated as same vault with separate scope, consistent with the browser-playwright spec's credential vault decision.

8. **Data privacy (NEW):** Not addressed in original planner contract. Validated as tenant consent model with optional field-level redaction.

9. **Model selection (NEW):** Original contract had `model: string` in metadata but no selection mechanism. Validated as tenant-configurable with provider defaults.
