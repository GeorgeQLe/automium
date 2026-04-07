export interface BenchmarkCorpusManifest {
  readonly version: string;
  readonly authorizedApps: readonly AuthorizedBenchmarkApp[];
  readonly environmentProfiles: readonly BenchmarkEnvironmentProfile[];
  readonly fixtureManifest: readonly BenchmarkFixtureDefinition[];
  readonly journeys: readonly BenchmarkJourneyDefinition[];
}

export type AuthorizedBenchmarkAppId =
  | "foundry"
  | "altitude"
  | "switchboard"
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
    id: "foundry",
    displayName: "Foundry",
    hosting: "owned-fixture",
    rationale:
      "Owned internal app builder benchmark for published-app runtime and CRUD flows.",
    supportedCapabilities: [
      "login",
      "published-app-runtime",
      "datasource-bindings",
      "forms",
      "table-crud"
    ]
  },
  {
    id: "altitude",
    displayName: "Altitude",
    hosting: "owned-fixture",
    rationale:
      "Owned project-planning workspace benchmark for work-item and attachment flows.",
    supportedCapabilities: [
      "login",
      "dashboard",
      "work-items",
      "forms",
      "attachments",
      "planning-views"
    ]
  },
  {
    id: "switchboard",
    displayName: "Switchboard",
    hosting: "owned-fixture",
    rationale:
      "Owned support workspace benchmark for inbox routing and recovery workflows.",
    supportedCapabilities: [
      "login",
      "shared-inbox",
      "conversation-routing",
      "attachments",
      "automation"
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
    id: "foundry-baseline-builder",
    appId: "foundry",
    environmentProfileId: "owned-baseline",
    seedRef: "fixtures/foundry/published-orders-app-seed.json",
    accountRef: "accounts/foundry/builder-admin.json",
    artifactRoot: "artifacts/foundry/baseline"
  },
  {
    id: "altitude-upload-member",
    appId: "altitude",
    environmentProfileId: "owned-upload",
    seedRef: "fixtures/altitude/project-attachment-seed.json",
    accountRef: "accounts/altitude/member.json",
    artifactRoot: "artifacts/altitude/upload"
  },
  {
    id: "switchboard-session-agent",
    appId: "switchboard",
    environmentProfileId: "owned-session-churn",
    seedRef: "fixtures/switchboard/session-recovery-seed.json",
    accountRef: "accounts/switchboard/agent.json",
    artifactRoot: "artifacts/switchboard/session"
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
    id: "foundry-open-published-orders-app",
    appId: "foundry",
    environmentProfileId: "owned-baseline",
    fixtureId: "foundry-baseline-builder",
    category: "dashboard",
    expectedVerdict: "pass",
    deterministicKey: "foundry-open-published-orders-app"
  },
  {
    id: "altitude-create-work-item-with-attachment",
    appId: "altitude",
    environmentProfileId: "owned-upload",
    fixtureId: "altitude-upload-member",
    category: "upload",
    expectedVerdict: "pass",
    deterministicKey: "altitude-create-work-item-with-attachment"
  },
  {
    id: "switchboard-session-recovery",
    appId: "switchboard",
    environmentProfileId: "owned-session-churn",
    fixtureId: "switchboard-session-agent",
    category: "authentication",
    expectedVerdict: "pass",
    deterministicKey: "switchboard-session-recovery"
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
