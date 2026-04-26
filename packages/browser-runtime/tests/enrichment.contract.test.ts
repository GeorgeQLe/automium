import { describe, expect, it } from "vitest";

async function loadEnrichmentModule() {
  try {
    return await import("../src/index") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/browser-runtime/src/index.ts to export enrichment functions.",
      { cause: error }
    );
  }
}

const interactiveElementRequiredFields = [
  "id", "role", "label", "value", "required",
  "disabled", "loading", "error", "visible", "interactable", "group"
] as const;

describe("enrichment pipeline contract", () => {
  it("exports enrichAccessibilityTree as a function", async () => {
    const mod = await loadEnrichmentModule();
    expect(typeof mod.enrichAccessibilityTree).toBe("function");
  });

  it("maps raw nodes to SemanticInteractiveElement with all 11 contract fields", async () => {
    const mod = await loadEnrichmentModule();
    const enrich = mod.enrichAccessibilityTree as Function;

    const rawNodes = [
      { role: "button", name: "Submit", visible: true, enabled: true },
    ];
    const result = enrich(rawNodes, "/login", "main-frame");

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    for (const field of interactiveElementRequiredFields) {
      expect(result[0]).toHaveProperty(field);
    }
  });

  it("produces stable IDs: same input yields same ID across calls", async () => {
    const mod = await loadEnrichmentModule();
    const enrich = mod.enrichAccessibilityTree as Function;

    const rawNodes = [
      { role: "textbox", name: "Email", visible: true, enabled: true },
    ];
    const result1 = enrich(rawNodes, "/signup", "main-frame");
    const result2 = enrich(rawNodes, "/signup", "main-frame");

    expect(result1[0].id).toBe(result2[0].id);
    expect(typeof result1[0].id).toBe("string");
    expect(result1[0].id.length).toBeGreaterThan(0);
  });

  it("scores actionability: visible+enabled=1.0, visible-only=0.5, neither=0", async () => {
    const mod = await loadEnrichmentModule();
    const enrich = mod.enrichAccessibilityTree as Function;

    const both = enrich([{ role: "button", name: "A", visible: true, enabled: true }], "/", "f");
    const visibleOnly = enrich([{ role: "button", name: "B", visible: true, enabled: false }], "/", "f");
    const neither = enrich([{ role: "button", name: "C", visible: false, enabled: false }], "/", "f");

    expect(both[0].interactable).toBe(true);
    expect(visibleOnly[0].interactable).toBe(true);
    expect(neither[0].interactable).toBe(false);
  });

  it("groups elements by frame via group field", async () => {
    const mod = await loadEnrichmentModule();
    const enrich = mod.enrichAccessibilityTree as Function;

    const frame1 = enrich([{ role: "link", name: "Home", visible: true, enabled: true }], "/", "frame-a");
    const frame2 = enrich([{ role: "link", name: "About", visible: true, enabled: true }], "/", "frame-b");

    expect(frame1[0].group).toBe("frame-a");
    expect(frame2[0].group).toBe("frame-b");
  });

  it("diffMutations detects attribute changes between snapshots", async () => {
    const mod = await loadEnrichmentModule();
    const diff = mod.diffMutations as Function;

    const previous = [{ id: "el_1", role: "button", label: "Save", disabled: false }];
    const current = [{ id: "el_1", role: "button", label: "Save", disabled: true }];

    const mutations = diff(previous, current);

    expect(Array.isArray(mutations)).toBe(true);
    expect(mutations.length).toBeGreaterThan(0);
    expect(mutations[0]).toHaveProperty("mutationId");
    expect(mutations[0]).toHaveProperty("kind");
    expect(mutations[0]).toHaveProperty("targetId");
    expect(mutations[0]).toHaveProperty("summary");
    expect(mutations[0].kind).toBe("attribute");
  });

  it("diffMutations detects visibility changes", async () => {
    const mod = await loadEnrichmentModule();
    const diff = mod.diffMutations as Function;

    const previous = [{ id: "el_2", role: "dialog", label: "Modal", visible: false }];
    const current = [{ id: "el_2", role: "dialog", label: "Modal", visible: true }];

    const mutations = diff(previous, current);

    expect(mutations.length).toBeGreaterThan(0);
    const visibilityChange = mutations.find((m: Record<string, unknown>) => m.kind === "visibility");
    expect(visibilityChange).toBeDefined();
    expect(visibilityChange.targetId).toBe("el_2");
  });

  it("categorizeNetworkEvent maps fetch/XHR/document/websocket correctly", async () => {
    const mod = await loadEnrichmentModule();
    const categorize = mod.categorizeNetworkEvent as Function;

    const fetchEvent = categorize({ requestId: "r1", method: "GET", url: "/api/data", status: 200, resourceType: "fetch" });
    const xhrEvent = categorize({ requestId: "r2", method: "POST", url: "/api/submit", status: 201, resourceType: "xhr" });
    const docEvent = categorize({ requestId: "r3", method: "GET", url: "/page", status: 200, resourceType: "document" });
    const wsEvent = categorize({ requestId: "r4", method: "GET", url: "wss://sock", status: 101, resourceType: "websocket" });

    expect(fetchEvent.category).toBe("fetch");
    expect(xhrEvent.category).toBe("xhr");
    expect(docEvent.category).toBe("document");
    expect(wsEvent.category).toBe("websocket");
  });
});
