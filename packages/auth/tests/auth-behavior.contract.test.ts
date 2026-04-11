import { describe, expect, it } from "vitest";

async function loadAuthBehavior() {
  try {
    return await import("../src/auth-behavior");
  } catch (error) {
    throw new Error(
      "Expected packages/auth/src/auth-behavior.ts to define the shared auth behavior module for Phase 3.",
      { cause: error }
    );
  }
}

describe("auth behavior contract", () => {
  it("createSession() and createInvite() produce correct output shapes", async () => {
    const mod = await loadAuthBehavior();

    const session = mod.createSession({
      identityId: "id_1",
      provider: "password",
    });
    expect(session.sessionId).toBeTruthy();
    expect(session.identityId).toBe("id_1");
    expect(session.provider).toBe("password");
    expect(session.state).toBe("pending");
    expect(session.createdAt).toBeTruthy();
    expect(session.expiresAt).toBeTruthy();

    const invite = mod.createInvite({
      organizationId: "org_1",
      workspaceId: "ws_1",
      email: "user@example.com",
      invitedBy: "actor_1",
    });
    expect(invite.inviteId).toBeTruthy();
    expect(invite.organizationId).toBe("org_1");
    expect(invite.workspaceId).toBe("ws_1");
    expect(invite.email).toBe("user@example.com");
    expect(invite.status).toBe("pending");
    expect(invite.invitedBy).toBe("actor_1");
  });

  it("transitionSessionState() allows valid and rejects invalid transitions", async () => {
    const mod = await loadAuthBehavior();

    expect(mod.transitionSessionState("pending", "active")).toBe("active");
    expect(mod.transitionSessionState("active", "revoked")).toBe("revoked");
    expect(mod.transitionSessionState("pending", "expired")).toBe("expired");

    expect(() => mod.transitionSessionState("revoked", "active")).toThrow(
      "Invalid session transition"
    );
    expect(() => mod.transitionSessionState("expired", "pending")).toThrow(
      "Invalid session transition"
    );
  });

  it("transitionInviteStatus() allows valid and rejects invalid transitions", async () => {
    const mod = await loadAuthBehavior();

    expect(mod.transitionInviteStatus("pending", "accepted")).toBe("accepted");
    expect(mod.transitionInviteStatus("pending", "expired")).toBe("expired");
    expect(mod.transitionInviteStatus("pending", "revoked")).toBe("revoked");

    expect(() => mod.transitionInviteStatus("accepted", "pending")).toThrow(
      "Invalid invite transition"
    );
    expect(() => mod.transitionInviteStatus("expired", "accepted")).toThrow(
      "Invalid invite transition"
    );
  });

  it("validateSession() and validateInvite() report errors for invalid data", async () => {
    const mod = await loadAuthBehavior();

    const sessionErrors = mod.validateSession({
      sessionId: "",
      identityId: "",
      provider: "invalid-provider" as never,
      state: "invalid-state" as never,
      createdAt: "",
      expiresAt: "",
    });
    expect(sessionErrors).toContain("sessionId is required");
    expect(sessionErrors).toContain("identityId is required");
    expect(sessionErrors.some((e: string) => e.includes("Invalid provider"))).toBe(true);
    expect(sessionErrors.some((e: string) => e.includes("Invalid state"))).toBe(true);

    const inviteErrors = mod.validateInvite({
      inviteId: "",
      organizationId: "",
      workspaceId: "",
      email: "",
      status: "invalid-status" as never,
      invitedBy: "",
      createdAt: "",
      expiresAt: "",
    });
    expect(inviteErrors).toContain("inviteId is required");
    expect(inviteErrors).toContain("email is required");
    expect(inviteErrors).toContain("organizationId is required");
    expect(inviteErrors).toContain("workspaceId is required");
    expect(inviteErrors.some((e: string) => e.includes("Invalid status"))).toBe(true);
  });
});
