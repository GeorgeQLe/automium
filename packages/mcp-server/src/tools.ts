import {
  BENCHMARK_CORPUS_VERSION,
  authorizedBenchmarkApps,
  benchmarkFixtureManifest,
  type AuthorizedBenchmarkApp,
  type AuthorizedBenchmarkAppId,
  type BenchmarkFixtureDefinition
} from "../../benchmark/src/corpus";
import {
  comparePlannerBackends,
  type BenchmarkComparisonReport
} from "../../benchmark-runner/src/benchmark-runner-domain";
import { PLANNER_INTENT_VOCABULARY } from "../../contracts/src/planner-adapter";
import {
  ARTIFACT_KINDS,
  createArtifactManifest,
  type ArtifactKind,
  type ArtifactManifest,
  type ArtifactManifestEntry
} from "../../artifacts/src/artifacts-domain";
import {
  compileJourneyDefinition,
  createRunSubmission,
  type CompiledJourneyDefinition,
  type JourneyAssertionDefinition,
  type JourneyDefinition,
  type JourneyRecoveryDefinition,
  type JourneyStepDefinition,
  type PlannerBackendRef,
  type RunSubmission
} from "../../../apps/control-plane/src/control-plane-domain";
import {
  summarizeReplayRun,
  type ReplayRunSummary
} from "../../../apps/replay-console/src/replay-console-domain";

import { AutomiumMcpError } from "./errors";
import type { AutomiumMcpServer } from "./server";
import type {
  AutomiumMcpToolDescriptor,
  AutomiumModeledOutputMetadata
} from "./schemas";

const modeledMetadata: AutomiumModeledOutputMetadata = {
  modeled: true,
  liveBrowserExecuted: false,
  providerCallsMade: false,
  filesystemMutated: false,
  queued: false,
  artifactsFetched: false
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

interface CompileJourneyResult extends AutomiumModeledOutputMetadata {
  readonly compiled: CompiledJourneyDefinition;
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

function parsePlannerMetadata(raw: unknown): PlannerBackendRef {
  if (!isPlainObject(raw)) {
    throw new AutomiumMcpError(
      "malformed_planner_metadata",
      "Planner metadata must be an object with non-empty id, vendor, and model."
    );
  }
  for (const field of ["id", "vendor", "model"] as const) {
    const value = raw[field];
    if (typeof value !== "string" || value === "") {
      throw new AutomiumMcpError(
        "malformed_planner_metadata",
        `Planner metadata field "${field}" must be a non-empty string.`
      );
    }
  }
  return {
    id: raw.id as string,
    vendor: raw.vendor as string,
    model: raw.model as string
  };
}

interface CreateRunSubmissionResult extends AutomiumModeledOutputMetadata {
  readonly submission: RunSubmission;
}

function handleCreateRunSubmission(args: unknown): CreateRunSubmissionResult {
  if (!isPlainObject(args)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_create_run_submission arguments must be an object."
    );
  }

  const journeyId = readRequiredString(args, "journeyId");
  const appId = readRequiredString(args, "appId");
  const fixtureId = readRequiredString(args, "fixtureId");
  const environmentProfileId = readRequiredString(args, "environmentProfileId");

  if (
    journeyId.trim() === "" ||
    appId.trim() === "" ||
    fixtureId.trim() === "" ||
    environmentProfileId.trim() === ""
  ) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "Run submission requires non-empty journeyId, appId, fixtureId, and environmentProfileId."
    );
  }

  const planner = parsePlannerMetadata(args.planner);

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

  let submission: RunSubmission;
  try {
    submission = createRunSubmission({
      journeyId,
      appId,
      fixtureId,
      planner,
      environmentProfileId
    });
  } catch (error) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      error instanceof Error ? error.message : "Failed to create run submission."
    );
  }

  return { submission, ...modeledMetadata };
}

const artifactKindSet = new Set<string>(ARTIFACT_KINDS);

interface GetReplaySummaryResult extends AutomiumModeledOutputMetadata {
  readonly summary: ReplayRunSummary;
}

function handleGetReplaySummary(args: unknown): GetReplaySummaryResult {
  if (!isPlainObject(args)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_get_replay_summary arguments must be an object."
    );
  }

  const runId = readRequiredString(args, "runId");
  const verdict = readRequiredString(args, "verdict");
  const artifactManifestRef = readRequiredString(args, "artifactManifestRef");

  if (
    runId.trim() === "" ||
    verdict.trim() === "" ||
    artifactManifestRef.trim() === ""
  ) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "Replay summary requires non-empty runId, verdict, and artifactManifestRef."
    );
  }

  const retryCountRaw = args.retryCount;
  if (
    typeof retryCountRaw !== "number" ||
    !Number.isFinite(retryCountRaw)
  ) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "Replay summary retryCount must be a finite number."
    );
  }

  let summary: ReplayRunSummary;
  try {
    summary = summarizeReplayRun({
      runId,
      verdict,
      retryCount: retryCountRaw,
      artifactManifestRef
    });
  } catch (error) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      error instanceof Error ? error.message : "Failed to summarize replay run."
    );
  }

  return { summary, ...modeledMetadata };
}

interface GetArtifactManifestResult extends AutomiumModeledOutputMetadata {
  readonly manifest: ArtifactManifest;
}

function parseArtifactManifestEntry(
  raw: unknown,
  index: number
): ArtifactManifestEntry {
  if (!isPlainObject(raw)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Artifact entry ${index + 1} must be an object.`
    );
  }
  const kind = readRequiredString(raw, "kind");
  const path = readRequiredString(raw, "path");

  if (!artifactKindSet.has(kind)) {
    throw new AutomiumMcpError(
      "invalid_artifact_kind",
      `Artifact entry ${index + 1} uses unsupported kind "${kind}".`
    );
  }

  if (path.startsWith("/")) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      `Artifact entry ${index + 1} path must be relative, not absolute.`
    );
  }

  return { kind: kind as ArtifactKind, path };
}

function handleGetArtifactManifest(args: unknown): GetArtifactManifestResult {
  if (!isPlainObject(args)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_get_artifact_manifest arguments must be an object."
    );
  }

  const runId = readRequiredString(args, "runId");
  const appId = readRequiredString(args, "appId");
  const root = readRequiredString(args, "root");

  if (runId.trim() === "" || appId.trim() === "" || root.trim() === "") {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "Artifact manifest requires non-empty runId, appId, and root."
    );
  }

  assertAuthorizedAppId(appId);

  const rawEntries = readArray(args, "entries");
  const entries = rawEntries.map((entry, index) =>
    parseArtifactManifestEntry(entry, index)
  );

  let manifest: ArtifactManifest;
  try {
    manifest = createArtifactManifest({ runId, root, entries });
  } catch (error) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      error instanceof Error ? error.message : "Failed to create artifact manifest."
    );
  }

  return { manifest, ...modeledMetadata };
}

interface ComparePlannersResult extends AutomiumModeledOutputMetadata {
  readonly report: BenchmarkComparisonReport;
}

function handleComparePlanners(args: unknown): ComparePlannersResult {
  if (!isPlainObject(args)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_compare_planners arguments must be an object."
    );
  }

  const corpusVersion = readRequiredString(args, "corpusVersion");
  if (corpusVersion === "") {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_compare_planners requires a non-empty corpusVersion."
    );
  }

  const rawAppIds = readArray(args, "appIds");

  if (corpusVersion !== BENCHMARK_CORPUS_VERSION) {
    throw new AutomiumMcpError(
      "unsupported_corpus_version",
      `Unsupported benchmark corpus version: ${corpusVersion}`
    );
  }

  if (rawAppIds.length === 0) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_compare_planners requires at least one appId."
    );
  }

  const appIds = rawAppIds.map((appId, index) => {
    if (typeof appId !== "string") {
      throw new AutomiumMcpError(
        "unsupported_v1_operation",
        `appIds[${index}] must be a string.`
      );
    }
    return appId;
  });

  const rawPlanners = readArray(args, "planners");
  if (rawPlanners.length === 0) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_compare_planners requires at least one planner."
    );
  }
  const planners = rawPlanners.map((planner) => parsePlannerMetadata(planner));

  const repetitions = args.repetitions;
  if (typeof repetitions !== "number" || !Number.isFinite(repetitions)) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      "automium_compare_planners repetitions must be a finite number."
    );
  }

  let report: BenchmarkComparisonReport;
  try {
    report = comparePlannerBackends({
      corpusVersion,
      appIds,
      planners,
      repetitions
    });
  } catch (error) {
    throw new AutomiumMcpError(
      "unsupported_v1_operation",
      error instanceof Error ? error.message : "Failed to compare planners."
    );
  }

  return { report, ...modeledMetadata };
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
      return handleCreateRunSubmission(args);
    case "automium_get_replay_summary":
      return handleGetReplaySummary(args);
    case "automium_get_artifact_manifest":
      return handleGetArtifactManifest(args);
    case "automium_compare_planners":
      return handleComparePlanners(args);
    default:
      throw new AutomiumMcpError(
        "unsupported_v1_operation",
        `Unknown Automium MCP tool "${name}".`
      );
  }
}
