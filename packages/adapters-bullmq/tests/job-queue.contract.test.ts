import { describe, expect, it } from "vitest";

async function loadJobQueueModule() {
  try {
    return await import("../src/job-queue") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/adapters-bullmq/src/job-queue.ts to implement the JobQueueAdapter.",
      { cause: error }
    );
  }
}

describe("job queue adapter contract", () => {
  it("exports a factory function for creating the adapter", async () => {
    const mod = await loadJobQueueModule();
    expect(
      typeof mod.createJobQueueAdapter === "function" ||
      typeof mod.JobQueueAdapter === "function" ||
      typeof mod.default === "function"
    ).toBe(true);
  });

  it("adapter has boundary property set to 'job-queue'", async () => {
    const mod = await loadJobQueueModule();
    const factory = mod.createJobQueueAdapter ?? mod.JobQueueAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(adapter.boundary).toBe("job-queue");
  });

  it("adapter exposes enqueue() method", async () => {
    const mod = await loadJobQueueModule();
    const factory = mod.createJobQueueAdapter ?? mod.JobQueueAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(typeof adapter.enqueue).toBe("function");
  });

  it("adapter exposes dequeue() method", async () => {
    const mod = await loadJobQueueModule();
    const factory = mod.createJobQueueAdapter ?? mod.JobQueueAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(typeof adapter.dequeue).toBe("function");
  });

  it("adapter exposes acknowledge() method", async () => {
    const mod = await loadJobQueueModule();
    const factory = mod.createJobQueueAdapter ?? mod.JobQueueAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(typeof adapter.acknowledge).toBe("function");
  });

  it("enqueue() returns { enqueued, jobId } shape", async () => {
    const mod = await loadJobQueueModule();
    const factory = mod.createJobQueueAdapter ?? mod.JobQueueAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    const result = await adapter.enqueue({
      jobId: "job_test_1",
      type: "journey-run",
      payload: { runId: "run_1" },
    });

    expect(result).toHaveProperty("enqueued");
    expect(result).toHaveProperty("jobId");
    expect(typeof result.enqueued).toBe("boolean");
    expect(typeof result.jobId).toBe("string");
  });

  it("dequeue() returns { job } shape where job is object or null", async () => {
    const mod = await loadJobQueueModule();
    const factory = mod.createJobQueueAdapter ?? mod.JobQueueAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    const result = await adapter.dequeue();

    expect(result).toHaveProperty("job");
    expect(result.job === null || typeof result.job === "object").toBe(true);
  });

  it("acknowledge() returns { acknowledged } shape", async () => {
    const mod = await loadJobQueueModule();
    const factory = mod.createJobQueueAdapter ?? mod.JobQueueAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    const result = await adapter.acknowledge("job_test_1");

    expect(result).toHaveProperty("acknowledged");
    expect(typeof result.acknowledged).toBe("boolean");
  });
});
