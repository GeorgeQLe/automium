import type { SwitchboardContact } from "./switchboard-domain";
import { createSwitchboardContact } from "./switchboard-domain";

export function createContact(
  params: Parameters<typeof createSwitchboardContact>[0]
): SwitchboardContact {
  return createSwitchboardContact(params);
}

export function mergeContactProfile(
  contact: SwitchboardContact,
  updates: Partial<Pick<SwitchboardContact, "name" | "email" | "phone" | "externalId">>
): SwitchboardContact {
  return {
    ...contact,
    ...updates,
  };
}
