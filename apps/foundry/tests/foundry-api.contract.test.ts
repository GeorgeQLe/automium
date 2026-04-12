import { describe, expect, it } from "vitest";

async function loadFoundryApiRoutes() {
  try {
    return await import("../src/foundry-api-routes");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-api-routes.ts to define the Foundry API route manifest for Phase 6.",
      { cause: error }
    );
  }
}

describe("foundry API contract", () => {
  it("FOUNDRY_API_ROUTES manifest covers major app-builder resources", async () => {
    const mod = await loadFoundryApiRoutes();

    expect(mod.FOUNDRY_API_ROUTES).toHaveLength(13);
  });

  it("each route has resource, path, methods, auth, and benchmark seedability flags", async () => {
    const mod = await loadFoundryApiRoutes();

    for (const route of mod.FOUNDRY_API_ROUTES) {
      expect(route.resource).toBeTruthy();
      expect(route.path).toMatch(/^\/api\/foundry\//);
      expect(route.methods.length).toBeGreaterThan(0);
      expect(typeof route.requiresAuth).toBe("boolean");
      expect(typeof route.seedable).toBe("boolean");
    }
  });

  it("route manifest includes all frozen major resources", async () => {
    const mod = await loadFoundryApiRoutes();
    const resources = mod.FOUNDRY_API_ROUTES.map(
      (route: { resource: string }) => route.resource
    );

    const expectedResources = [
      "workspaces",
      "applications",
      "pages",
      "widgets",
      "datasources",
      "queries",
      "javascript-objects",
      "bindings",
      "branches",
      "deployments",
      "permissions",
      "publish-metadata",
      "custom-widgets",
    ];

    for (const resource of expectedResources) {
      expect(resources).toContain(resource);
    }
  });

  it("builder resources expose scriptable CRUD and ordering actions", async () => {
    const mod = await loadFoundryApiRoutes();
    const pages = mod.FOUNDRY_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "pages"
    )!;
    const widgets = mod.FOUNDRY_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "widgets"
    )!;

    expect(pages.methods).toEqual(expect.arrayContaining(["GET", "POST", "PATCH"]));
    expect(pages.actions).toEqual(expect.arrayContaining(["reorder", "set-home"]));
    expect(widgets.methods).toEqual(
      expect.arrayContaining(["GET", "POST", "PATCH", "DELETE"])
    );
    expect(widgets.actions).toEqual(
      expect.arrayContaining(["move", "resize", "bind-property"])
    );
  });

  it("datasource and query routes expose execution and schema actions", async () => {
    const mod = await loadFoundryApiRoutes();
    const datasources = mod.FOUNDRY_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "datasources"
    )!;
    const queries = mod.FOUNDRY_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "queries"
    )!;

    expect(datasources.actions).toEqual(
      expect.arrayContaining(["test-connection", "introspect-schema"])
    );
    expect(queries.methods).toEqual(expect.arrayContaining(["GET", "POST", "PATCH"]));
    expect(queries.actions).toEqual(expect.arrayContaining(["execute", "preview"]));
  });

  it("branch and deployment routes preserve publish/runtime split", async () => {
    const mod = await loadFoundryApiRoutes();
    const branches = mod.FOUNDRY_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "branches"
    )!;
    const deployments = mod.FOUNDRY_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "deployments"
    )!;
    const publishMetadata = mod.FOUNDRY_API_ROUTES.find(
      (route: { resource: string }) => route.resource === "publish-metadata"
    )!;

    expect(branches.actions).toEqual(
      expect.arrayContaining(["create-branch", "compare", "merge", "restore"])
    );
    expect(deployments.actions).toEqual(
      expect.arrayContaining(["publish", "rollback", "promote"])
    );
    expect(publishMetadata.actions).toEqual(
      expect.arrayContaining(["share", "runtime-bootstrap"])
    );
  });
});
