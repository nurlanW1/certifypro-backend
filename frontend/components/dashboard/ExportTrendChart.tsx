'use client'

interface TrendPoint {
  date: string
  exports: number
}

export function ExportTrendChart({ trend }: { trend: TrendPoint[] }) {
  const max = Math.max(1, ...trend.map((t) => t.exports))

  return (
    <div className="gildia-card p-5">
      <h3 className="text-sm font-semibold text-text-primary">Eksportlar (7 kun)</h3>
      <div className="mt-4 flex h-28 items-end gap-2">
        {trend.map((t) => {
          const pct = Math.round((t.exports / max) * 100)
          const label = t.date.slice(5)
          return (
            <div key={t.date} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-text-muted">{t.exports}</span>
              <div
                className="w-full rounded-t bg-brand-500 transition-all"
                style={{ height: `${Math.max(4, pct)}%` }}
                title={`${t.date}: ${t.exports}`}
              />
              <span className="text-[10px] text-text-muted">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
