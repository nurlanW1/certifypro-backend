'use client'

import { Toaster } from 'react-hot-toast'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
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
}
