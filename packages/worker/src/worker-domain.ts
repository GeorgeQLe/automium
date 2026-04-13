export const WORKER_RUNTIME_VERSION = "v1";

export interface WorkerRuntimeConfig {
  readonly workerId: string;
  readonly tenantId: string;
  readonly isolation: "per-run-browser-context";
  readonly capabilities: readonly string[];
}

export interface WorkerQueuePolicy {
  readonly maxConcurrency: number;
  readonly priorityOrder: readonly ("high" | "normal" | "low")[];
}

export interface WorkerLeaseTelemetry {
  readonly workerId: string;
  readonly runId: string;
  readonly leasedAt: string;
  readonly releasedAt?: string;
}
