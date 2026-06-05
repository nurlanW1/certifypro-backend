import type { NextFetchEvent, NextRequest } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { isClerkConfigured } from './lib/clerk-config'

const intlMiddleware = createIntlMiddleware(routing)

function shouldSkipIntl(pathname: string) {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/templates') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel')
  )
}

function handleIntl(request: NextRequest) {
  if (shouldSkipIntl(request.nextUrl.pathname)) return
  return intlMiddleware(request)
}

const clerkHandler = clerkMiddleware((_auth, request) => handleIntl(request))

function intlOnly(request: NextRequest) {
  return handleIntl(request)
}

/** Re-check Clerk env on every request (not only at cold start). */
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (isClerkConfigured()) {
    return clerkHandler(request, event)
  }
  return intlOnly(request)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
}
