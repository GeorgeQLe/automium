import { describe, expect, it } from "vitest";

async function loadAltitudeApiRoutes() {
  try {
    return await import("../src/altitude-api-routes");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-api-routes.ts to define the Altitude API route manifest for Phase 4.",
      { cause: error }
    );
  }
}

describe("altitude API contract", () => {
  it("ALTITUDE_API_ROUTES manifest covers 11 resource routes", async () => {
    const mod = await loadAltitudeApiRoutes();

    expect(mod.ALTITUDE_API_ROUTES).toHaveLength(11);
  });

  it("each route has path and methods defined", async () => {
    const mod = await loadAltitudeApiRoutes();

    for (const route of mod.ALTITUDE_API_ROUTES) {
      expect(route.path).toBeTruthy();
      expect(route.methods).toBeTruthy();
      expect(route.methods.length).toBeGreaterThan(0);
    }
  });

  it("route paths follow /api/altitude/* pattern", async () => {
    const mod = await loadAltitudeApiRoutes();

    for (const route of mod.ALTITUDE_API_ROUTES) {
      expect(route.path).toMatch(/^\/api\/altitude\//);
    }
  });

  it("routes include all major resources", async () => {
    const mod = await loadAltitudeApiRoutes();
    const paths = mod.ALTITUDE_API_ROUTES.map(
      (r: { path: string }) => r.path
    );

    const expectedResources = [
      "projects",
      "work-items",
      "cycles",
      "modules",
      "pages",
      "views",
      "comments",
      "attachments",
      "notifications",
      "analytics",
      "webhooks",
    ];

    for (const resource of expectedResources) {
      expect(
        paths.some((p: string) => p.includes(resource))
      ).toBe(true);
    }
  });
});
