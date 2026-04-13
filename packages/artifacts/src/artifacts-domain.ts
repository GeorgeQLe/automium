export const ARTIFACT_MANIFEST_SCHEMA_VERSION = "v1";

export const ARTIFACT_KINDS = [
  "semantic-snapshot",
  "network-log",
  "console-log",
  "download",
  "targeted-crop",
  "assertion-trace",
  "planner-intent",
  "executor-action"
] as const;

export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];

export interface ArtifactManifestEntry {
  readonly kind: ArtifactKind;
  readonly path: string;
}

export interface ArtifactManifestInput {
  readonly runId: string;
  readonly root: string;
  readonly entries: readonly ArtifactManifestEntry[];
}

export interface ArtifactManifest extends ArtifactManifestInput {
  readonly schemaVersion: typeof ARTIFACT_MANIFEST_SCHEMA_VERSION;
}

export interface ArtifactRetentionInput {
  readonly tenantId: string;
  readonly runVerdict: "pass" | "failed" | "unsupported" | string;
  readonly createdAt: string;
}

export interface ArtifactRetention {
  readonly tenantId: string;
  readonly retentionDays: number;
  readonly expiresAt: string;
}

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.5 not implemented: ${operation}`);
}

export function createArtifactManifest(
  _input: ArtifactManifestInput
): ArtifactManifest {
  return notImplemented("createArtifactManifest");
}

export function calculateArtifactRetention(
  _input: ArtifactRetentionInput
): ArtifactRetention {
  return notImplemented("calculateArtifactRetention");
}
