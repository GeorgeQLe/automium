import { describe, expect, it } from "vitest";

async function loadVisionCaptureModule() {
  try {
    return await import("../src/index") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/browser-runtime/src/index.ts to export vision capture functions.",
      { cause: error }
    );
  }
}

describe("vision capture contract", () => {
  it("exports createVisionCaptureSession as a function", async () => {
    const mod = await loadVisionCaptureModule();
    expect(typeof mod.createVisionCaptureSession).toBe("function");
  });

  it("requestCapture returns { captured: true } when within budget", async () => {
    const mod = await loadVisionCaptureModule();
    const createSession = mod.createVisionCaptureSession as Function;
    const requestCapture = mod.requestCapture as Function;

    const session = createSession({ maxCropsPerStep: 3, maxCropSizeBytes: 102400 });
    const result = requestCapture(session, "el_1", { x: 0, y: 0, width: 100, height: 50 }, "ambiguous target");

    expect(result.captured).toBe(true);
    expect(result).toHaveProperty("request");
    expect(result).toHaveProperty("budgetRemaining");
    expect(typeof result.budgetRemaining).toBe("number");
  });

  it("budget enforcement: 4th capture in a step returns { captured: false }", async () => {
    const mod = await loadVisionCaptureModule();
    const createSession = mod.createVisionCaptureSession as Function;
    const requestCapture = mod.requestCapture as Function;

    const session = createSession({ maxCropsPerStep: 3, maxCropSizeBytes: 102400 });
    const box = { x: 0, y: 0, width: 50, height: 50 };

    requestCapture(session, "el_1", box, "reason1");
    requestCapture(session, "el_2", box, "reason2");
    requestCapture(session, "el_3", box, "reason3");
    const fourth = requestCapture(session, "el_4", box, "reason4");

    expect(fourth.captured).toBe(false);
    expect(fourth.budgetRemaining).toBe(0);
  });

  it("annotateScreenshot includes bounding box and semantic context", async () => {
    const mod = await loadVisionCaptureModule();
    const annotate = mod.annotateScreenshot as Function;

    const screenshot = Buffer.from("fake-png-data");
    const semanticContext = {
      elementId: "el_1",
      role: "button",
      label: "Submit",
      nearbyElements: ["el_2", "el_3"],
    };

    const result = annotate(screenshot, semanticContext);

    expect(result).toHaveProperty("boundingBox");
    expect(result).toHaveProperty("semanticContext");
    expect(result.semanticContext.role).toBe("button");
    expect(result.semanticContext.label).toBe("Submit");
  });

  it("integration: shouldRequestTargetedVision low confidence triggers capture", async () => {
    const mod = await loadVisionCaptureModule();
    const createSession = mod.createVisionCaptureSession as Function;
    const requestCapture = mod.requestCapture as Function;

    const session = createSession({ maxCropsPerStep: 3, maxCropSizeBytes: 102400 });
    const result = requestCapture(
      session,
      "el_1",
      { x: 10, y: 20, width: 200, height: 100 },
      "low-semantic-confidence"
    );

    expect(result.captured).toBe(true);
    expect(result.request).toHaveProperty("elementId");
    expect(result.request.elementId).toBe("el_1");
  });
});
