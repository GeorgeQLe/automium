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

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.3 not implemented: ${operation}`);
}

export function validateJourneyDefinition(
  _journey: JourneyDefinition
): JourneyValidationResult {
  return notImplemented("validateJourneyDefinition");
}

export function compileJourneyDefinition(
  _journey: JourneyDefinition
): CompiledJourneyDefinition {
  return notImplemented("compileJourneyDefinition");
}

export function createRunSubmission(_input: RunSubmissionInput): RunSubmission {
  return notImplemented("createRunSubmission");
}
