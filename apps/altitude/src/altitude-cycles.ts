import type { CycleState } from "./altitude-constants";
import type { Cycle, CycleWorkItemLink } from "./altitude-domain";
export { CYCLE_STATES } from "./altitude-constants";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const VALID_CYCLE_TRANSITIONS: Record<CycleState, readonly CycleState[]> = {
  "draft": ["active"],
  "active": ["completed", "cancelled"],
  "completed": [],
  "cancelled": [],
};

export function createCycle(params: {
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
}): Cycle {
  return {
    cycleId: generateId("cyc"),
    projectId: params.projectId,
    name: params.name,
    startDate: params.startDate,
    endDate: params.endDate,
    state: "draft",
    createdAt: new Date().toISOString(),
  };
}

export function transitionCycleState(current: CycleState, next: CycleState): CycleState {
  const allowed = VALID_CYCLE_TRANSITIONS[current];
  if (!allowed.includes(next)) {
    throw new Error(`Invalid transition: ${current} → ${next}`);
  }
  return next;
}

export function attachWorkItemToCycle(params: {
  cycleId: string;
  workItemId: string;
}): CycleWorkItemLink {
  return {
    cycleId: params.cycleId,
    workItemId: params.workItemId,
    attachedAt: new Date().toISOString(),
  };
}

export function validateCycle(cycle: Cycle): string[] {
  const errors: string[] = [];
  if (!cycle.cycleId) errors.push("cycleId is required");
  if (!cycle.projectId) errors.push("projectId is required");
  if (!cycle.name) errors.push("name is required");
  if (!cycle.startDate) errors.push("startDate is required");
  return errors;
}
