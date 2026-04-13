import { describe, expect, it } from "vitest";

async function loadEngine() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/engine/src/index.ts to expose the Phase 7 browser engine contract.",
      { cause: error }
    );
  }
}

describe("browser engine runtime contract", () => {
  it("models document, session, frame, storage, and network state", async () => {
    const mod = await loadEngine();

    const state = mod.createBrowserEngineState({
      sessionId: "session-alpha",
      url: "https://owned.local/altitude/projects/roadmap",
      frames: [{ frameId: "main", parentFrameId: null, url: "/altitude/projects/roadmap" }],
      storage: { cookies: [], localStorage: [] },
      network: { requests: [], blockedDomains: [] }
    });

    expect(state).toMatchObject({
      schemaVersion: "v1",
      sessionId: "session-alpha",
      document: { url: expect.stringContaining("/altitude/projects/roadmap") },
      frames: [{ frameId: "main" }],
      storage: { cookies: [], localStorage: [] },
      network: { requests: [], blockedDomains: [] }
    });
  });

  it("assigns stable interactive element identities and actionability scores", async () => {
    const mod = await loadEngine();

    const element = mod.describeInteractiveElement({
      role: "button",
      label: "Create work item",
      frameId: "main",
      route: "/altitude/projects/roadmap",
      visible: true,
      enabled: true
    });

    expect(element).toMatchObject({
      id: expect.stringMatching(/^elt_/),
      role: "button",
      label: "Create work item",
      actionability: {
        visible: true,
        enabled: true,
        score: 1
      }
    });
  });
});
