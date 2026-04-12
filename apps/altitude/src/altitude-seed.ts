import { ALTITUDE_BENCHMARK_ROUTES } from "./altitude-benchmark-routes";
import type {
  AnalyticsSummary,
  Attachment,
  Cycle,
  CycleWorkItemLink,
  Module,
  ModuleWorkItemLink,
  Page,
  Project,
  WorkItem,
} from "./altitude-domain";

export interface AltitudeBenchmarkWorkspace {
  workspaceId: string;
  organizationId: string;
  name: string;
  slug: string;
}

export interface AltitudeAttachmentBucket {
  bucketId: string;
  projectId: string;
  name: string;
  attachments: Attachment[];
}

export interface AltitudeBenchmarkEnvironment {
  workspace: AltitudeBenchmarkWorkspace;
  project: Project;
  workItemPresets: WorkItem[];
  cycles: Cycle[];
  cycleWorkItems: CycleWorkItemLink[];
  modules: Module[];
  moduleWorkItems: ModuleWorkItemLink[];
  pageRoot: Page;
  attachmentBucket: AltitudeAttachmentBucket;
  analyticsSnapshot: AnalyticsSummary;
  routes: typeof ALTITUDE_BENCHMARK_ROUTES;
  mutationLog: string[];
}

const FIXED_TIMESTAMP = "2026-04-13T09:00:00.000Z";

const TEMPLATE: AltitudeBenchmarkEnvironment = {
  workspace: {
    workspaceId: "ws_altitude_benchmark",
    organizationId: "org_automium_benchmark",
    name: "Altitude Benchmark Workspace",
    slug: "altitude-benchmark",
  },
  project: {
    projectId: "proj_altitude_launch",
    organizationId: "org_automium_benchmark",
    workspaceId: "ws_altitude_benchmark",
    name: "Altitude Launch",
    description: "Plane-parity benchmark project for Altitude journeys.",
    createdAt: FIXED_TIMESTAMP,
  },
  workItemPresets: [
    {
      workItemId: "wi_altitude_login_bug",
      projectId: "proj_altitude_launch",
      title: "Fix login redirect bug",
      description: "Users should return to the requested workspace after login.",
      type: "bug",
      state: "backlog",
      priority: "high",
      assigneeId: "user_altitude_alex",
      labels: ["auth", "benchmark"],
      createdAt: FIXED_TIMESTAMP,
    },
    {
      workItemId: "wi_altitude_cycle_scope",
      projectId: "proj_altitude_launch",
      title: "Scope April launch cycle",
      description: "Finalize the benchmark cycle plan and capacity.",
      type: "task",
      state: "todo",
      priority: "medium",
      assigneeId: "user_altitude_sam",
      labels: ["planning"],
      createdAt: FIXED_TIMESTAMP,
    },
    {
      workItemId: "wi_altitude_wiki_cleanup",
      projectId: "proj_altitude_launch",
      title: "Publish onboarding wiki",
      description: "Document the launch workspace setup.",
      type: "story",
      state: "in-progress",
      priority: "low",
      assigneeId: "user_altitude_lee",
      labels: ["docs"],
      createdAt: FIXED_TIMESTAMP,
    },
  ],
  cycles: [
    {
      cycleId: "cyc_altitude_2026_04",
      projectId: "proj_altitude_launch",
      name: "April Launch Cycle",
      startDate: "2026-04-13",
      endDate: "2026-04-27",
      state: "active",
      createdAt: FIXED_TIMESTAMP,
    },
  ],
  cycleWorkItems: [
    {
      cycleId: "cyc_altitude_2026_04",
      workItemId: "wi_altitude_cycle_scope",
      attachedAt: FIXED_TIMESTAMP,
    },
    {
      cycleId: "cyc_altitude_2026_04",
      workItemId: "wi_altitude_wiki_cleanup",
      attachedAt: FIXED_TIMESTAMP,
    },
  ],
  modules: [
    {
      moduleId: "mod_altitude_triage",
      projectId: "proj_altitude_launch",
      name: "Triage",
      description: "Benchmark module for intake, assignment, and status review.",
      createdAt: FIXED_TIMESTAMP,
    },
  ],
  moduleWorkItems: [
    {
      moduleId: "mod_altitude_triage",
      workItemId: "wi_altitude_login_bug",
      addedAt: FIXED_TIMESTAMP,
    },
  ],
  pageRoot: {
    pageId: "page_altitude_root",
    projectId: "proj_altitude_launch",
    title: "Altitude Launch Wiki",
    content: "Benchmark workspace notes, launch checklists, and escalation paths.",
    createdAt: FIXED_TIMESTAMP,
  },
  attachmentBucket: {
    bucketId: "bucket_altitude_launch",
    projectId: "proj_altitude_launch",
    name: "Altitude Launch Attachments",
    attachments: [
      {
        attachmentId: "att_altitude_login_trace",
        workItemId: "wi_altitude_login_bug",
        fileName: "login-redirect-trace.json",
        fileSize: 4096,
        mimeType: "application/json",
        uploadedBy: "user_altitude_alex",
        createdAt: FIXED_TIMESTAMP,
      },
    ],
  },
  analyticsSnapshot: {
    summaryId: "analytics_altitude_launch",
    projectId: "proj_altitude_launch",
    totalWorkItems: 3,
    completedWorkItems: 0,
    overdueWorkItems: 0,
    createdAt: FIXED_TIMESTAMP,
  },
  routes: ALTITUDE_BENCHMARK_ROUTES,
  mutationLog: [],
};

let currentEnvironment = cloneEnvironment(TEMPLATE);

function cloneEnvironment(
  environment: AltitudeBenchmarkEnvironment
): AltitudeBenchmarkEnvironment {
  return {
    workspace: { ...environment.workspace },
    project: { ...environment.project },
    workItemPresets: environment.workItemPresets.map((item) => ({
      ...item,
      labels: item.labels ? [...item.labels] : undefined,
    })),
    cycles: environment.cycles.map((cycle) => ({ ...cycle })),
    cycleWorkItems: environment.cycleWorkItems.map((link) => ({ ...link })),
    modules: environment.modules.map((module) => ({ ...module })),
    moduleWorkItems: environment.moduleWorkItems.map((link) => ({ ...link })),
    pageRoot: { ...environment.pageRoot },
    attachmentBucket: {
      ...environment.attachmentBucket,
      attachments: environment.attachmentBucket.attachments.map((attachment) => ({
        ...attachment,
      })),
    },
    analyticsSnapshot: { ...environment.analyticsSnapshot },
    routes: environment.routes,
    mutationLog: [...environment.mutationLog],
  };
}

export function seedAltitudeBenchmarkEnvironment(): AltitudeBenchmarkEnvironment {
  currentEnvironment = cloneEnvironment(TEMPLATE);
  return cloneEnvironment(currentEnvironment);
}

export function resetAltitudeBenchmarkEnvironment(): AltitudeBenchmarkEnvironment {
  currentEnvironment = cloneEnvironment(TEMPLATE);
  return cloneEnvironment(currentEnvironment);
}
