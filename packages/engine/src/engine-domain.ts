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

function stableHash(input: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
}

function normalizeIdentityPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function scoreActionability(input: InteractiveElementInput): number {
  if (input.visible && input.enabled) {
    return 1;
  }

  if (input.visible || input.enabled) {
    return 0.5;
  }

  return 0;
}

export function createBrowserEngineState(
  input: BrowserEngineStateInput
): BrowserEngineState {
  return {
    schemaVersion: BROWSER_ENGINE_SCHEMA_VERSION,
    sessionId: input.sessionId,
    document: {
      url: input.url
    },
    frames: input.frames.map((frame) => ({ ...frame })),
    storage: {
      cookies: [...input.storage.cookies],
      localStorage: [...input.storage.localStorage]
    },
    network: {
      requests: [...input.network.requests],
      blockedDomains: [...input.network.blockedDomains]
    }
  };
}

export function describeInteractiveElement(
  input: InteractiveElementInput
): InteractiveElementDescriptor {
  const labelPart = normalizeIdentityPart(input.label) || "unlabeled";
  const identity = [
    input.route,
    input.frameId,
    input.role,
    input.label
  ].join("|");

  return {
    ...input,
    id: `elt_${labelPart}_${stableHash(identity)}`,
    actionability: {
      visible: input.visible,
      enabled: input.enabled,
      score: scoreActionability(input)
    }
  };
}
