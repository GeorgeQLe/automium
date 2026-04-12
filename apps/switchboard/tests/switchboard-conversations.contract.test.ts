import { describe, expect, it } from "vitest";

async function loadSwitchboardConversations() {
  try {
    return await import("../src/switchboard-conversations");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-conversations.ts to define conversation lifecycle helpers for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardMessages() {
  try {
    return await import("../src/switchboard-messages");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-messages.ts to define threaded message helpers for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardAssignments() {
  try {
    return await import("../src/switchboard-assignments");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-assignments.ts to define assignment helpers for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardNotes() {
  try {
    return await import("../src/switchboard-notes");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-notes.ts to define private note helpers for Phase 5.",
      { cause: error }
    );
  }
}

async function loadSwitchboardRealtime() {
  try {
    return await import("../src/switchboard-realtime");
  } catch (error) {
    throw new Error(
      "Expected apps/switchboard/src/switchboard-realtime.ts to define realtime conversation events for Phase 5.",
      { cause: error }
    );
  }
}

describe("switchboard conversations contract", () => {
  it("conversation lifecycle supports open, snoozed, resolved, and reopened states", async () => {
    const mod = await loadSwitchboardConversations();

    expect(mod.SWITCHBOARD_CONVERSATION_STATUSES).toEqual([
      "open",
      "pending",
      "snoozed",
      "resolved",
    ]);

    const conversation = mod.createConversation({
      accountId: "acct_1",
      inboxId: "inbox_1",
      contactId: "contact_1",
      subject: "Need help with checkout",
    });

    expect(conversation.status).toBe("open");
    expect(mod.transitionConversationStatus(conversation, "snoozed").status).toBe(
      "snoozed"
    );
    expect(mod.transitionConversationStatus(conversation, "resolved").status).toBe(
      "resolved"
    );
    expect(mod.reopenConversation(conversation).status).toBe("open");
    expect(() => mod.transitionConversationStatus(conversation, "archived")).toThrow();
  });

  it("threaded messages preserve parent links, authorship, and direction", async () => {
    const mod = await loadSwitchboardMessages();
    const inbound = mod.createMessage({
      conversationId: "conv_1",
      authorId: "contact_1",
      direction: "inbound",
      type: "text",
      body: "Can someone help?",
    });
    const reply = mod.createMessage({
      conversationId: "conv_1",
      authorId: "user_1",
      direction: "outbound",
      type: "text",
      body: "I can help.",
      parentMessageId: inbound.messageId,
    });

    expect(inbound.messageId).toBeTruthy();
    expect(inbound.direction).toBe("inbound");
    expect(reply.parentMessageId).toBe(inbound.messageId);
    expect(reply.direction).toBe("outbound");
    expect(reply.createdAt).toBeTruthy();
  });

  it("assignments support user and team reassignment with audit metadata", async () => {
    const mod = await loadSwitchboardAssignments();
    const assignment = mod.assignConversation({
      conversationId: "conv_1",
      assigneeId: "user_1",
      teamId: "team_1",
      assignedBy: "supervisor_1",
    });
    const transferred = mod.reassignConversation(assignment, {
      assigneeId: "user_2",
      teamId: "team_2",
      assignedBy: "supervisor_1",
    });

    expect(assignment.assignmentId).toBeTruthy();
    expect(assignment.status).toBe("assigned");
    expect(assignment.assignedBy).toBe("supervisor_1");
    expect(transferred.assigneeId).toBe("user_2");
    expect(transferred.teamId).toBe("team_2");
    expect(transferred.status).toBe("transferred");
    expect(transferred.assignedAt).toBeTruthy();
  });

  it("private notes preserve mentions and conversation scope", async () => {
    const mod = await loadSwitchboardNotes();
    const note = mod.createPrivateNote({
      conversationId: "conv_1",
      authorId: "user_1",
      body: "Please review this refund request, @lead.",
      mentionIds: ["lead_1"],
    });

    expect(note.noteId).toBeTruthy();
    expect(note.conversationId).toBe("conv_1");
    expect(note.authorId).toBe("user_1");
    expect(note.mentionIds).toEqual(["lead_1"]);
    expect(note.createdAt).toBeTruthy();
  });

  it("realtime events cover conversation, assignment, note, and inbox routing updates", async () => {
    const mod = await loadSwitchboardRealtime();

    expect(mod.SWITCHBOARD_REALTIME_TOPICS).toEqual([
      "conversation.updated",
      "message.created",
      "assignment.changed",
      "note.created",
      "inbox.routed",
    ]);

    const event = mod.createSwitchboardRealtimeEvent({
      accountId: "acct_1",
      inboxId: "inbox_1",
      topic: "assignment.changed",
      payload: { conversationId: "conv_1", assigneeId: "user_2" },
    });

    expect(event.eventId).toBeTruthy();
    expect(event.accountId).toBe("acct_1");
    expect(event.inboxId).toBe("inbox_1");
    expect(event.topic).toBe("assignment.changed");
    expect(event.payload.conversationId).toBe("conv_1");
    expect(event.occurredAt).toBeTruthy();
  });
});
