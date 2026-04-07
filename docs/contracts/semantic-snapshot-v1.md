# Semantic Snapshot v1

- Module: `packages/contracts/src/semantic-snapshot.ts`
- Golden fixture: `packages/contracts/fixtures/semantic-snapshot.v1.json`
- Schema version: `v1`

The semantic snapshot captures the planner-facing state for one benchmark checkpoint.

Required top-level fields:

- `url`
- `route`
- `frameHierarchy`
- `taskContext`
- `checkpointContext`
- `interactiveElements`
- `recentMutations`
- `relevantNetworkEvents`
- `pinnedInvariants`

Interactive element fields are frozen as:

- `id`
- `role`
- `label`
- `value`
- `required`
- `disabled`
- `loading`
- `error`
- `visible`
- `interactable`
- `group`
