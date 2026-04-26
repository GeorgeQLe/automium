import { describe, expect, it } from "vitest";

async function loadQueueDefinitionsModule() {
  try {
    return await import("../src/queue-definitions") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/adapters-bullmq/src/queue-definitions.ts to define named queues and priority weights.",
      { cause: error }
    );
  }
}

describe("queue definitions contract", () => {
  it("exports QUEUE_DEFINITIONS as a frozen array of named queues", async () => {
    const mod = await loadQueueDefinitionsModule();
    const defs = mod.QUEUE_DEFINITIONS as readonly Record<string, unknown>[];

    expect(Array.isArray(defs)).toBe(true);
    expect(Object.isFrozen(defs)).toBe(true);
  });

  it("defines journey-runs queue", async () => {
    const mod = await loadQueueDefinitionsModule();
    const defs = mod.QUEUE_DEFINITIONS as readonly Record<string, unknown>[];
    const journeyRuns = defs.find((q) => q.name === "journey-runs");

    expect(journeyRuns).toBeDefined();
    expect(journeyRuns!.name).toBe("journey-runs");
  });

  it("defines artifact-upload queue", async () => {
    const mod = await loadQueueDefinitionsModule();
    const defs = mod.QUEUE_DEFINITIONS as readonly Record<string, unknown>[];
    const artifactUpload = defs.find((q) => q.name === "artifact-upload");

    expect(artifactUpload).toBeDefined();
  });

  it("defines audit-sink queue", async () => {
    const mod = await loadQueueDefinitionsModule();
    const defs = mod.QUEUE_DEFINITIONS as readonly Record<string, unknown>[];
    const auditSink = defs.find((q) => q.name === "audit-sink");

    expect(auditSink).toBeDefined();
  });

  it("defines data-lifecycle queue", async () => {
    const mod = await loadQueueDefinitionsModule();
    const defs = mod.QUEUE_DEFINITIONS as readonly Record<string, unknown>[];
    const dataLifecycle = defs.find((q) => q.name === "data-lifecycle");

    expect(dataLifecycle).toBeDefined();
  });

  it("exports exactly 4 named queues", async () => {
    const mod = await loadQueueDefinitionsModule();
    const defs = mod.QUEUE_DEFINITIONS as readonly Record<string, unknown>[];

    expect(defs.length).toBe(4);
  });

  it("exports QUEUE_PRIORITY_WEIGHTS with high < normal < low ordering", async () => {
    const mod = await loadQueueDefinitionsModule();
    const weights = mod.QUEUE_PRIORITY_WEIGHTS as Record<string, number>;

    expect(weights).toBeDefined();
    expect(typeof weights.high).toBe("number");
    expect(typeof weights.normal).toBe("number");
    expect(typeof weights.low).toBe("number");
    expect(weights.high).toBeLessThan(weights.normal);
    expect(weights.normal).toBeLessThan(weights.low);
  });
});
