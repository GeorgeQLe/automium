import { describe, expect, it } from "vitest";

describe("planner adapter contract", () => {
  it("freezes the allowed planner intent vocabulary for v1", async () => {
    const contract = await import("../src/planner-adapter");

    expect(contract.PLANNER_INTENT_VOCABULARY).toEqual([
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
  });

  it("requires every planner adapter to expose model metadata and compile intents", async () => {
    const contract = await import("../src/planner-adapter");

    expect(contract.plannerAdapterRequiredMethods).toEqual([
      "metadata",
      "buildPrompt",
      "parsePlannerOutput",
      "compileIntent",
      "summarizeStep"
    ]);
    expect(contract.plannerAdapterMetadataFields).toEqual([
      "id",
      "vendor",
      "model",
      "intentSchemaVersion"
    ]);
  });
});
