import { describe, expect, it } from "vitest";

describe("benchmark KPI harness contract", () => {
  it("aggregates the headline KPIs for repeatability, latency, spend, and recovery", async () => {
    const contract = await import("../src/kpis");

    expect(contract.KPI_NAMES).toEqual([
      "repeatability",
      "passRate",
      "medianJourneyLatencyMs",
      "tokenSpend",
      "recoverySuccessRate"
    ]);
  });

  it("defines verdict buckets that the benchmark runner must count consistently", async () => {
    const contract = await import("../src/kpis");

    expect(contract.VERDICT_TAXONOMY).toEqual([
      "pass",
      "fail",
      "inconclusive",
      "unsupported"
    ]);
  });

  it("computes KPI summaries from benchmark run outcomes", async () => {
    const contract = await import("../src/kpis");

    const summary = contract.aggregateBenchmarkKpis([
      {
        verdict: "pass",
        latencyMs: 1200,
        tokenSpend: 400,
        recovered: false,
        deterministicKey: "login-dashboard"
      },
      {
        verdict: "pass",
        latencyMs: 1000,
        tokenSpend: 350,
        recovered: true,
        deterministicKey: "login-dashboard"
      },
      {
        verdict: "fail",
        latencyMs: 1800,
        tokenSpend: 600,
        recovered: false,
        deterministicKey: "login-dashboard"
      }
    ]);

    expect(summary).toEqual({
      repeatability: 2 / 3,
      passRate: 2 / 3,
      medianJourneyLatencyMs: 1200,
      tokenSpend: {
        total: 1350,
        average: 450
      },
      recoverySuccessRate: 1
    });
  });
});
