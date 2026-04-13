import type { FoundryPageType } from "./foundry-constants";
import type { FoundryPage } from "./foundry-domain";
import { createFoundryPage } from "./foundry-domain";

export function createPage(params: {
  applicationId: string;
  name: string;
  path: string;
  type?: FoundryPageType;
  order?: number;
  pageId?: string;
  createdAt?: string;
  updatedAt?: string;
}): FoundryPage {
  return createFoundryPage({
    ...params,
    type: params.type ?? "canvas",
    order: params.order ?? 0,
  });
}

export function reorderFoundryPages(
  pages: readonly FoundryPage[],
  orderedPageIds: readonly string[]
): FoundryPage[] {
  const orderById = new Map(
    orderedPageIds.map((pageId, index) => [pageId, index] as const)
  );

  return pages
    .map((page) => ({
      ...page,
      order: orderById.get(page.pageId) ?? page.order,
      updatedAt: new Date().toISOString(),
    }))
    .sort((left, right) => left.order - right.order);
}

export function setFoundryHomePage(
  pages: readonly FoundryPage[],
  pageId: string
): FoundryPage[] {
  return pages.map((page) => ({
    ...page,
    order: page.pageId === pageId ? 0 : Math.max(1, page.order),
    updatedAt: new Date().toISOString(),
  }));
}
