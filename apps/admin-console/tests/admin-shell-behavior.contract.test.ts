import { describe, expect, it } from "vitest";

async function loadAdminShell() {
  try {
    return await import("../src/admin-shell");
  } catch (error) {
    throw new Error(
      "Expected apps/admin-console/src/admin-shell.ts to define the admin shell module for Phase 3.",
      { cause: error }
    );
  }
}

async function loadGovernanceShell() {
  try {
    return await import("../src/governance-shell");
  } catch (error) {
    throw new Error(
      "Expected apps/admin-console/src/governance-shell.ts to define the governance shell contract for Phase 3.",
      { cause: error }
    );
  }
}

describe("admin shell behavior contract", () => {
  it("buildAdminShellConfig() composes governance, product nav, and sections", async () => {
    const mod = await loadAdminShell();
    const govShell = await loadGovernanceShell();

    const config = mod.buildAdminShellConfig({
      activeProductId: "altitude",
    });

    expect(config.title).toBe("Admin Console");
    expect(config.governance.activeSections).toEqual([...govShell.ADMIN_CONSOLE_SECTIONS]);
    expect(config.governance.enabledCapabilities).toEqual([...govShell.adminConsoleGovernanceCapabilities]);
    expect(config.governance.lastRefreshedAt).toBeTruthy();
    expect(config.sectionConfigs).toHaveLength(govShell.ADMIN_CONSOLE_SECTIONS.length);
    expect(config.productContext.activeProductId).toBe("altitude");
    expect(config.navigation.currentProduct.id).toBe("altitude");
  });

  it("resolveActiveProduct() finds registered products and returns undefined for unknown", async () => {
    const mod = await loadAdminShell();

    const altitude = mod.resolveActiveProduct("altitude");
    expect(altitude).toBeDefined();
    expect(altitude!.id).toBe("altitude");
    expect(altitude!.label).toBe("Altitude");
    expect(altitude!.basePath).toBe("/altitude");

    const switchboard = mod.resolveActiveProduct("switchboard");
    expect(switchboard).toBeDefined();
    expect(switchboard!.id).toBe("switchboard");

    const unknown = mod.resolveActiveProduct("nonexistent" as never);
    expect(unknown).toBeUndefined();
  });

  it("buildProductNavigationConfig() separates current from other products", async () => {
    const mod = await loadAdminShell();

    const nav = mod.buildProductNavigationConfig({
      activeProductId: "foundry",
    });

    expect(nav.currentProduct.id).toBe("foundry");
    expect(nav.otherProducts).toHaveLength(2);
    expect(nav.otherProducts.map((p: { id: string }) => p.id)).not.toContain("foundry");
    expect(nav.otherProducts.map((p: { id: string }) => p.id)).toContain("altitude");
    expect(nav.otherProducts.map((p: { id: string }) => p.id)).toContain("switchboard");
    expect(nav.switchProductBasePath).toBe("/admin/products");
  });

  it("validateAdminShellConfig() catches invalid product and missing sections", async () => {
    const mod = await loadAdminShell();

    const validConfig = mod.buildAdminShellConfig({
      activeProductId: "altitude",
    });

    const noErrors = mod.validateAdminShellConfig(validConfig);
    expect(noErrors).toEqual([]);

    const brokenConfig = {
      ...validConfig,
      productContext: {
        activeProductId: "nonexistent" as never,
        availableProducts: [],
      },
      sectionConfigs: [],
    };

    const errors = mod.validateAdminShellConfig(brokenConfig);
    expect(errors.some((e: string) => e.includes("Invalid active product"))).toBe(true);
    expect(errors.some((e: string) => e.includes("Missing section config"))).toBe(true);
  });
});
