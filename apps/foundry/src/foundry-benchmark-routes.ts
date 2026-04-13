import type { FoundryBenchmarkRoute } from "./foundry-domain";

const WORKSPACE_ID = "ws_foundry_benchmark";
const APPLICATION_ID = "app_foundry_orders";
const PAGE_ORDERS_ID = "page_foundry_orders";
const DATASOURCE_POSTGRES_ID = "ds_foundry_orders_postgres";
const QUERY_LIST_ORDERS_ID = "query_foundry_list_orders";
const JAVASCRIPT_OBJECT_ID = "js_foundry_order_helpers";
const CUSTOM_WIDGET_PACKAGE_ID = "cwp_foundry_order_card";
const BRANCH_ID = "branch_foundry_main";
const DEPLOYMENT_ID = "deploy_foundry_orders_prod";

export type FoundryBenchmarkRouteId =
  | "builder-home"
  | "datasource-configuration"
  | "query-editor"
  | "page-builder"
  | "crud-workspace"
  | "logic-editor"
  | "custom-widget-management"
  | "branch-publish-runtime";

export type FoundryBenchmarkJourneyRoute = FoundryBenchmarkRoute & {
  id: FoundryBenchmarkRouteId;
};

export const FOUNDRY_BENCHMARK_ROUTES: readonly FoundryBenchmarkJourneyRoute[] = [
  {
    id: "builder-home",
    path: `/foundry/workspaces/${WORKSPACE_ID}/applications/${APPLICATION_ID}`,
    name: "Builder home",
    category: "builder",
    requiredSeedKeys: ["workspace", "editors", "application", "pages"],
  },
  {
    id: "datasource-configuration",
    path: `/foundry/workspaces/${WORKSPACE_ID}/datasources/${DATASOURCE_POSTGRES_ID}/configuration`,
    name: "Datasource configuration",
    category: "datasource",
    requiredSeedKeys: [
      "datasources",
      "datasourceCredentials",
      "schemaMetadata",
    ],
  },
  {
    id: "query-editor",
    path: `/foundry/applications/${APPLICATION_ID}/queries/${QUERY_LIST_ORDERS_ID}`,
    name: "Query editor",
    category: "query",
    requiredSeedKeys: ["queryTemplates", "datasources", "bindings"],
  },
  {
    id: "page-builder",
    path: `/foundry/applications/${APPLICATION_ID}/pages/${PAGE_ORDERS_ID}/builder`,
    name: "Page builder",
    category: "builder",
    requiredSeedKeys: ["pages", "widgets", "layoutRegions", "widgetDefaults"],
  },
  {
    id: "crud-workspace",
    path: `/foundry/applications/${APPLICATION_ID}/pages/${PAGE_ORDERS_ID}/crud`,
    name: "CRUD workspace",
    category: "builder",
    requiredSeedKeys: ["crudFixtures", "widgets", "queryTemplates", "bindings"],
  },
  {
    id: "logic-editor",
    path: `/foundry/applications/${APPLICATION_ID}/javascript/${JAVASCRIPT_OBJECT_ID}`,
    name: "Logic editor",
    category: "query",
    requiredSeedKeys: ["javascriptObjects", "eventHandlers", "queryTemplates"],
  },
  {
    id: "custom-widget-management",
    path: `/foundry/applications/${APPLICATION_ID}/custom-widgets/${CUSTOM_WIDGET_PACKAGE_ID}`,
    name: "Custom widget management",
    category: "builder",
    requiredSeedKeys: ["customWidgetPackages", "widgets", "eventHandlers"],
  },
  {
    id: "branch-publish-runtime",
    path: `/foundry/applications/${APPLICATION_ID}/branches/${BRANCH_ID}/deployments/${DEPLOYMENT_ID}`,
    name: "Branch publish and runtime",
    category: "publish",
    requiredSeedKeys: [
      "branches",
      "deployments",
      "publishedRuntimeSnapshot",
      "runtimeConsumers",
    ],
  },
];
