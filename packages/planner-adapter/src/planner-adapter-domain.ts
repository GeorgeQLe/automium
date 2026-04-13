export const PLANNER_ADAPTER_VERSION = "v1";

export const SUPPORTED_PLANNER_BACKENDS = [
  "openai",
  "local",
  "fixture"
] as const;

export type SupportedPlannerBackend =
  (typeof SUPPORTED_PLANNER_BACKENDS)[number];

export interface PlannerBackendMetadata {
  readonly id: string;
  readonly vendor: SupportedPlannerBackend | string;
  readonly model: string;
  readonly supportsVision: boolean;
  readonly supportsToolCalls: boolean;
}

export interface PlannerIntentEnvelope {
  readonly plannerId: string;
  readonly intent: string;
  readonly target?: string;
  readonly value?: string;
  readonly confidence: number;
}
