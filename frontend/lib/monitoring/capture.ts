type CaptureContext = Record<string, unknown>

/** Xatolikni konsolga va ixtiyoriy Sentry ga yuborish (SENTRY_DSN bo‘lsa). */
export function captureException(error: unknown, context?: CaptureContext): void {
  const err = error instanceof Error ? error : new Error(String(error))
  console.error('[gildia-error]', err.message, context ?? {})

  const dsn = process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim()
  if (!dsn) return

  void reportToSentry(dsn, err, context).catch(() => {
    /* ignore transport errors */
  })
}

async function reportToSentry(dsn: string, error: Error, context?: CaptureContext) {
  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureException(error, { extra: context })
  } catch {
    /* @sentry/nextjs o‘rnatilmagan bo‘lishi mumkin */
  }
}
