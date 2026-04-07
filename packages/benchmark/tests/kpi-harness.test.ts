import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function readFixture<T>(fixtureName: string): Promise<T> {
  const url = new URL(`../fixtures/${fixtureName}`, import.meta.url);
  const contents = await readFile(url, "utf8");

  return JSON.parse(contents) as T;
}

describe("benchmark KPI harness contract", () => {
  it("freezes the v1 corpus manifest against the checked-in golden fixture", async () => {
    const contract = await import("../src/corpus");
    const fixture = await readFixture("corpus.v1.json");

    expect(contract.BENCHMARK_CORPUS_VERSION).toBe("v1");
    expect(contract.benchmarkCorpusManifest).toEqual(fixture);
  });

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
    const outcomes = await readFixture<
      Array<{
        verdict: "pass" | "fail" | "inconclusive" | "unsupported";
        latencyMs: number;
        tokenSpend: number;
        recovered: boolean;
        deterministicKey: string;
      }>
    >("kpi-run-outcomes.v1.json");
    const expectedSummary = await readFixture("kpi-summary.v1.json");

    const summary = contract.aggregateBenchmarkKpis(outcomes);

    expect(summary).toEqual(expectedSummary);
  });
});
