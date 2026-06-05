'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const PLANS = [
  {
    id: 'free' as const,
    price: '0',
    unit: '',
    href: '/events/new',
    highlight: false,
    features: [
      'designs5',
      'styles3',
      'pngWatermark',
      'basicEditor',
    ] as const,
  },
  {
    id: 'pro' as const,
    price: '19',
    unit: 'perMonth',
    href: '/upgrade',
    highlight: true,
    features: [
      'designsUnlimited',
      'allStyles',
      'allExports',
      'print',
      'ai',
      'approval',
      'brandkit5',
      'bulk',
    ] as const,
  },
  {
    id: 'enterprise' as const,
    price: '49',
    unit: 'perMonth',
    href: '/agency',
    highlight: false,
    features: [
      'designsUnlimited',
      'brandkitUnlimited',
      'team',
      'custom',
      'priority',
    ] as const,
  },
]

export function LandingPricing() {
  const t = useTranslations('pricing')

  return (
    <section className="border-t border-divide bg-canvas px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="label-caps mb-3">{t('sectionTag')}</p>
            <h2 className="text-4xl font-semibold tracking-tight text-text-primary">
              {t('title')}
            </h2>
          </div>
          <p className="hidden text-sm text-text-tertiary md:block">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-divide md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col p-8 ${plan.highlight ? 'bg-subtle' : 'bg-canvas'}`}
            >
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{t(plan.id)}</span>
                  {plan.highlight && <span className="tag tag-accent">{t('popular')}</span>}
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-text-primary">
                    ${plan.price}
                  </span>
                  {plan.unit && (
                    <span className="text-sm text-text-tertiary">{t(plan.unit)}</span>
                  )}
                </div>
                <p className="text-sm text-text-tertiary">{t(`${plan.id}Desc`)}</p>
              </div>

              <Link
                href={plan.href}
                className={`btn-md mb-8 w-full text-center ${
                  plan.highlight ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {t(plan.id === 'free' ? 'ctaFree' : plan.id === 'pro' ? 'ctaPro' : 'ctaEnterprise')}
              </Link>

              <ul className="flex-1 space-y-3">
                {plan.features.map((featureKey) => (
                  <li key={featureKey} className="flex items-start gap-3 text-sm">
                    <Check size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                    <span className="text-text-secondary">{t(`features.${featureKey}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
