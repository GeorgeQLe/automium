import { describe, expect, it } from "vitest";

async function loadCredentialVault() {
  try {
    return await import("../src/credential-vault");
  } catch (error) {
    throw new Error(
      "Expected packages/persistence/src/credential-vault.ts to define the encrypted credential vault module.",
      { cause: error }
    );
  }
}

describe("credential vault contract", () => {
  const testKey = "test-encryption-key-32-bytes-ok!"; // 32 bytes for AES-256

  it("encryptCredential() returns ciphertext different from plaintext", async () => {
    const mod = await loadCredentialVault();
    const plaintext = "super-secret-api-key-12345";
    const ciphertext = await mod.encryptCredential(plaintext, testKey);

    expect(typeof ciphertext).toBe("string");
    expect(ciphertext).not.toBe(plaintext);
    expect(ciphertext.length).toBeGreaterThan(0);
  });

  it("decryptCredential() recovers the original plaintext", async () => {
    const mod = await loadCredentialVault();
    const plaintext = "my-secret-value";
    const ciphertext = await mod.encryptCredential(plaintext, testKey);
    const recovered = await mod.decryptCredential(ciphertext, testKey);

    expect(recovered).toBe(plaintext);
  });

  it("round-trip encrypt then decrypt returns original value", async () => {
    const mod = await loadCredentialVault();
    const values = [
      "short",
      "a longer secret value with spaces and special chars !@#$%",
      '{"json":"value","nested":{"key":123}}',
      "",
    ];

    for (const original of values) {
      const ciphertext = await mod.encryptCredential(original, testKey);
      const recovered = await mod.decryptCredential(ciphertext, testKey);
      expect(recovered).toBe(original);
    }
  });

  it("different keys produce different ciphertext", async () => {
    const mod = await loadCredentialVault();
    const plaintext = "same-secret-for-both-keys";
    const keyA = "key-aaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const keyB = "key-bbbbbbbbbbbbbbbbbbbbbbbbbbbb";

    const ciphertextA = await mod.encryptCredential(plaintext, keyA);
    const ciphertextB = await mod.encryptCredential(plaintext, keyB);

    expect(ciphertextA).not.toBe(ciphertextB);
  });

  it("decryption with wrong key throws", async () => {
    const mod = await loadCredentialVault();
    const plaintext = "encrypted-with-key-a";
    const correctKey = "correct-key-32-bytes-padded-ok!!";
    const wrongKey = "wrong---key-32-bytes-padded-ok!!";

    const ciphertext = await mod.encryptCredential(plaintext, correctKey);

    await expect(mod.decryptCredential(ciphertext, wrongKey)).rejects.toThrow();
  });

  it("storeCredential() accepts scoped params shape", async () => {
    const mod = await loadCredentialVault();
    expect(typeof mod.storeCredential).toBe("function");

    // Verify it accepts the expected parameter shape (will need a db pool in real usage)
    expect(mod.storeCredential.length).toBeGreaterThanOrEqual(1);
  });

  it("retrieveCredential() accepts scoped params shape", async () => {
    const mod = await loadCredentialVault();
    expect(typeof mod.retrieveCredential).toBe("function");

    expect(mod.retrieveCredential.length).toBeGreaterThanOrEqual(1);
  });
});
