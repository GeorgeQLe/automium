import {
  AUTH_IDENTITY_PROVIDERS,
  SESSION_STATES,
  INVITE_STATUSES,
} from "./platform-auth";

// --- Types derived from frozen constants ---

export type IdentityProvider = (typeof AUTH_IDENTITY_PROVIDERS)[number];
export type SessionState = (typeof SESSION_STATES)[number];
export type InviteStatus = (typeof INVITE_STATUSES)[number];

// --- Interfaces ---

export interface Session {
  sessionId: string;
  identityId: string;
  provider: IdentityProvider;
  state: SessionState;
  createdAt: string;
  expiresAt: string;
}

export interface Invite {
  inviteId: string;
  organizationId: string;
  workspaceId: string;
  email: string;
  status: InviteStatus;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface InviteAcceptanceResult {
  identityId: string;
  organizationId: string;
  workspaceId: string;
  membershipId: string;
  sessionId: string;
}

// --- Valid state transitions ---

const VALID_SESSION_TRANSITIONS: Record<SessionState, readonly SessionState[]> = {
  pending: ["active", "expired"],
  active: ["revoked", "expired"],
  revoked: [],
  expired: [],
};

const VALID_INVITE_TRANSITIONS: Record<InviteStatus, readonly InviteStatus[]> = {
  pending: ["accepted", "expired", "revoked"],
  accepted: [],
  expired: [],
  revoked: [],
};

// --- Factory functions ---

export function createSession(params: {
  identityId: string;
  provider: IdentityProvider;
  id?: string;
  expiresAt?: string;
}): Session {
  return {
    sessionId: params.id ?? generateId("ses"),
    identityId: params.identityId,
    provider: params.provider,
    state: "pending",
    createdAt: new Date().toISOString(),
    expiresAt: params.expiresAt ?? defaultExpiry(),
  };
}

export function createInvite(params: {
  organizationId: string;
  workspaceId: string;
  email: string;
  invitedBy: string;
  id?: string;
  expiresAt?: string;
}): Invite {
  return {
    inviteId: params.id ?? generateId("inv"),
    organizationId: params.organizationId,
    workspaceId: params.workspaceId,
    email: params.email,
    status: "pending",
    invitedBy: params.invitedBy,
    createdAt: new Date().toISOString(),
    expiresAt: params.expiresAt ?? defaultExpiry(),
  };
}

// --- State machines ---

export function transitionSessionState(
  current: SessionState,
  next: SessionState
): SessionState {
  const allowed = VALID_SESSION_TRANSITIONS[current];
  if (!allowed.includes(next)) {
    throw new Error(`Invalid session transition: ${current} → ${next}`);
  }
  return next;
}

export function transitionInviteStatus(
  current: InviteStatus,
  next: InviteStatus
): InviteStatus {
  const allowed = VALID_INVITE_TRANSITIONS[current];
  if (!allowed.includes(next)) {
    throw new Error(`Invalid invite transition: ${current} → ${next}`);
  }
  return next;
}

// --- Domain logic ---

export function buildInviteAcceptanceResult(params: {
  identityId: string;
  organizationId: string;
  workspaceId: string;
  membershipId: string;
  sessionId: string;
}): InviteAcceptanceResult {
  validateNonEmpty(params, [
    "identityId",
    "organizationId",
    "workspaceId",
    "membershipId",
    "sessionId",
  ]);
  return { ...params };
}

// --- Validation ---

export function validateSession(session: Session): string[] {
  const errors: string[] = [];
  if (!session.sessionId) errors.push("sessionId is required");
  if (!session.identityId) errors.push("identityId is required");
  if (!AUTH_IDENTITY_PROVIDERS.includes(session.provider as never)) {
    errors.push(`Invalid provider: ${session.provider}`);
  }
  if (!SESSION_STATES.includes(session.state as never)) {
    errors.push(`Invalid state: ${session.state}`);
  }
  return errors;
}

export function validateInvite(invite: Invite): string[] {
  const errors: string[] = [];
  if (!invite.inviteId) errors.push("inviteId is required");
  if (!invite.email) errors.push("email is required");
  if (!invite.organizationId) errors.push("organizationId is required");
  if (!invite.workspaceId) errors.push("workspaceId is required");
  if (!INVITE_STATUSES.includes(invite.status as never)) {
    errors.push(`Invalid status: ${invite.status}`);
  }
  return errors;
}

// --- Internal helpers ---

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function defaultExpiry(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString();
}

function validateNonEmpty(
  obj: Record<string, unknown>,
  fields: string[]
): void {
  for (const field of fields) {
    if (!obj[field]) {
      throw new Error(`${field} is required`);
    }
  }
}
