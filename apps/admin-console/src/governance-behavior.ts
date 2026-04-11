import {
  ADMIN_CONSOLE_SECTIONS,
  adminConsoleGovernanceCapabilities,
} from "./governance-shell";

// --- Types derived from frozen constants ---

export type AdminConsoleSection = (typeof ADMIN_CONSOLE_SECTIONS)[number];
export type GovernanceCapability = (typeof adminConsoleGovernanceCapabilities)[number];

// --- Interfaces ---

export interface GovernanceShellState {
  activeSections: AdminConsoleSection[];
  enabledCapabilities: GovernanceCapability[];
  lastRefreshedAt: string;
}

export interface GovernanceSectionConfig {
  section: AdminConsoleSection;
  label: string;
  capability: GovernanceCapability;
  enabled: boolean;
  icon?: string;
}

// --- Section ↔ Capability mapping ---

export const SECTION_CAPABILITY_MAP: Record<AdminConsoleSection, GovernanceCapability> = {
  authentication: "instance-configuration",
  organizations: "instance-configuration",
  workspaces: "invite-and-membership-ops",
  memberships: "invite-and-membership-ops",
  roles: "instance-configuration",
  audit: "audit-trail-review",
  files: "file-ownership-review",
  jobs: "job-queue-observability",
  search: "search-index-rebuilds",
  realtime: "realtime-delivery-monitoring",
};

// --- Builder functions ---

export function buildGovernanceShellState(params: {
  activeSections?: AdminConsoleSection[];
  enabledCapabilities?: GovernanceCapability[];
}): GovernanceShellState {
  return {
    activeSections: params.activeSections ?? [...ADMIN_CONSOLE_SECTIONS],
    enabledCapabilities:
      params.enabledCapabilities ?? [...adminConsoleGovernanceCapabilities],
    lastRefreshedAt: new Date().toISOString(),
  };
}

export function buildGovernanceSectionConfig(params: {
  section: AdminConsoleSection;
  label: string;
  enabled?: boolean;
  icon?: string;
}): GovernanceSectionConfig {
  return {
    section: params.section,
    label: params.label,
    capability: SECTION_CAPABILITY_MAP[params.section],
    enabled: params.enabled ?? true,
    icon: params.icon,
  };
}

export function buildAllSectionConfigs(): GovernanceSectionConfig[] {
  return ADMIN_CONSOLE_SECTIONS.map((section) =>
    buildGovernanceSectionConfig({
      section,
      label: section.charAt(0).toUpperCase() + section.slice(1),
    })
  );
}

// --- Validation ---

export function validateGovernanceShellState(
  state: GovernanceShellState
): string[] {
  const errors: string[] = [];
  if (!state.lastRefreshedAt) errors.push("lastRefreshedAt is required");
  for (const section of state.activeSections) {
    if (!ADMIN_CONSOLE_SECTIONS.includes(section as never)) {
      errors.push(`Invalid section: ${section}`);
    }
  }
  for (const cap of state.enabledCapabilities) {
    if (!adminConsoleGovernanceCapabilities.includes(cap as never)) {
      errors.push(`Invalid capability: ${cap}`);
    }
  }
  return errors;
}
