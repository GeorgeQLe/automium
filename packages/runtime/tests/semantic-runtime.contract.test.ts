import { describe, expect, it } from "vitest";

async function loadRuntime() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/runtime/src/index.ts to expose semantic runtime contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("semantic runtime contract", () => {
  it("builds semantic snapshots from engine state", async () => {
    const mod = await loadRuntime();

    const snapshot = mod.buildSemanticSnapshot({
      url: "https://owned.local/switchboard/inbox",
      route: "/switchboard/inbox",
      taskContext: "Resolve the highest-priority conversation",
      elements: [
        { id: "elt_conversation", role: "link", label: "Billing issue", visible: true }
      ],
      networkEvents: [{ method: "GET", path: "/switchboard/api/conversations" }]
    });

    expect(snapshot).toMatchObject({
      schemaVersion: "v1",
      route: "/switchboard/inbox",
      interactiveElements: [{ id: "elt_conversation", label: "Billing issue" }]
    });
  });

  it("compacts snapshots within context and crop budgets", async () => {
    const mod = await loadRuntime();

    const compacted = mod.compactRuntimeContext({
      tokenBudget: 2400,
      cropBudget: 3,
      snapshots: [{ snapshotId: "snap-1" }, { snapshotId: "snap-2" }],
      pinnedInvariants: ["stay on owned domains"]
    });

    expect(compacted).toMatchObject({
      tokenBudget: 2400,
      cropBudget: 3,
      retainedSnapshotRefs: ["snap-1", "snap-2"],
      droppedSnapshotRefs: []
    });
  });
});
