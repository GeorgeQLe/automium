export interface FoundryPublishedPage {
  pageId: string;
  path: string;
}

export interface FoundryPublishMetadata {
  deploymentId: string;
  applicationId: string;
  branchId: string;
  environmentId: string;
  version: string;
  status: "published";
  runtimeSnapshotId: string;
  runtimePath: string;
  pages: FoundryPublishedPage[];
  widgetTreeHash: string;
  queryManifestHash: string;
  publishedAt: string;
}

export interface FoundryShareLink {
  shareId: string;
  deploymentId: string;
  audience: "editor" | "viewer" | "runtime-consumer";
  permissions: string[];
  url: string;
  expiresAt?: string;
  createdAt: string;
}

export function publishFoundryApplication(params: {
  applicationId: string;
  branchId: string;
  environmentId: string;
  version: string;
  pages: FoundryPublishedPage[];
  widgetTreeHash: string;
  queryManifestHash: string;
  deploymentId?: string;
  runtimeSnapshotId?: string;
  publishedAt?: string;
}): FoundryPublishMetadata {
  const deploymentId = params.deploymentId ?? generateId("deploy");

  return {
    deploymentId,
    applicationId: params.applicationId,
    branchId: params.branchId,
    environmentId: params.environmentId,
    version: params.version,
    status: "published",
    runtimeSnapshotId: params.runtimeSnapshotId ?? generateId("snapshot"),
    runtimePath: `/foundry/runtime/${params.applicationId}`,
    pages: params.pages.map((page) => ({ ...page })),
    widgetTreeHash: params.widgetTreeHash,
    queryManifestHash: params.queryManifestHash,
    publishedAt: params.publishedAt ?? new Date().toISOString(),
  };
}

export function createFoundryShareLink(params: {
  deploymentId: string;
  audience: FoundryShareLink["audience"];
  permissions: string[];
  expiresAt?: string;
  shareId?: string;
  createdAt?: string;
}): FoundryShareLink {
  const shareId = params.shareId ?? generateId("share");

  return {
    shareId,
    deploymentId: params.deploymentId,
    audience: params.audience,
    permissions: [...params.permissions],
    url: `/foundry/runtime/${params.deploymentId}/share/${shareId}`,
    expiresAt: params.expiresAt,
    createdAt: params.createdAt ?? new Date().toISOString(),
  };
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
