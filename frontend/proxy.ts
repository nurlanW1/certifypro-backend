import type { NextFetchEvent, NextRequest } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { isClerkConfigured } from './lib/clerk-config'

const intlMiddleware = createIntlMiddleware(routing)

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/upgrade',
  '/verify/(.*)',
  '/claim/(.*)',
  '/templates(.*)',
  '/ru',
  '/ru/sign-in(.*)',
  '/ru/sign-up(.*)',
  '/ru/about',
  '/ru/upgrade',
  '/ru/verify/(.*)',
  '/ru/claim/(.*)',
  '/uz',
  '/uz/sign-in(.*)',
  '/uz/sign-up(.*)',
  '/uz/about',
  '/uz/upgrade',
  '/uz/verify/(.*)',
  '/uz/claim/(.*)',
  '/api/health',
  '/api/webhooks/(.*)',
  '/api/claim/(.*)',
])

function shouldSkipIntl(pathname: string) {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/templates') ||
    pathname.startsWith('/gildia-static') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel')
  )
}

function handleIntl(request: NextRequest) {
  if (shouldSkipIntl(request.nextUrl.pathname)) return
  return intlMiddleware(request)
}

const clerkHandler = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth().protect()
  }
  return handleIntl(request)
})

function intlOnly(request: NextRequest) {
  return handleIntl(request)
}

/** Clerk + next-intl — clerk runs when both keys are set (evaluated per request). */
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
