'use client'

import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'
import { cn } from '@/lib/utils'

/** @deprecated Use LocaleSwitcher directly */
export function LanguageToggle({ className }: { className?: string }) {
  return <LocaleSwitcher className={cn(className)} />
}
