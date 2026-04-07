import { describe, expect, it } from "vitest";

describe("semantic snapshot contract", () => {
  it("freezes the v1 schema version and required snapshot fields", async () => {
    const contract = await import("../src/semantic-snapshot");

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
  });

  it("requires stable interactive element metadata for planner input", async () => {
    const contract = await import("../src/semantic-snapshot");

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
  });
});
