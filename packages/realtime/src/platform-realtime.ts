export const REALTIME_EVENT_REQUIRED_FIELDS = [
  "eventId",
  "organizationId",
  "workspaceId",
  "topic",
  "audience",
  "sequence",
  "payload",
  "occurredAt",
  "auditEventId"
] as const;

export const REALTIME_DELIVERY_GUARANTEES = [
  "permission-checked",
  "ordered-per-topic",
  "at-least-once"
] as const;

export const REALTIME_SHARED_TOPICS = [
  "memberships",
  "audit",
  "files",
  "jobs",
  "search"
] as const;

export const realtimePlatformContract = {
  requiredFields: REALTIME_EVENT_REQUIRED_FIELDS,
  guarantees: REALTIME_DELIVERY_GUARANTEES,
  topics: REALTIME_SHARED_TOPICS
} as const;
