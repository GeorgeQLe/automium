import type { AnalyticsSummary } from "./altitude-domain";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createAnalyticsSummary(params: {
  projectId: string;
  totalWorkItems: number;
  completedWorkItems: number;
  overdueWorkItems: number;
}): AnalyticsSummary {
  return {
    summaryId: generateId("analytics"),
    projectId: params.projectId,
    totalWorkItems: params.totalWorkItems,
    completedWorkItems: params.completedWorkItems,
    overdueWorkItems: params.overdueWorkItems,
    createdAt: new Date().toISOString(),
  };
}
