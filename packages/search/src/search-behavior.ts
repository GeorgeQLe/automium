const SEARCH_INDEX_RESOURCE_TYPES = [
  "workspace-document",
  "file",
  "job"
] as const;

// --- Types derived from frozen constants ---

export type SearchIndexResourceType = (typeof SEARCH_INDEX_RESOURCE_TYPES)[number];

// --- Interfaces ---

export interface SearchIndexEntry {
  entryId: string;
  organizationId: string;
  workspaceId: string;
  resourceType: SearchIndexResourceType;
  resourceId: string;
  content: string;
  indexedAt: string;
}

export interface SearchIndexingRequest {
  requestId: string;
  organizationId: string;
  workspaceId: string;
  resourceType: SearchIndexResourceType;
  resourceId: string;
  content: string;
}

export interface SearchIndexingResult {
  requestId: string;
  entryId: string;
  indexed: boolean;
  indexedAt: string;
}

// --- Factory ---

export function createSearchIndexingRequest(params: {
  organizationId: string;
  workspaceId: string;
  resourceType: SearchIndexResourceType;
  resourceId: string;
  content: string;
  id?: string;
}): SearchIndexingRequest {
  return {
    requestId: params.id ?? generateId("sir"),
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    content: params.content,
  };
}

export function createSearchIndexEntry(
  request: SearchIndexingRequest,
  entryId?: string
): SearchIndexEntry {
  return {
    entryId: entryId ?? generateId("sie"),
    organizationId: request.organizationId,
    workspaceId: request.workspaceId,
    resourceType: request.resourceType,
    resourceId: request.resourceId,
    content: request.content,
    indexedAt: new Date().toISOString(),
  };
}

// --- Validation ---

export function validateSearchIndexingRequest(
  req: SearchIndexingRequest
): string[] {
  const errors: string[] = [];
  if (!req.requestId) errors.push("requestId is required");
  if (!req.organizationId) errors.push("organizationId is required");
  if (!req.workspaceId) errors.push("workspaceId is required");
  if (!req.resourceId) errors.push("resourceId is required");
  if (!req.content) errors.push("content is required");
  if (!SEARCH_INDEX_RESOURCE_TYPES.includes(req.resourceType as never)) {
    errors.push(`Invalid resourceType: ${req.resourceType}`);
  }
  return errors;
}

// --- Internal helpers ---

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
