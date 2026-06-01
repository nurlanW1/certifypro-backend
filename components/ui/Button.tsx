'use client'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'gildia-btn-primary',
  secondary: 'gildia-btn-secondary',
  ghost:
    'text-text-secondary hover:bg-brand-50 rounded-lg px-4 py-2.5 text-sm transition-all',
  danger: 'bg-danger text-white rounded-lg px-4 py-2.5 text-sm hover:opacity-90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Yuklanmoqda...' : children}
    </button>
  )
}
