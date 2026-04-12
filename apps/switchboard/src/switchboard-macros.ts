import type { SwitchboardAutomationAction, SwitchboardMacro } from "./switchboard-domain";
import { createSwitchboardMacro } from "./switchboard-domain";

export interface SwitchboardMacroApplication {
  macroId: string;
  conversationId: string;
  actorId: string;
  appliedActions: SwitchboardAutomationAction[];
  appliedAt: string;
}

export function createMacro(
  params: Parameters<typeof createSwitchboardMacro>[0]
): SwitchboardMacro {
  return createSwitchboardMacro(params);
}

export function applyMacro(
  macro: SwitchboardMacro,
  params: { conversationId: string; actorId: string }
): SwitchboardMacroApplication {
  return {
    macroId: macro.macroId,
    conversationId: params.conversationId,
    actorId: params.actorId,
    appliedActions: macro.actions.map((action) => ({ ...action })),
    appliedAt: new Date().toISOString(),
  };
}
