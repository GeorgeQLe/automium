import type {
  FoundryApplicationState,
  FoundryBenchmarkRouteCategory,
  FoundryBindingScope,
  FoundryBranchStatus,
  FoundryDatasourceType,
  FoundryDeploymentStatus,
  FoundryPageType,
  FoundryPermissionAction,
  FoundryQueryRuntime,
  FoundryRealtimeTopic,
  FoundryWidgetFamily,
  FoundryWorkspaceRole,
} from "./foundry-constants";

export interface FoundryWorkspace {
  workspaceId: string;
  organizationId: string;
  name: string;
  slug: string;
  defaultEnvironmentId: string;
  createdAt: string;
}

export interface FoundryUser {
  userId: string;
  workspaceId: string;
  name: string;
  email: string;
  role: FoundryWorkspaceRole;
  createdAt: string;
}

export interface FoundryApplication {
  applicationId: string;
  workspaceId: string;
  name: string;
  slug: string;
  state: FoundryApplicationState;
  createdAt: string;
  updatedAt: string;
}

export interface FoundryPage {
  pageId: string;
  applicationId: string;
  name: string;
  path: string;
  type: FoundryPageType;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoundryWidgetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FoundryWidget {
  widgetId: string;
  pageId: string;
  family: FoundryWidgetFamily;
  name: string;
  layout: FoundryWidgetLayout;
  properties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FoundryWidgetBinding {
  bindingId: string;
  widgetId: string;
  scope: FoundryBindingScope;
  expression: string;
  targetProperty: string;
  createdAt: string;
}

export interface FoundryDatasource {
  datasourceId: string;
  workspaceId: string;
  name: string;
  type: FoundryDatasourceType;
  environmentId: string;
  config: Record<string, unknown>;
  createdAt: string;
}

export interface FoundryQueryParameter {
  name: string;
  value?: unknown;
  defaultValue?: unknown;
}

export interface FoundryQuery {
  queryId: string;
  applicationId: string;
  datasourceId: string;
  name: string;
  runtime: FoundryQueryRuntime;
  body: string;
  parameters: FoundryQueryParameter[];
  createdAt: string;
  updatedAt: string;
}

export interface FoundryJavaScriptObject {
  javascriptObjectId: string;
  applicationId: string;
  name: string;
  source: string;
  actions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoundryTheme {
  themeId: string;
  applicationId: string;
  name: string;
  tokens: Record<string, string>;
  createdAt: string;
}

export interface FoundryEnvironment {
  environmentId: string;
  applicationId: string;
  name: string;
  slug: string;
  variables: Record<string, string>;
  createdAt: string;
}

export interface FoundryBranch {
  branchId: string;
  applicationId: string;
  name: string;
  baseBranchId?: string;
  status: FoundryBranchStatus;
  createdBy?: string;
  createdAt: string;
}

export interface FoundryDeployment {
  deploymentId: string;
  applicationId: string;
  branchId: string;
  environmentId: string;
  status: FoundryDeploymentStatus;
  createdAt: string;
  publishedAt?: string;
}

export interface FoundryPermissionGrant {
  permissionGrantId: string;
  workspaceId: string;
  principalId: string;
  action: FoundryPermissionAction;
  resourceId: string;
  createdAt: string;
}

export interface CustomWidgetPackage {
  customWidgetPackageId: string;
  packageName: string;
  version: string;
  runtimeEntry: string;
  editorEntry: string;
  allowedProperties: string[];
  createdAt: string;
}

export interface FoundryRealtimeEvent {
  eventId: string;
  workspaceId: string;
  applicationId: string;
  topic: FoundryRealtimeTopic;
  actorId?: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface FoundryApiRoute {
  resource: string;
  path: string;
  methods: string[];
  requiresAuth: boolean;
  seedable: boolean;
  actions?: string[];
}

export interface FoundryBenchmarkRoute {
  id: string;
  path: string;
  name: string;
  category: FoundryBenchmarkRouteCategory;
  requiredSeedKeys: string[];
}

type Input<T, TGenerated extends keyof T> = Omit<T, TGenerated> &
  Partial<Pick<T, TGenerated>>;

const stamp = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 10)}`;

export function createFoundryWorkspace(
  input: Input<FoundryWorkspace, "workspaceId" | "createdAt">
): FoundryWorkspace {
  return {
    workspaceId: input.workspaceId ?? id("ws_"),
    organizationId: input.organizationId,
    name: input.name,
    slug: input.slug,
    defaultEnvironmentId: input.defaultEnvironmentId,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryUser(
  input: Input<FoundryUser, "userId" | "createdAt">
): FoundryUser {
  return {
    userId: input.userId ?? id("user_"),
    workspaceId: input.workspaceId,
    name: input.name,
    email: input.email,
    role: input.role,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryApplication(
  input: Input<FoundryApplication, "applicationId" | "createdAt" | "updatedAt">
): FoundryApplication {
  const createdAt = input.createdAt ?? stamp();

  return {
    applicationId: input.applicationId ?? id("app_"),
    workspaceId: input.workspaceId,
    name: input.name,
    slug: input.slug,
    state: input.state,
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}

export function createFoundryPage(
  input: Input<FoundryPage, "pageId" | "createdAt" | "updatedAt">
): FoundryPage {
  const createdAt = input.createdAt ?? stamp();

  return {
    pageId: input.pageId ?? id("page_"),
    applicationId: input.applicationId,
    name: input.name,
    path: input.path,
    type: input.type,
    order: input.order,
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}

export function createFoundryWidget(
  input: Input<FoundryWidget, "widgetId" | "createdAt" | "updatedAt">
): FoundryWidget {
  const createdAt = input.createdAt ?? stamp();

  return {
    widgetId: input.widgetId ?? id("widget_"),
    pageId: input.pageId,
    family: input.family,
    name: input.name,
    layout: input.layout,
    properties: input.properties,
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}

export function createFoundryWidgetBinding(
  input: Input<FoundryWidgetBinding, "bindingId" | "createdAt">
): FoundryWidgetBinding {
  return {
    bindingId: input.bindingId ?? id("binding_"),
    widgetId: input.widgetId,
    scope: input.scope,
    expression: input.expression,
    targetProperty: input.targetProperty,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryDatasource(
  input: Input<FoundryDatasource, "datasourceId" | "createdAt">
): FoundryDatasource {
  return {
    datasourceId: input.datasourceId ?? id("ds_"),
    workspaceId: input.workspaceId,
    name: input.name,
    type: input.type,
    environmentId: input.environmentId,
    config: input.config,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryQuery(
  input: Input<FoundryQuery, "queryId" | "createdAt" | "updatedAt">
): FoundryQuery {
  const createdAt = input.createdAt ?? stamp();

  return {
    queryId: input.queryId ?? id("query_"),
    applicationId: input.applicationId,
    datasourceId: input.datasourceId,
    name: input.name,
    runtime: input.runtime,
    body: input.body,
    parameters: input.parameters,
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}

export function createFoundryJavaScriptObject(
  input: Input<
    FoundryJavaScriptObject,
    "javascriptObjectId" | "createdAt" | "updatedAt" | "actions"
  >
): FoundryJavaScriptObject {
  const createdAt = input.createdAt ?? stamp();

  return {
    javascriptObjectId: input.javascriptObjectId ?? id("js_"),
    applicationId: input.applicationId,
    name: input.name,
    source: input.source,
    actions: input.actions ?? [],
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}

export function createFoundryTheme(
  input: Input<FoundryTheme, "themeId" | "createdAt">
): FoundryTheme {
  return {
    themeId: input.themeId ?? id("theme_"),
    applicationId: input.applicationId,
    name: input.name,
    tokens: input.tokens,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryEnvironment(
  input: Input<FoundryEnvironment, "environmentId" | "createdAt">
): FoundryEnvironment {
  return {
    environmentId: input.environmentId ?? id("env_"),
    applicationId: input.applicationId,
    name: input.name,
    slug: input.slug,
    variables: input.variables,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryBranch(
  input: Input<FoundryBranch, "branchId" | "createdAt">
): FoundryBranch {
  return {
    branchId: input.branchId ?? id("branch_"),
    applicationId: input.applicationId,
    name: input.name,
    baseBranchId: input.baseBranchId,
    status: input.status,
    createdBy: input.createdBy,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryDeployment(
  input: Input<FoundryDeployment, "deploymentId" | "createdAt" | "publishedAt">
): FoundryDeployment {
  const createdAt = input.createdAt ?? stamp();

  return {
    deploymentId: input.deploymentId ?? id("deploy_"),
    applicationId: input.applicationId,
    branchId: input.branchId,
    environmentId: input.environmentId,
    status: input.status,
    createdAt,
    publishedAt: input.publishedAt ?? (input.status === "published" ? createdAt : undefined),
  };
}

export function createFoundryPermissionGrant(
  input: Input<FoundryPermissionGrant, "permissionGrantId" | "createdAt">
): FoundryPermissionGrant {
  return {
    permissionGrantId: input.permissionGrantId ?? id("perm_"),
    workspaceId: input.workspaceId,
    principalId: input.principalId,
    action: input.action,
    resourceId: input.resourceId,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryCustomWidgetPackage(
  input: Input<CustomWidgetPackage, "customWidgetPackageId" | "createdAt">
): CustomWidgetPackage {
  return {
    customWidgetPackageId: input.customWidgetPackageId ?? id("cwp_"),
    packageName: input.packageName,
    version: input.version,
    runtimeEntry: input.runtimeEntry,
    editorEntry: input.editorEntry,
    allowedProperties: input.allowedProperties,
    createdAt: input.createdAt ?? stamp(),
  };
}

export function createFoundryRealtimeEvent(
  input: Input<FoundryRealtimeEvent, "eventId" | "occurredAt">
): FoundryRealtimeEvent {
  return {
    eventId: input.eventId ?? id("event_"),
    workspaceId: input.workspaceId,
    applicationId: input.applicationId,
    topic: input.topic,
    actorId: input.actorId,
    payload: input.payload,
    occurredAt: input.occurredAt ?? stamp(),
  };
}

export function validateFoundryWorkspace(workspace: FoundryWorkspace): string[] {
  return requiredFields(workspace, [
    "workspaceId",
    "organizationId",
    "name",
    "slug",
    "defaultEnvironmentId",
    "createdAt",
  ]);
}

export function validateFoundryApplication(
  application: FoundryApplication
): string[] {
  return requiredFields(application, [
    "applicationId",
    "workspaceId",
    "name",
    "slug",
    "state",
    "createdAt",
    "updatedAt",
  ]);
}

export function validateFoundryDatasource(
  datasource: FoundryDatasource
): string[] {
  return requiredFields(datasource, [
    "datasourceId",
    "workspaceId",
    "name",
    "type",
    "environmentId",
    "config",
    "createdAt",
  ]);
}

function requiredFields<T extends object>(
  value: T,
  fields: Array<keyof T & string>
): string[] {
  const record = value as Record<keyof T & string, unknown>;

  return fields
    .filter((field) => !record[field])
    .map((field) => `${field} is required`);
}
