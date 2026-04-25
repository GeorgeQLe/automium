import { describe, expect, it } from "vitest";

async function loadSchemaModule() {
  try {
    return await import("../src/schema/index");
  } catch (error) {
    throw new Error(
      "Expected packages/persistence/src/schema/index.ts to export all Drizzle table definitions.",
      { cause: error }
    );
  }
}

async function loadConnectionModule() {
  try {
    return await import("../src/connection");
  } catch (error) {
    throw new Error(
      "Expected packages/persistence/src/connection.ts to export a database connection factory.",
      { cause: error }
    );
  }
}

async function loadMigrateModule() {
  try {
    return await import("../src/migrate");
  } catch (error) {
    throw new Error(
      "Expected packages/persistence/src/migrate.ts to export a migration runner.",
      { cause: error }
    );
  }
}

describe("schema contract", () => {
  const tenancyTables = ["organizations", "workspaces", "memberships"] as const;
  const authTables = ["sessions", "invites"] as const;
  const journeyTables = [
    "journeys",
    "journeyVersions",
    "runs",
    "steps",
    "assertions",
    "recoveryRules",
  ] as const;
  const supportingTables = [
    "artifactManifests",
    "auditEvents",
    "credentials",
    "files",
    "jobs",
  ] as const;

  const allTables = [
    ...tenancyTables,
    ...authTables,
    ...journeyTables,
    ...supportingTables,
  ];

  it("exports all core table definitions", async () => {
    const schema = await loadSchemaModule();

    for (const table of allTables) {
      expect(schema).toHaveProperty(table);
      expect(schema[table as keyof typeof schema]).toBeTruthy();
    }
  });

  it("each table export has column definitions", async () => {
    const schema = await loadSchemaModule();

    for (const table of allTables) {
      const tableObj = schema[table as keyof typeof schema] as Record<string, unknown>;
      expect(tableObj).toBeTruthy();
      // Drizzle table objects expose a Symbol-keyed config or a direct columns property
      const hasColumns =
        typeof tableObj === "object" &&
        tableObj !== null &&
        (Object.keys(tableObj).length > 0 || Object.getOwnPropertySymbols(tableObj).length > 0);
      expect(hasColumns).toBe(true);
    }
  });

  it("tenancy tables include organizations, workspaces, and memberships", async () => {
    const schema = await loadSchemaModule();
    for (const table of tenancyTables) {
      expect(schema).toHaveProperty(table);
    }
  });

  it("auth tables include sessions and invites", async () => {
    const schema = await loadSchemaModule();
    for (const table of authTables) {
      expect(schema).toHaveProperty(table);
    }
  });

  it("journey tables include journeys, journeyVersions, runs, steps, assertions, and recoveryRules", async () => {
    const schema = await loadSchemaModule();
    for (const table of journeyTables) {
      expect(schema).toHaveProperty(table);
    }
  });

  it("supporting tables include artifactManifests, auditEvents, credentials, files, and jobs", async () => {
    const schema = await loadSchemaModule();
    for (const table of supportingTables) {
      expect(schema).toHaveProperty(table);
    }
  });

  it("connection module exports a createDb function", async () => {
    const conn = await loadConnectionModule();
    expect(typeof conn.createDb).toBe("function");
  });

  it("migrate module exports a migrate function", async () => {
    const mig = await loadMigrateModule();
    expect(typeof mig.migrate).toBe("function");
  });
});
