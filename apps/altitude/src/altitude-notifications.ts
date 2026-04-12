import type { Notification } from "./altitude-domain";
export { NOTIFICATION_TYPES } from "./altitude-constants";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createNotification(params: {
  recipientId: string;
  type: Notification["type"];
  workItemId: string;
  message: string;
}): Notification {
  return {
    notificationId: generateId("notif"),
    recipientId: params.recipientId,
    type: params.type,
    workItemId: params.workItemId,
    message: params.message,
    createdAt: new Date().toISOString(),
  };
}
