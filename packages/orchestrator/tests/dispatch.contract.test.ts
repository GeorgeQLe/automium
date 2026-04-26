import { describe, expect, it } from "vitest";

async function loadDispatchModule() {
  try {
    return await import("../src/dispatch") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/orchestrator/src/dispatch.ts to implement lease-to-queue dispatch wiring.",
      { cause: error }
    );
  }
}

describe("orchestrator dispatch contract", () => {
  it("exports a dispatchRun function", async () => {
    const mod = await loadDispatchModule();

    expect(typeof mod.dispatchRun).toBe("function");
  });

  it("dispatches a leased run to the queue adapter", async () => {
    const mod = await loadDispatchModule();
    const dispatchRun = mod.dispatchRun as Function;

    const enqueuedJobs: Record<string, unknown>[] = [];
    const stubQueueAdapter = {
      boundary: "job-queue" as const,
      enqueue: async (job: Record<string, unknown>) => {
        enqueuedJobs.push(job);
        return { enqueued: true, jobId: "job_dispatched_1" };
      },
      dequeue: async () => ({ job: null }),
      acknowledge: async () => ({ acknowledged: true }),
    };

    const result = await dispatchRun(
      {
        runId: "run-dispatch-test",
        tenantId: "tenant-dispatch",
        priority: "high",
        requestedCapabilities: ["browser"],
      },
      stubQueueAdapter
    );

    expect(result).toHaveProperty("dispatched");
    expect(result).toHaveProperty("lease");
    expect(result.dispatched).toBe(true);
    expect(result.lease.status).toBe("leased");
    expect(result.jobId).toBe("job_dispatched_1");
    expect(enqueuedJobs.length).toBe(1);
  });

  it("does not enqueue when lease is denied", async () => {
    const mod = await loadDispatchModule();
    const dispatchRun = mod.dispatchRun as Function;

    const enqueuedJobs: Record<string, unknown>[] = [];
    const stubQueueAdapter = {
      boundary: "job-queue" as const,
      enqueue: async (job: Record<string, unknown>) => {
        enqueuedJobs.push(job);
        return { enqueued: true, jobId: "should_not_happen" };
      },
      dequeue: async () => ({ job: null }),
      acknowledge: async () => ({ acknowledged: true }),
    };

    const result = await dispatchRun(
      {
        runId: "run-denied-test",
        tenantId: "tenant-denied",
        priority: "high",
        requestedCapabilities: [],
      },
      stubQueueAdapter
    );

    expect(result.dispatched).toBe(false);
    expect(result.lease.status).toBe("denied");
    expect(result.jobId).toBeUndefined();
    expect(enqueuedJobs.length).toBe(0);
  });
});
