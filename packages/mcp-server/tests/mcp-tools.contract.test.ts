import { describe, expect, it } from "vitest";

import {
  ARTIFACT_KINDS,
  createArtifactManifest
} from "../../../packages/artifacts/src/artifacts-domain";
import {
  BENCHMARK_CORPUS_VERSION,
  authorizedBenchmarkApps,
  benchmarkFixtureManifest,
  type AuthorizedBenchmarkAppId
} from "../../../packages/benchmark/src/corpus";
import {
  BENCHMARK_RUNNER_REPORT_VERSION,
  comparePlannerBackends
} from "../../../packages/benchmark-runner/src/benchmark-runner-domain";
import {
  compileJourneyDefinition,
  createRunSubmission
} from "../../../apps/control-plane/src/control-plane-domain";
import { summarizeReplayRun } from "../../../apps/replay-console/src/replay-console-domain";

import { AutomiumMcpError } from "../src/errors";
import { createAutomiumMcpServer } from "../src/server";

async function loadToolCaller() {
  try {
    const mod: Record<string, unknown> = await import("../src/tools");
    const callAutomiumMcpTool = mod.callAutomiumMcpTool;

    if (typeof callAutomiumMcpTool !== "function") {
      throw new Error(
        "Expected packages/mcp-server/src/tools.ts to export callAutomiumMcpTool(server, name, args) for Phase 2 tool adapters."
      );
    }

    return callAutomiumMcpTool as (
      server: ReturnType<typeof createAutomiumMcpServer>,
      name: string,
      args: unknown
    ) => unknown;
  } catch (error) {
    throw new Error(
      "Expected packages/mcp-server/src/tools.ts to expose a callAutomiumMcpTool helper for Phase 2 tool adapters.",
      { cause: error }
    );
  }
}

function expectModeledMetadata(value: unknown): void {
  expect(value).toMatchObject({
    modeled: true,
    liveBrowserExecuted: false,
    providerCallsMade: false,
    filesystemMutated: false,
    queued: false,
    artifactsFetched: false
  });
}

async function callTool(name: string, args: unknown): Promise<unknown> {
  const callAutomiumMcpTool = await loadToolCaller();
  const server = createAutomiumMcpServer();
  return callAutomiumMcpTool(server, name, args);
}

async function expectAutomiumMcpError(
  promise: Promise<unknown> | (() => Promise<unknown> | unknown),
  code: string
): Promise<void> {
  let thrown: unknown;
  try {
    const value = typeof promise === "function" ? promise() : promise;
    await Promise.resolve(value);
  } catch (error) {
    thrown = error;
  }

  expect(thrown).toBeInstanceOf(AutomiumMcpError);
  expect((thrown as AutomiumMcpError).code).toBe(code);
}

const foundryFixture = benchmarkFixtureManifest.find(
  (fixture) => fixture.appId === "foundry"
);
const altitudeFixture = benchmarkFixtureManifest.find(
  (fixture) => fixture.appId === "altitude"
);

if (!foundryFixture || !altitudeFixture) {
  throw new Error("Benchmark corpus is missing fixtures required by the MCP contract tests.");
}

const validJourneyInput = {
  id: "foundry-open-published-orders-app",
  appId: "foundry" satisfies AuthorizedBenchmarkAppId,
  fixtureId: foundryFixture.id,
  goal: "Open the published orders app",
  steps: [
    { intent: "navigate", target: "/foundry/apps/orders" },
    { intent: "click", target: "Published app" },
    { intent: "assert", target: "Orders table is visible" }
  ],
  assertions: [
    { id: "orders-visible", type: "semantic", target: "Orders table is visible" }
  ],
  recovery: { maxAttempts: 2, strategy: "bounded-retry" }
};

const validPlanner = {
  id: "planner-alpha",
  vendor: "openai",
  model: "gpt-4.1"
};

describe("automium_list_apps", () => {
  it("returns the authorized benchmark app list", async () => {
    const result = (await callTool("automium_list_apps", {})) as {
      apps: ReadonlyArray<{ id: string }>;
    };

    expect(result.apps.map((app) => app.id)).toEqual(
      authorizedBenchmarkApps.map((app) => app.id)
    );
  });

  it("rejects unsupported app filters", async () => {
    await expectAutomiumMcpError(
      () => callTool("automium_list_apps", { appId: "not-authorized" }),
      "invalid_app_id"
    );
  });
});

describe("automium_list_fixtures", () => {
  it("returns every fixture when no filter is supplied", async () => {
    const result = (await callTool("automium_list_fixtures", {})) as {
      fixtures: ReadonlyArray<{ id: string }>;
    };

    expect(result.fixtures.map((fixture) => fixture.id)).toEqual(
      benchmarkFixtureManifest.map((fixture) => fixture.id)
    );
  });

  it("filters fixtures by authorized app", async () => {
    const result = (await callTool("automium_list_fixtures", {
      appId: "altitude"
    })) as { fixtures: ReadonlyArray<{ id: string; appId: string }> };

    expect(result.fixtures.length).toBeGreaterThan(0);
    expect(result.fixtures.every((fixture) => fixture.appId === "altitude")).toBe(true);
  });

  it("rejects fixture/app mismatch", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_list_fixtures", {
          appId: "foundry",
          fixtureId: altitudeFixture.id
        }),
      "fixture_app_mismatch"
    );
  });

  it("rejects unauthorized app ids", async () => {
    await expectAutomiumMcpError(
      () => callTool("automium_list_fixtures", { appId: "unknown-app" }),
      "invalid_app_id"
    );
  });
});

describe("automium_compile_journey", () => {
  it("compiles a corpus-fixture journey", async () => {
    const expected = compileJourneyDefinition(validJourneyInput);

    const result = (await callTool(
      "automium_compile_journey",
      validJourneyInput
    )) as { compiled: typeof expected; modeled: boolean };

    expect(result.compiled).toEqual(expected);
    expectModeledMetadata(result);
  });

  it("rejects unsupported planner intents", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_compile_journey", {
          ...validJourneyInput,
          steps: [
            { intent: "teleport", target: "/foundry/apps/orders" }
          ]
        }),
      "unsupported_planner_intent"
    );
  });

  it("rejects fixture/app mismatch", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_compile_journey", {
          ...validJourneyInput,
          fixtureId: altitudeFixture.id
        }),
      "fixture_app_mismatch"
    );
  });

  it("rejects unauthorized app ids", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_compile_journey", {
          ...validJourneyInput,
          appId: "ghost-app"
        }),
      "invalid_app_id"
    );
  });

  it("rejects empty required identifiers", async () => {
    await expectAutomiumMcpError(
      () => callTool("automium_compile_journey", { ...validJourneyInput, id: "" }),
      "unsupported_v1_operation"
    );

    await expectAutomiumMcpError(
      () => callTool("automium_compile_journey", { ...validJourneyInput, goal: "" }),
      "unsupported_v1_operation"
    );
  });
});

describe("automium_create_run_submission", () => {
  const validRunInput = {
    journeyId: validJourneyInput.id,
    appId: validJourneyInput.appId,
    fixtureId: validJourneyInput.fixtureId,
    planner: validPlanner,
    environmentProfileId: "owned-baseline"
  };

  it("returns a contract-shaped submission with modeled metadata", async () => {
    const expected = createRunSubmission(validRunInput);

    const result = (await callTool(
      "automium_create_run_submission",
      validRunInput
    )) as { submission: typeof expected };

    expect(result.submission).toEqual(expected);
    expectModeledMetadata(result);
  });

  it("rejects malformed planner metadata", async () => {
    for (const field of ["id", "vendor", "model"] as const) {
      await expectAutomiumMcpError(
        () =>
          callTool("automium_create_run_submission", {
            ...validRunInput,
            planner: { ...validPlanner, [field]: "" }
          }),
        "malformed_planner_metadata"
      );
    }

    await expectAutomiumMcpError(
      () =>
        callTool("automium_create_run_submission", {
          ...validRunInput,
          planner: { vendor: "openai", model: "gpt-4.1" }
        }),
      "malformed_planner_metadata"
    );
  });

  it("rejects unauthorized app ids", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_create_run_submission", {
          ...validRunInput,
          appId: "unknown-app"
        }),
      "invalid_app_id"
    );
  });
});

describe("automium_get_replay_summary", () => {
  const validReplayInput = {
    runId: "run-foundry-open-published-orders-app-planner-alpha",
    verdict: "pass",
    retryCount: 0,
    artifactManifestRef: "artifacts/foundry/run-1/manifest.json"
  };

  it("wraps summarizeReplayRun with modeled metadata", async () => {
    const expected = summarizeReplayRun(validReplayInput);

    const result = (await callTool(
      "automium_get_replay_summary",
      validReplayInput
    )) as { summary: typeof expected };

    expect(result.summary).toEqual(expected);
    expectModeledMetadata(result);
  });

  it("rejects empty required fields", async () => {
    for (const field of ["runId", "verdict", "artifactManifestRef"] as const) {
      await expectAutomiumMcpError(
        () =>
          callTool("automium_get_replay_summary", {
            ...validReplayInput,
            [field]: ""
          }),
        "unsupported_v1_operation"
      );
    }
  });
});

describe("automium_get_artifact_manifest", () => {
  const validArtifactInput = {
    runId: "run-foundry-open-published-orders-app-planner-alpha",
    appId: "foundry" satisfies AuthorizedBenchmarkAppId,
    root: "artifacts/foundry/run-1",
    entries: [
      { kind: ARTIFACT_KINDS[0], path: "snapshots/snapshot-1.json" },
      { kind: ARTIFACT_KINDS[1], path: "logs/network.log" }
    ]
  };

  it("wraps createArtifactManifest with modeled metadata", async () => {
    const expected = createArtifactManifest({
      runId: validArtifactInput.runId,
      root: validArtifactInput.root,
      entries: validArtifactInput.entries
    });

    const result = (await callTool(
      "automium_get_artifact_manifest",
      validArtifactInput
    )) as { manifest: typeof expected };

    expect(result.manifest).toEqual(expected);
    expectModeledMetadata(result);
  });

  it("rejects unsupported artifact kinds", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_get_artifact_manifest", {
          ...validArtifactInput,
          entries: [{ kind: "video-capture", path: "captures/video.mp4" }]
        }),
      "invalid_artifact_kind"
    );
  });

  it("rejects absolute artifact entry paths", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_get_artifact_manifest", {
          ...validArtifactInput,
          entries: [
            { kind: ARTIFACT_KINDS[0], path: "/absolute/etc/passwd" }
          ]
        }),
      "unsupported_v1_operation"
    );
  });

  it("rejects unauthorized owning app ids", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_get_artifact_manifest", {
          ...validArtifactInput,
          appId: "unknown-app"
        }),
      "invalid_app_id"
    );
  });
});

describe("automium_compare_planners", () => {
  const validCompareInput = {
    corpusVersion: BENCHMARK_CORPUS_VERSION,
    appIds: ["foundry", "altitude"],
    planners: [
      validPlanner,
      { id: "planner-beta", vendor: "anthropic", model: "claude-4.7" }
    ],
    repetitions: 2
  };

  it("returns a modeled comparison report", async () => {
    const expected = comparePlannerBackends(validCompareInput);

    const result = (await callTool(
      "automium_compare_planners",
      validCompareInput
    )) as { report: typeof expected };

    expect(result.report).toEqual(expected);
    expect(result.report.reportVersion).toBe(BENCHMARK_RUNNER_REPORT_VERSION);
    expectModeledMetadata(result);
  });

  it("rejects unsupported corpus versions", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_compare_planners", {
          ...validCompareInput,
          corpusVersion: "v0"
        }),
      "unsupported_corpus_version"
    );
  });

  it("rejects malformed planner metadata", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_compare_planners", {
          ...validCompareInput,
          planners: [{ id: "planner-gamma", vendor: "", model: "gpt-4.1" }]
        }),
      "malformed_planner_metadata"
    );
  });

  it("normalizes repetitions to at least one", async () => {
    const result = (await callTool("automium_compare_planners", {
      ...validCompareInput,
      repetitions: 0
    })) as { report: { plannerReports: ReadonlyArray<{ repetitions: number }> } };

    for (const plannerReport of result.report.plannerReports) {
      expect(plannerReport.repetitions).toBeGreaterThanOrEqual(1);
    }
  });

  it("rejects empty appIds arrays", async () => {
    await expectAutomiumMcpError(
      () =>
        callTool("automium_compare_planners", {
          ...validCompareInput,
          appIds: []
        }),
      "unsupported_v1_operation"
    );
  });
});
