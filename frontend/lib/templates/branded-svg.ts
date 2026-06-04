/** Minimal branded SVG with Gildia variable placeholders for seed / QA. */
export function buildBrandedTemplateSvg(options: {
  title: string
  category: string
  primary?: string
  accent?: string
}): string {
  const primary = options.primary ?? '#2563EB'
  const accent = options.accent ?? '#1E40AF'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f8f7ff"/>
  <rect x="40" y="40" width="720" height="520" rx="12" fill="none" stroke="${primary}" stroke-width="4"/>
  <text x="400" y="120" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="${accent}">${escapeXml(options.title)}</text>
  <text x="400" y="220" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#333">{{eventName}}</text>
  <text x="400" y="280" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#555">{{participantName}}</text>
  <text x="400" y="340" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#666">{{organization}}</text>
  <text x="400" y="400" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#888">{{date}} · {{location}}</text>
  <text x="400" y="520" text-anchor="middle" font-size="11" fill="#aaa">${escapeXml(options.category)}</text>
</svg>`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
