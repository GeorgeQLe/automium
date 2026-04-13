import type { FoundryJavaScriptObject } from "./foundry-domain";
import { createFoundryJavaScriptObject as createDomainFoundryJavaScriptObject } from "./foundry-domain";

export interface FoundryJavaScriptActionInvocation {
  invocationId: string;
  objectId: string;
  actionName: string;
  arguments: unknown[];
  invokedAt: string;
}

export function createFoundryJavaScriptObject(params: {
  applicationId: string;
  name: string;
  source: string;
  actions?: string[];
  javascriptObjectId?: string;
  createdAt?: string;
  updatedAt?: string;
}): FoundryJavaScriptObject {
  return createDomainFoundryJavaScriptObject(params);
}

export function invokeFoundryJavaScriptAction(
  jsObject: FoundryJavaScriptObject,
  actionName: string,
  args: unknown[] = []
): FoundryJavaScriptActionInvocation {
  if (!jsObject.actions.includes(actionName)) {
    throw new Error(
      `Unknown Foundry JavaScript action '${actionName}' on ${jsObject.name}`
    );
  }

  return {
    invocationId: generateId("jsinv"),
    objectId: jsObject.javascriptObjectId,
    actionName,
    arguments: args,
    invokedAt: new Date().toISOString(),
  };
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
