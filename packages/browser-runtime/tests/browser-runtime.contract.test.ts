import { describe, expect, it } from "vitest";

async function loadBrowserRuntimeModule() {
  try {
    return await import("../src/index") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/browser-runtime/src/index.ts to export the BrowserRuntime adapter.",
      { cause: error }
    );
  }
}

describe("browser runtime adapter contract", () => {
  it("exports createBrowserRuntimeAdapter as a function", async () => {
    const mod = await loadBrowserRuntimeModule();
    expect(typeof mod.createBrowserRuntimeAdapter).toBe("function");
  });

  it("adapter has boundary property set to 'browser-runtime'", async () => {
    const mod = await loadBrowserRuntimeModule();
    const factory = mod.createBrowserRuntimeAdapter as Function;
    const adapter = factory({});

    expect(adapter.boundary).toBe("browser-runtime");
  });

  it("navigate() is async and returns { url, status, timing }", async () => {
    const mod = await loadBrowserRuntimeModule();
    const factory = mod.createBrowserRuntimeAdapter as Function;
    const adapter = factory({});

    const result = await adapter.navigate("https://example.com");

    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("timing");
    expect(typeof result.url).toBe("string");
    expect(typeof result.status).toBe("number");
    expect(typeof result.timing).toBe("object");
  });

  it("snapshot() is async and returns { elements, url }", async () => {
    const mod = await loadBrowserRuntimeModule();
    const factory = mod.createBrowserRuntimeAdapter as Function;
    const adapter = factory({});

    const result = await adapter.snapshot();

    expect(result).toHaveProperty("elements");
    expect(result).toHaveProperty("url");
    expect(Array.isArray(result.elements)).toBe(true);
    expect(typeof result.url).toBe("string");
  });

  it("executeAction() is async and returns { success, action }", async () => {
    const mod = await loadBrowserRuntimeModule();
    const factory = mod.createBrowserRuntimeAdapter as Function;
    const adapter = factory({});

    const result = await adapter.executeAction({ type: "click", targetElementId: "el_1" });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("action");
    expect(typeof result.success).toBe("boolean");
    expect(typeof result.action).toBe("string");
  });

  it("captureElementScreenshot() is async and returns { data, boundingBox, elementId }", async () => {
    const mod = await loadBrowserRuntimeModule();
    const factory = mod.createBrowserRuntimeAdapter as Function;
    const adapter = factory({});

    const result = await adapter.captureElementScreenshot("el_1");

    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("boundingBox");
    expect(result).toHaveProperty("elementId");
    expect(typeof result.elementId).toBe("string");
  });

  it("getNetworkEvents(), getConsoleEvents(), getDOMMutations() return arrays", async () => {
    const mod = await loadBrowserRuntimeModule();
    const factory = mod.createBrowserRuntimeAdapter as Function;
    const adapter = factory({});

    expect(Array.isArray(await adapter.getNetworkEvents())).toBe(true);
    expect(Array.isArray(await adapter.getConsoleEvents())).toBe(true);
    expect(Array.isArray(await adapter.getDOMMutations())).toBe(true);
  });

  it("close() is async and resolves without error", async () => {
    const mod = await loadBrowserRuntimeModule();
    const factory = mod.createBrowserRuntimeAdapter as Function;
    const adapter = factory({});

    await expect(adapter.close()).resolves.toBeUndefined();
  });
});
