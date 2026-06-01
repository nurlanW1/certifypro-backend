export type UploadKind =
  | "logo"
  | "secondary_logo"
  | "signature"
  | "stamp"
  | "participant_photo"
  | "sponsor_logo"
  | "partner_logo"
  | "background"
  | "excel"
  | "generic_image"

export type StoredFormAsset = {
  v: 1
  kind: UploadKind
  name: string
  mimeType: string
  size: number
  dataUrl?: string
  uploadedAt: string
}

export type UploadResult = {
  asset: StoredFormAsset
  /** Parsed program sessions when kind is excel and CSV */
  sessions?: Record<string, string>[]
}

export type UploadValidationResult =
  | { ok: true }
  | { ok: false; message: string }
