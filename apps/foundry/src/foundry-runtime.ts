export interface FoundryRuntimePage {
  pageId: string;
  path: string;
  widgetIds: string[];
}

export interface FoundryRuntimeQuery {
  queryId: string;
  safeToExecute: boolean;
}

export interface FoundryRuntimeDatasource {
  datasourceId: string;
  environmentId: string;
}

export interface FoundryRuntimeBootstrap {
  deploymentId: string;
  applicationId: string;
  runtimePath: string;
  editorPath?: never;
  pages: FoundryRuntimePage[];
  queries: FoundryRuntimeQuery[];
  datasources: FoundryRuntimeDatasource[];
  bootstrappedAt: string;
}

export interface FoundryRuntimeSession {
  sessionId: string;
  deploymentId: string;
  principalId: string;
  currentPageId: string;
  openedModalIds: string[];
  activeTabIds: string[];
  submittedWidgetIds: string[];
  createdAt: string;
}

export interface FoundryRuntimeActionResult {
  sessionId: string;
  executedActions: string[];
  currentPageId: string;
  openedModalIds: string[];
  activeTabIds: string[];
  completedAt: string;
}

type RuntimeAction =
  | {
      type: "submit-form";
      widgetId: string;
      queryId?: string;
      next?: RuntimeAction;
    }
  | {
      type: "execute-query";
      queryId: string;
      next?: RuntimeAction;
    }
  | {
      type: "navigate";
      pageId: string;
      modalId?: string;
      next?: RuntimeAction;
    }
  | {
      type: "open-modal";
      modalId: string;
      next?: RuntimeAction;
    }
  | {
      type: "set-tab";
      tabId: string;
      next?: RuntimeAction;
    };

export function createFoundryRuntimeBootstrap(params: {
  deploymentId: string;
  applicationId: string;
  runtimePath: string;
  pages: FoundryRuntimePage[];
  queries: FoundryRuntimeQuery[];
  datasources: FoundryRuntimeDatasource[];
  bootstrappedAt?: string;
}): FoundryRuntimeBootstrap {
  return {
    deploymentId: params.deploymentId,
    applicationId: params.applicationId,
    runtimePath: params.runtimePath,
    pages: params.pages.map((page) => ({
      ...page,
      widgetIds: [...page.widgetIds],
    })),
    queries: params.queries.map((query) => ({ ...query })),
    datasources: params.datasources.map((datasource) => ({ ...datasource })),
    bootstrappedAt: params.bootstrappedAt ?? new Date().toISOString(),
  };
}

export function createFoundryRuntimeSession(params: {
  deploymentId: string;
  principalId: string;
  initialPageId: string;
  sessionId?: string;
  createdAt?: string;
}): FoundryRuntimeSession {
  return {
    sessionId: params.sessionId ?? generateId("runtime_session"),
    deploymentId: params.deploymentId,
    principalId: params.principalId,
    currentPageId: params.initialPageId,
    openedModalIds: [],
    activeTabIds: [],
    submittedWidgetIds: [],
    createdAt: params.createdAt ?? new Date().toISOString(),
  };
}

export function executeFoundryRuntimeAction(
  session: FoundryRuntimeSession,
  action: RuntimeAction
): FoundryRuntimeActionResult {
  const state = {
    currentPageId: session.currentPageId,
    openedModalIds: [...session.openedModalIds],
    activeTabIds: [...session.activeTabIds],
    executedActions: [] as string[],
  };

  executeAction(action, state);

  return {
    sessionId: session.sessionId,
    executedActions: state.executedActions,
    currentPageId: state.currentPageId,
    openedModalIds: state.openedModalIds,
    activeTabIds: state.activeTabIds,
    completedAt: new Date().toISOString(),
  };
}

function executeAction(
  action: RuntimeAction,
  state: {
    currentPageId: string;
    openedModalIds: string[];
    activeTabIds: string[];
    executedActions: string[];
  }
): void {
  switch (action.type) {
    case "submit-form":
      state.executedActions.push("submit-form");
      if (action.queryId) {
        state.executedActions.push("query.execute");
      }
      break;
    case "execute-query":
      state.executedActions.push("query.execute");
      break;
    case "navigate":
      state.executedActions.push("navigate");
      state.currentPageId = action.pageId;
      if (action.modalId) {
        state.openedModalIds.push(action.modalId);
        state.executedActions.push("modal.open");
      }
      break;
    case "open-modal":
      state.openedModalIds.push(action.modalId);
      state.executedActions.push("modal.open");
      break;
    case "set-tab":
      state.activeTabIds.push(action.tabId);
      state.executedActions.push("tab.set");
      break;
  }

  if (action.next) {
    executeAction(action.next, state);
  }
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
