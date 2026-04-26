import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { organizations, workspaces } from "./tenancy";

export const credentials = pgTable(
  "credentials",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    scope: text("scope").notNull(),
    purpose: text("purpose").notNull(),
    encryptedValue: text("encrypted_value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("credentials_org_ws_scope_purpose_idx").on(
      t.organizationId,
      t.workspaceId,
      t.scope,
      t.purpose,
    ),
  ],
);
