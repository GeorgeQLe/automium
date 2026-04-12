import { describe, expect, it } from "vitest";

async function loadSwitchboardCannedResponses() {
  try {
    return await import("../src/switchboard-canned-responses");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-canned-responses.ts to define canned response helpers for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardMacros() {
  try {
    return await import("../src/switchboard-macros");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-macros.ts to define macro helpers for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardAutomation() {
  try {
    return await import("../src/switchboard-automation");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-automation.ts to define automation rules for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardReports() {
  try {
    return await import("../src/switchboard-reports");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-reports.ts to define report summaries for Phase 5.",
      { cause: error }
    );
  }
}

describe("switchboard automation contract", () => {
  it("canned responses render contact, conversation, and operator variables", async () => {
    const mod = await loadSwitchboardCannedResponses();
    const response = mod.createCannedResponse({
      accountId: "acct_1",
      shortCode: "shipping",
      body: "Hi {{contact.name}}, {{operator.name}} is checking {{conversation.subject}}.",
    });
    const rendered = mod.renderCannedResponse(response, {
      contact: { name: "Alex" },
      operator: { name: "Mina" },
      conversation: { subject: "shipping delay" },
    });

    expect(response.cannedResponseId).toBeTruthy();
    expect(response.shortCode).toBe("shipping");
    expect(rendered).toBe("Hi Alex, Mina is checking shipping delay.");
  });

  it("macros execute ordered action bundles for routing, labels, and replies", async () => {
    const mod = await loadSwitchboardMacros();
    const macro = mod.createMacro({
      accountId: "acct_1",
      name: "Escalate refund",
      actions: [
        { type: "assign-team", value: "team_billing" },
        { type: "add-label", value: "refund" },
        { type: "send-reply", value: "We are escalating this refund." },
      ],
    });
    const result = mod.applyMacro(macro, {
      conversationId: "conv_1",
      actorId: "user_1",
    });

    expect(macro.macroId).toBeTruthy();
    expect(result.conversationId).toBe("conv_1");
    expect(result.actorId).toBe("user_1");
    expect(result.appliedActions.map((action: { type: string }) => action.type)).toEqual([
      "assign-team",
      "add-label",
      "send-reply",
    ]);
    expect(result.appliedAt).toBeTruthy();
  });

  it("automation rules freeze trigger, condition, action, and SLA metadata", async () => {
    const mod = await loadSwitchboardAutomation();

    expect(mod.SWITCHBOARD_AUTOMATION_TRIGGERS).toEqual([
      "conversation-created",
      "message-created",
      "assignment-changed",
      "sla-breached",
    ]);
    expect(mod.SWITCHBOARD_AUTOMATION_ACTIONS).toEqual([
      "assign-team",
      "assign-user",
      "add-label",
      "set-priority",
      "send-reply",
      "send-webhook",
    ]);

    const rule = mod.createAutomationRule({
      accountId: "acct_1",
      name: "Urgent SLA routing",
      trigger: "conversation-created",
      conditions: [
        { field: "conversation.priority", operator: "equals", value: "urgent" },
      ],
      actions: [{ type: "assign-team", value: "team_priority" }],
      sla: { firstResponseSeconds: 60, resolutionSeconds: 3600 },
    });

    expect(rule.automationRuleId).toBeTruthy();
    expect(rule.trigger).toBe("conversation-created");
    expect(rule.sla.firstResponseSeconds).toBe(60);
  });

  it("automation execution returns deterministic action results", async () => {
    const mod = await loadSwitchboardAutomation();
    const rule = mod.createAutomationRule({
      accountId: "acct_1",
      name: "Route API inbox",
      trigger: "message-created",
      conditions: [{ field: "channel.type", operator: "equals", value: "api" }],
      actions: [
        { type: "set-priority", value: "high" },
        { type: "assign-team", value: "team_api" },
      ],
    });
    const result = mod.evaluateAutomationRule(rule, {
      conversationId: "conv_1",
      channel: { type: "api" },
    });

    expect(result.ruleId).toBe(rule.automationRuleId);
    expect(result.matched).toBe(true);
    expect(result.actions).toHaveLength(2);
    expect(result.executedAt).toBeTruthy();
  });

  it("report summaries expose inbox, SLA, assignment, and resolution metrics", async () => {
    const mod = await loadSwitchboardReports();
    const report = mod.createReportSummary({
      accountId: "acct_1",
      inboxId: "inbox_1",
      from: "2026-04-01",
      to: "2026-04-30",
      metrics: {
        openConversations: 7,
        resolvedConversations: 19,
        averageFirstResponseSeconds: 42,
        averageResolutionSeconds: 420,
        slaBreaches: 1,
        reassignmentCount: 3,
      },
    });

    expect(report.reportId).toBeTruthy();
    expect(report.accountId).toBe("acct_1");
    expect(report.inboxId).toBe("inbox_1");
    expect(report.metrics.resolvedConversations).toBe(19);
    expect(report.metrics.slaBreaches).toBe(1);
    expect(report.generatedAt).toBeTruthy();
  });
});
