import { describe, expect, it } from "vitest";

async function loadControlPlane() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected apps/control-plane/src/index.ts to expose the Phase 7 control-plane contract.",
      { cause: error }
    );
  }
}

describe("control plane contract", () => {
  it("freezes the public run and journey route manifest", async () => {
    const mod = await loadControlPlane();

    expect(mod.CONTROL_PLANE_API_VERSION).toBe("v1");
    expect(mod.CONTROL_PLANE_ROUTES).toEqual([
      { method: "POST", path: "/journeys/compile" },
      { method: "POST", path: "/runs" },
      { method: "GET", path: "/runs/:runId" },
      { method: "GET", path: "/runs/:runId/artifacts" },
      { method: "GET", path: "/runs/:runId/replay" }
    ]);
  });

  it("accepts journey definitions for the owned product corpus", async () => {
    const mod = await loadControlPlane();

    const journey = {
      id: "alpha-altitude-attachment",
      appId: "altitude",
      fixtureId: "altitude-upload-member",
      goal: "Create a work item with an attachment",
      steps: [
        { intent: "navigate", target: "/altitude/projects/roadmap" },
        { intent: "click", target: "Create work item" },
        { intent: "type/fill", target: "Title", value: "Regression evidence" },
        { intent: "upload", target: "Attachment", value: "fixtures/sample.pdf" },
        { intent: "assert", target: "Attachment uploaded" }
      ],
      assertions: [{ id: "attachment-visible", type: "semantic", target: "Attachment uploaded" }],
      recovery: { maxAttempts: 2, strategy: "bounded-retry" }
    };

    expect(mod.validateJourneyDefinition(journey)).toEqual({
      valid: true,
      errors: []
    });
    expect(mod.compileJourneyDefinition(journey)).toMatchObject({
      journeyId: journey.id,
      appId: "altitude",
      fixtureId: "altitude-upload-member",
      graphVersion: "v1"
    });
  });

  it("models run submission, status, and artifact references", async () => {
    const mod = await loadControlPlane();

    const submission = mod.createRunSubmission({
      journeyId: "alpha-switchboard-session-recovery",
      appId: "switchboard",
      fixtureId: "switchboard-session-agent",
      planner: { id: "gpt-baseline", vendor: "openai", model: "gpt-5.4" },
      environmentProfileId: "owned-session-churn"
    });

    expect(submission).toMatchObject({
      status: "queued",
      artifactManifestRef: expect.any(String),
      replayStreamRef: expect.any(String)
    });

    expect(mod.RUN_STATUS_VALUES).toEqual([
      "queued",
      "leased",
      "running",
      "passed",
      "failed",
      "unsupported",
      "cancelled"
    ]);
  });
});
