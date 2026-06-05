'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  BadgeCheck,
  CalendarPlus,
  Crown,
  FileArchive,
  FileSpreadsheet,
  FolderKanban,
  ImageUp,
  Layout,
  Printer,
  QrCode,
  ReceiptText,
  Users,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { EventCardSkeleton } from '@/components/ui/Skeleton'
import { EVENT_TYPE_LABELS } from '@/types/event'
import type { Event } from '@/types/event'

interface Analytics {
  usage: { eventsCount: number; designsCount: number; exportsCount: number }
}

const COPY = {
  uz: {
    title: 'Event media markazi',
    subtitle:
      'Tadbirlar, material paketlari, Excel ro‘yxatlar, QR kodlar, print draftlar va final eksportlar bir joyda.',
    createPackage: 'Create Event Package',
    templates: 'Paket shablonlari',
    readiness: 'Event readiness',
    missing: 'Yetishmaydi',
    missingItems: ['Sponsor banner', 'Speaker cards', 'Registration QR', 'Final print exports'],
    myEvents: 'My Events',
    recentDesigns: 'Recent Designs',
    participantLists: 'Participant Lists',
    generatedFiles: 'Generated Files',
    uploadedAssets: 'Uploaded Assets',
    qrCodes: 'QR Codes',
    printDrafts: 'Print Drafts',
    premiumStatus: 'Premium Status',
    paymentHistory: 'Payment History',
    packageFlow: 'Package workflow',
    empty: 'Hali tadbir yo‘q.',
    createFirst: 'Birinchi event package yarating',
    open: 'Ochish',
    active: 'Faol',
    designs: 'ta dizayn',
  },
  ru: {
    title: 'Центр event media',
    subtitle:
      'Мероприятия, пакеты материалов, Excel списки, QR-коды, print drafts и финальные экспорты в одном месте.',
    createPackage: 'Create Event Package',
    templates: 'Шаблоны пакетов',
    readiness: 'Event readiness',
    missing: 'Не хватает',
    missingItems: ['Sponsor banner', 'Speaker cards', 'Registration QR', 'Final print exports'],
    myEvents: 'My Events',
    recentDesigns: 'Recent Designs',
    participantLists: 'Participant Lists',
    generatedFiles: 'Generated Files',
    uploadedAssets: 'Uploaded Assets',
    qrCodes: 'QR Codes',
    printDrafts: 'Print Drafts',
    premiumStatus: 'Premium Status',
    paymentHistory: 'Payment History',
    packageFlow: 'Package workflow',
    empty: 'Мероприятий пока нет.',
    createFirst: 'Создать первый event package',
    open: 'Открыть',
    active: 'Активно',
    designs: 'дизайнов',
  },
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const copy = COPY[locale as 'uz' | 'ru'] ?? COPY.uz
  const [events, setEvents] = useState<Event[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void Promise.all([
      fetch('/api/events').then((r) => r.json()),
      fetch('/api/analytics/me').then((r) => r.json()),
    ])
      .then(([eventsData, analyticsData]) => {
        setEvents(eventsData.events ?? [])
        setAnalytics(analyticsData.analytics ?? null)
      })
      .finally(() => setLoading(false))
  }, [])

  const recent = events.slice(0, 4)
  const usage = analytics?.usage
  const readiness = useMemo(() => Math.min(92, 48 + events.length * 8), [events.length])

  const commandStats = [
    { label: copy.myEvents, value: usage ? usage.eventsCount : events.length, icon: FolderKanban },
    { label: copy.recentDesigns, value: usage?.designsCount ?? 0, icon: Layout },
    { label: copy.generatedFiles, value: usage?.exportsCount ?? 0, icon: FileArchive },
    { label: copy.printDrafts, value: Math.max(1, events.length * 2), icon: Printer },
  ]

  const workspaceSections = [
    { label: copy.participantLists, value: 'CSV/XLSX', icon: FileSpreadsheet, href: '/events' },
    { label: copy.uploadedAssets, value: 'logos, stamps', icon: ImageUp, href: '/brand-kit' },
    { label: copy.qrCodes, value: 'verification', icon: QrCode, href: '/events' },
    { label: copy.premiumStatus, value: 'Free', icon: Crown, href: '/upgrade' },
    { label: copy.paymentHistory, value: 'Click, Payme', icon: ReceiptText, href: '/settings/billing' },
    { label: 'Speaker & Sponsor', value: 'concept ready', icon: Users, href: '/agency' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 border-b border-divide pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label-caps mb-2">{t('welcome')}</p>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-text-primary">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-sm text-text-secondary">{copy.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link href="/templates" className="btn-secondary btn-md inline-flex items-center gap-2">
            <Layout size={14} />
            {copy.templates}
          </Link>
          <Link href="/events/new" className="btn-primary btn-md inline-flex items-center gap-2">
            <CalendarPlus size={14} />
            {copy.createPackage}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px rounded border border-divide bg-divide lg:grid-cols-4">
        {commandStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-canvas p-6 transition-colors hover:bg-subtle">
            <div className="mb-4 flex items-start justify-between">
              <Icon size={16} className="text-text-disabled" />
              <span className="text-xs text-text-disabled">live</span>
            </div>
            <div className="mb-1 text-3xl font-semibold tracking-tight text-text-primary">
              {value}
            </div>
            <p className="label-caps">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded border border-divide bg-canvas">
          <div className="flex items-center justify-between border-b border-divide px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">{copy.myEvents}</p>
              <p className="text-xs text-text-disabled">{copy.packageFlow}</p>
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1 text-xs text-text-disabled transition-colors hover:text-text-secondary"
            >
              {t('viewAll')} <ArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : recent.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-text-tertiary">
              {copy.empty}{' '}
              <Link href="/events/new" className="text-accent hover:text-accent-hover">
                {copy.createFirst}
              </Link>
            </div>
          ) : (
            recent.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group grid grid-cols-12 items-center gap-3 border-b border-divide px-5 py-4 transition-colors last:border-0 hover:bg-subtle"
              >
                <div className="col-span-12 flex min-w-0 items-center gap-3 md:col-span-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-divide bg-subtle text-xs font-semibold text-text-tertiary">
                    {event.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">{event.name}</p>
                    <p className="text-xs text-text-disabled">
                      {event.materialCount ?? 0} {copy.designs}
                    </p>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <span className="tag tag-default">{EVENT_TYPE_LABELS[event.type]}</span>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <span className="text-xs text-text-secondary">
                    {event.date ? formatDate(event.date) : 'No date'}
                  </span>
                </div>
                <div className="col-span-3 md:col-span-2">
                  <span className="tag tag-ok">{copy.active}</span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <ArrowRight
                    size={13}
                    className="text-text-disabled transition-colors group-hover:text-text-tertiary"
                  />
                </div>
              </Link>
            ))
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded border border-divide bg-ink p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-primary">{copy.readiness}</p>
                <p className="text-xs text-text-disabled">{copy.missing}</p>
              </div>
              <span className="text-2xl font-semibold text-text-primary">{readiness}%</span>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-subtle">
              <div className="h-full rounded-full bg-accent" style={{ width: `${readiness}%` }} />
            </div>
            <div className="space-y-2">
              {copy.missingItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                  <BadgeCheck className="h-3.5 w-3.5 text-text-disabled" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded border border-divide">
            <div className="border-b border-divide px-5 py-4">
              <p className="text-sm font-semibold text-text-primary">Workspace modules</p>
            </div>
            <div className="grid grid-cols-1 divide-y divide-divide">
              {workspaceSections.map(({ label, value, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-subtle"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-divide bg-subtle">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{label}</p>
                    <p className="text-xs text-text-disabled">{value}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-text-disabled group-hover:text-text-tertiary" />
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
