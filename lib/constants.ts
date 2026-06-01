export const APP_NAME = 'Gildia'

export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
  events: '/events',
  eventsNew: '/events/new',
  templates: '/templates',
  editor: '/editor',
} as const

export const SUPPORTED_LANGUAGES = ['uz', 'ru', 'en'] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]
