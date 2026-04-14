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
