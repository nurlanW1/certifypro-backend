import type { UploadKind } from "@/lib/uploads/types"

/** Map form field keys to upload asset kinds */
export function uploadKindForFieldKey(key: string, fieldType: "file" | "excel"): UploadKind {
  if (fieldType === "excel") return "excel"

  const map: Record<string, UploadKind> = {
    logo: "logo",
    mainLogo: "logo",
    coverLogo: "logo",
    sponsorLogos: "sponsor_logo",
    sponsorLogo: "sponsor_logo",
    sponsors: "sponsor_logo",
    partnerLogo: "partner_logo",
    partnerLogos: "partner_logo",
    signature: "signature",
    signature1: "signature",
    signature2: "signature",
    stamp: "stamp",
    photo: "participant_photo",
    participantPhoto: "participant_photo",
    background: "background",
    backgroundImage: "background",
    bgImage: "background",
    excelFile: "excel",
  }

  return map[key] ?? "generic_image"
}
