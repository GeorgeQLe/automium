export const FOUNDRY_WORKSPACE_ROLES = [
  "owner",
  "admin",
  "editor",
  "viewer",
  "runtime-consumer",
] as const;
export type FoundryWorkspaceRole = (typeof FOUNDRY_WORKSPACE_ROLES)[number];

export const FOUNDRY_APPLICATION_STATES = [
  "draft",
  "published",
  "archived",
] as const;
export type FoundryApplicationState = (typeof FOUNDRY_APPLICATION_STATES)[number];

export const FOUNDRY_PAGE_TYPES = ["canvas", "modal", "tab", "form"] as const;
export type FoundryPageType = (typeof FOUNDRY_PAGE_TYPES)[number];

export const FOUNDRY_WIDGET_FAMILIES = [
  "table",
  "form",
  "button",
  "modal",
  "navigation",
  "chart",
  "custom",
] as const;
export type FoundryWidgetFamily = (typeof FOUNDRY_WIDGET_FAMILIES)[number];

export const FOUNDRY_DATASOURCE_TYPES = [
  "postgres",
  "mysql",
  "rest-api",
] as const;
export type FoundryDatasourceType = (typeof FOUNDRY_DATASOURCE_TYPES)[number];

export const FOUNDRY_QUERY_RUNTIMES = ["sql", "rest", "javascript"] as const;
export type FoundryQueryRuntime = (typeof FOUNDRY_QUERY_RUNTIMES)[number];

export const FOUNDRY_BINDING_SCOPES = [
  "widget",
  "page",
  "app",
  "query",
  "state",
] as const;
export type FoundryBindingScope = (typeof FOUNDRY_BINDING_SCOPES)[number];

export const FOUNDRY_BRANCH_STATUSES = ["active", "merged", "archived"] as const;
export type FoundryBranchStatus = (typeof FOUNDRY_BRANCH_STATUSES)[number];

export const FOUNDRY_DEPLOYMENT_STATUSES = [
  "draft",
  "published",
  "failed",
  "rolled-back",
] as const;
export type FoundryDeploymentStatus = (typeof FOUNDRY_DEPLOYMENT_STATUSES)[number];

export const FOUNDRY_PERMISSION_ACTIONS = [
  "workspace.manage",
  "workspace.view",
  "application.create",
  "application.view",
  "application.edit",
  "page.edit",
  "widget.edit",
  "datasource.configure",
  "datasource.execute",
  "query.execute",
  "deployment.publish",
  "deployment.rollback",
  "runtime.view",
] as const;
export type FoundryPermissionAction = (typeof FOUNDRY_PERMISSION_ACTIONS)[number];

export const FOUNDRY_REALTIME_TOPICS = [
  "application.updated",
  "page.updated",
  "widget.updated",
  "datasource.updated",
  "query.executed",
  "branch.changed",
  "deployment.published",
  "permission.changed",
] as const;
export type FoundryRealtimeTopic = (typeof FOUNDRY_REALTIME_TOPICS)[number];

export const FOUNDRY_BENCHMARK_ROUTE_CATEGORIES = [
  "builder",
  "datasource",
  "query",
  "runtime",
  "publish",
] as const;
export type FoundryBenchmarkRouteCategory =
  (typeof FOUNDRY_BENCHMARK_ROUTE_CATEGORIES)[number];
