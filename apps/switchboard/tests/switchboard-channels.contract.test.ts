import { describe, expect, it } from "vitest";

async function loadSwitchboardChannels() {
  try {
    return await import("../src/switchboard-channels");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-channels.ts to define native channel support for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardChannelAdapters() {
  try {
    return await import("../src/switchboard-channel-adapters");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-channel-adapters.ts to define public channel adapter boundaries for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardWebhooks() {
  try {
    return await import("../src/switchboard-webhooks");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-webhooks.ts to define webhook normalization for Phase 5.",
      { cause: error }
    );
  }
}

describe("switchboard channels contract", () => {
  it("native channel factories cover website live chat, API, and email", async () => {
    const mod = await loadSwitchboardChannels();

    const website = mod.createWebsiteLiveChatChannel({
      accountId: "acct_1",
      inboxId: "inbox_1",
      widgetId: "widget_1",
      allowedOrigins: ["https://example.com"],
    });
    const api = mod.createApiChannel({
      accountId: "acct_1",
      inboxId: "inbox_api",
      tokenName: "Synthetic ingest",
    });
    const email = mod.createEmailChannel({
      accountId: "acct_1",
      inboxId: "inbox_email",
      address: "support@example.com",
      threadingMode: "references-header",
    });

    expect(website.type).toBe("website");
    expect(website.widgetId).toBe("widget_1");
    expect(website.allowedOrigins).toEqual(["https://example.com"]);
    expect(api.type).toBe("api");
    expect(api.tokenRef).toBeTruthy();
    expect(email.type).toBe("email");
    expect(email.address).toBe("support@example.com");
    expect(email.threadingMode).toBe("references-header");
  });

  it("API channel ingest normalizes payloads into contacts, conversations, and messages", async () => {
    const mod = await loadSwitchboardChannels();
    const normalized = mod.normalizeApiChannelIngest({
      accountId: "acct_1",
      inboxId: "inbox_api",
      externalContactId: "customer_1",
      contact: { name: "Alex Customer", email: "alex@example.com" },
      message: { body: "Need help", idempotencyKey: "msg_1" },
    });

    expect(normalized.contact.externalId).toBe("customer_1");
    expect(normalized.conversation.inboxId).toBe("inbox_api");
    expect(normalized.message.direction).toBe("inbound");
    expect(normalized.message.body).toBe("Need help");
    expect(normalized.idempotencyKey).toBe("msg_1");
  });

  it("email threading preserves message references and reply metadata", async () => {
    const mod = await loadSwitchboardChannels();
    const normalized = mod.normalizeEmailThread({
      accountId: "acct_1",
      inboxId: "inbox_email",
      from: "alex@example.com",
      subject: "Re: Billing issue",
      body: "Following up",
      messageId: "<msg-2@example.com>",
      references: ["<msg-1@example.com>"],
    });

    expect(normalized.contact.email).toBe("alex@example.com");
    expect(normalized.conversation.subject).toBe("Re: Billing issue");
    expect(normalized.message.metadata.messageId).toBe("<msg-2@example.com>");
    expect(normalized.message.metadata.references).toEqual(["<msg-1@example.com>"]);
  });

  it("adapter registry exposes all deferred public channel boundaries", async () => {
    const mod = await loadSwitchboardChannelAdapters();
    const registry = mod.createSwitchboardChannelAdapterRegistry();

    expect(registry.supportedTypes).toEqual([
      "whatsapp",
      "facebook",
      "instagram",
      "telegram",
      "line",
      "sms",
      "tiktok",
      "x-twitter",
      "voice",
    ]);

    for (const type of registry.supportedTypes) {
      expect(registry.getAdapter(type)).toBeTruthy();
    }
  });

  it("public channel adapters normalize inbound events into the core conversation contract", async () => {
    const mod = await loadSwitchboardChannelAdapters();
    const registry = mod.createSwitchboardChannelAdapterRegistry();
    const whatsapp = registry.getAdapter("whatsapp");
    const event = whatsapp.normalizeInboundEvent({
      accountId: "acct_1",
      inboxId: "inbox_whatsapp",
      externalContactId: "wa_123",
      displayName: "Alex",
      text: "Hello from WhatsApp",
      occurredAt: "2026-04-11T12:00:00.000Z",
    });

    expect(event.channelType).toBe("whatsapp");
    expect(event.contact.externalId).toBe("wa_123");
    expect(event.conversation.inboxId).toBe("inbox_whatsapp");
    expect(event.message.body).toBe("Hello from WhatsApp");
    expect(event.message.direction).toBe("inbound");
  });

  it("webhook normalization returns stable event payloads", async () => {
    const mod = await loadSwitchboardWebhooks();
    const webhook = mod.createSwitchboardWebhookEvent({
      accountId: "acct_1",
      event: "message.created",
      payload: { conversationId: "conv_1", messageId: "msg_1" },
    });

    expect(webhook.webhookEventId).toBeTruthy();
    expect(webhook.accountId).toBe("acct_1");
    expect(webhook.event).toBe("message.created");
    expect(webhook.payload.conversationId).toBe("conv_1");
    expect(webhook.createdAt).toBeTruthy();
  });
});
