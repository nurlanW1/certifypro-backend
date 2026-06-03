import type { LucideIcon } from "lucide-react"
import {
  AlignLeft,
  AtSign,
  Award,
  CreditCard,
  FileText,
  Image,
  Layout,
  Mail,
  Share2,
  Star,
  Tag,
  Triangle,
} from "lucide-react"

import { getCatalogItem } from "@/lib/event-create/catalog"

export type WizardMaterialConfig = {
  catalogId: string
  label: string
  description: string
  icon: LucideIcon
  isPremium: boolean
}

export const WIZARD_MATERIALS: WizardMaterialConfig[] = [
  {
    catalogId: "certificate",
    label: "Sertifikat",
    description: "Ishtirokchilar uchun rasmiy sertifikat",
    icon: Award,
    isPremium: false,
  },
  {
    catalogId: "badge",
    label: "Nishon (Badge)",
    description: "Tadbir kunida kiyiladigan ishtirokchi nishoni",
    icon: CreditCard,
    isPremium: false,
  },
  {
    catalogId: "invitation",
    label: "Taklifnoma",
    description: "QR kodli rasmiy taklifnoma",
    icon: Mail,
    isPremium: false,
  },
  {
    catalogId: "flyer",
    label: "Flayer",
    description: "A5 formatdagi tadbir flyeri",
    icon: FileText,
    isPremium: false,
  },
  {
    catalogId: "poster",
    label: "Poster",
    description: "A3/A2 formatdagi tadbir posteri",
    icon: Image,
    isPremium: false,
  },
  {
    catalogId: "social-post",
    label: "Ijtimoiy tarmoq",
    description: "Instagram, Telegram postlari",
    icon: Share2,
    isPremium: false,
  },
  {
    catalogId: "email-banner",
    label: "Email banner",
    description: "Email xabarlar uchun banner",
    icon: AtSign,
    isPremium: false,
  },
  {
    catalogId: "table-tent",
    label: "Stol kartasi",
    description: "Stol raqami va ism kartasi",
    icon: Triangle,
    isPremium: false,
  },
  {
    catalogId: "rollup",
    label: "Roll-up banner",
    description: "85x200 cm formatdagi banner",
    icon: AlignLeft,
    isPremium: true,
  },
  {
    catalogId: "press-wall",
    label: "Press wall",
    description: "Fotosessiya uchun orqa fon",
    icon: Layout,
    isPremium: true,
  },
  {
    catalogId: "name-tag",
    label: "Ism tag",
    description: "Stol ustiga qo'yiladigan ism kartasi",
    icon: Tag,
    isPremium: true,
  },
  {
    catalogId: "sponsor-banner",
    label: "Sponsor banner",
    description: "Sponsor logolari uchun banner",
    icon: Star,
    isPremium: true,
  },
]

export const DEFAULT_WIZARD_MATERIAL_IDS = [
  "certificate",
  "badge",
  "invitation",
  "flyer",
  "social-post",
]

export const ALL_WIZARD_MATERIAL_IDS = WIZARD_MATERIALS.map((m) => m.catalogId)

export function wizardMaterialLabel(catalogId: string): string {
  return getCatalogItem(catalogId)?.name ?? catalogId
}
