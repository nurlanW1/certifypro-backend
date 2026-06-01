export type ExportFormat = "png" | "jpg" | "pdf" | "svg";
export type ExportStatus = "pending" | "processing" | "completed" | "failed";

export interface ExportFile {
  id: string;
  userId: string;
  designDraftId: string;
  format: ExportFormat;
  status: ExportStatus;
  fileUrl: string;
  storageKey: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExportJobStatus {
  id: string;
  designDraftId: string;
  format: ExportFormat;
  status: ExportStatus;
  fileUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}
