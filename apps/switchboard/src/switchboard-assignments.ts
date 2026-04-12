import type { SwitchboardAssignment } from "./switchboard-domain";
import { createSwitchboardAssignment } from "./switchboard-domain";

export function assignConversation(params: {
  conversationId: string;
  assigneeId?: string;
  teamId?: string;
  assignedBy?: string;
  assignmentId?: string;
  assignedAt?: string;
}): SwitchboardAssignment {
  return createSwitchboardAssignment({
    ...params,
    status: "assigned",
  });
}

export function reassignConversation(
  assignment: SwitchboardAssignment,
  params: {
    assigneeId?: string;
    teamId?: string;
    assignedBy?: string;
  }
): SwitchboardAssignment {
  return {
    ...assignment,
    assigneeId: params.assigneeId,
    teamId: params.teamId,
    assignedBy: params.assignedBy,
    status: "transferred",
    assignedAt: new Date().toISOString(),
  };
}
