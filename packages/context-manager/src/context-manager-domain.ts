export const CONTEXT_MANAGER_VERSION = "v1";

export interface ContextLayer {
  readonly id: string;
  readonly kind: "journey" | "snapshot" | "artifact" | "policy";
  readonly tokenEstimate: number;
  readonly retained: boolean;
}

export interface ContextBudget {
  readonly tokenBudget: number;
  readonly cropBudget: number;
}

export interface ContextPlan {
  readonly version: typeof CONTEXT_MANAGER_VERSION;
  readonly budget: ContextBudget;
  readonly layers: readonly ContextLayer[];
}
