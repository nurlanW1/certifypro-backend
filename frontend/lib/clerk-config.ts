/** True when real Clerk keys are set (not placeholders). */
export function isClerkConfigured(): boolean {
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  const secret = process.env.CLERK_SECRET_KEY?.trim()

  if (!publishable || !secret) return false
  if (publishable.includes('...') || secret.includes('...')) return false
  if (publishable.length < 12 || secret.length < 12) return false

  return publishable.startsWith('pk_') && secret.startsWith('sk_')
}

export function isClerkConfiguredClient(): boolean {
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  if (!publishable) return false
  if (publishable.includes('...')) return false
  if (publishable.length < 12) return false
  return publishable.startsWith('pk_')
}
