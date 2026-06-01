'use client'

import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="mb-2 text-text-primary">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-text-muted">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
