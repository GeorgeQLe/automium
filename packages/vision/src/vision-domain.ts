export const TARGETED_VISION_SCHEMA_VERSION = "v1";

export interface TargetedVisionDecisionInput {
  readonly semanticConfidence: number;
  readonly elementRole: string;
  readonly recentFailures: readonly string[];
}

export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface TargetedCropRequestInput {
  readonly runId: string;
  readonly elementId: string;
  readonly boundingBox: BoundingBox;
  readonly reason: string;
}

export interface TargetedCropRequest extends TargetedCropRequestInput {
  readonly schemaVersion: typeof TARGETED_VISION_SCHEMA_VERSION;
  readonly fullPage: false;
}

const LOW_SEMANTIC_CONFIDENCE_THRESHOLD = 0.7;
const ACTIONABILITY_FAILURES = new Set([
  "not-actionable",
  "not-visible",
  "disabled",
  "covered",
  "ambiguous-target"
]);

export function shouldRequestTargetedVision(
  input: TargetedVisionDecisionInput
): boolean {
  if (input.semanticConfidence < LOW_SEMANTIC_CONFIDENCE_THRESHOLD) {
    return true;
  }

  return input.recentFailures.some((failure) =>
    ACTIONABILITY_FAILURES.has(failure)
  );
}

export function createTargetedCropRequest(
  input: TargetedCropRequestInput
): TargetedCropRequest {
  return {
    schemaVersion: TARGETED_VISION_SCHEMA_VERSION,
    runId: input.runId,
    elementId: input.elementId,
    boundingBox: { ...input.boundingBox },
    reason: input.reason,
    fullPage: false
  };
}
