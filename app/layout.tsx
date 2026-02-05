import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'UNMUTE — Talk Anonymously. Feel Lighter. Free Emotional Support',
  description: 'UNMUTE is a free, anonymous mental wellness space where you can talk openly without judgment. Join live audio sanctuaries with people who feel the same as you.',
  generator: 'v0.app',
  keywords: ['mental wellness', 'anonymous support', 'emotional support', 'anxiety help', 'loneliness support', 'burnout recovery', 'talk therapy', 'peer support'],
  authors: [{ name: 'UNMUTE' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'UNMUTE — Talk Anonymously. Feel Lighter. Free Emotional Support',
    description: 'UNMUTE is a free, anonymous mental wellness space where you can talk openly without judgment. Join live audio sanctuaries with people who feel the same as you.',
    type: 'website',
    locale: 'en_US',
    siteName: 'UNMUTE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNMUTE — Talk Anonymously. Feel Lighter. Free Emotional Support',
    description: 'UNMUTE is a free, anonymous mental wellness space where you can talk openly without judgment. Join live audio sanctuaries with people who feel the same as you.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased min-h-screen bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
