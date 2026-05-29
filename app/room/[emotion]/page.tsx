// app/room/[emotion]/page.tsx
import { RoomClient } from "./room-client"
import type { Metadata } from "next"

// Allow static generation with generateStaticParams
export const revalidate = 3600 // ISR: revalidate every hour

const roomSlugMap: Record<string, string> = {
  anxious: "anxious",
  lonely: "lonely",
  "burnt-out": "burnt-out",
  "just-talk": "just-talk",
}

const emotionMeta: Record<string, { 
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  roomName: string
  roomDescription: string
  sanctuaryRules: string[]
}> = {
  anxious: {
    title: "Anxious & Can't Stop Worrying? Talk Anonymously | UNMUTE",
    description: "Join our anonymous Anxiety Sanctuary to share your worries, racing thoughts, and unease. Connect with compassionate listeners who understand anxiety in a safe, judgment-free space.",
    ogTitle: "Anxious & Can't Stop Worrying? Talk Anonymously | UNMUTE",
    ogDescription: "Join our anonymous Anxiety Sanctuary to talk openly about worry, racing thoughts, and unease. Connect with others who understand in a safe, judgment-free space.",
    roomName: "Anxiety Sanctuary",
    roomDescription: "A safe space for those experiencing anxiety, worry, or racing thoughts. Share openly and connect with empathetic listeners.",
    sanctuaryRules: [
      "Listen with empathy and without judgment",
      "Respect anonymity and confidentiality",
      "No recordings or screenshots",
      "Support, don't fix",
      "Honor boundaries and self-care",
    ],
  },
  lonely: {
    title: "Feeling Lonely? Find Your People Anonymously | UNMUTE",
    description: "Join our anonymous Loneliness Sanctuary to overcome isolation and disconnection. Connect with others who understand loneliness in a safe, judgment-free space.",
    ogTitle: "Feeling Lonely? Find Your People Anonymously | UNMUTE",
    ogDescription: "Join our anonymous Loneliness Sanctuary to talk openly about isolation and disconnection. Connect with others who understand in a safe, judgment-free space.",
    roomName: "Loneliness Sanctuary",
    roomDescription: "A welcoming space for those feeling isolated or disconnected. Share your feelings and find genuine connection with others.",
    sanctuaryRules: [
      "Listen with empathy and without judgment",
      "Respect anonymity and confidentiality",
      "No recordings or screenshots",
      "Support, don't fix",
      "Honor boundaries and self-care",
    ],
  },
  "burnt-out": {
    title: "Burnt Out & Exhausted? Anonymous Support | UNMUTE",
    description: "Join our anonymous Burnout Sanctuary to talk about exhaustion and overwhelm. Connect with others who understand burnout in a safe, judgment-free space.",
    ogTitle: "Burnt Out & Exhausted? Anonymous Support | UNMUTE",
    ogDescription: "Join our anonymous Burnout Sanctuary to talk openly about exhaustion and overwhelm. Connect with others who understand in a safe, judgment-free space.",
    roomName: "Burnout Sanctuary",
    roomDescription: "A restorative space for those experiencing burnout and exhaustion. Share your struggles and find support from understanding listeners.",
    sanctuaryRules: [
      "Listen with empathy and without judgment",
      "Respect anonymity and confidentiality",
      "No recordings or screenshots",
      "Support, don't fix",
      "Honor boundaries and self-care",
    ],
  },
  "just-talk": {
    title: "Just Need to Talk? Anonymous Listener Available | UNMUTE",
    description: "Join our anonymous Connection Sanctuary when you just need to talk. Connect with compassionate listeners in a safe, judgment-free space.",
    ogTitle: "Just Need to Talk? Anonymous Listener Available | UNMUTE",
    ogDescription: "Join our anonymous Connection Sanctuary when you just need to talk. Connect with others who understand in a safe, judgment-free space.",
    roomName: "Connection Sanctuary",
    roomDescription: "A space where you can simply talk and be heard. Share whatever's on your mind with a compassionate listener.",
    sanctuaryRules: [
      "Listen with empathy and without judgment",
      "Respect anonymity and confidentiality",
      "No recordings or screenshots",
      "Support, don't fix",
      "Honor boundaries and self-care",
    ],
  },
}

export function generateStaticParams() {
  return [
    { emotion: "anxious" },
    { emotion: "lonely" },
    { emotion: "burnt-out" },
    { emotion: "just-talk" },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ emotion: string }>
}): Promise<Metadata> {
  const { emotion } = await params
  const meta = emotionMeta[emotion] || emotionMeta.anxious
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "https://unmute.app"
  const canonicalUrl = `${baseUrl}/room/${roomSlugMap[emotion] || emotion}`
  
  return {
    title: meta.title,
    description: meta.description,
    canonical: canonicalUrl,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      type: "website",
      url: canonicalUrl,
      siteName: "UNMUTE",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.ogDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ emotion: string }>
}) {
  const { emotion } = await params
  const meta = emotionMeta[emotion] || emotionMeta.anxious
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "https://unmute.app"
  const canonicalUrl = `${baseUrl}/room/${roomSlugMap[emotion] || emotion}`

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.roomName,
    description: meta.roomDescription,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "UNMUTE",
    },
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      
      {/* Canonical Tag */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Static HTML Shell - hidden from users but present in HTML for SEO crawling */}
      <div suppressHydrationWarning className="hidden">
        <header>
          <h1>{meta.roomName}</h1>
          <p>{meta.roomDescription}</p>
        </header>

        <main>
          <section>
            <h2>Sanctuary Rules</h2>
            <ul>
              {meta.sanctuaryRules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>About This Space</h2>
            <p>
              {meta.roomDescription} All conversations are completely anonymous and confidential. 
              Join compassionate listeners and be heard in a judgment-free environment.
            </p>
          </section>
        </main>
      </div>

      {/* Client component renders the actual interactive UI */}
      <RoomClient emotion={emotion} />
    </>
  )
}
