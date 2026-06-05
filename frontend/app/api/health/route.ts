import { NextResponse } from 'next/server'
import { isBlobStorageConfigured } from '@/lib/blob/storage'
import { isEmailConfigured } from '@/lib/email/config'
import { isClickConfigured, isPaymeConfigured } from '@/lib/payments/config'
import { isClerkConfigured, isClerkPublishableConfigured } from '@/lib/clerk-config'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const started = Date.now()
  let db = 'unknown'
  try {
    await prisma.$queryRaw`SELECT 1`
    db = 'ok'
  } catch {
    db = 'error'
  }

  return NextResponse.json({
    status: db === 'ok' ? 'healthy' : 'degraded',
    version: process.env.npm_package_version ?? '0.1.0',
    service: 'gildia-frontend',
    checks: {
      database: db,
      clerk: isClerkConfigured(),
      clerkPublishable: isClerkPublishableConfigured(),
      payme: isPaymeConfigured(),
      click: isClickConfigured(),
      openai: Boolean(process.env.OPENAI_API_KEY?.trim()),
      sentry: Boolean(
        process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim()
      ),
      paymeWebhook: true,
      clickWebhook: true,
      email: isEmailConfigured(),
      rateLimit: true,
      templatePreview: true,
      blobStorage: isBlobStorageConfigured(),
      analytics: true,
      adminOverview: Boolean(process.env.GILDIA_ADMIN_EMAILS?.trim()),
    },
    latencyMs: Date.now() - started,
    timestamp: new Date().toISOString(),
  })
}
