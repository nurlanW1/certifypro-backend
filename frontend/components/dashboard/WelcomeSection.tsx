'use client'

import dynamic from 'next/dynamic'
import { useClerkEnabled } from '@/components/auth/ClerkConfigContext'
import { WelcomeSectionContent } from './WelcomeSectionContent'

const WelcomeSectionClerk = dynamic(
  () => import('./WelcomeSectionClerk').then((m) => m.WelcomeSectionClerk),
  { ssr: false }
)

export function WelcomeSection() {
  if (!useClerkEnabled()) {
    return <WelcomeSectionContent firstName="Mehmon" />
  }
  return <WelcomeSectionClerk />
}
