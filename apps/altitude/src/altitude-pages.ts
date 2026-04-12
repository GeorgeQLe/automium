import type { Page } from "./altitude-domain";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createPage(params: {
  projectId: string;
  title: string;
  content?: string;
}): Page {
  return {
    pageId: generateId("page"),
    projectId: params.projectId,
    title: params.title,
    content: params.content,
    createdAt: new Date().toISOString(),
  };
}
