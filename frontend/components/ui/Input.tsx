'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="gildia-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('gildia-input', error && 'border-danger', className)}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
