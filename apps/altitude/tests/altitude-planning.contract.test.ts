import { describe, expect, it } from "vitest";

async function loadAltitudeCycles() {
  try {
    return await import("../src/altitude-cycles");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-cycles.ts to define cycle factories for Phase 4.",
      { cause: error }
    );
  }
}

async function loadAltitudeModules() {
  try {
    return await import("../src/altitude-modules");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-modules.ts to define module factories for Phase 4.",
      { cause: error }
    );
  }
}

describe("altitude planning contract", () => {
  it("createCycle() produces cycle with date range and project scope", async () => {
    const mod = await loadAltitudeCycles();
    const cycle = mod.createCycle({
      projectId: "proj_1",
      name: "Sprint 1",
      startDate: "2026-04-13",
      endDate: "2026-04-27",
    });

    expect(cycle.cycleId).toBeTruthy();
    expect(cycle.projectId).toBe("proj_1");
    expect(cycle.name).toBe("Sprint 1");
    expect(cycle.startDate).toBe("2026-04-13");
    expect(cycle.endDate).toBe("2026-04-27");
    expect(cycle.state).toBeTruthy();
    expect(cycle.createdAt).toBeTruthy();
  });

  it("CYCLE_STATES frozen array and transitionCycleState() valid+invalid transitions", async () => {
    const mod = await loadAltitudeCycles();

    expect(mod.CYCLE_STATES).toEqual(["draft", "active", "completed", "cancelled"]);

    const s1 = mod.transitionCycleState("draft", "active");
    expect(s1).toBe("active");

    const s2 = mod.transitionCycleState("active", "completed");
    expect(s2).toBe("completed");

    expect(() => mod.transitionCycleState("completed", "draft")).toThrow();
  });

  it("attachWorkItemToCycle() links work items to cycles", async () => {
    const mod = await loadAltitudeCycles();
    const link = mod.attachWorkItemToCycle({
      cycleId: "cyc_1",
      workItemId: "wi_1",
    });

    expect(link.cycleId).toBe("cyc_1");
    expect(link.workItemId).toBe("wi_1");
    expect(link.attachedAt).toBeTruthy();
  });

  it("createModule() and addWorkItemToModule() factory and grouping", async () => {
    const mod = await loadAltitudeModules();
    const module = mod.createModule({
      projectId: "proj_1",
      name: "Authentication",
      description: "Login and signup flows",
    });

    expect(module.moduleId).toBeTruthy();
    expect(module.projectId).toBe("proj_1");
    expect(module.name).toBe("Authentication");
    expect(module.description).toBe("Login and signup flows");
    expect(module.createdAt).toBeTruthy();

    const link = mod.addWorkItemToModule({
      moduleId: module.moduleId,
      workItemId: "wi_1",
    });

    expect(link.moduleId).toBe(module.moduleId);
    expect(link.workItemId).toBe("wi_1");
    expect(link.addedAt).toBeTruthy();
  });

  it("validateCycle() and validateModule() catch missing fields", async () => {
    const cycleMod = await loadAltitudeCycles();
    const moduleMod = await loadAltitudeModules();

    const cycleErrors = cycleMod.validateCycle({
      cycleId: "",
      projectId: "",
      name: "",
      startDate: "",
      endDate: "2026-04-27",
      state: "draft",
      createdAt: "",
    });
    expect(cycleErrors).toContain("cycleId is required");
    expect(cycleErrors).toContain("projectId is required");
    expect(cycleErrors).toContain("name is required");
    expect(cycleErrors).toContain("startDate is required");

    const moduleErrors = moduleMod.validateModule({
      moduleId: "",
      projectId: "",
      name: "",
      description: "",
      createdAt: "",
    });
    expect(moduleErrors).toContain("moduleId is required");
    expect(moduleErrors).toContain("projectId is required");
    expect(moduleErrors).toContain("name is required");
  });
});
