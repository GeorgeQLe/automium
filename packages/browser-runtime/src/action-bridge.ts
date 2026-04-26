import type { ExecutorAction } from "../../executor/src/executor-domain";
import type { BrowserRuntime } from "./types";

export interface ActionBridgeResult {
  success: boolean;
  executorAction: ExecutorAction;
  runtimeResult?: unknown;
  error?: string;
}

export async function bridgeExecutorAction(
  executorAction: ExecutorAction,
  runtime: BrowserRuntime
): Promise<ActionBridgeResult> {
  if ("recoverable" in executorAction) {
    return {
      success: false,
      executorAction,
      error: "unsupported"
    };
  }

  const action = executorAction;

  if (action.type === "navigate") {
    const runtimeResult = await runtime.navigate(action.value ?? "");
    return { success: true, executorAction: action, runtimeResult };
  }

  if (action.type === "assert") {
    const runtimeResult = await runtime.snapshot();
    return { success: true, executorAction: action, runtimeResult };
  }

  if (action.type === "fill") {
    const runtimeResult = await runtime.executeAction({
      type: "fill",
      targetElementId: action.targetElementId ?? "",
      value: action.value
    });
    return { success: true, executorAction: action, runtimeResult };
  }

  if (action.type === "click") {
    const runtimeResult = await runtime.executeAction({
      type: "click",
      targetElementId: action.targetElementId ?? ""
    });
    return { success: true, executorAction: action, runtimeResult };
  }

  const runtimeResult = await runtime.executeAction({
    type: action.type,
    targetElementId: action.targetElementId ?? "",
    value: action.value
  });
  return { success: true, executorAction: action, runtimeResult };
}
