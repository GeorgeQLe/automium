import { describe, expect, it } from "vitest";
import {
  authorizedBenchmarkApps,
  benchmarkJourneys
} from "../../../packages/benchmark/src";

async function loadBenchmarkRunner() {
  try {
    return await import("../../../packages/benchmark-runner/src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/benchmark-runner/src/index.ts to expose owned-product alpha benchmark contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("owned products alpha contract", () => {
  it("targets Altitude, Switchboard, and Foundry owned product journeys", async () => {
    const appIds = authorizedBenchmarkApps.map((app) => app.id);
    const journeyAppIds = new Set(benchmarkJourneys.map((journey) => journey.appId));

    expect(appIds).toEqual(
      expect.arrayContaining(["altitude", "switchboard", "foundry"])
    );
    expect(journeyAppIds.has("altitude")).toBe(true);
    expect(journeyAppIds.has("switchboard")).toBe(true);
    expect(journeyAppIds.has("foundry")).toBe(true);
  });

  it("runs cross-model benchmark comparisons with repeatability and spend metrics", async () => {
    const mod = await loadBenchmarkRunner();

    const report = mod.comparePlannerBackends({
      corpusVersion: "v1",
      appIds: ["altitude", "switchboard", "foundry"],
      planners: [
        { id: "gpt-baseline", vendor: "openai", model: "gpt-5.4" },
        { id: "local-baseline", vendor: "local", model: "deterministic-fixture" }
      ],
      repetitions: 3
    });

    expect(report).toMatchObject({
      corpusVersion: "v1",
      plannerReports: expect.any(Array),
      metrics: {
        repeatability: expect.any(Number),
        passRate: expect.any(Number),
        medianJourneyLatencyMs: expect.any(Number),
        tokenSpend: {
          total: expect.any(Number),
          average: expect.any(Number)
        },
        recoverySuccessRate: expect.any(Number)
      }
    });
  });
});
