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

function classifyTimelineLane(type: string): ReplayTimelineLane {
  if (type.startsWith("planner.")) {
    return "planner";
  }

  if (type.startsWith("executor.")) {
    return "executor";
  }

  if (type.startsWith("runtime.")) {
    return "runtime";
  }

  if (type.startsWith("assertion.")) {
    return "assertions";
  }

  if (type.startsWith("worker.")) {
    return "worker";
  }

  return "artifacts";
}

export function buildReplayTimeline(input: ReplayTimelineInput): ReplayTimeline {
  const events = [...input.events].sort(
    (left, right) => left.sequence - right.sequence
  );

  return {
    runId: input.runId,
    timelineVersion: REPLAY_CONSOLE_TIMELINE_VERSION,
    entries: events.map((event) => ({
      sequence: event.sequence,
      lane: classifyTimelineLane(event.type),
      event: { ...event }
    }))
  };
}

export function summarizeReplayRun(
  input: ReplayRunSummaryInput
): ReplayRunSummary {
  return {
    ...input,
    requiredArtifacts: [...REPLAY_CONSOLE_REQUIRED_ARTIFACTS]
  };
}
