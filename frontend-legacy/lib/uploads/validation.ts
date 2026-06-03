import type { UploadKind, UploadValidationResult } from "@/lib/uploads/types"

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"]
const EXCEL_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
]
const EXCEL_EXT = [".xlsx", ".xls", ".csv"]

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_EXCEL_BYTES = 10 * 1024 * 1024

export function acceptForKind(kind: UploadKind): string {
  switch (kind) {
    case "excel":
      return ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
    case "signature":
    case "stamp":
      return "image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
    default:
      return "image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
  }
}

export function validateUploadFile(file: File, kind: UploadKind): UploadValidationResult {
  const name = file.name.toLowerCase()

  if (kind === "excel") {
    const okType =
      EXCEL_TYPES.includes(file.type) || EXCEL_EXT.some((ext) => name.endsWith(ext))
    if (!okType) {
      return { ok: false, message: "Faqat .xlsx, .xls yoki .csv fayllar qabul qilinadi" }
    }
    if (file.size > MAX_EXCEL_BYTES) {
      return { ok: false, message: "Excel fayl hajmi 10 MB dan oshmasligi kerak" }
    }
    return { ok: true }
  }

  const okImage =
    IMAGE_TYPES.includes(file.type) ||
    /\.(png|jpe?g|webp|svg)$/i.test(name) ||
    (kind !== "participant_photo" && file.type === "application/pdf")

  if (!okImage) {
    return { ok: false, message: "Faqat rasm fayllari (PNG, JPG, WEBP, SVG) qabul qilinadi" }
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: "Rasm hajmi 5 MB dan oshmasligi kerak" }
  }

  return { ok: true }
}
