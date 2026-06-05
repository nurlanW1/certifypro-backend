'use client'

import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'premium'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-ink text-text-secondary border-divide',
  success: 'bg-success-light text-success-dark border-success/20',
  warning: 'bg-warning-light text-warning-dark border-warning/20',
  premium: 'bg-accent text-text-inverse border-accent-border',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
