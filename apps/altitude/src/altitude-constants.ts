export const WORK_ITEM_TYPES = ["issue", "task", "epic", "story", "bug"] as const;
export type WorkItemType = (typeof WORK_ITEM_TYPES)[number];

export const WORK_ITEM_STATES = ["backlog", "todo", "in-progress", "in-review", "done", "cancelled"] as const;
export type WorkItemState = (typeof WORK_ITEM_STATES)[number];

export const WORK_ITEM_PRIORITIES = ["none", "low", "medium", "high", "urgent"] as const;
export type WorkItemPriority = (typeof WORK_ITEM_PRIORITIES)[number];

export const VIEW_TYPES = ["board", "list", "table", "calendar", "timeline"] as const;
export type ViewType = (typeof VIEW_TYPES)[number];

export const CYCLE_STATES = ["draft", "active", "completed", "cancelled"] as const;
export type CycleState = (typeof CYCLE_STATES)[number];

export const NOTIFICATION_TYPES = ["assignment", "mention", "state-change", "comment", "due-date"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const ALTITUDE_REALTIME_TOPICS = ["work-item-changed", "comment-added", "assignment-changed", "cycle-updated", "module-updated"] as const;
export type AltitudeRealtimeTopic = (typeof ALTITUDE_REALTIME_TOPICS)[number];

export const ALTITUDE_WEBHOOK_EVENTS = [
  "project.created", "project.updated",
  "work-item.created", "work-item.updated", "work-item.deleted",
  "comment.created",
  "cycle.created", "cycle.updated",
  "module.created", "module.updated",
] as const;
export type AltitudeWebhookEvent = (typeof ALTITUDE_WEBHOOK_EVENTS)[number];
