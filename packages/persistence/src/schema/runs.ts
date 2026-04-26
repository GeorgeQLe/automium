import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizations, workspaces } from "./tenancy";
import { journeys, journeyVersions } from "./journeys";

export const runStatusEnum = pgEnum("run_status", [
  "queued",
  "leased",
  "running",
  "passed",
  "failed",
  "unsupported",
  "cancelled",
]);

export const stepVerdictEnum = pgEnum("step_verdict", [
  "pass",
  "fail",
  "inconclusive",
  "unsupported",
]);

export const assertionTypeEnum = pgEnum("assertion_type", [
  "semantic",
  "url",
  "network",
  "download",
  "extracted-value",
]);

export const recoveryStrategyEnum = pgEnum("recovery_strategy", [
  "bounded-retry",
  "fail-fast",
]);

export const runs = pgTable(
  "runs",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    journeyId: text("journey_id")
      .notNull()
      .references(() => journeys.id),
    status: runStatusEnum("status").notNull().default("queued"),
    plannerId: text("planner_id").notNull(),
    artifactManifestRef: text("artifact_manifest_ref"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("runs_org_workspace_idx").on(t.organizationId, t.workspaceId),
  ],
);

export const steps = pgTable(
  "steps",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id),
    sequence: integer("sequence").notNull(),
    intent: text("intent").notNull(),
    target: text("target"),
    value: text("value"),
    verdict: stepVerdictEnum("verdict"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("steps_run_id_sequence_idx").on(t.runId, t.sequence)],
);

export const assertions = pgTable("assertions", {
  id: text("id").primaryKey(),
  journeyVersionId: text("journey_version_id")
    .notNull()
    .references(() => journeyVersions.id),
  type: assertionTypeEnum("type").notNull(),
  target: text("target").notNull(),
});

export const recoveryRules = pgTable("recovery_rules", {
  id: text("id").primaryKey(),
  journeyVersionId: text("journey_version_id")
    .notNull()
    .references(() => journeyVersions.id),
  maxAttempts: integer("max_attempts").notNull().default(2),
  strategy: recoveryStrategyEnum("strategy").notNull().default("bounded-retry"),
});
