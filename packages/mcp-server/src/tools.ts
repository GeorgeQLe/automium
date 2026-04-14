import type { AutomiumMcpToolDescriptor } from "./schemas";

export const automiumMcpToolDescriptors = [
  {
    name: "automium_list_apps",
    title: "List Automium benchmark apps",
    description: "Return authorized checked-in owned benchmark apps.",
    readOnly: true,
    modeled: false
  },
  {
    name: "automium_list_fixtures",
    title: "List Automium benchmark fixtures",
    description: "Return checked-in benchmark fixtures, optionally filtered by app.",
    readOnly: true,
    modeled: false
  },
  {
    name: "automium_compile_journey",
    title: "Compile an Automium journey",
    description: "Validate and compile a journey without browser execution.",
    readOnly: true,
    modeled: true
  },
  {
    name: "automium_create_run_submission",
    title: "Create modeled run submission",
    description: "Create a contract-shaped run submission without queueing work.",
    readOnly: true,
    modeled: true
  },
  {
    name: "automium_get_replay_summary",
    title: "Get modeled replay summary",
    description: "Build a replay summary from caller-provided run metadata.",
    readOnly: true,
    modeled: true
  },
  {
    name: "automium_get_artifact_manifest",
    title: "Get modeled artifact manifest",
    description: "Build an artifact manifest from caller-provided entries.",
    readOnly: true,
    modeled: true
  },
  {
    name: "automium_compare_planners",
    title: "Compare planner backends",
    description: "Create a modeled benchmark comparison report.",
    readOnly: true,
    modeled: true
  }
] as const satisfies readonly AutomiumMcpToolDescriptor[];
