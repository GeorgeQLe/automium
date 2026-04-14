export type AutomiumMcpErrorCode =
  | "invalid_app_id"
  | "fixture_app_mismatch"
  | "unsupported_planner_intent"
  | "invalid_artifact_kind"
  | "unsupported_corpus_version"
  | "malformed_planner_metadata"
  | "unsupported_resource_uri"
  | "unsupported_v1_operation";

export class AutomiumMcpError extends Error {
  readonly code: AutomiumMcpErrorCode;

  constructor(code: AutomiumMcpErrorCode, message: string) {
    super(message);
    this.name = "AutomiumMcpError";
    this.code = code;
  }
}

export function toMcpSafeError(error: unknown): AutomiumMcpError {
  if (error instanceof AutomiumMcpError) {
    return error;
  }

  if (error instanceof Error) {
    return new AutomiumMcpError("unsupported_v1_operation", error.message);
  }

  return new AutomiumMcpError(
    "unsupported_v1_operation",
    "Unsupported Automium MCP v1 operation."
  );
}
