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

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.5 not implemented: ${operation}`);
}

export function shouldRequestTargetedVision(
  _input: TargetedVisionDecisionInput
): boolean {
  return notImplemented("shouldRequestTargetedVision");
}

export function createTargetedCropRequest(
  _input: TargetedCropRequestInput
): TargetedCropRequest {
  return notImplemented("createTargetedCropRequest");
}
