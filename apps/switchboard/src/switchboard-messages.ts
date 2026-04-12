import type { SwitchboardMessage } from "./switchboard-domain";
import { createSwitchboardMessage } from "./switchboard-domain";

export function createMessage(
  params: Parameters<typeof createSwitchboardMessage>[0]
): SwitchboardMessage {
  return createSwitchboardMessage(params);
}

export function createThreadedReply(params: {
  conversationId: string;
  authorId: string;
  body: string;
  parentMessageId: string;
}): SwitchboardMessage {
  return createSwitchboardMessage({
    ...params,
    direction: "outbound",
    type: "text",
  });
}
