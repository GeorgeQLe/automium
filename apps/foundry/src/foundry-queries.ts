import type { FoundryQueryRuntime } from "./foundry-constants";
import type {
  FoundryQuery,
  FoundryQueryParameter,
  FoundryWidgetBinding,
} from "./foundry-domain";
import {
  createFoundryQuery as createDomainFoundryQuery,
  createFoundryWidgetBinding,
} from "./foundry-domain";

export interface FoundryQueryExecution {
  executionId: string;
  queryId: string;
  queryName: string;
  datasourceId: string;
  data: unknown;
  columns: string[];
  executedAt: string;
}

export function createFoundryQuery(params: {
  applicationId: string;
  datasourceId: string;
  name: string;
  runtime: FoundryQueryRuntime;
  body: string;
  parameters?: FoundryQueryParameter[];
  queryId?: string;
  createdAt?: string;
  updatedAt?: string;
}): FoundryQuery {
  return createDomainFoundryQuery({
    ...params,
    parameters: params.parameters ?? [],
  });
}

export function executeFoundryQuery(
  query: FoundryQuery,
  result: { rows?: unknown[]; columns?: string[]; data?: unknown; normalizedBody?: unknown }
): FoundryQueryExecution {
  return {
    executionId: generateId("exec"),
    queryId: query.queryId,
    queryName: query.name,
    datasourceId: query.datasourceId,
    data: result.rows ?? result.data ?? result.normalizedBody ?? null,
    columns: result.columns ?? [],
    executedAt: new Date().toISOString(),
  };
}

export function bindFoundryQueryResult(
  execution: FoundryQueryExecution,
  params: { widgetId: string; targetProperty: string }
): FoundryWidgetBinding {
  return createFoundryWidgetBinding({
    widgetId: params.widgetId,
    scope: "query",
    targetProperty: params.targetProperty,
    expression: `{{queries.${execution.queryName}.data}}`,
  });
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
