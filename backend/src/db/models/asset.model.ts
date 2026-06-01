export type AssetType =
  | "logo"
  | "signature"
  | "stamp"
  | "participant_photo"
  | "sponsor_logo"
  | "partner_logo"
  | "background_image"
  | "excel";

export interface UploadedAsset {
  id: string;
  userId: string;
  eventId: string | null;
  designDraftId: string | null;
  brandKitId: string | null;
  type: AssetType;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  size: number;
  storageKey: string | null;
  createdAt: string;
}

export interface BrandKit {
  id: string;
  userId: string;
  eventId: string | null;
  logos: unknown[];
  colors: unknown[];
  fonts: unknown[];
  signatures: unknown[];
  stamps: unknown[];
  createdAt: string;
  updatedAt: string;
}

export type { ExportFile, ExportFormat, ExportJobStatus, ExportStatus } from "./export.model";
