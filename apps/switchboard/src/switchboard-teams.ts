import type { SwitchboardTeam } from "./switchboard-domain";
import { createSwitchboardTeam } from "./switchboard-domain";

export function createTeam(
  params: Parameters<typeof createSwitchboardTeam>[0]
): SwitchboardTeam {
  return createSwitchboardTeam(params);
}

export function addTeamMember(team: SwitchboardTeam, userId: string): SwitchboardTeam {
  if (team.memberIds.includes(userId)) {
    return team;
  }

  return {
    ...team,
    memberIds: [...team.memberIds, userId],
  };
}
