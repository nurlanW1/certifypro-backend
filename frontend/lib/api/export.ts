import { API_URL } from "./client";

export type ExportFormat = "png" | "jpg" | "pdf" | "svg" | "print-pdf" | "zip";

export type ExportOptions = {
  format: ExportFormat;
  quality?: "standard" | "high";
  watermark?: boolean;
  projectId?: string;
};

/** PDF generation — mavjud backend endpoint */
export async function generatePdf(payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/generate-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PDF export failed: ${res.status}`);
  return res.blob();
}

/** TODO: unified export endpoint for PNG/SVG/ZIP */
export async function exportProject(options: ExportOptions) {
  void options;
  throw new Error("Unified export API not implemented yet — use legacy editor or generatePdf");
}
