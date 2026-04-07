# Planner Adapter v1

- Module: `packages/contracts/src/planner-adapter.ts`
- Golden fixture: `packages/contracts/fixtures/planner-adapter.v1.json`
- Schema version: `v1`

Planner adapters must surface stable metadata, compile planner intents into executor actions, and summarize step outcomes.

Required methods:

- `metadata`
- `buildPrompt`
- `parsePlannerOutput`
- `compileIntent`
- `summarizeStep`

Metadata fields:

- `id`
- `vendor`
- `model`
- `intentSchemaVersion`

Allowed intent vocabulary:

- `navigate`
- `click`
- `type/fill`
- `select`
- `upload`
- `press-key`
- `wait-for-condition`
- `assert`
- `extract`
- `branch`
- `recover`
- `finish`
