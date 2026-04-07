export const SHARED_PLATFORM_ROLE_ORDER = [
  "platform-owner",
  "organization-admin",
  "workspace-admin",
  "member",
  "viewer"
] as const;

export const SHARED_PLATFORM_PERMISSION_RESOURCES = [
  "organization",
  "workspace",
  "invite",
  "membership",
  "audit-log",
  "file",
  "job",
  "search-index",
  "realtime-channel"
] as const;

export const permissionCheckContextFields = [
  "actorId",
  "organizationId",
  "workspaceId",
  "resourceType",
  "action",
  "ownershipScope"
] as const;

export const rbacPlatformContract = {
  roleOrder: SHARED_PLATFORM_ROLE_ORDER,
  resources: SHARED_PLATFORM_PERMISSION_RESOURCES,
  contextFields: permissionCheckContextFields
} as const;
