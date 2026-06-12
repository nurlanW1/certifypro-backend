import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { ClerkConfigProvider } from '@/components/auth/ClerkConfigContext'
import { AppProviders } from '@/components/AppProviders'
import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { ThemeScript } from '@/components/theme/ThemeScript'
import {
  getClerkPublishableKey,
  isClerkConfigured,
  isClerkPublishableConfigured,
} from '@/lib/clerk-config'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gildia — Tadbir dizayn platformasi',
  description:
    'Konferentsiya, seminar, forum va korporativ tadbirlar uchun dizayn materiallarini avtomatik generatsiya qilish.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishable = isClerkPublishableConfigured()
  const authenticated = isClerkConfigured()

  const appBody = (
    <ClerkConfigProvider publishable={publishable} authenticated={authenticated}>
      <ThemeScript />
      <AppProviders>
        {children}
        <GlobalNavigation />
      </AppProviders>
    </ClerkConfigProvider>
  )

  const htmlProps = {
    lang: 'uz' as const,
    className: `${GeistSans.variable} ${GeistMono.variable}`,
    suppressHydrationWarning: true,
  }

  if (!publishable) {
    return (
      <html {...htmlProps}>
        <body className="font-sans antialiased">{appBody}</body>
      </html>
    )
  }

  const { ClerkProvider } = await import('@clerk/nextjs')
  const publishableKey = getClerkPublishableKey()!

  return (
    <html {...htmlProps}>
      <body className="font-sans antialiased">
        <ClerkProvider
          publishableKey={publishableKey}
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in'}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up'}
          signInFallbackRedirectUrl={
            process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ??
            process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ??
            '/dashboard'
          }
          signUpFallbackRedirectUrl={
            process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ??
            process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ??
            '/dashboard'
          }
        >
          {appBody}
        </ClerkProvider>
      </body>
    </html>
  )
}
