import type { AltitudeBenchmarkRoute } from "./altitude-domain";

const WORKSPACE_ID = "ws_altitude_benchmark";
const PROJECT_ID = "proj_altitude_launch";
const CYCLE_ID = "cyc_altitude_2026_04";
const MODULE_ID = "mod_altitude_triage";
const PAGE_ID = "page_altitude_root";
const WORK_ITEM_ID = "wi_altitude_login_bug";

export const ALTITUDE_BENCHMARK_ROUTES = [
  {
    name: "workspace-landing",
    path: `/altitude/workspaces/${WORKSPACE_ID}`,
  },
  {
    name: "project-backlog",
    path: `/altitude/workspaces/${WORKSPACE_ID}/projects/${PROJECT_ID}/backlog`,
  },
  {
    name: "board-list-view",
    path: `/altitude/workspaces/${WORKSPACE_ID}/projects/${PROJECT_ID}/views/board-list`,
  },
  {
    name: "cycle-planning",
    path: `/altitude/workspaces/${WORKSPACE_ID}/projects/${PROJECT_ID}/cycles/${CYCLE_ID}/planning`,
  },
  {
    name: "module-detail",
    path: `/altitude/workspaces/${WORKSPACE_ID}/projects/${PROJECT_ID}/modules/${MODULE_ID}`,
  },
  {
    name: "wiki",
    path: `/altitude/workspaces/${WORKSPACE_ID}/projects/${PROJECT_ID}/pages/${PAGE_ID}`,
  },
  {
    name: "work-item-detail",
    path: `/altitude/workspaces/${WORKSPACE_ID}/projects/${PROJECT_ID}/work-items/${WORK_ITEM_ID}`,
  },
  {
    name: "analytics",
    path: `/altitude/workspaces/${WORKSPACE_ID}/projects/${PROJECT_ID}/analytics`,
  },
] as const satisfies readonly AltitudeBenchmarkRoute[];
