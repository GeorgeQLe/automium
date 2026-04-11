import { describe, expect, it } from "vitest";

async function loadJobsBehavior() {
  try {
    return await import("../src/jobs-behavior");
  } catch (error) {
    throw new Error(
      "Expected packages/jobs/src/jobs-behavior.ts to define the shared jobs behavior module for Phase 3.",
      { cause: error }
    );
  }
}

describe("jobs behavior contract", () => {
  it("createJob() starts in queued state with tenancy fields", async () => {
    const mod = await loadJobsBehavior();
    const job = mod.createJob({
      organizationId: "org_1",
      workspaceId: "ws_1",
      type: "data-export",
    });

    expect(job.jobId).toBeTruthy();
    expect(job.state).toBe("queued");
    expect(job.organizationId).toBe("org_1");
    expect(job.workspaceId).toBe("ws_1");
    expect(job.type).toBe("data-export");
    expect(job.createdAt).toBeTruthy();
    expect(job.updatedAt).toBeTruthy();
  });

  it("transitionJobState() allows queued -> running -> completed path", async () => {
    const mod = await loadJobsBehavior();
    const job = mod.createJob({
      organizationId: "org_1",
      workspaceId: "ws_1",
      type: "data-export",
    });

    const running = mod.transitionJobState(job, "running");
    expect(running.job.state).toBe("running");
    expect(running.event.fromState).toBe("queued");
    expect(running.event.toState).toBe("running");

    const completed = mod.transitionJobState(running.job, "completed");
    expect(completed.job.state).toBe("completed");
    expect(completed.event.fromState).toBe("running");
    expect(completed.event.toState).toBe("completed");
  });

  it("transitionJobState() allows failed -> queued retry", async () => {
    const mod = await loadJobsBehavior();
    const job = mod.createJob({
      organizationId: "org_1",
      workspaceId: "ws_1",
      type: "data-export",
    });

    const running = mod.transitionJobState(job, "running");
    const failed = mod.transitionJobState(running.job, "failed", "timeout");
    expect(failed.job.state).toBe("failed");
    expect(failed.event.reason).toBe("timeout");

    const retried = mod.transitionJobState(failed.job, "queued", "retry");
    expect(retried.job.state).toBe("queued");
    expect(retried.event.reason).toBe("retry");
  });

  it("transitionJobState() rejects invalid transitions", async () => {
    const mod = await loadJobsBehavior();
    const job = mod.createJob({
      organizationId: "org_1",
      workspaceId: "ws_1",
      type: "data-export",
    });

    const running = mod.transitionJobState(job, "running");
    const completed = mod.transitionJobState(running.job, "completed");

    expect(() => mod.transitionJobState(completed.job, "running")).toThrow(
      "Invalid job transition"
    );
  });

  it("validateJob() catches missing required fields", async () => {
    const mod = await loadJobsBehavior();
    const invalid = {
      jobId: "",
      organizationId: "",
      workspaceId: "ws_1",
      type: "",
      state: "queued" as const,
      payload: {},
      createdAt: "",
      updatedAt: "",
    };

    const errors = mod.validateJob(invalid);
    expect(errors).toContain("jobId is required");
    expect(errors).toContain("organizationId is required");
    expect(errors).toContain("type is required");
    expect(errors).not.toContain("workspaceId is required");
  });
});
