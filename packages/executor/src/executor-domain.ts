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

const executorActionByIntent: Record<SupportedExecutorIntent, string> = {
  navigate: "navigate",
  click: "click",
  "type/fill": "fill",
  select: "select",
  upload: "upload",
  "press-key": "press-key",
  "wait-for-condition": "wait",
  assert: "assert",
  extract: "extract",
  branch: "branch",
  recover: "recover",
  finish: "finish"
};

function isSupportedExecutorIntent(
  intent: string
): intent is SupportedExecutorIntent {
  return SUPPORTED_EXECUTOR_INTENTS.includes(intent as SupportedExecutorIntent);
}

export function compilePlannerIntent(intent: PlannerIntentInput): ExecutorAction {
  if (!isSupportedExecutorIntent(intent.intent)) {
    return {
      type: "unsupported",
      reason: "unsupported-intent",
      recoverable: false
    };
  }

  return {
    type: executorActionByIntent[intent.intent],
    targetElementId: intent.targetElementId,
    value: intent.value,
    deterministic: true
  };
}
