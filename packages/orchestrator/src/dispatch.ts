import { leaseWorker, type WorkerLeaseDecision, type WorkerLeasePriority } from "./orchestrator-domain";

interface DispatchInput {
  readonly runId: string;
  readonly tenantId: string;
  readonly priority: WorkerLeasePriority;
  readonly requestedCapabilities: readonly string[];
}

interface QueueAdapter {
  enqueue(job: Record<string, unknown>): Promise<{ enqueued: boolean; jobId: string }>;
}

interface DispatchResult {
  readonly dispatched: boolean;
  readonly lease: WorkerLeaseDecision;
  readonly jobId?: string;
}

export async function dispatchRun(input: DispatchInput, queueAdapter: QueueAdapter): Promise<DispatchResult> {
  const lease = leaseWorker(input);

  if (lease.status === "denied") {
    return { dispatched: false, lease };
  }

  const result = await queueAdapter.enqueue({
    runId: input.runId,
    tenantId: input.tenantId,
    priority: input.priority,
    workerId: lease.workerId,
  });

  return { dispatched: true, lease, jobId: result.jobId };
}
