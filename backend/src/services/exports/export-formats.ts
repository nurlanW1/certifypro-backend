import type { ExportFormat } from "../../db/models";

export const EXPORT_FORMATS: ExportFormat[] = ["png", "jpg", "pdf", "svg"];

const FORMAT_MIMES: Record<ExportFormat, Set<string>> = {
  png: new Set(["image/png"]),
  jpg: new Set(["image/jpeg", "image/jpg"]),
  pdf: new Set(["application/pdf"]),
  svg: new Set(["image/svg+xml"]),
};

export function normalizeExportFormat(input: string): ExportFormat {
  const raw = input.trim().toLowerCase();
  const fmt = raw === "jpeg" ? "jpg" : raw;
  if ((EXPORT_FORMATS as string[]).includes(fmt)) {
    return fmt as ExportFormat;
  }
  throw new Error("EXPORT_INVALID_FORMAT");
}

export function assertMimeMatchesFormat(format: ExportFormat, mimeType: string): void {
  const allowed = FORMAT_MIMES[format];
  if (!allowed.has(mimeType.toLowerCase())) {
    throw new Error("EXPORT_MIME_MISMATCH");
  }
}

export function defaultMimeForFormat(format: ExportFormat): string {
  switch (format) {
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "pdf":
      return "application/pdf";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
