export const AUTOMIUM_MCP_API_VERSION = "v1";
export const AUTOMIUM_MCP_SERVER_NAME = "automium";
export const AUTOMIUM_MCP_SERVER_VERSION = "0.1.0";

export const AUTOMIUM_MCP_TRANSPORTS = ["stdio"] as const;

export const AUTOMIUM_MCP_TOOL_NAMES = [
  "automium_list_apps",
  "automium_list_fixtures",
  "automium_compile_journey",
  "automium_create_run_submission",
  "automium_get_replay_summary",
  "automium_get_artifact_manifest",
  "automium_compare_planners"
] as const;

export const AUTOMIUM_MCP_RESOURCE_URIS = [
  "automium://apps",
  "automium://fixtures",
  "automium://contracts/planner-adapter-v1",
  "automium://contracts/replay-event-v1",
  "automium://contracts/semantic-snapshot-v1"
] as const;

export const AUTOMIUM_MCP_PROMPT_NAMES = [
  "draft_journey",
  "debug_failed_run",
  "compare_planner_backends"
] as const;

export type AutomiumMcpTransport = (typeof AUTOMIUM_MCP_TRANSPORTS)[number];
export type AutomiumMcpToolName = (typeof AUTOMIUM_MCP_TOOL_NAMES)[number];
export type AutomiumMcpResourceUri = (typeof AUTOMIUM_MCP_RESOURCE_URIS)[number];
export type AutomiumMcpPromptName = (typeof AUTOMIUM_MCP_PROMPT_NAMES)[number];

export interface AutomiumMcpDescriptor {
  readonly title: string;
  readonly description: string;
}

export interface AutomiumMcpToolDescriptor extends AutomiumMcpDescriptor {
  readonly name: AutomiumMcpToolName;
  readonly readOnly: true;
  readonly modeled: boolean;
}

export interface AutomiumMcpResourceDescriptor extends AutomiumMcpDescriptor {
  readonly uri: AutomiumMcpResourceUri;
  readonly mimeType: "application/json" | "text/markdown";
}

export interface AutomiumMcpPromptDescriptor extends AutomiumMcpDescriptor {
  readonly name: AutomiumMcpPromptName;
  readonly requiredArguments: readonly string[];
}

export interface AutomiumMcpCapabilities {
  readonly apiVersion: typeof AUTOMIUM_MCP_API_VERSION;
  readonly serverName: typeof AUTOMIUM_MCP_SERVER_NAME;
  readonly serverVersion: typeof AUTOMIUM_MCP_SERVER_VERSION;
  readonly transports: readonly AutomiumMcpTransport[];
  readonly tools: readonly AutomiumMcpToolDescriptor[];
  readonly resources: readonly AutomiumMcpResourceDescriptor[];
  readonly prompts: readonly AutomiumMcpPromptDescriptor[];
}

export interface AutomiumModeledOutputMetadata {
  readonly modeled: true;
  readonly liveBrowserExecuted: false;
  readonly providerCallsMade: false;
  readonly filesystemMutated: false;
}

export interface AutomiumPlannerReference {
  readonly id: string;
  readonly vendor: string;
  readonly model: string;
}

export interface AutomiumJourneyStepInput {
  readonly intent: string;
  readonly target: string;
  readonly value?: string;
}

export interface AutomiumJourneyAssertionInput {
  readonly id: string;
  readonly type: string;
  readonly target: string;
}

export interface AutomiumJourneyRecoveryInput {
  readonly maxAttempts: number;
  readonly strategy: string;
}

export interface AutomiumCompileJourneyInput {
  readonly id: string;
  readonly appId: string;
  readonly fixtureId: string;
  readonly goal: string;
  readonly steps: readonly AutomiumJourneyStepInput[];
  readonly assertions: readonly AutomiumJourneyAssertionInput[];
  readonly recovery: AutomiumJourneyRecoveryInput;
}

export interface AutomiumReplaySummaryInput {
  readonly runId: string;
  readonly verdict: string;
  readonly retryCount: number;
  readonly artifactManifestRef: string;
}

export interface AutomiumArtifactManifestEntryInput {
  readonly kind: string;
  readonly path: string;
}

export interface AutomiumArtifactManifestInput {
  readonly runId: string;
  readonly root: string;
  readonly entries: readonly AutomiumArtifactManifestEntryInput[];
}

export interface AutomiumComparePlannersInput {
  readonly corpusVersion: string;
  readonly appIds: readonly string[];
  readonly planners: readonly AutomiumPlannerReference[];
  readonly repetitions: number;
}
