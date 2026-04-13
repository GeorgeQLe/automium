import { describe, expect, it } from "vitest";

async function loadReplayConsole() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected apps/replay-console/src/index.ts to expose replay-console timeline contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("replay console contract", () => {
  it("projects replay events into a stable timeline", async () => {
    const mod = await loadReplayConsole();

    const timeline = mod.buildReplayTimeline({
      runId: "run-alpha-foundry",
      events: [
        { sequence: 1, type: "planner.intent", intent: "navigate" },
        { sequence: 2, type: "executor.action", action: "goto" },
        { sequence: 3, type: "runtime.snapshot", snapshotRef: "snap-1" },
        { sequence: 4, type: "assertion.verdict", verdict: "pass" }
      ]
    });

    expect(timeline).toMatchObject({
      runId: "run-alpha-foundry",
      timelineVersion: "v1",
      entries: [
        { sequence: 1, lane: "planner" },
        { sequence: 2, lane: "executor" },
        { sequence: 3, lane: "runtime" },
        { sequence: 4, lane: "assertions" }
      ]
    });
  });

  it("surfaces replay artifact bundle references and run summaries", async () => {
    const mod = await loadReplayConsole();

    expect(mod.REPLAY_CONSOLE_REQUIRED_ARTIFACTS).toEqual([
      "semantic-snapshots",
      "planner-intents",
      "executor-actions",
      "assertion-traces",
      "network-log",
      "console-log",
      "downloads",
      "targeted-crops"
    ]);

    expect(
      mod.summarizeReplayRun({
        runId: "run-alpha-altitude",
        verdict: "pass",
        retryCount: 1,
        artifactManifestRef: "artifacts/run-alpha-altitude/manifest.json"
      })
    ).toMatchObject({
      runId: "run-alpha-altitude",
      verdict: "pass",
      retryCount: 1,
      artifactManifestRef: expect.stringContaining("manifest.json")
    });
  });
});
