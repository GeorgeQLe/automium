import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function readFixture<T>(fixtureName: string): Promise<T> {
  const url = new URL(`../fixtures/${fixtureName}`, import.meta.url);
  const contents = await readFile(url, "utf8");

  return JSON.parse(contents) as T;
}

describe("replay event contract", () => {
  it("freezes the v1 replay event schema and required fields", async () => {
    const contract = await import("../src/replay-event");
    const fixture = await readFixture<Record<string, unknown>>(
      "replay-event.v1.json"
    );

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
    expect(fixture.schemaVersion).toBe(contract.REPLAY_EVENT_SCHEMA_VERSION);
    expect(Object.keys(fixture)).toEqual([
      "schemaVersion",
      ...contract.replayEventRequiredFields
    ]);
  });

  it("defines the canonical replay phase ordering for deterministic reconstruction", async () => {
    const contract = await import("../src/replay-event");
    const fixture = await readFixture<{ phase: string }>("replay-event.v1.json");

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
    expect(contract.replayEventPhaseOrder).toContain(fixture.phase);
  });
});
