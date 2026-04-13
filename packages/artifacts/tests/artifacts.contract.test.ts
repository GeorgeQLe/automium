import { describe, expect, it } from "vitest";

async function loadArtifacts() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/artifacts/src/index.ts to expose artifact bundle contracts for Phase 7.",
      { cause: error }
    );
  }
}

describe("artifact bundle contract", () => {
  it("builds a run artifact manifest with replay-critical references", async () => {
    const mod = await loadArtifacts();

    const manifest = mod.createArtifactManifest({
      runId: "run-alpha-altitude",
      root: "artifacts/altitude/run-alpha-altitude",
      entries: [
        { kind: "semantic-snapshot", path: "snapshots/snap-1.json" },
        { kind: "network-log", path: "network/network.jsonl" },
        { kind: "console-log", path: "console/console.jsonl" },
        { kind: "download", path: "downloads/report.csv" },
        { kind: "targeted-crop", path: "vision/crop-1.png" }
      ]
    });

    expect(manifest).toMatchObject({
      schemaVersion: "v1",
      runId: "run-alpha-altitude",
      entries: expect.arrayContaining([
        expect.objectContaining({ kind: "semantic-snapshot" }),
        expect.objectContaining({ kind: "targeted-crop" })
      ])
    });
  });

  it("enforces retention metadata for tenant-owned runs", async () => {
    const mod = await loadArtifacts();

    expect(
      mod.calculateArtifactRetention({
        tenantId: "tenant-alpha",
        runVerdict: "pass",
        createdAt: "2026-04-12T00:00:00.000Z"
      })
    ).toMatchObject({
      tenantId: "tenant-alpha",
      retentionDays: expect.any(Number),
      expiresAt: expect.any(String)
    });
  });
});
