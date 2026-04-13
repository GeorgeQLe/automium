export const SEMANTIC_RUNTIME_SCHEMA_VERSION = "v1";

export interface RuntimeElementInput {
  readonly id: string;
  readonly role: string;
  readonly label: string;
  readonly visible: boolean;
}

export interface RuntimeNetworkEventInput {
  readonly method: string;
  readonly path: string;
}

export interface SemanticSnapshotInput {
  readonly url: string;
  readonly route: string;
  readonly taskContext: string;
  readonly elements: readonly RuntimeElementInput[];
  readonly networkEvents: readonly RuntimeNetworkEventInput[];
}

export interface SemanticSnapshot {
  readonly schemaVersion: typeof SEMANTIC_RUNTIME_SCHEMA_VERSION;
  readonly url: string;
  readonly route: string;
  readonly taskContext: string;
  readonly interactiveElements: readonly RuntimeElementInput[];
  readonly networkEvents: readonly RuntimeNetworkEventInput[];
}

export interface RuntimeSnapshotRef {
  readonly snapshotId: string;
}

export interface RuntimeContextCompactionInput {
  readonly tokenBudget: number;
  readonly cropBudget: number;
  readonly snapshots: readonly RuntimeSnapshotRef[];
  readonly pinnedInvariants: readonly string[];
}

export interface RuntimeContextCompaction {
  readonly tokenBudget: number;
  readonly cropBudget: number;
  readonly retainedSnapshotRefs: readonly string[];
  readonly droppedSnapshotRefs: readonly string[];
  readonly pinnedInvariants: readonly string[];
}

const ESTIMATED_SNAPSHOT_TOKENS = 600;

export function buildSemanticSnapshot(
  input: SemanticSnapshotInput
): SemanticSnapshot {
  return {
    schemaVersion: SEMANTIC_RUNTIME_SCHEMA_VERSION,
    url: input.url,
    route: input.route,
    taskContext: input.taskContext,
    interactiveElements: input.elements
      .filter((element) => element.visible)
      .map((element) => ({ ...element })),
    networkEvents: input.networkEvents.map((event) => ({ ...event }))
  };
}

export function compactRuntimeContext(
  input: RuntimeContextCompactionInput
): RuntimeContextCompaction {
  const maxByTokens =
    input.tokenBudget <= 0
      ? 0
      : Math.max(1, Math.floor(input.tokenBudget / ESTIMATED_SNAPSHOT_TOKENS));
  const maxByCrops = Math.max(0, input.cropBudget);
  const retainedCount = Math.min(
    input.snapshots.length,
    maxByTokens,
    maxByCrops
  );
  const retained = input.snapshots.slice(0, retainedCount);
  const dropped = input.snapshots.slice(retainedCount);

  return {
    tokenBudget: input.tokenBudget,
    cropBudget: input.cropBudget,
    retainedSnapshotRefs: retained.map((snapshot) => snapshot.snapshotId),
    droppedSnapshotRefs: dropped.map((snapshot) => snapshot.snapshotId),
    pinnedInvariants: [...input.pinnedInvariants]
  };
}
