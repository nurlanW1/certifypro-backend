'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const LANG_KEY = 'gildia-lang'

export function LanguageToggle({ className }: { className?: string }) {
  const [lang, setLang] = useState<'uz' | 'ru'>('uz')

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored === 'uz' || stored === 'ru') setLang(stored)
  }, [])

  const toggle = () => {
    const next = lang === 'uz' ? 'ru' : 'uz'
    setLang(next)
    localStorage.setItem(LANG_KEY, next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn('btn-ghost btn-sm text-xs font-medium uppercase', className)}
      title="Tilni almashtirish"
    >
      {lang}
    </button>
  )
}
