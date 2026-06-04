export function buildOrgInviteEmail(params: {
  organizationName: string
  acceptUrl: string
  role: string
  expiresAt: Date
}): { subject: string; html: string; text: string } {
  const dateStr = params.expiresAt.toLocaleDateString('uz-UZ')
  const subject = `${params.organizationName} — Gildia agentlik taklifi`

  const text = `Salom!

Sizni "${params.organizationName}" agentligiga (${params.role}) qo‘shilishga taklif qilishdi.

Taklifni qabul qilish: ${params.acceptUrl}

Muddati: ${dateStr}

— Gildia`

  const html = `<!DOCTYPE html>
<html lang="uz">
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a2e;max-width:520px;margin:0 auto;padding:24px">
  <h1 style="color:#059669;font-size:20px">Agentlik taklifi</h1>
  <p>Sizni <strong>${escapeHtml(params.organizationName)}</strong> agentligiga
  <strong>${escapeHtml(params.role)}</strong> sifatida qo‘shilishga taklif qilishdi.</p>
  <p style="margin:24px 0">
    <a href="${params.acceptUrl}" style="background:#059669;color:#fff;padding:12px 20px;border-radius:4px;text-decoration:none;display:inline-block;border:2px solid #1C1917">
      Taklifni qabul qilish
    </a>
  </p>
  <p style="font-size:13px;color:#666">Muddati: ${escapeHtml(dateStr)}</p>
  <p style="font-size:12px;color:#999;margin-top:32px">Gildia — tadbir media platformasi</p>
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
