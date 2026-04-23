import {
  authorizedBenchmarkApps,
  benchmarkFixtureManifest,
  type AuthorizedBenchmarkApp,
  type AuthorizedBenchmarkAppId,
  type BenchmarkFixtureDefinition
} from "../../benchmark/src/corpus";

import { AutomiumMcpError } from "./errors";
import type { AutomiumMcpServer } from "./server";
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
