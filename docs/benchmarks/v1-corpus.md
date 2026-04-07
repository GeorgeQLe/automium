# Benchmark Corpus v1

- Manifest: `packages/benchmark/fixtures/corpus.v1.json`
- KPI fixtures: `packages/benchmark/fixtures/kpi-run-outcomes.v1.json`, `packages/benchmark/fixtures/kpi-summary.v1.json`
- Contract references:
  - `docs/contracts/semantic-snapshot-v1.md`
  - `docs/contracts/replay-event-v1.md`
  - `docs/contracts/planner-adapter-v1.md`

This corpus freezes the owned benchmark surface selected for Phase 1. The checked-in manifest is stable and versioned, and it now points at the internal benchmark targets `Foundry`, `Altitude`, and `Switchboard` plus a dedicated iframe support fixture for cross-frame coverage.

## Authorized apps

| App | Profile coverage | Fixture IDs | Notes |
| --- | --- | --- | --- |
| `foundry` | `owned-baseline` | `foundry-baseline-builder` | Published-app runtime and CRUD coverage for the owned app-builder target. |
| `altitude` | `owned-upload` | `altitude-upload-member` | Attachment and richer work-item workflow coverage for the owned planning target. |
| `switchboard` | `owned-session-churn` | `switchboard-session-agent` | Session expiry and recovery behavior for the owned support target. |
| `iframe-fixture` | `owned-iframe` | `iframe-fixture-operator` | Controlled iframe and cross-frame actions. |

## Journey map

| Journey ID | App | Environment profile | Fixture set | Expected verdict | Deterministic key | Semantics |
| --- | --- | --- | --- | --- | --- | --- |
| `foundry-open-published-orders-app` | `foundry` | `owned-baseline` | `foundry-baseline-builder` | `pass` | `foundry-open-published-orders-app` | Published orders app runtime must load with deterministic seeded data and stay usable without recovery. |
| `altitude-create-work-item-with-attachment` | `altitude` | `owned-upload` | `altitude-upload-member` | `pass` | `altitude-create-work-item-with-attachment` | Attachment flow must preserve work-item state and complete successfully. |
| `switchboard-session-recovery` | `switchboard` | `owned-session-churn` | `switchboard-session-agent` | `pass` | `switchboard-session-recovery` | Session expiry is expected during the run, but recovery must restore the inbox workflow and end in a pass verdict. |
| `iframe-fixture-embedded-form-submit` | `iframe-fixture` | `owned-iframe` | `iframe-fixture-operator` | `pass` | `iframe-fixture-embedded-form-submit` | Same-origin iframe interaction must preserve frame context and submit successfully. |

## Contract paths

- Semantic snapshots are serialized to `packages/contracts/fixtures/semantic-snapshot.v1.json` and specified in `docs/contracts/semantic-snapshot-v1.md`.
- Replay events are serialized to `packages/contracts/fixtures/replay-event.v1.json` and specified in `docs/contracts/replay-event-v1.md`.
- Planner adapter metadata and intent vocabulary are frozen in `packages/contracts/fixtures/planner-adapter.v1.json` and specified in `docs/contracts/planner-adapter-v1.md`.
