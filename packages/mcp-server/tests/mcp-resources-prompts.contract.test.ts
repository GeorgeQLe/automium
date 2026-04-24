import { describe, expect, it } from "vitest";

import {
  authorizedBenchmarkApps,
  benchmarkFixtureManifest
} from "../../../packages/benchmark/src/corpus";
import { PLANNER_INTENT_VOCABULARY } from "../../../packages/contracts/src/planner-adapter";
import { REPLAY_EVENT_SCHEMA_VERSION } from "../../../packages/contracts/src/replay-event";
import { SEMANTIC_SNAPSHOT_SCHEMA_VERSION } from "../../../packages/contracts/src/semantic-snapshot";

import { AutomiumMcpError } from "../src/errors";
import { createAutomiumMcpServer } from "../src/server";

async function loadResourceReader() {
  try {
    const mod: Record<string, unknown> = await import("../src/resources");
    const readAutomiumMcpResource = mod.readAutomiumMcpResource;

    if (typeof readAutomiumMcpResource !== "function") {
      throw new Error(
        "Expected packages/mcp-server/src/resources.ts to export readAutomiumMcpResource(server, uri) for Phase 3 resource handlers."
      );
    }

    return readAutomiumMcpResource as (
      server: ReturnType<typeof createAutomiumMcpServer>,
      uri: string
    ) => unknown;
  } catch (error) {
    throw new Error(
      "Expected packages/mcp-server/src/resources.ts to expose a readAutomiumMcpResource helper for Phase 3 resource handlers.",
      { cause: error }
    );
  }
}

async function loadPromptGetter() {
  try {
    const mod: Record<string, unknown> = await import("../src/prompts");
    const getAutomiumMcpPrompt = mod.getAutomiumMcpPrompt;

    if (typeof getAutomiumMcpPrompt !== "function") {
      throw new Error(
        "Expected packages/mcp-server/src/prompts.ts to export getAutomiumMcpPrompt(server, name, args) for Phase 3 prompt handlers."
      );
    }

    return getAutomiumMcpPrompt as (
      server: ReturnType<typeof createAutomiumMcpServer>,
      name: string,
      args: unknown
    ) => unknown;
  } catch (error) {
    throw new Error(
      "Expected packages/mcp-server/src/prompts.ts to expose a getAutomiumMcpPrompt helper for Phase 3 prompt handlers.",
      { cause: error }
    );
  }
}

async function readResource(uri: string): Promise<unknown> {
  const readAutomiumMcpResource = await loadResourceReader();
  const server = createAutomiumMcpServer();
  return readAutomiumMcpResource(server, uri);
}

async function getPrompt(name: string, args: unknown): Promise<unknown> {
  const getAutomiumMcpPrompt = await loadPromptGetter();
  const server = createAutomiumMcpServer();
  return getAutomiumMcpPrompt(server, name, args);
}

async function expectAutomiumMcpError(
  invocation: () => Promise<unknown> | unknown,
  code: string
): Promise<void> {
  let thrown: unknown;
  try {
    await Promise.resolve(invocation());
  } catch (error) {
    thrown = error;
  }

  expect(thrown).toBeInstanceOf(AutomiumMcpError);
  expect((thrown as AutomiumMcpError).code).toBe(code);
}

const foundryFixture = benchmarkFixtureManifest.find(
  (fixture) => fixture.appId === "foundry"
);

if (!foundryFixture) {
  throw new Error(
    "Benchmark corpus is missing the foundry fixture required by the MCP resource/prompt contract tests."
  );
}

describe("automium://apps resource", () => {
  it("returns the authorized benchmark app manifest", async () => {
    const payload = (await readResource("automium://apps")) as {
      authorizedBenchmarkApps: ReadonlyArray<{
        id: string;
        name: string;
        kind: string;
        environmentProfileId: string;
      }>;
    };

    expect(payload.authorizedBenchmarkApps.map((app) => app.id)).toEqual(
      authorizedBenchmarkApps.map((app) => app.id)
    );
    for (const app of payload.authorizedBenchmarkApps) {
      expect(app).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          kind: expect.any(String),
          environmentProfileId: expect.any(String)
        })
      );
    }
  });
});

describe("automium://fixtures resource", () => {
  it("returns the benchmark fixture manifest", async () => {
    const payload = (await readResource("automium://fixtures")) as {
      benchmarkFixtureManifest: ReadonlyArray<{
        id: string;
        appId: string;
        description: string;
      }>;
    };

    expect(payload.benchmarkFixtureManifest.map((fixture) => fixture.id)).toEqual(
      benchmarkFixtureManifest.map((fixture) => fixture.id)
    );
    for (const fixture of payload.benchmarkFixtureManifest) {
      expect(fixture).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          appId: expect.any(String),
          description: expect.any(String)
        })
      );
    }
  });
});

describe("automium://contracts/planner-adapter-v1 resource", () => {
  it("summarizes the planner adapter contract without filesystem reads", async () => {
    const payload = (await readResource(
      "automium://contracts/planner-adapter-v1"
    )) as {
      intentVocabulary: ReadonlyArray<string>;
      intentSchemaVersion: string;
    };

    expect(payload.intentVocabulary).toEqual([...PLANNER_INTENT_VOCABULARY]);
    expect(typeof payload.intentSchemaVersion).toBe("string");
    expect(payload.intentSchemaVersion.length).toBeGreaterThan(0);
  });
});

describe("automium://contracts/replay-event-v1 resource", () => {
  it("surfaces the replay event contract version and phases", async () => {
    const payload = (await readResource(
      "automium://contracts/replay-event-v1"
    )) as {
      schemaVersion: string;
      phases: ReadonlyArray<string>;
    };

    expect(payload.schemaVersion).toBe(REPLAY_EVENT_SCHEMA_VERSION);
    expect(Array.isArray(payload.phases)).toBe(true);
    expect(payload.phases.length).toBeGreaterThan(0);
  });
});

describe("automium://contracts/semantic-snapshot-v1 resource", () => {
  it("surfaces the semantic snapshot contract version and shape", async () => {
    const payload = (await readResource(
      "automium://contracts/semantic-snapshot-v1"
    )) as {
      schemaVersion: string;
      requiredFields: ReadonlyArray<string>;
    };

    expect(payload.schemaVersion).toBe(SEMANTIC_SNAPSHOT_SCHEMA_VERSION);
    expect(Array.isArray(payload.requiredFields)).toBe(true);
    expect(payload.requiredFields.length).toBeGreaterThan(0);
  });
});

describe("resource failure coverage", () => {
  it("rejects URIs outside the fixed v1 set", async () => {
    for (const uri of [
      "automium://unknown",
      "automium://apps/../etc/passwd",
      "file:///etc/passwd"
    ]) {
      await expectAutomiumMcpError(
        () => readResource(uri),
        "unsupported_resource_uri"
      );
    }
  });
});

describe("draft_journey prompt", () => {
  it("returns messages that reference the owned corpus and frozen intent vocabulary", async () => {
    const payload = (await getPrompt("draft_journey", {
      appId: "foundry",
      fixtureId: foundryFixture.id,
      intent: "navigate",
      goal: "Open the published orders app"
    })) as {
      messages: ReadonlyArray<{ role: string; content: { text?: string } | string }>;
    };

    expect(Array.isArray(payload.messages)).toBe(true);
    expect(payload.messages.length).toBeGreaterThan(0);
    const combined = payload.messages
      .map((msg) =>
        typeof msg.content === "string" ? msg.content : msg.content.text ?? ""
      )
      .join("\n");
    expect(combined).toContain("foundry");
    expect(combined).toContain(foundryFixture.id);
    expect(combined.toLowerCase()).toContain("intent");
  });
});

describe("debug_failed_run prompt", () => {
  it("returns guidance referencing artifact/replay interpretation and bounded recovery", async () => {
    const payload = (await getPrompt("debug_failed_run", {
      runId: "run-foundry-open-published-orders-app-planner-alpha",
      artifactManifestRef: "artifacts/foundry/run-1/manifest.json",
      verdict: "fail"
    })) as {
      messages: ReadonlyArray<{ role: string; content: { text?: string } | string }>;
    };

    expect(Array.isArray(payload.messages)).toBe(true);
    expect(payload.messages.length).toBeGreaterThan(0);
    const combined = payload.messages
      .map((msg) =>
        typeof msg.content === "string" ? msg.content : msg.content.text ?? ""
      )
      .join("\n")
      .toLowerCase();
    expect(combined).toContain("replay");
    expect(combined).toContain("artifact");
    expect(combined).toContain("recovery");
  });
});

describe("compare_planner_backends prompt", () => {
  it("returns guidance referencing modeled planner comparison semantics", async () => {
    const payload = (await getPrompt("compare_planner_backends", {
      appIds: ["foundry"],
      planners: [
        { id: "planner-alpha", vendor: "openai", model: "gpt-4.1" },
        { id: "planner-beta", vendor: "anthropic", model: "claude-sonnet-4-6" }
      ],
      corpusVersion: "v1"
    })) as {
      messages: ReadonlyArray<{ role: string; content: { text?: string } | string }>;
    };

    expect(Array.isArray(payload.messages)).toBe(true);
    expect(payload.messages.length).toBeGreaterThan(0);
    const combined = payload.messages
      .map((msg) =>
        typeof msg.content === "string" ? msg.content : msg.content.text ?? ""
      )
      .join("\n");
    expect(combined).toContain("comparePlannerBackends");
    expect(combined.toLowerCase()).toContain("modeled");
  });
});

describe("prompt failure coverage", () => {
  it("rejects prompts with omitted required identifiers", async () => {
    await expectAutomiumMcpError(
      () =>
        getPrompt("draft_journey", {
          appId: "",
          fixtureId: foundryFixture.id,
          intent: "navigate",
          goal: "Open the published orders app"
        }),
      "unsupported_v1_operation"
    );

    await expectAutomiumMcpError(
      () =>
        getPrompt("debug_failed_run", {
          runId: "",
          artifactManifestRef: "artifacts/foundry/run-1/manifest.json",
          verdict: "fail"
        }),
      "unsupported_v1_operation"
    );

    await expectAutomiumMcpError(
      () =>
        getPrompt("compare_planner_backends", {
          appIds: [],
          planners: [],
          corpusVersion: "v1"
        }),
      "unsupported_v1_operation"
    );
  });

  it("rejects unknown prompt names", async () => {
    await expectAutomiumMcpError(
      () => getPrompt("not_a_real_prompt", {}),
      "unsupported_v1_operation"
    );
  });
});
