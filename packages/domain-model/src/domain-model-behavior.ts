const SHARED_PLATFORM_DOMAIN_RESOURCES = [
  "organization",
  "workspace",
  "invite",
  "membership",
  "file",
  "job",
  "search-index",
  "realtime-channel",
  "audit-log"
] as const;

// --- Types derived from frozen constants ---

export type DomainResource = (typeof SHARED_PLATFORM_DOMAIN_RESOURCES)[number];

// --- Interfaces ---

export interface DomainResourceRef {
  resourceType: DomainResource;
  resourceId: string;
  organizationId: string;
  workspaceId?: string;
}

export interface DomainEvent {
  eventId: string;
  resourceRef: DomainResourceRef;
  eventType: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

// --- Ownership scope registry ---

export const DOMAIN_RESOURCE_OWNERSHIP_SCOPE: Record<
  DomainResource,
  "organization" | "workspace"
> = {
  organization: "organization",
  workspace: "organization",
  invite: "workspace",
  membership: "workspace",
  file: "workspace",
  job: "workspace",
  "search-index": "workspace",
  "realtime-channel": "workspace",
  "audit-log": "organization",
};

// --- Factory functions ---

export function createDomainResourceRef(params: {
  resourceType: DomainResource;
  resourceId: string;
  organizationId: string;
  workspaceId?: string;
}): DomainResourceRef {
  const scope = DOMAIN_RESOURCE_OWNERSHIP_SCOPE[params.resourceType];
  if (scope === "workspace" && !params.workspaceId) {
    throw new Error(
      `workspaceId is required for workspace-scoped resource: ${params.resourceType}`
    );
  }
  return { ...params };
}

export function createDomainEvent(params: {
  resourceRef: DomainResourceRef;
  eventType: string;
  payload?: Record<string, unknown>;
  id?: string;
}): DomainEvent {
  return {
    eventId: params.id ?? generateId("dev"),
    resourceRef: params.resourceRef,
    eventType: params.eventType,
    occurredAt: new Date().toISOString(),
    payload: params.payload ?? {},
  };
}

// --- Validation ---

export function validateDomainResourceRef(ref: DomainResourceRef): string[] {
  const errors: string[] = [];
  if (!ref.resourceId) errors.push("resourceId is required");
  if (!ref.organizationId) errors.push("organizationId is required");
  if (!SHARED_PLATFORM_DOMAIN_RESOURCES.includes(ref.resourceType as never)) {
    errors.push(`Invalid resourceType: ${ref.resourceType}`);
  }
  const scope = DOMAIN_RESOURCE_OWNERSHIP_SCOPE[ref.resourceType];
  if (scope === "workspace" && !ref.workspaceId) {
    errors.push(`workspaceId is required for workspace-scoped resource: ${ref.resourceType}`);
  }
  return errors;
}

export function validateDomainEvent(event: DomainEvent): string[] {
  const errors: string[] = [];
  if (!event.eventId) errors.push("eventId is required");
  if (!event.eventType) errors.push("eventType is required");
  if (!event.occurredAt) errors.push("occurredAt is required");
  errors.push(...validateDomainResourceRef(event.resourceRef));
  return errors;
}

// --- Internal helpers ---

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
