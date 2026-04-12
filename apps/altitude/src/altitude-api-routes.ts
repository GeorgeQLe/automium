import type { AltitudeApiRoute } from "./altitude-domain";

export const ALTITUDE_API_ROUTES: readonly AltitudeApiRoute[] = [
  {
    path: "/api/altitude/projects",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Manage project records and lifecycle changes.",
  },
  {
    path: "/api/altitude/work-items",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Manage work items, filtering, assignment, labels, and state changes.",
  },
  {
    path: "/api/altitude/cycles",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Manage planning cycles and their work item assignments.",
  },
  {
    path: "/api/altitude/modules",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Manage project modules and delivery groupings.",
  },
  {
    path: "/api/altitude/pages",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Manage project wiki pages and document content.",
  },
  {
    path: "/api/altitude/views",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Manage project views and saved view filters.",
  },
  {
    path: "/api/altitude/comments",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Manage work item comments and collaboration activity.",
  },
  {
    path: "/api/altitude/attachments",
    methods: ["GET", "POST", "DELETE"],
    description: "Manage attachment metadata and work item file links.",
  },
  {
    path: "/api/altitude/notifications",
    methods: ["GET", "POST", "PATCH"],
    description: "Manage in-product notifications for collaboration events.",
  },
  {
    path: "/api/altitude/analytics",
    methods: ["GET", "POST"],
    description: "Read and refresh project progress analytics summaries.",
  },
  {
    path: "/api/altitude/webhooks",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Manage outbound webhook subscriptions for resource events.",
  },
];
