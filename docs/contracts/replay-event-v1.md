# Replay Event v1

- Module: `packages/contracts/src/replay-event.ts`
- Golden fixture: `packages/contracts/fixtures/replay-event.v1.json`
- Schema version: `v1`

Replay events provide deterministic reconstruction of one benchmark run step.

Required fields:

- `eventId`
- `runId`
- `stepId`
- `sequence`
- `phase`
- `timestamp`
- `plannerIntent`
- `executorAction`
- `preStateSnapshotRef`
- `postStateSnapshotRef`
- `artifactRefs`
- `summary`
- `verdict`

Canonical phase ordering:

1. `planner-input`
2. `planner-output`
3. `executor-start`
4. `state-capture-before`
5. `action`
6. `state-capture-after`
7. `assertion`
8. `recovery`
9. `step-result`
10. `run-result`
