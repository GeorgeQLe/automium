import type { SwitchboardNote } from "./switchboard-domain";
import { createSwitchboardNote } from "./switchboard-domain";

export function createPrivateNote(
  params: Parameters<typeof createSwitchboardNote>[0]
): SwitchboardNote {
  return createSwitchboardNote(params);
}
