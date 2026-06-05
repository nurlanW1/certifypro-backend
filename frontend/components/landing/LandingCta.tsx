'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export function LandingCta() {
  const t = useTranslations('cta')

  return (
    <section className="w-full border-t border-divide bg-ink">
      <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-10 xl:px-16">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="mb-3 text-3xl font-semibold tracking-tight text-text-primary">
              {t('title')}
            </h2>
            <p className="max-w-md text-sm text-text-secondary">{t('subtitle')}</p>
            <p className="mt-2 text-xs text-text-disabled">{t('note')}</p>
          </div>
          <Link href="/events/new" className="btn-primary btn-lg inline-flex items-center gap-2">
            {t('primary')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
