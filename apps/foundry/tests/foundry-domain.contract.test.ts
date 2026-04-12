import { describe, expect, it } from "vitest";

async function loadFoundryConstants() {
  try {
    return await import("../src/foundry-constants");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-constants.ts to define frozen Foundry constants for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryDomain() {
  try {
    return await import("../src/foundry-domain");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-domain.ts to define Foundry domain interfaces and factories for Phase 6.",
      { cause: error }
    );
  }
}

describe("foundry domain contract", () => {
  it("frozen constants cover app-builder resources and lifecycle states", async () => {
    const mod = await loadFoundryConstants();

    expect(mod.FOUNDRY_WORKSPACE_ROLES).toEqual([
      "owner",
      "admin",
      "editor",
      "viewer",
      "runtime-consumer",
    ]);
    expect(mod.FOUNDRY_APPLICATION_STATES).toEqual([
      "draft",
      "published",
      "archived",
    ]);
    expect(mod.FOUNDRY_PAGE_TYPES).toEqual(["canvas", "modal", "tab", "form"]);
    expect(mod.FOUNDRY_WIDGET_FAMILIES).toEqual([
      "table",
      "form",
      "button",
      "modal",
      "navigation",
      "chart",
      "custom",
    ]);
    expect(mod.FOUNDRY_DATASOURCE_TYPES).toEqual([
      "postgres",
      "mysql",
      "rest-api",
    ]);
    expect(mod.FOUNDRY_QUERY_RUNTIMES).toEqual(["sql", "rest", "javascript"]);
    expect(mod.FOUNDRY_BINDING_SCOPES).toEqual([
      "widget",
      "page",
      "app",
      "query",
      "state",
    ]);
    expect(mod.FOUNDRY_BRANCH_STATUSES).toEqual(["active", "merged", "archived"]);
    expect(mod.FOUNDRY_DEPLOYMENT_STATUSES).toEqual([
      "draft",
      "published",
      "failed",
      "rolled-back",
    ]);
    expect(mod.FOUNDRY_PERMISSION_ACTIONS).toEqual(
      expect.arrayContaining([
        "workspace.manage",
        "application.edit",
        "datasource.execute",
        "deployment.publish",
        "runtime.view",
      ])
    );
  });

  it("createFoundryWorkspace() and createFoundryUser() preserve tenancy identity", async () => {
    const mod = await loadFoundryDomain();
    const workspace = mod.createFoundryWorkspace({
      organizationId: "org_automium",
      name: "Builder Benchmarks",
      slug: "builder-benchmarks",
      defaultEnvironmentId: "env_dev",
    });
    const user = mod.createFoundryUser({
      workspaceId: workspace.workspaceId,
      name: "Ari Editor",
      email: "ari@example.com",
      role: "editor",
    });

    expect(workspace.workspaceId).toBeTruthy();
    expect(workspace.organizationId).toBe("org_automium");
    expect(workspace.slug).toBe("builder-benchmarks");
    expect(workspace.defaultEnvironmentId).toBe("env_dev");
    expect(workspace.createdAt).toBeTruthy();

    expect(user.userId).toBeTruthy();
    expect(user.workspaceId).toBe(workspace.workspaceId);
    expect(user.email).toBe("ari@example.com");
    expect(user.role).toBe("editor");
    expect(user.createdAt).toBeTruthy();
  });

  it("creates applications, pages, widgets, bindings, themes, and environments", async () => {
    const mod = await loadFoundryDomain();
    const application = mod.createFoundryApplication({
      workspaceId: "ws_foundry",
      name: "Orders Console",
      slug: "orders-console",
      state: "draft",
    });
    const page = mod.createFoundryPage({
      applicationId: application.applicationId,
      name: "Orders",
      path: "/orders",
      type: "canvas",
      order: 1,
    });
    const widget = mod.createFoundryWidget({
      pageId: page.pageId,
      family: "table",
      name: "OrdersTable",
      layout: { x: 0, y: 0, width: 12, height: 8 },
      properties: { data: "{{queries.listOrders.data}}" },
    });
    const binding = mod.createFoundryWidgetBinding({
      widgetId: widget.widgetId,
      scope: "query",
      expression: "{{queries.listOrders.data}}",
      targetProperty: "data",
    });
    const theme = mod.createFoundryTheme({
      applicationId: application.applicationId,
      name: "Benchmark Light",
      tokens: { colorPrimary: "#006adc" },
    });
    const environment = mod.createFoundryEnvironment({
      applicationId: application.applicationId,
      name: "Development",
      slug: "dev",
      variables: { API_BASE_URL: "https://api.example.com" },
    });

    expect(application.applicationId).toBeTruthy();
    expect(application.workspaceId).toBe("ws_foundry");
    expect(page.applicationId).toBe(application.applicationId);
    expect(page.type).toBe("canvas");
    expect(widget.pageId).toBe(page.pageId);
    expect(widget.family).toBe("table");
    expect(widget.layout.width).toBe(12);
    expect(binding.targetProperty).toBe("data");
    expect(theme.tokens.colorPrimary).toBe("#006adc");
    expect(environment.slug).toBe("dev");
  });

  it("creates datasources, queries, JavaScript objects, branches, deployments, and permissions", async () => {
    const mod = await loadFoundryDomain();
    const datasource = mod.createFoundryDatasource({
      workspaceId: "ws_foundry",
      name: "Orders Postgres",
      type: "postgres",
      environmentId: "env_dev",
      config: { host: "db.local", database: "orders" },
    });
    const query = mod.createFoundryQuery({
      applicationId: "app_orders",
      datasourceId: datasource.datasourceId,
      name: "listOrders",
      runtime: "sql",
      body: "select * from orders limit 25",
      parameters: [],
    });
    const jsObject = mod.createFoundryJavaScriptObject({
      applicationId: "app_orders",
      name: "OrderHelpers",
      source: "export default { formatCurrency: (value) => value }",
    });
    const branch = mod.createFoundryBranch({
      applicationId: "app_orders",
      name: "feature/crud-table",
      baseBranchId: "branch_main",
      status: "active",
    });
    const deployment = mod.createFoundryDeployment({
      applicationId: "app_orders",
      branchId: branch.branchId,
      environmentId: "env_prod",
      status: "published",
    });
    const permission = mod.createFoundryPermissionGrant({
      workspaceId: "ws_foundry",
      principalId: "user_ari",
      action: "deployment.publish",
      resourceId: deployment.deploymentId,
    });

    expect(datasource.datasourceId).toBeTruthy();
    expect(datasource.type).toBe("postgres");
    expect(query.queryId).toBeTruthy();
    expect(query.runtime).toBe("sql");
    expect(jsObject.javascriptObjectId).toBeTruthy();
    expect(branch.status).toBe("active");
    expect(deployment.status).toBe("published");
    expect(permission.action).toBe("deployment.publish");
  });

  it("validators catch missing required fields across major resources", async () => {
    const mod = await loadFoundryDomain();

    const workspaceErrors = mod.validateFoundryWorkspace({
      workspaceId: "",
      organizationId: "",
      name: "",
      slug: "",
      defaultEnvironmentId: "",
      createdAt: "",
    });
    const applicationErrors = mod.validateFoundryApplication({
      applicationId: "",
      workspaceId: "",
      name: "",
      slug: "",
      state: "draft",
      createdAt: "",
      updatedAt: "",
    });
    const datasourceErrors = mod.validateFoundryDatasource({
      datasourceId: "",
      workspaceId: "",
      name: "",
      type: "postgres",
      environmentId: "",
      config: {},
      createdAt: "",
    });

    expect(workspaceErrors).toContain("workspaceId is required");
    expect(workspaceErrors).toContain("organizationId is required");
    expect(workspaceErrors).toContain("name is required");
    expect(applicationErrors).toContain("applicationId is required");
    expect(applicationErrors).toContain("workspaceId is required");
    expect(applicationErrors).toContain("name is required");
    expect(datasourceErrors).toContain("datasourceId is required");
    expect(datasourceErrors).toContain("workspaceId is required");
    expect(datasourceErrors).toContain("name is required");
  });
});
