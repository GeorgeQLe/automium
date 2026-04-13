import type { FoundryDatasourceType } from "./foundry-constants";
import { FOUNDRY_DATASOURCE_TYPES } from "./foundry-constants";
import type { FoundryDatasource } from "./foundry-domain";
import { createFoundryDatasource } from "./foundry-domain";

export function createDatasource(params: {
  workspaceId: string;
  name: string;
  type: FoundryDatasourceType;
  environmentId: string;
  config: Record<string, unknown>;
  datasourceId?: string;
  createdAt?: string;
}): FoundryDatasource {
  return createFoundryDatasource(params);
}

export { createDatasource as createFoundryDatasource };

export function updateFoundryDatasourceConfig(
  datasource: FoundryDatasource,
  config: Record<string, unknown>
): FoundryDatasource {
  return {
    ...datasource,
    config: {
      ...datasource.config,
      ...config,
    },
  };
}

export function isSupportedFoundryDatasourceType(
  type: string
): type is FoundryDatasourceType {
  return FOUNDRY_DATASOURCE_TYPES.includes(type as FoundryDatasourceType);
}
