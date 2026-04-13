export const ORCHESTRATOR_VERSION = "v1";

export type WorkerLeasePriority = "low" | "normal" | "high";
export type WorkerLeaseCapability = "browser" | "artifacts" | "vision";

export interface WorkerLeaseInput {
  readonly runId: string;
  readonly tenantId: string;
  readonly priority: WorkerLeasePriority;
  readonly requestedCapabilities: readonly string[];
  readonly activeTenantRuns?: number;
  readonly activeWorkerRuns?: number;
  readonly queuedAhead?: number;
  readonly quota?: Partial<WorkerQuota>;
}

export interface WorkerQuota {
  readonly maxConcurrentRuns: number;
  readonly maxArtifactBytes: number;
}

export interface WorkerQueuePlacement {
  readonly priority: WorkerLeasePriority;
  readonly position: number;
  readonly maxConcurrency: number;
}

export interface WorkerLease {
  readonly runId: string;
  readonly tenantId: string;
  readonly workerId: string;
  readonly isolation: "per-run-browser-context";
  readonly status: "leased";
  readonly capabilities: readonly WorkerLeaseCapability[];
  readonly queue: WorkerQueuePlacement;
  readonly quota: WorkerQuota;
}

export interface WorkerLeaseDenied {
  readonly runId: string;
  readonly tenantId: string;
  readonly isolation: "per-run-browser-context";
  readonly status: "denied";
  readonly reason:
    | "missing-capabilities"
    | "tenant-quota-exceeded"
    | "worker-concurrency-exceeded";
  readonly queue: WorkerQueuePlacement;
  readonly quota: WorkerQuota;
}

export type WorkerLeaseDecision = WorkerLease | WorkerLeaseDenied;

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

const DEFAULT_QUOTA: WorkerQuota = {
  maxConcurrentRuns: 2,
  maxArtifactBytes: 256 * 1024 * 1024
};

const SUPPORTED_CAPABILITIES = new Set<string>(["browser", "artifacts", "vision"]);
const QUEUE_PRIORITY_WEIGHT: Record<WorkerLeasePriority, number> = {
  high: 0,
  normal: 100,
  low: 200
};

function normalizeQuota(quota?: Partial<WorkerQuota>): WorkerQuota {
  return {
    maxConcurrentRuns:
      quota?.maxConcurrentRuns === undefined
        ? DEFAULT_QUOTA.maxConcurrentRuns
        : Math.max(0, quota.maxConcurrentRuns),
    maxArtifactBytes:
      quota?.maxArtifactBytes === undefined
        ? DEFAULT_QUOTA.maxArtifactBytes
        : Math.max(0, quota.maxArtifactBytes)
  };
}

function buildQueuePlacement(
  input: WorkerLeaseInput,
  quota: WorkerQuota
): WorkerQueuePlacement {
  const activeWorkerRuns = Math.max(0, input.activeWorkerRuns ?? 0);
  const queuedAhead = Math.max(0, input.queuedAhead ?? 0);

  return {
    priority: input.priority,
    position: QUEUE_PRIORITY_WEIGHT[input.priority] + queuedAhead + activeWorkerRuns,
    maxConcurrency: quota.maxConcurrentRuns
  };
}

function buildDeniedLease(
  input: WorkerLeaseInput,
  reason: WorkerLeaseDenied["reason"],
  quota: WorkerQuota
): WorkerLeaseDenied {
  return {
    runId: input.runId,
    tenantId: input.tenantId,
    isolation: "per-run-browser-context",
    status: "denied",
    reason,
    queue: buildQueuePlacement(input, quota),
    quota
  };
}

function normalizeCapabilities(
  requestedCapabilities: readonly string[]
): readonly WorkerLeaseCapability[] {
  return requestedCapabilities.filter((capability): capability is WorkerLeaseCapability =>
    SUPPORTED_CAPABILITIES.has(capability)
  );
}

function workerIdFor(input: WorkerLeaseInput): string {
  return `worker-${input.tenantId}-${input.runId}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function leaseWorker(input: WorkerLeaseInput): WorkerLeaseDecision {
  const quota = normalizeQuota(input.quota);
  const capabilities = normalizeCapabilities(input.requestedCapabilities);
  const activeTenantRuns = Math.max(0, input.activeTenantRuns ?? 0);
  const activeWorkerRuns = Math.max(0, input.activeWorkerRuns ?? 0);

  if (
    input.requestedCapabilities.length === 0 ||
    capabilities.length !== input.requestedCapabilities.length
  ) {
    return buildDeniedLease(input, "missing-capabilities", quota);
  }

  if (activeTenantRuns >= quota.maxConcurrentRuns) {
    return buildDeniedLease(input, "tenant-quota-exceeded", quota);
  }

  if (activeWorkerRuns >= quota.maxConcurrentRuns) {
    return buildDeniedLease(input, "worker-concurrency-exceeded", quota);
  }

  return {
    runId: input.runId,
    tenantId: input.tenantId,
    workerId: workerIdFor(input),
    isolation: "per-run-browser-context",
    status: "leased",
    capabilities,
    queue: buildQueuePlacement(input, quota),
    quota
  };
}

export function summarizeRunTelemetry(
  input: RunTelemetryInput
): RunTelemetrySummary {
  const eventTimes = input.events.map((event) => event.at);
  const startedAt = eventTimes.length === 0 ? 0 : Math.min(...eventTimes);
  const finishedAt = eventTimes.length === 0 ? 0 : Math.max(...eventTimes);
  const verdictEvent = [...input.events]
    .reverse()
    .find((event) => event.verdict !== undefined);

  return {
    runId: input.runId,
    latencyMs: Math.max(0, finishedAt - startedAt),
    tokenSpend: input.events.reduce(
      (total, event) => total + Math.max(0, event.tokenSpend ?? 0),
      0
    ),
    verdict: verdictEvent?.verdict ?? "unknown"
  };
}
