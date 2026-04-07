export const REPLAY_EVENT_SCHEMA_VERSION = "v1";

export const replayEventRequiredFields = [
  "eventId",
  "runId",
  "stepId",
  "sequence",
  "phase",
  "timestamp",
  "plannerIntent",
  "executorAction",
  "preStateSnapshotRef",
  "postStateSnapshotRef",
  "artifactRefs",
  "summary",
  "verdict"
] as const;

export const replayEventPhaseOrder = [
  "planner-input",
  "planner-output",
  "executor-start",
  "state-capture-before",
  "action",
  "state-capture-after",
  "assertion",
  "recovery",
  "step-result",
  "run-result"
] as const;

export type ReplayEventSchemaVersion = typeof REPLAY_EVENT_SCHEMA_VERSION;

export type ReplayEventRequiredField =
  (typeof replayEventRequiredFields)[number];

export type ReplayEventPhase = (typeof replayEventPhaseOrder)[number];

export type ReplayEventVerdict =
  | "pass"
  | "fail"
  | "inconclusive"
  | "unsupported";

export interface ReplayPlannerIntent {
  readonly kind: string;
  readonly target: string | null;
  readonly arguments: Readonly<Record<string, string | number | boolean | null>>;
}

export interface ReplayExecutorAction {
  readonly opcode: string;
  readonly targetId: string | null;
  readonly parameters: Readonly<Record<string, string | number | boolean | null>>;
}

export interface ReplayArtifactRef {
  readonly artifactId: string;
  readonly kind:
    | "semantic-snapshot"
    | "targeted-crop"
    | "network-trace"
    | "console-log"
    | "download";
  readonly path: string;
}

export interface ReplayStateSnapshotRef {
  readonly snapshotId: string;
  readonly schemaVersion: string;
  readonly path: string;
}

export interface ReplayEventSummary {
  readonly headline: string;
  readonly detail: string;
  readonly recoveryAttempted: boolean;
}

export interface ReplayEvent {
  readonly schemaVersion: ReplayEventSchemaVersion;
  readonly eventId: string;
  readonly runId: string;
  readonly stepId: string;
  readonly sequence: number;
  readonly phase: ReplayEventPhase;
  readonly timestamp: string;
  readonly plannerIntent: ReplayPlannerIntent | null;
  readonly executorAction: ReplayExecutorAction | null;
  readonly preStateSnapshotRef: ReplayStateSnapshotRef | null;
  readonly postStateSnapshotRef: ReplayStateSnapshotRef | null;
  readonly artifactRefs: readonly ReplayArtifactRef[];
  readonly summary: ReplayEventSummary;
  readonly verdict: ReplayEventVerdict | null;
}
