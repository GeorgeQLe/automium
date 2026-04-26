import { randomUUID } from "node:crypto";

export function createJobQueueAdapter(config: unknown) {
  return {
    boundary: "job-queue" as const,

    async enqueue(job: Record<string, unknown>): Promise<{ enqueued: boolean; jobId: string }> {
      const jobId = (job.jobId as string) ?? randomUUID();
      return { enqueued: false, jobId };
    },

    async dequeue(): Promise<{ job: Record<string, unknown> | null }> {
      return { job: null };
    },

    async acknowledge(_jobId: string): Promise<{ acknowledged: boolean }> {
      return { acknowledged: false };
    },
  };
}
