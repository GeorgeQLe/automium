import type { SwitchboardCannedResponse } from "./switchboard-domain";
import { createSwitchboardCannedResponse } from "./switchboard-domain";

export function createCannedResponse(
  params: Parameters<typeof createSwitchboardCannedResponse>[0]
): SwitchboardCannedResponse {
  return createSwitchboardCannedResponse(params);
}

export function renderCannedResponse(
  response: SwitchboardCannedResponse,
  context: Record<string, unknown>
): string {
  return response.body.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, path: string) => {
    const value = getPath(context, path);
    return value == null ? "" : String(value);
  });
}

function getPath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}
