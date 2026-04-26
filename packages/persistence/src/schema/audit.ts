import { index, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizations, workspaces } from "./tenancy";

export const auditedActionEnum = pgEnum("audited_action", [
  "invite.sent",
  "invite.accepted",
  "membership.role-changed",
  "file.ownership-transferred",
  "job.scheduled",
  "search.indexed",
  "realtime.event-delivered",
]);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    actorId: text("actor_id").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    action: auditedActionEnum("action").notNull(),
    summary: text("summary").notNull(),
    metadata: jsonb("metadata"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("audit_events_org_workspace_idx").on(t.organizationId, t.workspaceId),
  ],
);
