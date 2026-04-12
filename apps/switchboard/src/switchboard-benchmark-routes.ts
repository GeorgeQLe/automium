import type { SwitchboardBenchmarkRoute } from "./switchboard-domain";

export type SwitchboardBenchmarkRouteId =
  | "inbox-administration"
  | "conversation-list"
  | "active-conversation"
  | "notes-collaboration"
  | "operator-shortcuts"
  | "automation-rules"
  | "reporting";

export type SwitchboardBenchmarkJourneyRoute = SwitchboardBenchmarkRoute & {
  id: SwitchboardBenchmarkRouteId;
  requiredSeedKeys: string[];
};

export const SWITCHBOARD_BENCHMARK_ROUTES: readonly SwitchboardBenchmarkJourneyRoute[] = [
  {
    id: "inbox-administration",
    path: "/switchboard/inboxes",
    name: "Inbox administration",
    requiredSeedKeys: ["account", "teams", "channels", "inboxes"],
  },
  {
    id: "conversation-list",
    path: "/switchboard/conversations",
    name: "Conversation list",
    requiredSeedKeys: ["account", "operators", "inboxes", "conversations"],
  },
  {
    id: "active-conversation",
    path: "/switchboard/conversations/conv_website_001",
    name: "Active conversation",
    requiredSeedKeys: ["contacts", "conversations", "messages", "assignments"],
  },
  {
    id: "notes-collaboration",
    path: "/switchboard/conversations/conv_website_001/notes",
    name: "Notes and collaboration",
    requiredSeedKeys: ["operators", "supervisor", "notes", "collaborators"],
  },
  {
    id: "operator-shortcuts",
    path: "/switchboard/shortcuts",
    name: "Operator shortcuts",
    requiredSeedKeys: ["cannedResponses", "macros", "labels"],
  },
  {
    id: "automation-rules",
    path: "/switchboard/automation/rules",
    name: "Automation rules",
    requiredSeedKeys: ["automationRules", "teams", "labels"],
  },
  {
    id: "reporting",
    path: "/switchboard/reports/operations",
    name: "Reporting",
    requiredSeedKeys: ["reportSummary", "conversations", "messages"],
  },
];
