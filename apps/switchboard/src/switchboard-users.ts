import type { SwitchboardUser } from "./switchboard-domain";
import { createSwitchboardUser } from "./switchboard-domain";

export function createUser(
  params: Parameters<typeof createSwitchboardUser>[0]
): SwitchboardUser {
  return createSwitchboardUser(params);
}

export function isOperator(user: SwitchboardUser): boolean {
  return user.role === "operator" || user.role === "supervisor";
}
