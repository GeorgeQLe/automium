import { describe, expect, it } from "vitest";

async function loadFoundryDatasources() {
  try {
    return await import("../src/foundry-datasources");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-datasources.ts to define datasource configuration helpers for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryQueries() {
  try {
    return await import("../src/foundry-queries");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-queries.ts to define query execution helpers for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryDatasourceAdapters() {
  try {
    return await import("../src/foundry-datasource-adapters");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-datasource-adapters.ts to define Postgres, MySQL, and REST adapters for Phase 6.",
      { cause: error }
    );
  }
}

describe("foundry datasources contract", () => {
  it("datasource factories support Postgres, MySQL, and REST API configuration", async () => {
    const mod = await loadFoundryDatasources();
    const postgres = mod.createFoundryDatasource({
      workspaceId: "ws_foundry",
      name: "Orders Postgres",
      type: "postgres",
      environmentId: "env_dev",
      config: { host: "postgres.local", database: "orders", ssl: true },
    });
    const mysql = mod.createFoundryDatasource({
      workspaceId: "ws_foundry",
      name: "Orders MySQL",
      type: "mysql",
      environmentId: "env_dev",
      config: { host: "mysql.local", database: "orders" },
    });
    const rest = mod.createFoundryDatasource({
      workspaceId: "ws_foundry",
      name: "Orders REST",
      type: "rest-api",
      environmentId: "env_dev",
      config: { baseUrl: "https://api.example.com", authType: "bearer" },
    });

    expect(postgres.type).toBe("postgres");
    expect(postgres.config.ssl).toBe(true);
    expect(mysql.type).toBe("mysql");
    expect(rest.type).toBe("rest-api");
    expect(rest.config.authType).toBe("bearer");
  });

  it("adapter registry exposes schema introspection and normalized execution for supported sources", async () => {
    const mod = await loadFoundryDatasourceAdapters();
    const registry = mod.createFoundryDatasourceAdapterRegistry();

    expect(registry.supportedTypes).toEqual(["postgres", "mysql", "rest-api"]);

    for (const type of registry.supportedTypes) {
      const adapter = registry.getAdapter(type);
      expect(adapter.type).toBe(type);
      expect(typeof adapter.testConnection).toBe("function");
      expect(typeof adapter.introspectSchema).toBe("function");
      expect(typeof adapter.execute).toBe("function");
    }
  });

  it("SQL adapters parameterize query execution and normalize tabular results", async () => {
    const mod = await loadFoundryDatasourceAdapters();
    const registry = mod.createFoundryDatasourceAdapterRegistry();
    const postgres = registry.getAdapter("postgres");
    const result = await postgres.execute({
      datasourceId: "ds_orders",
      body: "select * from orders where status = :status",
      parameters: [{ name: "status", value: "open" }],
    });

    expect(result.datasourceId).toBe("ds_orders");
    expect(result.columns).toEqual(expect.arrayContaining(["id", "status"]));
    expect(result.rows).toEqual(expect.any(Array));
    expect(result.normalizedAt).toBeTruthy();
    expect(result.parameterized).toBe(true);
  });

  it("REST adapter preserves request configuration, auth metadata, and response bindings", async () => {
    const mod = await loadFoundryDatasourceAdapters();
    const registry = mod.createFoundryDatasourceAdapterRegistry();
    const rest = registry.getAdapter("rest-api");
    const result = await rest.execute({
      datasourceId: "ds_rest_orders",
      method: "GET",
      path: "/orders",
      headers: { Authorization: "Bearer {{env.ORDERS_TOKEN}}" },
      responseBinding: "orders",
    });

    expect(result.datasourceId).toBe("ds_rest_orders");
    expect(result.method).toBe("GET");
    expect(result.responseBinding).toBe("orders");
    expect(result.authMetadata.type).toBe("bearer");
    expect(result.normalizedBody).toBeTruthy();
  });

  it("queries bind datasource results into widget expressions", async () => {
    const mod = await loadFoundryQueries();
    const query = mod.createFoundryQuery({
      applicationId: "app_orders",
      datasourceId: "ds_orders",
      name: "listOrders",
      runtime: "sql",
      body: "select * from orders",
      parameters: [],
    });
    const execution = mod.executeFoundryQuery(query, {
      rows: [{ id: "order_1", status: "open" }],
      columns: ["id", "status"],
    });
    const binding = mod.bindFoundryQueryResult(execution, {
      widgetId: "widget_orders_table",
      targetProperty: "data",
    });

    expect(query.queryId).toBeTruthy();
    expect(execution.queryId).toBe(query.queryId);
    expect(execution.data).toEqual([{ id: "order_1", status: "open" }]);
    expect(binding.expression).toBe(`{{queries.${query.name}.data}}`);
    expect(binding.targetProperty).toBe("data");
  });
});
