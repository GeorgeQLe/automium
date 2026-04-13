import type {
  FoundryPermissionAction,
  FoundryWorkspaceRole,
} from "./foundry-constants";

export interface FoundryPermissionPolicyGrant {
  principalId: string;
  role: FoundryWorkspaceRole;
  actions: FoundryPermissionAction[];
}

export interface FoundryPermissionPolicy {
  workspaceId: string;
  grants: FoundryPermissionPolicyGrant[];
  createdAt: string;
}

export function createFoundryPermissionPolicy(params: {
  workspaceId: string;
  grants: FoundryPermissionPolicyGrant[];
  createdAt?: string;
}): FoundryPermissionPolicy {
  return {
    workspaceId: params.workspaceId,
    grants: params.grants.map((grant) => ({
      ...grant,
      actions: [...grant.actions],
    })),
    createdAt: params.createdAt ?? new Date().toISOString(),
  };
}

export function canFoundryPrincipal(
  policy: FoundryPermissionPolicy,
  principalId: string,
  action: FoundryPermissionAction
): boolean {
  return policy.grants.some(
    (grant) => grant.principalId === principalId && grant.actions.includes(action)
  );
}

export function grantFoundryPermission(
  policy: FoundryPermissionPolicy,
  principalId: string,
  action: FoundryPermissionAction
): FoundryPermissionPolicy {
  return {
    ...policy,
    grants: policy.grants.map((grant) =>
      grant.principalId === principalId
        ? {
            ...grant,
            actions: Array.from(new Set([...grant.actions, action])),
          }
        : grant
    ),
  };
}
