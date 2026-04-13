import type { FoundryDatasourceType } from "./foundry-constants";
import { FOUNDRY_DATASOURCE_TYPES } from "./foundry-constants";

export interface FoundrySchemaTable {
  tableName: string;
  columns: string[];
}

export interface FoundryConnectionResult {
  datasourceId: string;
  ok: boolean;
  testedAt: string;
}

export interface FoundrySqlExecutionRequest {
  datasourceId: string;
  body: string;
  parameters?: Array<{ name: string; value: unknown }>;
}

export interface FoundryRestExecutionRequest {
  datasourceId: string;
  method: string;
  path: string;
  headers?: Record<string, string>;
  body?: unknown;
  responseBinding?: string;
}

export interface FoundrySqlExecutionResult {
  datasourceId: string;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  parameterized: boolean;
  normalizedAt: string;
}

export interface FoundryRestExecutionResult {
  datasourceId: string;
  method: string;
  path: string;
  responseBinding?: string;
  authMetadata: {
    type: "bearer" | "basic" | "api-key" | "none";
    header?: string;
  };
  normalizedBody: Record<string, unknown>;
  normalizedAt: string;
}

export interface FoundryDatasourceAdapter {
  type: FoundryDatasourceType;
  testConnection(input: { datasourceId: string }): Promise<FoundryConnectionResult>;
  introspectSchema(input: { datasourceId: string }): Promise<FoundrySchemaTable[]>;
  execute(
    request: FoundrySqlExecutionRequest | FoundryRestExecutionRequest
  ): Promise<FoundrySqlExecutionResult | FoundryRestExecutionResult>;
}

export interface FoundryDatasourceAdapterRegistry {
  supportedTypes: FoundryDatasourceType[];
  getAdapter(type: FoundryDatasourceType): FoundryDatasourceAdapter;
}

export function createFoundryDatasourceAdapterRegistry(): FoundryDatasourceAdapterRegistry {
  const adapters = new Map<FoundryDatasourceType, FoundryDatasourceAdapter>(
    FOUNDRY_DATASOURCE_TYPES.map((type) => [type, createAdapter(type)])
  );

  return {
    supportedTypes: [...FOUNDRY_DATASOURCE_TYPES],
    getAdapter(type) {
      const adapter = adapters.get(type);

      if (!adapter) {
        throw new Error(`Unsupported Foundry datasource adapter: ${type}`);
      }

      return adapter;
    },
  };
}

function createAdapter(type: FoundryDatasourceType): FoundryDatasourceAdapter {
  return {
    type,
    async testConnection(input) {
      return {
        datasourceId: input.datasourceId,
        ok: true,
        testedAt: new Date().toISOString(),
      };
    },
    async introspectSchema(input) {
      if (type === "rest-api") {
        return [
          {
            tableName: `${input.datasourceId}.endpoints`,
            columns: ["method", "path", "responseBinding"],
          },
        ];
      }

      return [
        {
          tableName: "orders",
          columns: ["id", "status", "total", "updated_at"],
        },
      ];
    },
    async execute(request) {
      if (type === "rest-api") {
        return executeRestRequest(request as FoundryRestExecutionRequest);
      }

      return executeSqlRequest(request as FoundrySqlExecutionRequest);
    },
  };
}

function executeSqlRequest(
  request: FoundrySqlExecutionRequest
): FoundrySqlExecutionResult {
  const status = request.parameters?.find((parameter) => parameter.name === "status")
    ?.value;

  return {
    datasourceId: request.datasourceId,
    columns: ["id", "status"],
    rows: [
      {
        id: "order_1",
        status: status ?? "open",
      },
    ],
    parameterized:
      request.body.includes(":") || request.body.includes("?") || Boolean(request.parameters?.length),
    normalizedAt: new Date().toISOString(),
  };
}

function executeRestRequest(
  request: FoundryRestExecutionRequest
): FoundryRestExecutionResult {
  return {
    datasourceId: request.datasourceId,
    method: request.method,
    path: request.path,
    responseBinding: request.responseBinding,
    authMetadata: inferRestAuthMetadata(request.headers ?? {}),
    normalizedBody: {
      [request.responseBinding ?? "data"]: [],
      path: request.path,
    },
    normalizedAt: new Date().toISOString(),
  };
}

function inferRestAuthMetadata(headers: Record<string, string>): FoundryRestExecutionResult["authMetadata"] {
  const authorization = headers.Authorization ?? headers.authorization;

  if (!authorization) {
    return { type: "none" };
  }

  if (authorization.startsWith("Bearer ")) {
    return { type: "bearer", header: "Authorization" };
  }

  if (authorization.startsWith("Basic ")) {
    return { type: "basic", header: "Authorization" };
  }

  return { type: "api-key", header: "Authorization" };
}
