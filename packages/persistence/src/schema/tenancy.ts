import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const membershipRoleEnum = pgEnum("membership_role", [
  "workspace-admin",
  "maintainer",
  "contributor",
  "viewer",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "suspended",
]);

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const workspaces = pgTable(
  "workspaces",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("workspaces_organization_id_idx").on(t.organizationId)],
);

export const memberships = pgTable(
  "memberships",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    principalId: text("principal_id").notNull(),
    role: membershipRoleEnum("role").notNull(),
    status: membershipStatusEnum("status").notNull().default("active"),
  },
  (t) => [
    index("memberships_org_workspace_idx").on(t.organizationId, t.workspaceId),
  ],
);
