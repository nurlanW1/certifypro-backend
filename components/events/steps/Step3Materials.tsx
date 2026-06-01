'use client'

import { useState } from 'react'
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
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/store/eventStore'
import type { MaterialCategory } from '@/types/event'

const MATERIALS: {
  category: MaterialCategory
  label: string
  description: string
  icon: LucideIcon
  isPremium: boolean
}[] = [
  {
    category: 'CERTIFICATE',
    label: 'Sertifikat',
    description: 'Ishtirokchilar uchun rasmiy sertifikat',
    icon: Award,
    isPremium: false,
  },
  {
    category: 'BADGE',
    label: 'Nishon (Badge)',
    description: 'Tadbir kunida kiyiladigan ishtirokchi nishoni',
    icon: CreditCard,
    isPremium: false,
  },
  {
    category: 'INVITATION',
    label: 'Taklifnoma',
    description: 'QR kodli rasmiy taklifnoma',
    icon: Mail,
    isPremium: false,
  },
  {
    category: 'FLYER',
    label: 'Flayer',
    description: 'A5 formatdagi tadbir flyeri',
    icon: FileText,
    isPremium: false,
  },
  {
    category: 'POSTER',
    label: 'Poster',
    description: 'A3/A2 formatdagi tadbir posteri',
    icon: Image,
    isPremium: false,
  },
  {
    category: 'SOCIAL_MEDIA',
    label: 'Ijtimoiy tarmoq',
    description: 'Instagram, Telegram postlari',
    icon: Share2,
    isPremium: false,
  },
  {
    category: 'EMAIL_BANNER',
    label: 'Email banner',
    description: 'Email xabarlar uchun banner',
    icon: AtSign,
    isPremium: false,
  },
  {
    category: 'TABLE_TENT',
    label: 'Stol kartasi',
    description: 'Stol raqami va ism kartasi',
    icon: Triangle,
    isPremium: false,
  },
  {
    category: 'ROLL_UP',
    label: 'Roll-up banner',
    description: '85x200 cm formatdagi banner',
    icon: AlignLeft,
    isPremium: true,
  },
  {
    category: 'PRESS_WALL',
    label: 'Press wall',
    description: 'Fotosessiya uchun orqa fon',
    icon: Layout,
    isPremium: true,
  },
  {
    category: 'NAME_TAG',
    label: 'Ism tag',
    description: "Stol ustiga qo'yiladigan ism kartasi",
    icon: Tag,
    isPremium: true,
  },
  {
    category: 'SPONSOR_BANNER',
    label: 'Sponsor banner',
    description: 'Sponsor logolari uchun banner',
    icon: Star,
    isPremium: true,
  },
]

export function Step3Materials() {
  const {
    selectedMaterials,
    toggleMaterial,
    selectAllMaterials,
    clearMaterials,
  } = useEventStore()
  const [premiumModalOpen, setPremiumModalOpen] = useState(false)
  const [pendingPremium, setPendingPremium] = useState<MaterialCategory | null>(null)

  const allSelected =
    selectedMaterials.length === MATERIALS.length
  const freeCount = MATERIALS.filter(
    (m) => !m.isPremium && selectedMaterials.includes(m.category)
  ).length
  const premiumCount = MATERIALS.filter(
    (m) => m.isPremium && selectedMaterials.includes(m.category)
  ).length

  const handleToggle = (category: MaterialCategory, isPremium: boolean) => {
    const isOn = selectedMaterials.includes(category)
    if (!isOn && isPremium) {
      setPendingPremium(category)
      setPremiumModalOpen(true)
      return
    }
    toggleMaterial(category)
  }

  const confirmPremium = () => {
    if (pendingPremium) toggleMaterial(pendingPremium)
    setPendingPremium(null)
    setPremiumModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-secondary">
          Kerakli dizayn materiallarini tanlang
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => (allSelected ? clearMaterials() : selectAllMaterials())}
            className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-400"
          />
          Hammasini tanlash
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {MATERIALS.map(({ category, label, description, icon: Icon, isPremium }) => {
          const on = selectedMaterials.includes(category)
          return (
            <div
              key={category}
              className={cn(
                'gildia-card flex items-start gap-3 p-4 transition-all duration-150',
                on && 'border-brand-200 bg-brand-50/50'
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-text-primary">{label}</p>
                  {isPremium ? (
                    <Badge variant="premium" className="text-[10px]">
                      PRO
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px]">
                      Bepul
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-muted">{description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => handleToggle(category, isPremium)}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-all duration-150',
                  on ? 'bg-brand-600' : 'bg-border'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-150',
                    on ? 'left-[1.35rem]' : 'left-0.5'
                  )}
                />
              </button>
            </div>
          )
        })}
      </div>

      <p className="rounded-lg bg-surface-tertiary px-4 py-3 text-center text-sm text-text-secondary">
        {selectedMaterials.length} ta material tanlandi • {freeCount} ta bepul,{' '}
        {premiumCount} ta premium
      </p>

      <Modal
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
        title="Premium material"
      >
        <p className="mb-4 text-sm text-text-muted">
          Bu material PRO rejada mavjud. Davom etish uchun premium funksiyani faollashtirasizmi?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="gildia-btn-secondary flex-1"
            onClick={() => {
              setPendingPremium(null)
              setPremiumModalOpen(false)
            }}
          >
            Bekor qilish
          </button>
          <button type="button" className="gildia-btn-primary flex-1" onClick={confirmPremium}>
            PRO ni yoqish
          </button>
        </div>
      </Modal>
    </div>
  )
}
