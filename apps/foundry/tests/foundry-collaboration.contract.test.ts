import { describe, expect, it } from "vitest";

async function loadFoundryBranches() {
  try {
    return await import("../src/foundry-branches");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-branches.ts to define version and branching helpers for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryPermissions() {
  try {
    return await import("../src/foundry-permissions");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-permissions.ts to define Foundry access-control helpers for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryRealtime() {
  try {
    return await import("../src/foundry-realtime");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-realtime.ts to define builder collaboration events for Phase 6.",
      { cause: error }
    );
  }
}

describe("foundry collaboration contract", () => {
  it("branch lifecycle creates feature branches, compares changes, merges, and restores versions", async () => {
    const mod = await loadFoundryBranches();
    const branch = mod.createFoundryBranch({
      applicationId: "app_orders",
      name: "feature/orders-crud",
      baseBranchId: "branch_main",
      createdBy: "user_ari",
    });
    const comparison = mod.compareFoundryBranches("branch_main", branch.branchId, {
      changedPages: ["page_orders"],
      changedQueries: ["query_list_orders"],
      changedWidgets: ["widget_orders_table"],
    });
    const merged = mod.mergeFoundryBranch(branch, {
      actorId: "user_ari",
      targetBranchId: "branch_main",
    });
    const restored = mod.restoreFoundryVersion({
      applicationId: "app_orders",
      versionId: "version_previous",
      actorId: "user_ari",
    });

    expect(branch.branchId).toBeTruthy();
    expect(branch.status).toBe("active");
    expect(comparison.changedWidgets).toEqual(["widget_orders_table"]);
    expect(merged.status).toBe("merged");
    expect(merged.mergedBy).toBe("user_ari");
    expect(restored.versionId).toBe("version_previous");
  });

  it("permissions distinguish editors, viewers, runtime consumers, and datasource executors", async () => {
    const mod = await loadFoundryPermissions();
    const policy = mod.createFoundryPermissionPolicy({
      workspaceId: "ws_foundry",
      grants: [
        {
          principalId: "user_editor",
          role: "editor",
          actions: ["application.edit", "query.execute", "deployment.publish"],
        },
        {
          principalId: "user_viewer",
          role: "viewer",
          actions: ["application.view"],
        },
        {
          principalId: "user_runtime",
          role: "runtime-consumer",
          actions: ["runtime.view"],
        },
      ],
    });

    expect(mod.canFoundryPrincipal(policy, "user_editor", "application.edit")).toBe(true);
    expect(mod.canFoundryPrincipal(policy, "user_editor", "datasource.execute")).toBe(false);
    expect(mod.canFoundryPrincipal(policy, "user_viewer", "deployment.publish")).toBe(false);
    expect(mod.canFoundryPrincipal(policy, "user_runtime", "runtime.view")).toBe(true);
  });

  it("realtime events make branch, deployment, datasource, and widget changes auditable", async () => {
    const mod = await loadFoundryRealtime();

    expect(mod.FOUNDRY_REALTIME_TOPICS).toEqual([
      "application.updated",
      "page.updated",
      "widget.updated",
      "datasource.updated",
      "query.executed",
      "branch.changed",
      "deployment.published",
      "permission.changed",
    ]);

    const event = mod.createFoundryRealtimeEvent({
      workspaceId: "ws_foundry",
      applicationId: "app_orders",
      topic: "branch.changed",
      actorId: "user_ari",
      payload: { branchId: "branch_feature", action: "merge" },
    });

    expect(event.eventId).toBeTruthy();
    expect(event.workspaceId).toBe("ws_foundry");
    expect(event.applicationId).toBe("app_orders");
    expect(event.topic).toBe("branch.changed");
    expect(event.actorId).toBe("user_ari");
    expect(event.payload.branchId).toBe("branch_feature");
    expect(event.occurredAt).toBeTruthy();
  });

  it("collaboration history reports active version, pending branch changes, and publish readiness", async () => {
    const branchMod = await loadFoundryBranches();
    const history = branchMod.createFoundryCollaborationHistory({
      applicationId: "app_orders",
      activeBranchId: "branch_feature",
      activeVersionId: "version_12",
      pendingChanges: [
        { resource: "widgets", resourceId: "widget_orders_table", action: "updated" },
        { resource: "datasources", resourceId: "ds_orders", action: "tested" },
      ],
      publishReady: true,
    });

    expect(history.applicationId).toBe("app_orders");
    expect(history.activeVersionId).toBe("version_12");
    expect(history.pendingChanges).toHaveLength(2);
    expect(history.publishReady).toBe(true);
    expect(history.updatedAt).toBeTruthy();
  });
});
