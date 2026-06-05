import { redirect } from 'next/navigation'
import { LandingCta } from '@/components/landing/LandingCta'
import { LandingFaq } from '@/components/landing/LandingFaq'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingPricing } from '@/components/landing/LandingPricing'
import { LandingShowcase } from '@/components/landing/LandingShowcase'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { isClerkConfigured } from '@/lib/clerk-config'
import { isGuestMode } from '@/lib/env'

export default async function HomePage() {
  if (isClerkConfigured()) {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = auth()
    if (userId) redirect('/dashboard')
  }

  const showGuestBanner = isGuestMode()

  return (
    <div className="min-h-screen bg-canvas">
      {showGuestBanner && (
        <div className="border-b border-accent-border bg-accent-dim px-6 py-2 text-center text-sm text-accent-hover">
          Mehmon rejimi — Clerk keyinroq ulanadi. Dizayn va funksiyalarni sinab ko&apos;ring.
        </div>
      )}
      <Navbar />
      <main>
        <LandingHero />
        <LandingShowcase />
        <LandingFeatures />
        <LandingPricing />
        <LandingFaq />
        <LandingCta />
      </main>
      <Footer />
    </div>
  )
}
