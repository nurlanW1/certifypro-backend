/** Normalize Clerk publishable key from env (runtime on server, build-time on client bundle). */
export function getClerkPublishableKey(): string | null {
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  if (!publishable) return null
  if (publishable.includes('...')) return null
  if (!publishable.startsWith('pk_')) return null
  return publishable
}

export function getClerkSecretKey(): string | null {
  const secret = process.env.CLERK_SECRET_KEY?.trim()
  if (!secret) return null
  if (secret.includes('...')) return null
  if (!secret.startsWith('sk_')) return null
  return secret
}

/** Publishable key alone — enough for Clerk UI on the client. */
export function isClerkPublishableConfigured(): boolean {
  return getClerkPublishableKey() !== null
}

/** Both keys set — full Clerk auth (middleware, API, server components). */
export function isClerkConfigured(): boolean {
  return getClerkPublishableKey() !== null && getClerkSecretKey() !== null
}

/**
 * Client bundle check — may be stale if env was added after build.
 * Prefer `useClerkEnabled()` from ClerkConfigContext (server-passed at runtime).
 */
export function isClerkConfiguredClient(): boolean {
  return isClerkPublishableConfigured()
}
