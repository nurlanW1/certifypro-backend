'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const clerkEnabled =
  Boolean(clerkPublishableKey) &&
  !clerkPublishableKey!.includes('...') &&
  clerkPublishableKey!.startsWith('pk_')

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#26215C',
            color: '#FFFFFF',
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />
    </>
  )

  if (!clerkEnabled) {
    return content
  }

  return <ClerkProvider>{content}</ClerkProvider>
}
