import { describe, expect, it } from "vitest";

async function loadAuditBehavior() {
  try {
    return await import("../src/audit-behavior");
  } catch (error) {
    throw new Error(
      "Expected packages/audit/src/audit-behavior.ts to define the shared audit behavior module for Phase 3.",
      { cause: error }
    );
  }
}

describe("audit behavior contract", () => {
  it("createAuditEvent() produces event with all required fields", async () => {
    const mod = await loadAuditBehavior();
    const event = mod.createAuditEvent({
      actorId: "actor_1",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "invite",
      resourceId: "inv_1",
      action: "invite.sent",
      summary: "Invite sent to user@example.com",
    });

    expect(event.eventId).toBeTruthy();
    expect(event.occurredAt).toBeTruthy();
    expect(event.actorId).toBe("actor_1");
    expect(event.organizationId).toBe("org_1");
    expect(event.workspaceId).toBe("ws_1");
    expect(event.resourceType).toBe("invite");
    expect(event.resourceId).toBe("inv_1");
    expect(event.action).toBe("invite.sent");
    expect(event.summary).toBe("Invite sent to user@example.com");
    expect(event.metadata).toEqual({});
  });

  it("action-specific builders set correct action and metadata", async () => {
    const mod = await loadAuditBehavior();
    const base = {
      actorId: "actor_1",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceId: "res_1",
    };

    const inviteSent = mod.buildInviteSentAuditEvent({
      ...base,
      inviteEmail: "user@example.com",
    });
    expect(inviteSent.action).toBe("invite.sent");
    expect(inviteSent.metadata).toEqual({ inviteEmail: "user@example.com" });

    const jobScheduled = mod.buildJobScheduledAuditEvent({
      ...base,
      jobType: "data-export",
    });
    expect(jobScheduled.action).toBe("job.scheduled");
    expect(jobScheduled.metadata).toEqual({ jobType: "data-export" });

    const searchIndexed = mod.buildSearchIndexedAuditEvent({
      ...base,
      indexedResourceType: "file",
    });
    expect(searchIndexed.action).toBe("search.indexed");
    expect(searchIndexed.metadata).toEqual({ indexedResourceType: "file" });

    const realtimeDelivered = mod.buildRealtimeEventDeliveredAuditEvent({
      ...base,
      topic: "memberships",
    });
    expect(realtimeDelivered.action).toBe("realtime.event-delivered");
    expect(realtimeDelivered.metadata).toEqual({ topic: "memberships" });
  });

  it("validateAuditEvent() catches missing fields and invalid actions", async () => {
    const mod = await loadAuditBehavior();

    const missingFields = mod.validateAuditEvent({
      eventId: "",
      occurredAt: "",
      actorId: "",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "invite",
      resourceId: "inv_1",
      action: "invite.sent",
      summary: "test",
      metadata: {},
    });
    expect(missingFields).toContain("eventId is required");
    expect(missingFields).toContain("occurredAt is required");
    expect(missingFields).toContain("actorId is required");

    const invalidAction = mod.validateAuditEvent({
      eventId: "aud_1",
      occurredAt: new Date().toISOString(),
      actorId: "actor_1",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "invite",
      resourceId: "inv_1",
      action: "invalid.action" as never,
      summary: "test",
      metadata: {},
    });
    expect(invalidAction.some((e: string) => e.includes("Invalid action"))).toBe(true);
  });

  it("action-specific builders preserve tenancy from base params", async () => {
    const mod = await loadAuditBehavior();
    const base = {
      actorId: "actor_1",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceId: "res_1",
    };

    const event = mod.buildFileOwnershipTransferredAuditEvent({
      ...base,
      fromOwner: "mem_1",
      toOwner: "mem_2",
    });
    expect(event.organizationId).toBe("org_1");
    expect(event.workspaceId).toBe("ws_1");
    expect(event.actorId).toBe("actor_1");
    expect(event.action).toBe("file.ownership-transferred");
    expect(event.metadata).toEqual({ fromOwner: "mem_1", toOwner: "mem_2" });
  });
});
