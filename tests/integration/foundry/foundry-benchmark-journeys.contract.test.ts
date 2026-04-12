import { describe, expect, it } from "vitest";

async function loadFoundryBenchmarkRoutes() {
  try {
    return await import("../../../apps/foundry/src/foundry-benchmark-routes");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-benchmark-routes.ts to define benchmark routes for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundrySeed() {
  try {
    return await import("../../../apps/foundry/src/foundry-seed");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-seed.ts to define deterministic builder/runtime seed and reset hooks for Phase 6.",
      { cause: error }
    );
  }
}

describe("foundry benchmark journeys contract", () => {
  it("FOUNDRY_BENCHMARK_ROUTES covers stable builder and runtime URLs", async () => {
    const mod = await loadFoundryBenchmarkRoutes();

    expect(mod.FOUNDRY_BENCHMARK_ROUTES).toHaveLength(8);

    const routeIds = mod.FOUNDRY_BENCHMARK_ROUTES.map(
      (route: { id: string }) => route.id
    );

    expect(routeIds).toEqual([
      "builder-home",
      "datasource-configuration",
      "query-editor",
      "page-builder",
      "crud-workspace",
      "logic-editor",
      "custom-widget-management",
      "branch-publish-runtime",
    ]);
  });

  it("all benchmark routes expose stable Foundry paths and seed keys", async () => {
    const mod = await loadFoundryBenchmarkRoutes();

    for (const route of mod.FOUNDRY_BENCHMARK_ROUTES) {
      expect(route.path).toMatch(/^\/foundry\//);
      expect(route.name).toBeTruthy();
      expect(route.category).toMatch(/^(builder|datasource|query|runtime|publish)$/);
      expect(route.requiredSeedKeys.length).toBeGreaterThan(0);
    }
  });

  it("seedFoundryBenchmarkEnvironment() returns deterministic builder fixtures", async () => {
    const mod = await loadFoundrySeed();
    const env = mod.seedFoundryBenchmarkEnvironment();

    expect(env.workspace.workspaceId).toBeTruthy();
    expect(env.editors.length).toBeGreaterThanOrEqual(2);
    expect(env.viewers.length).toBeGreaterThanOrEqual(1);
    expect(env.runtimeConsumers.length).toBeGreaterThanOrEqual(1);
    expect(env.application.applicationId).toBeTruthy();
    expect(env.pages.length).toBeGreaterThan(0);
    expect(env.widgets.map((widget: { family: string }) => widget.family)).toEqual(
      expect.arrayContaining(["table", "form", "button", "modal", "custom"])
    );
  });

  it("seed includes datasource credentials, schemas, queries, bindings, and JavaScript logic", async () => {
    const mod = await loadFoundrySeed();
    const env = mod.seedFoundryBenchmarkEnvironment();

    expect(env.datasources.map((source: { type: string }) => source.type)).toEqual(
      expect.arrayContaining(["postgres", "mysql", "rest-api"])
    );
    expect(env.datasourceCredentials.length).toBeGreaterThan(0);
    expect(env.schemaMetadata.length).toBeGreaterThan(0);
    expect(env.queryTemplates.length).toBeGreaterThan(0);
    expect(env.bindings.length).toBeGreaterThan(0);
    expect(env.javascriptObjects.length).toBeGreaterThan(0);
  });

  it("seed includes custom widget, branch, deployment, and published runtime snapshot metadata", async () => {
    const mod = await loadFoundrySeed();
    const env = mod.seedFoundryBenchmarkEnvironment();

    expect(env.customWidgetPackages.length).toBeGreaterThan(0);
    expect(env.branches.length).toBeGreaterThan(0);
    expect(env.deployments.length).toBeGreaterThan(0);
    expect(env.publishedRuntimeSnapshot.snapshotId).toBeTruthy();
    expect(env.publishedRuntimeSnapshot.path).toMatch(/^\/foundry\/runtime\//);
  });

  it("resetFoundryBenchmarkEnvironment() clears mutations and rebuilds publish-ready state", async () => {
    const mod = await loadFoundrySeed();
    const first = mod.seedFoundryBenchmarkEnvironment();
    const reset = mod.resetFoundryBenchmarkEnvironment();

    expect(reset.workspace.workspaceId).toBe(first.workspace.workspaceId);
    expect(reset.application.applicationId).toBe(first.application.applicationId);
    expect(reset.publishedRuntimeSnapshot.snapshotId).toBe(
      first.publishedRuntimeSnapshot.snapshotId
    );
    expect(reset.mutationLog).toEqual([]);
  });

  it("verifyFoundryBenchmarkSeed() checks datasource, publish, and runtime readiness", async () => {
    const mod = await loadFoundrySeed();
    const env = mod.seedFoundryBenchmarkEnvironment();
    const result = mod.verifyFoundryBenchmarkSeed(env);

    expect(result.ready).toBe(true);
    expect(result.checked).toEqual(
      expect.arrayContaining([
        "workspace-users",
        "datasource-credentials",
        "schema-metadata",
        "query-bindings",
        "published-runtime",
      ])
    );
    expect(result.errors).toEqual([]);
  });
});
