import type {
  SwitchboardChannelType,
} from "./switchboard-constants";
import type {
  SwitchboardContact,
  SwitchboardConversation,
  SwitchboardMessage,
} from "./switchboard-domain";
import {
  createSwitchboardContact,
  createSwitchboardConversation,
  createSwitchboardMessage,
} from "./switchboard-domain";

export const SWITCHBOARD_PUBLIC_CHANNEL_ADAPTER_TYPES = [
  "whatsapp",
  "facebook",
  "instagram",
  "telegram",
  "line",
  "sms",
  "tiktok",
  "x-twitter",
  "voice",
] as const;

export type SwitchboardPublicChannelAdapterType =
  (typeof SWITCHBOARD_PUBLIC_CHANNEL_ADAPTER_TYPES)[number];

export type SwitchboardInboundChannelEventInput = {
  accountId: string;
  inboxId: string;
  externalContactId: string;
  displayName: string;
  text: string;
  occurredAt?: string;
  email?: string;
  phone?: string;
  subject?: string;
  externalMessageId?: string;
};

export type NormalizedSwitchboardInboundChannelEvent = {
  channelType: SwitchboardPublicChannelAdapterType;
  contact: SwitchboardContact;
  conversation: SwitchboardConversation;
  message: SwitchboardMessage;
};

export interface SwitchboardChannelAdapter {
  readonly channelType: SwitchboardPublicChannelAdapterType;
  normalizeInboundEvent(
    input: SwitchboardInboundChannelEventInput
  ): NormalizedSwitchboardInboundChannelEvent;
}

export interface SwitchboardChannelAdapterRegistry {
  readonly supportedTypes: readonly SwitchboardPublicChannelAdapterType[];
  getAdapter(
    type: SwitchboardPublicChannelAdapterType
  ): SwitchboardChannelAdapter;
}

export function createSwitchboardChannelAdapterRegistry(): SwitchboardChannelAdapterRegistry {
  const adapters = new Map<SwitchboardPublicChannelAdapterType, SwitchboardChannelAdapter>(
    SWITCHBOARD_PUBLIC_CHANNEL_ADAPTER_TYPES.map((type) => [
      type,
      createAdapter(type),
    ])
  );

  return {
    supportedTypes: SWITCHBOARD_PUBLIC_CHANNEL_ADAPTER_TYPES,
    getAdapter(type: SwitchboardPublicChannelAdapterType): SwitchboardChannelAdapter {
      const adapter = adapters.get(type);
      if (!adapter) {
        throw new Error(`Unsupported Switchboard public channel adapter: ${type}`);
      }

      return adapter;
    },
  };
}

function createAdapter(
  channelType: SwitchboardPublicChannelAdapterType
): SwitchboardChannelAdapter {
  return {
    channelType,
    normalizeInboundEvent(
      input: SwitchboardInboundChannelEventInput
    ): NormalizedSwitchboardInboundChannelEvent {
      const contact = createSwitchboardContact({
        contactId: `contact_${channelType}_${stableSegment(input.externalContactId)}`,
        accountId: input.accountId,
        name: input.displayName,
        email: input.email,
        phone: input.phone,
        externalId: input.externalContactId,
        createdAt: input.occurredAt,
      });
      const conversation = createSwitchboardConversation({
        conversationId: `conv_${channelType}_${stableSegment(
          input.inboxId
        )}_${stableSegment(input.externalContactId)}`,
        accountId: input.accountId,
        inboxId: input.inboxId,
        contactId: contact.contactId,
        status: "open",
        priority: "normal",
        subject: input.subject ?? `${input.displayName} via ${channelType}`,
        createdAt: input.occurredAt,
        updatedAt: input.occurredAt,
      });
      const message = createSwitchboardMessage({
        messageId: `msg_${channelType}_${stableSegment(
          input.externalMessageId ?? `${input.externalContactId}_${input.text}`
        )}`,
        conversationId: conversation.conversationId,
        authorId: contact.contactId,
        direction: "inbound",
        type: "text",
        body: input.text,
        createdAt: input.occurredAt,
      });

      return {
        channelType,
        contact,
        conversation,
        message,
      };
    },
  };
}

function stableSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

type PublicChannelTypeIsSupported = SwitchboardPublicChannelAdapterType extends SwitchboardChannelType
  ? true
  : false;

export const SWITCHBOARD_PUBLIC_CHANNEL_TYPES_ARE_SUPPORTED: PublicChannelTypeIsSupported =
  true;
