import { describe, expect, it } from "vitest";

async function loadSwitchboardDomain() {
  try {
    return await import("../src/switchboard-domain");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-domain.ts to define Switchboard domain interfaces and factories for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardConstants() {
  try {
    return await import("../src/switchboard-constants");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-constants.ts to define frozen Switchboard constants for Phase 5.",
      { cause: error }
    );
  }
}

describe("switchboard domain contract", () => {
  it("frozen constants cover support workspace states and event names", async () => {
    const mod = await loadSwitchboardConstants();

    expect(mod.SWITCHBOARD_CONVERSATION_STATUSES).toEqual([
      "open",
      "pending",
      "snoozed",
      "resolved",
    ]);
    expect(mod.SWITCHBOARD_PRIORITIES).toEqual(["low", "normal", "high", "urgent"]);
    expect(mod.SWITCHBOARD_CHANNEL_TYPES).toEqual([
      "website",
      "api",
      "email",
      "whatsapp",
      "facebook",
      "instagram",
      "telegram",
      "line",
      "sms",
      "tiktok",
      "x-twitter",
      "voice",
    ]);
    expect(mod.SWITCHBOARD_MESSAGE_DIRECTIONS).toEqual(["inbound", "outbound"]);
    expect(mod.SWITCHBOARD_MESSAGE_TYPES).toEqual([
      "text",
      "private-note",
      "system",
      "automation",
    ]);
    expect(mod.SWITCHBOARD_ASSIGNMENT_STATUSES).toEqual([
      "unassigned",
      "assigned",
      "transferred",
    ]);
    expect(mod.SWITCHBOARD_REALTIME_TOPICS).toEqual([
      "conversation.updated",
      "message.created",
      "assignment.changed",
      "note.created",
      "inbox.routed",
    ]);
    expect(mod.SWITCHBOARD_WEBHOOK_EVENTS).toContain("conversation.created");
    expect(mod.SWITCHBOARD_WEBHOOK_EVENTS).toContain("message.created");
    expect(mod.SWITCHBOARD_WEBHOOK_EVENTS).toContain("assignment.changed");
  });

  it("createSwitchboardAccount() and createSwitchboardUser() preserve tenancy identity", async () => {
    const mod = await loadSwitchboardDomain();
    const account = mod.createSwitchboardAccount({
      name: "Example Support",
      organizationId: "org_1",
      workspaceId: "ws_1",
      timezone: "America/New_York",
    });
    const user = mod.createSwitchboardUser({
      accountId: account.accountId,
      name: "Mina Operator",
      email: "mina@example.com",
      role: "operator",
    });

    expect(account.accountId).toBeTruthy();
    expect(account.organizationId).toBe("org_1");
    expect(account.workspaceId).toBe("ws_1");
    expect(account.timezone).toBe("America/New_York");
    expect(account.createdAt).toBeTruthy();

    expect(user.userId).toBeTruthy();
    expect(user.accountId).toBe(account.accountId);
    expect(user.name).toBe("Mina Operator");
    expect(user.email).toBe("mina@example.com");
    expect(user.role).toBe("operator");
    expect(user.createdAt).toBeTruthy();
  });

  it("creates teams, inboxes, channel config, and contacts with durable IDs", async () => {
    const mod = await loadSwitchboardDomain();
    const team = mod.createSwitchboardTeam({
      accountId: "acct_1",
      name: "Tier 1",
      memberIds: ["user_1", "user_2"],
    });
    const channel = mod.createSwitchboardChannelConfig({
      accountId: "acct_1",
      type: "website",
      name: "Website Chat",
      settings: { widgetColor: "#007a5a" },
    });
    const inbox = mod.createSwitchboardInbox({
      accountId: "acct_1",
      name: "Website Support",
      channelId: channel.channelId,
      teamId: team.teamId,
    });
    const contact = mod.createSwitchboardContact({
      accountId: "acct_1",
      name: "Alex Customer",
      email: "alex@example.com",
      externalId: "customer_1",
    });

    expect(team.teamId).toBeTruthy();
    expect(team.memberIds).toEqual(["user_1", "user_2"]);
    expect(channel.channelId).toBeTruthy();
    expect(channel.type).toBe("website");
    expect(channel.settings.widgetColor).toBe("#007a5a");
    expect(inbox.inboxId).toBeTruthy();
    expect(inbox.channelId).toBe(channel.channelId);
    expect(inbox.teamId).toBe(team.teamId);
    expect(contact.contactId).toBeTruthy();
    expect(contact.email).toBe("alex@example.com");
    expect(contact.externalId).toBe("customer_1");
  });

  it("creates conversations, messages, assignments, notes, and labels", async () => {
    const mod = await loadSwitchboardDomain();
    const conversation = mod.createSwitchboardConversation({
      accountId: "acct_1",
      inboxId: "inbox_1",
      contactId: "contact_1",
      status: "open",
      priority: "high",
      subject: "Cannot access billing",
    });
    const message = mod.createSwitchboardMessage({
      conversationId: conversation.conversationId,
      authorId: "contact_1",
      direction: "inbound",
      type: "text",
      body: "I cannot access my billing page.",
    });
    const assignment = mod.createSwitchboardAssignment({
      conversationId: conversation.conversationId,
      assigneeId: "user_1",
      teamId: "team_1",
      status: "assigned",
    });
    const note = mod.createSwitchboardNote({
      conversationId: conversation.conversationId,
      authorId: "user_1",
      body: "Mention @supervisor if billing confirms outage.",
      mentionIds: ["user_2"],
    });
    const label = mod.createSwitchboardLabel({
      accountId: "acct_1",
      name: "billing",
      color: "#0047ab",
    });

    expect(conversation.conversationId).toBeTruthy();
    expect(conversation.status).toBe("open");
    expect(conversation.priority).toBe("high");
    expect(message.messageId).toBeTruthy();
    expect(message.direction).toBe("inbound");
    expect(message.type).toBe("text");
    expect(assignment.assignmentId).toBeTruthy();
    expect(assignment.assigneeId).toBe("user_1");
    expect(note.noteId).toBeTruthy();
    expect(note.mentionIds).toEqual(["user_2"]);
    expect(label.labelId).toBeTruthy();
    expect(label.name).toBe("billing");
  });

  it("creates canned responses, macros, automation rules, and report summaries", async () => {
    const mod = await loadSwitchboardDomain();
    const cannedResponse = mod.createSwitchboardCannedResponse({
      accountId: "acct_1",
      shortCode: "billing-help",
      body: "I can help with your billing question, {{contact.name}}.",
    });
    const macro = mod.createSwitchboardMacro({
      accountId: "acct_1",
      name: "Escalate billing",
      actions: [
        { type: "assign-team", value: "team_billing" },
        { type: "add-label", value: "billing" },
      ],
    });
    const automationRule = mod.createSwitchboardAutomationRule({
      accountId: "acct_1",
      name: "Route urgent billing",
      trigger: "conversation-created",
      conditions: [{ field: "message.body", operator: "contains", value: "billing" }],
      actions: [{ type: "assign-team", value: "team_billing" }],
    });
    const report = mod.createSwitchboardReportSummary({
      accountId: "acct_1",
      inboxId: "inbox_1",
      metrics: {
        openConversations: 7,
        resolvedConversations: 19,
        averageFirstResponseSeconds: 42,
      },
    });

    expect(cannedResponse.cannedResponseId).toBeTruthy();
    expect(cannedResponse.shortCode).toBe("billing-help");
    expect(macro.macroId).toBeTruthy();
    expect(macro.actions).toHaveLength(2);
    expect(automationRule.automationRuleId).toBeTruthy();
    expect(automationRule.trigger).toBe("conversation-created");
    expect(report.reportId).toBeTruthy();
    expect(report.metrics.openConversations).toBe(7);
  });

  it("validators catch missing required fields across major resources", async () => {
    const mod = await loadSwitchboardDomain();

    const accountErrors = mod.validateSwitchboardAccount({
      accountId: "",
      organizationId: "",
      workspaceId: "ws_1",
      name: "",
      timezone: "",
      createdAt: "",
    });
    const conversationErrors = mod.validateSwitchboardConversation({
      conversationId: "",
      accountId: "",
      inboxId: "",
      contactId: "",
      status: "open",
      priority: "normal",
      subject: "",
      createdAt: "",
      updatedAt: "",
    });

    expect(accountErrors).toContain("accountId is required");
    expect(accountErrors).toContain("organizationId is required");
    expect(accountErrors).toContain("name is required");
    expect(conversationErrors).toContain("conversationId is required");
    expect(conversationErrors).toContain("accountId is required");
    expect(conversationErrors).toContain("inboxId is required");
    expect(conversationErrors).toContain("contactId is required");
  });
});
