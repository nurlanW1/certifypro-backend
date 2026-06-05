'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, CreditCard, Globe, Palette, Shield, User } from 'lucide-react'
import { ThemeSettings } from '@/components/settings/ThemeSettings'
import { ActivityLogPanel } from '@/components/settings/ActivityLogPanel'

const TABS = [
  { id: 'profile', icon: User, label: 'Profil' },
  { id: 'appearance', icon: Palette, label: "Ko'rinish" },
  { id: 'language', icon: Globe, label: 'Til' },
  { id: 'notifications', icon: Bell, label: 'Bildirishnomalar' },
  { id: 'billing', icon: CreditCard, label: "To'lov" },
  { id: 'security', icon: Shield, label: 'Xavfsizlik' },
]

export default function SettingsPage() {
  const [active, setActive] = useState('profile')

  return (
    <div className="-mx-6 -mt-8 flex min-h-screen gap-0 lg:-mx-10 xl:-mx-14">
      <aside className="w-52 shrink-0 space-y-0.5 border-r border-divide p-4">
        <p className="label-caps mb-4 px-3">Sozlamalar</p>
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-sm transition-all ${
              active === id
                ? 'bg-subtle font-medium text-text-primary'
                : 'text-text-disabled hover:bg-subtle hover:text-text-secondary'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </aside>

      <div className="max-w-2xl flex-1 p-8">
        {active === 'profile' && <ProfileSettings />}
        {active === 'appearance' && <ThemeSettings />}
        {active === 'language' && <LanguageSettings />}
        {active === 'notifications' && <NotificationsSettings />}
        {active === 'billing' && <BillingSettings />}
        {active === 'security' && <SecuritySettings />}
      </div>
    </div>
  )
}

function ProfileSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-text-primary">Profil</h2>
        <p className="text-sm text-text-secondary">Shaxsiy ma&apos;lumotlaringizni yangilang</p>
      </div>
      <div className="space-y-5">
        <div className="flex items-center gap-4 border-b border-divide pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded border border-divide bg-subtle text-2xl font-semibold text-text-tertiary">
            M
          </div>
          <div>
            <button type="button" className="btn-secondary btn-sm">
              Rasm yuklash
            </button>
            <p className="mt-2 text-xs text-text-disabled">PNG, JPG — max 2MB</p>
          </div>
        </div>
        {[
          { label: 'Ism', placeholder: 'Alisher Karimov', type: 'text' },
          { label: 'Email', placeholder: 'alisher@example.com', type: 'email' },
          { label: 'Tashkilot', placeholder: 'IT Park Toshkent', type: 'text' },
        ].map(({ label, placeholder, type }) => (
          <div key={label}>
            <label className="label-sm mb-2 block">{label}</label>
            <input type={type} placeholder={placeholder} className="input" />
          </div>
        ))}
        <div className="flex justify-end gap-3 border-t border-divide pt-4">
          <button type="button" className="btn-ghost btn-md">
            Bekor qilish
          </button>
          <button type="button" className="btn-primary btn-md">
            Saqlash
          </button>
        </div>
      </div>
    </div>
  )
}

function LanguageSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-text-primary">Til</h2>
        <p className="text-sm text-text-secondary">Interfeys tilini tanlang</p>
      </div>
      <div className="space-y-2">
        {[
          { code: 'uz', label: "O'zbek" },
          { code: 'ru', label: 'Русский' },
        ].map(({ code, label }) => (
          <button
            key={code}
            type="button"
            className={`flex w-full items-center gap-3 rounded border p-4 text-sm transition-all ${
              code === 'uz'
                ? 'border-accent-border bg-accent-dim text-text-primary'
                : 'border-divide text-text-secondary hover:border-text-disabled'
            }`}
          >
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function NotificationsSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">Bildirishnomalar</h2>
      <p className="text-sm text-text-secondary">Tez orada qo&apos;shiladi.</p>
    </div>
  )
}

function BillingSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-text-primary">To&apos;lov</h2>
        <p className="text-sm text-text-secondary">Joriy reja va to&apos;lov ma&apos;lumotlari</p>
      </div>
      <div className="rounded border border-divide p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-text-primary">Free Reja</p>
            <p className="text-xs text-text-secondary">Oyiga 5 ta dizayn, watermarked eksport</p>
          </div>
          <span className="tag tag-default">Joriy</span>
        </div>
        <div className="flex items-center justify-between border-t border-divide pt-4">
          <p className="text-xs text-text-tertiary">3/5 tadbir ishlatildi</p>
          <Link href="/upgrade" className="btn-accent btn-sm">
            Pro ga o&apos;tish
          </Link>
        </div>
      </div>
      <Link href="/settings/billing" className="text-sm text-accent hover:text-accent-hover">
        To&apos;lovlar tarixi →
      </Link>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Xavfsizlik</h2>
      <ActivityLogPanel />
    </div>
  )
}
