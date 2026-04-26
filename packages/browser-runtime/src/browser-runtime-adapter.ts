import type {
  BrowserRuntime,
  NavigationResult,
  RawAccessibilitySnapshot,
  ActionResult,
  ScreenshotResult,
  NetworkEvent,
  ConsoleEvent,
  DOMMutation,
} from "./types";

export function createBrowserRuntimeAdapter(config: unknown): { boundary: "browser-runtime" } & BrowserRuntime {
  return {
    boundary: "browser-runtime" as const,

    async navigate(url: string): Promise<NavigationResult> {
      return { url, status: 200, timing: { total: 0 } };
    },

    async snapshot(): Promise<RawAccessibilitySnapshot> {
      return { elements: [], url: "" };
    },

    async executeAction(action: { type: string; targetElementId: string }): Promise<ActionResult> {
      return { success: true, action: action.type };
    },

    async captureElementScreenshot(elementId: string): Promise<ScreenshotResult> {
      return { data: Buffer.alloc(0), boundingBox: { x: 0, y: 0, width: 0, height: 0 }, elementId };
    },

    async getNetworkEvents(): Promise<NetworkEvent[]> {
      return [];
    },

    async getConsoleEvents(): Promise<ConsoleEvent[]> {
      return [];
    },

    async getDOMMutations(): Promise<DOMMutation[]> {
      return [];
    },

    async close(): Promise<void> {
      return undefined;
    },
  };
}
