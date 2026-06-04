export interface ParticipantExportRow {
  fullName: string
  email: string | null
  organization: string | null
  role: string | null
  hasClaimLink: boolean
  emailSent: boolean
}

export function buildParticipantsCsv(rows: ParticipantExportRow[]): string {
  const header = 'fullName,email,organization,role,hasClaimLink,emailSent'
  const lines = rows.map((r) => {
    const cols = [
      escapeCsv(r.fullName),
      escapeCsv(r.email ?? ''),
      escapeCsv(r.organization ?? ''),
      escapeCsv(r.role ?? ''),
      r.hasClaimLink ? 'yes' : 'no',
      r.emailSent ? 'yes' : 'no',
    ]
    return cols.join(',')
  })
  return [header, ...lines].join('\n')
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
