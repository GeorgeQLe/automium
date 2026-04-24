import {
  authorizedBenchmarkApps,
  benchmarkFixtureManifest
} from "../../benchmark/src/corpus";
import {
  PLANNER_INTENT_VOCABULARY,
  plannerAdapterMetadataFields,
  plannerAdapterRequiredMethods
} from "../../contracts/src/planner-adapter";
import {
  REPLAY_EVENT_SCHEMA_VERSION,
  replayEventPhaseOrder,
  replayEventRequiredFields
} from "../../contracts/src/replay-event";
import {
  SEMANTIC_SNAPSHOT_SCHEMA_VERSION,
  interactiveElementRequiredFields,
  semanticSnapshotRequiredFields
} from "../../contracts/src/semantic-snapshot";

import { AutomiumMcpError } from "./errors";
import type { AutomiumMcpServer } from "./server";
import type { AutomiumMcpResourceDescriptor } from "./schemas";

export const automiumMcpResourceDescriptors = [
  {
    uri: "automium://apps",
    title: "Automium benchmark apps",
    description: "Authorized benchmark apps and supported capabilities.",
    mimeType: "application/json"
  },
  {
    uri: "automium://fixtures",
    title: "Automium benchmark fixtures",
    description: "Benchmark fixtures and environment profiles.",
    mimeType: "application/json"
  },
  {
    uri: "automium://contracts/planner-adapter-v1",
    title: "Planner adapter contract",
    description: "Planner adapter v1 contract summary.",
    mimeType: "application/json"
  },
  {
    uri: "automium://contracts/replay-event-v1",
    title: "Replay event contract",
    description: "Replay event v1 contract summary.",
    mimeType: "application/json"
  },
  {
    uri: "automium://contracts/semantic-snapshot-v1",
    title: "Semantic snapshot contract",
    description: "Semantic snapshot v1 contract summary.",
    mimeType: "application/json"
  }
] as const satisfies readonly AutomiumMcpResourceDescriptor[];

export interface AutomiumMcpAppsResourcePayload {
  readonly authorizedBenchmarkApps: readonly {
    readonly id: string;
    readonly name: string;
    readonly kind: string;
    readonly environmentProfileId: string;
    readonly supportedCapabilities: readonly string[];
    readonly rationale: string;
  }[];
}

export interface AutomiumMcpFixturesResourcePayload {
  readonly benchmarkFixtureManifest: readonly {
    readonly id: string;
    readonly appId: string;
    readonly description: string;
    readonly environmentProfileId: string;
    readonly seedRef: string;
    readonly accountRef: string;
    readonly artifactRoot: string;
  }[];
}

export interface AutomiumMcpPlannerAdapterResourcePayload {
  readonly intentVocabulary: readonly string[];
  readonly intentSchemaVersion: string;
  readonly requiredMethods: readonly string[];
  readonly metadataFields: readonly string[];
}

export interface AutomiumMcpReplayEventResourcePayload {
  readonly schemaVersion: string;
  readonly requiredFields: readonly string[];
  readonly phases: readonly string[];
}

export interface AutomiumMcpSemanticSnapshotResourcePayload {
  readonly schemaVersion: string;
  readonly requiredFields: readonly string[];
  readonly interactiveElementRequiredFields: readonly string[];
}

export type AutomiumMcpResourcePayload =
  | AutomiumMcpAppsResourcePayload
  | AutomiumMcpFixturesResourcePayload
  | AutomiumMcpPlannerAdapterResourcePayload
  | AutomiumMcpReplayEventResourcePayload
  | AutomiumMcpSemanticSnapshotResourcePayload;

function buildAppsPayload(): AutomiumMcpAppsResourcePayload {
  return {
    authorizedBenchmarkApps: authorizedBenchmarkApps.map((app) => {
      const fixture = benchmarkFixtureManifest.find(
        (entry) => entry.appId === app.id
      );
      if (!fixture) {
        throw new AutomiumMcpError(
          "unsupported_v1_operation",
          `Benchmark corpus is missing a fixture for authorized app "${app.id}".`
        );
      }
      return {
        id: app.id,
        name: app.displayName,
        kind: app.hosting,
        environmentProfileId: fixture.environmentProfileId,
        supportedCapabilities: [...app.supportedCapabilities],
        rationale: app.rationale
      };
    })
  };
}

function buildFixturesPayload(): AutomiumMcpFixturesResourcePayload {
  return {
    benchmarkFixtureManifest: benchmarkFixtureManifest.map((fixture) => ({
      id: fixture.id,
      appId: fixture.appId,
      description: `Fixture ${fixture.id} for app ${fixture.appId} on environment profile ${fixture.environmentProfileId}.`,
      environmentProfileId: fixture.environmentProfileId,
      seedRef: fixture.seedRef,
      accountRef: fixture.accountRef,
      artifactRoot: fixture.artifactRoot
    }))
  };
}

function buildPlannerAdapterPayload(): AutomiumMcpPlannerAdapterResourcePayload {
  return {
    intentVocabulary: [...PLANNER_INTENT_VOCABULARY],
    intentSchemaVersion: "v1",
    requiredMethods: [...plannerAdapterRequiredMethods],
    metadataFields: [...plannerAdapterMetadataFields]
  };
}

function buildReplayEventPayload(): AutomiumMcpReplayEventResourcePayload {
  return {
    schemaVersion: REPLAY_EVENT_SCHEMA_VERSION,
    requiredFields: [...replayEventRequiredFields],
    phases: [...replayEventPhaseOrder]
  };
}

function buildSemanticSnapshotPayload(): AutomiumMcpSemanticSnapshotResourcePayload {
  return {
    schemaVersion: SEMANTIC_SNAPSHOT_SCHEMA_VERSION,
    requiredFields: [...semanticSnapshotRequiredFields],
    interactiveElementRequiredFields: [...interactiveElementRequiredFields]
  };
}

export function registerAutomiumMcpResources(server: AutomiumMcpServer): void {
  for (const descriptor of automiumMcpResourceDescriptors) {
    server.sdkServer.resource(
      descriptor.title,
      descriptor.uri,
      { description: descriptor.description, mimeType: descriptor.mimeType },
      async (uri: URL) => ({
        contents: [{
          uri: uri.href,
          mimeType: descriptor.mimeType,
          text: JSON.stringify(readAutomiumMcpResource(server, descriptor.uri))
        }]
      })
    );
  }
}

export function readAutomiumMcpResource(
  _server: AutomiumMcpServer,
  uri: string
): AutomiumMcpResourcePayload {
  switch (uri) {
    case "automium://apps":
      return buildAppsPayload();
    case "automium://fixtures":
      return buildFixturesPayload();
    case "automium://contracts/planner-adapter-v1":
      return buildPlannerAdapterPayload();
    case "automium://contracts/replay-event-v1":
      return buildReplayEventPayload();
    case "automium://contracts/semantic-snapshot-v1":
      return buildSemanticSnapshotPayload();
    default:
      throw new AutomiumMcpError(
        "unsupported_resource_uri",
        `Unsupported Automium MCP resource URI: ${uri}`
      );
  }
}
