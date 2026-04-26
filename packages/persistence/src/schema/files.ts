import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizations, workspaces, memberships } from "./tenancy";

export const files = pgTable(
  "files",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    ownerMembershipId: text("owner_membership_id")
      .notNull()
      .references(() => memberships.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("files_org_workspace_idx").on(t.organizationId, t.workspaceId),
  ],
);
