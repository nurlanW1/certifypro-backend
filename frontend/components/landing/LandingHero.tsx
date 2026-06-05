'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { ArrowRight, BadgeCheck, FileArchive, Printer, QrCode } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const HERO_MATERIALS = [
  { title: 'Certificate', meta: 'A4 PDF', icon: BadgeCheck },
  { title: 'Badge', meta: '90x120mm', icon: QrCode },
  { title: 'Social post', meta: '1080px', icon: FileArchive },
  { title: 'Roll-up', meta: 'Print ready', icon: Printer },
] as const

const WORDS: Record<string, string[]> = {
  uz: ['sertifikat', 'bejik', 'taklifnoma', 'roll-up', 'QR chipta'],
  ru: ['сертификат', 'бейдж', 'приглашение', 'roll-up', 'QR билет'],
}

const COPY = {
  uz: {
    badge: 'Event Media Operating System',
    title: 'Tadbiringizning butun media paketi',
    titleAccent: 'bir ish maydonida',
    subtitle:
      'Gildia tashkilotlarga konferensiya, forum va rasmiy tadbirlar uchun dizayn, print, QR, sertifikat, bejik, sponsor va spiker materiallarini yagona uslubda tayyorlashga yordam beradi.',
    cta: 'Event package yaratish',
    secondary: 'Paketlarni ko‘rish',
    stat1: 'material turi',
    stat2: 'uslub tizimi',
    stat3: 'Excel bulk oqimi',
    stat4: 'print draft',
    previewTitle: 'AI Forum Tashkent',
    previewMeta: 'Full media package',
    readiness: 'Event readiness',
    missing: 'Yetishmaydi: speaker cards, final exports',
    draft: 'Print Draft',
    qr: 'QR verification',
    zip: 'ZIP export',
  },
  ru: {
    badge: 'Event Media Operating System',
    title: 'Полный медиапакет мероприятия',
    titleAccent: 'в одном рабочем пространстве',
    subtitle:
      'Gildia помогает организациям готовить дизайн, печать, QR, сертификаты, бейджи, материалы спикеров и спонсоров для конференций, форумов и официальных событий.',
    cta: 'Создать event package',
    secondary: 'Смотреть пакеты',
    stat1: 'типов материалов',
    stat2: 'системы стиля',
    stat3: 'Excel bulk поток',
    stat4: 'print draft',
    previewTitle: 'AI Forum Tashkent',
    previewMeta: 'Full media package',
    readiness: 'Готовность события',
    missing: 'Не хватает: speaker cards, final exports',
    draft: 'Print Draft',
    qr: 'QR verification',
    zip: 'ZIP export',
  },
}

export function LandingHero() {
  const locale = useLocale()
  const words = WORDS[locale] ?? WORDS.uz
  const copy = COPY[locale as 'uz' | 'ru'] ?? COPY.uz

  const [typed, setTyped] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx]
    const timeout = window.setTimeout(
      () => {
        if (!isDeleting) {
          const next = word.slice(0, typed.length + 1)
          setTyped(next)
          if (next.length === word.length) {
            window.setTimeout(() => setIsDeleting(true), 1400)
          }
        } else {
          const next = word.slice(0, typed.length - 1)
          setTyped(next)
          if (next.length === 0) {
            setIsDeleting(false)
            setWordIdx((i) => (i + 1) % words.length)
          }
        }
      },
      isDeleting ? 40 : 80
    )
    return () => window.clearTimeout(timeout)
  }, [typed, isDeleting, wordIdx, words])

  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden border-b border-divide bg-canvas">
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <div className="absolute left-0 right-0 top-0 h-px bg-divide" />

      <div className="relative mx-auto grid w-full max-w-screen-xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 xl:px-16">
        <div className="self-center">
          <div className="mb-8 flex animate-in-up items-center gap-3">
            <span className="tag tag-accent">{copy.badge}</span>
            <span className="hidden text-xs text-text-disabled sm:inline">
              Conference, forum, academic, corporate
            </span>
          </div>

          <div className="mb-8 animate-in-up">
            <h1 className="font-sans text-[2.6rem] font-bold leading-[1.08] text-text-primary sm:text-[4rem] lg:text-[4.6rem]">
              {copy.title}
              <br />
              <span className="inline-flex items-baseline gap-1">
                <span className="text-accent">{typed}</span>
                <span className="inline-block h-[0.85em] w-0.5 animate-cursor bg-accent align-baseline" />
              </span>
              <br />
              <span className="text-text-primary">{copy.titleAccent}</span>
            </h1>
          </div>

          <p className="mb-10 max-w-2xl animate-in-up text-lg leading-[1.7] text-text-secondary sm:text-xl">
            {copy.subtitle}
          </p>

          <div className="flex animate-in-up flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/events/new" className="btn-primary btn-lg flex items-center gap-2">
              {copy.cta}
              <ArrowRight size={16} />
            </Link>
            <Link href="/templates" className="btn-secondary btn-lg text-text-secondary">
              {copy.secondary}
            </Link>
          </div>

          <div className="mt-14 grid animate-in-up grid-cols-2 gap-px border border-divide bg-divide sm:grid-cols-4">
            {[
              { num: '20+', label: copy.stat1 },
              { num: '3', label: copy.stat2 },
              { num: 'CSV/XLSX', label: copy.stat3 },
              { num: '1 click', label: copy.stat4 },
            ].map(({ num, label }) => (
              <div key={label} className="bg-canvas p-4">
                <div className="text-xl font-semibold tracking-tight text-text-primary">{num}</div>
                <div className="label-caps mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative self-center">
          <div className="rounded-lg border border-divide bg-ink shadow-lg">
            <div className="flex items-center justify-between border-b border-divide px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">{copy.previewTitle}</p>
                <p className="text-xs text-text-disabled">{copy.previewMeta}</p>
              </div>
              <span className="tag tag-ok">72%</span>
            </div>
            <div className="grid gap-px bg-divide p-px sm:grid-cols-[0.8fr_1.2fr]">
              <div className="bg-canvas p-4">
                <p className="label-caps mb-3">{copy.readiness}</p>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-subtle">
                  <div className="h-full w-[72%] rounded-full bg-accent" />
                </div>
                <p className="mb-5 text-xs text-text-tertiary">{copy.missing}</p>
                <div className="space-y-2">
                  {[
                    ['Certificate', 'ready'],
                    ['Badge', 'ready'],
                    ['Invitation', 'draft'],
                    ['Sponsor banner', 'missing'],
                  ].map(([name, status]) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{name}</span>
                      <span
                        className={
                          status === 'ready'
                            ? 'text-green-600'
                            : status === 'draft'
                              ? 'text-amber-600'
                              : 'text-text-disabled'
                        }
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-canvas p-4">
                <div className="grid grid-cols-2 gap-3">
                  {HERO_MATERIALS.map(({ title, meta, icon: Icon }) => (
                    <div key={title} className="rounded border border-divide bg-subtle p-3">
                      <Icon className="mb-3 h-4 w-4 text-accent" />
                      <p className="text-sm font-medium text-text-primary">{title}</p>
                      <p className="text-xs text-text-disabled">{meta}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[copy.draft, copy.qr, copy.zip].map((item) => (
                    <div
                      key={item}
                      className="rounded border border-accent-border bg-accent-dim px-2 py-2 text-center text-xs text-accent-hover"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-divide" />
    </section>
  )
}
