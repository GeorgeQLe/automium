const SHARED_PLATFORM_UI_PRIMITIVES = [
  "app-shell",
  "sidebar-navigation",
  "resource-table",
  "status-badge",
  "audit-timeline"
] as const;

// --- Types derived from frozen constants ---

export type UiPrimitive = (typeof SHARED_PLATFORM_UI_PRIMITIVES)[number];

// --- Config interfaces ---

export interface AppShellConfig {
  primitive: "app-shell";
  title: string;
  logoUrl?: string;
  sections: SidebarSection[];
}

export interface SidebarSection {
  label: string;
  icon?: string;
  href: string;
  active?: boolean;
}

export interface ResourceTableConfig {
  primitive: "resource-table";
  resourceType: string;
  columns: ResourceTableColumn[];
  sortable?: boolean;
  paginated?: boolean;
}

export interface ResourceTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface StatusBadgeConfig {
  primitive: "status-badge";
  status: string;
  variant: "success" | "warning" | "error" | "info" | "neutral";
  label?: string;
}

export interface AuditTimelineConfig {
  primitive: "audit-timeline";
  organizationId: string;
  workspaceId?: string;
  maxEntries?: number;
  filters?: AuditTimelineFilter;
}

export interface AuditTimelineFilter {
  actorId?: string;
  resourceType?: string;
  action?: string;
  since?: string;
}

// --- Builder functions ---

export function buildAppShellConfig(params: {
  title: string;
  logoUrl?: string;
  sections: SidebarSection[];
}): AppShellConfig {
  return {
    primitive: "app-shell",
    title: params.title,
    logoUrl: params.logoUrl,
    sections: params.sections,
  };
}

export function buildResourceTableConfig(params: {
  resourceType: string;
  columns: ResourceTableColumn[];
  sortable?: boolean;
  paginated?: boolean;
}): ResourceTableConfig {
  return {
    primitive: "resource-table",
    resourceType: params.resourceType,
    columns: params.columns,
    sortable: params.sortable ?? true,
    paginated: params.paginated ?? true,
  };
}

export function buildStatusBadgeConfig(params: {
  status: string;
  variant: StatusBadgeConfig["variant"];
  label?: string;
}): StatusBadgeConfig {
  return {
    primitive: "status-badge",
    status: params.status,
    variant: params.variant,
    label: params.label ?? params.status,
  };
}

export function buildAuditTimelineConfig(params: {
  organizationId: string;
  workspaceId?: string;
  maxEntries?: number;
  filters?: AuditTimelineFilter;
}): AuditTimelineConfig {
  return {
    primitive: "audit-timeline",
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    maxEntries: params.maxEntries ?? 50,
    filters: params.filters,
  };
}

// --- Breadcrumb navigation ---

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface BreadcrumbConfig {
  primitive: "breadcrumb";
  segments: BreadcrumbSegment[];
}

export function buildBreadcrumbConfig(params: {
  product: { label: string; href: string };
  section?: { label: string; href: string };
  resource?: { label: string; href?: string };
}): BreadcrumbConfig {
  const segments: BreadcrumbSegment[] = [
    { label: params.product.label, href: params.product.href },
  ];

  if (params.section) {
    segments.push({
      label: params.section.label,
      href: params.section.href,
    });
  }

  if (params.resource) {
    segments.push({
      label: params.resource.label,
      href: params.resource.href,
    });
  }

  return {
    primitive: "breadcrumb",
    segments,
  };
}
