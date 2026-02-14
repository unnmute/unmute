// app/room/[emotion]/page.tsx
import { RoomClient } from "./room-client"
import type { Metadata } from "next"
import { getRoomConfig } from "@/lib/room-config"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function generateMetadata({
                                         params,
                                       }: {
  params: Promise<{ emotion: string }>
}): Promise<Metadata> {
  const { emotion } = await params
  const roomConfig = getRoomConfig(emotion)

  return {
    title: roomConfig.metadataTitle,
    description: roomConfig.metadataDescription,
    openGraph: {
      title: roomConfig.metadataTitle,
      description: roomConfig.metadataDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: roomConfig.metadataTitle,
      description: roomConfig.metadataDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RoomPage({
                                         params,
                                       }: {
  params: Promise<{ emotion: string }>
}) {
  const { emotion } = await params
  return <RoomClient emotion={emotion} />
}
