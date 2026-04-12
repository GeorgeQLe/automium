import type { WebhookConfig } from "./altitude-domain";
export { ALTITUDE_WEBHOOK_EVENTS } from "./altitude-constants";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createWebhookConfig(params: {
  projectId: string;
  url: string;
  events: string[];
}): WebhookConfig {
  return {
    webhookId: generateId("wh"),
    projectId: params.projectId,
    url: params.url,
    events: params.events,
    createdAt: new Date().toISOString(),
  };
}
