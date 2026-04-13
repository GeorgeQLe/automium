export const SUPPORTED_EXECUTOR_INTENTS = [
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

export type SupportedExecutorIntent = (typeof SUPPORTED_EXECUTOR_INTENTS)[number];

export interface PlannerIntentInput {
  readonly intent: string;
  readonly targetElementId?: string;
  readonly value?: string;
}

export type ExecutorAction =
  | {
      readonly type: string;
      readonly targetElementId?: string;
      readonly value?: string;
      readonly deterministic: true;
    }
  | {
      readonly type: "unsupported";
      readonly reason: "unsupported-intent" | "unsupported-capability";
      readonly recoverable: false;
    };

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.4 not implemented: ${operation}`);
}

export function compilePlannerIntent(_intent: PlannerIntentInput): ExecutorAction {
  return notImplemented("compilePlannerIntent");
}
