export function buildCertificateReadyEmail(params: {
  participantName: string
  eventName: string
  claimUrl: string
  organizerName?: string | null
}): { subject: string; html: string; text: string } {
  const subject = `Sertifikatingiz tayyor — ${params.eventName}`
  const org = params.organizerName ? ` (${params.organizerName})` : ''

  const text = `Salom, ${params.participantName}!

"${params.eventName}" tadbiridagi sertifikatingiz tayyor.

Yuklab olish: ${params.claimUrl}

Havola 30 kun amal qiladi.

— Gildia${org}`

  const html = `<!DOCTYPE html>
<html lang="uz">
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a2e;max-width:520px;margin:0 auto;padding:24px">
  <h1 style="color:#2563EB;font-size:20px">Sertifikat tayyor</h1>
  <p>Salom, <strong>${escapeHtml(params.participantName)}</strong>!</p>
  <p><strong>${escapeHtml(params.eventName)}</strong> tadbiridagi sertifikatingizni yuklab olishingiz mumkin.</p>
  <p style="margin:24px 0">
    <a href="${params.claimUrl}" style="background:#2563EB;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;display:inline-block">
      Sertifikatni yuklab olish
    </a>
  </p>
  <p style="font-size:13px;color:#666">Havola cheklangan muddatda amal qiladi.</p>
</body>
</html>`

  return { subject, html, text }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
