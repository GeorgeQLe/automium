import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerAutomiumMcpPrompts } from "./prompts";
import { registerAutomiumMcpResources } from "./resources";
import { createAutomiumMcpServer, type AutomiumMcpServer } from "./server";
import { registerAutomiumMcpTools } from "./tools";

export interface AutomiumMcpStdioHandle {
  readonly server: AutomiumMcpServer;
  readonly transport: StdioServerTransport;
  readonly close: () => Promise<void>;
}

export async function startAutomiumMcpStdioServer(): Promise<AutomiumMcpStdioHandle> {
  const server = createAutomiumMcpServer();

  registerAutomiumMcpTools(server);
  registerAutomiumMcpResources(server);
  registerAutomiumMcpPrompts(server);

  const transport = new StdioServerTransport();
  await server.sdkServer.connect(transport);

  return {
    server,
    transport,
    close: () => server.sdkServer.close()
  };
}
