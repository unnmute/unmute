// app/room/[emotion]/page.tsx
import { RoomClient } from "./room-client"
import type { Metadata } from "next"

export const runtime = "edge"
export const dynamic = "force-dynamic"

const emotionMeta: Record<string, { title: string; description: string }> = {
  anxious: {
    title: "Anxiety Sanctuary — Anonymous Emotional Support | UNMUTE",
    description: "Join our anonymous Anxiety Sanctuary to talk openly about worry, racing thoughts, and unease. Connect with others who understand in a safe, judgment-free space.",
  },
  lonely: {
    title: "Loneliness Sanctuary — Anonymous Emotional Support | UNMUTE",
    description: "Join our anonymous Loneliness Sanctuary to talk openly about isolation and disconnection. Connect with others who understand in a safe, judgment-free space.",
  },
  "burnt-out": {
    title: "Burnout Sanctuary — Anonymous Emotional Support | UNMUTE",
    description: "Join our anonymous Burnout Sanctuary to talk openly about exhaustion and overwhelm. Connect with others who understand in a safe, judgment-free space.",
  },
  "just-talk": {
    title: "Connection Sanctuary — Anonymous Emotional Support | UNMUTE",
    description: "Join our anonymous Connection Sanctuary when you just need to talk. Connect with others who understand in a safe, judgment-free space.",
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ emotion: string }>
}): Promise<Metadata> {
  const { emotion } = await params
  const meta = emotionMeta[emotion] || emotionMeta.anxious
  
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
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
