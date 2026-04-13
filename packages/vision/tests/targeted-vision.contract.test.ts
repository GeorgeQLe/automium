import { describe, expect, it } from "vitest";

async function loadVision() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/vision/src/index.ts to expose targeted vision fallback contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("targeted vision contract", () => {
  it("triggers targeted crops only when semantic confidence is low", async () => {
    const mod = await loadVision();

    expect(
      mod.shouldRequestTargetedVision({
        semanticConfidence: 0.42,
        elementRole: "button",
        recentFailures: ["not-actionable"]
      })
    ).toBe(true);

    expect(
      mod.shouldRequestTargetedVision({
        semanticConfidence: 0.94,
        elementRole: "button",
        recentFailures: []
      })
    ).toBe(false);
  });

  it("records crop metadata without full-page screenshot leakage", async () => {
    const mod = await loadVision();

    expect(
      mod.createTargetedCropRequest({
        runId: "run-alpha-altitude",
        elementId: "elt_attachment_button",
        boundingBox: { x: 100, y: 240, width: 180, height: 48 },
        reason: "low-semantic-confidence"
      })
    ).toMatchObject({
      runId: "run-alpha-altitude",
      elementId: "elt_attachment_button",
      reason: "low-semantic-confidence",
      fullPage: false,
      boundingBox: { width: 180, height: 48 }
    });
  });
});
