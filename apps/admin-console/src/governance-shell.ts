export const ADMIN_CONSOLE_SECTIONS = [
  "authentication",
  "organizations",
  "workspaces",
  "memberships",
  "roles",
  "audit",
  "files",
  "jobs",
  "search",
  "realtime"
] as const;

export const adminConsoleGovernanceCapabilities = [
  "instance-configuration",
  "invite-and-membership-ops",
  "audit-trail-review",
  "file-ownership-review",
  "job-queue-observability",
  "search-index-rebuilds",
  "realtime-delivery-monitoring"
] as const;

export const governanceShellContract = {
  sections: ADMIN_CONSOLE_SECTIONS,
  capabilities: adminConsoleGovernanceCapabilities
} as const;
