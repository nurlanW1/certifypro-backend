'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'

const STYLE_CONFIG = [
  {
    id: 'MINIMALIST' as const,
    key: 'minimalist' as const,
    indicator: 'bg-white',
    previewBg: '#FAFAFA',
    previewText: '#0A0A0A',
    previewAccent: '#7B68EE',
    previewBorder: '#E5E5E5',
  },
  {
    id: 'CLASSIC' as const,
    key: 'classic' as const,
    indicator: 'bg-amber-400',
    previewBg: '#FDFAF5',
    previewText: '#2C1654',
    previewAccent: '#C9A84C',
    previewBorder: '#C9A84C',
  },
  {
    id: 'HITECH' as const,
    key: 'hitech' as const,
    indicator: 'bg-accent',
    previewBg: '#080808',
    previewText: '#F2F2F2',
    previewAccent: '#7B68EE',
    previewBorder: '#262626',
  },
]

export function LandingShowcase() {
  const t = useTranslations('styles')
  const [active, setActive] = useState<string>('MINIMALIST')

  return (
    <section className="border-t border-divide bg-canvas px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="label-caps mb-3">{t('sectionTag')}</p>
            <h2 className="text-4xl font-semibold tracking-tight text-text-primary">
              {t('title')}
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-text-secondary md:block">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-divide md:grid-cols-3">
          {STYLE_CONFIG.map((style) => {
            const isActive = active === style.id
            const tags = t.raw(`${style.key}Tags`) as string[]

            return (
              <div
                key={style.id}
                onClick={() => setActive(style.id)}
                className={`cursor-pointer bg-canvas p-8 transition-all duration-200 hover:bg-subtle ${
                  isActive ? 'bg-subtle' : ''
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className={`h-2 w-2 rounded-full ${style.indicator}`} />
                  {isActive && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-dim">
                      <Check size={11} className="text-accent-hover" />
                    </div>
                  )}
                </div>

                <div
                  className="mb-8 overflow-hidden rounded border"
                  style={{
                    background: style.previewBg,
                    borderColor: style.previewBorder,
                  }}
                >
                  <div className="p-6">
                    <div className="mb-5 flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded"
                        style={{ background: style.previewAccent, opacity: 0.9 }}
                      />
                      <div
                        className="h-1.5 w-20 rounded-full opacity-20"
                        style={{ background: style.previewText }}
                      />
                    </div>
                    <div
                      className="mb-3 h-2 w-24 rounded-full opacity-20"
                      style={{ background: style.previewAccent }}
                    />
                    <div
                      className="mb-2 h-8 w-full rounded"
                      style={{ background: style.previewText, opacity: 0.06 }}
                    >
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: style.previewText,
                          padding: '4px 0',
                          fontFamily: style.id === 'CLASSIC' ? 'serif' : 'sans-serif',
                        }}
                      >
                        Alisher Karimov
                      </div>
                    </div>
                    <div
                      className="mt-2 inline-block rounded-full px-3 py-1 text-xs"
                      style={{
                        background: `${style.previewAccent}20`,
                        color: style.previewAccent,
                      }}
                    >
                      Spiker
                    </div>
                    <div
                      className="mt-5 flex items-center justify-between border-t pt-4"
                      style={{ borderColor: style.previewBorder }}
                    >
                      <div
                        className="h-1.5 w-20 rounded-full opacity-10"
                        style={{ background: style.previewText }}
                      />
                      <div
                        className="h-1.5 w-12 rounded-full opacity-10"
                        style={{ background: style.previewText }}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-semibold text-text-primary">{t(style.key)}</h3>
                <p className="mb-5 text-sm leading-relaxed text-text-secondary">
                  {t(`${style.key}Desc`)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="tag tag-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
