import { isGuestMode } from '@/lib/env'

export function GuestModeBanner() {
  if (!isGuestMode()) return null

  return (
    <div className="border-b border-brand-200 bg-brand-50 px-4 py-2.5 text-center text-sm text-brand-900">
      <span className="font-semibold">Mehmon rejimi</span>
      {' — '}
      Clerk keyinroq ulanadi. Hozir dizayn va funksiyalarni sinab ko‘rishingiz mumkin.
      {' '}
      <span className="text-brand-700">
        (Clerk tayyor bo‘lganda Vercel da kalitlarni qo‘ying)
      </span>
    </div>
  )
}
