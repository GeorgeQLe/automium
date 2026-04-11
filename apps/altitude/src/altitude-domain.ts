import type {
  WorkItemType,
  WorkItemState,
  WorkItemPriority,
  ViewType,
  CycleState,
  NotificationType,
  AltitudeRealtimeTopic,
} from "./altitude-constants";

export interface Project {
  projectId: string;
  name: string;
  description?: string;
  organizationId: string;
  workspaceId: string;
  createdAt: string;
}

export interface WorkItem {
  workItemId: string;
  projectId: string;
  title: string;
  description?: string;
  type: WorkItemType;
  state: WorkItemState;
  priority: WorkItemPriority;
  assigneeId?: string;
  labels?: string[];
  createdAt: string;
}

export interface Comment {
  commentId: string;
  workItemId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Attachment {
  attachmentId: string;
  workItemId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export interface View {
  viewId: string;
  projectId: string;
  type: ViewType;
  name: string;
  createdAt: string;
}

export interface SavedView extends View {
  filters: Record<string, string[]>;
}

export interface Cycle {
  cycleId: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  state: CycleState;
  createdAt: string;
}

export interface Module {
  moduleId: string;
  projectId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Page {
  pageId: string;
  projectId: string;
  title: string;
  content?: string;
  createdAt: string;
}

export interface Notification {
  notificationId: string;
  recipientId: string;
  type: NotificationType;
  workItemId: string;
  message: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  summaryId: string;
  projectId: string;
  totalWorkItems: number;
  completedWorkItems: number;
  overdueWorkItems: number;
  createdAt: string;
}

export interface WebhookConfig {
  webhookId: string;
  projectId: string;
  url: string;
  events: string[];
  createdAt: string;
}

export interface CycleWorkItemLink {
  cycleId: string;
  workItemId: string;
  attachedAt: string;
}

export interface ModuleWorkItemLink {
  moduleId: string;
  workItemId: string;
  addedAt: string;
}

export interface AltitudeRealtimeEvent {
  eventId: string;
  organizationId: string;
  workspaceId: string;
  topic: AltitudeRealtimeTopic;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface AltitudeApiRoute {
  path: string;
  methods: string[];
  description?: string;
}

export interface AltitudeBenchmarkRoute {
  path: string;
  name: string;
}
