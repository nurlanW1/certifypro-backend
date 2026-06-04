import type { BrandingKitId, EventType, MaterialCategory } from '@/types/event'

export interface WizardStepConfig {
  id: number
  title: string
  description: string
  icon: 'Calendar' | 'Palette' | 'Layout' | 'Package' | 'ClipboardList' | 'Rocket'
}

export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 1,
    title: 'Tadbir haqida',
    description: "Asosiy ma'lumotlarni kiriting",
    icon: 'Calendar',
  },
  {
    id: 2,
    title: 'Brending',
    description: 'Logo va ranglarni sozlang',
    icon: 'Palette',
  },
  {
    id: 3,
    title: 'Materiallar',
    description: 'Kerakli turlarni tanlang',
    icon: 'Layout',
  },
  {
    id: 4,
    title: 'Brending to‘plami',
    description: 'Umumiy uslubni tanlang',
    icon: 'Package',
  },
  {
    id: 5,
    title: 'Ko‘rib chiqish',
    description: 'Xulosani tekshiring',
    icon: 'ClipboardList',
  },
  {
    id: 6,
    title: 'Ishga tushirish',
    description: 'Tadbir markazini yarating',
    icon: 'Rocket',
  },
]

export interface BrandingKitOption {
  id: BrandingKitId
  label: string
  description: string
  primaryColor: string
  accentColor: string
}

export const BRANDING_KIT_OPTIONS: BrandingKitOption[] = [
  {
    id: 'CLASSIC',
    label: 'Klassik',
    description: 'Rasmiy konferentsiyalar uchun',
    primaryColor: '#059669',
    accentColor: '#134E4A',
  },
  {
    id: 'MODERN',
    label: 'Zamonaviy',
    description: 'Minimal va zamonaviy',
    primaryColor: '#0F766E',
    accentColor: '#134E4A',
  },
  {
    id: 'ACADEMIC',
    label: 'Ilmiy',
    description: 'Ilmiy tadbirlar va universitetlar',
    primaryColor: '#1E40AF',
    accentColor: '#1E3A8A',
  },
  {
    id: 'CORPORATE',
    label: 'Korporativ',
    description: 'Biznes va korporativ tadbirlar',
    primaryColor: '#374151',
    accentColor: '#111827',
  },
]

export interface EventTypeOption {
  value: EventType
  label: string
  icon: string
  iconClass: string
}

export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  {
    value: 'CONFERENCE',
    label: 'Konferentsiya',
    icon: 'Users',
    iconClass: 'bg-brand-100 text-brand-600',
  },
  {
    value: 'SEMINAR',
    label: 'Seminar',
    icon: 'BookOpen',
    iconClass: 'bg-success-light text-success-dark',
  },
  {
    value: 'FORUM',
    label: 'Forum',
    icon: 'MessageSquare',
    iconClass: 'bg-warning-light text-warning-dark',
  },
  {
    value: 'WORKSHOP',
    label: 'Masterklass',
    icon: 'Wrench',
    iconClass: 'bg-danger-light text-danger-dark',
  },
  {
    value: 'CORPORATE',
    label: 'Korporativ',
    icon: 'Building2',
    iconClass: 'bg-brand-100 text-brand-800',
  },
  {
    value: 'SCIENTIFIC',
    label: 'Ilmiy',
    icon: 'FlaskConical',
    iconClass: 'bg-success-light text-success',
  },
  {
    value: 'EDUCATIONAL',
    label: "Ta'lim",
    icon: 'GraduationCap',
    iconClass: 'bg-warning-light text-warning',
  },
  {
    value: 'OTHER',
    label: 'Boshqa',
    icon: 'MoreHorizontal',
    iconClass: 'bg-surface-tertiary text-text-muted',
  },
]

export interface PresetColor {
  name: string
  value: string
  swatchClass: string
}

export const PRESET_COLORS: PresetColor[] = [
  { name: 'Zumrad', value: '#059669', swatchClass: 'bg-brand-600' },
  { name: "Ko'k", value: '#2563EB', swatchClass: 'bg-blue-600' },
  { name: 'Yashil', value: '#059669', swatchClass: 'bg-emerald-600' },
  { name: "To'q yashil", value: '#0F766E', swatchClass: 'bg-teal-700' },
  { name: 'Qizil', value: '#DC2626', swatchClass: 'bg-red-600' },
  { name: "To'q sariq", value: '#D97706', swatchClass: 'bg-amber-600' },
  { name: 'Pushti', value: '#DB2777', swatchClass: 'bg-pink-600' },
  { name: 'Qora', value: '#1F2937', swatchClass: 'bg-gray-800' },
]

export const LANGUAGE_OPTIONS = [
  { value: 'uz' as const, label: "O'zbek", flag: '🇺🇿' },
  { value: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
  { value: 'en' as const, label: 'English', flag: '🇬🇧' },
]

export interface MaterialOption {
  category: MaterialCategory
  label: string
  description: string
  icon: string
  isPremium: boolean
}

export const WIZARD_MATERIALS: MaterialOption[] = [
  {
    category: 'CERTIFICATE',
    label: 'Sertifikat',
    description: 'Ishtirokchilar uchun rasmiy sertifikat',
    icon: 'Award',
    isPremium: false,
  },
  {
    category: 'BADGE',
    label: 'Nishon (Badge)',
    description: 'Tadbir kunida kiyiladigan ishtirokchi nishoni',
    icon: 'CreditCard',
    isPremium: false,
  },
  {
    category: 'INVITATION',
    label: 'Taklifnoma',
    description: 'QR kodli rasmiy taklifnoma',
    icon: 'Mail',
    isPremium: false,
  },
  {
    category: 'FLYER',
    label: 'Flayer',
    description: 'A5 formatdagi tadbir flyeri',
    icon: 'FileText',
    isPremium: false,
  },
  {
    category: 'POSTER',
    label: 'Poster',
    description: 'A3/A2 formatdagi tadbir posteri',
    icon: 'Image',
    isPremium: false,
  },
  {
    category: 'SOCIAL_MEDIA',
    label: 'Ijtimoiy tarmoq',
    description: 'Instagram, Telegram postlari',
    icon: 'Share2',
    isPremium: false,
  },
  {
    category: 'EMAIL_BANNER',
    label: 'Email banner',
    description: 'Email xabarlar uchun banner',
    icon: 'AtSign',
    isPremium: false,
  },
  {
    category: 'TABLE_TENT',
    label: 'Stol kartasi',
    description: 'Stol raqami va ism kartasi',
    icon: 'Triangle',
    isPremium: false,
  },
  {
    category: 'ROLL_UP',
    label: 'Roll-up banner',
    description: '85x200 cm formatdagi banner',
    icon: 'AlignLeft',
    isPremium: true,
  },
  {
    category: 'PRESS_WALL',
    label: 'Press wall',
    description: 'Fotosessiya uchun orqa fon',
    icon: 'Layout',
    isPremium: true,
  },
  {
    category: 'NAME_TAG',
    label: 'Ism tag',
    description: "Stol ustiga qo'yiladigan ism kartasi",
    icon: 'Tag',
    isPremium: true,
  },
  {
    category: 'SPONSOR_BANNER',
    label: 'Sponsor banner',
    description: 'Sponsor logolari uchun banner',
    icon: 'Star',
    isPremium: true,
  },
]

export const DEFAULT_SELECTED_MATERIALS: MaterialCategory[] = [
  'CERTIFICATE',
  'BADGE',
  'INVITATION',
  'FLYER',
  'SOCIAL_MEDIA',
]

export const FREE_MATERIAL_CATEGORIES: MaterialCategory[] = WIZARD_MATERIALS.filter(
  (m) => !m.isPremium
).map((m) => m.category)

export const ALL_WIZARD_MATERIAL_CATEGORIES: MaterialCategory[] = WIZARD_MATERIALS.map(
  (m) => m.category
)
