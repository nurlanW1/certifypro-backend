'use client'

import { useTranslations } from 'next-intl'
import type { MaterialCategory } from '@/types/event'

export function useMaterialLabel() {
  const t = useTranslations('materials')

  return (category: MaterialCategory | string) => {
    try {
      return t(category as 'CERTIFICATE')
    } catch {
      return category
    }
  }
}
