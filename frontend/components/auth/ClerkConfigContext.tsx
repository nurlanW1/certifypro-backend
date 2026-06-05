'use client'

import { createContext, useContext } from 'react'

export type ClerkConfig = {
  enabled: boolean
  publishableKey: string | null
}

const ClerkConfigContext = createContext<ClerkConfig>({
  enabled: false,
  publishableKey: null,
})

export function ClerkConfigProvider({
  value,
  children,
}: {
  value: ClerkConfig
  children: React.ReactNode
}) {
  return <ClerkConfigContext.Provider value={value}>{children}</ClerkConfigContext.Provider>
}

export function useClerkEnabled(): boolean {
  return useContext(ClerkConfigContext).enabled
}
