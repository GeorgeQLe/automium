export interface FoundryCanvasWidgetPlacement {
  widgetId: string;
  region: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface FoundryCanvas {
  pageId: string;
  columns: number;
  rowHeight: number;
  regions: string[];
  widgets: FoundryCanvasWidgetPlacement[];
  createdAt: string;
  updatedAt: string;
}

type PlacementInput = Omit<FoundryCanvasWidgetPlacement, "zIndex"> & {
  zIndex?: number;
};

export function createFoundryCanvas(params: {
  pageId: string;
  columns: number;
  rowHeight: number;
  regions: string[];
  widgets?: PlacementInput[];
  createdAt?: string;
  updatedAt?: string;
}): FoundryCanvas {
  const createdAt = params.createdAt ?? new Date().toISOString();

  return {
    pageId: params.pageId,
    columns: params.columns,
    rowHeight: params.rowHeight,
    regions: [...params.regions],
    widgets: (params.widgets ?? []).map((widget, index) => ({
      ...widget,
      zIndex: widget.zIndex ?? index,
    })),
    createdAt,
    updatedAt: params.updatedAt ?? createdAt,
  };
}

export function placeWidgetOnCanvas(
  canvas: FoundryCanvas,
  placement: PlacementInput
): FoundryCanvas {
  const maxZIndex = canvas.widgets.reduce(
    (max, widget) => Math.max(max, widget.zIndex),
    -1
  );

  return {
    ...canvas,
    widgets: [
      ...canvas.widgets.filter((widget) => widget.widgetId !== placement.widgetId),
      {
        ...placement,
        zIndex: placement.zIndex ?? maxZIndex + 1,
      },
    ].sort((left, right) => left.zIndex - right.zIndex),
    updatedAt: new Date().toISOString(),
  };
}

export function resizeCanvasWidget(
  canvas: FoundryCanvas,
  widgetId: string,
  size: { width: number; height: number }
): FoundryCanvas {
  return updateCanvasWidget(canvas, widgetId, size);
}

export function moveCanvasWidget(
  canvas: FoundryCanvas,
  widgetId: string,
  position: { x: number; y: number; region?: string }
): FoundryCanvas {
  return updateCanvasWidget(canvas, widgetId, position);
}

function updateCanvasWidget(
  canvas: FoundryCanvas,
  widgetId: string,
  updates: Partial<FoundryCanvasWidgetPlacement>
): FoundryCanvas {
  return {
    ...canvas,
    widgets: canvas.widgets.map((widget) =>
      widget.widgetId === widgetId
        ? {
            ...widget,
            ...updates,
          }
        : widget
    ),
    updatedAt: new Date().toISOString(),
  };
}
