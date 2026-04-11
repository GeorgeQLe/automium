const SHARED_PLATFORM_API_SURFACES = [
  "auth",
  "tenancy",
  "rbac",
  "audit",
  "files",
  "jobs",
  "search",
  "realtime",
  "admin-console"
] as const;

// --- Types derived from frozen constants ---

export type ApiSurface = (typeof SHARED_PLATFORM_API_SURFACES)[number];

// --- Interfaces ---

export interface ApiRouteContract {
  surface: ApiSurface;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requiresAuth: boolean;
  requiredRole?: string;
}

export interface ApiSurfaceManifest {
  surface: ApiSurface;
  basePath: string;
  routes: ApiRouteContract[];
}

// --- Seed route manifests ---

const SEED_MANIFESTS: ApiSurfaceManifest[] = [
  {
    surface: "auth",
    basePath: "/api/auth",
    routes: [
      { surface: "auth", method: "POST", path: "/sessions", description: "Create session", requiresAuth: false },
      { surface: "auth", method: "DELETE", path: "/sessions/:id", description: "Revoke session", requiresAuth: true },
      { surface: "auth", method: "POST", path: "/invites", description: "Send invite", requiresAuth: true, requiredRole: "workspace-admin" },
    ],
  },
  {
    surface: "tenancy",
    basePath: "/api/tenancy",
    routes: [
      { surface: "tenancy", method: "POST", path: "/organizations", description: "Create organization", requiresAuth: true, requiredRole: "platform-owner" },
      { surface: "tenancy", method: "POST", path: "/workspaces", description: "Create workspace", requiresAuth: true, requiredRole: "organization-admin" },
      { surface: "tenancy", method: "GET", path: "/memberships", description: "List memberships", requiresAuth: true },
    ],
  },
  {
    surface: "rbac",
    basePath: "/api/rbac",
    routes: [
      { surface: "rbac", method: "POST", path: "/check", description: "Check permission", requiresAuth: true },
      { surface: "rbac", method: "GET", path: "/roles", description: "List roles", requiresAuth: true },
    ],
  },
  {
    surface: "audit",
    basePath: "/api/audit",
    routes: [
      { surface: "audit", method: "GET", path: "/events", description: "Query audit events", requiresAuth: true, requiredRole: "workspace-admin" },
    ],
  },
  {
    surface: "files",
    basePath: "/api/files",
    routes: [
      { surface: "files", method: "POST", path: "/", description: "Upload file", requiresAuth: true },
      { surface: "files", method: "POST", path: "/:id/transfer", description: "Transfer ownership", requiresAuth: true },
    ],
  },
  {
    surface: "jobs",
    basePath: "/api/jobs",
    routes: [
      { surface: "jobs", method: "POST", path: "/", description: "Schedule job", requiresAuth: true },
      { surface: "jobs", method: "GET", path: "/:id", description: "Get job status", requiresAuth: true },
    ],
  },
  {
    surface: "search",
    basePath: "/api/search",
    routes: [
      { surface: "search", method: "POST", path: "/index", description: "Index resource", requiresAuth: true },
      { surface: "search", method: "GET", path: "/query", description: "Search resources", requiresAuth: true },
    ],
  },
  {
    surface: "realtime",
    basePath: "/api/realtime",
    routes: [
      { surface: "realtime", method: "POST", path: "/subscribe", description: "Subscribe to topic", requiresAuth: true },
      { surface: "realtime", method: "POST", path: "/publish", description: "Publish event", requiresAuth: true },
    ],
  },
  {
    surface: "admin-console",
    basePath: "/api/admin",
    routes: [
      { surface: "admin-console", method: "GET", path: "/governance/state", description: "Get governance state", requiresAuth: true, requiredRole: "platform-owner" },
      { surface: "admin-console", method: "GET", path: "/governance/sections", description: "List governance sections", requiresAuth: true, requiredRole: "platform-owner" },
    ],
  },
];

// --- Registry ---

export interface ApiContractRegistry {
  get(surface: ApiSurface): ApiSurfaceManifest | undefined;
  all(): readonly ApiSurfaceManifest[];
  routes(surface: ApiSurface): readonly ApiRouteContract[];
}

export function createApiContractRegistry(
  manifests?: ApiSurfaceManifest[]
): ApiContractRegistry {
  const entries = new Map<ApiSurface, ApiSurfaceManifest>();
  for (const m of manifests ?? SEED_MANIFESTS) {
    entries.set(m.surface, m);
  }

  return {
    get(surface: ApiSurface): ApiSurfaceManifest | undefined {
      return entries.get(surface);
    },
    all(): readonly ApiSurfaceManifest[] {
      return [...entries.values()];
    },
    routes(surface: ApiSurface): readonly ApiRouteContract[] {
      return entries.get(surface)?.routes ?? [];
    },
  };
}
