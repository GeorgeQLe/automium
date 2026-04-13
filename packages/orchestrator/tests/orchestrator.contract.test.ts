import { describe, expect, it } from "vitest";

async function loadOrchestrator() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/orchestrator/src/index.ts to expose worker orchestration contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("orchestrator contract", () => {
  it("leases isolated workers with queue priority and tenant quotas", async () => {
    const mod = await loadOrchestrator();

    const lease = mod.leaseWorker({
      runId: "run-alpha-switchboard",
      tenantId: "tenant-alpha",
      priority: "high",
      requestedCapabilities: ["browser", "artifacts", "vision"]
    });

    expect(lease).toMatchObject({
      runId: "run-alpha-switchboard",
      tenantId: "tenant-alpha",
      isolation: "per-run-browser-context",
      status: "leased",
      quota: {
        maxConcurrentRuns: expect.any(Number),
        maxArtifactBytes: expect.any(Number)
      }
    });
  });

  it("emits telemetry summaries for benchmark reporting", async () => {
    const mod = await loadOrchestrator();

    expect(
      mod.summarizeRunTelemetry({
        runId: "run-alpha-foundry",
        events: [
          { type: "worker.leased", at: 0 },
          { type: "planner.intent", at: 50, tokenSpend: 128 },
          { type: "executor.action", at: 75 },
          { type: "assertion.verdict", at: 500, verdict: "pass" }
        ]
      })
    ).toMatchObject({
      runId: "run-alpha-foundry",
      latencyMs: 500,
      tokenSpend: 128,
      verdict: "pass"
    });
  });
});
