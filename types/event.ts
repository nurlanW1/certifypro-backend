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
}

export interface Event extends EventFormData {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
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
