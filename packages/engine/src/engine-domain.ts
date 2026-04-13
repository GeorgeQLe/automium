export const BROWSER_ENGINE_SCHEMA_VERSION = "v1";

export interface BrowserFrameState {
  readonly frameId: string;
  readonly parentFrameId: string | null;
  readonly url: string;
}

export interface BrowserStorageState {
  readonly cookies: readonly unknown[];
  readonly localStorage: readonly unknown[];
}

export interface BrowserNetworkState {
  readonly requests: readonly unknown[];
  readonly blockedDomains: readonly string[];
}

export interface BrowserEngineStateInput {
  readonly sessionId: string;
  readonly url: string;
  readonly frames: readonly BrowserFrameState[];
  readonly storage: BrowserStorageState;
  readonly network: BrowserNetworkState;
}

export interface BrowserEngineState {
  readonly schemaVersion: typeof BROWSER_ENGINE_SCHEMA_VERSION;
  readonly sessionId: string;
  readonly document: {
    readonly url: string;
  };
  readonly frames: readonly BrowserFrameState[];
  readonly storage: BrowserStorageState;
  readonly network: BrowserNetworkState;
}

export interface InteractiveElementInput {
  readonly role: string;
  readonly label: string;
  readonly frameId: string;
  readonly route: string;
  readonly visible: boolean;
  readonly enabled: boolean;
}

export interface InteractiveElementDescriptor extends InteractiveElementInput {
  readonly id: string;
  readonly actionability: {
    readonly visible: boolean;
    readonly enabled: boolean;
    readonly score: number;
  };
}

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.4 not implemented: ${operation}`);
}

export function createBrowserEngineState(
  _input: BrowserEngineStateInput
): BrowserEngineState {
  return notImplemented("createBrowserEngineState");
}

export function describeInteractiveElement(
  _input: InteractiveElementInput
): InteractiveElementDescriptor {
  return notImplemented("describeInteractiveElement");
}
