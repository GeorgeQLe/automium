import type {
  SwitchboardConversationStatus,
  SwitchboardPriority,
} from "./switchboard-constants";
import type { SwitchboardConversation } from "./switchboard-domain";
import { createSwitchboardConversation } from "./switchboard-domain";

export { SWITCHBOARD_CONVERSATION_STATUSES } from "./switchboard-constants";
import { SWITCHBOARD_CONVERSATION_STATUSES } from "./switchboard-constants";

export function createConversation(params: {
  accountId: string;
  inboxId: string;
  contactId: string;
  subject: string;
  status?: SwitchboardConversationStatus;
  priority?: SwitchboardPriority;
  conversationId?: string;
  createdAt?: string;
  updatedAt?: string;
}): SwitchboardConversation {
  return createSwitchboardConversation({
    ...params,
    status: params.status ?? "open",
    priority: params.priority ?? "normal",
  });
}

export function transitionConversationStatus(
  conversation: SwitchboardConversation,
  nextStatus: string
): SwitchboardConversation {
  if (!isConversationStatus(nextStatus)) {
    throw new Error(`Unknown Switchboard conversation status: ${nextStatus}`);
  }

  return {
    ...conversation,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };
}

export function reopenConversation(
  conversation: SwitchboardConversation
): SwitchboardConversation {
  return transitionConversationStatus(conversation, "open");
}

function isConversationStatus(value: string): value is SwitchboardConversationStatus {
  return SWITCHBOARD_CONVERSATION_STATUSES.includes(
    value as SwitchboardConversationStatus
  );
}
