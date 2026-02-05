import React from "react"
import { Suspense } from "react"

// Force static generation for Cloudflare Pages
export const dynamic = "force-static"

// Pre-generate all known emotion routes for static export
export function generateStaticParams() {
  return [
    { emotion: "anxious" },
    { emotion: "lonely" },
    { emotion: "burnt-out" },
    { emotion: "just-talk" },
  ]
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={null}>{children}</Suspense>
}
