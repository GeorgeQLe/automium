export const TENANCY_BOUNDARY_RESOURCES = [
  "organization",
  "workspace",
  "invite",
  "membership"
] as const;

export const WORKSPACE_MEMBERSHIP_ROLES = [
  "workspace-admin",
  "maintainer",
  "contributor",
  "viewer"
] as const;

export const workspaceMembershipProjectionFields = [
  "membershipId",
  "organizationId",
  "workspaceId",
  "principalId",
  "role",
  "status"
] as const;

export const TENANT_OWNED_RESOURCE_KINDS = [
  "file",
  "job",
  "search-index"
] as const;

export const tenancyPlatformContract = {
  resources: TENANCY_BOUNDARY_RESOURCES,
  workspaceRoles: WORKSPACE_MEMBERSHIP_ROLES,
  membershipProjectionFields: workspaceMembershipProjectionFields,
  tenantOwnedResourceKinds: TENANT_OWNED_RESOURCE_KINDS
} as const;
