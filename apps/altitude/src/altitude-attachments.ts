import type { Attachment } from "./altitude-domain";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createAttachment(params: {
  workItemId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
}): Attachment {
  return {
    attachmentId: generateId("att"),
    workItemId: params.workItemId,
    fileName: params.fileName,
    fileSize: params.fileSize,
    mimeType: params.mimeType,
    uploadedBy: params.uploadedBy,
    createdAt: new Date().toISOString(),
  };
}
