'use client'

import { createContext, useContext } from 'react'

type ClerkConfigValue = {
  /** Publishable key present — Clerk UI can render. */
  publishable: boolean
  /** Publishable + secret — full auth, no guest API user. */
  authenticated: boolean
}

const ClerkConfigContext = createContext<ClerkConfigValue>({
  publishable: false,
  authenticated: false,
})

export function ClerkConfigProvider({
  publishable,
  authenticated,
  children,
}: ClerkConfigValue & { children: React.ReactNode }) {
  return (
    <ClerkConfigContext.Provider value={{ publishable, authenticated }}>
      {children}
    </ClerkConfigContext.Provider>
  )
}

/** Clerk publishable key is configured (sign-in UI available). */
export function useClerkPublishable(): boolean {
  return useContext(ClerkConfigContext).publishable
}

/** Full Clerk auth (both keys) — replaces guest mode. */
export function useClerkEnabled(): boolean {
  return useContext(ClerkConfigContext).authenticated
}
