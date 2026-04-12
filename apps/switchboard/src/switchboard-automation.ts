import type {
  SwitchboardAutomationAction,
  SwitchboardAutomationCondition,
  SwitchboardAutomationRule,
} from "./switchboard-domain";
import { createSwitchboardAutomationRule } from "./switchboard-domain";

export const SWITCHBOARD_AUTOMATION_TRIGGERS = [
  "conversation-created",
  "message-created",
  "assignment-changed",
  "sla-breached",
] as const;

export const SWITCHBOARD_AUTOMATION_ACTIONS = [
  "assign-team",
  "assign-user",
  "add-label",
  "set-priority",
  "send-reply",
  "send-webhook",
] as const;

export interface SwitchboardSlaPolicy {
  firstResponseSeconds?: number;
  resolutionSeconds?: number;
}

export type SwitchboardAutomationRuleWithSla = SwitchboardAutomationRule & {
  sla?: SwitchboardSlaPolicy;
};

export interface SwitchboardAutomationResult {
  ruleId: string;
  matched: boolean;
  actions: SwitchboardAutomationAction[];
  executedAt: string;
}

export function createAutomationRule(
  params: Parameters<typeof createSwitchboardAutomationRule>[0] & {
    sla?: SwitchboardSlaPolicy;
  }
): SwitchboardAutomationRuleWithSla {
  return {
    ...createSwitchboardAutomationRule(params),
    sla: params.sla,
  };
}

export function evaluateAutomationRule(
  rule: SwitchboardAutomationRuleWithSla,
  context: Record<string, unknown>
): SwitchboardAutomationResult {
  const matched = rule.conditions.every((condition) =>
    evaluateCondition(condition, context)
  );

  return {
    ruleId: rule.automationRuleId,
    matched,
    actions: matched ? rule.actions.map((action) => ({ ...action })) : [],
    executedAt: new Date().toISOString(),
  };
}

function evaluateCondition(
  condition: SwitchboardAutomationCondition,
  context: Record<string, unknown>
): boolean {
  const actual = getPath(context, condition.field);

  if (condition.operator === "equals") {
    return actual === condition.value;
  }

  if (condition.operator === "contains") {
    return String(actual ?? "").includes(condition.value);
  }

  return false;
}

function getPath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}
