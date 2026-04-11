export const SHARED_PLATFORM_API_SURFACES = [
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

export * from "./api-contracts-behavior";
