'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div className={cn('gildia-card', paddingMap[padding], className)}>
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h3 className={cn('text-text-primary', className)}>{children}</h3>
}
