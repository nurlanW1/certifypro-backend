export type EventStatus = "draft" | "active" | "archived";

export interface Event {
  id: string;
  userId: string;
  name: string;
  type: string;
  organizationName: string | null;
  date: string | null;
  location: string | null;
  description: string | null;
  language: string | null;
  participantEstimate: number | null;
  status: EventStatus;
  builderState: Record<string, unknown>;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventProduct {
  id: string;
  eventId: string;
  productType: string;
  enabled: boolean;
  status: string;
  formData: Record<string, unknown>;
  templateId: string | null;
  designDraftId: string | null;
  previewThumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
