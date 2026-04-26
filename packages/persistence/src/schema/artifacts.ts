import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { runs } from "./runs";

export const artifactKindEnum = pgEnum("artifact_kind", [
  "semantic-snapshot",
  "network-log",
  "console-log",
  "download",
  "targeted-crop",
  "assertion-trace",
  "planner-intent",
  "executor-action",
]);

export const artifactManifests = pgTable(
  "artifact_manifests",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id),
    root: text("root").notNull(),
    schemaVersion: text("schema_version").notNull().default("v1"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("artifact_manifests_run_id_idx").on(t.runId)],
);

export const artifactEntries = pgTable(
  "artifact_entries",
  {
    id: text("id").primaryKey(),
    manifestId: text("manifest_id")
      .notNull()
      .references(() => artifactManifests.id),
    kind: artifactKindEnum("kind").notNull(),
    path: text("path").notNull(),
  },
  (t) => [index("artifact_entries_manifest_id_idx").on(t.manifestId)],
);
