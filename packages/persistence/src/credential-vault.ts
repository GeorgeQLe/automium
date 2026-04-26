import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const SALT = "automium-credential-vault-v1";

function deriveKey(key: string): Buffer {
  return scryptSync(key, SALT, 32);
}

export async function encryptCredential(
  plaintext: string,
  key: string,
): Promise<string> {
  const derivedKey = deriveKey(key);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, derivedKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${authTag.toString("base64")}.${encrypted.toString("base64")}`;
}

export async function decryptCredential(
  ciphertext: string,
  key: string,
): Promise<string> {
  const derivedKey = deriveKey(key);
  const [ivB64, authTagB64, encryptedB64] = ciphertext.split(".");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");
  const decipher = createDecipheriv(ALGORITHM, derivedKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
}

export async function storeCredential(
  db: unknown,
  params: {
    organizationId: string;
    workspaceId: string;
    scope: string;
    purpose: string;
    plaintext: string;
    key: string;
  },
): Promise<void> {
  void db;
  void params;
  throw new Error(
    "storeCredential() requires a database connection — will be wired in a later step",
  );
}

export async function retrieveCredential(
  db: unknown,
  params: {
    organizationId: string;
    workspaceId: string;
    scope: string;
    purpose: string;
    key: string;
  },
): Promise<string> {
  void db;
  void params;
  throw new Error(
    "retrieveCredential() requires a database connection — will be wired in a later step",
  );
}
