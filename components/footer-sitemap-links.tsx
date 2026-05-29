// components/footer-sitemap-links.tsx
// Server component - renders sitemap links for SEO

export function FooterSitemapLinks() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "https://unmute.app"

  const pages = [
    { url: "/", label: "Home" },
    { url: "/room/anxious", label: "Anxiety Sanctuary" },
    { url: "/room/lonely", label: "Loneliness Sanctuary" },
    { url: "/room/burnt-out", label: "Burnout Sanctuary" },
    { url: "/room/just-talk", label: "Connection Sanctuary" },
    { url: "/echoes", label: "Echoes" },
    { url: "/unsent", label: "The Unsent Room" },
    { url: "/listen", label: "Meet Mira" },
  ]

  return (
    <nav aria-label="Site map" className="text-xs text-muted-foreground/60">
      <p className="font-semibold text-muted-foreground/80 mb-2">Site Map:</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {pages.map((page) => (
          <li key={page.url}>
            <a
              href={page.url}
              className="hover:text-muted-foreground transition-colors underline underline-offset-1"
            >
              {page.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
