import { describe, expect, it } from "vitest";

async function loadAltitudeViews() {
  try {
    return await import("../src/altitude-views");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-views.ts to define view factories for Phase 4.",
      { cause: error }
    );
  }
}

describe("altitude views contract", () => {
  it("VIEW_TYPES frozen array includes expected view types", async () => {
    const mod = await loadAltitudeViews();

    expect(mod.VIEW_TYPES).toEqual([
      "board",
      "list",
      "table",
      "calendar",
      "timeline",
    ]);
  });

  it("createView() produces view with project scope and type", async () => {
    const mod = await loadAltitudeViews();
    const view = mod.createView({
      projectId: "proj_1",
      type: "board",
      name: "Sprint Board",
    });

    expect(view.viewId).toBeTruthy();
    expect(view.projectId).toBe("proj_1");
    expect(view.type).toBe("board");
    expect(view.name).toBe("Sprint Board");
    expect(view.createdAt).toBeTruthy();
  });

  it("createSavedView() preserves filter configuration", async () => {
    const mod = await loadAltitudeViews();
    const savedView = mod.createSavedView({
      projectId: "proj_1",
      type: "list",
      name: "My High Priority",
      filters: {
        priority: ["high", "urgent"],
        state: ["in-progress"],
      },
    });

    expect(savedView.viewId).toBeTruthy();
    expect(savedView.name).toBe("My High Priority");
    expect(savedView.filters.priority).toEqual(["high", "urgent"]);
    expect(savedView.filters.state).toEqual(["in-progress"]);
  });

  it("validateView() catches missing required fields", async () => {
    const mod = await loadAltitudeViews();
    const errors = mod.validateView({
      viewId: "",
      projectId: "",
      type: "board",
      name: "",
      createdAt: "",
    });

    expect(errors).toContain("viewId is required");
    expect(errors).toContain("projectId is required");
    expect(errors).toContain("name is required");
  });
});
