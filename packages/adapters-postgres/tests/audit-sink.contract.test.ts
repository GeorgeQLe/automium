import { describe, expect, it } from "vitest";

async function loadAuditSinkModule() {
  try {
    return await import("../src/audit-sink");
  } catch (error) {
    throw new Error(
      "Expected packages/adapters-postgres/src/audit-sink.ts to implement the AuditSinkAdapter.",
      { cause: error }
    );
  }
}

describe("audit sink adapter contract", () => {
  it("exports a factory function for creating the adapter", async () => {
    const mod = await loadAuditSinkModule();
    expect(
      typeof mod.createAuditSinkAdapter === "function" ||
      typeof mod.AuditSinkAdapter === "function" ||
      typeof mod.default === "function"
    ).toBe(true);
  });

  it("adapter has boundary property set to 'audit-sink'", async () => {
    const mod = await loadAuditSinkModule();
    const factory = mod.createAuditSinkAdapter ?? mod.AuditSinkAdapter ?? mod.default;
    // Factory requires a db pool; pass a stub to verify the shape
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(adapter.boundary).toBe("audit-sink");
  });

  it("adapter exposes emit() method", async () => {
    const mod = await loadAuditSinkModule();
    const factory = mod.createAuditSinkAdapter ?? mod.AuditSinkAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(typeof adapter.emit).toBe("function");
  });

  it("adapter exposes query() method", async () => {
    const mod = await loadAuditSinkModule();
    const factory = mod.createAuditSinkAdapter ?? mod.AuditSinkAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(typeof adapter.query).toBe("function");
  });

  it("emit() returns { persisted, eventId } shape", async () => {
    const mod = await loadAuditSinkModule();
    const factory = mod.createAuditSinkAdapter ?? mod.AuditSinkAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    // emit() should accept a record and return the expected shape
    // This will fail until a real db is wired up, but validates the contract exists
    const result = await adapter.emit({
      eventId: "evt_test",
      actorId: "actor_1",
      organizationId: "org_1",
      workspaceId: "ws_1",
      action: "test.action",
      resourceType: "test",
      resourceId: "res_1",
      summary: "test event",
      occurredAt: new Date().toISOString(),
    });

    expect(result).toHaveProperty("persisted");
    expect(result).toHaveProperty("eventId");
    expect(typeof result.persisted).toBe("boolean");
    expect(typeof result.eventId).toBe("string");
  });

  it("query() returns { events } shape", async () => {
    const mod = await loadAuditSinkModule();
    const factory = mod.createAuditSinkAdapter ?? mod.AuditSinkAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    const result = await adapter.query({
      organizationId: "org_1",
      workspaceId: "ws_1",
    });

    expect(result).toHaveProperty("events");
    expect(Array.isArray(result.events)).toBe(true);
  });
});
