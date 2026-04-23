import {
  authorizedBenchmarkApps,
  benchmarkFixtureManifest,
  type AuthorizedBenchmarkApp,
  type AuthorizedBenchmarkAppId,
  type BenchmarkFixtureDefinition
} from "../../benchmark/src/corpus";
import { PLANNER_INTENT_VOCABULARY } from "../../contracts/src/planner-adapter";
import {
  compileJourneyDefinition,
  type CompiledJourneyDefinition,
  type JourneyAssertionDefinition,
  type JourneyDefinition,
  type JourneyRecoveryDefinition,
  type JourneyStepDefinition
} from "../../../apps/control-plane/src/control-plane-domain";

import { AutomiumMcpError } from "./errors";
import type { AutomiumMcpServer } from "./server";
import type { AutomiumMcpToolDescriptor } from "./schemas";

const modeledMetadata = {
  modeled: true as const,
  liveBrowserExecuted: false as const,
  providerCallsMade: false as const,
  filesystemMutated: false as const
};

const supportedPlannerIntents = new Set<string>(PLANNER_INTENT_VOCABULARY);

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readOptionalString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Expected ${key} to be a string.`
    );
  }
  return value;
}

function assertAuthorizedAppId(appId: string): AuthorizedBenchmarkAppId {
  const match = authorizedBenchmarkApps.find((app) => app.id === appId);
  if (!match) {
    throw new AutomiumMcpError(
      "invalid_app_id",
      `App id "${appId}" is not in the authorized benchmark corpus.`
    );
  }
  return match.id;
}

interface ListAppsResult {
  readonly apps: readonly AuthorizedBenchmarkApp[];
}

function handleListApps(args: unknown): ListAppsResult {
  const record = args === undefined ? {} : args;
  if (!isPlainObject(record)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_list_apps arguments must be an object."
    );
  }

  const appId = readOptionalString(record, "appId");
  if (appId !== undefined) {
    const authorized = assertAuthorizedAppId(appId);
    return {
      apps: authorizedBenchmarkApps.filter((app) => app.id === authorized)
    };
  }

  return { apps: authorizedBenchmarkApps };
}

interface ListFixturesResult {
  readonly fixtures: readonly BenchmarkFixtureDefinition[];
}

function handleListFixtures(args: unknown): ListFixturesResult {
  const record = args === undefined ? {} : args;
  if (!isPlainObject(record)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_list_fixtures arguments must be an object."
    );
  }

  const appId = readOptionalString(record, "appId");
  const fixtureId = readOptionalString(record, "fixtureId");

  let fixtures: readonly BenchmarkFixtureDefinition[] = benchmarkFixtureManifest;

  if (appId !== undefined) {
    const authorized = assertAuthorizedAppId(appId);
    fixtures = fixtures.filter((fixture) => fixture.appId === authorized);
  }

  if (fixtureId !== undefined) {
    const match = benchmarkFixtureManifest.find((fixture) => fixture.id === fixtureId);
    if (!match) {
      throw new AutomiumMcpError(
        "fixture_app_mismatch",
        `Fixture "${fixtureId}" is not in the benchmark corpus.`
      );
    }
    if (appId !== undefined && match.appId !== appId) {
      throw new AutomiumMcpError(
        "fixture_app_mismatch",
        `Fixture "${fixtureId}" does not belong to app "${appId}".`
      );
    }
    fixtures = fixtures.filter((fixture) => fixture.id === fixtureId);
  }

  return { fixtures };
}

function readRequiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Expected ${key} to be a string.`
    );
  }
  return value;
}

function readArray(record: Record<string, unknown>, key: string): readonly unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Expected ${key} to be an array.`
    );
  }
  return value;
}

function parseJourneyStep(raw: unknown, index: number): JourneyStepDefinition {
  if (!isPlainObject(raw)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Journey step ${index + 1} must be an object.`
    );
  }
  const intent = readRequiredString(raw, "intent");
  const target = readRequiredString(raw, "target");
  const valueField = raw.value;
  if (valueField !== undefined && typeof valueField !== "string") {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Journey step ${index + 1} value must be a string when provided.`
    );
  }
  return valueField === undefined
    ? { intent, target }
    : { intent, target, value: valueField };
}

function parseJourneyAssertion(raw: unknown, index: number): JourneyAssertionDefinition {
  if (!isPlainObject(raw)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Journey assertion ${index + 1} must be an object.`
    );
  }
  return {
    id: readRequiredString(raw, "id"),
    type: readRequiredString(raw, "type"),
    target: readRequiredString(raw, "target")
  };
}

function parseJourneyRecovery(raw: unknown): JourneyRecoveryDefinition {
  if (!isPlainObject(raw)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "Journey recovery must be an object."
    );
  }
  const maxAttempts = raw.maxAttempts;
  if (typeof maxAttempts !== "number" || !Number.isFinite(maxAttempts)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "Journey recovery maxAttempts must be a finite number."
    );
  }
  return {
    maxAttempts,
    strategy: readRequiredString(raw, "strategy")
  };
}

interface CompileJourneyResult {
  readonly compiled: CompiledJourneyDefinition;
  readonly modeled: true;
  readonly liveBrowserExecuted: false;
  readonly providerCallsMade: false;
  readonly filesystemMutated: false;
}

function handleCompileJourney(args: unknown): CompileJourneyResult {
  if (!isPlainObject(args)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_compile_journey arguments must be an object."
    );
  }

  const id = readRequiredString(args, "id");
  const appId = readRequiredString(args, "appId");
  const fixtureId = readRequiredString(args, "fixtureId");
  const goal = readRequiredString(args, "goal");
  const rawSteps = readArray(args, "steps");
  const rawAssertions = readArray(args, "assertions");
  const recovery = parseJourneyRecovery(args.recovery);

  if (id.trim() === "" || goal.trim() === "") {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "Journey id and goal are required."
    );
  }

  assertAuthorizedAppId(appId);

  const fixtureMatch = benchmarkFixtureManifest.find(
    (fixture) => fixture.id === fixtureId && fixture.appId === appId
  );
  if (!fixtureMatch) {
    throw new AutomiumMcpError(
      "fixture_app_mismatch",
      `Fixture "${fixtureId}" does not belong to app "${appId}".`
    );
  }

  const steps = rawSteps.map((step, index) => parseJourneyStep(step, index));
  for (const [index, step] of steps.entries()) {
    if (!supportedPlannerIntents.has(step.intent)) {
      throw new AutomiumMcpError(
        "unsupported_planner_intent",
        `Journey step ${index + 1} uses unsupported planner intent "${step.intent}".`
      );
    }
  }

  const assertions = rawAssertions.map((assertion, index) =>
    parseJourneyAssertion(assertion, index)
  );

  const journey: JourneyDefinition = {
    id,
    appId,
    fixtureId,
    goal,
    steps,
    assertions,
    recovery
  };

  let compiled: CompiledJourneyDefinition;
  try {
    compiled = compileJourneyDefinition(journey);
  } catch (error) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      error instanceof Error ? error.message : "Failed to compile journey."
    );
  }

  return { compiled, ...modeledMetadata };
}

export function callAutomiumMcpTool(
  _server: AutomiumMcpServer,
  name: string,
  args: unknown
): unknown {
  switch (name) {
    case "automium_list_apps":
      return handleListApps(args);
    case "automium_list_fixtures":
      return handleListFixtures(args);
    case "automium_compile_journey":
      return handleCompileJourney(args);
    case "automium_create_run_submission":
    case "automium_get_replay_summary":
    case "automium_get_artifact_manifest":
    case "automium_compare_planners":
      throw new AutomiumMcpError(
        "unsupported_v1_operation",
        `Tool "${name}" is not yet implemented in this step.`
      );
    default:
      throw new AutomiumMcpError(
        "unsupported_v1_operation",
        `Unknown Automium MCP tool "${name}".`
      );
  }
}
