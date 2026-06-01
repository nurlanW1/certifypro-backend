'use client'

import dynamic from 'next/dynamic'
import { ClerkSetupNotice } from '@/components/auth/ClerkSetupNotice'
import { isClerkConfiguredClient } from '@/lib/clerk-config'

const SignUp = dynamic(
  () => import('@clerk/nextjs').then((m) => m.SignUp),
  { ssr: false }
)

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-4">
      {isClerkConfiguredClient() ? <SignUp /> : <ClerkSetupNotice />}
    </div>
  )
}
