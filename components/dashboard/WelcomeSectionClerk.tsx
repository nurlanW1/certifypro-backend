'use client'

import { useUser } from '@clerk/nextjs'
import { WelcomeSectionContent } from './WelcomeSectionContent'

export function WelcomeSectionClerk() {
  const { user } = useUser()
  const firstName =
    user?.firstName ?? user?.username ?? user?.emailAddresses[0]?.emailAddress?.split('@')[0] ?? 'Foydalanuvchi'
  return <WelcomeSectionContent firstName={firstName} />
}
