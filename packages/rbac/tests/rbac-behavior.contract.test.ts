import { describe, expect, it } from "vitest";

async function loadRbacBehavior() {
  try {
    return await import("../src/rbac-behavior");
  } catch (error) {
    throw new Error(
      "Expected packages/rbac/src/rbac-behavior.ts to define the shared RBAC behavior module for Phase 3.",
      { cause: error }
    );
  }
}

async function loadRbacContract() {
  try {
    return await import("../src/platform-rbac");
  } catch (error) {
    throw new Error(
      "Expected packages/rbac/src/platform-rbac.ts to define the shared RBAC contract for Phase 3.",
      { cause: error }
    );
  }
}

describe("rbac behavior contract", () => {
  it("checkPermission() allows platform-owner on any resource", async () => {
    const mod = await loadRbacBehavior();

    const result = mod.checkPermission("platform-owner", {
      actorId: "actor_1",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "file",
      action: "delete",
      ownershipScope: "any",
    });

    expect(result.allowed).toBe(true);
    expect(result.role).toBe("platform-owner");
    expect(result.resource).toBe("file");
    expect(result.action).toBe("delete");
  });

  it("checkPermission() denies viewer create access", async () => {
    const mod = await loadRbacBehavior();

    const result = mod.checkPermission("viewer", {
      actorId: "actor_1",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "file",
      action: "create",
      ownershipScope: "own",
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("may not");
  });

  it("validatePermissionCheckContext() catches missing fields", async () => {
    const mod = await loadRbacBehavior();

    const errors = mod.validatePermissionCheckContext({
      actorId: "",
      organizationId: "",
      workspaceId: "",
      resourceType: "invalid-resource" as never,
      action: "read",
      ownershipScope: "own",
    });

    expect(errors).toContain("actorId is required");
    expect(errors).toContain("organizationId is required");
    expect(errors).toContain("workspaceId is required");
    expect(errors.some((e: string) => e.includes("Invalid resourceType"))).toBe(true);
  });

  it("permission matrix has entries for all 5 roles across all 9 resources", async () => {
    const mod = await loadRbacBehavior();
    const contract = await loadRbacContract();

    const roles = contract.SHARED_PLATFORM_ROLE_ORDER;
    const resources = contract.SHARED_PLATFORM_PERMISSION_RESOURCES;

    expect(roles).toHaveLength(5);
    expect(resources).toHaveLength(9);

    for (const role of roles) {
      const rolePerms = mod.ROLE_RESOURCE_PERMISSIONS[role];
      expect(rolePerms).toBeDefined();
      for (const resource of resources) {
        expect(
          rolePerms[resource],
          `${role} should have permissions defined for ${resource}`
        ).toBeDefined();
        expect(Array.isArray(rolePerms[resource])).toBe(true);
      }
    }
  });
});
