import { FOUNDRY_BENCHMARK_ROUTES } from "./foundry-benchmark-routes";
import type {
  CustomWidgetPackage,
  FoundryApplication,
  FoundryBranch,
  FoundryDatasource,
  FoundryDeployment,
  FoundryJavaScriptObject,
  FoundryPage,
  FoundryPermissionGrant,
  FoundryQuery,
  FoundryUser,
  FoundryWidget,
  FoundryWidgetBinding,
  FoundryWorkspace,
} from "./foundry-domain";

const SEED_AT = "2026-04-13T10:00:00.000Z";

export interface FoundryDatasourceCredential {
  credentialId: string;
  datasourceId: string;
  environmentId: string;
  secretRef: string;
  authType: "database-password" | "bearer-token";
  rotationReady: boolean;
}

export interface FoundrySchemaMetadata {
  datasourceId: string;
  schemaName: string;
  tables: Array<{
    tableName: string;
    columns: string[];
    primaryKey: string;
  }>;
}

export interface FoundryQueryTemplate extends FoundryQuery {
  safeToExecute: boolean;
  benchmarkFixtureKey: string;
}

export interface FoundryLayoutRegion {
  pageId: string;
  region: "header" | "body" | "modal-layer";
  columns: number;
  rowHeight: number;
}

export interface FoundryWidgetDefault {
  family: FoundryWidget["family"];
  properties: Record<string, unknown>;
}

export interface FoundryCrudFixture {
  fixtureId: string;
  datasourceId: string;
  tableName: string;
  primaryKey: string;
  rows: Array<Record<string, unknown>>;
}

export interface FoundryEventHandler {
  handlerId: string;
  widgetId: string;
  event: string;
  actions: string[];
}

export interface FoundryPublishedRuntimeSnapshot {
  snapshotId: string;
  deploymentId: string;
  applicationId: string;
  branchId: string;
  environmentId: string;
  path: string;
  pageIds: string[];
  safeQueryIds: string[];
  datasourceIds: string[];
  customWidgetPackageIds: string[];
  createdAt: string;
}

export interface FoundryBenchmarkEnvironment {
  workspace: FoundryWorkspace;
  editors: FoundryUser[];
  viewers: FoundryUser[];
  runtimeConsumers: FoundryUser[];
  application: FoundryApplication;
  pages: FoundryPage[];
  widgets: FoundryWidget[];
  datasources: FoundryDatasource[];
  datasourceCredentials: FoundryDatasourceCredential[];
  schemaMetadata: FoundrySchemaMetadata[];
  queryTemplates: FoundryQueryTemplate[];
  bindings: FoundryWidgetBinding[];
  javascriptObjects: FoundryJavaScriptObject[];
  permissions: FoundryPermissionGrant[];
  layoutRegions: FoundryLayoutRegion[];
  widgetDefaults: FoundryWidgetDefault[];
  crudFixtures: FoundryCrudFixture[];
  eventHandlers: FoundryEventHandler[];
  customWidgetPackages: CustomWidgetPackage[];
  branches: FoundryBranch[];
  deployments: FoundryDeployment[];
  publishedRuntimeSnapshot: FoundryPublishedRuntimeSnapshot;
  routes: typeof FOUNDRY_BENCHMARK_ROUTES;
  mutationLog: string[];
}

export interface FoundryBenchmarkSeedVerification {
  ready: boolean;
  checked: string[];
  errors: string[];
}

const TEMPLATE: FoundryBenchmarkEnvironment = {
  workspace: {
    workspaceId: "ws_foundry_benchmark",
    organizationId: "org_automium_benchmark",
    name: "Foundry Benchmark Workspace",
    slug: "foundry-benchmark",
    defaultEnvironmentId: "env_foundry_prod",
    createdAt: SEED_AT,
  },
  editors: [
    {
      userId: "user_foundry_ari",
      workspaceId: "ws_foundry_benchmark",
      name: "Ari Builder",
      email: "ari.builder@example.com",
      role: "editor",
      createdAt: SEED_AT,
    },
    {
      userId: "user_foundry_mina",
      workspaceId: "ws_foundry_benchmark",
      name: "Mina Builder",
      email: "mina.builder@example.com",
      role: "editor",
      createdAt: SEED_AT,
    },
  ],
  viewers: [
    {
      userId: "user_foundry_nora",
      workspaceId: "ws_foundry_benchmark",
      name: "Nora Viewer",
      email: "nora.viewer@example.com",
      role: "viewer",
      createdAt: SEED_AT,
    },
  ],
  runtimeConsumers: [
    {
      userId: "user_foundry_runtime",
      workspaceId: "ws_foundry_benchmark",
      name: "Runtime Consumer",
      email: "runtime.consumer@example.com",
      role: "runtime-consumer",
      createdAt: SEED_AT,
    },
  ],
  application: {
    applicationId: "app_foundry_orders",
    workspaceId: "ws_foundry_benchmark",
    name: "Orders Console",
    slug: "orders-console",
    state: "published",
    createdAt: SEED_AT,
    updatedAt: SEED_AT,
  },
  pages: [
    {
      pageId: "page_foundry_orders",
      applicationId: "app_foundry_orders",
      name: "Orders",
      path: "/orders",
      type: "canvas",
      order: 1,
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    {
      pageId: "page_foundry_order_detail",
      applicationId: "app_foundry_orders",
      name: "Order Detail",
      path: "/orders/:orderId",
      type: "canvas",
      order: 2,
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    {
      pageId: "page_foundry_success_modal",
      applicationId: "app_foundry_orders",
      name: "Success Modal",
      path: "/orders/success",
      type: "modal",
      order: 3,
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
  ],
  widgets: [
    {
      widgetId: "widget_foundry_orders_table",
      pageId: "page_foundry_orders",
      family: "table",
      name: "OrdersTable",
      layout: { x: 0, y: 4, width: 12, height: 8 },
      properties: {
        data: "{{queries.listOrders.data}}",
        selectedRow: "{{state.selectedOrder}}",
      },
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    {
      widgetId: "widget_foundry_order_form",
      pageId: "page_foundry_orders",
      family: "form",
      name: "OrderForm",
      layout: { x: 0, y: 13, width: 8, height: 8 },
      properties: {
        initialValues: "{{widgets.OrdersTable.selectedRow}}",
        submitQueryId: "query_foundry_update_order",
      },
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    {
      widgetId: "widget_foundry_submit_button",
      pageId: "page_foundry_orders",
      family: "button",
      name: "SaveOrderButton",
      layout: { x: 8, y: 19, width: 4, height: 2 },
      properties: {
        label: "Save order",
        onClick: "{{handlers.saveOrder}}",
      },
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    {
      widgetId: "widget_foundry_success_modal",
      pageId: "page_foundry_success_modal",
      family: "modal",
      name: "OrderSavedModal",
      layout: { x: 2, y: 2, width: 8, height: 6 },
      properties: {
        title: "Order saved",
        openWhen: "{{state.saveCompleted}}",
      },
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    {
      widgetId: "widget_foundry_order_card",
      pageId: "page_foundry_order_detail",
      family: "custom",
      name: "OrderCard",
      layout: { x: 0, y: 4, width: 6, height: 6 },
      properties: {
        packageId: "cwp_foundry_order_card",
        order: "{{queries.getOrder.data}}",
      },
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
  ],
  datasources: [
    {
      datasourceId: "ds_foundry_orders_postgres",
      workspaceId: "ws_foundry_benchmark",
      name: "Orders Postgres",
      type: "postgres",
      environmentId: "env_foundry_prod",
      config: {
        host: "postgres.benchmark.internal",
        database: "orders",
        ssl: true,
      },
      createdAt: SEED_AT,
    },
    {
      datasourceId: "ds_foundry_orders_mysql",
      workspaceId: "ws_foundry_benchmark",
      name: "Orders MySQL",
      type: "mysql",
      environmentId: "env_foundry_prod",
      config: {
        host: "mysql.benchmark.internal",
        database: "orders_archive",
      },
      createdAt: SEED_AT,
    },
    {
      datasourceId: "ds_foundry_orders_rest",
      workspaceId: "ws_foundry_benchmark",
      name: "Orders REST API",
      type: "rest-api",
      environmentId: "env_foundry_prod",
      config: {
        baseUrl: "https://orders.benchmark.automium.local",
        authType: "bearer",
      },
      createdAt: SEED_AT,
    },
  ],
  datasourceCredentials: [
    {
      credentialId: "cred_foundry_postgres_prod",
      datasourceId: "ds_foundry_orders_postgres",
      environmentId: "env_foundry_prod",
      secretRef: "secret://foundry/orders/postgres",
      authType: "database-password",
      rotationReady: true,
    },
    {
      credentialId: "cred_foundry_mysql_prod",
      datasourceId: "ds_foundry_orders_mysql",
      environmentId: "env_foundry_prod",
      secretRef: "secret://foundry/orders/mysql",
      authType: "database-password",
      rotationReady: true,
    },
    {
      credentialId: "cred_foundry_rest_prod",
      datasourceId: "ds_foundry_orders_rest",
      environmentId: "env_foundry_prod",
      secretRef: "secret://foundry/orders/rest-token",
      authType: "bearer-token",
      rotationReady: true,
    },
  ],
  schemaMetadata: [
    {
      datasourceId: "ds_foundry_orders_postgres",
      schemaName: "public",
      tables: [
        {
          tableName: "orders",
          columns: ["id", "status", "total", "customer_email", "updated_at"],
          primaryKey: "id",
        },
      ],
    },
    {
      datasourceId: "ds_foundry_orders_mysql",
      schemaName: "orders_archive",
      tables: [
        {
          tableName: "archived_orders",
          columns: ["id", "status", "archived_at"],
          primaryKey: "id",
        },
      ],
    },
    {
      datasourceId: "ds_foundry_orders_rest",
      schemaName: "api",
      tables: [
        {
          tableName: "/orders",
          columns: ["method", "path", "responseBinding"],
          primaryKey: "path",
        },
      ],
    },
  ],
  queryTemplates: [
    {
      queryId: "query_foundry_list_orders",
      applicationId: "app_foundry_orders",
      datasourceId: "ds_foundry_orders_postgres",
      name: "listOrders",
      runtime: "sql",
      body: "select id, status, total, customer_email from orders where status = :status",
      parameters: [{ name: "status", defaultValue: "open" }],
      safeToExecute: true,
      benchmarkFixtureKey: "orders-open",
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    {
      queryId: "query_foundry_update_order",
      applicationId: "app_foundry_orders",
      datasourceId: "ds_foundry_orders_postgres",
      name: "updateOrder",
      runtime: "sql",
      body: "update orders set status = :status where id = :id returning *",
      parameters: [
        { name: "id", defaultValue: "order_001" },
        { name: "status", defaultValue: "approved" },
      ],
      safeToExecute: true,
      benchmarkFixtureKey: "orders-update",
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
    {
      queryId: "query_foundry_get_order",
      applicationId: "app_foundry_orders",
      datasourceId: "ds_foundry_orders_rest",
      name: "getOrder",
      runtime: "rest",
      body: "GET /orders/{{page.params.orderId}}",
      parameters: [{ name: "orderId", defaultValue: "order_001" }],
      safeToExecute: true,
      benchmarkFixtureKey: "orders-detail",
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
  ],
  bindings: [
    {
      bindingId: "binding_foundry_table_data",
      widgetId: "widget_foundry_orders_table",
      scope: "query",
      expression: "{{queries.listOrders.data}}",
      targetProperty: "data",
      createdAt: SEED_AT,
    },
    {
      bindingId: "binding_foundry_form_values",
      widgetId: "widget_foundry_order_form",
      scope: "widget",
      expression: "{{widgets.OrdersTable.selectedRow}}",
      targetProperty: "initialValues",
      createdAt: SEED_AT,
    },
    {
      bindingId: "binding_foundry_custom_order",
      widgetId: "widget_foundry_order_card",
      scope: "query",
      expression: "{{queries.getOrder.data}}",
      targetProperty: "order",
      createdAt: SEED_AT,
    },
  ],
  javascriptObjects: [
    {
      javascriptObjectId: "js_foundry_order_helpers",
      applicationId: "app_foundry_orders",
      name: "OrderHelpers",
      source:
        "export default { formatCurrency: (value) => `$${value}`, isApprovalReady: (order) => order.status === 'open' }",
      actions: ["formatCurrency", "isApprovalReady"],
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
  ],
  permissions: [
    {
      permissionGrantId: "perm_foundry_editor_publish",
      workspaceId: "ws_foundry_benchmark",
      principalId: "user_foundry_ari",
      action: "deployment.publish",
      resourceId: "app_foundry_orders",
      createdAt: SEED_AT,
    },
    {
      permissionGrantId: "perm_foundry_viewer_app",
      workspaceId: "ws_foundry_benchmark",
      principalId: "user_foundry_nora",
      action: "application.view",
      resourceId: "app_foundry_orders",
      createdAt: SEED_AT,
    },
    {
      permissionGrantId: "perm_foundry_runtime_view",
      workspaceId: "ws_foundry_benchmark",
      principalId: "user_foundry_runtime",
      action: "runtime.view",
      resourceId: "deploy_foundry_orders_prod",
      createdAt: SEED_AT,
    },
  ],
  layoutRegions: [
    {
      pageId: "page_foundry_orders",
      region: "header",
      columns: 12,
      rowHeight: 8,
    },
    {
      pageId: "page_foundry_orders",
      region: "body",
      columns: 12,
      rowHeight: 8,
    },
    {
      pageId: "page_foundry_orders",
      region: "modal-layer",
      columns: 12,
      rowHeight: 8,
    },
  ],
  widgetDefaults: [
    {
      family: "table",
      properties: {
        pageSize: 25,
        rowSelection: "single",
      },
    },
    {
      family: "form",
      properties: {
        submitLabel: "Save",
      },
    },
    {
      family: "custom",
      properties: {
        sandboxed: true,
      },
    },
  ],
  crudFixtures: [
    {
      fixtureId: "crud_foundry_orders",
      datasourceId: "ds_foundry_orders_postgres",
      tableName: "orders",
      primaryKey: "id",
      rows: [
        {
          id: "order_001",
          status: "open",
          total: 42,
          customer_email: "customer.one@example.com",
        },
        {
          id: "order_002",
          status: "approved",
          total: 108,
          customer_email: "customer.two@example.com",
        },
      ],
    },
  ],
  eventHandlers: [
    {
      handlerId: "handler_foundry_save_order",
      widgetId: "widget_foundry_submit_button",
      event: "onClick",
      actions: [
        "query_foundry_update_order",
        "state.saveCompleted=true",
        "modal.open:widget_foundry_success_modal",
      ],
    },
    {
      handlerId: "handler_foundry_row_selected",
      widgetId: "widget_foundry_orders_table",
      event: "onRowSelected",
      actions: ["state.selectedOrder={{widgets.OrdersTable.selectedRow}}"],
    },
  ],
  customWidgetPackages: [
    {
      customWidgetPackageId: "cwp_foundry_order_card",
      packageName: "@automium/foundry-order-card",
      version: "1.0.0",
      runtimeEntry: "/widgets/order-card/runtime.js",
      editorEntry: "/widgets/order-card/editor.js",
      allowedProperties: ["order", "onApprove"],
      createdAt: SEED_AT,
    },
  ],
  branches: [
    {
      branchId: "branch_foundry_main",
      applicationId: "app_foundry_orders",
      name: "main",
      status: "active",
      createdBy: "user_foundry_ari",
      createdAt: SEED_AT,
    },
    {
      branchId: "branch_foundry_orders_crud",
      applicationId: "app_foundry_orders",
      name: "feature/orders-crud",
      baseBranchId: "branch_foundry_main",
      status: "active",
      createdBy: "user_foundry_mina",
      createdAt: SEED_AT,
    },
  ],
  deployments: [
    {
      deploymentId: "deploy_foundry_orders_prod",
      applicationId: "app_foundry_orders",
      branchId: "branch_foundry_main",
      environmentId: "env_foundry_prod",
      status: "published",
      createdAt: SEED_AT,
      publishedAt: SEED_AT,
    },
  ],
  publishedRuntimeSnapshot: {
    snapshotId: "snapshot_foundry_orders_prod",
    deploymentId: "deploy_foundry_orders_prod",
    applicationId: "app_foundry_orders",
    branchId: "branch_foundry_main",
    environmentId: "env_foundry_prod",
    path: "/foundry/runtime/app_foundry_orders",
    pageIds: ["page_foundry_orders", "page_foundry_order_detail"],
    safeQueryIds: [
      "query_foundry_list_orders",
      "query_foundry_update_order",
      "query_foundry_get_order",
    ],
    datasourceIds: [
      "ds_foundry_orders_postgres",
      "ds_foundry_orders_mysql",
      "ds_foundry_orders_rest",
    ],
    customWidgetPackageIds: ["cwp_foundry_order_card"],
    createdAt: SEED_AT,
  },
  routes: FOUNDRY_BENCHMARK_ROUTES,
  mutationLog: [],
};

let currentEnvironment = cloneEnvironment(TEMPLATE);

export function seedFoundryBenchmarkEnvironment(): FoundryBenchmarkEnvironment {
  currentEnvironment = cloneEnvironment(TEMPLATE);
  return cloneEnvironment(currentEnvironment);
}

export function resetFoundryBenchmarkEnvironment(): FoundryBenchmarkEnvironment {
  currentEnvironment = cloneEnvironment(TEMPLATE);
  return cloneEnvironment(currentEnvironment);
}

export function verifyFoundryBenchmarkSeed(
  environment: FoundryBenchmarkEnvironment
): FoundryBenchmarkSeedVerification {
  const checked = [
    "workspace-users",
    "datasource-credentials",
    "schema-metadata",
    "query-bindings",
    "published-runtime",
  ];
  const errors: string[] = [];

  const users = [
    ...environment.editors,
    ...environment.viewers,
    ...environment.runtimeConsumers,
  ];

  if (!environment.workspace.workspaceId || users.length < 4) {
    errors.push("workspace-users");
  }

  const datasourceIds = new Set(
    environment.datasources.map((datasource) => datasource.datasourceId)
  );
  const credentialDatasourceIds = new Set(
    environment.datasourceCredentials.map((credential) => credential.datasourceId)
  );
  const schemaDatasourceIds = new Set(
    environment.schemaMetadata.map((schema) => schema.datasourceId)
  );

  if (
    environment.datasources.length < 3 ||
    [...datasourceIds].some((datasourceId) => !credentialDatasourceIds.has(datasourceId))
  ) {
    errors.push("datasource-credentials");
  }

  if (
    environment.schemaMetadata.length === 0 ||
    [...datasourceIds].some((datasourceId) => !schemaDatasourceIds.has(datasourceId))
  ) {
    errors.push("schema-metadata");
  }

  const widgetIds = new Set(environment.widgets.map((widget) => widget.widgetId));

  if (
    environment.queryTemplates.length === 0 ||
    environment.bindings.length === 0 ||
    environment.bindings.some((binding) => !widgetIds.has(binding.widgetId))
  ) {
    errors.push("query-bindings");
  }

  const deployment = environment.deployments.find(
    (item) => item.deploymentId === environment.publishedRuntimeSnapshot.deploymentId
  );

  if (
    !deployment ||
    deployment.status !== "published" ||
    !environment.publishedRuntimeSnapshot.path.startsWith("/foundry/runtime/") ||
    environment.publishedRuntimeSnapshot.safeQueryIds.length === 0
  ) {
    errors.push("published-runtime");
  }

  return {
    ready: errors.length === 0,
    checked,
    errors,
  };
}

function cloneEnvironment(
  environment: FoundryBenchmarkEnvironment
): FoundryBenchmarkEnvironment {
  return JSON.parse(JSON.stringify(environment)) as FoundryBenchmarkEnvironment;
}
