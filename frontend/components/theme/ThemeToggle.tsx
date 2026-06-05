'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme/ThemeProvider'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = true }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = theme === 'dark'

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={cn('h-9 w-[88px] rounded-md border border-divide', className)} />
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center gap-1.5 rounded-md border border-border bg-ink px-3 py-2',
        'text-sm font-medium text-text-secondary transition-all duration-150',
        'hover:border-accent-border hover:text-text-primary',
        className
      )}
      aria-label={isDark ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
    >
      {isDark ? (
        <>
          <Sun size={14} className="text-amber-400" />
          {showLabel && <span>Yorug&apos;</span>}
        </>
      ) : (
        <>
          <Moon size={14} className="text-indigo-500" />
          {showLabel && <span>Qorong&apos;i</span>}
        </>
      )}
    </button>
  )
}
