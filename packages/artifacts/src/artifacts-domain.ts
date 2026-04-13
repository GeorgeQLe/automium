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

const RETENTION_DAYS_BY_VERDICT: Record<string, number> = {
  pass: 14,
  failed: 30,
  unsupported: 7
};

function resolveRetentionDays(verdict: string): number {
  return RETENTION_DAYS_BY_VERDICT[verdict] ?? 14;
}

export function createArtifactManifest(
  input: ArtifactManifestInput
): ArtifactManifest {
  return {
    schemaVersion: ARTIFACT_MANIFEST_SCHEMA_VERSION,
    runId: input.runId,
    root: input.root,
    entries: input.entries.map((entry) => ({ ...entry }))
  };
}

export function calculateArtifactRetention(
  input: ArtifactRetentionInput
): ArtifactRetention {
  const retentionDays = resolveRetentionDays(input.runVerdict);
  const createdAt = new Date(input.createdAt);
  const expiresAt = new Date(createdAt.getTime());

  expiresAt.setUTCDate(expiresAt.getUTCDate() + retentionDays);

  return {
    tenantId: input.tenantId,
    retentionDays,
    expiresAt: expiresAt.toISOString()
  };
}
