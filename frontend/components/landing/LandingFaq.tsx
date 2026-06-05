'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const

export function LandingFaq() {
  const t = useTranslations('faq')
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="w-full border-t border-divide bg-canvas">
      <div className="mx-auto max-w-screen-xl px-6 py-24 lg:px-10 xl:px-16">
        <p className="label-caps mb-3">{t('sectionTag')}</p>
        <h2 className="mb-12 text-4xl font-semibold tracking-tight text-text-primary">
          {t('title')}
        </h2>
        <div className="divide-y divide-divide rounded border border-divide">
          {FAQ_KEYS.map((key, i) => (
            <div key={key} className="bg-canvas">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-subtle"
              >
                <span className="text-sm font-medium text-text-primary">{t(key)}</span>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-text-disabled transition-transform',
                    open === i && 'rotate-180'
                  )}
                />
              </button>
              {open === i && (
                <p className="border-t border-divide px-6 py-4 text-sm leading-relaxed text-text-secondary">
                  {t(key.replace('q', 'a') as 'a1')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
