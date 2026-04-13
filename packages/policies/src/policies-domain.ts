export const POLICY_VERSION = "v1";

export const AUTHORIZED_APP_IDS = [
  "altitude",
  "switchboard",
  "foundry",
  "iframe-fixture"
] as const;

export type AuthorizedAppId = (typeof AUTHORIZED_APP_IDS)[number];

export interface DomainPolicyInput {
  readonly appId: string;
  readonly url: string;
}

export interface DomainPolicyDecision {
  readonly allowed: boolean;
  readonly reason: "owned-domain" | "domain-not-authorized";
}

export interface RunPolicyInput {
  readonly tenantId: string;
  readonly appId: string;
  readonly fixtureId: string;
  readonly requestedCapabilities: readonly string[];
}

export interface RunPolicyDecision {
  readonly allowed: boolean;
  readonly policyVersion: typeof POLICY_VERSION;
  readonly checks: readonly string[];
}

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.3/7.6 not implemented: ${operation}`);
}

export function evaluateDomainPolicy(
  _input: DomainPolicyInput
): DomainPolicyDecision {
  return notImplemented("evaluateDomainPolicy");
}

export function evaluateRunPolicy(_input: RunPolicyInput): RunPolicyDecision {
  return notImplemented("evaluateRunPolicy");
}
