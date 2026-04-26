import { describe, expect, it } from "vitest";

async function loadWorkerProcessModule() {
  try {
    return await import("../src/worker-process") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/worker/src/worker-process.ts to implement worker process lifecycle.",
      { cause: error }
    );
  }
}

async function loadHeartbeatModule() {
  try {
    return await import("../src/heartbeat") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/worker/src/heartbeat.ts to implement heartbeat reporting.",
      { cause: error }
    );
  }
}

describe("worker process contract", () => {
  it("exports a createWorkerProcess factory function", async () => {
    const mod = await loadWorkerProcessModule();

    expect(
      typeof mod.createWorkerProcess === "function" ||
      typeof mod.default === "function"
    ).toBe(true);
  });

  it("worker process exposes start() method", async () => {
    const mod = await loadWorkerProcessModule();
    const factory = mod.createWorkerProcess ?? mod.default;
    const worker = typeof factory === "function"
      ? (factory as Function)({
          workerId: "worker-test-1",
          tenantId: "tenant-test",
          isolation: "per-run-browser-context",
          capabilities: ["browser"],
        } as never)
      : factory;

    expect(typeof worker.start).toBe("function");
  });

  it("worker process exposes stop() method", async () => {
    const mod = await loadWorkerProcessModule();
    const factory = mod.createWorkerProcess ?? mod.default;
    const worker = typeof factory === "function"
      ? (factory as Function)({
          workerId: "worker-test-1",
          tenantId: "tenant-test",
          isolation: "per-run-browser-context",
          capabilities: ["browser"],
        } as never)
      : factory;

    expect(typeof worker.stop).toBe("function");
  });

  it("worker process exposes status() method", async () => {
    const mod = await loadWorkerProcessModule();
    const factory = mod.createWorkerProcess ?? mod.default;
    const worker = typeof factory === "function"
      ? (factory as Function)({
          workerId: "worker-test-1",
          tenantId: "tenant-test",
          isolation: "per-run-browser-context",
          capabilities: ["browser"],
        } as never)
      : factory;

    expect(typeof worker.status).toBe("function");
  });
});

describe("heartbeat reporter contract", () => {
  it("exports a createHeartbeatReporter factory function", async () => {
    const mod = await loadHeartbeatModule();

    expect(
      typeof mod.createHeartbeatReporter === "function" ||
      typeof mod.default === "function"
    ).toBe(true);
  });

  it("heartbeat reporter exposes report() method", async () => {
    const mod = await loadHeartbeatModule();
    const factory = mod.createHeartbeatReporter ?? mod.default;
    const reporter = typeof factory === "function"
      ? (factory as Function)({ workerId: "worker-test-1" } as never)
      : factory;

    expect(typeof reporter.report).toBe("function");
  });

  it("heartbeat reporter exposes stop() method", async () => {
    const mod = await loadHeartbeatModule();
    const factory = mod.createHeartbeatReporter ?? mod.default;
    const reporter = typeof factory === "function"
      ? (factory as Function)({ workerId: "worker-test-1" } as never)
      : factory;

    expect(typeof reporter.stop).toBe("function");
  });
});
