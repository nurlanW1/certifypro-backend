'use client'

import { Printer } from 'lucide-react'

interface PrintDraftButtonProps {
  onPrint?: () => void
}

export function PrintDraftButton({ onPrint }: PrintDraftButtonProps) {
  return (
    <button type="button" onClick={onPrint} className="btn-primary btn-sm">
      <Printer className="h-4 w-4" />
      Print Draft
    </button>
  )
}
