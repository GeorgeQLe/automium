import {
  authorizedBenchmarkApps,
  benchmarkFixtureManifest
} from "../../../packages/benchmark/src/corpus";
import { PLANNER_INTENT_VOCABULARY } from "../../../packages/contracts/src/planner-adapter";

export const CONTROL_PLANE_API_VERSION = "v1";

export const CONTROL_PLANE_ROUTES = [
  { method: "POST", path: "/journeys/compile" },
  { method: "POST", path: "/runs" },
  { method: "GET", path: "/runs/:runId" },
  { method: "GET", path: "/runs/:runId/artifacts" },
  { method: "GET", path: "/runs/:runId/replay" }
] as const;

export const RUN_STATUS_VALUES = [
  "queued",
  "leased",
  "running",
  "passed",
  "failed",
  "unsupported",
  "cancelled"
] as const;

export type ControlPlaneRoute = (typeof CONTROL_PLANE_ROUTES)[number];
export type RunStatus = (typeof RUN_STATUS_VALUES)[number];

export interface JourneyStepDefinition {
  readonly intent: string;
  readonly target: string;
  readonly value?: string;
}

export interface JourneyAssertionDefinition {
  readonly id: string;
  readonly type: string;
  readonly target: string;
}

export interface JourneyRecoveryDefinition {
  readonly maxAttempts: number;
  readonly strategy: string;
}

export interface JourneyDefinition {
  readonly id: string;
  readonly appId: string;
  readonly fixtureId: string;
  readonly goal: string;
  readonly steps: readonly JourneyStepDefinition[];
  readonly assertions: readonly JourneyAssertionDefinition[];
  readonly recovery: JourneyRecoveryDefinition;
}

export interface JourneyValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export interface CompiledJourneyDefinition {
  readonly journeyId: string;
  readonly appId: string;
  readonly fixtureId: string;
  readonly graphVersion: typeof CONTROL_PLANE_API_VERSION;
  readonly nodes: readonly CompiledJourneyNode[];
  readonly assertions: readonly JourneyAssertionDefinition[];
  readonly recoveryRules: readonly JourneyRecoveryDefinition[];
}

export interface CompiledJourneyNode {
  readonly id: string;
  readonly intent: string;
  readonly target: string;
  readonly value?: string;
}

export interface PlannerBackendRef {
  readonly id: string;
  readonly vendor: string;
  readonly model: string;
}

export interface RunSubmissionInput {
  readonly journeyId: string;
  readonly appId: string;
  readonly fixtureId: string;
  readonly planner: PlannerBackendRef;
  readonly environmentProfileId: string;
}

export interface RunSubmission {
  readonly runId: string;
  readonly journeyId: string;
  readonly appId: string;
  readonly fixtureId: string;
  readonly planner: PlannerBackendRef;
  readonly environmentProfileId: string;
  readonly status: RunStatus;
  readonly artifactManifestRef: string;
  readonly replayStreamRef: string;
}

const authorizedAppIds = new Set<string>(
  authorizedBenchmarkApps.map((app) => app.id)
);
const supportedIntents = new Set<string>(PLANNER_INTENT_VOCABULARY);

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fixtureMatchesApp(appId: string, fixtureId: string): boolean {
  return benchmarkFixtureManifest.some(
    (fixture) => fixture.id === fixtureId && fixture.appId === appId
  );
}

export function validateJourneyDefinition(
  journey: JourneyDefinition
): JourneyValidationResult {
  const errors: string[] = [];

  if (!journey.id.trim()) {
    errors.push("journey id is required");
  }

  if (!authorizedAppIds.has(journey.appId)) {
    errors.push(`app is not in the owned benchmark corpus: ${journey.appId}`);
  }

  if (!fixtureMatchesApp(journey.appId, journey.fixtureId)) {
    errors.push(
      `fixture does not belong to app in the owned benchmark corpus: ${journey.fixtureId}`
    );
  }

  if (!journey.goal.trim()) {
    errors.push("journey goal is required");
  }

  if (journey.steps.length === 0) {
    errors.push("at least one journey step is required");
  }

  journey.steps.forEach((step, index) => {
    if (!supportedIntents.has(step.intent)) {
      errors.push(`step ${index + 1} uses unsupported intent: ${step.intent}`);
    }

    if (!step.target.trim()) {
      errors.push(`step ${index + 1} target is required`);
    }
  });

  journey.assertions.forEach((assertion, index) => {
    if (!assertion.id.trim() || !assertion.type.trim() || !assertion.target.trim()) {
      errors.push(`assertion ${index + 1} must include id, type, and target`);
    }
  });

  if (journey.recovery.maxAttempts < 0) {
    errors.push("recovery maxAttempts must be zero or greater");
  }

  if (!journey.recovery.strategy.trim()) {
    errors.push("recovery strategy is required");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function compileJourneyDefinition(
  journey: JourneyDefinition
): CompiledJourneyDefinition {
  const validation = validateJourneyDefinition(journey);

  if (!validation.valid) {
    throw new Error(
      `Cannot compile invalid journey definition: ${validation.errors.join("; ")}`
    );
  }

  return {
    journeyId: journey.id,
    appId: journey.appId,
    fixtureId: journey.fixtureId,
    graphVersion: CONTROL_PLANE_API_VERSION,
    nodes: journey.steps.map((step, index) => ({
      id: `${slugify(journey.id)}-step-${index + 1}`,
      intent: step.intent,
      target: step.target,
      ...(step.value === undefined ? {} : { value: step.value })
    })),
    assertions: journey.assertions,
    recoveryRules: [journey.recovery]
  };
}

export function createRunSubmission(input: RunSubmissionInput): RunSubmission {
  if (!authorizedAppIds.has(input.appId)) {
    throw new Error(`Cannot submit run for unauthorized app: ${input.appId}`);
  }

  if (!fixtureMatchesApp(input.appId, input.fixtureId)) {
    throw new Error(
      `Cannot submit run because fixture ${input.fixtureId} does not belong to ${input.appId}`
    );
  }

  const runId = `run-${slugify(input.appId)}-${slugify(input.journeyId)}-${slugify(
    input.planner.id
  )}`;

  return {
    runId,
    journeyId: input.journeyId,
    appId: input.appId,
    fixtureId: input.fixtureId,
    planner: input.planner,
    environmentProfileId: input.environmentProfileId,
    status: "queued",
    artifactManifestRef: `artifacts/${input.appId}/${runId}/manifest.json`,
    replayStreamRef: `replay/${input.appId}/${runId}.jsonl`
  };
}
