import type { AutomiumMcpPromptDescriptor } from "./schemas";

export const automiumMcpPromptDescriptors = [
  {
    name: "draft_journey",
    title: "Draft Automium journey",
    description: "Guide a coding agent to draft a valid owned-corpus journey.",
    requiredArguments: ["appId", "fixtureId", "goal"]
  },
  {
    name: "debug_failed_run",
    title: "Debug failed Automium run",
    description: "Guide replay and artifact interpretation for a failed run.",
    requiredArguments: ["runId", "verdict", "artifactManifestRef"]
  },
  {
    name: "compare_planner_backends",
    title: "Compare Automium planner backends",
    description: "Guide modeled planner comparison against the owned corpus.",
    requiredArguments: ["appIds", "planners", "repetitions"]
  }
] as const satisfies readonly AutomiumMcpPromptDescriptor[];
