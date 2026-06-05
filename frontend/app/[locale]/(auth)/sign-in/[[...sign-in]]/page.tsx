'use client'

import dynamic from 'next/dynamic'
import { ClerkSetupNotice } from '@/components/auth/ClerkSetupNotice'
import { useClerkPublishable } from '@/components/auth/ClerkConfigContext'

const SignIn = dynamic(
  () => import('@clerk/nextjs').then((m) => m.SignIn),
  { ssr: false }
)

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-4">
      {useClerkPublishable() ? <SignIn /> : <ClerkSetupNotice />}
    </div>
  )
}
