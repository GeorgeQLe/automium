import type { FoundryWorkspace } from "./foundry-domain";
import { createFoundryWorkspace } from "./foundry-domain";

export function createWorkspace(params: {
  organizationId: string;
  name: string;
  slug: string;
  defaultEnvironmentId: string;
  workspaceId?: string;
  createdAt?: string;
}): FoundryWorkspace {
  return createFoundryWorkspace(params);
}

export function renameWorkspace(
  workspace: FoundryWorkspace,
  params: { name: string; slug?: string }
): FoundryWorkspace {
  return {
    ...workspace,
    name: params.name,
    slug: params.slug ?? workspace.slug,
  };
}

export function setDefaultFoundryEnvironment(
  workspace: FoundryWorkspace,
  defaultEnvironmentId: string
): FoundryWorkspace {
  return {
    ...workspace,
    defaultEnvironmentId,
  };
}
