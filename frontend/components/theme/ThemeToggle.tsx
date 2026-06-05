'use client'

import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme/ThemeProvider'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn('btn-ghost btn-icon-sm text-text-secondary', className)}
      aria-label={isDark ? 'Yorug\' rejim' : 'Qorong\'u rejim'}
      title={isDark ? 'Yorug\' rejim' : 'Qorong\'u rejim'}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
      {showLabel && (
        <span className="ml-1.5 text-xs">{isDark ? 'Yorug\'' : 'Qorong\'u'}</span>
      )}
    </button>
  )
}
