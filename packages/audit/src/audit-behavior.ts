import {
  AUDIT_EVENT_REQUIRED_FIELDS,
  AUDITED_SHARED_PLATFORM_ACTIONS,
} from "./platform-audit";

// --- Types derived from frozen constants ---

export type AuditedAction = (typeof AUDITED_SHARED_PLATFORM_ACTIONS)[number];

// --- Interfaces ---

export interface AuditEvent {
  eventId: string;
  occurredAt: string;
  actorId: string;
  organizationId: string;
  workspaceId: string;
  resourceType: string;
  resourceId: string;
  action: AuditedAction;
  summary: string;
  metadata: Record<string, unknown>;
}

// --- Factory ---

export function createAuditEvent(params: {
  actorId: string;
  organizationId: string;
  workspaceId: string;
  resourceType: string;
  resourceId: string;
  action: AuditedAction;
  summary: string;
  metadata?: Record<string, unknown>;
  id?: string;
}): AuditEvent {
  return {
    eventId: params.id ?? generateId("aud"),
    occurredAt: new Date().toISOString(),
    actorId: params.actorId,
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    action: params.action,
    summary: params.summary,
    metadata: params.metadata ?? {},
  };
}

// --- Action-specific builders ---

export function buildInviteSentAuditEvent(
  base: AuditEventBase & { inviteEmail: string }
): AuditEvent {
  return createAuditEvent({
    ...base,
    resourceType: "invite",
    action: "invite.sent",
    summary: `Invite sent to ${base.inviteEmail}`,
    metadata: { inviteEmail: base.inviteEmail },
  });
}

export function buildInviteAcceptedAuditEvent(
  base: AuditEventBase & { inviteEmail: string }
): AuditEvent {
  return createAuditEvent({
    ...base,
    resourceType: "invite",
    action: "invite.accepted",
    summary: `Invite accepted by ${base.inviteEmail}`,
    metadata: { inviteEmail: base.inviteEmail },
  });
}

export function buildMembershipRoleChangedAuditEvent(
  base: AuditEventBase & { fromRole: string; toRole: string }
): AuditEvent {
  return createAuditEvent({
    ...base,
    resourceType: "membership",
    action: "membership.role-changed",
    summary: `Role changed from ${base.fromRole} to ${base.toRole}`,
    metadata: { fromRole: base.fromRole, toRole: base.toRole },
  });
}

export function buildFileOwnershipTransferredAuditEvent(
  base: AuditEventBase & { fromOwner: string; toOwner: string }
): AuditEvent {
  return createAuditEvent({
    ...base,
    resourceType: "file",
    action: "file.ownership-transferred",
    summary: `File ownership transferred from ${base.fromOwner} to ${base.toOwner}`,
    metadata: { fromOwner: base.fromOwner, toOwner: base.toOwner },
  });
}

export function buildJobScheduledAuditEvent(
  base: AuditEventBase & { jobType: string }
): AuditEvent {
  return createAuditEvent({
    ...base,
    resourceType: "job",
    action: "job.scheduled",
    summary: `Job scheduled: ${base.jobType}`,
    metadata: { jobType: base.jobType },
  });
}

export function buildSearchIndexedAuditEvent(
  base: AuditEventBase & { indexedResourceType: string }
): AuditEvent {
  return createAuditEvent({
    ...base,
    resourceType: "search-index",
    action: "search.indexed",
    summary: `Resource indexed: ${base.indexedResourceType}`,
    metadata: { indexedResourceType: base.indexedResourceType },
  });
}

export function buildRealtimeEventDeliveredAuditEvent(
  base: AuditEventBase & { topic: string }
): AuditEvent {
  return createAuditEvent({
    ...base,
    resourceType: "realtime-channel",
    action: "realtime.event-delivered",
    summary: `Realtime event delivered on topic: ${base.topic}`,
    metadata: { topic: base.topic },
  });
}

// --- Validation ---

export function validateAuditEvent(event: AuditEvent): string[] {
  const errors: string[] = [];
  for (const field of AUDIT_EVENT_REQUIRED_FIELDS) {
    if (!event[field as keyof AuditEvent]) {
      errors.push(`${field} is required`);
    }
  }
  if (!AUDITED_SHARED_PLATFORM_ACTIONS.includes(event.action as never)) {
    errors.push(`Invalid action: ${event.action}`);
  }
  return errors;
}

// --- Internal types ---

interface AuditEventBase {
  actorId: string;
  organizationId: string;
  workspaceId: string;
  resourceId: string;
  id?: string;
}

// --- Internal helpers ---

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
