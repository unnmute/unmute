// "use client"

// import { useEffect, useState, useCallback, useRef } from "react"
// import { createClient } from "@/lib/supabase/client"
// import type { RealtimeChannel } from "@supabase/supabase-js"

// interface Participant {
//   userId: string
//   username: string
//   emoji: string
//   joinedAt: Date
// }

// interface RealtimeReaction {
//   id: string
//   userId: string
//   username?: string
//   emoji?: string
//   type: "heart" | "wave" | "peace"
//   timestamp: number
// }

// const ANIMAL_EMOJIS = ["🐦", "🐱", "🐟", "🐰", "🐿️", "🦊", "🐻", "🐼", "🦁", "🐨"]
// const ANONYMOUS_NAMES = [
//   "Anonymous Bird",
//   "Anonymous Cat", 
//   "Anonymous Fish",
//   "Anonymous Rabbit",
//   "Anonymous Squirrel",
//   "Anonymous Fox",
//   "Anonymous Bear",
//   "Anonymous Panda",
//   "Anonymous Lion",
//   "Anonymous Koala",
// ]

// function getRandomAnimal(userId: string): { emoji: string; name: string } {
//   // Use oderId to consistently assign same animal to same user
//   const index = Math.abs(userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % ANIMAL_EMOJIS.length
//   return {
//     emoji: ANIMAL_EMOJIS[index],
//     name: ANONYMOUS_NAMES[index],
//   }
// }

// export function useRealtimeRoom(roomId: string | null, userId: string) {
//   const [participants, setParticipants] = useState<Participant[]>([])
//   const [reactions, setReactions] = useState<RealtimeReaction[]>([])
//   const [isConnected, setIsConnected] = useState(false)
//   const channelRef = useRef<RealtimeChannel | null>(null)
//   const supabase = createClient()

//   // Generate consistent avatar for this user
//   const myAvatar = getRandomAnimal(userId)

//   useEffect(() => {
//     if (!roomId) return

//     const channelName = `room:${roomId}`
    
//     // Create the channel with presence tracking
//     const channel = supabase.channel(channelName, {
//       config: {
//         presence: {
//           key: userId,
//         },
//       },
//     })

//     channelRef.current = channel

//     // Handle presence sync - when we first join, get all current participants
//     channel.on("presence", { event: "sync" }, () => {
//       const presenceState = channel.presenceState()
//       const currentParticipants: Participant[] = []
      
//       for (const key in presenceState) {
//         const presence = presenceState[key]?.[0] as { username: string; emoji: string; joinedAt: string } | undefined
//         if (presence) {
//           currentParticipants.push({
//             userId: key,
//             username: presence.username,
//             emoji: presence.emoji,
//             joinedAt: new Date(presence.joinedAt),
//           })
//         }
//       }
      
//       setParticipants(currentParticipants)
//     })

//     // Handle when someone joins
//     channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
//       const presence = newPresences[0] as { username: string; emoji: string; joinedAt: string } | undefined
//       if (presence && key) {
//         setParticipants((prev) => {
//           // Check if already exists
//           if (prev.some((p) => p.userId === key)) return prev
//           return [
//             ...prev,
//             {
//               userId: key,
//               username: presence.username,
//               emoji: presence.emoji,
//               joinedAt: new Date(presence.joinedAt),
//             },
//           ]
//         })
//       }
//     })

//     // Handle when someone leaves
//     channel.on("presence", { event: "leave" }, ({ key }) => {
//       if (key) {
//         setParticipants((prev) => prev.filter((p) => p.userId !== key))
//       }
//     })

//     // Handle broadcast reactions
//     channel.on("broadcast", { event: "reaction" }, ({ payload }) => {
//       const reaction = payload as RealtimeReaction
//       setReactions((prev) => [...prev, reaction])
      
//       // Remove reaction after 2 seconds
//       setTimeout(() => {
//         setReactions((prev) => prev.filter((r) => r.id !== reaction.id))
//       }, 2000)
//     })

//     // Subscribe and track presence
//     channel.subscribe(async (status) => {
//       if (status === "SUBSCRIBED") {
//         setIsConnected(true)
        
//         // Track our presence
//         await channel.track({
//           username: myAvatar.name,
//           emoji: myAvatar.emoji,
//           joinedAt: new Date().toISOString(),
//         })
//       }
//     })

//     return () => {
//       channel.unsubscribe()
//       channelRef.current = null
//       setIsConnected(false)
//     }
//   }, [roomId, userId, supabase, myAvatar.name, myAvatar.emoji])

//   // Function to broadcast a reaction
//   const broadcastReaction = useCallback(
//     async (type: "heart" | "wave" | "peace") => {
//       if (!channelRef.current || !isConnected) return

//       const reaction: RealtimeReaction = {
//         id: `${userId}-${Date.now()}`,
//         userId,
//         username: myAvatar.name,
//         emoji: myAvatar.emoji,
//         type,
//         timestamp: Date.now(),
//       }

//       await channelRef.current.send({
//         type: "broadcast",
//         event: "reaction",
//         payload: reaction,
//       })
//     },
//     [userId, isConnected, myAvatar.name, myAvatar.emoji]
//   )

//   return {
//     participants,
//     reactions,
//     isConnected,
//     broadcastReaction,
//     myAvatar,
//     participantCount: participants.length,
//   }
// }old

"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface Participant {
  userId: string
  username: string
  emoji: string
  joinedAt: Date
}

interface RealtimeReaction {
  id: string
  userId: string
  username?: string
  emoji?: string
  type: "heart" | "wave" | "peace"
  timestamp: number
}

const ANIMAL_EMOJIS = ["🐦", "🐱", "🐟", "🐰", "🐿️", "🦊", "🐻", "🐼", "🦁", "🐨"]
const ANONYMOUS_NAMES = [
  "Anonymous Bird",
  "Anonymous Cat",
  "Anonymous Fish",
  "Anonymous Rabbit",
  "Anonymous Squirrel",
  "Anonymous Fox",
  "Anonymous Bear",
  "Anonymous Panda",
  "Anonymous Lion",
  "Anonymous Koala",
]

function getRandomAnimal(userId: string) {
  const index =
    Math.abs(
      userId
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % ANIMAL_EMOJIS.length

  return {
    emoji: ANIMAL_EMOJIS[index],
    name: ANONYMOUS_NAMES[index],
  }
}

export function useRealtimeRoom(roomId: string | null, userId: string | null) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [reactions, setReactions] = useState<RealtimeReaction[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const channelRef = useRef<RealtimeChannel | null>(null)
  // Use a ref to keep the supabase client stable across renders
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  // 🔒 DO NOT generate avatar until userId exists
  const myAvatar = userId ? getRandomAnimal(userId) : null

  useEffect(() => {
    // 🔴 HARD GUARDS (THIS FIXES "CONNECTING...")
    console.log("[v0] useRealtimeRoom effect:", { roomId, userId, hasAvatar: !!myAvatar })
    if (!roomId || !userId || !myAvatar) {
      console.log("[v0] useRealtimeRoom skipping - missing:", { roomId: !roomId, userId: !userId, myAvatar: !myAvatar })
      return
    }

    setIsConnected(false)
    setParticipants([])

    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    channelRef.current = channel

    // Presence sync
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState()
      const list: Participant[] = []

      for (const key in state) {
        const presence = state[key]?.[0] as any
        if (presence) {
          list.push({
            userId: key,
            username: presence.username,
            emoji: presence.emoji,
            joinedAt: new Date(presence.joinedAt),
          })
        }
      }

      setParticipants(list)
    })

    // Join
    channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
      const presence = newPresences?.[0] as any
      if (!key || !presence) return

      setParticipants((prev) =>
        prev.some((p) => p.userId === key)
          ? prev
          : [
              ...prev,
              {
                userId: key,
                username: presence.username,
                emoji: presence.emoji,
                joinedAt: new Date(presence.joinedAt),
              },
            ]
      )
    })

    // Leave
    channel.on("presence", { event: "leave" }, ({ key }) => {
      if (!key) return
      setParticipants((prev) => prev.filter((p) => p.userId !== key))
    })

    // Reactions
    channel.on("broadcast", { event: "reaction" }, ({ payload }) => {
      const reaction = payload as RealtimeReaction
      setReactions((prev) => [...prev, reaction])

      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== reaction.id))
      }, 2000)
    })

    channel.subscribe((status, err) => {
      console.log("[v0] Realtime subscription status:", status, err ? `Error: ${err.message}` : "")

      if (status === "SUBSCRIBED") {
        console.log("[v0] Realtime SUBSCRIBED - setting isConnected to true")
        setIsConnected(true)

        channel.track({
          username: myAvatar.name,
          emoji: myAvatar.emoji,
          joinedAt: new Date().toISOString(),
        }).then(() => {
          console.log("[v0] Presence tracked successfully")
        }).catch((trackErr) => {
          console.log("[v0] Presence track error:", trackErr)
        })
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        console.log("[v0] Realtime connection failed:", status)
        setIsConnected(false)
      }
    })

    return () => {
      // ✅ CORRECT CLEANUP (VERY IMPORTANT)
      supabase.removeChannel(channel)
      channelRef.current = null
      setIsConnected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId, myAvatar?.name, myAvatar?.emoji])

  const broadcastReaction = useCallback(
    async (type: "heart" | "wave" | "peace") => {
      if (!channelRef.current || !isConnected || !userId || !myAvatar) return

      const reaction: RealtimeReaction = {
        id: `${userId}-${Date.now()}`,
        userId,
        username: myAvatar.name,
        emoji: myAvatar.emoji,
        type,
        timestamp: Date.now(),
      }

      await channelRef.current.send({
        type: "broadcast",
        event: "reaction",
        payload: reaction,
      })
    },
    [isConnected, userId, myAvatar]
  )

  return {
    participants,
    reactions,
    isConnected,
    broadcastReaction,
    myAvatar,
    participantCount: participants.length,
  }
}
