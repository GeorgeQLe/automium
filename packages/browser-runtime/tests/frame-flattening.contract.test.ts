import { describe, expect, it } from "vitest";

async function loadFrameFlatteningModule() {
  try {
    return await import("../src/index") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/browser-runtime/src/index.ts to export frame flattening functions.",
      { cause: error }
    );
  }
}

describe("frame flattening contract", () => {
  it("exports flattenFrameHierarchy as a function", async () => {
    const mod = await loadFrameFlatteningModule();
    expect(typeof mod.flattenFrameHierarchy).toBe("function");
  });

  it("single-frame input passes through elements unchanged", async () => {
    const mod = await loadFrameFlatteningModule();
    const flatten = mod.flattenFrameHierarchy as Function;

    const frames = [
      {
        frameId: "main",
        parentFrameId: null,
        origin: "https://example.com",
        url: "https://example.com/page",
        elements: [
          { id: "el_1", role: "button", label: "Submit" },
          { id: "el_2", role: "textbox", label: "Email" },
        ],
      },
    ];

    const result = flatten(frames);

    expect(result.elements).toHaveLength(2);
    expect(result.elements[0].id).toBe("el_1");
    expect(result.elements[1].id).toBe("el_2");
  });

  it("multi-frame: elements from all frames appear in unified list", async () => {
    const mod = await loadFrameFlatteningModule();
    const flatten = mod.flattenFrameHierarchy as Function;

    const frames = [
      {
        frameId: "main",
        parentFrameId: null,
        origin: "https://example.com",
        url: "https://example.com/page",
        elements: [{ id: "el_1", role: "button", label: "Save" }],
      },
      {
        frameId: "iframe-1",
        parentFrameId: "main",
        origin: "https://widget.com",
        url: "https://widget.com/form",
        elements: [{ id: "el_2", role: "textbox", label: "Name" }],
      },
    ];

    const result = flatten(frames);

    expect(result.elements).toHaveLength(2);
    const ids = result.elements.map((e: Record<string, unknown>) => e.id);
    expect(ids).toContain("el_1");
    expect(ids).toContain("el_2");
  });

  it("each element is tagged with frame origin", async () => {
    const mod = await loadFrameFlatteningModule();
    const flatten = mod.flattenFrameHierarchy as Function;

    const frames = [
      {
        frameId: "main",
        parentFrameId: null,
        origin: "https://example.com",
        url: "https://example.com/page",
        elements: [{ id: "el_1", role: "link", label: "Home" }],
      },
      {
        frameId: "iframe-1",
        parentFrameId: "main",
        origin: "https://cdn.com",
        url: "https://cdn.com/widget",
        elements: [{ id: "el_2", role: "button", label: "Play" }],
      },
    ];

    const result = flatten(frames);

    const el1 = result.elements.find((e: Record<string, unknown>) => e.id === "el_1");
    const el2 = result.elements.find((e: Record<string, unknown>) => e.id === "el_2");
    expect(el1.group).toBe("main");
    expect(el2.group).toBe("iframe-1");
  });

  it("frame hierarchy output matches SemanticFrameRef contract (id, parentFrameId, origin, url)", async () => {
    const mod = await loadFrameFlatteningModule();
    const flatten = mod.flattenFrameHierarchy as Function;

    const frames = [
      {
        frameId: "main",
        parentFrameId: null,
        origin: "https://example.com",
        url: "https://example.com/page",
        elements: [],
      },
      {
        frameId: "child",
        parentFrameId: "main",
        origin: "https://other.com",
        url: "https://other.com/embed",
        elements: [],
      },
    ];

    const result = flatten(frames);

    expect(Array.isArray(result.frameHierarchy)).toBe(true);
    expect(result.frameHierarchy).toHaveLength(2);

    const mainFrame = result.frameHierarchy.find((f: Record<string, unknown>) => f.id === "main");
    expect(mainFrame).toBeDefined();
    expect(mainFrame.parentFrameId).toBeNull();
    expect(mainFrame.origin).toBe("https://example.com");
    expect(mainFrame.url).toBe("https://example.com/page");

    const childFrame = result.frameHierarchy.find((f: Record<string, unknown>) => f.id === "child");
    expect(childFrame).toBeDefined();
    expect(childFrame.parentFrameId).toBe("main");
    expect(childFrame.origin).toBe("https://other.com");
    expect(childFrame.url).toBe("https://other.com/embed");
  });
});
