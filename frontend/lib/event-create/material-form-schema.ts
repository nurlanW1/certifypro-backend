import { preset } from "@/lib/event-create/field-presets"
import type { CatalogField, CategoryFormData } from "@/lib/event-create/types"

/** Conditional visibility for dynamic sections (e.g. Program Book excel vs manual) */
export type MaterialFieldCondition = {
  key: string
  value: string
}

export type MaterialFormField = CatalogField & {
  showWhen?: MaterialFieldCondition
  /** Grid column span in 2-col layout */
  colSpan?: 1 | 2
}

export type MaterialFormSchema = {
  materialId: string
  label: string
  fields: MaterialFormField[]
}

const F = {
  text: (
    key: string,
    label: string,
    opts?: Partial<MaterialFormField>
  ): MaterialFormField => ({ key, label, type: "text", ...opts }),
  textarea: (
    key: string,
    label: string,
    opts?: Partial<MaterialFormField>
  ): MaterialFormField => ({ key, label, type: "textarea", colSpan: 2, ...opts }),
  date: (key: string, label: string, opts?: Partial<MaterialFormField>): MaterialFormField => ({
    key,
    label,
    type: "date",
    ...opts,
  }),
  time: (key: string, label: string, opts?: Partial<MaterialFormField>): MaterialFormField => ({
    key,
    label,
    type: "time",
    ...opts,
  }),
  file: (key: string, label: string, opts?: Partial<MaterialFormField>): MaterialFormField => ({
    key,
    label,
    type: "file",
    ...opts,
  }),
  url: (key: string, label: string, opts?: Partial<MaterialFormField>): MaterialFormField => ({
    key,
    label,
    type: "url",
    ...opts,
  }),
  select: (
    key: string,
    label: string,
    options: string[],
    opts?: Partial<MaterialFormField>
  ): MaterialFormField => ({ key, label, type: "select", options, ...opts }),
  excel: (key: string, label: string, opts?: Partial<MaterialFormField>): MaterialFormField => ({
    key,
    label,
    type: "excel",
    hint: ".xlsx, .xls, .csv",
    ...opts,
  }),
  repeater: (
    key: string,
    label: string,
    repeaterFields: CatalogField[],
    opts?: Partial<MaterialFormField>
  ): MaterialFormField => ({ key, label, type: "repeater", repeaterFields, colSpan: 2, ...opts }),
}

const PROGRAM_SESSION_FIELDS: CatalogField[] = [
  { key: "date", label: "Sana", type: "date" },
  { key: "startTime", label: "Boshlanish vaqti", type: "time" },
  { key: "endTime", label: "Tugash vaqti", type: "time" },
  { key: "sessionTitle", label: "Sessiya nomi", type: "text", required: true },
  { key: "topic", label: "Mavzu", type: "text" },
  { key: "speaker", label: "Spiker", type: "text" },
  { key: "moderator", label: "Moderator", type: "text" },
  { key: "hall", label: "Zal", type: "text" },
  { key: "notes", label: "Izohlar", type: "textarea" },
]

const INPUT_MODE_EXCEL = "Excel yuklash"
const INPUT_MODE_MANUAL = "Qo‘lda jadval"

/** Detailed schemas for priority event materials */
export const MATERIAL_FORM_SCHEMAS: Record<string, MaterialFormSchema> = {
  certificate: {
    materialId: "certificate",
    label: "Sertifikat",
    fields: [
      F.text("recipientName", "Qabul qiluvchi ismi", { required: true, placeholder: "Ism Familiya" }),
      F.text("certificateTitle", "Sertifikat sarlavhasi", {
        required: true,
        placeholder: "Ishtirok sertifikati",
      }),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.textarea("certificateText", "Sertifikat matni", {
        placeholder: "Ushbu sertifikat tasdiqlaydiki...",
      }),
      F.date("date", "Sana", { required: true }),
      F.file("logo", "Logo"),
      F.file("signature1", "Imzo 1"),
      F.file("signature2", "Imzo 2"),
      F.file("stamp", "Muhr"),
      F.url("qrCode", "QR kod", { placeholder: "https://gildia.uz/verify/..." }),
    ],
  },
  badge: {
    materialId: "badge",
    label: "Badge (Bejik)",
    fields: [
      F.text("firstName", "Ism", { required: true }),
      F.text("lastName", "Familiya", { required: true }),
      F.text("position", "Lavozim"),
      F.text("organization", "Tashkilot", { required: true }),
      F.select("participantType", "Ishtirokchi turi", [
        "Delegat",
        "Spiker",
        "VIP",
        "Press",
        "Organizator",
        "Homiy",
      ], { required: true }),
      F.file("photo", "Rasm (3×4)", { hint: "JPG, PNG" }),
      F.url("qrCode", "QR kod", { placeholder: "https://..." }),
    ],
  },
  invitation: {
    materialId: "invitation",
    label: "Taklifnoma",
    fields: [
      F.text("guestName", "Mehmon ismi", { required: true }),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.date("eventDate", "Tadbir sanasi", { required: true }),
      F.time("eventTime", "Vaqt"),
      F.text("venue", "Manzil", { required: true }),
      F.text("dressCode", "Dress code", { placeholder: "Business formal" }),
      F.textarea("invitationText", "Taklifnoma matni", { colSpan: 2 }),
      F.file("logo", "Logo"),
      F.url("rsvpUrl", "RSVP havola"),
    ],
  },
  flyer: {
    materialId: "flyer",
    label: "Flyer",
    fields: [
      F.text("headline", "Sarlavha", { required: true, colSpan: 2 }),
      F.text("subheadline", "Pastki sarlavha"),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.date("eventDate", "Sana", { required: true }),
      F.text("location", "Joylashuv"),
      F.text("cta", "Chaqiruv (CTA)", { placeholder: "Ro‘yxatdan o‘ting" }),
      F.textarea("bodyText", "Asosiy matn", { colSpan: 2 }),
      F.file("logo", "Logo"),
    ],
  },
  poster: {
    materialId: "poster",
    label: "Poster",
    fields: [
      F.text("headline", "Sarlavha", { required: true, colSpan: 2 }),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.date("eventDate", "Sana", { required: true }),
      F.text("venue", "Joylashuv"),
      F.textarea("keySpeakers", "Asosiy spikerlar", { placeholder: "Har bir qator — bitta ism" }),
      F.select("size", "Format", ["A4", "A3", "A2", "A1", "A0", "Custom"]),
      F.file("logo", "Logo"),
      F.textarea("additionalInfo", "Qo‘shimcha matn", { colSpan: 2 }),
    ],
  },
  "program-book": {
    materialId: "program-book",
    label: "Program Book",
    fields: [
      F.select("inputMode", "Ma’lumot kiritish usuli", [INPUT_MODE_EXCEL, INPUT_MODE_MANUAL], {
        required: true,
        colSpan: 2,
      }),
      F.excel("excelFile", "Excel fayl yuklash", {
        showWhen: { key: "inputMode", value: INPUT_MODE_EXCEL },
        colSpan: 2,
      }),
      F.repeater("sessions", "Dastur jadvali (qo‘lda)", PROGRAM_SESSION_FIELDS, {
        showWhen: { key: "inputMode", value: INPUT_MODE_MANUAL },
      }),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.file("logo", "Muqova logotipi"),
    ],
  },
  rollup: {
    materialId: "rollup",
    label: "Roll-up banner",
    fields: [
      F.text("headline", "Sarlavha", { required: true, colSpan: 2 }),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.text("subtext", "Qo‘shimcha matn"),
      F.select("size", "O‘lcham", ["85×200 cm", "100×200 cm", "120×200 cm", "Custom"]),
      F.file("logo", "Logo"),
      F.textarea("sponsors", "Homiylar (logotiplar ro‘yxati)", {
        placeholder: "Har bir qator — homiy nomi",
      }),
    ],
  },
  "press-wall": {
    materialId: "press-wall",
    label: "Press Wall",
    fields: [
      F.text("title", "Sarlavha", { required: true }),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.file("logo", "Asosiy logo"),
      F.file("sponsorLogos", "Homiy logotiplari", { hint: "Bir yoki bir nechta fayl" }),
      F.textarea("partnerNames", "Hamkorlar ro‘yxati"),
      F.select("size", "O‘lcham", ["3×2 m", "4×2.5 m", "5×3 m", "Custom"]),
    ],
  },
  "stage-backdrop": {
    materialId: "stage-backdrop",
    label: "Stage Backdrop",
    fields: [
      F.text("mainTitle", "Asosiy sarlavha", { required: true, colSpan: 2 }),
      F.text("subtitle", "Subtitr"),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.select("size", "O‘lcham", ["6×3 m", "8×4 m", "10×4 m", "Custom"]),
      F.file("logo", "Logo"),
      F.textarea("sponsorLine", "Homiylar qatori", { placeholder: "Pastki qator matni" }),
    ],
  },
  "social-post": {
    materialId: "social-post",
    label: "Ijtimoiy tarmoq posti",
    fields: [
      F.text("headline", "Sarlavha", { required: true, colSpan: 2 }),
      F.text("eventName", "Tadbir nomi", { required: true }),
      F.date("postDate", "Post sanasi"),
      F.select("platform", "Platforma", [
        "Instagram",
        "Facebook",
        "LinkedIn",
        "Telegram",
        "Twitter / X",
      ]),
      F.text("hashtag", "Hashtag", { placeholder: "#GildiaForum2026" }),
      F.text("cta", "Chaqiruv (CTA)"),
      F.file("logo", "Logo"),
      F.textarea("caption", "Post matni (caption)", { colSpan: 2 }),
    ],
  },
}

/** Catalog id → preset key for materials without a dedicated schema */
const PRESET_FALLBACK: Record<string, keyof typeof preset> = {
  diploma: "diploma",
  "thanks-letter": "thanks",
  "business-card": "businessCard",
  "scientific-poster": "scientificPoster",
  proceedings: "proceedings",
  catalog: "catalogDoc",
  "report-book": "reportBook",
  "photo-album": "photoAlbum",
  "participant-folder": "folder",
  "conference-logo": "conferenceLogo",
  led: "led",
  "opening-slide": "openingSlide",
  powerpoint: "powerpoint",
  "table-tent": "tableTent",
  navigation: "navigation",
  "registration-desk": "registrationDesk",
  "qr-card": "qrCard",
  "sponsor-banner": "sponsorBanner",
  "partner-banner": "partnerBanner",
  "instagram-story": "instagramStory",
  "telegram-banner": "telegramBanner",
  "linkedin-banner": "linkedinBanner",
  "email-banner": "emailBanner",
  "press-kit": "pressKit",
  "video-intro": "videoIntro",
  "video-outro": "videoOutro",
  "lower-thirds": "lowerThirds",
  "brand-book": "brandBook",
  "color-system": "colorSystem",
  typography: "typographyGuide",
  letterhead: "letterhead",
  envelope: "envelope",
  "diploma-cover": "diplomaCover",
  "cert-folder": "certFolder",
  souvenirs: "souvenirs",
  stickers: "stickers",
  "name-tag": "nameTag",
  "final-report": "finalReport",
  "photo-catalog": "photoCatalog",
  "video-presentation": "videoPresentation",
}

const SCHEMA_MATERIAL_IDS = Object.keys(MATERIAL_FORM_SCHEMAS)

export function getMaterialFormSchema(materialId: string): MaterialFormSchema | null {
  return MATERIAL_FORM_SCHEMAS[materialId] ?? null
}

export function resolveMaterialFields(materialId: string): CatalogField[] {
  const schema = MATERIAL_FORM_SCHEMAS[materialId]
  if (schema) return schema.fields

  const presetKey = PRESET_FALLBACK[materialId]
  if (presetKey && preset[presetKey]) return preset[presetKey]

  return []
}

export function isConfiguredMaterial(materialId: string): boolean {
  return SCHEMA_MATERIAL_IDS.includes(materialId)
}

export function getMaterialFormDefaults(
  materialId: string,
  eventContext?: {
    eventName?: string
    eventDate?: string
    organizationName?: string
    eventLocation?: string
  }
): CategoryFormData {
  const defaults: CategoryFormData = {}

  if (materialId === "program-book") {
    defaults.inputMode = INPUT_MODE_MANUAL
    defaults.sessions = [{}]
  }

  if (!eventContext) return defaults

  const fields = resolveMaterialFields(materialId)
  const setIfExists = (key: string, value: string) => {
    if (fields.some((f) => f.key === key) && value) defaults[key] = value
  }

  setIfExists("eventName", eventContext.eventName ?? "")
  setIfExists("eventDate", eventContext.eventDate ?? "")
  setIfExists("date", eventContext.eventDate ?? "")
  setIfExists("organization", eventContext.organizationName ?? "")
  setIfExists("venue", eventContext.eventLocation ?? "")
  setIfExists("location", eventContext.eventLocation ?? "")

  return defaults
}

export function listConfiguredMaterials(): MaterialFormSchema[] {
  return SCHEMA_MATERIAL_IDS.map((id) => MATERIAL_FORM_SCHEMAS[id])
}
