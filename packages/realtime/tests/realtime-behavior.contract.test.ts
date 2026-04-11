import { describe, expect, it, beforeEach } from "vitest";

async function loadRealtimeBehavior() {
  try {
    return await import("../src/realtime-behavior");
  } catch (error) {
    throw new Error(
      "Expected packages/realtime/src/realtime-behavior.ts to define the shared realtime behavior module for Phase 3.",
      { cause: error }
    );
  }
}

describe("realtime behavior contract", () => {
  beforeEach(async () => {
    const mod = await loadRealtimeBehavior();
    mod.resetSequenceTracker();
  });

  it("createRealtimeEvent() produces event with tenancy and sequence", async () => {
    const mod = await loadRealtimeBehavior();
    const event = mod.createRealtimeEvent({
      organizationId: "org_1",
      workspaceId: "ws_1",
      topic: "memberships",
      audience: ["user_1", "user_2"],
      payload: { action: "added" },
      auditEventId: "aud_1",
    });

    expect(event.eventId).toBeTruthy();
    expect(event.organizationId).toBe("org_1");
    expect(event.workspaceId).toBe("ws_1");
    expect(event.topic).toBe("memberships");
    expect(event.audience).toEqual(["user_1", "user_2"]);
    expect(event.sequence).toBe(1);
    expect(event.payload).toEqual({ action: "added" });
    expect(event.occurredAt).toBeTruthy();
    expect(event.auditEventId).toBe("aud_1");
  });

  it("nextSequence() increments per topic+workspace", async () => {
    const mod = await loadRealtimeBehavior();

    const seq1 = mod.nextSequence("memberships", "ws_1");
    const seq2 = mod.nextSequence("memberships", "ws_1");
    const seq3 = mod.nextSequence("audit", "ws_1");
    const seq4 = mod.nextSequence("memberships", "ws_2");

    expect(seq1).toBe(1);
    expect(seq2).toBe(2);
    expect(seq3).toBe(1);
    expect(seq4).toBe(1);
  });

  it("evaluateDelivery() enforces ordered-per-topic guarantee", async () => {
    const mod = await loadRealtimeBehavior();

    const event = mod.createRealtimeEvent({
      organizationId: "org_1",
      workspaceId: "ws_1",
      topic: "files",
      audience: ["user_1"],
      payload: {},
      auditEventId: "aud_1",
      sequence: 1,
    });

    const delivered = mod.evaluateDelivery({
      event,
      guarantees: ["ordered-per-topic"],
      recipientIds: ["user_1"],
    });
    expect(delivered.delivered).toBe(true);
    expect(delivered.sequenceVerified).toBe(true);
    expect(delivered.recipientCount).toBe(1);

    const staleEvent = mod.createRealtimeEvent({
      organizationId: "org_1",
      workspaceId: "ws_1",
      topic: "files",
      audience: ["user_1"],
      payload: {},
      auditEventId: "aud_2",
      sequence: 0,
    });

    const rejected = mod.evaluateDelivery({
      event: staleEvent,
      guarantees: ["ordered-per-topic"],
      recipientIds: ["user_1"],
    });
    expect(rejected.delivered).toBe(false);
    expect(rejected.sequenceVerified).toBe(false);
  });

  it("validateRealtimeEvent() catches missing fields and empty audience", async () => {
    const mod = await loadRealtimeBehavior();

    const errors = mod.validateRealtimeEvent({
      eventId: "",
      organizationId: "",
      workspaceId: "ws_1",
      topic: "memberships",
      audience: [],
      sequence: 1,
      payload: {},
      occurredAt: "",
      auditEventId: "",
    });

    expect(errors).toContain("eventId is required");
    expect(errors).toContain("organizationId is required");
    expect(errors).toContain("occurredAt is required");
    expect(errors).toContain("auditEventId is required");
    expect(errors).toContain("audience must be a non-empty array");
  });
});
