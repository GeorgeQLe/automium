export const SWITCHBOARD_CONVERSATION_STATUSES = [
  "open",
  "pending",
  "snoozed",
  "resolved",
] as const;
export type SwitchboardConversationStatus =
  (typeof SWITCHBOARD_CONVERSATION_STATUSES)[number];

export const SWITCHBOARD_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type SwitchboardPriority = (typeof SWITCHBOARD_PRIORITIES)[number];

export const SWITCHBOARD_CHANNEL_TYPES = [
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
] as const;
export type SwitchboardChannelType = (typeof SWITCHBOARD_CHANNEL_TYPES)[number];

export const SWITCHBOARD_MESSAGE_DIRECTIONS = ["inbound", "outbound"] as const;
export type SwitchboardMessageDirection =
  (typeof SWITCHBOARD_MESSAGE_DIRECTIONS)[number];

export const SWITCHBOARD_MESSAGE_TYPES = [
  "text",
  "private-note",
  "system",
  "automation",
] as const;
export type SwitchboardMessageType = (typeof SWITCHBOARD_MESSAGE_TYPES)[number];

export const SWITCHBOARD_ASSIGNMENT_STATUSES = [
  "unassigned",
  "assigned",
  "transferred",
] as const;
export type SwitchboardAssignmentStatus =
  (typeof SWITCHBOARD_ASSIGNMENT_STATUSES)[number];

export const SWITCHBOARD_AUTOMATION_TRIGGER_TYPES = [
  "conversation-created",
  "conversation-updated",
  "message-created",
  "assignment-changed",
  "conversation-resolved",
] as const;
export type SwitchboardAutomationTriggerType =
  (typeof SWITCHBOARD_AUTOMATION_TRIGGER_TYPES)[number];

export const SWITCHBOARD_AUTOMATION_ACTION_TYPES = [
  "assign-team",
  "assign-user",
  "add-label",
  "send-message",
  "set-priority",
  "change-status",
  "send-webhook",
] as const;
export type SwitchboardAutomationActionType =
  (typeof SWITCHBOARD_AUTOMATION_ACTION_TYPES)[number];

export const SWITCHBOARD_REPORT_METRICS = [
  "openConversations",
  "resolvedConversations",
  "averageFirstResponseSeconds",
  "averageResolutionSeconds",
  "messagesSent",
  "customerSatisfactionScore",
] as const;
export type SwitchboardReportMetric = (typeof SWITCHBOARD_REPORT_METRICS)[number];

export const SWITCHBOARD_REALTIME_TOPICS = [
  "conversation.updated",
  "message.created",
  "assignment.changed",
  "note.created",
  "inbox.routed",
] as const;
export type SwitchboardRealtimeTopic = (typeof SWITCHBOARD_REALTIME_TOPICS)[number];

export const SWITCHBOARD_WEBHOOK_EVENTS = [
  "conversation.created",
  "conversation.updated",
  "conversation.resolved",
  "message.created",
  "assignment.changed",
  "note.created",
  "inbox.routed",
] as const;
export type SwitchboardWebhookEvent = (typeof SWITCHBOARD_WEBHOOK_EVENTS)[number];
