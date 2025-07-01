import React from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pipeline Zen - CRM Minimaliste',
  description: 'Un CRM épuré pour suivre prospects et clients sans se noyer dans un océan de deals expirés.',
  manifest: '/manifest.json',
  themeColor: '#3B82F6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}