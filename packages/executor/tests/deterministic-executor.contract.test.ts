import { describe, expect, it } from "vitest";

async function loadExecutor() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/executor/src/index.ts to expose deterministic executor contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("deterministic executor contract", () => {
  it("compiles supported planner intents into deterministic actions", async () => {
    const mod = await loadExecutor();

    expect(mod.SUPPORTED_EXECUTOR_INTENTS).toEqual([
      "navigate",
      "click",
      "type/fill",
      "select",
      "upload",
      "press-key",
      "wait-for-condition",
      "assert",
      "extract",
      "branch",
      "recover",
      "finish"
    ]);

    expect(
      mod.compilePlannerIntent({
        intent: "type/fill",
        targetElementId: "elt_title",
        value: "Regression evidence"
      })
    ).toMatchObject({
      type: "fill",
      targetElementId: "elt_title",
      value: "Regression evidence",
      deterministic: true
    });
  });

  it("fails fast for unsupported browser capabilities", async () => {
    const mod = await loadExecutor();

    expect(
      mod.compilePlannerIntent({
        intent: "open-native-file-picker",
        targetElementId: "elt_upload"
      })
    ).toMatchObject({
      type: "unsupported",
      reason: "unsupported-intent",
      recoverable: false
    });
  });
});
