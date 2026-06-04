/** Simple CSV parser (comma or semicolon). Header row optional. */
export function parseParticipantsCsv(text: string): {
  fullName: string
  email?: string
  organization?: string
  role?: string
}[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) return []

  const delimiter = lines[0].includes(';') ? ';' : ','
  const firstCells = lines[0].split(delimiter).map((c) => c.trim().toLowerCase())

  const nameIdx = firstCells.findIndex((c) =>
    ['name', 'ism', 'fio', 'fullname', 'full_name', 'participant'].includes(c)
  )
  const emailIdx = firstCells.findIndex((c) => ['email', 'pochta', 'e-mail'].includes(c))
  const orgIdx = firstCells.findIndex((c) =>
    ['organization', 'tashkilot', 'company', 'org'].includes(c)
  )
  const roleIdx = firstCells.findIndex((c) => ['role', 'lavozim', 'title'].includes(c))

  const hasHeader = nameIdx >= 0 || emailIdx >= 0
  const start = hasHeader ? 1 : 0

  const results: {
    fullName: string
    email?: string
    organization?: string
    role?: string
  }[] = []

  for (let i = start; i < lines.length; i++) {
    const cells = lines[i].split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''))
    if (cells.every((c) => !c)) continue

    let fullName: string
    let email: string | undefined
    let organization: string | undefined
    let role: string | undefined

    if (hasHeader && nameIdx >= 0) {
      fullName = cells[nameIdx] ?? ''
      email = emailIdx >= 0 ? cells[emailIdx] : undefined
      organization = orgIdx >= 0 ? cells[orgIdx] : undefined
      role = roleIdx >= 0 ? cells[roleIdx] : undefined
    } else {
      fullName = cells[0] ?? ''
      email = cells[1]
      organization = cells[2]
      role = cells[3]
    }

    if (!fullName) continue
    results.push({ fullName, email, organization, role })
  }

  return results
}
