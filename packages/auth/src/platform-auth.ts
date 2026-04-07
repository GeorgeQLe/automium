export const AUTH_IDENTITY_PROVIDERS = [
  "password",
  "magic-link",
  "sso"
] as const;

export const SESSION_STATES = [
  "pending",
  "active",
  "revoked",
  "expired"
] as const;

export const INVITE_STATUSES = [
  "pending",
  "accepted",
  "expired",
  "revoked"
] as const;

export const inviteAcceptanceResultFields = [
  "identityId",
  "organizationId",
  "workspaceId",
  "membershipId",
  "sessionId"
] as const;

export const authPlatformContract = {
  identityProviders: AUTH_IDENTITY_PROVIDERS,
  sessionStates: SESSION_STATES,
  inviteStatuses: INVITE_STATUSES,
  inviteAcceptanceResultFields
} as const;
