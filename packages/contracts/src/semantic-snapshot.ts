export const SEMANTIC_SNAPSHOT_SCHEMA_VERSION = "v1";

export const semanticSnapshotRequiredFields = [
  "url",
  "route",
  "frameHierarchy",
  "taskContext",
  "checkpointContext",
  "interactiveElements",
  "recentMutations",
  "relevantNetworkEvents",
  "pinnedInvariants"
] as const;

export const interactiveElementRequiredFields = [
  "id",
  "role",
  "label",
  "value",
  "required",
  "disabled",
  "loading",
  "error",
  "visible",
  "interactable",
  "group"
] as const;

export type SemanticSnapshotSchemaVersion =
  typeof SEMANTIC_SNAPSHOT_SCHEMA_VERSION;

export type SemanticSnapshotRequiredField =
  (typeof semanticSnapshotRequiredFields)[number];

export type InteractiveElementRequiredField =
  (typeof interactiveElementRequiredFields)[number];

export interface SemanticFrameRef {
  readonly id: string;
  readonly parentFrameId: string | null;
  readonly origin: string;
  readonly url: string;
}

export interface SemanticTaskContext {
  readonly journeyId: string;
  readonly runId: string;
  readonly stepId: string;
  readonly environmentProfileId: string;
  readonly authorizedAppId: string;
}

export interface SemanticCheckpointContext {
  readonly checkpointId: string;
  readonly label: string;
  readonly assertionIds: readonly string[];
}

export interface SemanticInteractiveElement {
  readonly id: string;
  readonly role: string;
  readonly label: string;
  readonly value: string | null;
  readonly required: boolean;
  readonly disabled: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly visible: boolean;
  readonly interactable: boolean;
  readonly group: string | null;
}

export interface SemanticMutationSummary {
  readonly mutationId: string;
  readonly kind: "attribute" | "child-list" | "text" | "visibility";
  readonly targetId: string;
  readonly summary: string;
}

export interface SemanticNetworkEvent {
  readonly requestId: string;
  readonly method: string;
  readonly url: string;
  readonly status: number | null;
  readonly category: "document" | "xhr" | "fetch" | "websocket" | "other";
}

export interface SemanticPinnedInvariant {
  readonly invariantId: string;
  readonly description: string;
  readonly source: "journey" | "checkpoint" | "recovery-policy";
}

export interface SemanticSnapshot {
  readonly schemaVersion: SemanticSnapshotSchemaVersion;
  readonly url: string;
  readonly route: string;
  readonly frameHierarchy: readonly SemanticFrameRef[];
  readonly taskContext: SemanticTaskContext;
  readonly checkpointContext: SemanticCheckpointContext | null;
  readonly interactiveElements: readonly SemanticInteractiveElement[];
  readonly recentMutations: readonly SemanticMutationSummary[];
  readonly relevantNetworkEvents: readonly SemanticNetworkEvent[];
  readonly pinnedInvariants: readonly SemanticPinnedInvariant[];
}
