'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const LOCALE_LABELS: Record<Locale, string> = {
  uz: 'UZ',
  ru: 'RU',
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div
      className={cn(
        'flex items-center overflow-hidden rounded border border-divide',
        className
      )}
    >
      {locales.map((l, i) => (
        <button
          key={l}
          type="button"
          onClick={() => switchLocale(l)}
          className={cn(
            'px-2.5 py-1.5 text-xs font-medium transition-all',
            i > 0 && 'border-l border-divide',
            locale === l
              ? 'bg-subtle text-text-primary'
              : 'text-text-disabled hover:bg-subtle hover:text-text-secondary'
          )}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  )
}
