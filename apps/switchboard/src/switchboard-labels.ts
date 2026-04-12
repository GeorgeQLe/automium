import type { SwitchboardLabel } from "./switchboard-domain";
import { createSwitchboardLabel } from "./switchboard-domain";

export function createLabel(
  params: Parameters<typeof createSwitchboardLabel>[0]
): SwitchboardLabel {
  return createSwitchboardLabel(params);
}
