import { describe, expect, it } from "vitest";

async function loadFoundryPublishing() {
  try {
    return await import("../src/foundry-publishing");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-publishing.ts to define publish/share flows for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryRuntime() {
  try {
    return await import("../src/foundry-runtime");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-runtime.ts to define runtime loading metadata for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryDeployments() {
  try {
    return await import("../src/foundry-deployments");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-deployments.ts to define deployment lifecycle helpers for Phase 6.",
      { cause: error }
    );
  }
}

describe("foundry runtime contract", () => {
  it("publish flow snapshots builder state into runtime metadata", async () => {
    const mod = await loadFoundryPublishing();
    const publish = mod.publishFoundryApplication({
      applicationId: "app_orders",
      branchId: "branch_main",
      environmentId: "env_prod",
      version: "2026.04.12.1",
      pages: [{ pageId: "page_orders", path: "/orders" }],
      widgetTreeHash: "hash_widgets_v1",
      queryManifestHash: "hash_queries_v1",
    });

    expect(publish.deploymentId).toBeTruthy();
    expect(publish.applicationId).toBe("app_orders");
    expect(publish.status).toBe("published");
    expect(publish.runtimeSnapshotId).toBeTruthy();
    expect(publish.widgetTreeHash).toBe("hash_widgets_v1");
    expect(publish.publishedAt).toBeTruthy();
  });

  it("share metadata distinguishes editor, viewer, and runtime-consumer access", async () => {
    const mod = await loadFoundryPublishing();
    const share = mod.createFoundryShareLink({
      deploymentId: "deploy_orders",
      audience: "runtime-consumer",
      expiresAt: "2026-05-12T00:00:00.000Z",
      permissions: ["runtime.view"],
    });

    expect(share.shareId).toBeTruthy();
    expect(share.audience).toBe("runtime-consumer");
    expect(share.permissions).toEqual(["runtime.view"]);
    expect(share.url).toMatch(/^\/foundry\/runtime\//);
  });

  it("runtime bootstrap keeps published execution separate from builder state", async () => {
    const mod = await loadFoundryRuntime();
    const bootstrap = mod.createFoundryRuntimeBootstrap({
      deploymentId: "deploy_orders",
      applicationId: "app_orders",
      runtimePath: "/foundry/runtime/orders",
      pages: [{ pageId: "page_orders", path: "/orders", widgetIds: ["widget_table"] }],
      queries: [{ queryId: "query_list_orders", safeToExecute: true }],
      datasources: [{ datasourceId: "ds_orders", environmentId: "env_prod" }],
    });

    expect(bootstrap.deploymentId).toBe("deploy_orders");
    expect(bootstrap.editorPath).toBeUndefined();
    expect(bootstrap.runtimePath).toBe("/foundry/runtime/orders");
    expect(bootstrap.pages[0].widgetIds).toEqual(["widget_table"]);
    expect(bootstrap.queries[0].safeToExecute).toBe(true);
  });

  it("runtime execution resolves page navigation, modal, tab, form, and query actions", async () => {
    const mod = await loadFoundryRuntime();
    const session = mod.createFoundryRuntimeSession({
      deploymentId: "deploy_orders",
      principalId: "runtime_user_1",
      initialPageId: "page_orders",
    });
    const result = mod.executeFoundryRuntimeAction(session, {
      type: "submit-form",
      widgetId: "widget_order_form",
      queryId: "query_update_order",
      next: { type: "navigate", pageId: "page_detail", modalId: "modal_success" },
    });

    expect(session.sessionId).toBeTruthy();
    expect(result.sessionId).toBe(session.sessionId);
    expect(result.executedActions).toEqual(
      expect.arrayContaining(["submit-form", "query.execute", "navigate", "modal.open"])
    );
    expect(result.currentPageId).toBe("page_detail");
  });

  it("deployment lifecycle supports publish, promote, rollback, and audit metadata", async () => {
    const mod = await loadFoundryDeployments();
    const draft = mod.createFoundryDeployment({
      applicationId: "app_orders",
      branchId: "branch_main",
      environmentId: "env_staging",
      status: "draft",
    });
    const published = mod.transitionFoundryDeployment(draft, "published", {
      actorId: "user_ari",
      reason: "benchmark baseline",
    });
    const rollback = mod.rollbackFoundryDeployment(published, {
      actorId: "user_ari",
      targetDeploymentId: "deploy_previous",
    });

    expect(draft.deploymentId).toBeTruthy();
    expect(published.status).toBe("published");
    expect(published.audit.actorId).toBe("user_ari");
    expect(rollback.status).toBe("rolled-back");
    expect(rollback.rollbackTargetDeploymentId).toBe("deploy_previous");
  });
});
