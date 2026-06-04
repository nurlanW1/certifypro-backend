export function monthPeriodStart(): Date {
  const d = new Date()
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function lastNDaysRanges(n: number): { date: string; start: Date; end: Date }[] {
  const ranges: { date: string; start: Date; end: Date }[] = []
  const now = new Date()

  for (let i = n - 1; i >= 0; i--) {
    const start = new Date(now)
    start.setUTCHours(0, 0, 0, 0)
    start.setUTCDate(start.getUTCDate() - i)
    const end = new Date(start)
    end.setUTCDate(end.getUTCDate() + 1)
    ranges.push({
      date: start.toISOString().slice(0, 10),
      start,
      end,
    })
  }

  return ranges
}
