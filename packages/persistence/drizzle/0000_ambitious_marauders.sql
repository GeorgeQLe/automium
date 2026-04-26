CREATE TYPE "public"."artifact_kind" AS ENUM('semantic-snapshot', 'network-log', 'console-log', 'download', 'targeted-crop', 'assertion-trace', 'planner-intent', 'executor-action');--> statement-breakpoint
CREATE TYPE "public"."assertion_type" AS ENUM('semantic', 'url', 'network', 'download', 'extracted-value');--> statement-breakpoint
CREATE TYPE "public"."audited_action" AS ENUM('invite.sent', 'invite.accepted', 'membership.role-changed', 'file.ownership-transferred', 'job.scheduled', 'search.indexed', 'realtime.event-delivered');--> statement-breakpoint
CREATE TYPE "public"."identity_provider" AS ENUM('password', 'magic-link', 'sso');--> statement-breakpoint
CREATE TYPE "public"."invite_status" AS ENUM('pending', 'accepted', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."job_state" AS ENUM('queued', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."membership_role" AS ENUM('workspace-admin', 'maintainer', 'contributor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."recovery_strategy" AS ENUM('bounded-retry', 'fail-fast');--> statement-breakpoint
CREATE TYPE "public"."run_status" AS ENUM('queued', 'leased', 'running', 'passed', 'failed', 'unsupported', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."session_state" AS ENUM('pending', 'active', 'revoked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."step_verdict" AS ENUM('pass', 'fail', 'inconclusive', 'unsupported');--> statement-breakpoint
CREATE TABLE "artifact_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"manifest_id" text NOT NULL,
	"kind" "artifact_kind" NOT NULL,
	"path" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artifact_manifests" (
	"id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"root" text NOT NULL,
	"schema_version" text DEFAULT 'v1' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assertions" (
	"id" text PRIMARY KEY NOT NULL,
	"journey_version_id" text NOT NULL,
	"type" "assertion_type" NOT NULL,
	"target" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"action" "audited_action" NOT NULL,
	"summary" text NOT NULL,
	"metadata" jsonb,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credentials" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"scope" text NOT NULL,
	"purpose" text NOT NULL,
	"encrypted_value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"owner_membership_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"email" text NOT NULL,
	"status" "invite_status" DEFAULT 'pending' NOT NULL,
	"invited_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"type" text NOT NULL,
	"state" "job_state" DEFAULT 'queued' NOT NULL,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journey_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"journey_id" text NOT NULL,
	"graph_version" text NOT NULL,
	"compiled_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journeys" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"app_id" text NOT NULL,
	"goal" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"principal_id" text NOT NULL,
	"role" "membership_role" NOT NULL,
	"status" "membership_status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recovery_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"journey_version_id" text NOT NULL,
	"max_attempts" integer DEFAULT 2 NOT NULL,
	"strategy" "recovery_strategy" DEFAULT 'bounded-retry' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"journey_id" text NOT NULL,
	"status" "run_status" DEFAULT 'queued' NOT NULL,
	"planner_id" text NOT NULL,
	"artifact_manifest_ref" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"identity_id" text NOT NULL,
	"provider" "identity_provider" NOT NULL,
	"state" "session_state" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "steps" (
	"id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"sequence" integer NOT NULL,
	"intent" text NOT NULL,
	"target" text,
	"value" text,
	"verdict" "step_verdict",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artifact_entries" ADD CONSTRAINT "artifact_entries_manifest_id_artifact_manifests_id_fk" FOREIGN KEY ("manifest_id") REFERENCES "public"."artifact_manifests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_manifests" ADD CONSTRAINT "artifact_manifests_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assertions" ADD CONSTRAINT "assertions_journey_version_id_journey_versions_id_fk" FOREIGN KEY ("journey_version_id") REFERENCES "public"."journey_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_owner_membership_id_memberships_id_fk" FOREIGN KEY ("owner_membership_id") REFERENCES "public"."memberships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_versions" ADD CONSTRAINT "journey_versions_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_rules" ADD CONSTRAINT "recovery_rules_journey_version_id_journey_versions_id_fk" FOREIGN KEY ("journey_version_id") REFERENCES "public"."journey_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "steps" ADD CONSTRAINT "steps_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artifact_entries_manifest_id_idx" ON "artifact_entries" USING btree ("manifest_id");--> statement-breakpoint
CREATE INDEX "artifact_manifests_run_id_idx" ON "artifact_manifests" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "audit_events_org_workspace_idx" ON "audit_events" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "credentials_org_ws_scope_purpose_idx" ON "credentials" USING btree ("organization_id","workspace_id","scope","purpose");--> statement-breakpoint
CREATE INDEX "files_org_workspace_idx" ON "files" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE INDEX "invites_org_workspace_idx" ON "invites" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE INDEX "jobs_org_workspace_idx" ON "jobs" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE INDEX "journey_versions_journey_id_idx" ON "journey_versions" USING btree ("journey_id");--> statement-breakpoint
CREATE INDEX "journeys_org_workspace_idx" ON "journeys" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE INDEX "memberships_org_workspace_idx" ON "memberships" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE INDEX "runs_org_workspace_idx" ON "runs" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE INDEX "sessions_identity_id_idx" ON "sessions" USING btree ("identity_id");--> statement-breakpoint
CREATE INDEX "steps_run_id_sequence_idx" ON "steps" USING btree ("run_id","sequence");--> statement-breakpoint
CREATE INDEX "workspaces_organization_id_idx" ON "workspaces" USING btree ("organization_id");