import { describe, expect, it } from "vitest";

async function loadMcpServer() {
  try {
    return await import("../src/index");
  } catch (error) {
    throw new Error(
      "Expected packages/mcp-server/src/index.ts to expose the Automium MCP server registration surface for the MCP transport phase.",
      { cause: error }
    );
  }
}

describe("Automium MCP server registration", () => {
  it("exports the v1 server factory and inspectable capability manifest", async () => {
    const mod = await loadMcpServer();

    expect(mod.AUTOMIUM_MCP_API_VERSION).toBe("v1");
    expect(mod.createAutomiumMcpServer).toEqual(expect.any(Function));
    expect(mod.getAutomiumMcpCapabilities).toEqual(expect.any(Function));

    expect(mod.getAutomiumMcpCapabilities()).toMatchObject({
      apiVersion: "v1",
      serverName: "automium",
      transports: ["stdio"],
      tools: expect.any(Array),
      resources: expect.any(Array),
      prompts: expect.any(Array)
    });
  });

  it("declares every v1 tool, resource, and prompt from the MCP spec", async () => {
    const mod = await loadMcpServer();
    const capabilities = mod.getAutomiumMcpCapabilities();

    expect(capabilities.tools.map((tool: { name: string }) => tool.name)).toEqual([
      "automium_list_apps",
      "automium_list_fixtures",
      "automium_compile_journey",
      "automium_create_run_submission",
      "automium_get_replay_summary",
      "automium_get_artifact_manifest",
      "automium_compare_planners"
    ]);

    expect(
      capabilities.resources.map((resource: { uri: string }) => resource.uri)
    ).toEqual([
      "automium://apps",
      "automium://fixtures",
      "automium://contracts/planner-adapter-v1",
      "automium://contracts/replay-event-v1",
      "automium://contracts/semantic-snapshot-v1"
    ]);

    expect(capabilities.prompts.map((prompt: { name: string }) => prompt.name)).toEqual([
      "draft_journey",
      "debug_failed_run",
      "compare_planner_backends"
    ]);
  });

  it("keeps remote transports out of the v1 registration surface", async () => {
    const mod = await loadMcpServer();
    const capabilities = mod.getAutomiumMcpCapabilities();

    expect(capabilities.transports).toEqual(["stdio"]);
    expect(capabilities.transports).not.toContain("sse");
    expect(capabilities.transports).not.toContain("streamable-http");
    expect(JSON.stringify(capabilities).toLowerCase()).not.toContain("http");
  });

  it("creates a server object without starting stdio", async () => {
    const mod = await loadMcpServer();
    const server = mod.createAutomiumMcpServer();

    expect(server).toMatchObject({
      capabilities: mod.getAutomiumMcpCapabilities()
    });
    expect(server.sdkServer).toBeDefined();
    expect(server.startedTransports).toEqual([]);
  });
});
