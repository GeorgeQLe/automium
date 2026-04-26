import { describe, expect, it } from "vitest";

async function loadActionBridgeModule() {
  try {
    return await import("../src/index") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/browser-runtime/src/index.ts to export action bridge functions.",
      { cause: error }
    );
  }
}

function createMockRuntime() {
  const calls: Array<{ method: string; args: unknown[] }> = [];
  return {
    calls,
    navigate: async (url: string) => {
      calls.push({ method: "navigate", args: [url] });
      return { url, status: 200, timing: { total: 0 } };
    },
    snapshot: async () => {
      calls.push({ method: "snapshot", args: [] });
      return { elements: [], url: "https://example.com" };
    },
    executeAction: async (action: Record<string, unknown>) => {
      calls.push({ method: "executeAction", args: [action] });
      return { success: true, action: action.type };
    },
    captureElementScreenshot: async (elementId: string) => {
      calls.push({ method: "captureElementScreenshot", args: [elementId] });
      return { data: Buffer.from(""), boundingBox: { x: 0, y: 0, width: 0, height: 0 }, elementId };
    },
    getNetworkEvents: async () => [],
    getConsoleEvents: async () => [],
    getDOMMutations: async () => [],
    close: async () => {},
  };
}

describe("action bridge contract", () => {
  it("exports bridgeExecutorAction as a function", async () => {
    const mod = await loadActionBridgeModule();
    expect(typeof mod.bridgeExecutorAction).toBe("function");
  });

  it("navigate action calls runtime.navigate(url) and returns success", async () => {
    const mod = await loadActionBridgeModule();
    const bridge = mod.bridgeExecutorAction as Function;
    const runtime = createMockRuntime();

    const action = { type: "navigate", value: "https://example.com", deterministic: true as const };
    const result = await bridge(action, runtime);

    expect(result.success).toBe(true);
    expect(runtime.calls[0].method).toBe("navigate");
    expect(runtime.calls[0].args[0]).toBe("https://example.com");
  });

  it("click action calls runtime.executeAction({type:'click'}) and returns success", async () => {
    const mod = await loadActionBridgeModule();
    const bridge = mod.bridgeExecutorAction as Function;
    const runtime = createMockRuntime();

    const action = { type: "click", targetElementId: "el_1", deterministic: true as const };
    const result = await bridge(action, runtime);

    expect(result.success).toBe(true);
    expect(runtime.calls[0].method).toBe("executeAction");
    expect((runtime.calls[0].args[0] as Record<string, unknown>).type).toBe("click");
  });

  it("fill action calls runtime.executeAction({type:'fill', value}) and returns success", async () => {
    const mod = await loadActionBridgeModule();
    const bridge = mod.bridgeExecutorAction as Function;
    const runtime = createMockRuntime();

    const action = { type: "fill", targetElementId: "el_1", value: "hello@test.com", deterministic: true as const };
    const result = await bridge(action, runtime);

    expect(result.success).toBe(true);
    expect(runtime.calls[0].method).toBe("executeAction");
    const bridgedAction = runtime.calls[0].args[0] as Record<string, unknown>;
    expect(bridgedAction.type).toBe("fill");
    expect(bridgedAction.value).toBe("hello@test.com");
  });

  it("unsupported action returns { success: false } without calling runtime", async () => {
    const mod = await loadActionBridgeModule();
    const bridge = mod.bridgeExecutorAction as Function;
    const runtime = createMockRuntime();

    const action = { type: "unsupported", reason: "unsupported-intent", recoverable: false as const };
    const result = await bridge(action, runtime);

    expect(result.success).toBe(false);
    expect(runtime.calls).toHaveLength(0);
  });

  it("result includes original executorAction and runtimeResult", async () => {
    const mod = await loadActionBridgeModule();
    const bridge = mod.bridgeExecutorAction as Function;
    const runtime = createMockRuntime();

    const action = { type: "click", targetElementId: "el_1", deterministic: true as const };
    const result = await bridge(action, runtime);

    expect(result).toHaveProperty("executorAction");
    expect(result).toHaveProperty("runtimeResult");
    expect(result.executorAction).toEqual(action);
  });
});
