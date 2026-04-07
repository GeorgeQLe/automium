import { describe, expect, it } from "vitest";

async function loadRbacContract() {
  try {
    return await import("../src/platform-rbac");
  } catch (error) {
    throw new Error(
      "Expected packages/rbac/src/platform-rbac.ts to define the shared permission contract for Phase 3.",
      { cause: error }
    );
  }
}

describe("shared RBAC platform contract", () => {
  it("requires a stable shared-platform role order for permission evaluation", async () => {
    const contract = await loadRbacContract();

    expect(contract.SHARED_PLATFORM_ROLE_ORDER).toEqual([
      "platform-owner",
      "organization-admin",
      "workspace-admin",
      "member",
      "viewer"
    ]);
  });

  it("requires permission checks across governance, audit, files, jobs, search, and realtime resources", async () => {
    const contract = await loadRbacContract();

    expect(contract.SHARED_PLATFORM_PERMISSION_RESOURCES).toEqual([
      "organization",
      "workspace",
      "invite",
      "membership",
      "audit-log",
      "file",
      "job",
      "search-index",
      "realtime-channel"
    ]);
    expect(contract.permissionCheckContextFields).toEqual([
      "actorId",
      "organizationId",
      "workspaceId",
      "resourceType",
      "action",
      "ownershipScope"
    ]);
  });
});
