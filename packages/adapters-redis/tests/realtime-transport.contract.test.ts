import { describe, expect, it } from "vitest";

async function loadRealtimeTransportModule() {
  try {
    return await import("../src/realtime-transport") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/adapters-redis/src/realtime-transport.ts to implement the RealtimeTransportAdapter.",
      { cause: error }
    );
  }
}

describe("realtime transport adapter contract", () => {
  it("exports a factory function for creating the adapter", async () => {
    const mod = await loadRealtimeTransportModule();
    expect(
      typeof mod.createRealtimeTransportAdapter === "function" ||
      typeof mod.RealtimeTransportAdapter === "function" ||
      typeof mod.default === "function"
    ).toBe(true);
  });

  it("adapter has boundary property set to 'realtime-transport'", async () => {
    const mod = await loadRealtimeTransportModule();
    const factory = mod.createRealtimeTransportAdapter ?? mod.RealtimeTransportAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(adapter.boundary).toBe("realtime-transport");
  });

  it("adapter exposes publish() method", async () => {
    const mod = await loadRealtimeTransportModule();
    const factory = mod.createRealtimeTransportAdapter ?? mod.RealtimeTransportAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(typeof adapter.publish).toBe("function");
  });

  it("adapter exposes subscribe() method", async () => {
    const mod = await loadRealtimeTransportModule();
    const factory = mod.createRealtimeTransportAdapter ?? mod.RealtimeTransportAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(typeof adapter.subscribe).toBe("function");
  });

  it("adapter exposes unsubscribe() method", async () => {
    const mod = await loadRealtimeTransportModule();
    const factory = mod.createRealtimeTransportAdapter ?? mod.RealtimeTransportAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(typeof adapter.unsubscribe).toBe("function");
  });

  it("publish() returns { published, recipientCount } shape", async () => {
    const mod = await loadRealtimeTransportModule();
    const factory = mod.createRealtimeTransportAdapter ?? mod.RealtimeTransportAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    const result = await adapter.publish(
      "workspace.updated",
      { workspaceId: "ws_1", change: "settings" },
      ["user_1", "user_2"]
    );

    expect(result).toHaveProperty("published");
    expect(result).toHaveProperty("recipientCount");
    expect(typeof result.published).toBe("boolean");
    expect(typeof result.recipientCount).toBe("number");
  });

  it("subscribe() returns { subscribed } shape", async () => {
    const mod = await loadRealtimeTransportModule();
    const factory = mod.createRealtimeTransportAdapter ?? mod.RealtimeTransportAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    const result = await adapter.subscribe("workspace.updated", "user_1");

    expect(result).toHaveProperty("subscribed");
    expect(typeof result.subscribed).toBe("boolean");
  });

  it("unsubscribe() returns { unsubscribed } shape", async () => {
    const mod = await loadRealtimeTransportModule();
    const factory = mod.createRealtimeTransportAdapter ?? mod.RealtimeTransportAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    const result = await adapter.unsubscribe("workspace.updated", "user_1");

    expect(result).toHaveProperty("unsubscribed");
    expect(typeof result.unsubscribed).toBe("boolean");
  });
});
