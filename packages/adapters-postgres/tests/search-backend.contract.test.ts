import { describe, expect, it } from "vitest";

async function loadSearchBackendModule() {
  try {
    return await import("../src/search-backend");
  } catch (error) {
    throw new Error(
      "Expected packages/adapters-postgres/src/search-backend.ts to implement the SearchBackendAdapter.",
      { cause: error }
    );
  }
}

describe("search backend adapter contract", () => {
  it("exports a factory function for creating the adapter", async () => {
    const mod = await loadSearchBackendModule();
    expect(
      typeof mod.createSearchBackendAdapter === "function" ||
      typeof mod.SearchBackendAdapter === "function" ||
      typeof mod.default === "function"
    ).toBe(true);
  });

  it("adapter has boundary property set to 'search-backend'", async () => {
    const mod = await loadSearchBackendModule();
    const factory = mod.createSearchBackendAdapter ?? mod.SearchBackendAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(adapter.boundary).toBe("search-backend");
  });

  it("adapter exposes index() method", async () => {
    const mod = await loadSearchBackendModule();
    const factory = mod.createSearchBackendAdapter ?? mod.SearchBackendAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(typeof adapter.index).toBe("function");
  });

  it("adapter exposes search() method", async () => {
    const mod = await loadSearchBackendModule();
    const factory = mod.createSearchBackendAdapter ?? mod.SearchBackendAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(typeof adapter.search).toBe("function");
  });

  it("index() returns { indexed, entryId } shape", async () => {
    const mod = await loadSearchBackendModule();
    const factory = mod.createSearchBackendAdapter ?? mod.SearchBackendAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    const result = await adapter.index({
      entryId: "entry_test",
      organizationId: "org_1",
      workspaceId: "ws_1",
      resourceType: "journey",
      resourceId: "jrn_1",
      content: "Test journey for search indexing",
    });

    expect(result).toHaveProperty("indexed");
    expect(result).toHaveProperty("entryId");
    expect(typeof result.indexed).toBe("boolean");
    expect(typeof result.entryId).toBe("string");
  });

  it("search() returns { results } shape", async () => {
    const mod = await loadSearchBackendModule();
    const factory = mod.createSearchBackendAdapter ?? mod.SearchBackendAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    const result = await adapter.search("test query", {
      organizationId: "org_1",
      workspaceId: "ws_1",
    });

    expect(result).toHaveProperty("results");
    expect(Array.isArray(result.results)).toBe(true);
  });
});
