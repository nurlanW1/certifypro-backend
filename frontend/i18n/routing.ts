import { defineRouting } from 'next-intl/routing'

export const locales = ['uz', 'ru'] as const
export const defaultLocale = 'uz' as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})
