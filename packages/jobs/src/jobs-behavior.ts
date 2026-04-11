const JOB_LIFECYCLE_STATES = [
  "queued",
  "running",
  "completed",
  "failed"
] as const;

// --- Types derived from frozen constants ---

export type JobLifecycleState = (typeof JOB_LIFECYCLE_STATES)[number];

// --- Interfaces ---

export interface Job {
  jobId: string;
  organizationId: string;
  workspaceId: string;
  type: string;
  state: JobLifecycleState;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface JobTransitionEvent {
  jobId: string;
  fromState: JobLifecycleState;
  toState: JobLifecycleState;
  occurredAt: string;
  reason?: string;
}

// --- Valid state transitions ---

export const VALID_JOB_TRANSITIONS: Record<
  JobLifecycleState,
  readonly JobLifecycleState[]
> = {
  queued: ["running", "failed"],
  running: ["completed", "failed"],
  completed: [],
  failed: ["queued"],
};

// --- Factory ---

export function createJob(params: {
  organizationId: string;
  workspaceId: string;
  type: string;
  payload?: Record<string, unknown>;
  id?: string;
}): Job {
  const now = new Date().toISOString();
  return {
    jobId: params.id ?? generateId("job"),
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    type: params.type,
    state: "queued",
    payload: params.payload ?? {},
    createdAt: now,
    updatedAt: now,
  };
}

// --- State machine ---

export function transitionJobState(
  job: Job,
  nextState: JobLifecycleState,
  reason?: string
): { job: Job; event: JobTransitionEvent } {
  const allowed = VALID_JOB_TRANSITIONS[job.state];
  if (!allowed.includes(nextState)) {
    throw new Error(`Invalid job transition: ${job.state} → ${nextState}`);
  }

  const event: JobTransitionEvent = {
    jobId: job.jobId,
    fromState: job.state,
    toState: nextState,
    occurredAt: new Date().toISOString(),
    reason,
  };

  const updated: Job = {
    ...job,
    state: nextState,
    updatedAt: event.occurredAt,
  };

  return { job: updated, event };
}

// --- Validation ---

export function validateJob(job: Job): string[] {
  const errors: string[] = [];
  if (!job.jobId) errors.push("jobId is required");
  if (!job.organizationId) errors.push("organizationId is required");
  if (!job.workspaceId) errors.push("workspaceId is required");
  if (!job.type) errors.push("type is required");
  if (!JOB_LIFECYCLE_STATES.includes(job.state as never)) {
    errors.push(`Invalid state: ${job.state}`);
  }
  return errors;
}

// --- Internal helpers ---

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
