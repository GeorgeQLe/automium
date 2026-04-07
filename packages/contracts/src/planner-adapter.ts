import type { SemanticSnapshot } from "./semantic-snapshot";

export const PLANNER_INTENT_VOCABULARY = [
  "navigate",
  "click",
  "type/fill",
  "select",
  "upload",
  "press-key",
  "wait-for-condition",
  "assert",
  "extract",
  "branch",
  "recover",
  "finish"
] as const;

export const plannerAdapterRequiredMethods = [
  "metadata",
  "buildPrompt",
  "parsePlannerOutput",
  "compileIntent",
  "summarizeStep"
] as const;

export const plannerAdapterMetadataFields = [
  "id",
  "vendor",
  "model",
  "intentSchemaVersion"
] as const;

export type PlannerIntentName = (typeof PLANNER_INTENT_VOCABULARY)[number];

export type PlannerAdapterMethod = (typeof plannerAdapterRequiredMethods)[number];

export type PlannerAdapterMetadataField =
  (typeof plannerAdapterMetadataFields)[number];

export interface PlannerAdapterMetadata {
  readonly id: string;
  readonly vendor: "openai" | "anthropic" | "google" | "custom";
  readonly model: string;
  readonly intentSchemaVersion: "v1";
}

export interface PlannerPromptInput {
  readonly snapshot: SemanticSnapshot;
  readonly allowedIntents: readonly PlannerIntentName[];
  readonly pinnedInvariants: readonly string[];
  readonly executionBudget: {
    readonly maxTokens: number;
    readonly maxStepsRemaining: number;
  };
}

export interface PlannerIntent {
  readonly kind: PlannerIntentName;
  readonly reasoning: string;
  readonly target: string | null;
  readonly arguments: Readonly<Record<string, string | number | boolean | null>>;
}

export interface CompiledPlannerIntent {
  readonly opcode: string;
  readonly targetId: string | null;
  readonly parameters: Readonly<Record<string, string | number | boolean | null>>;
}

export interface PlannerStepSummary {
  readonly headline: string;
  readonly detail: string;
  readonly recoverySuggested: boolean;
}

export interface PlannerAdapter {
  metadata(): PlannerAdapterMetadata;
  buildPrompt(input: PlannerPromptInput): string;
  parsePlannerOutput(output: string): readonly PlannerIntent[];
  compileIntent(intent: PlannerIntent): CompiledPlannerIntent;
  summarizeStep(intent: PlannerIntent, result: "pass" | "fail"): PlannerStepSummary;
}
