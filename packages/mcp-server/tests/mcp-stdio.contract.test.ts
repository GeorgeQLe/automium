import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  AUTOMIUM_MCP_PROMPT_NAMES,
  AUTOMIUM_MCP_RESOURCE_URIS,
  AUTOMIUM_MCP_TOOL_NAMES
} from "../src/schemas";

interface AutomiumStdioHandle {
  readonly server: { readonly capabilities: unknown };
  readonly transport: unknown;
  readonly close: () => Promise<void> | void;
}

type StartAutomiumMcpStdioServer = () => Promise<AutomiumStdioHandle>;

async function loadStdioStarter(): Promise<StartAutomiumMcpStdioServer> {
  const stdioSpecifier = "../src/stdio";
  const indexSpecifier = "../src/index";
  let mod: Record<string, unknown>;
  try {
    mod = (await import(/* @vite-ignore */ stdioSpecifier)) as Record<string, unknown>;
  } catch (error) {
    try {
      mod = (await import(/* @vite-ignore */ indexSpecifier)) as Record<string, unknown>;
    } catch (indexError) {
      throw new Error(
        "Expected packages/mcp-server/src/stdio.ts (or src/index.ts re-export) to expose startAutomiumMcpStdioServer() for Phase 4 stdio wiring.",
        { cause: indexError ?? error }
      );
    }
  }

  const starter = mod.startAutomiumMcpStdioServer;
  if (typeof starter !== "function") {
    throw new Error(
      "Expected packages/mcp-server/src/stdio.ts to export startAutomiumMcpStdioServer() returning { server, transport, close } for Phase 4 stdio wiring."
    );
  }
  return starter as StartAutomiumMcpStdioServer;
}

interface CapabilityManifest {
  readonly apiVersion: string;
  readonly serverName: string;
  readonly transports: readonly string[];
  readonly tools: ReadonlyArray<{ name: string }>;
  readonly resources: ReadonlyArray<{ uri: string }>;
  readonly prompts: ReadonlyArray<{ name: string }>;
}

function assertCapabilityManifest(value: unknown): asserts value is CapabilityManifest {
  expect(value).toMatchObject({
    apiVersion: "v1",
    serverName: "automium",
    transports: ["stdio"],
    tools: expect.any(Array),
    resources: expect.any(Array),
    prompts: expect.any(Array)
  });
}

describe("Automium MCP stdio entrypoint", () => {
  it("exports a startAutomiumMcpStdioServer helper returning { server, transport, close }", async () => {
    const start = await loadStdioStarter();
    const handle = await start();
    try {
      expect(handle).toBeDefined();
      expect(handle.server).toBeDefined();
      expect(handle.server.capabilities).toBeDefined();
      expect(handle.transport).toBeDefined();
      expect(typeof handle.close).toBe("function");
    } finally {
      await handle.close();
    }
  });

  it("registers every v1 tool, resource, and prompt through the stdio path", async () => {
    const start = await loadStdioStarter();
    const handle = await start();
    try {
      assertCapabilityManifest(handle.server.capabilities);
      expect(handle.server.capabilities.tools.map((tool) => tool.name)).toEqual([
        ...AUTOMIUM_MCP_TOOL_NAMES
      ]);
      expect(handle.server.capabilities.resources.map((resource) => resource.uri)).toEqual([
        ...AUTOMIUM_MCP_RESOURCE_URIS
      ]);
      expect(handle.server.capabilities.prompts.map((prompt) => prompt.name)).toEqual([
        ...AUTOMIUM_MCP_PROMPT_NAMES
      ]);
      expect(handle.server.capabilities.transports).toEqual(["stdio"]);
    } finally {
      await handle.close();
    }
  });

  it("exposes a bin entry pointing at the stdio entrypoint in package.json", async () => {
    const packageJsonUrl = new URL("../package.json", import.meta.url);
    const raw = await readFile(fileURLToPath(packageJsonUrl), "utf8");
    const parsed = JSON.parse(raw) as {
      bin?: Record<string, string> | string;
    };

    expect(parsed.bin).toBeDefined();
    const binMap =
      typeof parsed.bin === "string"
        ? { "automium-mcp-server": parsed.bin }
        : (parsed.bin ?? {});

    expect(Object.keys(binMap)).toContain("automium-mcp-server");
    const target = binMap["automium-mcp-server"];
    expect(target).toMatch(/stdio/);
  });

  it("closes cleanly without leaving the event loop hanging", async () => {
    const start = await loadStdioStarter();
    const handle = await start();

    const closed = Promise.resolve(handle.close());
    const settled = await Promise.race([
      closed.then(() => "closed" as const),
      new Promise<"timeout">((resolve) => {
        const timer = setTimeout(() => resolve("timeout"), 1_000);
        if (typeof timer === "object" && timer !== null && "unref" in timer) {
          (timer as { unref: () => void }).unref();
        }
      })
    ]);

    expect(settled).toBe("closed");
  });
});
