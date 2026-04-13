export const REPLAY_EVENT_STREAM_VERSION = "v1";

export const REPLAY_EVENT_TYPES = [
  "worker.leased",
  "planner.intent",
  "executor.action",
  "runtime.snapshot",
  "assertion.verdict",
  "artifact.written",
  "run.finished"
] as const;

export type ReplayEventType = (typeof REPLAY_EVENT_TYPES)[number];

export interface ReplayEvent {
  readonly sequence: number;
  readonly type: ReplayEventType;
  readonly at: number;
  readonly runId: string;
  readonly payload: Record<string, unknown>;
}

export interface ReplayEventStreamManifest {
  readonly streamVersion: typeof REPLAY_EVENT_STREAM_VERSION;
  readonly runId: string;
  readonly eventCount: number;
  readonly streamRef: string;
}
