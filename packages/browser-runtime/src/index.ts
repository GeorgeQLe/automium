export { createBrowserRuntimeAdapter } from "./browser-runtime-adapter";
export {
  enrichAccessibilityTree,
  diffMutations,
  categorizeNetworkEvent,
} from "./enrichment";
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
