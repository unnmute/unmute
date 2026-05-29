import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/room/',
        '/room/anxious',
        '/room/lonely',
        '/room/burnt-out',
        '/room/just-talk',
        '/echoes',
        '/unsent',
        '/listen',
      ],
      disallow: [
        '/api/',
        '/.well-known/',
      ],
    },
    sitemap: [
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_SITE_URL || 'https://unmute.app'}/sitemap.xml`,
    ],
  }
}
