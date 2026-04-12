import type {
  SwitchboardAssignmentStatus,
  SwitchboardAutomationActionType,
  SwitchboardAutomationTriggerType,
  SwitchboardChannelType,
  SwitchboardConversationStatus,
  SwitchboardMessageDirection,
  SwitchboardMessageType,
  SwitchboardPriority,
  SwitchboardRealtimeTopic,
} from "./switchboard-constants";

export interface SwitchboardAccount {
  accountId: string;
  organizationId: string;
  workspaceId: string;
  name: string;
  timezone: string;
  createdAt: string;
}

export interface SwitchboardUser {
  userId: string;
  accountId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface SwitchboardTeam {
  teamId: string;
  accountId: string;
  name: string;
  memberIds: string[];
  createdAt: string;
}

export interface SwitchboardChannelConfig {
  channelId: string;
  accountId: string;
  type: SwitchboardChannelType;
  name: string;
  settings: Record<string, unknown>;
  createdAt: string;
}

export interface SwitchboardInbox {
  inboxId: string;
  accountId: string;
  name: string;
  channelId: string;
  teamId?: string;
  createdAt: string;
}

export interface SwitchboardContact {
  contactId: string;
  accountId: string;
  name: string;
  email?: string;
  phone?: string;
  externalId?: string;
  createdAt: string;
}

export interface SwitchboardConversation {
  conversationId: string;
  accountId: string;
  inboxId: string;
  contactId: string;
  status: SwitchboardConversationStatus;
  priority: SwitchboardPriority;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

export interface SwitchboardMessage {
  messageId: string;
  conversationId: string;
  authorId: string;
  direction: SwitchboardMessageDirection;
  type: SwitchboardMessageType;
  body: string;
  parentMessageId?: string;
  createdAt: string;
}

export interface SwitchboardAssignment {
  assignmentId: string;
  conversationId: string;
  assigneeId?: string;
  teamId?: string;
  status: SwitchboardAssignmentStatus;
  assignedBy?: string;
  assignedAt: string;
}

export interface SwitchboardNote {
  noteId: string;
  conversationId: string;
  authorId: string;
  body: string;
  mentionIds: string[];
  createdAt: string;
}

export interface SwitchboardLabel {
  labelId: string;
  accountId: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface SwitchboardCannedResponse {
  cannedResponseId: string;
  accountId: string;
  shortCode: string;
  body: string;
  createdAt: string;
}

export interface SwitchboardAutomationAction {
  type: SwitchboardAutomationActionType;
  value: string;
}

export interface SwitchboardMacro {
  macroId: string;
  accountId: string;
  name: string;
  actions: SwitchboardAutomationAction[];
  createdAt: string;
}

export interface SwitchboardAutomationCondition {
  field: string;
  operator: string;
  value: string;
}

export interface SwitchboardAutomationRule {
  automationRuleId: string;
  accountId: string;
  name: string;
  trigger: SwitchboardAutomationTriggerType;
  conditions: SwitchboardAutomationCondition[];
  actions: SwitchboardAutomationAction[];
  createdAt: string;
}

export interface SwitchboardReportSummary {
  reportId: string;
  accountId: string;
  inboxId?: string;
  metrics: Record<string, number>;
  createdAt: string;
}

export interface SwitchboardRealtimeEvent {
  eventId: string;
  accountId: string;
  inboxId?: string;
  topic: SwitchboardRealtimeTopic;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface SwitchboardApiRoute {
  resource: string;
  path: string;
  methods: string[];
  requiresAuth: boolean;
  seedable: boolean;
  actions?: string[];
  events?: string[];
}

export interface SwitchboardBenchmarkRoute {
  path: string;
  name: string;
}

type Input<T, TGenerated extends keyof T> = Omit<T, TGenerated> & Partial<Pick<T, TGenerated>>;

const stamp = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 10)}`;

export function createSwitchboardAccount(
  input: Input<SwitchboardAccount, "accountId" | "createdAt">
): SwitchboardAccount {
  return {
    accountId: input.accountId ?? id("acct_"),
    organizationId: input.organizationId,
    workspaceId: input.workspaceId,
    name: input.name,
    timezone: input.timezone,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardUser(
  input: Input<SwitchboardUser, "userId" | "createdAt">
): SwitchboardUser {
  return {
    userId: input.userId ?? id("user_"),
    accountId: input.accountId,
    name: input.name,
    email: input.email,
    role: input.role,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardTeam(
  input: Input<SwitchboardTeam, "teamId" | "createdAt">
): SwitchboardTeam {
  return {
    teamId: input.teamId ?? id("team_"),
    accountId: input.accountId,
    name: input.name,
    memberIds: input.memberIds,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardChannelConfig(
  input: Input<SwitchboardChannelConfig, "channelId" | "createdAt">
): SwitchboardChannelConfig {
  return {
    channelId: input.channelId ?? id("channel_"),
    accountId: input.accountId,
    type: input.type,
    name: input.name,
    settings: input.settings,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardInbox(
  input: Input<SwitchboardInbox, "inboxId" | "createdAt">
): SwitchboardInbox {
  return {
    inboxId: input.inboxId ?? id("inbox_"),
    accountId: input.accountId,
    name: input.name,
    channelId: input.channelId,
    teamId: input.teamId,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardContact(
  input: Input<SwitchboardContact, "contactId" | "createdAt">
): SwitchboardContact {
  return {
    contactId: input.contactId ?? id("contact_"),
    accountId: input.accountId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    externalId: input.externalId,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardConversation(
  input: Input<SwitchboardConversation, "conversationId" | "createdAt" | "updatedAt">
): SwitchboardConversation {
  const createdAt = input.createdAt ?? stamp();

  return {
    conversationId: input.conversationId ?? id("conv_"),
    accountId: input.accountId,
    inboxId: input.inboxId,
    contactId: input.contactId,
    status: input.status,
    priority: input.priority,
    subject: input.subject,
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}

export function createSwitchboardMessage(
  input: Input<SwitchboardMessage, "messageId" | "createdAt">
): SwitchboardMessage {
  return {
    messageId: input.messageId ?? id("msg_"),
    conversationId: input.conversationId,
    authorId: input.authorId,
    direction: input.direction,
    type: input.type,
    body: input.body,
    parentMessageId: input.parentMessageId,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardAssignment(
  input: Input<SwitchboardAssignment, "assignmentId" | "assignedAt">
): SwitchboardAssignment {
  return {
    assignmentId: input.assignmentId ?? id("assign_"),
    conversationId: input.conversationId,
    assigneeId: input.assigneeId,
    teamId: input.teamId,
    status: input.status,
    assignedBy: input.assignedBy,
    assignedAt: input.assignedAt ?? stamp(),
  };
}

export function createSwitchboardNote(
  input: Input<SwitchboardNote, "noteId" | "createdAt" | "mentionIds">
): SwitchboardNote {
  return {
    noteId: input.noteId ?? id("note_"),
    conversationId: input.conversationId,
    authorId: input.authorId,
    body: input.body,
    mentionIds: input.mentionIds ?? [],
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardLabel(
  input: Input<SwitchboardLabel, "labelId" | "createdAt">
): SwitchboardLabel {
  return {
    labelId: input.labelId ?? id("label_"),
    accountId: input.accountId,
    name: input.name,
    color: input.color,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardCannedResponse(
  input: Input<SwitchboardCannedResponse, "cannedResponseId" | "createdAt">
): SwitchboardCannedResponse {
  return {
    cannedResponseId: input.cannedResponseId ?? id("canned_"),
    accountId: input.accountId,
    shortCode: input.shortCode,
    body: input.body,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardMacro(
  input: Input<SwitchboardMacro, "macroId" | "createdAt">
): SwitchboardMacro {
  return {
    macroId: input.macroId ?? id("macro_"),
    accountId: input.accountId,
    name: input.name,
    actions: input.actions,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardAutomationRule(
  input: Input<SwitchboardAutomationRule, "automationRuleId" | "createdAt">
): SwitchboardAutomationRule {
  return {
    automationRuleId: input.automationRuleId ?? id("automation_"),
    accountId: input.accountId,
    name: input.name,
    trigger: input.trigger,
    conditions: input.conditions,
    actions: input.actions,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createSwitchboardReportSummary(
  input: Input<SwitchboardReportSummary, "reportId" | "createdAt">
): SwitchboardReportSummary {
  return {
    reportId: input.reportId ?? id("report_"),
    accountId: input.accountId,
    inboxId: input.inboxId,
    metrics: input.metrics,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function validateSwitchboardAccount(account: SwitchboardAccount): string[] {
  return requiredFields(account, [
    "accountId",
    "organizationId",
    "workspaceId",
    "name",
    "timezone",
    "createdAt",
  ]);
}

export function validateSwitchboardConversation(
  conversation: SwitchboardConversation
): string[] {
  return requiredFields(conversation, [
    "conversationId",
    "accountId",
    "inboxId",
    "contactId",
    "status",
    "priority",
    "subject",
    "createdAt",
    "updatedAt",
  ]);
}

function requiredFields<T extends Record<string, unknown>>(
  value: T,
  fields: Array<keyof T & string>
): string[] {
  return fields
    .filter((field) => !value[field])
    .map((field) => `${field} is required`);
}
