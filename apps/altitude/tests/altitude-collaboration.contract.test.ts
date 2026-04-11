import { describe, expect, it } from "vitest";

async function loadAltitudeRealtime() {
  try {
    return await import("../src/altitude-realtime");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-realtime.ts to define realtime collaboration for Phase 4.",
      { cause: error }
    );
  }
}

async function loadAltitudeWebhooks() {
  try {
    return await import("../src/altitude-webhooks");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-webhooks.ts to define webhook configuration for Phase 4.",
      { cause: error }
    );
  }
}

describe("altitude collaboration contract", () => {
  it("ALTITUDE_REALTIME_TOPICS frozen array includes expected topics", async () => {
    const mod = await loadAltitudeRealtime();

    expect(mod.ALTITUDE_REALTIME_TOPICS).toEqual([
      "work-item-changed",
      "comment-added",
      "assignment-changed",
      "cycle-updated",
      "module-updated",
    ]);
  });

  it("createAltitudeRealtimeEvent() produces events with tenancy fields", async () => {
    const mod = await loadAltitudeRealtime();

    const event = mod.createAltitudeRealtimeEvent({
      organizationId: "org_1",
      workspaceId: "ws_1",
      topic: "work-item-changed",
      payload: { workItemId: "wi_1", action: "state-changed" },
    });

    expect(event.eventId).toBeTruthy();
    expect(event.organizationId).toBe("org_1");
    expect(event.workspaceId).toBe("ws_1");
    expect(event.topic).toBe("work-item-changed");
    expect(event.payload.workItemId).toBe("wi_1");
    expect(event.occurredAt).toBeTruthy();

    const commentEvent = mod.createAltitudeRealtimeEvent({
      organizationId: "org_1",
      workspaceId: "ws_1",
      topic: "comment-added",
      payload: { commentId: "cmt_1", workItemId: "wi_1" },
    });
    expect(commentEvent.topic).toBe("comment-added");

    const assignEvent = mod.createAltitudeRealtimeEvent({
      organizationId: "org_1",
      workspaceId: "ws_1",
      topic: "assignment-changed",
      payload: { workItemId: "wi_1", assigneeId: "user_2" },
    });
    expect(assignEvent.topic).toBe("assignment-changed");
  });

  it("ALTITUDE_WEBHOOK_EVENTS covers major resource change events", async () => {
    const mod = await loadAltitudeWebhooks();

    const expectedEvents = [
      "project.created",
      "project.updated",
      "work-item.created",
      "work-item.updated",
      "work-item.deleted",
      "comment.created",
      "cycle.created",
      "cycle.updated",
      "module.created",
      "module.updated",
    ];

    for (const event of expectedEvents) {
      expect(mod.ALTITUDE_WEBHOOK_EVENTS).toContain(event);
    }
  });

  it("webhook config factory produces config with URL and event filter", async () => {
    const mod = await loadAltitudeWebhooks();
    const config = mod.createWebhookConfig({
      url: "https://example.com/webhook",
      events: ["work-item.created", "work-item.updated"],
      projectId: "proj_1",
    });

    expect(config.webhookId).toBeTruthy();
    expect(config.url).toBe("https://example.com/webhook");
    expect(config.events).toEqual(["work-item.created", "work-item.updated"]);
    expect(config.projectId).toBe("proj_1");
    expect(config.createdAt).toBeTruthy();
  });
});
