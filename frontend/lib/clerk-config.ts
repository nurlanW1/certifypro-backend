/** Normalize env values (trim quotes from Vercel/dashboard paste). */
function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '')
  return trimmed || undefined
}

export function getClerkPublishableKey(): string | undefined {
  return cleanEnv(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
}

export function getClerkSecretKey(): string | undefined {
  return cleanEnv(process.env.CLERK_SECRET_KEY)
}

/** Publishable key set — ClerkProvider + sign-in UI can work. */
export function isClerkPublishableConfigured(): boolean {
  const publishable = getClerkPublishableKey()
  if (!publishable) return false
  if (publishable.includes('...') || publishable.includes('YOUR_')) return false
  return publishable.startsWith('pk_')
}

/** Both keys set — real authenticated app (no guest mode). */
export function isClerkConfigured(): boolean {
  const publishable = getClerkPublishableKey()
  const secret = getClerkSecretKey()

  if (!publishable || !secret) return false
  if (publishable.includes('...') || secret.includes('...')) return false
  if (publishable.includes('YOUR_') || secret.includes('YOUR_')) return false

  return publishable.startsWith('pk_') && secret.startsWith('sk_')
}

/** @deprecated Use useClerkPublishable() from ClerkConfigContext on the client. */
export function isClerkConfiguredClient(): boolean {
  return isClerkPublishableConfigured()
}
