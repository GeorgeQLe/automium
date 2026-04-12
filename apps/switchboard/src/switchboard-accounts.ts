import type { SwitchboardAccount } from "./switchboard-domain";
import {
  createSwitchboardAccount,
  validateSwitchboardAccount,
} from "./switchboard-domain";

export function createAccount(
  params: Parameters<typeof createSwitchboardAccount>[0]
): SwitchboardAccount {
  return createSwitchboardAccount(params);
}

export function validateAccount(account: SwitchboardAccount): string[] {
  return validateSwitchboardAccount(account);
}
