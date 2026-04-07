import { describe, expect, it } from "vitest";

async function loadRealtimeContract() {
  try {
    return await import("../src/platform-realtime");
  } catch (error) {
    throw new Error(
      "Expected packages/realtime/src/platform-realtime.ts to define the shared realtime contract for Phase 3.",
      { cause: error }
    );
  }
}

describe("shared realtime platform contract", () => {
  it("requires a delivery envelope with tenancy, ordering, and audit linkage", async () => {
    const contract = await loadRealtimeContract();

    expect(contract.REALTIME_EVENT_REQUIRED_FIELDS).toEqual([
      "eventId",
      "organizationId",
      "workspaceId",
      "topic",
      "audience",
      "sequence",
      "payload",
      "occurredAt",
      "auditEventId"
    ]);
  });

  it("requires delivery guarantees for permission-checked, ordered event fan-out", async () => {
    const contract = await loadRealtimeContract();

    expect(contract.REALTIME_DELIVERY_GUARANTEES).toEqual([
      "permission-checked",
      "ordered-per-topic",
      "at-least-once"
    ]);
    expect(contract.REALTIME_SHARED_TOPICS).toEqual([
      "memberships",
      "audit",
      "files",
      "jobs",
      "search"
    ]);
  });
});
