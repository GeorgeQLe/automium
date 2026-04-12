import type { View, SavedView } from "./altitude-domain";
export { VIEW_TYPES } from "./altitude-constants";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createView(params: {
  projectId: string;
  type: View["type"];
  name: string;
}): View {
  return {
    viewId: generateId("view"),
    projectId: params.projectId,
    type: params.type,
    name: params.name,
    createdAt: new Date().toISOString(),
  };
}

export function createSavedView(params: {
  projectId: string;
  type: SavedView["type"];
  name: string;
  filters: Record<string, string[]>;
}): SavedView {
  return {
    viewId: generateId("view"),
    projectId: params.projectId,
    type: params.type,
    name: params.name,
    filters: params.filters,
    createdAt: new Date().toISOString(),
  };
}

export function validateView(view: View): string[] {
  const errors: string[] = [];
  if (!view.viewId) errors.push("viewId is required");
  if (!view.projectId) errors.push("projectId is required");
  if (!view.name) errors.push("name is required");
  return errors;
}
