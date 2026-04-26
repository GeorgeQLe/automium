export function createIdentityProviderAdapter(_config: unknown) {
  return {
    boundary: "identity-provider" as const,

    async authenticate(_credentials: { email: string; method: string }) {
      return { identityId: "stub", provider: "magic-link" };
    },

    async validateToken(_token: string) {
      return { valid: false } as { valid: boolean; identityId?: string };
    },
  };
}
