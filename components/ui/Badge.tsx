'use client'

import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'premium'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-brand-50 text-brand-800',
  success: 'bg-success-light text-success-dark',
  warning: 'bg-warning-light text-warning-dark',
  danger: 'bg-danger-light text-danger-dark',
  premium: 'bg-brand-600 text-text-inverse',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
