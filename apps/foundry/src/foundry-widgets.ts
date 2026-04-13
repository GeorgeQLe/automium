import type { FoundryWidgetFamily } from "./foundry-constants";
import type { FoundryWidget, FoundryWidgetLayout } from "./foundry-domain";
import { createFoundryWidget } from "./foundry-domain";
import { FOUNDRY_WIDGET_FAMILIES } from "./foundry-constants";

export interface FoundryWidgetLibraryItem {
  family: FoundryWidgetFamily;
  displayName: string;
  defaultLayout: FoundryWidgetLayout;
  bindableProperties: string[];
}

export const FOUNDRY_WIDGET_LIBRARY: readonly FoundryWidgetLibraryItem[] =
  FOUNDRY_WIDGET_FAMILIES.map((family) => ({
    family,
    displayName: family
      .split("-")
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" "),
    defaultLayout: {
      x: 0,
      y: 0,
      width: family === "table" || family === "chart" ? 8 : 4,
      height: family === "table" || family === "form" ? 6 : 3,
    },
    bindableProperties:
      family === "button"
        ? ["label", "onClick"]
        : ["data", "visible", "disabled"],
  }));

export function createFoundryWidgetInstance(params: {
  pageId: string;
  family: FoundryWidgetFamily;
  name: string;
  properties?: Record<string, unknown>;
  layout?: FoundryWidgetLayout;
  widgetId?: string;
  createdAt?: string;
  updatedAt?: string;
}): FoundryWidget {
  const libraryItem = FOUNDRY_WIDGET_LIBRARY.find(
    (item) => item.family === params.family
  );

  return createFoundryWidget({
    pageId: params.pageId,
    family: params.family,
    name: params.name,
    layout: params.layout ?? libraryItem?.defaultLayout ?? defaultLayout(),
    properties: params.properties ?? {},
    widgetId: params.widgetId,
    createdAt: params.createdAt,
    updatedAt: params.updatedAt,
  });
}

export function updateFoundryWidgetProperties(
  widget: FoundryWidget,
  properties: Record<string, unknown>
): FoundryWidget {
  return {
    ...widget,
    properties: {
      ...widget.properties,
      ...properties,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function moveFoundryWidget(
  widget: FoundryWidget,
  layout: Partial<FoundryWidgetLayout>
): FoundryWidget {
  return {
    ...widget,
    layout: {
      ...widget.layout,
      ...layout,
    },
    updatedAt: new Date().toISOString(),
  };
}

function defaultLayout(): FoundryWidgetLayout {
  return {
    x: 0,
    y: 0,
    width: 4,
    height: 4,
  };
}
