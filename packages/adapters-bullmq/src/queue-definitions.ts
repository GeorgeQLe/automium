export const QUEUE_DEFINITIONS = Object.freeze([
  { name: "journey-runs" },
  { name: "artifact-upload" },
  { name: "audit-sink" },
  { name: "data-lifecycle" },
] as const);

export type QueueName = (typeof QUEUE_DEFINITIONS)[number]["name"];

export const QUEUE_PRIORITY_WEIGHTS = {
  high: 1,
  normal: 2,
  low: 3,
} as const;
