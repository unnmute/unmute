"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getFingerprint } from "@/lib/fingerprint"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const FREE_SESSION_LIMIT = 3
const FREE_SESSION_COUNT_KEY = "unmute_free_anonymous_sessions_used"
const FREE_SESSION_ROOMS_KEY = "unmute_free_anonymous_session_rooms"

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
  room_alias?: string
}

export function useSession(emotion: string) {
  const router = useRouter()
  const [room, setRoom] = useState<Room | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anonymousId, setAnonymousId] = useState<string>("")
  const [freeLimitReached, setFreeLimitReached] = useState(false)
  const [freeSessionsUsed, setFreeSessionsUsed] = useState(0)

  // Initialize anonymous ID
  useEffect(() => {
    setAnonymousId(getFingerprint())
  }, [])

  const syncDeviceJoin = useCallback(async (user?: User | null) => {
    const fp = getFingerprint()
    if (!fp) return { isBanned: false, joinCount: 0 }
    const supabase = createClient()
    const deviceData: {
      fingerprint: string
      last_seen: string
      user_email?: string
      google_user_id?: string
    } = {
      fingerprint: fp,
      last_seen: new Date().toISOString(),
    }

    if (user?.email) {
      deviceData.user_email = user.email
      deviceData.google_user_id = user.id
    }

    const { error: upsertError } = await supabase
      .from("anonymous_device_joins")
      .upsert(
        deviceData,
        { onConflict: "fingerprint" }
      )

    if (upsertError) {
      console.error("Error registering device fingerprint:", upsertError)
    }

    const { data, error } = await supabase
      .from("anonymous_device_joins")
      .select("is_banned, join_count")
      .eq("fingerprint", fp)
      .maybeSingle()

    if (error) {
      console.error("Error checking ban status:", error)
      return { isBanned: false, joinCount: 0 }
    }

    return {
      isBanned: data?.is_banned === true,
      joinCount: typeof data?.join_count === "number" ? data.join_count : 0,
    }
  }, [])

  const incrementDeviceJoinCount = useCallback(async (user?: User | null) => {
    const fp = getFingerprint()
    if (!fp) return null

    const supabase = createClient()
    const { data } = await supabase
      .from("anonymous_device_joins")
      .select("join_count")
      .eq("fingerprint", fp)
      .maybeSingle()

    const nextCount = (typeof data?.join_count === "number" ? data.join_count : 0) + 1
    const updateData: {
      join_count: number
      last_seen: string
      last_joined_at: string
      user_email?: string
      google_user_id?: string
    } = {
      join_count: nextCount,
      last_seen: new Date().toISOString(),
      last_joined_at: new Date().toISOString(),
    }

    if (user?.email) {
      updateData.user_email = user.email
      updateData.google_user_id = user.id
    }

    const { error } = await supabase
      .from("anonymous_device_joins")
      .update(updateData)
      .eq("fingerprint", fp)

    if (error) {
      console.error("Error updating join count:", error)
      return null
    }

    return nextCount
  }, [])

  const getFreeSessionState = useCallback(() => {
    if (typeof window === "undefined") {
      return { count: 0, countedRooms: [] as string[] }
    }

    const count = Number(localStorage.getItem(FREE_SESSION_COUNT_KEY) || "0")
    let countedRooms: string[] = []

    try {
      const parsed = JSON.parse(localStorage.getItem(FREE_SESSION_ROOMS_KEY) || "[]")
      countedRooms = Array.isArray(parsed) ? parsed : []
    } catch {
      countedRooms = []
    }

    return {
      count: Number.isFinite(count) ? count : 0,
      countedRooms: Array.isArray(countedRooms) ? countedRooms : [],
    }
  }, [])

  const countFreeSessionForRoom = useCallback((roomId: string) => {
    const { count, countedRooms } = getFreeSessionState()
    if (countedRooms.includes(roomId)) return count

    const nextCount = count + 1
    localStorage.setItem(FREE_SESSION_COUNT_KEY, String(nextCount))
    localStorage.setItem(FREE_SESSION_ROOMS_KEY, JSON.stringify([...countedRooms, roomId]))
    setFreeSessionsUsed(nextCount)
    return nextCount
  }, [getFreeSessionState])

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient()
    const redirectTo = typeof window !== "undefined" ? window.location.href : undefined

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        skipBrowserRedirect: false,
      },
    })
  }, [])

  // Join a room and create a session
  const joinRoom = useCallback(async () => {
    if (!anonymousId) return
    if (!emotion || emotion === "undefined") {
      setError("Emotion is required")
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const isSignedIn = Boolean(user)
      const { count } = getFreeSessionState()
      const deviceJoin = await syncDeviceJoin(user)
      const trackedJoinCount = Math.max(count, deviceJoin.joinCount)

      setFreeSessionsUsed(trackedJoinCount)
      if (!isSignedIn && trackedJoinCount >= FREE_SESSION_LIMIT) {
        setFreeLimitReached(true)
        return
      }

      if (deviceJoin.isBanned) {
        router.replace("/banned")
        return
      }

      // Step 1: Find or create a room
      const roomResponse = await fetch(`/api/rooms?emotion=${emotion}`)
      const roomData = await roomResponse.json()

      if (!roomResponse.ok) {
        throw new Error(roomData.error || "Failed to find room")
      }

      setRoom(roomData.room)

      // Step 2: Join the room
      await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: roomData.room.id, action: "join" }),
      })

      // Step 3: Create a session
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

      if (!sessionResponse.ok) {
        throw new Error(sessionData.error || "Failed to create session")
      }

      setSession(sessionData.session)
      const nextTrackedCount = await incrementDeviceJoinCount(user)
      if (!isSignedIn) {
        const nextCount = countFreeSessionForRoom(roomData.room.id)
        const displayCount = Math.max(nextCount, nextTrackedCount || 0)
        setFreeSessionsUsed(displayCount)
      } else if (nextTrackedCount) {
        setFreeSessionsUsed(nextTrackedCount)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [emotion, anonymousId, getFreeSessionState, syncDeviceJoin, router, incrementDeviceJoinCount, countFreeSessionForRoom])

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
  const sendReaction = useCallback(async (reactionType: "with-you" | "holding" | "thank-you" | "take-time" | "not-alone") => {
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
    if (anonymousId && !room && !session) {
      joinRoom()
    }
  }, [anonymousId, room, session, joinRoom])

  return {
    room,
    session,
    isLoading,
    error,
    anonymousId,
    freeLimitReached,
    freeSessionsUsed,
    freeSessionLimit: FREE_SESSION_LIMIT,
    joinRoom,
    leaveRoom,
    sendReaction,
    saveReflection,
    signInWithGoogle,
  }
}
