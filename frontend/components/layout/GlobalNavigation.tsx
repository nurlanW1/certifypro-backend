'use client'

import { ArrowLeft, Home } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const HOME_PATHS = new Set(['/', '/uz', '/ru'])

function getHomeHref(pathname: string) {
  return pathname === '/ru' || pathname.startsWith('/ru/') ? '/ru' : '/'
}

export function GlobalNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  if (HOME_PATHS.has(pathname)) return null

  const homeHref = getHomeHref(pathname)

  const goBack = () => {
    const referrer = document.referrer
    const cameFromThisSite =
      referrer.length > 0 && new URL(referrer).origin === window.location.origin

    if (cameFromThisSite && window.history.length > 1) {
      router.back()
      return
    }

    router.push(homeHref)
  }

  return (
    <nav
      aria-label="Sahifa navigatsiyasi"
      className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 border border-divide bg-ink/95 p-1 shadow-lg backdrop-blur print:hidden"
    >
      <button
        type="button"
        onClick={goBack}
        className="btn-ghost btn-icon-md"
        aria-label="Oldingi sahifaga qaytish"
        title="Oldingi sahifaga qaytish"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => router.push(homeHref)}
        className="btn-ghost btn-icon-md"
        aria-label="Bosh sahifaga qaytish"
        title="Bosh sahifaga qaytish"
      >
        <Home className="h-4 w-4" />
      </button>
    </nav>
  )
}
