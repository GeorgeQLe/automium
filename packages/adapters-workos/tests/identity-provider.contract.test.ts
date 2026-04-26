import { describe, expect, it } from "vitest";

async function loadIdentityProviderModule() {
  try {
    return await import("../src/identity-provider") as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      "Expected packages/adapters-workos/src/identity-provider.ts to implement the IdentityProviderAdapter.",
      { cause: error }
    );
  }
}

describe("identity provider adapter contract", () => {
  it("exports a factory function for creating the adapter", async () => {
    const mod = await loadIdentityProviderModule();
    expect(
      typeof mod.createIdentityProviderAdapter === "function" ||
      typeof mod.IdentityProviderAdapter === "function" ||
      typeof mod.default === "function"
    ).toBe(true);
  });

  it("adapter has boundary property set to 'identity-provider'", async () => {
    const mod = await loadIdentityProviderModule();
    const factory = mod.createIdentityProviderAdapter ?? mod.IdentityProviderAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(adapter.boundary).toBe("identity-provider");
  });

  it("adapter exposes authenticate() method", async () => {
    const mod = await loadIdentityProviderModule();
    const factory = mod.createIdentityProviderAdapter ?? mod.IdentityProviderAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(typeof adapter.authenticate).toBe("function");
  });

  it("adapter exposes validateToken() method", async () => {
    const mod = await loadIdentityProviderModule();
    const factory = mod.createIdentityProviderAdapter ?? mod.IdentityProviderAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    expect(typeof adapter.validateToken).toBe("function");
  });

  it("authenticate() returns { identityId, provider } shape", async () => {
    const mod = await loadIdentityProviderModule();
    const factory = mod.createIdentityProviderAdapter ?? mod.IdentityProviderAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    const result = await adapter.authenticate({
      email: "user@example.com",
      method: "magic-link",
    });

    expect(result).toHaveProperty("identityId");
    expect(result).toHaveProperty("provider");
    expect(typeof result.identityId).toBe("string");
    expect(typeof result.provider).toBe("string");
  });

  it("validateToken() returns { valid, identityId } shape", async () => {
    const mod = await loadIdentityProviderModule();
    const factory = mod.createIdentityProviderAdapter ?? mod.IdentityProviderAdapter ?? mod.default;
    const adapter = typeof factory === "function"
      ? factory({} as never)
      : factory;

    const result = await adapter.validateToken("test-token-abc123");

    expect(result).toHaveProperty("valid");
    expect(typeof result.valid).toBe("boolean");
    if (result.valid) {
      expect(typeof result.identityId).toBe("string");
    }
  });
});
