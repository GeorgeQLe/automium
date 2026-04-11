const FILE_OWNERSHIP_FIELDS = [
  "fileId",
  "organizationId",
  "workspaceId",
  "ownerMembershipId"
] as const;

// --- Interfaces ---

export interface FileOwnership {
  fileId: string;
  organizationId: string;
  workspaceId: string;
  ownerMembershipId: string;
}

export interface FileOwnershipTransfer {
  transferId: string;
  fileId: string;
  fromOwnerMembershipId: string;
  toOwnerMembershipId: string;
  initiatedBy: string;
  occurredAt: string;
}

// --- Factory functions ---

export function createFileOwnership(params: {
  organizationId: string;
  workspaceId: string;
  ownerMembershipId: string;
  fileId?: string;
}): FileOwnership {
  return {
    fileId: params.fileId ?? generateId("file"),
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    ownerMembershipId: params.ownerMembershipId,
  };
}

export function createFileOwnershipTransfer(params: {
  fileId: string;
  fromOwnerMembershipId: string;
  toOwnerMembershipId: string;
  initiatedBy: string;
  id?: string;
}): FileOwnershipTransfer {
  return {
    transferId: params.id ?? generateId("xfr"),
    fileId: params.fileId,
    fromOwnerMembershipId: params.fromOwnerMembershipId,
    toOwnerMembershipId: params.toOwnerMembershipId,
    initiatedBy: params.initiatedBy,
    occurredAt: new Date().toISOString(),
  };
}

// --- Domain logic ---

export function applyOwnershipTransfer(
  ownership: FileOwnership,
  transfer: FileOwnershipTransfer
): FileOwnership {
  if (ownership.fileId !== transfer.fileId) {
    throw new Error(
      `Transfer fileId (${transfer.fileId}) does not match ownership fileId (${ownership.fileId})`
    );
  }
  if (ownership.ownerMembershipId !== transfer.fromOwnerMembershipId) {
    throw new Error(
      `Current owner (${ownership.ownerMembershipId}) does not match transfer source (${transfer.fromOwnerMembershipId})`
    );
  }
  return {
    ...ownership,
    ownerMembershipId: transfer.toOwnerMembershipId,
  };
}

// --- Validation ---

export function validateFileOwnership(fo: FileOwnership): string[] {
  const errors: string[] = [];
  for (const field of FILE_OWNERSHIP_FIELDS) {
    if (!fo[field as keyof FileOwnership]) {
      errors.push(`${field} is required`);
    }
  }
  return errors;
}

export function validateFileOwnershipTransfer(
  t: FileOwnershipTransfer
): string[] {
  const errors: string[] = [];
  if (!t.transferId) errors.push("transferId is required");
  if (!t.fileId) errors.push("fileId is required");
  if (!t.fromOwnerMembershipId) errors.push("fromOwnerMembershipId is required");
  if (!t.toOwnerMembershipId) errors.push("toOwnerMembershipId is required");
  if (!t.initiatedBy) errors.push("initiatedBy is required");
  if (t.fromOwnerMembershipId === t.toOwnerMembershipId) {
    errors.push("Transfer source and destination must differ");
  }
  return errors;
}

// --- Internal helpers ---

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
