"use client"

import { useState, useCallback, useEffect } from "react"

interface Room {
  id: string
  emotion: string
  participant_count: number
  expires_at: string
}

interface Session {
  id: string
  room_id: string
  anonymous_id: string
  emotion: string
  joined_at: string
}

// Generate a unique anonymous ID for this browser session
function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return ""
  
  let anonymousId = sessionStorage.getItem("unmute_anonymous_id")
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem("unmute_anonymous_id", anonymousId)
  }
  return anonymousId
}

export function useSession(emotion: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anonymousId, setAnonymousId] = useState<string>("")

  // Initialize anonymous ID
  useEffect(() => {
    setAnonymousId(getOrCreateAnonymousId())
  }, [])

  // Join a room and create a session
  const joinRoom = useCallback(async () => {
    console.log("[v0] joinRoom called with:", { anonymousId, emotion })
    if (!anonymousId) {
      console.log("[v0] joinRoom aborted: no anonymousId")
      return
    }
    if (!emotion || emotion === "undefined") {
      console.log("[v0] joinRoom aborted: invalid emotion")
      setError("Emotion is required")
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Find or create a room
      console.log("[v0] Step 1: Finding room for emotion:", emotion)
      const roomResponse = await fetch(`/api/rooms?emotion=${emotion}`)
      const roomData = await roomResponse.json()
      console.log("[v0] Room API response:", { ok: roomResponse.ok, roomData })

      if (!roomResponse.ok) {
        throw new Error(roomData.error || "Failed to find room")
      }

      // Step 2: Join the room
      console.log("[v0] Step 2: Joining room:", roomData.room.id)
      const joinResponse = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: roomData.room.id, action: "join" }),
      })
      const joinData = await joinResponse.json()
      console.log("[v0] Join API response:", { ok: joinResponse.ok, joinData })
      if (!joinResponse.ok) {
        throw new Error(joinData.error || "Failed to join room")
      }

      setRoom(roomData.room)
      console.log("[v0] Room state set:", roomData.room)

      // Step 3: Create a session
      console.log("[v0] Step 3: Creating session")
      const sessionResponse = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomData.room.id,
          anonymousId,
          emotion,
        }),
      })
      const sessionData = await sessionResponse.json()
      console.log("[v0] Session API response:", { ok: sessionResponse.ok, sessionData })

      if (!sessionResponse.ok) {
        throw new Error(sessionData.error || "Failed to create session")
      }

      setSession(sessionData.session)
      console.log("[v0] Session state set:", sessionData.session)
    } catch (err) {
      console.log("[v0] joinRoom error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
      console.log("[v0] joinRoom completed, isLoading set to false")
    }
  }, [emotion, anonymousId])

  // Leave the room and end the session
  const leaveRoom = useCallback(async (durationSeconds: number) => {
    if (!room || !session) return

    try {
      // End the session
      await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          durationSeconds,
        }),
      })

      // Leave the room
      await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room.id, action: "leave" }),
      })
    } catch (err) {
      console.error("Error leaving room:", err)
    }
  }, [room, session])

  // Send a reaction
  const sendReaction = useCallback(async (reactionType: "heart" | "wave" | "peace") => {
    if (!room || !session) return

    try {
      await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          sessionId: session.id,
          reactionType,
        }),
      })
    } catch (err) {
      console.error("Error sending reaction:", err)
    }
  }, [room, session])

  // Save reflection
  const saveReflection = useCallback(async (
      feelingBefore: number,
      feelingAfter: number,
      gratitudeNote?: string
  ) => {
    if (!session) return

    try {
      await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          feelingBefore,
          feelingAfter,
          gratitudeNote,
        }),
      })
    } catch (err) {
      console.error("Error saving reflection:", err)
    }
  }, [session])

  // Auto-join when component mounts
  useEffect(() => {
    console.log("[v0] useSession auto-join check:", { anonymousId, hasRoom: !!room, hasSession: !!session, emotion })
    if (anonymousId && !room && !session) {
      console.log("[v0] useSession calling joinRoom")
      joinRoom()
    }
  }, [anonymousId, room, session, joinRoom, emotion])

  return {
    room,
    session,
    isLoading,
    error,
    anonymousId,
    joinRoom,
    leaveRoom,
    sendReaction,
    saveReflection,
  }
}
