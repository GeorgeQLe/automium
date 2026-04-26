import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizations, workspaces } from "./tenancy";

export const journeys = pgTable(
  "journeys",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    appId: text("app_id").notNull(),
    goal: text("goal").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("journeys_org_workspace_idx").on(t.organizationId, t.workspaceId),
  ],
);

export const journeyVersions = pgTable(
  "journey_versions",
  {
    id: text("id").primaryKey(),
    journeyId: text("journey_id")
      .notNull()
      .references(() => journeys.id),
    graphVersion: text("graph_version").notNull(),
    compiledAt: timestamp("compiled_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("journey_versions_journey_id_idx").on(t.journeyId)],
);
