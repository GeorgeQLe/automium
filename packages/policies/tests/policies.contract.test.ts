import { describe, expect, it } from "vitest";

async function loadPolicies() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/policies/src/index.ts to expose authorized-use and domain policy contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("policy enforcement contract", () => {
  it("allows only owned benchmark domains and fixtures", async () => {
    const mod = await loadPolicies();

    expect(mod.AUTHORIZED_APP_IDS).toEqual([
      "altitude",
      "switchboard",
      "foundry",
      "iframe-fixture"
    ]);

    expect(
      mod.evaluateDomainPolicy({
        appId: "altitude",
        url: "https://owned.local/altitude/projects/roadmap"
      })
    ).toEqual({ allowed: true, reason: "owned-domain" });

    expect(
      mod.evaluateDomainPolicy({
        appId: "altitude",
        url: "https://example.com/external-login"
      })
    ).toEqual({ allowed: false, reason: "domain-not-authorized" });
  });

  it("enforces authorized-use policy before run submission", async () => {
    const mod = await loadPolicies();

    expect(
      mod.evaluateRunPolicy({
        tenantId: "tenant-alpha",
        appId: "switchboard",
        fixtureId: "switchboard-session-agent",
        requestedCapabilities: ["browser", "artifacts"]
      })
    ).toMatchObject({
      allowed: true,
      policyVersion: "v1",
      checks: expect.arrayContaining(["tenant-quota", "domain-allowlist", "artifact-retention"])
    });
  });
});
