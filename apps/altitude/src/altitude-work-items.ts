import type { WorkItemState } from "./altitude-constants";
import type { WorkItem } from "./altitude-domain";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const VALID_WORK_ITEM_TRANSITIONS: Record<WorkItemState, readonly WorkItemState[]> = {
  "backlog": ["todo", "in-progress"],
  "todo": ["in-progress", "backlog"],
  "in-progress": ["in-review", "done", "backlog"],
  "in-review": ["done", "in-progress"],
  "done": ["cancelled"],
  "cancelled": [],
};

export { VALID_WORK_ITEM_TRANSITIONS };

export function createWorkItem(params: {
  projectId: string;
  title: string;
  type: WorkItem["type"];
  state: WorkItem["state"];
  priority: WorkItem["priority"];
}): WorkItem {
  return {
    workItemId: generateId("wi"),
    projectId: params.projectId,
    title: params.title,
    type: params.type,
    state: params.state,
    priority: params.priority,
    createdAt: new Date().toISOString(),
  };
}

export function transitionWorkItemState(current: WorkItemState, next: WorkItemState): WorkItemState {
  const allowed = VALID_WORK_ITEM_TRANSITIONS[current];
  if (!allowed.includes(next)) {
    throw new Error(`Invalid transition: ${current} → ${next}`);
  }
  return next;
}

export function validateWorkItem(item: WorkItem): string[] {
  const errors: string[] = [];
  if (!item.workItemId) errors.push("workItemId is required");
  if (!item.projectId) errors.push("projectId is required");
  if (!item.title) errors.push("title is required");
  return errors;
}
