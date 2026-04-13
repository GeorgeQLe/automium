import type { FoundryRealtimeEvent } from "./foundry-domain";
import { createFoundryRealtimeEvent as createDomainFoundryRealtimeEvent } from "./foundry-domain";

export { FOUNDRY_REALTIME_TOPICS } from "./foundry-constants";

export function createFoundryRealtimeEvent(params: {
  workspaceId: string;
  applicationId: string;
  topic: FoundryRealtimeEvent["topic"];
  payload: Record<string, unknown>;
  actorId?: string;
  eventId?: string;
  occurredAt?: string;
}): FoundryRealtimeEvent {
  return createDomainFoundryRealtimeEvent(params);
}
