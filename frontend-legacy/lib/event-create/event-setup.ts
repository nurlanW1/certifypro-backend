/** Event setup form — create flow (step 1) */

export const EVENT_TYPE_OPTIONS = [
  { value: "conference", label: "Konferensiya" },
  { value: "seminar", label: "Seminar" },
  { value: "forum", label: "Forum" },
  { value: "workshop", label: "Workshop" },
  { value: "corporate", label: "Korporativ tadbir" },
  { value: "scientific", label: "Ilmiy tadbir" },
  { value: "other", label: "Boshqa" },
] as const

export type EventType = (typeof EVENT_TYPE_OPTIONS)[number]["value"]

export const PARTICIPANT_ESTIMATE_OPTIONS = [
  { value: "5+", label: "5+ ishtirokchi" },
  { value: "10+", label: "10+ ishtirokchi" },
  { value: "50+", label: "50+ ishtirokchi" },
  { value: "100+", label: "100+ ishtirokchi" },
  { value: "500+", label: "500+ ishtirokchi" },
  { value: "1000+", label: "1000+ ishtirokchi" },
] as const

export type ParticipantEstimate = (typeof PARTICIPANT_ESTIMATE_OPTIONS)[number]["value"]

export const LANGUAGE_OPTIONS = [
  { value: "uz", label: "O‘zbek" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
  { value: "uz-en", label: "O‘zbek + English" },
] as const

export type EventLanguage = (typeof LANGUAGE_OPTIONS)[number]["value"]

export const FONT_OPTIONS = [
  { value: "inter", label: "Inter (zamonaviy)" },
  { value: "georgia", label: "Georgia (klassik)" },
  { value: "system", label: "System sans-serif" },
  { value: "serif", label: "Serif professional" },
] as const

export type FontPreference = (typeof FONT_OPTIONS)[number]["value"]

export type StoredUpload = {
  name: string
  size: number
  mimeType: string
  /** Session preview only — not for API persistence yet */
  dataUrl?: string
}

export type EventBrandColors = {
  primary: string
  secondary: string
  accent: string
}

export type EventSetup = {
  eventName: string
  eventType: EventType | ""
  organizationName: string
  eventDate: string
  eventLocation: string
  eventDescription: string
  mainLogo: StoredUpload | null
  secondaryLogos: StoredUpload[]
  brandColors: EventBrandColors
  fontPreference: FontPreference | ""
  language: EventLanguage | ""
  participantEstimate: ParticipantEstimate | ""
}

export const emptyEventSetup = (): EventSetup => ({
  eventName: "",
  eventType: "",
  organizationName: "",
  eventDate: "",
  eventLocation: "",
  eventDescription: "",
  mainLogo: null,
  secondaryLogos: [],
  brandColors: {
    primary: "#0a1628",
    secondary: "#2563eb",
    accent: "#3b82f6",
  },
  fontPreference: "inter",
  language: "uz",
  participantEstimate: "",
})

export function createEventId(): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `evt_${Date.now().toString(36)}_${rand}`
}

export async function fileToStoredUpload(file: File): Promise<StoredUpload> {
  const stored: StoredUpload = {
    name: file.name,
    size: file.size,
    mimeType: file.type,
  }
  if (file.type.startsWith("image/")) {
    stored.dataUrl = await readDataUrl(file)
  }
  return stored
}

export async function filesToStoredUploads(files: FileList): Promise<StoredUpload[]> {
  return Promise.all([...files].map(fileToStoredUpload))
}

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function setupToBasics(setup: EventSetup) {
  return {
    eventName: setup.eventName,
    eventDate: setup.eventDate,
    organization: setup.organizationName,
    venue: setup.eventLocation,
    description: setup.eventDescription,
    logoFileName: setup.mainLogo?.name,
  }
}
