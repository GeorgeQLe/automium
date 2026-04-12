export const ALTITUDE_ADAPTER_BOUNDARIES = [
  "source-control",
  "chat-notification",
  "alert",
  "webhook-delivery",
] as const;

export type AltitudeAdapterBoundary =
  (typeof ALTITUDE_ADAPTER_BOUNDARIES)[number];

export interface SourceControlAdapter {
  readonly boundary: "source-control";
  linkWorkItem(params: {
    workItemId: string;
    externalUrl: string;
    externalReference: string;
  }): Promise<{ linked: boolean; referenceId: string }>;
  listLinkedReferences(workItemId: string): Promise<{
    references: { referenceId: string; externalUrl: string }[];
  }>;
}

export interface ChatNotificationAdapter {
  readonly boundary: "chat-notification";
  sendWorkItemNotification(params: {
    channelId: string;
    workItemId: string;
    message: string;
  }): Promise<{ sent: boolean; messageId: string }>;
}

export interface AlertAdapter {
  readonly boundary: "alert";
  publishAlert(params: {
    projectId: string;
    severity: "info" | "warning" | "critical";
    message: string;
  }): Promise<{ published: boolean; alertId: string }>;
}

export interface WebhookDeliveryAdapter {
  readonly boundary: "webhook-delivery";
  deliver(params: {
    webhookId: string;
    event: string;
    payload: Record<string, unknown>;
  }): Promise<{ delivered: boolean; deliveryId: string }>;
}

type AltitudeAdapterTypeMap = {
  "source-control": SourceControlAdapter;
  "chat-notification": ChatNotificationAdapter;
  alert: AlertAdapter;
  "webhook-delivery": WebhookDeliveryAdapter;
};

export interface AltitudeAdapterRegistry {
  register<B extends AltitudeAdapterBoundary>(
    boundary: B,
    adapter: AltitudeAdapterTypeMap[B]
  ): void;
  get<B extends AltitudeAdapterBoundary>(
    boundary: B
  ): AltitudeAdapterTypeMap[B] | undefined;
  has(boundary: AltitudeAdapterBoundary): boolean;
  boundaries(): readonly AltitudeAdapterBoundary[];
}

export function createAltitudeAdapterRegistry(): AltitudeAdapterRegistry {
  const adapters = new Map<AltitudeAdapterBoundary, unknown>();

  return {
    register<B extends AltitudeAdapterBoundary>(
      boundary: B,
      adapter: AltitudeAdapterTypeMap[B]
    ): void {
      adapters.set(boundary, adapter);
    },
    get<B extends AltitudeAdapterBoundary>(
      boundary: B
    ): AltitudeAdapterTypeMap[B] | undefined {
      return adapters.get(boundary) as AltitudeAdapterTypeMap[B] | undefined;
    },
    has(boundary: AltitudeAdapterBoundary): boolean {
      return adapters.has(boundary);
    },
    boundaries(): readonly AltitudeAdapterBoundary[] {
      return [...adapters.keys()];
    },
  };
}

