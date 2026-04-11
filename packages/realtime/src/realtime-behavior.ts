import {
  REALTIME_EVENT_REQUIRED_FIELDS,
  REALTIME_DELIVERY_GUARANTEES,
  REALTIME_SHARED_TOPICS,
} from "./platform-realtime";

// --- Types derived from frozen constants ---

export type RealtimeDeliveryGuarantee = (typeof REALTIME_DELIVERY_GUARANTEES)[number];
export type RealtimeSharedTopic = (typeof REALTIME_SHARED_TOPICS)[number];

// --- Interfaces ---

export interface RealtimeEvent {
  eventId: string;
  organizationId: string;
  workspaceId: string;
  topic: RealtimeSharedTopic;
  audience: string[];
  sequence: number;
  payload: Record<string, unknown>;
  occurredAt: string;
  auditEventId: string;
}

export interface RealtimeDeliveryContext {
  event: RealtimeEvent;
  guarantees: readonly RealtimeDeliveryGuarantee[];
  recipientIds: string[];
}

export interface RealtimeDeliveryResult {
  eventId: string;
  delivered: boolean;
  recipientCount: number;
  guaranteesEnforced: readonly RealtimeDeliveryGuarantee[];
  sequenceVerified: boolean;
}

// --- Factory ---

export function createRealtimeEvent(params: {
  organizationId: string;
  workspaceId: string;
  topic: RealtimeSharedTopic;
  audience: string[];
  payload: Record<string, unknown>;
  auditEventId: string;
  sequence?: number;
  id?: string;
}): RealtimeEvent {
  return {
    eventId: params.id ?? generateId("rte"),
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    topic: params.topic,
    audience: params.audience,
    sequence: params.sequence ?? 1,
    payload: params.payload,
    occurredAt: new Date().toISOString(),
    auditEventId: params.auditEventId,
  };
}

// --- Sequence tracker ---

const topicSequences = new Map<string, number>();

export function nextSequence(topic: string, workspaceId: string): number {
  const key = `${workspaceId}:${topic}`;
  const current = topicSequences.get(key) ?? 0;
  const next = current + 1;
  topicSequences.set(key, next);
  return next;
}

export function resetSequenceTracker(): void {
  topicSequences.clear();
}

// --- Delivery orchestration ---

export function evaluateDelivery(
  context: RealtimeDeliveryContext
): RealtimeDeliveryResult {
  const { event, guarantees, recipientIds } = context;

  const sequenceVerified = guarantees.includes("ordered-per-topic")
    ? isSequenceValid(event.topic, event.workspaceId, event.sequence)
    : true;

  return {
    eventId: event.eventId,
    delivered: recipientIds.length > 0 && sequenceVerified,
    recipientCount: recipientIds.length,
    guaranteesEnforced: guarantees,
    sequenceVerified,
  };
}

function isSequenceValid(
  topic: string,
  workspaceId: string,
  sequence: number
): boolean {
  const key = `${workspaceId}:${topic}`;
  const lastSeen = topicSequences.get(key) ?? 0;
  return sequence > lastSeen;
}

// --- Validation ---

export function validateRealtimeEvent(event: RealtimeEvent): string[] {
  const errors: string[] = [];
  for (const field of REALTIME_EVENT_REQUIRED_FIELDS) {
    const value = event[field as keyof RealtimeEvent];
    if (value === undefined || value === null || value === "") {
      errors.push(`${field} is required`);
    }
  }
  if (!REALTIME_SHARED_TOPICS.includes(event.topic as never)) {
    errors.push(`Invalid topic: ${event.topic}`);
  }
  if (!Array.isArray(event.audience) || event.audience.length === 0) {
    errors.push("audience must be a non-empty array");
  }
  return errors;
}

// --- Internal helpers ---

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
