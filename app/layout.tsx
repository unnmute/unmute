import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
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
        url: '/unmute-icon.jpeg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/unmute-icon.jpeg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/unmute-icon.jpeg',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased min-h-screen bg-background text-foreground`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>

      <Analytics />

      {/* Google Analytics */}
      {process.env.NODE_ENV === "production" && (
          <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-ZJ03EEBFNN"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-ZJ03EEBFNN');
              `}
            </Script>
          </>
      )}

      </body>
      </html>
  )
}
