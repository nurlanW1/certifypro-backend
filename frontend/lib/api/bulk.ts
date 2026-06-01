/** TODO: backend bulk endpoints — hozircha frontend wizard UI only */

export type BulkJobStatus = "pending" | "processing" | "completed" | "failed";

export type BulkJob = {
  id: string;
  status: BulkJobStatus;
  total: number;
  completed: number;
  errors?: Array<{ row: number; message: string }>;
};

export async function createBulkJob(payload: {
  templateId: string;
  fileId: string;
  columnMapping: Record<string, string>;
}) {
  void payload;
  // TODO: POST /api/bulk/jobs
  throw new Error("Bulk API not implemented yet");
}

export async function getBulkJob(jobId: string) {
  void jobId;
  // TODO: GET /api/bulk/jobs/:id
  throw new Error("Bulk API not implemented yet");
}

export async function getBulkSampleTemplateUrl() {
  // TODO: GET /api/bulk/sample-template
  return "/samples/participants-sample.xlsx";
}
