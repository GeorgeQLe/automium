import type { Module, ModuleWorkItemLink } from "./altitude-domain";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createModule(params: {
  projectId: string;
  name: string;
  description: string;
}): Module {
  return {
    moduleId: generateId("mod"),
    projectId: params.projectId,
    name: params.name,
    description: params.description,
    createdAt: new Date().toISOString(),
  };
}

export function addWorkItemToModule(params: {
  moduleId: string;
  workItemId: string;
}): ModuleWorkItemLink {
  return {
    moduleId: params.moduleId,
    workItemId: params.workItemId,
    addedAt: new Date().toISOString(),
  };
}

export function validateModule(module: Module): string[] {
  const errors: string[] = [];
  if (!module.moduleId) errors.push("moduleId is required");
  if (!module.projectId) errors.push("projectId is required");
  if (!module.name) errors.push("name is required");
  return errors;
}
