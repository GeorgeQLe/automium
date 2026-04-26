import { describe, expect, it } from "vitest";
import {
  interactiveElementRequiredFields,
  semanticSnapshotRequiredFields,
} from "../../contracts/src/semantic-snapshot";

async function loadSnapshotBuilderModule() {
  try {
    return await import("../src/index") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/browser-runtime/src/index.ts to export snapshot builder functions.",
      { cause: error }
    );
  }
}

describe("contract semantic snapshot builder", () => {
  it("exports buildContractSnapshot as a function", async () => {
    const mod = await loadSnapshotBuilderModule();
    expect(typeof mod.buildContractSnapshot).toBe("function");
  });

  it("builds a full frozen-contract SemanticSnapshot shape", async () => {
    const mod = await loadSnapshotBuilderModule();
    const buildContractSnapshot = mod.buildContractSnapshot as Function;

    const snapshot = buildContractSnapshot({
      url: "https://app.example.test/settings",
      route: "/settings",
      frameHierarchy: [
        {
          id: "main-frame",
          parentFrameId: null,
          origin: "https://app.example.test",
          url: "https://app.example.test/settings",
        },
      ],
      taskContext: {
        journeyId: "journey-1",
        runId: "run-1",
        stepId: "step-1",
        environmentProfileId: "env-1",
        authorizedAppId: "app-1",
      },
      checkpointContext: {
        checkpointId: "checkpoint-1",
        label: "Settings loaded",
        assertionIds: ["assertion-1"],
      },
      interactiveElements: [
        {
          id: "element-1",
          role: "button",
          label: "Save",
          value: null,
          required: false,
          disabled: false,
          loading: false,
          error: null,
          visible: true,
          interactable: true,
          group: "main-frame",
        },
      ],
      recentMutations: [
        {
          mutationId: "mutation-1",
          kind: "attribute",
          targetId: "element-1",
          summary: "disabled changed",
        },
      ],
      relevantNetworkEvents: [
        {
          requestId: "request-1",
          method: "GET",
          url: "https://app.example.test/api/settings",
          status: 200,
          category: "fetch",
        },
      ],
      pinnedInvariants: [
        {
          invariantId: "invariant-1",
          description: "User remains authenticated",
          source: "journey",
        },
      ],
    });

    expect(snapshot.schemaVersion).toBe("v1");
    expect(Object.keys(snapshot)).toEqual([
      "schemaVersion",
      ...semanticSnapshotRequiredFields,
    ]);
    for (const field of semanticSnapshotRequiredFields) {
      expect(snapshot).toHaveProperty(field);
    }
    expect(Object.keys(snapshot.interactiveElements[0])).toEqual(
      interactiveElementRequiredFields
    );
  });

  it("defaults nullable and list fields without inventing browser data", async () => {
    const mod = await loadSnapshotBuilderModule();
    const buildContractSnapshot = mod.buildContractSnapshot as Function;

    const snapshot = buildContractSnapshot({
      url: "https://app.example.test/",
      route: "/",
      taskContext: {
        journeyId: "journey-1",
        runId: "run-1",
        stepId: "step-1",
        environmentProfileId: "env-1",
        authorizedAppId: "app-1",
      },
    });

    expect(snapshot.checkpointContext).toBeNull();
    expect(snapshot.frameHierarchy).toEqual([]);
    expect(snapshot.interactiveElements).toEqual([]);
    expect(snapshot.recentMutations).toEqual([]);
    expect(snapshot.relevantNetworkEvents).toEqual([]);
    expect(snapshot.pinnedInvariants).toEqual([]);
  });

  it("clones caller-owned collections and nested checkpoint assertion IDs", async () => {
    const mod = await loadSnapshotBuilderModule();
    const buildContractSnapshot = mod.buildContractSnapshot as Function;

    const frameHierarchy = [
      {
        id: "main-frame",
        parentFrameId: null,
        origin: "https://app.example.test",
        url: "https://app.example.test/",
      },
    ];
    const assertionIds = ["assertion-1"];
    const interactiveElements = [
      {
        id: "element-1",
        role: "button",
        label: "Continue",
        value: null,
        required: false,
        disabled: false,
        loading: false,
        error: null,
        visible: true,
        interactable: true,
        group: "main-frame",
      },
    ];

    const snapshot = buildContractSnapshot({
      url: "https://app.example.test/",
      route: "/",
      frameHierarchy,
      taskContext: {
        journeyId: "journey-1",
        runId: "run-1",
        stepId: "step-1",
        environmentProfileId: "env-1",
        authorizedAppId: "app-1",
      },
      checkpointContext: {
        checkpointId: "checkpoint-1",
        label: "Ready",
        assertionIds,
      },
      interactiveElements,
    });

    frameHierarchy[0].url = "https://mutated.example.test/";
    assertionIds.push("assertion-2");
    interactiveElements[0].label = "Mutated";

    expect(snapshot.frameHierarchy[0].url).toBe("https://app.example.test/");
    expect(snapshot.checkpointContext?.assertionIds).toEqual(["assertion-1"]);
    expect(snapshot.interactiveElements[0].label).toBe("Continue");
  });

  it("rejects interactive elements missing frozen-contract fields", async () => {
    const mod = await loadSnapshotBuilderModule();
    const buildContractSnapshot = mod.buildContractSnapshot as Function;

    expect(() =>
      buildContractSnapshot({
        url: "https://app.example.test/",
        route: "/",
        taskContext: {
          journeyId: "journey-1",
          runId: "run-1",
          stepId: "step-1",
          environmentProfileId: "env-1",
          authorizedAppId: "app-1",
        },
        interactiveElements: [
          {
            id: "element-1",
            role: "button",
            label: "Broken",
          },
        ],
      })
    ).toThrow("Semantic snapshot missing required field: value");
  });
});
