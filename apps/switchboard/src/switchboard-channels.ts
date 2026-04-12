import type {
  SwitchboardChannelConfig,
  SwitchboardContact,
  SwitchboardConversation,
  SwitchboardMessage,
} from "./switchboard-domain";
import {
  createSwitchboardChannelConfig,
  createSwitchboardContact,
  createSwitchboardConversation,
  createSwitchboardMessage,
} from "./switchboard-domain";

type NativeChannelInput = {
  accountId: string;
  inboxId: string;
};

export type WebsiteLiveChatChannel = SwitchboardChannelConfig & {
  type: "website";
  inboxId: string;
  widgetId: string;
  allowedOrigins: string[];
};

export type ApiChannel = SwitchboardChannelConfig & {
  type: "api";
  inboxId: string;
  tokenName: string;
  tokenRef: string;
};

export type EmailChannel = SwitchboardChannelConfig & {
  type: "email";
  inboxId: string;
  address: string;
  threadingMode: "references-header" | "subject-prefix";
};

export type NormalizedApiChannelIngest = {
  contact: SwitchboardContact;
  conversation: SwitchboardConversation;
  message: SwitchboardMessage;
  idempotencyKey: string;
};

export type EmailThreadMessage = SwitchboardMessage & {
  metadata: {
    messageId: string;
    references: string[];
  };
};

export type NormalizedEmailThread = {
  contact: SwitchboardContact;
  conversation: SwitchboardConversation;
  message: EmailThreadMessage;
};

export function createWebsiteLiveChatChannel(
  input: NativeChannelInput & {
    widgetId: string;
    allowedOrigins: string[];
  }
): WebsiteLiveChatChannel {
  const settings = {
    inboxId: input.inboxId,
    widgetId: input.widgetId,
    allowedOrigins: input.allowedOrigins,
  };

  return {
    ...createSwitchboardChannelConfig({
      channelId: channelId("website", input.inboxId),
      accountId: input.accountId,
      type: "website",
      name: `Website live chat ${input.inboxId}`,
      settings,
    }),
    type: "website",
    inboxId: input.inboxId,
    widgetId: input.widgetId,
    allowedOrigins: input.allowedOrigins,
  };
}

export function createApiChannel(
  input: NativeChannelInput & {
    tokenName: string;
  }
): ApiChannel {
  const tokenRef = `token_${stableSegment(input.accountId)}_${stableSegment(
    input.inboxId
  )}_${stableSegment(input.tokenName)}`;
  const settings = {
    inboxId: input.inboxId,
    tokenName: input.tokenName,
    tokenRef,
  };

  return {
    ...createSwitchboardChannelConfig({
      channelId: channelId("api", input.inboxId),
      accountId: input.accountId,
      type: "api",
      name: `API channel ${input.inboxId}`,
      settings,
    }),
    type: "api",
    inboxId: input.inboxId,
    tokenName: input.tokenName,
    tokenRef,
  };
}

export function createEmailChannel(
  input: NativeChannelInput & {
    address: string;
    threadingMode: "references-header" | "subject-prefix";
  }
): EmailChannel {
  const settings = {
    inboxId: input.inboxId,
    address: input.address,
    threadingMode: input.threadingMode,
  };

  return {
    ...createSwitchboardChannelConfig({
      channelId: channelId("email", input.inboxId),
      accountId: input.accountId,
      type: "email",
      name: `Email ${input.address}`,
      settings,
    }),
    type: "email",
    inboxId: input.inboxId,
    address: input.address,
    threadingMode: input.threadingMode,
  };
}

export function normalizeApiChannelIngest(input: {
  accountId: string;
  inboxId: string;
  externalContactId: string;
  contact: {
    name: string;
    email?: string;
    phone?: string;
  };
  message: {
    body: string;
    idempotencyKey: string;
    occurredAt?: string;
  };
}): NormalizedApiChannelIngest {
  const occurredAt = input.message.occurredAt;
  const contact = createSwitchboardContact({
    contactId: `contact_api_${stableSegment(input.externalContactId)}`,
    accountId: input.accountId,
    name: input.contact.name,
    email: input.contact.email,
    phone: input.contact.phone,
    externalId: input.externalContactId,
    createdAt: occurredAt,
  });
  const conversation = createSwitchboardConversation({
    conversationId: `conv_api_${stableSegment(input.inboxId)}_${stableSegment(
      input.externalContactId
    )}`,
    accountId: input.accountId,
    inboxId: input.inboxId,
    contactId: contact.contactId,
    status: "open",
    priority: "normal",
    subject: `API conversation for ${input.contact.name}`,
    createdAt: occurredAt,
    updatedAt: occurredAt,
  });
  const message = createSwitchboardMessage({
    messageId: `msg_api_${stableSegment(input.message.idempotencyKey)}`,
    conversationId: conversation.conversationId,
    authorId: contact.contactId,
    direction: "inbound",
    type: "text",
    body: input.message.body,
    createdAt: occurredAt,
  });

  return {
    contact,
    conversation,
    message,
    idempotencyKey: input.message.idempotencyKey,
  };
}

export function normalizeEmailThread(input: {
  accountId: string;
  inboxId: string;
  from: string;
  subject: string;
  body: string;
  messageId: string;
  references: string[];
  occurredAt?: string;
}): NormalizedEmailThread {
  const contact = createSwitchboardContact({
    contactId: `contact_email_${stableSegment(input.from)}`,
    accountId: input.accountId,
    name: input.from,
    email: input.from,
    externalId: input.from,
    createdAt: input.occurredAt,
  });
  const conversation = createSwitchboardConversation({
    conversationId: `conv_email_${stableSegment(input.inboxId)}_${stableSegment(
      input.subject
    )}_${stableSegment(input.from)}`,
    accountId: input.accountId,
    inboxId: input.inboxId,
    contactId: contact.contactId,
    status: "open",
    priority: "normal",
    subject: input.subject,
    createdAt: input.occurredAt,
    updatedAt: input.occurredAt,
  });
  const message: EmailThreadMessage = {
    ...createSwitchboardMessage({
      messageId: `msg_email_${stableSegment(input.messageId)}`,
      conversationId: conversation.conversationId,
      authorId: contact.contactId,
      direction: "inbound",
      type: "text",
      body: input.body,
      createdAt: input.occurredAt,
    }),
    metadata: {
      messageId: input.messageId,
      references: input.references,
    },
  };

  return {
    contact,
    conversation,
    message,
  };
}

function channelId(type: "website" | "api" | "email", inboxId: string): string {
  return `channel_${type}_${stableSegment(inboxId)}`;
}

function stableSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
