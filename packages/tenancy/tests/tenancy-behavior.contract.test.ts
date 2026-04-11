import { describe, expect, it } from "vitest";

async function loadTenancyBehavior() {
  try {
    return await import("../src/tenancy-behavior");
  } catch (error) {
    throw new Error(
      "Expected packages/tenancy/src/tenancy-behavior.ts to define the shared tenancy behavior module for Phase 3.",
      { cause: error }
    );
  }
}

describe("tenancy behavior contract", () => {
  it("factory functions produce correct output shapes", async () => {
    const mod = await loadTenancyBehavior();

    const org = mod.createOrganization({ name: "Acme Corp" });
    expect(org.organizationId).toBeTruthy();
    expect(org.name).toBe("Acme Corp");
    expect(org.createdAt).toBeTruthy();

    const ws = mod.createWorkspace({
      organizationId: org.organizationId,
      name: "Engineering",
    });
    expect(ws.workspaceId).toBeTruthy();
    expect(ws.organizationId).toBe(org.organizationId);
    expect(ws.name).toBe("Engineering");
    expect(ws.createdAt).toBeTruthy();

    const membership = mod.createWorkspaceMembership({
      organizationId: org.organizationId,
      workspaceId: ws.workspaceId,
      principalId: "user_1",
      role: "contributor",
    });
    expect(membership.membershipId).toBeTruthy();
    expect(membership.organizationId).toBe(org.organizationId);
    expect(membership.workspaceId).toBe(ws.workspaceId);
    expect(membership.principalId).toBe("user_1");
    expect(membership.role).toBe("contributor");
    expect(membership.status).toBe("active");
  });

  it("hasHigherOrEqualRole() checks role precedence correctly", async () => {
    const mod = await loadTenancyBehavior();

    expect(mod.hasHigherOrEqualRole("workspace-admin", "viewer")).toBe(true);
    expect(mod.hasHigherOrEqualRole("workspace-admin", "workspace-admin")).toBe(true);
    expect(mod.hasHigherOrEqualRole("maintainer", "workspace-admin")).toBe(false);
    expect(mod.hasHigherOrEqualRole("viewer", "contributor")).toBe(false);
    expect(mod.hasHigherOrEqualRole("contributor", "viewer")).toBe(true);
  });

  it("validateWorkspaceMembership() reports errors for invalid data", async () => {
    const mod = await loadTenancyBehavior();

    const errors = mod.validateWorkspaceMembership({
      membershipId: "",
      organizationId: "",
      workspaceId: "ws_1",
      principalId: "",
      role: "invalid-role" as never,
      status: "active",
    });

    expect(errors).toContain("membershipId is required");
    expect(errors).toContain("organizationId is required");
    expect(errors).toContain("principalId is required");
    expect(errors.some((e: string) => e.includes("Invalid role"))).toBe(true);
    expect(errors).not.toContain("workspaceId is required");
  });

  it("validateOrganization() and validateWorkspace() catch missing fields", async () => {
    const mod = await loadTenancyBehavior();

    const orgErrors = mod.validateOrganization({
      organizationId: "",
      name: "",
      createdAt: "",
    });
    expect(orgErrors).toContain("organizationId is required");
    expect(orgErrors).toContain("name is required");

    const wsErrors = mod.validateWorkspace({
      workspaceId: "",
      organizationId: "",
      name: "Valid Name",
      createdAt: "",
    });
    expect(wsErrors).toContain("workspaceId is required");
    expect(wsErrors).toContain("organizationId is required");
    expect(wsErrors).not.toContain("name is required");
  });
});
