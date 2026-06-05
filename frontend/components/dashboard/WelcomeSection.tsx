'use client'

import dynamic from 'next/dynamic'
import { useClerkPublishable } from '@/components/auth/ClerkConfigContext'
import { WelcomeSectionContent } from './WelcomeSectionContent'

const WelcomeSectionClerk = dynamic(
  () => import('./WelcomeSectionClerk').then((m) => m.WelcomeSectionClerk),
  { ssr: false }
)

export function WelcomeSection() {
  if (!useClerkPublishable()) {
    return <WelcomeSectionContent firstName="Mehmon" />
  }
  return <WelcomeSectionClerk />
}
