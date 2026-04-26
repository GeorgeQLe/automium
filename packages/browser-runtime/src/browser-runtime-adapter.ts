import type {
  BrowserRuntime,
  BrowserRuntimeAdapterConfig,
  NavigationResult,
  RawAccessibilitySnapshot,
  ActionResult,
  ScreenshotResult,
  NetworkEvent,
  ConsoleEvent,
  DOMMutation,
} from "./types";
import { enrichAccessibilityTree } from "./enrichment";
import { createVisionCaptureSession, requestCapture } from "./vision-capture";

const DEFAULT_FRAME_ID = "main";
const DEFAULT_ROUTE = "/";
const EMPTY_BOUNDING_BOX = { x: 0, y: 0, width: 0, height: 0 };

export function createBrowserRuntimeAdapter(
  config: BrowserRuntimeAdapterConfig = {}
): { boundary: "browser-runtime" } & BrowserRuntime {
  let currentUrl = config.initialUrl ?? "";
  const route = config.route ?? DEFAULT_ROUTE;
  const frameId = config.frameId ?? DEFAULT_FRAME_ID;
  const visionSession = createVisionCaptureSession({
    maxCropsPerStep: config.maxCropsPerStep,
    maxCropSizeBytes: config.maxCropSizeBytes,
    runId: config.runId,
  });

  return {
    boundary: "browser-runtime" as const,

    async navigate(url: string): Promise<NavigationResult> {
      currentUrl = url;
      return { url, status: 200, timing: { total: 0 } };
    },

    async snapshot(): Promise<RawAccessibilitySnapshot> {
      enrichAccessibilityTree([], route, frameId);
      return { elements: [], url: currentUrl };
    },

    async executeAction(action: { type: string; targetElementId: string; value?: string }): Promise<ActionResult> {
      return {
        success: true,
        action: action.type,
        targetElementId: action.targetElementId,
        value: action.value,
      };
    },

    async captureElementScreenshot(elementId: string): Promise<ScreenshotResult> {
      requestCapture(visionSession, elementId, EMPTY_BOUNDING_BOX, "low-semantic-confidence");
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
