export const AUDIT_EVENT_REQUIRED_FIELDS = [
  "eventId",
  "occurredAt",
  "actorId",
  "organizationId",
  "workspaceId",
  "resourceType",
  "resourceId",
  "action",
  "summary",
  "metadata"
] as const;

export const AUDITED_SHARED_PLATFORM_ACTIONS = [
  "invite.sent",
  "invite.accepted",
  "membership.role-changed",
  "file.ownership-transferred",
  "job.scheduled",
  "search.indexed",
  "realtime.event-delivered"
] as const;

export const auditPlatformContract = {
  requiredFields: AUDIT_EVENT_REQUIRED_FIELDS,
  auditedActions: AUDITED_SHARED_PLATFORM_ACTIONS
} as const;
