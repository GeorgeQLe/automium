import type {
  SemanticInteractiveElement,
  SemanticMutationSummary,
  SemanticNetworkEvent,
} from "../../contracts/src/semantic-snapshot";
import { describeInteractiveElement } from "../../engine/src/engine-domain";
import type { NetworkEvent, RawAccessibilityNode } from "./types";

type ComparableElement = Partial<SemanticInteractiveElement> & {
  readonly id: string;
};

type RawNetworkEvent = NetworkEvent & {
  readonly requestId?: string;
};

function normalizeBoolean(value: boolean | undefined, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function walkAccessibilityNodes(
  nodes: readonly RawAccessibilityNode[],
  route: string,
  frameId: string,
  elements: SemanticInteractiveElement[]
): void {
  for (const node of nodes) {
    const label = node.name ?? "";
    const visible = normalizeBoolean(node.visible, true);
    const enabled = normalizeBoolean(node.enabled, !node.disabled);
    const descriptor = describeInteractiveElement({
      role: node.role,
      label,
      frameId,
      route,
      visible,
      enabled,
    });

    elements.push({
      id: descriptor.id,
      role: node.role,
      label,
      value: node.value ?? null,
      required: node.required ?? false,
      disabled: node.disabled ?? !enabled,
      loading: node.loading ?? false,
      error: node.error ?? null,
      visible,
      interactable: descriptor.actionability.score > 0,
      group: frameId,
    });

    if (node.children?.length) {
      walkAccessibilityNodes(node.children, route, frameId, elements);
    }
  }
}

export function enrichAccessibilityTree(
  rawSnapshot: readonly RawAccessibilityNode[],
  route: string,
  frameId: string
): SemanticInteractiveElement[] {
  const elements: SemanticInteractiveElement[] = [];
  walkAccessibilityNodes(rawSnapshot, route, frameId, elements);
  return elements;
}

function mutationId(kind: SemanticMutationSummary["kind"], targetId: string): string {
  return `mut_${kind}_${targetId}`;
}

function byId(elements: readonly ComparableElement[]): Map<string, ComparableElement> {
  return new Map(elements.map((element) => [element.id, element]));
}

export function diffMutations(
  previous: readonly ComparableElement[],
  current: readonly ComparableElement[]
): SemanticMutationSummary[] {
  const mutations: SemanticMutationSummary[] = [];
  const previousById = byId(previous);
  const currentById = byId(current);

  for (const element of current) {
    const prior = previousById.get(element.id);
    if (!prior) {
      mutations.push({
        mutationId: mutationId("child-list", element.id),
        kind: "child-list",
        targetId: element.id,
        summary: `Element added: ${element.label ?? element.role ?? element.id}`,
      });
      continue;
    }

    if (prior.visible !== element.visible) {
      mutations.push({
        mutationId: mutationId("visibility", element.id),
        kind: "visibility",
        targetId: element.id,
        summary: `Visibility changed from ${String(prior.visible)} to ${String(element.visible)}`,
      });
    }

    if (prior.label !== element.label || prior.value !== element.value) {
      mutations.push({
        mutationId: mutationId("text", element.id),
        kind: "text",
        targetId: element.id,
        summary: "Visible text changed",
      });
    }

    if (
      prior.role !== element.role ||
      prior.disabled !== element.disabled ||
      prior.required !== element.required ||
      prior.loading !== element.loading ||
      prior.error !== element.error ||
      prior.interactable !== element.interactable ||
      prior.group !== element.group
    ) {
      mutations.push({
        mutationId: mutationId("attribute", element.id),
        kind: "attribute",
        targetId: element.id,
        summary: "Element attributes changed",
      });
    }
  }

  for (const element of previous) {
    if (!currentById.has(element.id)) {
      mutations.push({
        mutationId: mutationId("child-list", element.id),
        kind: "child-list",
        targetId: element.id,
        summary: `Element removed: ${element.label ?? element.role ?? element.id}`,
      });
    }
  }

  return mutations;
}

function normalizeNetworkCategory(
  resourceType: string | undefined
): SemanticNetworkEvent["category"] {
  switch (resourceType?.toLowerCase()) {
    case "document":
      return "document";
    case "xhr":
      return "xhr";
    case "fetch":
      return "fetch";
    case "websocket":
    case "web_socket":
      return "websocket";
    default:
      return "other";
  }
}

export function categorizeNetworkEvent(event: RawNetworkEvent): SemanticNetworkEvent {
  return {
    requestId: event.requestId ?? event.url,
    method: event.method,
    url: event.url,
    status: event.status,
    category: normalizeNetworkCategory(event.resourceType),
  };
}
