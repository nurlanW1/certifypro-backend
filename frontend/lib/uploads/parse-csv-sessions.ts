/** Lightweight CSV → program session rows (no xlsx dependency) */
export async function parseCsvSessionsFromFile(file: File): Promise<Record<string, string>[]> {
  const name = file.name.toLowerCase()
  if (!name.endsWith(".csv")) return []

  const text = await file.text()
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []

  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  const rows: Record<string, string>[] = []

  const col = (aliases: string[]) => {
    const idx = header.findIndex((h) => aliases.some((a) => h.includes(a)))
    return idx >= 0 ? idx : -1
  }

  const iStart = col(["start", "boshlanish", "time"])
  const iTitle = col(["title", "sessiya", "session", "mavzu"])
  const iSpeaker = col(["speaker", "spiker"])
  const iHall = col(["hall", "zal"])
  const iDate = col(["date", "sana"])

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i])
    if (!cells.some((c) => c.trim())) continue
    const get = (idx: number) => (idx >= 0 ? cells[idx]?.trim() ?? "" : "")

    rows.push({
      date: get(iDate),
      startTime: get(iStart),
      sessionTitle: get(iTitle) || get(iSpeaker) || `Sessiya ${i}`,
      speaker: get(iSpeaker),
      hall: get(iHall),
    })
  }

  return rows
}

function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === "," && !inQuotes) {
      result.push(current)
      current = ""
      continue
    }
    current += ch
  }
  result.push(current)
  return result.map((s) => s.replace(/^"|"$/g, "").trim())
}
