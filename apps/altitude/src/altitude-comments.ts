import type { Comment } from "./altitude-domain";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createComment(params: {
  workItemId: string;
  authorId: string;
  body: string;
}): Comment {
  return {
    commentId: generateId("com"),
    workItemId: params.workItemId,
    authorId: params.authorId,
    body: params.body,
    createdAt: new Date().toISOString(),
  };
}
