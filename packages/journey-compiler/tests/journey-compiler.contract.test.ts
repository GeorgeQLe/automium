import { describe, expect, it } from "vitest";

async function loadJourneyCompiler() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/journey-compiler/src/index.ts to expose natural-language journey compiler contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("journey compiler contract", () => {
  it("validates natural-language journeys before graph compilation", async () => {
    const mod = await loadJourneyCompiler();

    const validation = mod.validateNaturalLanguageJourney({
      appId: "foundry",
      fixtureId: "foundry-baseline-builder",
      goal: "Open the published orders app and create a new order",
      constraints: ["owned product only", "no third-party domains"]
    });

    expect(validation).toEqual({
      valid: true,
      errors: []
    });
  });

  it("compiles journeys into assertions, recovery rules, and fixture refs", async () => {
    const mod = await loadJourneyCompiler();

    const compiled = mod.compileNaturalLanguageJourney({
      appId: "foundry",
      fixtureId: "foundry-baseline-builder",
      goal: "Open the published orders app and create a new order"
    });

    expect(compiled).toMatchObject({
      graphVersion: "v1",
      appId: "foundry",
      fixtureId: "foundry-baseline-builder",
      nodes: expect.any(Array),
      assertions: expect.any(Array),
      recoveryRules: expect.any(Array)
    });
  });
});
