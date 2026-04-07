import { describe, expect, it } from "vitest";

async function loadGovernanceShellContract() {
  try {
    return await import("../src/governance-shell");
  } catch (error) {
    throw new Error(
      "Expected apps/admin-console/src/governance-shell.ts to define the admin shell contract for Phase 3.",
      { cause: error }
    );
  }
}

describe("admin console governance shell contract", () => {
  it("requires top-level navigation for shared platform governance domains", async () => {
    const contract = await loadGovernanceShellContract();

    expect(contract.ADMIN_CONSOLE_SECTIONS).toEqual([
      "authentication",
      "organizations",
      "workspaces",
      "memberships",
      "roles",
      "audit",
      "files",
      "jobs",
      "search",
      "realtime"
    ]);
  });

  it("requires governance capabilities for configuration, policy, and operator visibility", async () => {
    const contract = await loadGovernanceShellContract();

    expect(contract.adminConsoleGovernanceCapabilities).toEqual([
      "instance-configuration",
      "invite-and-membership-ops",
      "audit-trail-review",
      "file-ownership-review",
      "job-queue-observability",
      "search-index-rebuilds",
      "realtime-delivery-monitoring"
    ]);
  });
});
