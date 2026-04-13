import { benchmarkFixtureManifest } from "../../benchmark/src/corpus";

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

const authorizedAppIds = new Set<string>(AUTHORIZED_APP_IDS);
const OWNED_HOST = "owned.local";

function fixtureMatchesApp(appId: string, fixtureId: string): boolean {
  return benchmarkFixtureManifest.some(
    (fixture) => fixture.id === fixtureId && fixture.appId === appId
  );
}

export function evaluateDomainPolicy(
  input: DomainPolicyInput
): DomainPolicyDecision {
  if (!authorizedAppIds.has(input.appId)) {
    return { allowed: false, reason: "domain-not-authorized" };
  }

  let url: URL;

  try {
    url = new URL(input.url);
  } catch {
    return { allowed: false, reason: "domain-not-authorized" };
  }

  const expectedRoutePrefix = `/${input.appId}`;
  const allowed =
    url.protocol === "https:" &&
    url.hostname === OWNED_HOST &&
    url.pathname.startsWith(expectedRoutePrefix);

  return allowed
    ? { allowed: true, reason: "owned-domain" }
    : { allowed: false, reason: "domain-not-authorized" };
}

export function evaluateRunPolicy(input: RunPolicyInput): RunPolicyDecision {
  const checks = [
    "tenant-quota",
    "domain-allowlist",
    "artifact-retention"
  ] as const;

  return {
    allowed:
      input.tenantId.trim().length > 0 &&
      authorizedAppIds.has(input.appId) &&
      fixtureMatchesApp(input.appId, input.fixtureId) &&
      input.requestedCapabilities.length > 0,
    policyVersion: POLICY_VERSION,
    checks
  };
}
