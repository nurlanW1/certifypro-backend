import type { EventSetup } from "@/lib/event-create/event-setup"
import type { CategoryFormData } from "@/lib/event-create/types"
import { assetDataUrlFromFormValue, hasFormAsset } from "@/lib/uploads/serialize"

export type EventPreviewData = {
  materialId: string
  eventName: string
  headline: string
  subtitle: string
  fullName: string
  organization: string
  position: string
  date: string
  venue: string
  bodyText: string
  participantType: string
  hashtag: string
  cta: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoDataUrl?: string
  secondaryLogoDataUrl?: string
  sponsorLogoDataUrl?: string
  partnerLogoDataUrl?: string
  qrCode: string
  signature1: string
  signature2: string
  signature1DataUrl?: string
  signature2DataUrl?: string
  stampDataUrl?: string
  photoDataUrl?: string
  backgroundDataUrl?: string
  hasStamp: boolean
  hasPhoto: boolean
  programSessions: Record<string, string>[]
}

function str(data: CategoryFormData, key: string, fallback = ""): string {
  const v = data[key]
  return typeof v === "string" && v.trim() ? v.trim() : fallback
}

function sessions(data: CategoryFormData): Record<string, string>[] {
  const v = data.sessions
  if (!Array.isArray(v)) return []
  return v.filter((row): row is Record<string, string> => typeof row === "object" && row !== null)
}

/** Normalize event-builder form values + event setup into a unified preview model */
export function mapToPreviewData(
  materialId: string,
  data: CategoryFormData,
  setup: EventSetup | null
): EventPreviewData {
  const setupName = setup?.eventName ?? ""
  const setupOrg = setup?.organizationName ?? ""
  const setupDate = setup?.eventDate ?? ""
  const setupVenue = setup?.eventLocation ?? ""

  const firstName = str(data, "firstName")
  const lastName = str(data, "lastName")
  const recipientName = str(data, "recipientName")
  const fullNameFromParts = [firstName, lastName].filter(Boolean).join(" ")

  const fullName =
    recipientName ||
    fullNameFromParts ||
    str(data, "fullName") ||
    str(data, "guestName") ||
    "Ism Familiya"

  const eventName = str(data, "eventName", setupName || "Tadbir nomi")
  const date = str(data, "date") || str(data, "eventDate", setupDate || "2026-05-29")
  const organization = str(data, "organization", setupOrg || "Tashkilot")
  const venue = str(data, "venue") || str(data, "location", setupVenue)

  const certificateTitle = str(data, "certificateTitle", "Ishtirok sertifikati")
  const certificateText = str(data, "certificateText", "Ushbu sertifikat tasdiqlaydiki...")

  return {
    materialId,
    eventName,
    headline: str(data, "headline") || str(data, "title") || str(data, "mainTitle") || eventName,
    subtitle: str(data, "subheadline") || certificateTitle || str(data, "subtitle", "Professional tadbir"),
    fullName,
    organization,
    position: str(data, "position", "Lavozim"),
    date,
    venue,
    bodyText:
      str(data, "bodyText") ||
      str(data, "certificateText") ||
      str(data, "invitationText") ||
      str(data, "caption") ||
      certificateText,
    participantType: str(data, "participantType", "Delegat"),
    hashtag: str(data, "hashtag", "#GildiaEvent"),
    cta: str(data, "cta", "Ro‘yxatdan o‘ting"),
    primaryColor: setup?.brandColors.primary ?? "#0a1628",
    secondaryColor: setup?.brandColors.secondary ?? "#2563eb",
    accentColor: setup?.brandColors.accent ?? "#3b82f6",
    logoDataUrl:
      setup?.mainLogo?.dataUrl ||
      assetDataUrlFromFormValue(data.logo) ||
      assetDataUrlFromFormValue(data.coverLogo),
    secondaryLogoDataUrl:
      setup?.secondaryLogos?.[0]?.dataUrl || assetDataUrlFromFormValue(data.secondaryLogo),
    sponsorLogoDataUrl: assetDataUrlFromFormValue(data.sponsorLogos) || assetDataUrlFromFormValue(data.sponsorLogo),
    partnerLogoDataUrl: assetDataUrlFromFormValue(data.partnerLogo) || assetDataUrlFromFormValue(data.partnerLogos),
    qrCode: str(data, "qrCode", "https://gildia.uz"),
    signature1: str(data, "signature1", "Imzo 1"),
    signature2: str(data, "signature2", "Imzo 2"),
    signature1DataUrl: assetDataUrlFromFormValue(data.signature1),
    signature2DataUrl: assetDataUrlFromFormValue(data.signature2),
    stampDataUrl: assetDataUrlFromFormValue(data.stamp),
    photoDataUrl: assetDataUrlFromFormValue(data.photo),
    backgroundDataUrl: assetDataUrlFromFormValue(data.background) || assetDataUrlFromFormValue(data.backgroundImage),
    hasStamp: hasFormAsset(data.stamp),
    hasPhoto: hasFormAsset(data.photo),
    programSessions: sessions(data),
  }
}

export function aspectForMaterial(materialId: string): string {
  switch (materialId) {
    case "badge":
    case "business-card":
    case "name-tag":
      return "aspect-[1.6/1]"
    case "rollup":
    case "press-wall":
    case "stage-backdrop":
    case "led-screen":
      return "aspect-[3/5]"
    case "social-post":
    case "instagram-story":
    case "opening-slide":
      return "aspect-video"
    case "flyer":
    case "poster":
      return "aspect-[3/4]"
    default:
      return "aspect-[4/3]"
  }
}
