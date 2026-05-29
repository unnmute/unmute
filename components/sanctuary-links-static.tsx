// components/sanctuary-links-static.tsx
// Server component - renders plain HTML anchors for SEO crawlers

export function SanctuaryLinksStatic() {
  return (
    <nav aria-label="Static sanctuary links for SEO" className="hidden">
      {/* These links are invisible but rendered in HTML for Google to crawl and index */}
      <a href="/room/anxious">Anxiety Sanctuary</a>
      <a href="/room/lonely">Loneliness Sanctuary</a>
      <a href="/room/burnt-out">Burnout Sanctuary</a>
      <a href="/room/just-talk">Connection Sanctuary</a>
    </nav>
  )
}
