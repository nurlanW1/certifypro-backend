'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'gildia-btn-primary',
  secondary: 'gildia-btn-secondary',
  ghost:
    'rounded-sm px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:bg-surface-tertiary',
  danger:
    'rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-text-inverse shadow-sm transition-all hover:opacity-90',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        variantClasses[variant],
        variant !== 'primary' && variant !== 'secondary' ? sizeClasses[size] : '',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Yuklanmoqda...' : children}
    </button>
  )
)

Button.displayName = 'Button'
