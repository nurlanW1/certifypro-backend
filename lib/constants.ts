export const APP_NAME = 'Gildia'

export const SUPPORTED_LANGUAGES = ['uz', 'ru', 'en'] as const

export const CANVAS_DEFAULTS = {
  width: 794,
  height: 1123,
} as const

export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
  events: '/events',
  eventsNew: '/events/new',
  templates: '/templates',
} as const
