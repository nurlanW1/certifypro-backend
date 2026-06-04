/** Production deployment (Vercel). */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** Mock API fallbacks only in local dev without strict auth. */
export function allowDevMocks(): boolean {
  return !isProduction()
}
