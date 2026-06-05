'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  const sections = [
    {
      title: t('product'),
      links: [
        { href: '/templates' as const, label: t('templates') },
        { href: '/upgrade' as const, label: t('pricing') },
        { href: '/help' as const, label: nav('faq') },
      ],
    },
    {
      title: t('company'),
      links: [
        { href: '/about' as const, label: t('about') },
        { href: '/agency' as const, label: 'Agency' },
        { href: '/dashboard' as const, label: nav('dashboard') },
      ],
    },
    {
      title: t('legal'),
      links: [
        { href: '/help' as const, label: t('terms') },
        { href: '/help' as const, label: t('privacy') },
        { href: '/help' as const, label: t('cookies') },
      ],
    },
  ]

  return (
    <footer className="border-t border-divide bg-canvas">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="group mb-5 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-text-primary transition-colors group-hover:bg-accent">
                <span className="text-sm font-bold text-canvas">G</span>
              </div>
              <span className="text-sm font-semibold text-text-primary">ildia</span>
            </Link>
            <p className="max-w-44 text-sm leading-relaxed text-text-tertiary">
              {t('description')}
            </p>
          </div>

          {sections.map(({ title, links }) => (
            <div key={title}>
              <p className="label-caps mb-4">{title}</p>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={`${title}-${label}`}>
                    <Link
                      href={href}
                      className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-divide pt-8">
          <p className="text-xs text-text-disabled">{t('copyright')}</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-ok" />
            <span className="text-xs text-text-disabled">{t('status')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
