import type {
  SemanticFrameRef,
  SemanticInteractiveElement,
} from "../../contracts/src/semantic-snapshot";

export interface BrowserRuntimeFrameInput {
  readonly frameId: string;
  readonly parentFrameId: string | null;
  readonly origin: string;
  readonly url: string;
  readonly elements: readonly Partial<SemanticInteractiveElement>[];
}

export interface FlattenedFrameHierarchy {
  readonly elements: readonly Partial<SemanticInteractiveElement>[];
  readonly frameHierarchy: readonly SemanticFrameRef[];
}

export function flattenFrameHierarchy(
  frames: readonly BrowserRuntimeFrameInput[]
): FlattenedFrameHierarchy {
  return {
    elements: frames.flatMap((frame) =>
      frame.elements.map((element) => ({
        ...element,
        group: frame.frameId,
      }))
    ),
    frameHierarchy: frames.map((frame) => ({
      id: frame.frameId,
      parentFrameId: frame.parentFrameId,
      origin: frame.origin,
      url: frame.url,
    })),
  };
}
