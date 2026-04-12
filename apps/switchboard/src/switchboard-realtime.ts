import type { SwitchboardRealtimeEvent } from "./switchboard-domain";
export { SWITCHBOARD_REALTIME_TOPICS } from "./switchboard-constants";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createSwitchboardRealtimeEvent(params: {
  accountId: string;
  inboxId?: string;
  topic: SwitchboardRealtimeEvent["topic"];
  payload: Record<string, unknown>;
}): SwitchboardRealtimeEvent {
  return {
    eventId: generateId("evt"),
    accountId: params.accountId,
    inboxId: params.inboxId,
    topic: params.topic,
    payload: params.payload,
    occurredAt: new Date().toISOString(),
  };
}
