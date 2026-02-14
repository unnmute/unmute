import React from "react"
import { Suspense } from "react"
import { ROOM_IDS } from "@/lib/room-config"

// Force static generation for Cloudflare Pages
export const dynamic = "force-static"

// Pre-generate all known emotion routes for static export
export function generateStaticParams() {
  return ROOM_IDS.map((emotion) => ({ emotion }))
}

export default function RoomLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return <Suspense fallback={null}>{children}</Suspense>
}
