import { index, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizations, workspaces } from "./tenancy";

export const jobStateEnum = pgEnum("job_state", [
  "queued",
  "running",
  "completed",
  "failed",
]);

export const jobs = pgTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    type: text("type").notNull(),
    state: jobStateEnum("state").notNull().default("queued"),
    payload: jsonb("payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("jobs_org_workspace_idx").on(t.organizationId, t.workspaceId),
  ],
);
