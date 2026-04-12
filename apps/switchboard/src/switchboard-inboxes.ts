import type { SwitchboardInbox } from "./switchboard-domain";
import { createSwitchboardInbox } from "./switchboard-domain";

export function createInbox(
  params: Parameters<typeof createSwitchboardInbox>[0]
): SwitchboardInbox {
  return createSwitchboardInbox(params);
}

export function routeInboxToTeam(
  inbox: SwitchboardInbox,
  teamId: string
): SwitchboardInbox {
  return {
    ...inbox,
    teamId,
  };
}
