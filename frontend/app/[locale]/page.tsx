import { redirect } from 'next/navigation'
import { LandingCta } from '@/components/landing/LandingCta'
import { LandingFaq } from '@/components/landing/LandingFaq'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingOperatingSystem } from '@/components/landing/LandingOperatingSystem'
import { LandingPricing } from '@/components/landing/LandingPricing'
import { LandingShowcase } from '@/components/landing/LandingShowcase'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { isClerkConfigured } from '@/lib/clerk-config'

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  if (isClerkConfigured()) {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = auth()
    if (userId) redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main>
        <LandingHero />
        <LandingOperatingSystem />
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
