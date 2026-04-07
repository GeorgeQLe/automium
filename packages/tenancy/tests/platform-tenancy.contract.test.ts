import { describe, expect, it } from "vitest";

async function loadTenancyContract() {
  try {
    return await import("../src/platform-tenancy");
  } catch (error) {
    throw new Error(
      "Expected packages/tenancy/src/platform-tenancy.ts to define the shared tenancy contract for Phase 3.",
      { cause: error }
    );
  }
}

describe("shared tenancy platform contract", () => {
  it("requires the organization, workspace, invite, and membership boundary resources", async () => {
    const contract = await loadTenancyContract();

    expect(contract.TENANCY_BOUNDARY_RESOURCES).toEqual([
      "organization",
      "workspace",
      "invite",
      "membership"
    ]);
    expect(contract.WORKSPACE_MEMBERSHIP_ROLES).toEqual([
      "workspace-admin",
      "maintainer",
      "contributor",
      "viewer"
    ]);
  });

  it("requires membership projections and shared ownership for files, jobs, and search indexes", async () => {
    const contract = await loadTenancyContract();

    expect(contract.workspaceMembershipProjectionFields).toEqual([
      "membershipId",
      "organizationId",
      "workspaceId",
      "principalId",
      "role",
      "status"
    ]);
    expect(contract.TENANT_OWNED_RESOURCE_KINDS).toEqual([
      "file",
      "job",
      "search-index"
    ]);
  });
});
