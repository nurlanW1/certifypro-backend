/** True when real Clerk keys are set (not placeholders). */
export function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  if (!key) return false
  if (key.includes('...')) return false
  return key.startsWith('pk_')
}

export function isClerkConfiguredClient(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  if (!key) return false
  if (key.includes('...')) return false
  return key.startsWith('pk_')
}
