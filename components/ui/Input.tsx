'use client'

import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="gildia-label">
          {label}
        </label>
      )}
      <input id={inputId} className={cn('gildia-input', className)} {...props} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
