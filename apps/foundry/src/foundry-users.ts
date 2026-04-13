import type { FoundryWorkspaceRole } from "./foundry-constants";
import type { FoundryUser } from "./foundry-domain";
import { createFoundryUser } from "./foundry-domain";

export function createUser(params: {
  workspaceId: string;
  name: string;
  email: string;
  role: FoundryWorkspaceRole;
  userId?: string;
  createdAt?: string;
}): FoundryUser {
  return createFoundryUser(params);
}

export function changeFoundryUserRole(
  user: FoundryUser,
  role: FoundryWorkspaceRole
): FoundryUser {
  return {
    ...user,
    role,
  };
}

export function isFoundryEditor(user: FoundryUser): boolean {
  return ["owner", "admin", "editor"].includes(user.role);
}
