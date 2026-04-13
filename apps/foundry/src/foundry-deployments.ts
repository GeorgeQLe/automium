import type { FoundryDeploymentStatus } from "./foundry-constants";
import type { FoundryDeployment } from "./foundry-domain";
import { createFoundryDeployment as createDomainFoundryDeployment } from "./foundry-domain";

export interface FoundryDeploymentAudit {
  actorId: string;
  reason?: string;
  transitionedAt: string;
}

export interface FoundryDeploymentLifecycle extends FoundryDeployment {
  audit: FoundryDeploymentAudit;
  promotedFromDeploymentId?: string;
  rollbackTargetDeploymentId?: string;
}

export function createFoundryDeployment(params: {
  applicationId: string;
  branchId: string;
  environmentId: string;
  status?: FoundryDeploymentStatus;
  deploymentId?: string;
  createdAt?: string;
  publishedAt?: string;
}): FoundryDeployment {
  return createDomainFoundryDeployment({
    ...params,
    status: params.status ?? "draft",
  });
}

export function transitionFoundryDeployment(
  deployment: FoundryDeployment,
  status: FoundryDeploymentStatus,
  audit: { actorId: string; reason?: string; transitionedAt?: string }
): FoundryDeploymentLifecycle {
  const transitionedAt = audit.transitionedAt ?? new Date().toISOString();

  return {
    ...deployment,
    status,
    publishedAt:
      status === "published" ? deployment.publishedAt ?? transitionedAt : deployment.publishedAt,
    audit: {
      actorId: audit.actorId,
      reason: audit.reason,
      transitionedAt,
    },
  };
}

export function promoteFoundryDeployment(
  deployment: FoundryDeployment,
  params: {
    actorId: string;
    targetEnvironmentId: string;
    reason?: string;
    deploymentId?: string;
    promotedAt?: string;
  }
): FoundryDeploymentLifecycle {
  const promotedAt = params.promotedAt ?? new Date().toISOString();

  return {
    ...deployment,
    deploymentId: params.deploymentId ?? generateId("deploy"),
    environmentId: params.targetEnvironmentId,
    status: "published",
    createdAt: promotedAt,
    publishedAt: promotedAt,
    promotedFromDeploymentId: deployment.deploymentId,
    audit: {
      actorId: params.actorId,
      reason: params.reason,
      transitionedAt: promotedAt,
    },
  };
}

export function rollbackFoundryDeployment(
  deployment: FoundryDeployment,
  params: {
    actorId: string;
    targetDeploymentId: string;
    reason?: string;
    rolledBackAt?: string;
  }
): FoundryDeploymentLifecycle {
  const rolledBackAt = params.rolledBackAt ?? new Date().toISOString();

  return {
    ...deployment,
    status: "rolled-back",
    rollbackTargetDeploymentId: params.targetDeploymentId,
    audit: {
      actorId: params.actorId,
      reason: params.reason,
      transitionedAt: rolledBackAt,
    },
  };
}

export function listFoundryRollbackTargets(
  deployments: FoundryDeployment[],
  environmentId: string
): FoundryDeployment[] {
  return deployments.filter(
    (deployment) =>
      deployment.environmentId === environmentId && deployment.status === "published"
  );
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
