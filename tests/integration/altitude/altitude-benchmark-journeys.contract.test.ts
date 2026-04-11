import { describe, expect, it } from "vitest";

async function loadAltitudeBenchmarkRoutes() {
  try {
    return await import("../../../apps/altitude/src/altitude-benchmark-routes");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-benchmark-routes.ts to define benchmark routes for Phase 4.",
      { cause: error }
    );
  }
}

async function loadAltitudeSeed() {
  try {
    return await import("../../../apps/altitude/src/altitude-seed");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-seed.ts to define seed and reset for Phase 4.",
      { cause: error }
    );
  }
}

describe("altitude benchmark journeys contract", () => {
  it("ALTITUDE_BENCHMARK_ROUTES covers 8 journey URLs", async () => {
    const mod = await loadAltitudeBenchmarkRoutes();

    expect(mod.ALTITUDE_BENCHMARK_ROUTES).toHaveLength(8);
  });

  it("seedAltitudeBenchmarkEnvironment() returns environment with workspace, project, and preset data", async () => {
    const mod = await loadAltitudeSeed();
    const env = mod.seedAltitudeBenchmarkEnvironment();

    expect(env.workspace).toBeTruthy();
    expect(env.project).toBeTruthy();
    expect(env.workspace.workspaceId).toBeTruthy();
    expect(env.project.projectId).toBeTruthy();
  });

  it("resetAltitudeBenchmarkEnvironment() is callable", async () => {
    const mod = await loadAltitudeSeed();

    expect(() => mod.resetAltitudeBenchmarkEnvironment()).not.toThrow();
  });

  it("all benchmark route paths are non-empty strings", async () => {
    const mod = await loadAltitudeBenchmarkRoutes();

    for (const route of mod.ALTITUDE_BENCHMARK_ROUTES) {
      expect(typeof route.path).toBe("string");
      expect(route.path.length).toBeGreaterThan(0);
    }
  });
});
