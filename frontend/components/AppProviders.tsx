'use client'

import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { useTheme } from '@/components/theme/ThemeProvider'

function ThemedToaster() {
  const { theme } = useTheme()

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          color: theme === 'dark' ? '#f2f2f2' : '#09090b',
          border: theme === 'dark' ? '1px solid #262626' : '1px solid #e4e4e7',
          borderRadius: '8px',
          fontSize: '14px',
          boxShadow: theme === 'dark'
            ? '0 4px 12px rgba(0,0,0,0.5)'
            : '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    />
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <ThemedToaster />
    </ThemeProvider>
  )
}
