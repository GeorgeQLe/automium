import { describe, expect, it } from "vitest";

async function loadAuthContract() {
  try {
    return await import("../src/platform-auth");
  } catch (error) {
    throw new Error(
      "Expected packages/auth/src/platform-auth.ts to define the shared auth contract for Phase 3.",
      { cause: error }
    );
  }
}

describe("shared auth platform contract", () => {
  it("requires multi-tenant identity providers and session states", async () => {
    const contract = await loadAuthContract();

    expect(contract.AUTH_IDENTITY_PROVIDERS).toEqual([
      "password",
      "magic-link",
      "sso"
    ]);
    expect(contract.SESSION_STATES).toEqual([
      "pending",
      "active",
      "revoked",
      "expired"
    ]);
  });

  it("requires invite acceptance to resolve into organization and workspace memberships", async () => {
    const contract = await loadAuthContract();

    expect(contract.INVITE_STATUSES).toEqual([
      "pending",
      "accepted",
      "expired",
      "revoked"
    ]);
    expect(contract.inviteAcceptanceResultFields).toEqual([
      "identityId",
      "organizationId",
      "workspaceId",
      "membershipId",
      "sessionId"
    ]);
  });
});
