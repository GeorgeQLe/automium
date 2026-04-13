import type { FoundryApplicationState } from "./foundry-constants";
import type { FoundryApplication } from "./foundry-domain";
import { createFoundryApplication } from "./foundry-domain";

export function createApplication(params: {
  workspaceId: string;
  name: string;
  slug: string;
  state?: FoundryApplicationState;
  applicationId?: string;
  createdAt?: string;
  updatedAt?: string;
}): FoundryApplication {
  return createFoundryApplication({
    ...params,
    state: params.state ?? "draft",
  });
}

export function renameFoundryApplication(
  application: FoundryApplication,
  params: { name: string; slug?: string }
): FoundryApplication {
  return {
    ...application,
    name: params.name,
    slug: params.slug ?? application.slug,
    updatedAt: new Date().toISOString(),
  };
}

export function transitionFoundryApplicationState(
  application: FoundryApplication,
  state: FoundryApplicationState
): FoundryApplication {
  return {
    ...application,
    state,
    updatedAt: new Date().toISOString(),
  };
}
