import { describe, expect, it } from "vitest";

async function loadAltitudeProjects() {
  try {
    return await import("../src/altitude-projects");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-projects.ts to define project factories for Phase 4.",
      { cause: error }
    );
  }
}

async function loadAltitudeWorkItems() {
  try {
    return await import("../src/altitude-work-items");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-work-items.ts to define work item factories for Phase 4.",
      { cause: error }
    );
  }
}

async function loadAltitudeComments() {
  try {
    return await import("../src/altitude-comments");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-comments.ts to define comment factories for Phase 4.",
      { cause: error }
    );
  }
}

async function loadAltitudeAttachments() {
  try {
    return await import("../src/altitude-attachments");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-attachments.ts to define attachment factories for Phase 4.",
      { cause: error }
    );
  }
}

async function loadAltitudeNotifications() {
  try {
    return await import("../src/altitude-notifications");
  } catch (error) {
    throw new Error(
      "Expected apps/altitude/src/altitude-notifications.ts to define notification factories for Phase 4.",
      { cause: error }
    );
  }
}

describe("altitude domain contract", () => {
  it("createProject() produces project with tenancy fields", async () => {
    const mod = await loadAltitudeProjects();
    const project = mod.createProject({
      name: "Sprint Tracker",
      organizationId: "org_1",
      workspaceId: "ws_1",
    });

    expect(project.projectId).toBeTruthy();
    expect(project.name).toBe("Sprint Tracker");
    expect(project.organizationId).toBe("org_1");
    expect(project.workspaceId).toBe("ws_1");
    expect(project.createdAt).toBeTruthy();
  });

  it("createWorkItem() produces work item with type, state, and priority", async () => {
    const mod = await loadAltitudeWorkItems();
    const item = mod.createWorkItem({
      projectId: "proj_1",
      title: "Fix login bug",
      type: "issue",
      state: "backlog",
      priority: "high",
    });

    expect(item.workItemId).toBeTruthy();
    expect(item.projectId).toBe("proj_1");
    expect(item.title).toBe("Fix login bug");
    expect(item.type).toBe("issue");
    expect(item.state).toBe("backlog");
    expect(item.priority).toBe("high");
    expect(item.createdAt).toBeTruthy();
  });

  it("transitionWorkItemState() allows valid paths", async () => {
    const mod = await loadAltitudeWorkItems();

    const s1 = mod.transitionWorkItemState("backlog", "in-progress");
    expect(s1).toBe("in-progress");

    const s2 = mod.transitionWorkItemState("in-progress", "done");
    expect(s2).toBe("done");
  });

  it("transitionWorkItemState() rejects invalid paths", async () => {
    const mod = await loadAltitudeWorkItems();

    expect(() => mod.transitionWorkItemState("done", "backlog")).toThrow();
  });

  it("createComment() produces comment linked to work item", async () => {
    const mod = await loadAltitudeComments();
    const comment = mod.createComment({
      workItemId: "wi_1",
      authorId: "user_1",
      body: "Looks good to me",
    });

    expect(comment.commentId).toBeTruthy();
    expect(comment.workItemId).toBe("wi_1");
    expect(comment.authorId).toBe("user_1");
    expect(comment.body).toBe("Looks good to me");
    expect(comment.createdAt).toBeTruthy();
  });

  it("createAttachment() produces attachment with file metadata", async () => {
    const mod = await loadAltitudeAttachments();
    const attachment = mod.createAttachment({
      workItemId: "wi_1",
      fileName: "screenshot.png",
      fileSize: 204800,
      mimeType: "image/png",
      uploadedBy: "user_1",
    });

    expect(attachment.attachmentId).toBeTruthy();
    expect(attachment.workItemId).toBe("wi_1");
    expect(attachment.fileName).toBe("screenshot.png");
    expect(attachment.fileSize).toBe(204800);
    expect(attachment.mimeType).toBe("image/png");
    expect(attachment.uploadedBy).toBe("user_1");
    expect(attachment.createdAt).toBeTruthy();
  });

  it("createNotification() produces notification with recipient and type", async () => {
    const mod = await loadAltitudeNotifications();
    const notification = mod.createNotification({
      recipientId: "user_1",
      type: "assignment",
      workItemId: "wi_1",
      message: "You were assigned to Fix login bug",
    });

    expect(notification.notificationId).toBeTruthy();
    expect(notification.recipientId).toBe("user_1");
    expect(notification.type).toBe("assignment");
    expect(notification.workItemId).toBe("wi_1");
    expect(notification.message).toBe("You were assigned to Fix login bug");
    expect(notification.createdAt).toBeTruthy();
  });

  it("validateProject() and validateWorkItem() catch missing required fields", async () => {
    const projMod = await loadAltitudeProjects();
    const wiMod = await loadAltitudeWorkItems();

    const projErrors = projMod.validateProject({
      projectId: "",
      name: "",
      organizationId: "",
      workspaceId: "ws_1",
      createdAt: "",
    });
    expect(projErrors).toContain("projectId is required");
    expect(projErrors).toContain("name is required");
    expect(projErrors).toContain("organizationId is required");

    const wiErrors = wiMod.validateWorkItem({
      workItemId: "",
      projectId: "",
      title: "",
      type: "issue",
      state: "backlog",
      priority: "high",
      createdAt: "",
    });
    expect(wiErrors).toContain("workItemId is required");
    expect(wiErrors).toContain("projectId is required");
    expect(wiErrors).toContain("title is required");
  });
});
