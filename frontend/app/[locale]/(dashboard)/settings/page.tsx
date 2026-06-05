'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Bell, CreditCard, Globe, Palette, Shield, User } from 'lucide-react'
import { ThemeSettings } from '@/components/settings/ThemeSettings'
import { ActivityLogPanel } from '@/components/settings/ActivityLogPanel'

const TAB_IDS = [
  { id: 'profile', icon: User },
  { id: 'appearance', icon: Palette },
  { id: 'language', icon: Globe },
  { id: 'notifications', icon: Bell },
  { id: 'billing', icon: CreditCard },
  { id: 'security', icon: Shield },
] as const

type TabId = (typeof TAB_IDS)[number]['id']

export default function SettingsPage() {
  const t = useTranslations('settings')
  const [active, setActive] = useState<TabId>('profile')

  return (
    <div className="-mx-6 -mt-8 flex min-h-screen gap-0 lg:-mx-10 xl:-mx-14">
      <aside className="w-52 shrink-0 space-y-0.5 border-r border-divide p-4">
        <p className="label-caps mb-4 px-3">{t('title')}</p>
        {TAB_IDS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-sm transition-all ${
              active === id
                ? 'bg-subtle font-medium text-text-primary'
                : 'text-text-tertiary hover:bg-subtle hover:text-text-secondary'
            }`}
          >
            <Icon size={14} />
            {t(id)}
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
  const t = useTranslations('settings')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-text-primary">{t('profileTitle')}</h2>
        <p className="text-sm text-text-secondary">{t('profileDesc')}</p>
      </div>
      <div className="space-y-5">
        <div className="flex items-center gap-4 border-b border-divide pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded border border-divide bg-subtle text-2xl font-semibold text-text-tertiary">
            M
          </div>
          <div>
            <button type="button" className="btn-secondary btn-sm">
              {t('uploadPhoto')}
            </button>
            <p className="mt-2 text-sm text-text-tertiary">{t('photoFormats')}</p>
          </div>
        </div>
        {[
          { label: t('name'), placeholder: 'Alisher Karimov', type: 'text' },
          { label: t('email'), placeholder: 'alisher@example.com', type: 'email' },
          { label: t('organization'), placeholder: 'IT Park Toshkent', type: 'text' },
        ].map(({ label, placeholder, type }) => (
          <div key={label}>
            <label className="label-sm mb-2 block">{label}</label>
            <input type={type} placeholder={placeholder} className="input" />
          </div>
        ))}
        <div className="flex justify-end gap-3 border-t border-divide pt-4">
          <button type="button" className="btn-ghost btn-md">
            {t('cancel')}
          </button>
          <button type="button" className="btn-primary btn-md">
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  )
}

function LanguageSettings() {
  const t = useTranslations('settings')
  const tWizard = useTranslations('eventWizard')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-text-primary">{t('languageTitle')}</h2>
        <p className="text-sm text-text-secondary">{t('languageDesc')}</p>
      </div>
      <div className="space-y-2">
        {[
          { code: 'uz', label: tWizard('uz') },
          { code: 'ru', label: tWizard('ru') },
        ].map(({ code, label }) => (
          <button
            key={code}
            type="button"
            className={`flex w-full items-center gap-3 rounded border p-4 text-sm transition-all ${
              code === 'uz'
                ? 'border-accent-border bg-accent-dim text-text-primary'
                : 'border-divide text-text-secondary hover:border-text-tertiary'
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
  const t = useTranslations('settings')

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">{t('notifications')}</h2>
      <p className="text-sm text-text-secondary">{t('notificationsComingSoon')}</p>
    </div>
  )
}

function BillingSettings() {
  const t = useTranslations('settings')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 text-xl font-semibold text-text-primary">{t('billingTitle')}</h2>
        <p className="text-sm text-text-secondary">{t('billingDesc')}</p>
      </div>
      <div className="rounded border border-divide p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-text-primary">{t('freePlan')}</p>
            <p className="text-sm text-text-secondary">{t('freePlanDesc')}</p>
          </div>
          <span className="tag tag-default">{t('current')}</span>
        </div>
        <div className="flex items-center justify-between border-t border-divide pt-4">
          <p className="text-sm text-text-tertiary">{t('usage')}</p>
          <Link href="/upgrade" className="btn-accent btn-sm">
            {t('upgrade')}
          </Link>
        </div>
      </div>
      <Link href="/settings/billing" className="text-sm text-accent hover:text-accent-hover">
        {t('billingHistory')} →
      </Link>
    </div>
  )
}

function SecuritySettings() {
  const t = useTranslations('settings')

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">{t('security')}</h2>
      <ActivityLogPanel />
    </div>
  )
}
