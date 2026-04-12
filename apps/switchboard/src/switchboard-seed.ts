import {
  createApiChannel,
  createEmailChannel,
  createWebsiteLiveChatChannel,
  type ApiChannel,
  type EmailChannel,
  type WebsiteLiveChatChannel,
} from "./switchboard-channels";
import {
  createSwitchboardAccount,
  createSwitchboardAssignment,
  createSwitchboardContact,
  createSwitchboardConversation,
  createSwitchboardInbox,
  createSwitchboardLabel,
  createSwitchboardMessage,
  createSwitchboardReportSummary,
  createSwitchboardTeam,
  createSwitchboardUser,
  type SwitchboardAccount,
  type SwitchboardAssignment,
  type SwitchboardCannedResponse,
  type SwitchboardChannelConfig,
  type SwitchboardContact,
  type SwitchboardConversation,
  type SwitchboardLabel,
  type SwitchboardMacro,
  type SwitchboardMessage,
  type SwitchboardNote,
  type SwitchboardReportSummary,
  type SwitchboardTeam,
  type SwitchboardUser,
} from "./switchboard-domain";
import {
  createAutomationRule,
  type SwitchboardAutomationRuleWithSla,
} from "./switchboard-automation";
import { createCannedResponse } from "./switchboard-canned-responses";
import { createMacro } from "./switchboard-macros";
import { createPrivateNote } from "./switchboard-notes";

const SEED_AT = "2026-01-15T12:00:00.000Z";

type SwitchboardBenchmarkChannel =
  | WebsiteLiveChatChannel
  | ApiChannel
  | EmailChannel
  | SwitchboardChannelConfig;

export interface SwitchboardBenchmarkConversationListItem {
  conversationId: string;
  inboxId: string;
  subject: string;
  status: SwitchboardConversation["status"];
  priority: SwitchboardConversation["priority"];
  assigneeId?: string;
  unreadCount: number;
  lastMessageAt: string;
}

export interface SwitchboardBenchmarkEnvironment {
  account: SwitchboardAccount;
  operators: SwitchboardUser[];
  supervisor: SwitchboardUser;
  teams: SwitchboardTeam[];
  channels: SwitchboardBenchmarkChannel[];
  inboxes: ReturnType<typeof createSwitchboardInbox>[];
  contacts: SwitchboardContact[];
  conversations: SwitchboardConversation[];
  messages: SwitchboardMessage[];
  assignments: SwitchboardAssignment[];
  notes: SwitchboardNote[];
  labels: SwitchboardLabel[];
  cannedResponses: SwitchboardCannedResponse[];
  macros: SwitchboardMacro[];
  automationRules: SwitchboardAutomationRuleWithSla[];
  reportSummary: SwitchboardReportSummary;
  benchmark: {
    inboxAdministration: {
      defaultInboxId: string;
      channelTypeByInboxId: Record<string, string>;
    };
    conversationList: {
      unreadCounts: Record<string, number>;
      items: SwitchboardBenchmarkConversationListItem[];
    };
    activeConversation: {
      conversationId: string;
      messageIds: string[];
      assignmentId: string;
      noteIds: string[];
      sla: {
        firstResponseDueAt: string;
        resolutionDueAt: string;
      };
    };
    collaboratorIdentities: Array<{
      userId: string;
      name: string;
      role: string;
    }>;
    triageStates: Record<
      string,
      {
        priority: SwitchboardConversation["priority"];
        labelIds: string[];
        slaState: "healthy" | "due-soon" | "breached";
      }
    >;
    operatorShortcuts: {
      cannedResponseShortCodes: string[];
      macroIds: string[];
    };
    reporting: {
      snapshotId: string;
      generatedForInboxIds: string[];
    };
  };
}

export interface SwitchboardBenchmarkSeedVerification {
  ready: boolean;
  checked: string[];
  errors: string[];
}

export function seedSwitchboardBenchmarkEnvironment(): SwitchboardBenchmarkEnvironment {
  const account = createSwitchboardAccount({
    accountId: "acct_switchboard_benchmark",
    organizationId: "org_switchboard_benchmark",
    workspaceId: "ws_switchboard_benchmark",
    name: "Switchboard Benchmark Support",
    timezone: "America/New_York",
    createdAt: SEED_AT,
  });

  const operators = [
    createSwitchboardUser({
      userId: "user_operator_mina",
      accountId: account.accountId,
      name: "Mina Operator",
      email: "mina.operator@example.com",
      role: "operator",
      createdAt: SEED_AT,
    }),
    createSwitchboardUser({
      userId: "user_operator_lee",
      accountId: account.accountId,
      name: "Lee Operator",
      email: "lee.operator@example.com",
      role: "operator",
      createdAt: SEED_AT,
    }),
  ];
  const supervisor = createSwitchboardUser({
    userId: "user_supervisor_nora",
    accountId: account.accountId,
    name: "Nora Supervisor",
    email: "nora.supervisor@example.com",
    role: "supervisor",
    createdAt: SEED_AT,
  });

  const teams = [
    createSwitchboardTeam({
      teamId: "team_tier_1",
      accountId: account.accountId,
      name: "Tier 1",
      memberIds: [operators[0].userId, operators[1].userId],
      createdAt: SEED_AT,
    }),
    createSwitchboardTeam({
      teamId: "team_billing",
      accountId: account.accountId,
      name: "Billing",
      memberIds: [operators[1].userId, supervisor.userId],
      createdAt: SEED_AT,
    }),
  ];

  const inboxIds = {
    website: "inbox_website_support",
    api: "inbox_api_support",
    email: "inbox_email_support",
  };
  const channels = [
    {
      ...createWebsiteLiveChatChannel({
        accountId: account.accountId,
        inboxId: inboxIds.website,
        widgetId: "widget_switchboard_benchmark",
        allowedOrigins: ["https://benchmark.automium.local"],
      }),
      createdAt: SEED_AT,
    },
    {
      ...createApiChannel({
        accountId: account.accountId,
        inboxId: inboxIds.api,
        tokenName: "benchmark-ingest",
      }),
      createdAt: SEED_AT,
    },
    {
      ...createEmailChannel({
        accountId: account.accountId,
        inboxId: inboxIds.email,
        address: "support@benchmark.automium.local",
        threadingMode: "references-header",
      }),
      createdAt: SEED_AT,
    },
  ] satisfies SwitchboardBenchmarkChannel[];

  const inboxes = [
    createSwitchboardInbox({
      inboxId: inboxIds.website,
      accountId: account.accountId,
      name: "Website Support",
      channelId: channels[0].channelId,
      teamId: teams[0].teamId,
      createdAt: SEED_AT,
    }),
    createSwitchboardInbox({
      inboxId: inboxIds.api,
      accountId: account.accountId,
      name: "API Support",
      channelId: channels[1].channelId,
      teamId: teams[0].teamId,
      createdAt: SEED_AT,
    }),
    createSwitchboardInbox({
      inboxId: inboxIds.email,
      accountId: account.accountId,
      name: "Email Support",
      channelId: channels[2].channelId,
      teamId: teams[1].teamId,
      createdAt: SEED_AT,
    }),
  ];

  const contacts = [
    createSwitchboardContact({
      contactId: "contact_alex_rivera",
      accountId: account.accountId,
      name: "Alex Rivera",
      email: "alex@example.com",
      externalId: "customer_alex",
      createdAt: SEED_AT,
    }),
    createSwitchboardContact({
      contactId: "contact_priya_shah",
      accountId: account.accountId,
      name: "Priya Shah",
      email: "priya@example.com",
      externalId: "customer_priya",
      createdAt: SEED_AT,
    }),
    createSwitchboardContact({
      contactId: "contact_morgan_chen",
      accountId: account.accountId,
      name: "Morgan Chen",
      email: "morgan@example.com",
      externalId: "customer_morgan",
      createdAt: SEED_AT,
    }),
  ];

  const conversations = [
    createSwitchboardConversation({
      conversationId: "conv_website_001",
      accountId: account.accountId,
      inboxId: inboxIds.website,
      contactId: contacts[0].contactId,
      status: "open",
      priority: "high",
      subject: "Cannot complete checkout",
      createdAt: "2026-01-15T09:00:00.000Z",
      updatedAt: "2026-01-15T09:12:00.000Z",
    }),
    createSwitchboardConversation({
      conversationId: "conv_api_001",
      accountId: account.accountId,
      inboxId: inboxIds.api,
      contactId: contacts[1].contactId,
      status: "open",
      priority: "urgent",
      subject: "Webhook delivery failing",
      createdAt: "2026-01-15T09:15:00.000Z",
      updatedAt: "2026-01-15T09:21:00.000Z",
    }),
    createSwitchboardConversation({
      conversationId: "conv_email_001",
      accountId: account.accountId,
      inboxId: inboxIds.email,
      contactId: contacts[2].contactId,
      status: "pending",
      priority: "normal",
      subject: "Invoice copy request",
      createdAt: "2026-01-15T08:30:00.000Z",
      updatedAt: "2026-01-15T09:05:00.000Z",
    }),
    createSwitchboardConversation({
      conversationId: "conv_historical_001",
      accountId: account.accountId,
      inboxId: inboxIds.website,
      contactId: contacts[1].contactId,
      status: "resolved",
      priority: "low",
      subject: "Password reset completed",
      createdAt: "2026-01-14T11:00:00.000Z",
      updatedAt: "2026-01-14T11:18:00.000Z",
    }),
  ];

  const messages = [
    createSwitchboardMessage({
      messageId: "msg_website_001",
      conversationId: "conv_website_001",
      authorId: contacts[0].contactId,
      direction: "inbound",
      type: "text",
      body: "Checkout is stuck after I enter my card.",
      createdAt: "2026-01-15T09:00:00.000Z",
    }),
    createSwitchboardMessage({
      messageId: "msg_website_002",
      conversationId: "conv_website_001",
      authorId: operators[0].userId,
      direction: "outbound",
      type: "text",
      body: "I am checking the payment attempt now.",
      createdAt: "2026-01-15T09:05:00.000Z",
    }),
    createSwitchboardMessage({
      messageId: "msg_website_003",
      conversationId: "conv_website_001",
      authorId: contacts[0].contactId,
      direction: "inbound",
      type: "text",
      body: "It still fails after trying again.",
      createdAt: "2026-01-15T09:12:00.000Z",
    }),
    createSwitchboardMessage({
      messageId: "msg_api_001",
      conversationId: "conv_api_001",
      authorId: contacts[1].contactId,
      direction: "inbound",
      type: "text",
      body: "Webhook retries are returning 500.",
      createdAt: "2026-01-15T09:15:00.000Z",
    }),
    createSwitchboardMessage({
      messageId: "msg_api_002",
      conversationId: "conv_api_001",
      authorId: operators[1].userId,
      direction: "outbound",
      type: "text",
      body: "I am escalating this to billing integrations.",
      createdAt: "2026-01-15T09:21:00.000Z",
    }),
    createSwitchboardMessage({
      messageId: "msg_email_001",
      conversationId: "conv_email_001",
      authorId: contacts[2].contactId,
      direction: "inbound",
      type: "text",
      body: "Can you send last month's invoice?",
      createdAt: "2026-01-15T08:30:00.000Z",
    }),
    createSwitchboardMessage({
      messageId: "msg_historical_001",
      conversationId: "conv_historical_001",
      authorId: operators[0].userId,
      direction: "outbound",
      type: "text",
      body: "Your password reset is complete.",
      createdAt: "2026-01-14T11:18:00.000Z",
    }),
  ];

  const assignments = [
    createSwitchboardAssignment({
      assignmentId: "assign_website_001",
      conversationId: "conv_website_001",
      assigneeId: operators[0].userId,
      teamId: teams[0].teamId,
      status: "assigned",
      assignedBy: supervisor.userId,
      assignedAt: "2026-01-15T09:03:00.000Z",
    }),
    createSwitchboardAssignment({
      assignmentId: "assign_api_001",
      conversationId: "conv_api_001",
      assigneeId: operators[1].userId,
      teamId: teams[1].teamId,
      status: "assigned",
      assignedBy: supervisor.userId,
      assignedAt: "2026-01-15T09:17:00.000Z",
    }),
    createSwitchboardAssignment({
      assignmentId: "assign_email_001",
      conversationId: "conv_email_001",
      teamId: teams[1].teamId,
      status: "unassigned",
      assignedBy: supervisor.userId,
      assignedAt: "2026-01-15T08:31:00.000Z",
    }),
  ];

  const notes = [
    createPrivateNote({
      noteId: "note_website_001",
      conversationId: "conv_website_001",
      authorId: operators[0].userId,
      body: "Payment provider shows an authorization timeout.",
      mentionIds: [supervisor.userId],
      createdAt: "2026-01-15T09:08:00.000Z",
    }),
    createPrivateNote({
      noteId: "note_api_001",
      conversationId: "conv_api_001",
      authorId: operators[1].userId,
      body: "Customer has an enterprise SLA.",
      mentionIds: [supervisor.userId],
      createdAt: "2026-01-15T09:18:00.000Z",
    }),
  ];

  const labels = [
    createSwitchboardLabel({
      labelId: "label_billing",
      accountId: account.accountId,
      name: "billing",
      color: "#0047ab",
      createdAt: SEED_AT,
    }),
    createSwitchboardLabel({
      labelId: "label_sla",
      accountId: account.accountId,
      name: "sla",
      color: "#0f766e",
      createdAt: SEED_AT,
    }),
    createSwitchboardLabel({
      labelId: "label_bug",
      accountId: account.accountId,
      name: "bug",
      color: "#b91c1c",
      createdAt: SEED_AT,
    }),
  ];

  const cannedResponses = [
    createCannedResponse({
      cannedResponseId: "canned_billing_help",
      accountId: account.accountId,
      shortCode: "billing-help",
      body: "I can help with your billing question, {{contact.name}}.",
      createdAt: SEED_AT,
    }),
    createCannedResponse({
      cannedResponseId: "canned_sla_ack",
      accountId: account.accountId,
      shortCode: "sla-ack",
      body: "We are prioritizing this under your support plan.",
      createdAt: SEED_AT,
    }),
  ];

  const macros = [
    createMacro({
      macroId: "macro_escalate_billing",
      accountId: account.accountId,
      name: "Escalate billing",
      actions: [
        { type: "assign-team", value: teams[1].teamId },
        { type: "add-label", value: "label_billing" },
        { type: "set-priority", value: "high" },
      ],
      createdAt: SEED_AT,
    }),
    createMacro({
      macroId: "macro_request_logs",
      accountId: account.accountId,
      name: "Request logs",
      actions: [
        { type: "send-reply", value: "Please send recent request IDs." },
        { type: "add-label", value: "label_bug" },
      ],
      createdAt: SEED_AT,
    }),
  ];

  const automationRules = [
    createAutomationRule({
      automationRuleId: "automation_route_billing",
      accountId: account.accountId,
      name: "Route billing conversations",
      trigger: "conversation-created",
      conditions: [
        { field: "message.body", operator: "contains", value: "billing" },
      ],
      actions: [
        { type: "assign-team", value: teams[1].teamId },
        { type: "add-label", value: "label_billing" },
      ],
      createdAt: SEED_AT,
      sla: {
        firstResponseSeconds: 300,
        resolutionSeconds: 3600,
      },
    }),
    createAutomationRule({
      automationRuleId: "automation_escalate_sla",
      accountId: account.accountId,
      name: "Escalate urgent SLA",
      trigger: "sla-breached",
      conditions: [{ field: "conversation.priority", operator: "equals", value: "urgent" }],
      actions: [
        { type: "assign-user", value: supervisor.userId },
        { type: "send-webhook", value: "ops-escalation" },
      ],
      createdAt: SEED_AT,
      sla: {
        firstResponseSeconds: 120,
        resolutionSeconds: 1800,
      },
    }),
  ];

  const openConversations = conversations.filter(
    (conversation) => conversation.status === "open"
  ).length;
  const resolvedConversations = conversations.filter(
    (conversation) => conversation.status === "resolved"
  ).length;
  const reportSummary = createSwitchboardReportSummary({
    reportId: "report_switchboard_daily_snapshot",
    accountId: account.accountId,
    metrics: {
      openConversations,
      resolvedConversations,
      averageFirstResponseSeconds: 180,
      averageResolutionSeconds: 2400,
      messagesSent: messages.length,
      customerSatisfactionScore: 94,
    },
    createdAt: SEED_AT,
  });

  const unreadCounts: Record<string, number> = {
    conv_website_001: 1,
    conv_api_001: 0,
    conv_email_001: 1,
    conv_historical_001: 0,
  };

  return {
    account,
    operators,
    supervisor,
    teams,
    channels,
    inboxes,
    contacts,
    conversations,
    messages,
    assignments,
    notes,
    labels,
    cannedResponses,
    macros,
    automationRules,
    reportSummary,
    benchmark: {
      inboxAdministration: {
        defaultInboxId: inboxIds.website,
        channelTypeByInboxId: Object.fromEntries(
          inboxes.map((inbox) => {
            const channel = channels.find((candidate) => candidate.channelId === inbox.channelId);
            return [inbox.inboxId, channel?.type ?? "unknown"];
          })
        ),
      },
      conversationList: {
        unreadCounts,
        items: conversations.map((conversation) => ({
          conversationId: conversation.conversationId,
          inboxId: conversation.inboxId,
          subject: conversation.subject,
          status: conversation.status,
          priority: conversation.priority,
          assigneeId: assignments.find(
            (assignment) => assignment.conversationId === conversation.conversationId
          )?.assigneeId,
          unreadCount: unreadCounts[conversation.conversationId] ?? 0,
          lastMessageAt: newestMessageAt(messages, conversation.conversationId),
        })),
      },
      activeConversation: {
        conversationId: "conv_website_001",
        messageIds: messages
          .filter((message) => message.conversationId === "conv_website_001")
          .map((message) => message.messageId),
        assignmentId: "assign_website_001",
        noteIds: notes
          .filter((note) => note.conversationId === "conv_website_001")
          .map((note) => note.noteId),
        sla: {
          firstResponseDueAt: "2026-01-15T09:05:00.000Z",
          resolutionDueAt: "2026-01-15T10:00:00.000Z",
        },
      },
      collaboratorIdentities: [operators[0], operators[1], supervisor].map((user) => ({
        userId: user.userId,
        name: user.name,
        role: user.role,
      })),
      triageStates: {
        conv_website_001: {
          priority: "high",
          labelIds: ["label_billing", "label_sla"],
          slaState: "due-soon",
        },
        conv_api_001: {
          priority: "urgent",
          labelIds: ["label_bug", "label_sla"],
          slaState: "breached",
        },
        conv_email_001: {
          priority: "normal",
          labelIds: ["label_billing"],
          slaState: "healthy",
        },
      },
      operatorShortcuts: {
        cannedResponseShortCodes: cannedResponses.map((response) => response.shortCode),
        macroIds: macros.map((macro) => macro.macroId),
      },
      reporting: {
        snapshotId: reportSummary.reportId,
        generatedForInboxIds: inboxes.map((inbox) => inbox.inboxId),
      },
    },
  };
}

export function resetSwitchboardBenchmarkEnvironment(): SwitchboardBenchmarkEnvironment {
  return seedSwitchboardBenchmarkEnvironment();
}

export function verifySwitchboardBenchmarkSeed(
  env: SwitchboardBenchmarkEnvironment
): SwitchboardBenchmarkSeedVerification {
  const checked = [
    "unread-counts",
    "assignee-state",
    "automation-rules",
    "report-summary",
  ];
  const errors = [
    ...checkUnreadCounts(env),
    ...checkAssigneeState(env),
    ...checkAutomationRules(env),
    ...checkReportSummary(env),
  ];

  return {
    ready: errors.length === 0,
    checked,
    errors,
  };
}

function checkUnreadCounts(env: SwitchboardBenchmarkEnvironment): string[] {
  const errors: string[] = [];
  const conversationIds = new Set(
    env.conversations.map((conversation) => conversation.conversationId)
  );
  const counts = env.benchmark.conversationList.unreadCounts;

  for (const [conversationId, count] of Object.entries(counts)) {
    if (!conversationIds.has(conversationId)) {
      errors.push(`Unread count references unknown conversation ${conversationId}`);
    }

    if (!Number.isInteger(count) || count < 0) {
      errors.push(`Unread count for ${conversationId} must be a non-negative integer`);
    }
  }

  if (!Object.values(counts).some((count) => count > 0)) {
    errors.push("At least one benchmark conversation must have an unread count");
  }

  return errors;
}

function checkAssigneeState(env: SwitchboardBenchmarkEnvironment): string[] {
  const errors: string[] = [];
  const openConversationIds = new Set(
    env.conversations
      .filter((conversation) => conversation.status === "open")
      .map((conversation) => conversation.conversationId)
  );
  const assignedConversationIds = new Set(
    env.assignments
      .filter((assignment) => assignment.status === "assigned" && assignment.assigneeId)
      .map((assignment) => assignment.conversationId)
  );

  for (const conversationId of openConversationIds) {
    if (!assignedConversationIds.has(conversationId)) {
      errors.push(`Open conversation ${conversationId} is missing an assignee`);
    }
  }

  return errors;
}

function checkAutomationRules(env: SwitchboardBenchmarkEnvironment): string[] {
  const errors: string[] = [];

  if (env.automationRules.length === 0) {
    errors.push("At least one automation rule is required");
  }

  for (const rule of env.automationRules) {
    if (rule.actions.length === 0) {
      errors.push(`Automation rule ${rule.automationRuleId} has no actions`);
    }

    if (rule.conditions.length === 0) {
      errors.push(`Automation rule ${rule.automationRuleId} has no conditions`);
    }
  }

  return errors;
}

function checkReportSummary(env: SwitchboardBenchmarkEnvironment): string[] {
  const errors: string[] = [];
  const expectedOpen = env.conversations.filter(
    (conversation) => conversation.status === "open"
  ).length;
  const expectedResolved = env.conversations.filter(
    (conversation) => conversation.status === "resolved"
  ).length;

  if (env.reportSummary.metrics.openConversations !== expectedOpen) {
    errors.push("Report open conversation count does not match seeded conversations");
  }

  if (env.reportSummary.metrics.resolvedConversations !== expectedResolved) {
    errors.push("Report resolved conversation count does not match seeded conversations");
  }

  if (env.reportSummary.metrics.messagesSent !== env.messages.length) {
    errors.push("Report message count does not match seeded messages");
  }

  return errors;
}

function newestMessageAt(messages: SwitchboardMessage[], conversationId: string): string {
  return messages
    .filter((message) => message.conversationId === conversationId)
    .map((message) => message.createdAt)
    .sort()
    .at(-1) ?? SEED_AT;
}
