import { describe, expect, it } from "vitest";

async function loadFoundryCanvas() {
  try {
    return await import("../src/foundry-canvas");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-canvas.ts to define drag-and-drop canvas helpers for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryWidgets() {
  try {
    return await import("../src/foundry-widgets");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-widgets.ts to define widget library helpers for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryBindings() {
  try {
    return await import("../src/foundry-bindings");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-bindings.ts to define widget binding helpers for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryJavaScript() {
  try {
    return await import("../src/foundry-javascript");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-javascript.ts to define JavaScript logic units for Phase 6.",
      { cause: error }
    );
  }
}

async function loadFoundryCustomWidgets() {
  try {
    return await import("../src/foundry-custom-widgets");
  } catch (error) {
    throw new Error(
      "Expected apps/foundry/src/foundry-custom-widgets.ts to define custom widget registration for Phase 6.",
      { cause: error }
    );
  }
}

describe("foundry builder contract", () => {
  it("canvas layout supports regions, drag placement, resize, and stable ordering", async () => {
    const mod = await loadFoundryCanvas();
    const canvas = mod.createFoundryCanvas({
      pageId: "page_orders",
      columns: 12,
      rowHeight: 8,
      regions: ["header", "body", "modal-layer"],
    });
    const placed = mod.placeWidgetOnCanvas(canvas, {
      widgetId: "widget_orders_table",
      region: "body",
      x: 0,
      y: 0,
      width: 12,
      height: 8,
    });
    const resized = mod.resizeCanvasWidget(placed, "widget_orders_table", {
      width: 10,
      height: 10,
    });

    expect(canvas.pageId).toBe("page_orders");
    expect(canvas.regions).toEqual(["header", "body", "modal-layer"]);
    expect(placed.widgets[0].widgetId).toBe("widget_orders_table");
    expect(resized.widgets[0].width).toBe(10);
    expect(resized.widgets[0].zIndex).toBeGreaterThanOrEqual(0);
  });

  it("widget library exposes standard table, form, button, modal, navigation, chart, and custom surfaces", async () => {
    const mod = await loadFoundryWidgets();

    expect(mod.FOUNDRY_WIDGET_LIBRARY.map((widget: { family: string }) => widget.family)).toEqual(
      expect.arrayContaining([
        "table",
        "form",
        "button",
        "modal",
        "navigation",
        "chart",
        "custom",
      ])
    );

    const table = mod.createFoundryWidgetInstance({
      pageId: "page_orders",
      family: "table",
      name: "OrdersTable",
      properties: {
        data: "{{queries.listOrders.data}}",
        selectedRow: "{{state.selectedOrder}}",
      },
    });

    expect(table.widgetId).toBeTruthy();
    expect(table.family).toBe("table");
    expect(table.properties.data).toBe("{{queries.listOrders.data}}");
    expect(table.createdAt).toBeTruthy();
  });

  it("bindings resolve query data, widget state, page parameters, and app variables", async () => {
    const mod = await loadFoundryBindings();
    const binding = mod.createFoundryBinding({
      widgetId: "widget_orders_table",
      scope: "query",
      targetProperty: "data",
      expression: "{{queries.listOrders.data}}",
    });
    const result = mod.evaluateFoundryBinding(binding, {
      queries: { listOrders: { data: [{ id: "order_1", total: 42 }] } },
      widgets: {},
      page: { params: { orderId: "order_1" } },
      app: { currentUser: { email: "ari@example.com" } },
      state: {},
    });

    expect(binding.bindingId).toBeTruthy();
    expect(result.value).toEqual([{ id: "order_1", total: 42 }]);
    expect(result.dependencies).toEqual(["queries.listOrders.data"]);
  });

  it("JavaScript objects expose named actions for reusable builder logic", async () => {
    const mod = await loadFoundryJavaScript();
    const jsObject = mod.createFoundryJavaScriptObject({
      applicationId: "app_orders",
      name: "OrderHelpers",
      source: "export default { formatCurrency: (value) => `$${value}` }",
      actions: ["formatCurrency"],
    });
    const action = mod.invokeFoundryJavaScriptAction(jsObject, "formatCurrency", [42]);

    expect(jsObject.javascriptObjectId).toBeTruthy();
    expect(jsObject.actions).toEqual(["formatCurrency"]);
    expect(action.objectId).toBe(jsObject.javascriptObjectId);
    expect(action.actionName).toBe("formatCurrency");
    expect(action.invokedAt).toBeTruthy();
  });

  it("custom widgets register package metadata and runtime entrypoints", async () => {
    const mod = await loadFoundryCustomWidgets();
    const registry = mod.createFoundryCustomWidgetRegistry();
    const registered = registry.register({
      packageName: "@automium/foundry-order-card",
      version: "1.0.0",
      runtimeEntry: "/widgets/order-card/runtime.js",
      editorEntry: "/widgets/order-card/editor.js",
      allowedProperties: ["order", "onApprove"],
    });

    expect(registered.customWidgetPackageId).toBeTruthy();
    expect(registered.packageName).toBe("@automium/foundry-order-card");
    expect(registry.list().map((pkg: { packageName: string }) => pkg.packageName)).toContain(
      "@automium/foundry-order-card"
    );
    expect(registry.getRuntimeEntry(registered.customWidgetPackageId)).toBe(
      "/widgets/order-card/runtime.js"
    );
  });
});
