import { pgTable, text } from "drizzle-orm/pg-core";

// Tenancy tables
export {
  organizations,
  workspaces,
  memberships,
  membershipRoleEnum,
  membershipStatusEnum,
} from "./tenancy";

// Auth tables
export {
  sessions,
  invites,
  identityProviderEnum,
  sessionStateEnum,
  inviteStatusEnum,
} from "./auth";

// Journey tables
export { journeys, journeyVersions } from "./journeys";

// Run tables
export {
  runs,
  steps,
  assertions,
  recoveryRules,
  runStatusEnum,
  stepVerdictEnum,
  assertionTypeEnum,
  recoveryStrategyEnum,
} from "./runs";

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
