import { pgTable, text } from "drizzle-orm/pg-core";

// Tenancy tables
export {
  organizations,
  workspaces,
  memberships,
  membershipRoleEnum,
  membershipStatusEnum,
} from "./tenancy";

// Auth tables — real definitions in Step 1.4
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
});

export const invites = pgTable("invites", {
  id: text("id").primaryKey(),
});

// Journey tables — real definitions in Step 1.5
export const journeys = pgTable("journeys", {
  id: text("id").primaryKey(),
});

export const journeyVersions = pgTable("journey_versions", {
  id: text("id").primaryKey(),
});

export const runs = pgTable("runs", {
  id: text("id").primaryKey(),
});

export const steps = pgTable("steps", {
  id: text("id").primaryKey(),
});

export const assertions = pgTable("assertions", {
  id: text("id").primaryKey(),
});

export const recoveryRules = pgTable("recovery_rules", {
  id: text("id").primaryKey(),
});

// Supporting tables — real definitions in Step 1.6
export const artifactManifests = pgTable("artifact_manifests", {
  id: text("id").primaryKey(),
});

export const auditEvents = pgTable("audit_events", {
  id: text("id").primaryKey(),
});

export const credentials = pgTable("credentials", {
  id: text("id").primaryKey(),
});

export const files = pgTable("files", {
  id: text("id").primaryKey(),
});

export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
});
