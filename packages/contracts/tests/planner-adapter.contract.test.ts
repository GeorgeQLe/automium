import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function readFixture<T>(fixtureName: string): Promise<T> {
  const url = new URL(`../fixtures/${fixtureName}`, import.meta.url);
  const contents = await readFile(url, "utf8");

  return JSON.parse(contents) as T;
}

describe("planner adapter contract", () => {
  it("freezes the allowed planner intent vocabulary for v1", async () => {
    const contract = await import("../src/planner-adapter");
    const fixture = await readFixture<{ allowedIntents: readonly string[] }>(
      "planner-adapter.v1.json"
    );

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
    expect(fixture.allowedIntents).toEqual(contract.PLANNER_INTENT_VOCABULARY);
  });

  it("requires every planner adapter to expose model metadata and compile intents", async () => {
    const contract = await import("../src/planner-adapter");
    const fixture = await readFixture<{
      metadata: Record<string, unknown>;
      metadataFields: readonly string[];
      requiredMethods: readonly string[];
    }>("planner-adapter.v1.json");

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
    expect(fixture.requiredMethods).toEqual(contract.plannerAdapterRequiredMethods);
    expect(fixture.metadataFields).toEqual(contract.plannerAdapterMetadataFields);
    expect(Object.keys(fixture.metadata)).toEqual(
      contract.plannerAdapterMetadataFields
    );
  });
});
