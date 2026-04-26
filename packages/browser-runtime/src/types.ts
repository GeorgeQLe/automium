export interface NavigationResult {
  url: string;
  status: number;
  timing: { total: number };
}

export interface RawAccessibilityNode {
  role: string;
  name: string;
  value?: string | null;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  visible?: boolean;
  enabled?: boolean;
  children?: RawAccessibilityNode[];
}

export interface RawAccessibilitySnapshot {
  elements: RawAccessibilityNode[];
  url: string;
}

export interface ActionResult {
  success: boolean;
  action: string;
}

export interface ScreenshotResult {
  data: Buffer;
  boundingBox: { x: number; y: number; width: number; height: number };
  elementId: string;
}

export interface NetworkEvent {
  requestId?: string;
  url: string;
  method: string;
  status: number | null;
  resourceType?: string;
}

export interface ConsoleEvent {
  level: string;
  text: string;
}

export interface DOMMutation {
  type: string;
  target: string;
}

export interface BrowserRuntime {
  navigate(url: string): Promise<NavigationResult>;
  snapshot(): Promise<RawAccessibilitySnapshot>;
  executeAction(action: { type: string; targetElementId: string; value?: string }): Promise<ActionResult>;
  captureElementScreenshot(elementId: string): Promise<ScreenshotResult>;
  getNetworkEvents(): Promise<NetworkEvent[]>;
  getConsoleEvents(): Promise<ConsoleEvent[]>;
  getDOMMutations(): Promise<DOMMutation[]>;
  close(): Promise<void>;
}
