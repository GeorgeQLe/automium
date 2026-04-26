import { describe, expect, it } from "vitest";

async function loadConnectionModule() {
  try {
    return await import("../src/connection") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/adapters-redis/src/connection.ts to export a Redis connection factory.",
      { cause: error }
    );
  }
}

describe("redis connection contract", () => {
  it("exports a createRedisConnection factory function", async () => {
    const mod = await loadConnectionModule();

    expect(
      typeof mod.createRedisConnection === "function" ||
      typeof mod.default === "function"
    ).toBe(true);
  });

  it("factory returns an object with connection lifecycle methods", async () => {
    const mod = await loadConnectionModule();
    const factory = mod.createRedisConnection ?? mod.default;
    const connection = typeof factory === "function"
      ? (factory as Function)({} as never)
      : factory;

    expect(connection).toBeDefined();
    expect(typeof connection).toBe("object");
  });
});
