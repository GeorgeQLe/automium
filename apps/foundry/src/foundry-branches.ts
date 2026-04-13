import type { FoundryBranch } from "./foundry-domain";
import { createFoundryBranch as createDomainFoundryBranch } from "./foundry-domain";

export interface FoundryBranchComparison {
  baseBranchId: string;
  targetBranchId: string;
  changedPages: string[];
  changedQueries: string[];
  changedWidgets: string[];
  comparedAt: string;
  publishReady: boolean;
}

export interface FoundryMergedBranch extends FoundryBranch {
  status: "merged";
  targetBranchId: string;
  mergedBy: string;
  mergedAt: string;
}

export interface FoundryVersionRestore {
  applicationId: string;
  versionId: string;
  actorId: string;
  restoredAt: string;
}

export interface FoundryPendingChange {
  resource: string;
  resourceId: string;
  action: string;
}

export interface FoundryCollaborationHistory {
  applicationId: string;
  activeBranchId: string;
  activeVersionId: string;
  pendingChanges: FoundryPendingChange[];
  publishReady: boolean;
  updatedAt: string;
}

export function createFoundryBranch(params: {
  applicationId: string;
  name: string;
  baseBranchId?: string;
  createdBy?: string;
  branchId?: string;
  createdAt?: string;
}): FoundryBranch {
  return createDomainFoundryBranch({
    ...params,
    status: "active",
  });
}

export function compareFoundryBranches(
  baseBranchId: string,
  targetBranchId: string,
  changes: {
    changedPages?: string[];
    changedQueries?: string[];
    changedWidgets?: string[];
  }
): FoundryBranchComparison {
  const changedPages = changes.changedPages ?? [];
  const changedQueries = changes.changedQueries ?? [];
  const changedWidgets = changes.changedWidgets ?? [];

  return {
    baseBranchId,
    targetBranchId,
    changedPages,
    changedQueries,
    changedWidgets,
    comparedAt: new Date().toISOString(),
    publishReady:
      changedPages.length + changedQueries.length + changedWidgets.length > 0,
  };
}

export function mergeFoundryBranch(
  branch: FoundryBranch,
  params: { actorId: string; targetBranchId: string; mergedAt?: string }
): FoundryMergedBranch {
  return {
    ...branch,
    status: "merged",
    targetBranchId: params.targetBranchId,
    mergedBy: params.actorId,
    mergedAt: params.mergedAt ?? new Date().toISOString(),
  };
}

export function restoreFoundryVersion(params: {
  applicationId: string;
  versionId: string;
  actorId: string;
  restoredAt?: string;
}): FoundryVersionRestore {
  return {
    applicationId: params.applicationId,
    versionId: params.versionId,
    actorId: params.actorId,
    restoredAt: params.restoredAt ?? new Date().toISOString(),
  };
}

export function createFoundryCollaborationHistory(params: {
  applicationId: string;
  activeBranchId: string;
  activeVersionId: string;
  pendingChanges?: FoundryPendingChange[];
  publishReady?: boolean;
  updatedAt?: string;
}): FoundryCollaborationHistory {
  return {
    applicationId: params.applicationId,
    activeBranchId: params.activeBranchId,
    activeVersionId: params.activeVersionId,
    pendingChanges: [...(params.pendingChanges ?? [])],
    publishReady: params.publishReady ?? false,
    updatedAt: params.updatedAt ?? new Date().toISOString(),
  };
}
