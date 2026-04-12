import { describe, expect, it } from "vitest";

async function loadSwitchboardBenchmarkRoutes() {
  try {
    return await import("../../../apps/switchboard/src/switchboard-benchmark-routes");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-benchmark-routes.ts to define benchmark routes for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardSeed() {
  try {
    return await import("../../../apps/switchboard/src/switchboard-seed");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-seed.ts to define deterministic seed and reset hooks for Phase 5.",
      { cause: error }
    );
  }
}

describe("switchboard benchmark journeys contract", () => {
  it("SWITCHBOARD_BENCHMARK_ROUTES covers stable journey URLs", async () => {
    const mod = await loadSwitchboardBenchmarkRoutes();

    expect(mod.SWITCHBOARD_BENCHMARK_ROUTES).toHaveLength(7);

    const routeIds = mod.SWITCHBOARD_BENCHMARK_ROUTES.map(
      (route: { id: string }) => route.id
    );

    expect(routeIds).toEqual([
      "inbox-administration",
      "conversation-list",
      "active-conversation",
      "notes-collaboration",
      "operator-shortcuts",
      "automation-rules",
      "reporting",
    ]);
  });

  it("all benchmark route paths are stable Switchboard URLs", async () => {
    const mod = await loadSwitchboardBenchmarkRoutes();

    for (const route of mod.SWITCHBOARD_BENCHMARK_ROUTES) {
      expect(route.path).toMatch(/^\/switchboard\//);
      expect(route.name).toBeTruthy();
      expect(route.requiredSeedKeys.length).toBeGreaterThan(0);
    }
  });

  it("seedSwitchboardBenchmarkEnvironment() returns account, operators, channels, and inboxes", async () => {
    const mod = await loadSwitchboardSeed();
    const env = mod.seedSwitchboardBenchmarkEnvironment();

    expect(env.account.accountId).toBeTruthy();
    expect(env.operators.length).toBeGreaterThanOrEqual(2);
    expect(env.supervisor.userId).toBeTruthy();
    expect(env.teams.length).toBeGreaterThan(0);
    expect(env.channels.map((channel: { type: string }) => channel.type)).toEqual(
      expect.arrayContaining(["website", "api", "email"])
    );
    expect(env.inboxes.length).toBeGreaterThanOrEqual(3);
  });

  it("seed includes contacts, conversations, labels, macros, automation, and reports", async () => {
    const mod = await loadSwitchboardSeed();
    const env = mod.seedSwitchboardBenchmarkEnvironment();

    expect(env.contacts.length).toBeGreaterThan(0);
    expect(env.conversations.length).toBeGreaterThan(0);
    expect(env.messages.length).toBeGreaterThan(0);
    expect(env.labels.length).toBeGreaterThan(0);
    expect(env.cannedResponses.length).toBeGreaterThan(0);
    expect(env.macros.length).toBeGreaterThan(0);
    expect(env.automationRules.length).toBeGreaterThan(0);
    expect(env.reportSummary).toBeTruthy();
  });

  it("resetSwitchboardBenchmarkEnvironment() rebuilds deterministic state", async () => {
    const mod = await loadSwitchboardSeed();
    const first = mod.seedSwitchboardBenchmarkEnvironment();
    const reset = mod.resetSwitchboardBenchmarkEnvironment();

    expect(reset.account.accountId).toBe(first.account.accountId);
    expect(reset.conversations.map((conversation: { conversationId: string }) => conversation.conversationId)).toEqual(
      first.conversations.map((conversation: { conversationId: string }) => conversation.conversationId)
    );
    expect(reset.reportSummary.metrics.openConversations).toBe(
      first.reportSummary.metrics.openConversations
    );
  });

  it("verifySwitchboardBenchmarkSeed() checks unread counts, assignees, and reports", async () => {
    const mod = await loadSwitchboardSeed();
    const env = mod.seedSwitchboardBenchmarkEnvironment();
    const result = mod.verifySwitchboardBenchmarkSeed(env);

    expect(result.ready).toBe(true);
    expect(result.checked).toEqual(
      expect.arrayContaining([
        "unread-counts",
        "assignee-state",
        "automation-rules",
        "report-summary",
      ])
    );
    expect(result.errors).toEqual([]);
  });
});
