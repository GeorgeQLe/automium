import { BENCHMARK_CORPUS_VERSION } from "../../benchmark/src/corpus";
import { PLANNER_INTENT_VOCABULARY } from "../../contracts/src/planner-adapter";

import { AutomiumMcpError } from "./errors";
import type { AutomiumMcpServer } from "./server";
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

export interface AutomiumMcpPromptMessage {
  readonly role: "user" | "assistant" | "system";
  readonly content: { readonly type: "text"; readonly text: string };
}

export interface AutomiumMcpPromptPayload {
  readonly messages: readonly AutomiumMcpPromptMessage[];
}

const MODELED_V1_DISCLAIMER =
  "Automium MCP v1 outputs are modeled only: no live browser execution, no provider calls, no production artifact retrieval, no credential access.";

function requireNonEmptyString(
  args: Record<string, unknown>,
  key: string
): string {
  const value = args[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Automium MCP prompt requires a non-empty string for "${key}".`
    );
  }
  return value;
}

function requireNonEmptyArray(
  args: Record<string, unknown>,
  key: string
): readonly unknown[] {
  const value = args[key];
  if (!Array.isArray(value) || value.length === 0) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Automium MCP prompt requires a non-empty array for "${key}".`
    );
  }
  return value;
}

function asArgRecord(args: unknown): Record<string, unknown> {
  if (args === null || typeof args !== "object") {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "Automium MCP prompt requires a structured arguments object."
    );
  }
  return args as Record<string, unknown>;
}

function message(
  role: AutomiumMcpPromptMessage["role"],
  text: string
): AutomiumMcpPromptMessage {
  return { role, content: { type: "text", text } };
}

function buildDraftJourneyPrompt(
  args: Record<string, unknown>
): AutomiumMcpPromptPayload {
  const appId = requireNonEmptyString(args, "appId");
  const fixtureId = requireNonEmptyString(args, "fixtureId");
  const intent = requireNonEmptyString(args, "intent");
  const goal = requireNonEmptyString(args, "goal");

  const intentVocabulary = [...PLANNER_INTENT_VOCABULARY].join(", ");

  return {
    messages: [
      message(
        "system",
        `Draft a journey for the owned Automium benchmark corpus (version ${BENCHMARK_CORPUS_VERSION}). Use only authorized apps and checked-in fixtures; do not invent apps, fixtures, or live targets.`
      ),
      message(
        "user",
        `Target appId: ${appId}\nFixture fixtureId: ${fixtureId}\nDesired intent: ${intent}\nGoal: ${goal}`
      ),
      message(
        "assistant",
        `Describe the journey as a modeled specification for the named fixture: each step's intent must be drawn from the frozen planner intent vocabulary: ${intentVocabulary}. Every journey must include bounded recovery (maxAttempts, strategy) and assertions sourced from the fixture. Reference fixture identifiers only — do not describe opening, launching, navigating, clicking, or typing against any live target.`
      ),
      message("system", MODELED_V1_DISCLAIMER)
    ]
  };
}

function buildDebugFailedRunPrompt(
  args: Record<string, unknown>
): AutomiumMcpPromptPayload {
  const runId = requireNonEmptyString(args, "runId");
  const artifactManifestRef = requireNonEmptyString(args, "artifactManifestRef");
  const verdict = requireNonEmptyString(args, "verdict");

  return {
    messages: [
      message(
        "system",
        "Guide replay and artifact interpretation for a failed Automium run. Reason only about checked-in replay events and artifact manifests; do not claim production artifact retrieval or credential access."
      ),
      message(
        "user",
        `Failing runId: ${runId}\nVerdict: ${verdict}\nArtifact manifest reference: ${artifactManifestRef}`
      ),
      message(
        "assistant",
        "Read the checked-in replay event log in phase order, correlating each phase with entries in the checked-in artifact manifest. Identify the first divergence between expected and observed state. Propose bounded recovery: a concrete retry strategy with an explicit maxAttempts cap, scoped to the replay evidence — no live retries, no log streaming, no credential access, no unbounded recovery loops."
      ),
      message("system", MODELED_V1_DISCLAIMER)
    ]
  };
}

function buildComparePlannerBackendsPrompt(
  args: Record<string, unknown>
): AutomiumMcpPromptPayload {
  const appIds = requireNonEmptyArray(args, "appIds");
  const planners = requireNonEmptyArray(args, "planners");
  const corpusVersion = requireNonEmptyString(args, "corpusVersion");

  const appIdList = appIds
    .map((value) => (typeof value === "string" ? value : JSON.stringify(value)))
    .join(", ");
  const plannerList = planners
    .map((value) => {
      if (value && typeof value === "object" && "id" in value) {
        const planner = value as { id?: unknown };
        return typeof planner.id === "string" ? planner.id : JSON.stringify(value);
      }
      return JSON.stringify(value);
    })
    .join(", ");

  return {
    messages: [
      message(
        "system",
        "Guide a modeled comparePlannerBackends comparison across the owned Automium benchmark corpus. All outputs are modeled — no provider calls, no live browser execution, no queued runs."
      ),
      message(
        "user",
        `Corpus version: ${corpusVersion}\nApp ids: ${appIdList}\nPlanner references: ${plannerList}`
      ),
      message(
        "assistant",
        "Frame comparePlannerBackends as a modeled aggregation over the corpus: success rate, intent-vocabulary coverage, and recovery-budget usage per planner reference. Treat planner entries as identifiers only — do not call, invoke, execute, or run any planner, and do not contact any provider API."
      ),
      message("system", MODELED_V1_DISCLAIMER)
    ]
  };
}

export function registerAutomiumMcpPrompts(server: AutomiumMcpServer): void {
  for (const descriptor of automiumMcpPromptDescriptors) {
    server.sdkServer.prompt(descriptor.name, descriptor.description, async (_extra) => {
      const payload = getAutomiumMcpPrompt(server, descriptor.name, {});
      return {
        messages: payload.messages.map((msg) => ({
          role: (msg.role === "system" ? "user" : msg.role) as "user" | "assistant",
          content: msg.content
        }))
      };
    });
  }
}

export function getAutomiumMcpPrompt(
  _server: AutomiumMcpServer,
  name: string,
  args: unknown
): AutomiumMcpPromptPayload {
  const argRecord = asArgRecord(args);
  switch (name) {
    case "draft_journey":
      return buildDraftJourneyPrompt(argRecord);
    case "debug_failed_run":
      return buildDebugFailedRunPrompt(argRecord);
    case "compare_planner_backends":
      return buildComparePlannerBackendsPrompt(argRecord);
    default:
      throw new AutomiumMcpError(
        "unsupported_v1_operation",
        `Unsupported Automium MCP prompt name: ${name}`
      );
  }
}
