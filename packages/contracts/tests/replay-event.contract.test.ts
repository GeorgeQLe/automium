import { describe, expect, it } from "vitest";

describe("replay event contract", () => {
  it("freezes the v1 replay event schema and required fields", async () => {
    const contract = await import("../src/replay-event");

    expect(contract.REPLAY_EVENT_SCHEMA_VERSION).toBe("v1");
    expect(contract.replayEventRequiredFields).toEqual([
      "eventId",
      "runId",
      "stepId",
      "sequence",
      "phase",
      "timestamp",
      "plannerIntent",
      "executorAction",
      "preStateSnapshotRef",
      "postStateSnapshotRef",
      "artifactRefs",
      "summary",
      "verdict"
    ]);
  });

  it("defines the canonical replay phase ordering for deterministic reconstruction", async () => {
    const contract = await import("../src/replay-event");

    expect(contract.replayEventPhaseOrder).toEqual([
      "planner-input",
      "planner-output",
      "executor-start",
      "state-capture-before",
      "action",
      "state-capture-after",
      "assertion",
      "recovery",
      "step-result",
      "run-result"
    ]);
  });
});
