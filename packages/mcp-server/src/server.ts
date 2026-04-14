import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { automiumMcpPromptDescriptors } from "./prompts";
import { automiumMcpResourceDescriptors } from "./resources";
import {
  AUTOMIUM_MCP_API_VERSION,
  AUTOMIUM_MCP_SERVER_NAME,
  AUTOMIUM_MCP_SERVER_VERSION,
  AUTOMIUM_MCP_TRANSPORTS,
  type AutomiumMcpCapabilities
} from "./schemas";
import { automiumMcpToolDescriptors } from "./tools";

export interface AutomiumMcpServer {
  readonly sdkServer: McpServer;
  readonly capabilities: AutomiumMcpCapabilities;
  readonly startedTransports: readonly string[];
}

export function getAutomiumMcpCapabilities(): AutomiumMcpCapabilities {
  return {
    apiVersion: AUTOMIUM_MCP_API_VERSION,
    serverName: AUTOMIUM_MCP_SERVER_NAME,
    serverVersion: AUTOMIUM_MCP_SERVER_VERSION,
    transports: [...AUTOMIUM_MCP_TRANSPORTS],
    tools: automiumMcpToolDescriptors,
    resources: automiumMcpResourceDescriptors,
    prompts: automiumMcpPromptDescriptors
  };
}

export function createAutomiumMcpServer(): AutomiumMcpServer {
  const sdkServer = new McpServer({
    name: AUTOMIUM_MCP_SERVER_NAME,
    version: AUTOMIUM_MCP_SERVER_VERSION
  });

  return {
    sdkServer,
    capabilities: getAutomiumMcpCapabilities(),
    startedTransports: []
  };
}
