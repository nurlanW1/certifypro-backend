import { getEmailFrom, isEmailConfigured } from '@/lib/email/config'

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export interface SendEmailResult {
  ok: boolean
  provider: 'resend' | 'mock'
  messageId?: string
  error?: string
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const to = params.to.trim()
  if (!to) return { ok: false, provider: 'mock', error: 'Empty recipient' }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[email] RESEND_API_KEY yo‘q — email yuborilmadi:', to, params.subject)
      return { ok: false, provider: 'mock', error: 'Email not configured' }
    }
    console.info('[email:mock]', { to, subject: params.subject })
    return { ok: true, provider: 'mock', messageId: `mock_${Date.now()}` }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getEmailFrom(),
        to: [to],
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    })

    const data = (await res.json()) as { id?: string; message?: string }
    if (!res.ok) {
      return {
        ok: false,
        provider: 'resend',
        error: data.message ?? `HTTP ${res.status}`,
      }
    }

    return { ok: true, provider: 'resend', messageId: data.id }
  } catch (err) {
    return {
      ok: false,
      provider: 'resend',
      error: err instanceof Error ? err.message : 'Send failed',
    }
  }
}

export async function sendOrgInviteEmail(params: {
  to: string
  organizationName: string
  acceptUrl: string
  role: string
  expiresAt: Date
}): Promise<SendEmailResult> {
  const { buildOrgInviteEmail } = await import('@/lib/email/templates/org-invite')
  const { subject, html, text } = buildOrgInviteEmail({
    organizationName: params.organizationName,
    acceptUrl: params.acceptUrl,
    role: params.role,
    expiresAt: params.expiresAt,
  })
  return sendEmail({ to: params.to, subject, html, text })
}

export async function sendCertificateReadyEmail(params: {
  to: string
  participantName: string
  eventName: string
  claimUrl: string
  organizerName?: string | null
}): Promise<SendEmailResult> {
  const { buildCertificateReadyEmail } = await import(
    '@/lib/email/templates/certificate-ready'
  )
  const { subject, html, text } = buildCertificateReadyEmail({
    participantName: params.participantName,
    eventName: params.eventName,
    claimUrl: params.claimUrl,
    organizerName: params.organizerName,
  })
  return sendEmail({ to: params.to, subject, html, text })
}
