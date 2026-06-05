'use client'

import { useTranslations } from 'next-intl'

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const
const CAPABILITY_KEYS = [
  'ai',
  'print',
  'approval',
  'brandkit',
  'bilingual',
  'export',
  'styles',
  'enterOnce',
] as const

const CAPABILITY_ICONS: Record<(typeof CAPABILITY_KEYS)[number], string> = {
  ai: '◈',
  print: '⊡',
  approval: '◎',
  brandkit: '◉',
  bilingual: '◑',
  export: '⊞',
  styles: '◐',
  enterOnce: '▦',
}

export function LandingFeatures() {
  const tHow = useTranslations('howItWorks')
  const tFeat = useTranslations('features')

  return (
    <section className="border-t border-divide bg-ink px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <p className="label-caps mb-12 text-text-tertiary">{tHow('sectionTag')}</p>
            <div>
              {STEP_KEYS.map((key, i) => (
                <div
                  key={key}
                  className={`flex gap-8 py-8 ${
                    i < STEP_KEYS.length - 1 ? 'border-b border-divide' : ''
                  }`}
                >
                  <span className="flex-shrink-0 pt-1 text-4xl font-semibold leading-none text-divide">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-text-primary">
                      {tHow(`${key}Title`)}
                    </h3>
                    <p className="text-base leading-relaxed text-text-secondary">
                      {tHow(`${key}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <p className="label-caps mb-12">{tFeat('sectionTag')}</p>
            <div className="grid grid-cols-2 gap-px bg-divide">
              {CAPABILITY_KEYS.map((key) => (
                <div
                  key={key}
                  className="group cursor-default bg-canvas p-5 transition-colors hover:bg-subtle"
                >
                  <div className="mb-3 inline-block font-mono text-2xl text-accent transition-transform group-hover:scale-110">
                    {CAPABILITY_ICONS[key]}
                  </div>
                  <p className="text-sm text-text-secondary transition-colors group-hover:text-text-primary">
                    {tFeat(key)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
