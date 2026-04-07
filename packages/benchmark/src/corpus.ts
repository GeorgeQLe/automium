export interface BenchmarkCorpusManifest {
  readonly version: string;
  readonly authorizedApps: readonly AuthorizedBenchmarkApp[];
  readonly environmentProfiles: readonly BenchmarkEnvironmentProfile[];
  readonly fixtureManifest: readonly BenchmarkFixtureDefinition[];
  readonly journeys: readonly BenchmarkJourneyDefinition[];
}

export type AuthorizedBenchmarkAppId =
  | "appsmith"
  | "plane"
  | "chatwoot"
  | "iframe-fixture";

export type BenchmarkEnvironmentProfileId =
  | "owned-baseline"
  | "owned-upload"
  | "owned-session-churn"
  | "owned-iframe";

export interface AuthorizedBenchmarkApp {
  readonly id: AuthorizedBenchmarkAppId;
  readonly displayName: string;
  readonly hosting: "self-hosted" | "owned-fixture";
  readonly rationale: string;
  readonly supportedCapabilities: readonly string[];
}

export interface BenchmarkEnvironmentProfile {
  readonly id: BenchmarkEnvironmentProfileId;
  readonly displayName: string;
  readonly description: string;
  readonly deterministicControls: readonly string[];
}

export interface BenchmarkFixtureDefinition {
  readonly id: string;
  readonly appId: AuthorizedBenchmarkAppId;
  readonly environmentProfileId: BenchmarkEnvironmentProfileId;
  readonly seedRef: string;
  readonly accountRef: string;
  readonly artifactRoot: string;
}

export interface BenchmarkJourneyDefinition {
  readonly id: string;
  readonly appId: AuthorizedBenchmarkAppId;
  readonly environmentProfileId: BenchmarkEnvironmentProfileId;
  readonly fixtureId: string;
  readonly category: "authentication" | "dashboard" | "crud" | "upload" | "iframe";
  readonly expectedVerdict: "pass" | "unsupported";
  readonly deterministicKey: string;
}

export const BENCHMARK_CORPUS_VERSION = "v1";

export const authorizedBenchmarkApps = [
  {
    id: "appsmith",
    displayName: "Appsmith",
    hosting: "self-hosted",
    rationale: "Baseline authenticated dashboard and CRUD benchmark.",
    supportedCapabilities: [
      "login",
      "dashboard",
      "forms",
      "table-crud",
      "spa-navigation"
    ]
  },
  {
    id: "plane",
    displayName: "Plane",
    hosting: "self-hosted",
    rationale: "Richer project-management SPA with multi-view work-item flows.",
    supportedCapabilities: [
      "login",
      "dashboard",
      "crud",
      "forms",
      "attachments",
      "spa-navigation"
    ]
  },
  {
    id: "chatwoot",
    displayName: "Chatwoot",
    hosting: "self-hosted",
    rationale: "Support workflow benchmark with inboxes, attachments, and embeds.",
    supportedCapabilities: [
      "login",
      "dashboard",
      "forms",
      "attachments",
      "embedded-widget"
    ]
  },
  {
    id: "iframe-fixture",
    displayName: "Iframe Fixture App",
    hosting: "owned-fixture",
    rationale: "Controlled iframe and session edge-case benchmark surface.",
    supportedCapabilities: [
      "iframe",
      "session-expiry",
      "cross-frame-navigation"
    ]
  }
] as const satisfies readonly AuthorizedBenchmarkApp[];

export const benchmarkEnvironmentProfiles = [
  {
    id: "owned-baseline",
    displayName: "Owned Baseline",
    description:
      "Stable seeded data, deterministic credentials, and long-lived sessions.",
    deterministicControls: [
      "fixed-seed-data",
      "stable-timezone",
      "known-credentials",
      "disabled-mfa"
    ]
  },
  {
    id: "owned-upload",
    displayName: "Owned Upload",
    description:
      "Baseline environment with file-attachment storage and upload fixtures enabled.",
    deterministicControls: [
      "fixed-seed-data",
      "known-credentials",
      "stable-object-storage",
      "fixed-upload-fixtures"
    ]
  },
  {
    id: "owned-session-churn",
    displayName: "Owned Session Churn",
    description:
      "Controlled short-lived sessions for re-authentication and recovery validation.",
    deterministicControls: [
      "known-credentials",
      "short-session-ttl",
      "stable-timezone"
    ]
  },
  {
    id: "owned-iframe",
    displayName: "Owned Iframe",
    description:
      "Controlled iframe embedding environment for cross-frame interaction coverage.",
    deterministicControls: [
      "same-origin-frame",
      "fixed-seed-data",
      "known-credentials"
    ]
  }
] as const satisfies readonly BenchmarkEnvironmentProfile[];

export const benchmarkFixtureManifest = [
  {
    id: "appsmith-baseline-admin",
    appId: "appsmith",
    environmentProfileId: "owned-baseline",
    seedRef: "fixtures/appsmith/baseline-seed.json",
    accountRef: "accounts/appsmith/admin.json",
    artifactRoot: "artifacts/appsmith/baseline"
  },
  {
    id: "plane-upload-member",
    appId: "plane",
    environmentProfileId: "owned-upload",
    seedRef: "fixtures/plane/upload-seed.json",
    accountRef: "accounts/plane/member.json",
    artifactRoot: "artifacts/plane/upload"
  },
  {
    id: "chatwoot-session-agent",
    appId: "chatwoot",
    environmentProfileId: "owned-session-churn",
    seedRef: "fixtures/chatwoot/session-seed.json",
    accountRef: "accounts/chatwoot/agent.json",
    artifactRoot: "artifacts/chatwoot/session"
  },
  {
    id: "iframe-fixture-operator",
    appId: "iframe-fixture",
    environmentProfileId: "owned-iframe",
    seedRef: "fixtures/iframe-fixture/default-seed.json",
    accountRef: "accounts/iframe-fixture/operator.json",
    artifactRoot: "artifacts/iframe-fixture/owned-iframe"
  }
] as const satisfies readonly BenchmarkFixtureDefinition[];

export const benchmarkJourneys = [
  {
    id: "appsmith-login-dashboard",
    appId: "appsmith",
    environmentProfileId: "owned-baseline",
    fixtureId: "appsmith-baseline-admin",
    category: "dashboard",
    expectedVerdict: "pass",
    deterministicKey: "appsmith-login-dashboard"
  },
  {
    id: "plane-create-work-item-with-attachment",
    appId: "plane",
    environmentProfileId: "owned-upload",
    fixtureId: "plane-upload-member",
    category: "upload",
    expectedVerdict: "pass",
    deterministicKey: "plane-create-work-item-with-attachment"
  },
  {
    id: "chatwoot-session-recovery",
    appId: "chatwoot",
    environmentProfileId: "owned-session-churn",
    fixtureId: "chatwoot-session-agent",
    category: "authentication",
    expectedVerdict: "pass",
    deterministicKey: "chatwoot-session-recovery"
  },
  {
    id: "iframe-fixture-embedded-form-submit",
    appId: "iframe-fixture",
    environmentProfileId: "owned-iframe",
    fixtureId: "iframe-fixture-operator",
    category: "iframe",
    expectedVerdict: "pass",
    deterministicKey: "iframe-fixture-embedded-form-submit"
  }
] as const satisfies readonly BenchmarkJourneyDefinition[];

export const benchmarkCorpusManifest: BenchmarkCorpusManifest = {
  version: BENCHMARK_CORPUS_VERSION,
  authorizedApps: authorizedBenchmarkApps,
  environmentProfiles: benchmarkEnvironmentProfiles,
  fixtureManifest: benchmarkFixtureManifest,
  journeys: benchmarkJourneys
};
