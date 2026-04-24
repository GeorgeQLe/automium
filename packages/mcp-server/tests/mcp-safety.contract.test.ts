import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  BENCHMARK_CORPUS_VERSION,
  benchmarkFixtureManifest,
  type AuthorizedBenchmarkAppId
} from "../../benchmark/src/corpus";
import { ARTIFACT_KINDS } from "../../artifacts/src/artifacts-domain";

import { AutomiumMcpError } from "../src/errors";
import { readAutomiumMcpResource } from "../src/resources";
import { createAutomiumMcpServer } from "../src/server";
import { automiumMcpToolDescriptors, callAutomiumMcpTool } from "../src/tools";

const MCP_SRC_DIR = fileURLToPath(new URL("../src", import.meta.url));

export const FORBIDDEN_MCP_IMPORTS: readonly { readonly pattern: RegExp; readonly label: string }[] = [
  { pattern: /from\s+["']playwright["']/g, label: "browser driver: playwright" },
  { pattern: /from\s+["']playwright-core["']/g, label: "browser driver: playwright-core" },
  { pattern: /from\s+["']puppeteer["']/g, label: "browser driver: puppeteer" },
  { pattern: /from\s+["']webdriverio["']/g, label: "browser driver: webdriverio" },
  { pattern: /from\s+["']selenium-webdriver["']/g, label: "browser driver: selenium-webdriver" },
  { pattern: /from\s+["']@anthropic-ai\/[^"']+["']/g, label: "provider SDK: @anthropic-ai/*" },
  { pattern: /from\s+["']openai["']/g, label: "provider SDK: openai" },
  { pattern: /from\s+["']@google\/generative-ai["']/g, label: "provider SDK: @google/generative-ai" },
  { pattern: /from\s+["']cohere-ai["']/g, label: "provider SDK: cohere-ai" },
  { pattern: /from\s+["']dotenv["']/g, label: "credential access: dotenv" },
  { pattern: /from\s+["']keytar["']/g, label: "credential access: keytar" },
  { pattern: /process\.env\.[A-Z0-9_]*API_KEY/g, label: "credential access: process.env.*_API_KEY" },
  { pattern: /process\.env\.[A-Z0-9_]*SECRET/g, label: "credential access: process.env.*_SECRET" },
  { pattern: /process\.env\.[A-Z0-9_]*TOKEN/g, label: "credential access: process.env.*_TOKEN" },
  { pattern: /from\s+["']http["']/g, label: "network transport: http" },
  { pattern: /from\s+["']https["']/g, label: "network transport: https" },
  { pattern: /from\s+["']node:http["']/g, label: "network transport: node:http" },
  { pattern: /from\s+["']node:https["']/g, label: "network transport: node:https" },
  { pattern: /from\s+["']node:net["']/g, label: "network transport: node:net" },
  { pattern: /from\s+["']net["']/g, label: "network transport: net" },
  { pattern: /from\s+["']ws["']/g, label: "network transport: ws" },
  { pattern: /from\s+["']express["']/g, label: "network transport: express" },
  { pattern: /from\s+["']fastify["']/g, label: "network transport: fastify" },
  { pattern: /SSEServerTransport/g, label: "network transport: SSEServerTransport" },
  { pattern: /StreamableHTTPServerTransport/g, label: "network transport: StreamableHTTPServerTransport" },
  { pattern: /\bwriteFileSync\b/g, label: "filesystem write: writeFileSync" },
  { pattern: /\bcreateWriteStream\b/g, label: "filesystem write: createWriteStream" },
  { pattern: /fs\.write[A-Z]/g, label: "filesystem write: fs.write*" },
  { pattern: /fs\.promises\.write[A-Z]/g, label: "filesystem write: fs.promises.write*" },
  { pattern: /\bappendFileSync\b/g, label: "filesystem write: appendFileSync" },
  { pattern: /\bmkdirSync\b/g, label: "filesystem write: mkdirSync" }
];

async function listMcpSourceFiles(): Promise<readonly string[]> {
  const entries = await readdir(MCP_SRC_DIR, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(join(MCP_SRC_DIR, entry.name));
    }
  }
  files.sort();
  return files;
}

const foundryFixture = benchmarkFixtureManifest.find(
  (fixture) => fixture.appId === "foundry"
);

if (!foundryFixture) {
  throw new Error(
    "Benchmark corpus is missing the foundry fixture required by the MCP safety contract tests."
  );
}

const modeledToolInvocations: ReadonlyArray<{ readonly name: string; readonly args: unknown }> = [
  {
    name: "automium_compile_journey",
    args: {
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
    }
  },
  {
    name: "automium_create_run_submission",
    args: {
      journeyId: "foundry-open-published-orders-app",
      appId: "foundry" satisfies AuthorizedBenchmarkAppId,
      fixtureId: foundryFixture.id,
      planner: { id: "planner-alpha", vendor: "openai", model: "gpt-4.1" },
      environmentProfileId: "owned-baseline"
    }
  },
  {
    name: "automium_get_replay_summary",
    args: {
      runId: "run-foundry-open-published-orders-app-planner-alpha",
      verdict: "pass",
      retryCount: 0,
      artifactManifestRef: "artifacts/foundry/run-1/manifest.json"
    }
  },
  {
    name: "automium_get_artifact_manifest",
    args: {
      runId: "run-foundry-open-published-orders-app-planner-alpha",
      appId: "foundry" satisfies AuthorizedBenchmarkAppId,
      root: "artifacts/foundry/run-1",
      entries: [
        { kind: ARTIFACT_KINDS[0], path: "snapshots/snapshot-1.json" },
        { kind: ARTIFACT_KINDS[1], path: "logs/network.log" }
      ]
    }
  },
  {
    name: "automium_compare_planners",
    args: {
      corpusVersion: BENCHMARK_CORPUS_VERSION,
      appIds: ["foundry"],
      planners: [
        { id: "planner-alpha", vendor: "openai", model: "gpt-4.1" },
        { id: "planner-beta", vendor: "anthropic", model: "claude-sonnet-4-6" }
      ],
      repetitions: 1
    }
  }
];

describe("mcp-server source safety scan", () => {
  it("does not import browser drivers, provider SDKs, credential helpers, network transports, or filesystem writers", async () => {
    const files = await listMcpSourceFiles();
    expect(files.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const file of files) {
      const source = await readFile(file, "utf8");
      for (const { pattern, label } of FORBIDDEN_MCP_IMPORTS) {
        pattern.lastIndex = 0;
        if (pattern.test(source)) {
          violations.push(`${file}: ${label}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("ships a dedicated stdio entrypoint source file under packages/mcp-server/src", async () => {
    const files = await listMcpSourceFiles();
    const stdioSource = files.find((file) => file.endsWith("stdio.ts"));
    expect(stdioSource).toBeDefined();
  });
});

describe("mcp-server resource URI safety", () => {
  it("rejects adversarial URIs outside the frozen v1 set", () => {
    const server = createAutomiumMcpServer();
    const adversarialUris = [
      "automium://unknown",
      "automium://apps/../etc/passwd",
      "file:///etc/passwd",
      "http://example.com/automium",
      "automium://contracts/../apps",
      "AUTOMIUM://APPS",
      "javascript:alert(1)",
      ""
    ];

    for (const uri of adversarialUris) {
      let thrown: unknown;
      try {
        readAutomiumMcpResource(server, uri);
      } catch (error) {
        thrown = error;
      }
      expect(thrown, `expected ${uri} to be rejected`).toBeInstanceOf(AutomiumMcpError);
      expect((thrown as AutomiumMcpError).code).toBe("unsupported_resource_uri");
    }
  });
});

describe("mcp-server modeled-output metadata markers", () => {
  const SIX_MARKERS = {
    modeled: true,
    liveBrowserExecuted: false,
    providerCallsMade: false,
    filesystemMutated: false,
    queued: false,
    artifactsFetched: false
  } as const;

  const modeledDescriptors = automiumMcpToolDescriptors.filter(
    (descriptor) => descriptor.modeled === true
  );

  it("covers every modeled tool descriptor with a valid invocation fixture", () => {
    const invocationNames = new Set(modeledToolInvocations.map((entry) => entry.name));
    for (const descriptor of modeledDescriptors) {
      expect(
        invocationNames.has(descriptor.name),
        `missing invocation fixture for modeled tool ${descriptor.name}`
      ).toBe(true);
    }
  });

  it("returns the full six-marker modeled metadata set on every modeled tool response", () => {
    const server = createAutomiumMcpServer();
    for (const { name, args } of modeledToolInvocations) {
      const descriptor = modeledDescriptors.find((entry) => entry.name === name);
      expect(descriptor, `${name} must be registered as a modeled tool`).toBeDefined();

      const result = callAutomiumMcpTool(server, name, args) as Record<string, unknown>;
      expect(result, `${name} must return an object`).toBeTypeOf("object");
      for (const [marker, expected] of Object.entries(SIX_MARKERS)) {
        expect(result[marker], `${name} missing marker ${marker}`).toBe(expected);
      }
    }
  });
});
