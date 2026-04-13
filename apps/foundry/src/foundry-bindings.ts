import type { FoundryBindingScope } from "./foundry-constants";
import type { FoundryWidgetBinding } from "./foundry-domain";
import { createFoundryWidgetBinding } from "./foundry-domain";

export interface FoundryBindingEvaluationContext {
  queries: Record<string, unknown>;
  widgets: Record<string, unknown>;
  page: Record<string, unknown>;
  app: Record<string, unknown>;
  state: Record<string, unknown>;
}

export interface FoundryBindingEvaluation {
  bindingId: string;
  targetProperty: string;
  value: unknown;
  dependencies: string[];
  evaluatedAt: string;
}

export function createFoundryBinding(params: {
  widgetId: string;
  scope: FoundryBindingScope;
  targetProperty: string;
  expression: string;
  bindingId?: string;
  createdAt?: string;
}): FoundryWidgetBinding {
  return createFoundryWidgetBinding(params);
}

export function evaluateFoundryBinding(
  binding: FoundryWidgetBinding,
  context: FoundryBindingEvaluationContext
): FoundryBindingEvaluation {
  const dependencies = extractDependencies(binding.expression);
  const value =
    dependencies.length === 1
      ? readDottedPath(context, dependencies[0])
      : binding.expression;

  return {
    bindingId: binding.bindingId,
    targetProperty: binding.targetProperty,
    value,
    dependencies,
    evaluatedAt: new Date().toISOString(),
  };
}

function extractDependencies(expression: string): string[] {
  const matches = expression.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g);

  return [...matches].map((match) => match[1].trim());
}

function readDottedPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, source);
}
