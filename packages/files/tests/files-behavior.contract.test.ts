import { describe, expect, it } from "vitest";

async function loadFilesBehavior() {
  try {
    return await import("../src/files-behavior");
  } catch (error) {
    throw new Error(
      "Expected packages/files/src/files-behavior.ts to define the shared files behavior module for Phase 3.",
      { cause: error }
    );
  }
}

describe("files behavior contract", () => {
  it("createFileOwnership() produces valid ownership with tenancy fields", async () => {
    const mod = await loadFilesBehavior();
    const ownership = mod.createFileOwnership({
      organizationId: "org_1",
      workspaceId: "ws_1",
      ownerMembershipId: "mem_1",
    });

    expect(ownership.fileId).toBeTruthy();
    expect(ownership.organizationId).toBe("org_1");
    expect(ownership.workspaceId).toBe("ws_1");
    expect(ownership.ownerMembershipId).toBe("mem_1");
  });

  it("createFileOwnershipTransfer() generates transfer with correct fields", async () => {
    const mod = await loadFilesBehavior();
    const transfer = mod.createFileOwnershipTransfer({
      fileId: "file_abc",
      fromOwnerMembershipId: "mem_1",
      toOwnerMembershipId: "mem_2",
      initiatedBy: "actor_1",
    });

    expect(transfer.transferId).toBeTruthy();
    expect(transfer.fileId).toBe("file_abc");
    expect(transfer.fromOwnerMembershipId).toBe("mem_1");
    expect(transfer.toOwnerMembershipId).toBe("mem_2");
    expect(transfer.initiatedBy).toBe("actor_1");
    expect(transfer.occurredAt).toBeTruthy();
  });

  it("applyOwnershipTransfer() updates owner on valid transfer", async () => {
    const mod = await loadFilesBehavior();
    const ownership = mod.createFileOwnership({
      organizationId: "org_1",
      workspaceId: "ws_1",
      ownerMembershipId: "mem_1",
      fileId: "file_fixed",
    });
    const transfer = mod.createFileOwnershipTransfer({
      fileId: "file_fixed",
      fromOwnerMembershipId: "mem_1",
      toOwnerMembershipId: "mem_2",
      initiatedBy: "actor_1",
    });

    const updated = mod.applyOwnershipTransfer(ownership, transfer);
    expect(updated.ownerMembershipId).toBe("mem_2");
    expect(updated.fileId).toBe("file_fixed");
    expect(updated.organizationId).toBe("org_1");
  });

  it("applyOwnershipTransfer() rejects mismatched fileId", async () => {
    const mod = await loadFilesBehavior();
    const ownership = mod.createFileOwnership({
      organizationId: "org_1",
      workspaceId: "ws_1",
      ownerMembershipId: "mem_1",
      fileId: "file_a",
    });
    const transfer = mod.createFileOwnershipTransfer({
      fileId: "file_b",
      fromOwnerMembershipId: "mem_1",
      toOwnerMembershipId: "mem_2",
      initiatedBy: "actor_1",
    });

    expect(() => mod.applyOwnershipTransfer(ownership, transfer)).toThrow(
      "does not match"
    );
  });

  it("validateFileOwnership() catches missing required fields", async () => {
    const mod = await loadFilesBehavior();
    const invalid = {
      fileId: "",
      organizationId: "",
      workspaceId: "ws_1",
      ownerMembershipId: "",
    };

    const errors = mod.validateFileOwnership(invalid);
    expect(errors).toContain("fileId is required");
    expect(errors).toContain("organizationId is required");
    expect(errors).toContain("ownerMembershipId is required");
    expect(errors).not.toContain("workspaceId is required");
  });
});
