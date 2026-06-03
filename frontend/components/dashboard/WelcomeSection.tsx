'use client'

import dynamic from 'next/dynamic'
import { isClerkConfiguredClient } from '@/lib/clerk-config'
import { WelcomeSectionContent } from './WelcomeSectionContent'

const WelcomeSectionClerk = dynamic(
  () => import('./WelcomeSectionClerk').then((m) => m.WelcomeSectionClerk),
  { ssr: false }
)

export function WelcomeSection() {
  if (!isClerkConfiguredClient()) {
    return <WelcomeSectionContent firstName="Mehmon" />
  }
  return <WelcomeSectionClerk />
}
