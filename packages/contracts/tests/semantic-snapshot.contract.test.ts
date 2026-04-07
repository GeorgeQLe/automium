import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function readFixture<T>(fixtureName: string): Promise<T> {
  const url = new URL(`../fixtures/${fixtureName}`, import.meta.url);
  const contents = await readFile(url, "utf8");

  return JSON.parse(contents) as T;
}

describe("semantic snapshot contract", () => {
  it("freezes the v1 schema version and required snapshot fields", async () => {
    const contract = await import("../src/semantic-snapshot");
    const fixture = await readFixture<Record<string, unknown>>(
      "semantic-snapshot.v1.json"
    );

    expect(contract.SEMANTIC_SNAPSHOT_SCHEMA_VERSION).toBe("v1");
    expect(contract.semanticSnapshotRequiredFields).toEqual([
      "url",
      "route",
      "frameHierarchy",
      "taskContext",
      "checkpointContext",
      "interactiveElements",
      "recentMutations",
      "relevantNetworkEvents",
      "pinnedInvariants"
    ]);
    expect(fixture.schemaVersion).toBe(contract.SEMANTIC_SNAPSHOT_SCHEMA_VERSION);
    expect(Object.keys(fixture)).toEqual([
      "schemaVersion",
      ...contract.semanticSnapshotRequiredFields
    ]);
  });

  it("requires stable interactive element metadata for planner input", async () => {
    const contract = await import("../src/semantic-snapshot");
    const fixture = await readFixture<{
      interactiveElements: Array<Record<string, unknown>>;
    }>("semantic-snapshot.v1.json");

    expect(contract.interactiveElementRequiredFields).toEqual([
      "id",
      "role",
      "label",
      "value",
      "required",
      "disabled",
      "loading",
      "error",
      "visible",
      "interactable",
      "group"
    ]);
    expect(Object.keys(fixture.interactiveElements[0])).toEqual(
      contract.interactiveElementRequiredFields
    );
  });
});
