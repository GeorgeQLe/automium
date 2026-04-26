export { createBrowserRuntimeAdapter } from "./browser-runtime-adapter";
export {
  enrichAccessibilityTree,
  diffMutations,
  categorizeNetworkEvent,
} from "./enrichment";
export { flattenFrameHierarchy } from "./frame-flattening";
export {
  annotateScreenshot,
  createVisionCaptureSession,
  requestCapture,
} from "./vision-capture";
export type {
  BrowserRuntimeFrameInput,
  FlattenedFrameHierarchy,
} from "./frame-flattening";
export type {
  AnnotatedScreenshot,
  ScreenshotSemanticContext,
  VisionCaptureResult,
  VisionCaptureSession,
  VisionCaptureSessionConfig,
} from "./vision-capture";
export type {
  BrowserRuntime,
  NavigationResult,
  RawAccessibilitySnapshot,
  RawAccessibilityNode,
  ActionResult,
  ScreenshotResult,
  NetworkEvent,
  ConsoleEvent,
  DOMMutation,
} from "./types";
