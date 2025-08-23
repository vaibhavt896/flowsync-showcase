import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PremiumLayout from '@/components/layout/PremiumLayout'
import { ClientProviders } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'FlowSync - AI-Powered Focus Timer',
  description: 'Intelligent Pomodoro timer that adapts to your work patterns',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ClientProviders>
          <PremiumLayout>
            {children}
          </PremiumLayout>
        </ClientProviders>
      </body>
    </html>
  )
}