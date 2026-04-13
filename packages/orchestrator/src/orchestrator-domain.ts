export const ORCHESTRATOR_VERSION = "v1";

export interface WorkerLeaseInput {
  readonly runId: string;
  readonly tenantId: string;
  readonly priority: "low" | "normal" | "high";
  readonly requestedCapabilities: readonly string[];
}

export interface WorkerQuota {
  readonly maxConcurrentRuns: number;
  readonly maxArtifactBytes: number;
}

export interface WorkerLease {
  readonly runId: string;
  readonly tenantId: string;
  readonly isolation: "per-run-browser-context";
  readonly status: "leased";
  readonly quota: WorkerQuota;
}

export interface TelemetryEventInput {
  readonly type: string;
  readonly at: number;
  readonly tokenSpend?: number;
  readonly verdict?: string;
}

export interface RunTelemetryInput {
  readonly runId: string;
  readonly events: readonly TelemetryEventInput[];
}

export interface RunTelemetrySummary {
  readonly runId: string;
  readonly latencyMs: number;
  readonly tokenSpend: number;
  readonly verdict: string;
}

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.6 not implemented: ${operation}`);
}

export function leaseWorker(_input: WorkerLeaseInput): WorkerLease {
  return notImplemented("leaseWorker");
}

export function summarizeRunTelemetry(
  _input: RunTelemetryInput
): RunTelemetrySummary {
  return notImplemented("summarizeRunTelemetry");
}
