import {
  SEMANTIC_SNAPSHOT_SCHEMA_VERSION,
  interactiveElementRequiredFields,
  semanticSnapshotRequiredFields,
  type SemanticCheckpointContext,
  type SemanticFrameRef,
  type SemanticInteractiveElement,
  type SemanticMutationSummary,
  type SemanticNetworkEvent,
  type SemanticPinnedInvariant,
  type SemanticSnapshot,
  type SemanticTaskContext,
} from "../../contracts/src/semantic-snapshot";

export interface BuildContractSnapshotInput {
  readonly url: string;
  readonly route: string;
  readonly frameHierarchy?: readonly SemanticFrameRef[];
  readonly taskContext: SemanticTaskContext;
  readonly checkpointContext?: SemanticCheckpointContext | null;
  readonly interactiveElements?: readonly SemanticInteractiveElement[];
  readonly recentMutations?: readonly SemanticMutationSummary[];
  readonly relevantNetworkEvents?: readonly SemanticNetworkEvent[];
  readonly pinnedInvariants?: readonly SemanticPinnedInvariant[];
}

export function buildContractSnapshot(
  input: BuildContractSnapshotInput
): SemanticSnapshot {
  const snapshot: SemanticSnapshot = {
    schemaVersion: SEMANTIC_SNAPSHOT_SCHEMA_VERSION,
    url: input.url,
    route: input.route,
    frameHierarchy: cloneArray(input.frameHierarchy ?? []),
    taskContext: { ...input.taskContext },
    checkpointContext: input.checkpointContext
      ? {
          ...input.checkpointContext,
          assertionIds: [...input.checkpointContext.assertionIds],
        }
      : null,
    interactiveElements: cloneArray(input.interactiveElements ?? []),
    recentMutations: cloneArray(input.recentMutations ?? []),
    relevantNetworkEvents: cloneArray(input.relevantNetworkEvents ?? []),
    pinnedInvariants: cloneArray(input.pinnedInvariants ?? []),
  };

  assertRequiredFields(snapshot, semanticSnapshotRequiredFields);
  for (const element of snapshot.interactiveElements) {
    assertRequiredFields(element, interactiveElementRequiredFields);
  }

  return snapshot;
}

function cloneArray<T extends object>(items: readonly T[]): T[] {
  return items.map((item) => ({ ...item }));
}

function assertRequiredFields<T extends object>(
  value: T,
  requiredFields: readonly string[]
): void {
  for (const field of requiredFields) {
    if (!(field in value)) {
      throw new Error(`Semantic snapshot missing required field: ${field}`);
    }
  }
}
