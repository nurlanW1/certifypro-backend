export type DesignDraftStatus = "draft" | "saved" | "archived";

export interface DesignDraft {
  id: string;
  userId: string;
  eventId: string | null;
  eventProductId: string | null;
  productType: string;
  title: string;
  canvasData: unknown;
  thumbnailUrl: string | null;
  status: DesignDraftStatus;
  version: number;
  deletedAt: string | null;
  lastEditedAt: string;
  createdAt: string;
  updatedAt: string;
}
