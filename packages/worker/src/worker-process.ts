export interface WorkerProcessConfig {
  workerId: string;
  tenantId: string;
  isolation: string;
  capabilities: string[];
}

export function createWorkerProcess(config: WorkerProcessConfig) {
  return {
    start: async () => {},
    stop: async () => {},
    status: () => "idle" as const,
  };
}
