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

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.4/7.5 not implemented: ${operation}`);
}

export function buildSemanticSnapshot(
  _input: SemanticSnapshotInput
): SemanticSnapshot {
  return notImplemented("buildSemanticSnapshot");
}

export function compactRuntimeContext(
  _input: RuntimeContextCompactionInput
): RuntimeContextCompaction {
  return notImplemented("compactRuntimeContext");
}
