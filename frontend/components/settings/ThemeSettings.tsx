'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme/ThemeProvider'
import type { Theme } from '@/lib/theme'

const OPTIONS: { value: Theme; label: string; icon: typeof Sun; desc: string }[] = [
  { value: 'light', label: 'Yorug\u2018', icon: Sun, desc: 'Oq fon, qora matn' },
  { value: 'dark', label: 'Qorong\u2018u', icon: Moon, desc: 'Precision Dark' },
]

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="card p-5">
      <p className="label-caps mb-1">Ko&apos;rinish</p>
      <h2 className="text-lg font-semibold text-text-primary">Rejim</h2>
      <p className="mt-1 text-sm text-text-tertiary">
        Light yoki dark rejimni tanlang. Tanlov saqlanadi.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {OPTIONS.map(({ value, label, icon: Icon, desc }) => {
          const active = theme === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                'flex items-start gap-3 rounded-md border p-4 text-left transition-all',
                active
                  ? 'border-accent bg-accent-dim'
                  : 'border-divide bg-subtle hover:border-text-disabled'
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded',
                  active ? 'bg-accent text-white' : 'bg-muted text-text-tertiary'
                )}
              >
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{label}</p>
                <p className="text-xs text-text-tertiary">{desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-text-disabled">
        <Monitor size={12} />
        Birinchi kirishda tizim sozlamasi ishlatiladi
      </p>
    </div>
  )
}
