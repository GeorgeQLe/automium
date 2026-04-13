export const ASSERTION_ENGINE_VERSION = "v1";

export const SUPPORTED_ASSERTION_TYPES = [
  "semantic",
  "url",
  "network",
  "download",
  "extracted-value"
] as const;

export type SupportedAssertionType = (typeof SUPPORTED_ASSERTION_TYPES)[number];

export interface AssertionDefinition {
  readonly id: string;
  readonly type: SupportedAssertionType;
  readonly target: string;
}

export interface AssertionVerdict {
  readonly assertionId: string;
  readonly verdict: "pass" | "fail" | "unsupported";
  readonly recoverySuggested: boolean;
}

export interface RecoveryPolicy {
  readonly maxAttempts: number;
  readonly strategy: "bounded-retry" | "fail-fast";
}
