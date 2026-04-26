-- Row-Level Security policies for tenant isolation.
-- Applied to all tables with a direct organization_id column.
-- Idempotent: safe to re-run.

-- workspaces
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_workspaces ON workspaces;
CREATE POLICY tenant_isolation_workspaces ON workspaces
  USING (organization_id = current_setting('app.organization_id')::text);

-- memberships
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_memberships ON memberships;
CREATE POLICY tenant_isolation_memberships ON memberships
  USING (organization_id = current_setting('app.organization_id')::text);

-- invites
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_invites ON invites;
CREATE POLICY tenant_isolation_invites ON invites
  USING (organization_id = current_setting('app.organization_id')::text);

-- journeys
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_journeys ON journeys;
CREATE POLICY tenant_isolation_journeys ON journeys
  USING (organization_id = current_setting('app.organization_id')::text);

-- runs
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_runs ON runs;
CREATE POLICY tenant_isolation_runs ON runs
  USING (organization_id = current_setting('app.organization_id')::text);

-- audit_events
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_audit_events ON audit_events;
CREATE POLICY tenant_isolation_audit_events ON audit_events
  USING (organization_id = current_setting('app.organization_id')::text);

-- credentials
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_credentials ON credentials;
CREATE POLICY tenant_isolation_credentials ON credentials
  USING (organization_id = current_setting('app.organization_id')::text);

-- files
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_files ON files;
CREATE POLICY tenant_isolation_files ON files
  USING (organization_id = current_setting('app.organization_id')::text);

-- jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_jobs ON jobs;
CREATE POLICY tenant_isolation_jobs ON jobs
  USING (organization_id = current_setting('app.organization_id')::text);
