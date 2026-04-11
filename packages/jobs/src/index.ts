export const JOB_LIFECYCLE_STATES = [
  "queued",
  "running",
  "completed",
  "failed"
] as const;

export * from "./jobs-behavior";
