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
  | 'SOCIAL_MEDIA'
  | 'EMAIL_BANNER'
  | 'TABLE_TENT'
  | 'ROLL_UP'
  | 'PRESS_WALL'
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
  SOCIAL_MEDIA: 'Ijtimoiy tarmoq',
  EMAIL_BANNER: 'Email banner',
  TABLE_TENT: 'Stol kartasi',
  ROLL_UP: 'Roll-up banner',
  PRESS_WALL: 'Press wall',
  NAME_TAG: 'Ism tag',
  SPONSOR_BANNER: 'Sponsor banner',
}
