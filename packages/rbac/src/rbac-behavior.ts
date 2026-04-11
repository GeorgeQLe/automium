import {
  SHARED_PLATFORM_ROLE_ORDER,
  SHARED_PLATFORM_PERMISSION_RESOURCES,
} from "./platform-rbac";

// --- Types derived from frozen constants ---

export type SharedPlatformRole = (typeof SHARED_PLATFORM_ROLE_ORDER)[number];
export type PermissionResource = (typeof SHARED_PLATFORM_PERMISSION_RESOURCES)[number];
export type PermissionAction = "create" | "read" | "update" | "delete" | "list";

// --- Interfaces ---

export interface PermissionCheckContext {
  actorId: string;
  organizationId: string;
  workspaceId: string;
  resourceType: PermissionResource;
  action: PermissionAction;
  ownershipScope: "own" | "any";
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason: string;
  role: SharedPlatformRole;
  resource: PermissionResource;
  action: PermissionAction;
}

// --- Role order index ---

export const ROLE_ORDER_INDEX: Record<SharedPlatformRole, number> = {
  "platform-owner": 0,
  "organization-admin": 1,
  "workspace-admin": 2,
  member: 3,
  viewer: 4,
};

// --- Permission matrix ---

const ALL_ACTIONS: readonly PermissionAction[] = ["create", "read", "update", "delete", "list"];
const READ_LIST: readonly PermissionAction[] = ["read", "list"];

export const ROLE_RESOURCE_PERMISSIONS: Record<
  SharedPlatformRole,
  Partial<Record<PermissionResource, readonly PermissionAction[]>>
> = {
  "platform-owner": Object.fromEntries(
    SHARED_PLATFORM_PERMISSION_RESOURCES.map((r) => [r, ALL_ACTIONS])
  ) as Record<PermissionResource, readonly PermissionAction[]>,

  "organization-admin": {
    organization: ["read", "update", "list"],
    workspace: ALL_ACTIONS,
    invite: ALL_ACTIONS,
    membership: ALL_ACTIONS,
    "audit-log": READ_LIST,
    file: ALL_ACTIONS,
    job: ALL_ACTIONS,
    "search-index": ALL_ACTIONS,
    "realtime-channel": READ_LIST,
  },

  "workspace-admin": {
    organization: READ_LIST,
    workspace: ["read", "update", "list"],
    invite: ALL_ACTIONS,
    membership: ["read", "update", "delete", "list"],
    "audit-log": READ_LIST,
    file: ALL_ACTIONS,
    job: ALL_ACTIONS,
    "search-index": ALL_ACTIONS,
    "realtime-channel": READ_LIST,
  },

  member: {
    organization: READ_LIST,
    workspace: READ_LIST,
    invite: ["read", "list"],
    membership: READ_LIST,
    "audit-log": READ_LIST,
    file: ["create", "read", "update", "list"],
    job: ["create", "read", "list"],
    "search-index": READ_LIST,
    "realtime-channel": READ_LIST,
  },

  viewer: {
    organization: READ_LIST,
    workspace: READ_LIST,
    invite: READ_LIST,
    membership: READ_LIST,
    "audit-log": READ_LIST,
    file: READ_LIST,
    job: READ_LIST,
    "search-index": READ_LIST,
    "realtime-channel": READ_LIST,
  },
};

// --- Permission check ---

export function checkPermission(
  role: SharedPlatformRole,
  context: PermissionCheckContext
): PermissionCheckResult {
  const resourcePerms = ROLE_RESOURCE_PERMISSIONS[role]?.[context.resourceType];
  const allowed = resourcePerms?.includes(context.action) ?? false;

  return {
    allowed,
    reason: allowed
      ? `${role} may ${context.action} ${context.resourceType}`
      : `${role} may not ${context.action} ${context.resourceType}`,
    role,
    resource: context.resourceType,
    action: context.action,
  };
}

// --- Validation ---

export function validatePermissionCheckContext(
  ctx: PermissionCheckContext
): string[] {
  const errors: string[] = [];
  if (!ctx.actorId) errors.push("actorId is required");
  if (!ctx.organizationId) errors.push("organizationId is required");
  if (!ctx.workspaceId) errors.push("workspaceId is required");
  if (!SHARED_PLATFORM_PERMISSION_RESOURCES.includes(ctx.resourceType as never)) {
    errors.push(`Invalid resourceType: ${ctx.resourceType}`);
  }
  if (!SHARED_PLATFORM_ROLE_ORDER.includes(ctx.ownershipScope as never)) {
    // ownershipScope is "own" | "any", not a role — validate separately
  }
  return errors;
}
