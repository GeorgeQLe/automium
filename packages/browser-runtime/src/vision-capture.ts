import {
  createTargetedCropRequest,
  shouldRequestTargetedVision,
  type BoundingBox,
  type TargetedCropRequest,
} from "../../vision/src/vision-domain";

const DEFAULT_MAX_CROPS_PER_STEP = 3;
const DEFAULT_MAX_CROP_SIZE_BYTES = 102400;
const DEFAULT_RUN_ID = "browser-runtime";
const BYTES_PER_PIXEL_ESTIMATE = 4;

export interface VisionCaptureSessionConfig {
  readonly maxCropsPerStep?: number;
  readonly maxCropSizeBytes?: number;
  readonly runId?: string;
}

export interface VisionCaptureSession {
  readonly maxCropsPerStep: number;
  readonly maxCropSizeBytes: number;
  readonly runId: string;
  capturesUsed: number;
}

export interface VisionCaptureResult {
  readonly captured: boolean;
  readonly request?: TargetedCropRequest;
  readonly budgetRemaining: number;
  readonly reason?: string;
}

export interface ScreenshotSemanticContext {
  readonly elementId: string;
  readonly role: string;
  readonly label: string;
  readonly nearbyElements?: readonly string[];
  readonly boundingBox?: BoundingBox;
}

export interface AnnotatedScreenshot {
  readonly screenshot: Buffer;
  readonly boundingBox: BoundingBox;
  readonly semanticContext: ScreenshotSemanticContext;
  readonly capturedAt: string;
}

export function createVisionCaptureSession(
  config: VisionCaptureSessionConfig = {}
): VisionCaptureSession {
  return {
    maxCropsPerStep: config.maxCropsPerStep ?? DEFAULT_MAX_CROPS_PER_STEP,
    maxCropSizeBytes: config.maxCropSizeBytes ?? DEFAULT_MAX_CROP_SIZE_BYTES,
    runId: config.runId ?? DEFAULT_RUN_ID,
    capturesUsed: 0,
  };
}

export function requestCapture(
  session: VisionCaptureSession,
  elementId: string,
  boundingBox: BoundingBox,
  reason: string
): VisionCaptureResult {
  const budgetRemaining = Math.max(
    session.maxCropsPerStep - session.capturesUsed,
    0
  );

  if (budgetRemaining === 0) {
    return { captured: false, budgetRemaining: 0, reason: "crop-budget-exhausted" };
  }

  if (estimateCropSizeBytes(boundingBox) > session.maxCropSizeBytes) {
    return {
      captured: false,
      budgetRemaining,
      reason: "crop-size-budget-exceeded",
    };
  }

  const shouldCapture = shouldRequestTargetedVision({
    semanticConfidence: reason.includes("low-semantic-confidence") ? 0 : 0.5,
    elementRole: "unknown",
    recentFailures: [normalizeVisionReason(reason)],
  });

  if (!shouldCapture) {
    return { captured: false, budgetRemaining, reason: "not-requested" };
  }

  session.capturesUsed += 1;

  return {
    captured: true,
    request: createTargetedCropRequest({
      runId: session.runId,
      elementId,
      boundingBox,
      reason,
    }),
    budgetRemaining: Math.max(session.maxCropsPerStep - session.capturesUsed, 0),
  };
}

export function annotateScreenshot(
  screenshot: Buffer,
  semanticContext: ScreenshotSemanticContext
): AnnotatedScreenshot {
  return {
    screenshot,
    boundingBox: semanticContext.boundingBox ?? {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    semanticContext: {
      ...semanticContext,
      nearbyElements: semanticContext.nearbyElements
        ? [...semanticContext.nearbyElements]
        : [],
    },
    capturedAt: new Date().toISOString(),
  };
}

function estimateCropSizeBytes(boundingBox: BoundingBox): number {
  return boundingBox.width * boundingBox.height * BYTES_PER_PIXEL_ESTIMATE;
}

function normalizeVisionReason(reason: string): string {
  if (reason.includes("ambiguous")) {
    return "ambiguous-target";
  }

  if (reason.includes("not-actionable")) {
    return "not-actionable";
  }

  if (reason.includes("not-visible")) {
    return "not-visible";
  }

  if (reason.includes("disabled")) {
    return "disabled";
  }

  if (reason.includes("covered")) {
    return "covered";
  }

  return reason;
}
