export const REPLAY_CONSOLE_TIMELINE_VERSION = "v1";

export const REPLAY_CONSOLE_REQUIRED_ARTIFACTS = [
  "semantic-snapshots",
  "planner-intents",
  "executor-actions",
  "assertion-traces",
  "network-log",
  "console-log",
  "downloads",
  "targeted-crops"
] as const;

export type ReplayConsoleArtifactKind =
  (typeof REPLAY_CONSOLE_REQUIRED_ARTIFACTS)[number];

export type ReplayTimelineLane =
  | "planner"
  | "executor"
  | "runtime"
  | "assertions"
  | "worker"
  | "artifacts";

export interface ReplayConsoleEvent {
  readonly sequence: number;
  readonly type: string;
  readonly intent?: string;
  readonly action?: string;
  readonly snapshotRef?: string;
  readonly verdict?: string;
}

export interface ReplayTimelineInput {
  readonly runId: string;
  readonly events: readonly ReplayConsoleEvent[];
}

export interface ReplayTimelineEntry {
  readonly sequence: number;
  readonly lane: ReplayTimelineLane;
  readonly event: ReplayConsoleEvent;
}

export interface ReplayTimeline {
  readonly runId: string;
  readonly timelineVersion: typeof REPLAY_CONSOLE_TIMELINE_VERSION;
  readonly entries: readonly ReplayTimelineEntry[];
}

export interface ReplayRunSummaryInput {
  readonly runId: string;
  readonly verdict: string;
  readonly retryCount: number;
  readonly artifactManifestRef: string;
}

export interface ReplayRunSummary extends ReplayRunSummaryInput {
  readonly requiredArtifacts: readonly ReplayConsoleArtifactKind[];
}

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.5 not implemented: ${operation}`);
}

export function buildReplayTimeline(_input: ReplayTimelineInput): ReplayTimeline {
  return notImplemented("buildReplayTimeline");
}

export function summarizeReplayRun(
  _input: ReplayRunSummaryInput
): ReplayRunSummary {
  return notImplemented("summarizeReplayRun");
}
