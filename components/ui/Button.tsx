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
    'text-text-secondary hover:bg-brand-50 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
  danger:
    'bg-danger text-text-inverse rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-all',
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
