import { describe, expect, it } from "vitest";

async function loadSwitchboardApiRoutes() {
  try {
    return await import("../src/switchboard-api-routes");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-api-routes.ts to define the Switchboard API route manifest for Phase 5.",
      { cause: error }
    );
  }
}

describe("switchboard API contract", () => {
  it("SWITCHBOARD_API_ROUTES manifest covers major support resources", async () => {
    const mod = await loadSwitchboardApiRoutes();

    expect(mod.SWITCHBOARD_API_ROUTES).toHaveLength(16);
  });

  it("each route has resource, path, methods, and benchmark-safe flags", async () => {
    const mod = await loadSwitchboardApiRoutes();

    for (const route of mod.SWITCHBOARD_API_ROUTES) {
      expect(route.resource).toBeTruthy();
      expect(route.path).toMatch(/^\/api\/switchboard\//);
      expect(route.methods.length).toBeGreaterThan(0);
      expect(typeof route.requiresAuth).toBe("boolean");
      expect(typeof route.seedable).toBe("boolean");
    }
  });

  it("route manifest includes all frozen major resources", async () => {
    const mod = await loadSwitchboardApiRoutes();
    const resources = mod.SWITCHBOARD_API_ROUTES.map(
      (route: { resource: string }) => route.resource
    );

    const expectedResources = [
      "accounts",
      "users",
      "inboxes",
      "channels",
      "contacts",
      "conversations",
      "messages",
      "assignments",
      "teams",
      "notes",
      "labels",
      "canned-responses",
      "macros",
      "automation-rules",
      "reports",
      "webhooks",
    ];

    for (const resource of expectedResources) {
      expect(resources).toContain(resource);
    }
  });

  it("conversation and message routes expose lifecycle-safe methods", async () => {
    const mod = await loadSwitchboardApiRoutes();
    const conversations = mod.SWITCHBOARD_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "conversations"
    )!;
    const messages = mod.SWITCHBOARD_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "messages"
    )!;

    expect(conversations.methods).toEqual(
      expect.arrayContaining(["GET", "POST", "PATCH"])
    );
    expect(conversations.actions).toEqual(
      expect.arrayContaining(["assign", "snooze", "resolve", "reopen"])
    );
    expect(messages.methods).toEqual(expect.arrayContaining(["GET", "POST"]));
    expect(messages.actions).toEqual(
      expect.arrayContaining(["reply", "private-note"])
    );
  });

  it("webhook route declares public event coverage", async () => {
    const mod = await loadSwitchboardApiRoutes();
    const webhooks = mod.SWITCHBOARD_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "webhooks"
    )!;

    expect(webhooks.events).toEqual(
      expect.arrayContaining([
        "conversation.created",
        "conversation.updated",
        "message.created",
        "assignment.changed",
      ])
    );
  });
});
