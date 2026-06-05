'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ClerkConfigProvider, type ClerkConfig } from '@/components/auth/ClerkConfigContext'

export function ClerkAppProvider({
  config,
  children,
}: {
  config: ClerkConfig
  children: React.ReactNode
}) {
  const inner = <ClerkConfigProvider value={config}>{children}</ClerkConfigProvider>

  if (!config.enabled || !config.publishableKey) {
    return inner
  }

  return (
    <ClerkProvider
      publishableKey={config.publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {inner}
    </ClerkProvider>
  )
}
