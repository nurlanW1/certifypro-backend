import { defineRouting } from 'next-intl/routing'

export const locales = ['uz', 'ru'] as const
export const defaultLocale = 'uz' as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale,
  // uz: gildia.uz/  |  ru: gildia.uz/ru/
  localePrefix: 'as-needed',
  // Brauzer tiliga qarab avtomatik /ru ga o'tmasin
  localeDetection: false,
})
