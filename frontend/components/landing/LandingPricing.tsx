'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: '0',
    unit: '',
    desc: "Sinab ko'rish uchun",
    features: [
      'Oyiga 5 ta dizayn',
      '3 uslub',
      'PNG eksport (watermark)',
      'Asosiy editor',
    ],
    cta: 'Bepul boshlash',
    href: '/events/new',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '19',
    unit: '/oy',
    desc: 'Professional foydalanish',
    features: [
      'Cheksiz dizaynlar',
      'Barcha premium shablonlar',
      'PNG PDF SVG (watermarksiz)',
      'Print funksiyasi',
      'AI yordamchi',
      'Tasdiqlash tizimi',
      'Brand Kit × 5',
      'Bulk generatsiya',
    ],
    cta: 'Pro boshlash',
    href: '/upgrade',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '49',
    unit: '/oy',
    desc: 'Korporativ tashkilotlar',
    features: [
      'Pro — barcha imkoniyatlar',
      'Cheksiz Brand Kit',
      'Jamoa (5 foydalanuvchi)',
      'Custom shablonlar',
      "Ustuvor qo'llab-quvvatlash",
    ],
    cta: 'Aloqaga chiqish',
    href: '/agency',
    highlight: false,
  },
]

export function LandingPricing() {
  return (
    <section className="border-t border-divide bg-canvas px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="label-caps mb-3">Narxlar</p>
            <h2 className="text-4xl font-semibold tracking-tight text-text-primary">
              Oddiy va ochiq
            </h2>
          </div>
          <p className="hidden text-sm text-text-tertiary md:block">Karta kerak emas</p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-divide md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col p-8 ${plan.highlight ? 'bg-subtle' : 'bg-canvas'}`}
            >
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{plan.name}</span>
                  {plan.highlight && <span className="tag tag-accent">Mashhur</span>}
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-text-primary">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-text-tertiary">{plan.unit}</span>
                </div>
                <p className="text-sm text-text-tertiary">{plan.desc}</p>
              </div>

              <Link
                href={plan.href}
                className={`btn-md mb-8 w-full text-center ${
                  plan.highlight ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check size={13} className="mt-0.5 flex-shrink-0 text-accent" />
                    <span className="text-text-secondary">{f}</span>
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
