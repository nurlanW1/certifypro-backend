'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const WORDS: Record<string, string[]> = {
  uz: ['sertifikat', 'nishon', 'taklifnoma', 'flayer', 'poster'],
  ru: ['сертификат', 'бейдж', 'приглашение', 'флаер', 'постер'],
}

export function LandingHero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const words = WORDS[locale] ?? WORDS.uz

  const [typed, setTyped] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const next = word.slice(0, typed.length + 1)
          setTyped(next)
          if (next.length === word.length) {
            setTimeout(() => setIsDeleting(true), 1400)
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
    return () => clearTimeout(timeout)
  }, [typed, isDeleting, wordIdx, words])

  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden border-b border-divide bg-canvas">
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <div className="absolute left-0 right-0 top-0 h-px bg-divide" />

      <div className="relative mx-auto w-full max-w-screen-xl px-6 py-24 lg:px-10 xl:px-16">
        <div className="mb-10 flex animate-in-up items-center gap-3">
          <span className="tag tag-default">{t('badge')}</span>
        </div>

        <div className="mb-8 animate-in-up">
          <h1 className="font-sans text-[2.75rem] font-bold leading-[1.1] tracking-[-0.04em] text-text-primary sm:text-[4rem] lg:text-[4.75rem]">
            {t('title')}
            <br />
            <span className="inline-flex items-baseline gap-1">
              <span className="text-accent">{typed}</span>
              <span className="inline-block h-[0.85em] w-0.5 animate-cursor bg-accent align-baseline" />
            </span>
            <br />
            <span className="text-text-primary">{t('titleAccent')}</span>
          </h1>
        </div>

        <p className="mb-12 max-w-2xl animate-in-up text-lg leading-[1.7] text-text-secondary sm:text-xl">
          {t('subtitle')}
        </p>

        <div className="flex animate-in-up items-center gap-4">
          <Link href="/events/new" className="btn-primary btn-lg flex items-center gap-2">
            {t('cta')}
            <ArrowRight size={16} />
          </Link>
          <Link href="/templates" className="btn-ghost btn-lg text-text-secondary">
            {t('ctaDemo')}
          </Link>
        </div>

        <div className="mt-16 flex animate-in-up items-center gap-8 border-t border-divide pt-8">
          {[
            { num: '500+', label: t('stat1') },
            { num: '20+', label: t('stat2') },
            { num: '3', label: t('stat3') },
            { num: '30 min', label: t('stat4') },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl font-semibold tracking-tight text-text-primary">{num}</div>
              <div className="label-caps mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-divide" />
    </section>
  )
}
