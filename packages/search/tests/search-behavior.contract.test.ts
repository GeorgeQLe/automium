import { describe, expect, it } from "vitest";

async function loadSearchBehavior() {
  try {
    return await import("../src/search-behavior");
  } catch (error) {
    throw new Error(
      "Expected packages/search/src/search-behavior.ts to define the shared search behavior module for Phase 3.",
      { cause: error }
    );
  }
}

describe("search behavior contract", () => {
  it("createSearchIndexingRequest() produces request with tenancy fields", async () => {
    const mod = await loadSearchBehavior();
    const request = mod.createSearchIndexingRequest({
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "file",
      resourceId: "file_abc",
      content: "document contents here",
    });

    expect(request.requestId).toBeTruthy();
    expect(request.organizationId).toBe("org_1");
    expect(request.workspaceId).toBe("ws_1");
    expect(request.resourceType).toBe("file");
    expect(request.resourceId).toBe("file_abc");
    expect(request.content).toBe("document contents here");
  });

  it("createSearchIndexEntry() from request preserves tenancy and content", async () => {
    const mod = await loadSearchBehavior();
    const request = mod.createSearchIndexingRequest({
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "job",
      resourceId: "job_123",
      content: "job output data",
    });

    const entry = mod.createSearchIndexEntry(request);
    expect(entry.entryId).toBeTruthy();
    expect(entry.organizationId).toBe("org_1");
    expect(entry.workspaceId).toBe("ws_1");
    expect(entry.resourceType).toBe("job");
    expect(entry.resourceId).toBe("job_123");
    expect(entry.content).toBe("job output data");
    expect(entry.indexedAt).toBeTruthy();
  });

  it("validateSearchIndexingRequest() catches missing fields", async () => {
    const mod = await loadSearchBehavior();
    const invalid = {
      requestId: "",
      organizationId: "",
      workspaceId: "ws_1",
      resourceType: "file" as const,
      resourceId: "",
      content: "",
    };

    const errors = mod.validateSearchIndexingRequest(invalid);
    expect(errors).toContain("requestId is required");
    expect(errors).toContain("organizationId is required");
    expect(errors).toContain("resourceId is required");
    expect(errors).toContain("content is required");
    expect(errors).not.toContain("workspaceId is required");
  });

  it("validateSearchIndexingRequest() rejects invalid resourceType", async () => {
    const mod = await loadSearchBehavior();
    const invalid = {
      requestId: "sir_1",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "unknown-type" as never,
      resourceId: "res_1",
      content: "some content",
    };

    const errors = mod.validateSearchIndexingRequest(invalid);
    expect(errors).toContain("Invalid resourceType: unknown-type");
  });
});
