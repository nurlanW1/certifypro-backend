export type EventType =
  | 'CONFERENCE'
  | 'SEMINAR'
  | 'FORUM'
  | 'WORKSHOP'
  | 'CORPORATE'
  | 'SCIENTIFIC'
  | 'EDUCATIONAL'
  | 'OTHER'

export type MaterialCategory =
  | 'CERTIFICATE'
  | 'BADGE'
  | 'INVITATION'
  | 'FLYER'
  | 'POSTER'
  | 'SCIENTIFIC_POSTER'
  | 'PROGRAM_BOOK'
  | 'ROLL_UP'
  | 'PRESS_WALL'
  | 'STAGE_BACKDROP'
  | 'LED_SCREEN'
  | 'TABLE_TENT'
  | 'NAVIGATION'
  | 'SOCIAL_MEDIA'
  | 'EMAIL_BANNER'
  | 'SOUVENIR'
  | 'NAME_TAG'
  | 'SPONSOR_BANNER'

export interface EventFormData {
  name: string
  type: EventType
  date: string
  location: string
  organization: string
  language: 'uz' | 'ru' | 'en'
  primaryColor: string
  accentColor: string
  logoUrl?: string
  participantCount?: number
  brandingKit?: BrandingKitId
}

export type MaterialStatus = 'PENDING' | 'IN_PROGRESS' | 'READY'

export type BrandingKitId = 'CLASSIC' | 'MODERN' | 'ACADEMIC' | 'CORPORATE'

export const BRANDING_KIT_LABELS: Record<BrandingKitId, string> = {
  CLASSIC: 'Klassik',
  MODERN: 'Zamonaviy',
  ACADEMIC: 'Ilmiy',
  CORPORATE: 'Korporativ',
}

export interface EventMaterial {
  id: string
  category: MaterialCategory
  status: MaterialStatus
  designId?: string
  createdAt: string
  updatedAt: string
}

export interface Event extends EventFormData {
  id: string
  userId: string
  brandingKit?: BrandingKitId
  createdAt: string
  updatedAt: string
  materialCount?: number
  materials?: EventMaterial[]
}

export const MATERIAL_STATUS_LABELS: Record<MaterialStatus, string> = {
  PENDING: 'Kutilmoqda',
  IN_PROGRESS: 'Jarayonda',
  READY: 'Tayyor',
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  CONFERENCE: 'Konferentsiya',
  SEMINAR: 'Seminar',
  FORUM: 'Forum',
  WORKSHOP: 'Masterklass',
  CORPORATE: 'Korporativ tadbir',
  SCIENTIFIC: 'Ilmiy tadbir',
  EDUCATIONAL: "Ta'lim tadbirlari",
  OTHER: 'Boshqa',
}

export const MATERIAL_LABELS: Record<MaterialCategory, string> = {
  CERTIFICATE: 'Sertifikat',
  BADGE: 'Nishon (Badge)',
  INVITATION: 'Taklifnoma',
  FLYER: 'Flayer',
  POSTER: 'Poster',
  SCIENTIFIC_POSTER: 'Ilmiy poster',
  PROGRAM_BOOK: 'Dastur kitobchasi',
  ROLL_UP: 'Roll-up banner',
  PRESS_WALL: 'Press wall',
  STAGE_BACKDROP: 'Sahna fon',
  LED_SCREEN: 'LED ekran',
  TABLE_TENT: 'Stol kartasi',
  NAVIGATION: 'Navigatsiya',
  SOCIAL_MEDIA: 'Ijtimoiy tarmoq',
  EMAIL_BANNER: 'Email banner',
  SOUVENIR: 'Suvenir',
  NAME_TAG: 'Ism tag',
  SPONSOR_BANNER: 'Sponsor banner',
}
