import type { SwitchboardWebhookEvent } from "./switchboard-constants";

export type SwitchboardWebhookPayload = Record<string, unknown>;

export type SwitchboardWebhookEventPayload = {
  webhookEventId: string;
  accountId: string;
  event: SwitchboardWebhookEvent;
  payload: SwitchboardWebhookPayload;
  createdAt: string;
};

export function createSwitchboardWebhookEvent(input: {
  accountId: string;
  event: SwitchboardWebhookEvent;
  payload: SwitchboardWebhookPayload;
  createdAt?: string;
}): SwitchboardWebhookEventPayload {
  const createdAt = input.createdAt ?? new Date().toISOString();

  return {
    webhookEventId: `webhook_event_${stableSegment(input.accountId)}_${stableSegment(
      input.event
    )}_${Date.parse(createdAt).toString(36)}`,
    accountId: input.accountId,
    event: input.event,
    payload: input.payload,
    createdAt,
  };
}

function stableSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
