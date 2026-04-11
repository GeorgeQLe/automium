import {
  WORKSPACE_MEMBERSHIP_ROLES,
  TENANT_OWNED_RESOURCE_KINDS,
} from "./platform-tenancy";

// --- Types derived from frozen constants ---

export type WorkspaceMembershipRole = (typeof WORKSPACE_MEMBERSHIP_ROLES)[number];
export type TenantOwnedResourceKind = (typeof TENANT_OWNED_RESOURCE_KINDS)[number];

// --- Interfaces ---

export interface Organization {
  organizationId: string;
  name: string;
  createdAt: string;
}

export interface Workspace {
  workspaceId: string;
  organizationId: string;
  name: string;
  createdAt: string;
}

export interface WorkspaceMembership {
  membershipId: string;
  organizationId: string;
  workspaceId: string;
  principalId: string;
  role: WorkspaceMembershipRole;
  status: "active" | "suspended";
}

// --- Role precedence ---

export const ROLE_PRECEDENCE: Record<WorkspaceMembershipRole, number> = {
  "workspace-admin": 0,
  maintainer: 1,
  contributor: 2,
  viewer: 3,
};

export function hasHigherOrEqualRole(
  role: WorkspaceMembershipRole,
  comparedTo: WorkspaceMembershipRole
): boolean {
  return ROLE_PRECEDENCE[role] <= ROLE_PRECEDENCE[comparedTo];
}

// --- Factory functions ---

export function createOrganization(params: {
  name: string;
  id?: string;
}): Organization {
  return {
    organizationId: params.id ?? generateId("org"),
    name: params.name,
    createdAt: new Date().toISOString(),
  };
}

export function createWorkspace(params: {
  organizationId: string;
  name: string;
  id?: string;
}): Workspace {
  return {
    workspaceId: params.id ?? generateId("ws"),
    organizationId: params.organizationId,
    name: params.name,
    createdAt: new Date().toISOString(),
  };
}

export function createWorkspaceMembership(params: {
  organizationId: string;
  workspaceId: string;
  principalId: string;
  role: WorkspaceMembershipRole;
  id?: string;
}): WorkspaceMembership {
  return {
    membershipId: params.id ?? generateId("mem"),
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    principalId: params.principalId,
    role: params.role,
    status: "active",
  };
}

// --- Validation ---

export function validateOrganization(org: Organization): string[] {
  const errors: string[] = [];
  if (!org.organizationId) errors.push("organizationId is required");
  if (!org.name) errors.push("name is required");
  return errors;
}

export function validateWorkspace(ws: Workspace): string[] {
  const errors: string[] = [];
  if (!ws.workspaceId) errors.push("workspaceId is required");
  if (!ws.organizationId) errors.push("organizationId is required");
  if (!ws.name) errors.push("name is required");
  return errors;
}

export function validateWorkspaceMembership(m: WorkspaceMembership): string[] {
  const errors: string[] = [];
  if (!m.membershipId) errors.push("membershipId is required");
  if (!m.organizationId) errors.push("organizationId is required");
  if (!m.workspaceId) errors.push("workspaceId is required");
  if (!m.principalId) errors.push("principalId is required");
  if (!WORKSPACE_MEMBERSHIP_ROLES.includes(m.role as never)) {
    errors.push(`Invalid role: ${m.role}`);
  }
  return errors;
}

// --- Internal helpers ---

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
