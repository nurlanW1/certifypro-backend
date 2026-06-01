'use client'

import { LucideIcon, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-secondary px-6 py-12 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
        <Icon className="h-6 w-6 text-brand-600" />
      </div>
      <h3 className="text-lg font-medium text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-muted">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
