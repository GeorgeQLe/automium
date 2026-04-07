import { describe, expect, it } from "vitest";

async function loadAuditContract() {
  try {
    return await import("../src/platform-audit");
  } catch (error) {
    throw new Error(
      "Expected packages/audit/src/platform-audit.ts to define the shared audit contract for Phase 3.",
      { cause: error }
    );
  }
}

describe("shared audit platform contract", () => {
  it("requires canonical audit event fields for cross-package trail reconstruction", async () => {
    const contract = await loadAuditContract();

    expect(contract.AUDIT_EVENT_REQUIRED_FIELDS).toEqual([
      "eventId",
      "occurredAt",
      "actorId",
      "organizationId",
      "workspaceId",
      "resourceType",
      "resourceId",
      "action",
      "summary",
      "metadata"
    ]);
  });

  it("requires audit coverage for invite, membership, file, job, search, and realtime actions", async () => {
    const contract = await loadAuditContract();

    expect(contract.AUDITED_SHARED_PLATFORM_ACTIONS).toEqual([
      "invite.sent",
      "invite.accepted",
      "membership.role-changed",
      "file.ownership-transferred",
      "job.scheduled",
      "search.indexed",
      "realtime.event-delivered"
    ]);
  });
});
