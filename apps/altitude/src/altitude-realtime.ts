import type { AltitudeRealtimeEvent } from "./altitude-domain";
export { ALTITUDE_REALTIME_TOPICS } from "./altitude-constants";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createAltitudeRealtimeEvent(params: {
  organizationId: string;
  workspaceId: string;
  topic: AltitudeRealtimeEvent["topic"];
  payload: Record<string, unknown>;
}): AltitudeRealtimeEvent {
  return {
    eventId: generateId("evt"),
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    topic: params.topic,
    payload: params.payload,
    occurredAt: new Date().toISOString(),
  };
}
