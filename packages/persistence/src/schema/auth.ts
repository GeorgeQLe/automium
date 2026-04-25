import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizations, workspaces } from "./tenancy";

export const identityProviderEnum = pgEnum("identity_provider", [
  "password",
  "magic-link",
  "sso",
]);

export const sessionStateEnum = pgEnum("session_state", [
  "pending",
  "active",
  "revoked",
  "expired",
]);

export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "expired",
  "revoked",
]);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    identityId: text("identity_id").notNull(),
    provider: identityProviderEnum("provider").notNull(),
    state: sessionStateEnum("state").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("sessions_identity_id_idx").on(t.identityId)],
);

export const invites = pgTable(
  "invites",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    email: text("email").notNull(),
    status: inviteStatusEnum("status").notNull().default("pending"),
    invitedBy: text("invited_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [
    index("invites_org_workspace_idx").on(t.organizationId, t.workspaceId),
  ],
);
