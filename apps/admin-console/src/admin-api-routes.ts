// --- Route contract type (mirrors api-contracts shape, no cross-package import) ---

export interface AdminApiRouteContract {
  surface: "admin-console";
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requiresAuth: boolean;
  requiredRole?: string;
}

// --- Extended admin-console routes ---

export const ADMIN_CONSOLE_EXTENDED_ROUTES: AdminApiRouteContract[] = [
  // Governance mutation routes
  {
    surface: "admin-console",
    method: "POST",
    path: "/governance/config",
    description: "Update governance configuration",
    requiresAuth: true,
    requiredRole: "platform-owner",
  },
  {
    surface: "admin-console",
    method: "PUT",
    path: "/governance/sections/:id",
    description: "Update governance section config",
    requiresAuth: true,
    requiredRole: "platform-owner",
  },
  {
    surface: "admin-console",
    method: "POST",
    path: "/governance/reset",
    description: "Reset governance state to defaults",
    requiresAuth: true,
    requiredRole: "platform-owner",
  },
  // Product navigation routes
  {
    surface: "admin-console",
    method: "GET",
    path: "/products",
    description: "List registered products",
    requiresAuth: true,
    requiredRole: "platform-owner",
  },
  {
    surface: "admin-console",
    method: "GET",
    path: "/products/:id",
    description: "Get product details",
    requiresAuth: true,
    requiredRole: "platform-owner",
  },
];

// --- Seed routes (read-only, matching existing api-contracts manifest) ---

const ADMIN_CONSOLE_SEED_ROUTES: AdminApiRouteContract[] = [
  {
    surface: "admin-console",
    method: "GET",
    path: "/governance/state",
    description: "Get governance state",
    requiresAuth: true,
    requiredRole: "platform-owner",
  },
  {
    surface: "admin-console",
    method: "GET",
    path: "/governance/sections",
    description: "List governance sections",
    requiresAuth: true,
    requiredRole: "platform-owner",
  },
];

// --- Route manifest ---

export interface AdminRouteManifest {
  surface: "admin-console";
  basePath: string;
  routes: AdminApiRouteContract[];
}

export function createAdminRouteManifest(params?: {
  basePath?: string;
  additionalRoutes?: AdminApiRouteContract[];
}): AdminRouteManifest {
  const routes: AdminApiRouteContract[] = [
    ...ADMIN_CONSOLE_SEED_ROUTES,
    ...ADMIN_CONSOLE_EXTENDED_ROUTES,
    ...(params?.additionalRoutes ?? []),
  ];

  return {
    surface: "admin-console",
    basePath: params?.basePath ?? "/api/admin",
    routes,
  };
}
