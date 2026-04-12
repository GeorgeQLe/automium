import type { Project } from "./altitude-domain";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createProject(params: {
  name: string;
  organizationId: string;
  workspaceId: string;
}): Project {
  return {
    projectId: generateId("proj"),
    name: params.name,
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    createdAt: new Date().toISOString(),
  };
}

export function validateProject(project: Project): string[] {
  const errors: string[] = [];
  if (!project.projectId) errors.push("projectId is required");
  if (!project.name) errors.push("name is required");
  if (!project.organizationId) errors.push("organizationId is required");
  return errors;
}
