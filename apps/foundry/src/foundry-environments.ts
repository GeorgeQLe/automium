import type { FoundryEnvironment } from "./foundry-domain";
import { createFoundryEnvironment } from "./foundry-domain";

export function createEnvironment(params: {
  applicationId: string;
  name: string;
  slug: string;
  variables: Record<string, string>;
  environmentId?: string;
  createdAt?: string;
}): FoundryEnvironment {
  return createFoundryEnvironment(params);
}

export function setFoundryEnvironmentVariable(
  environment: FoundryEnvironment,
  name: string,
  value: string
): FoundryEnvironment {
  return {
    ...environment,
    variables: {
      ...environment.variables,
      [name]: value,
    },
  };
}
