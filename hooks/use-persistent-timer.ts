"use client"

import { useEffect, useRef, useState, useCallback } from "react"

type PersistentTimerOptions = {
  roomId: string | null
  emotion: string
  durationSeconds?: number
  onComplete?: () => void
}

type StoredTimer = {
  startTime: number
  duration: number
}

export function usePersistentTimer({
                                     roomId,
                                     emotion,
                                     durationSeconds = 14 * 60,
                                     onComplete,
                                   }: PersistentTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isNewSession, setIsNewSession] = useState(false)
  const [isResumed, setIsResumed] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null)

  const storageKey = `unmute-timer-${emotion}-${roomId ?? "pending"}`
  const channelName = `unmute-timer-${emotion}`

  const clearSession = useCallback(() => {
    if (typeof window === "undefined") return
    localStorage.removeItem(storageKey)
    const channel = broadcastChannelRef.current
    if (!channel) return
    try {
      channel.postMessage({ type: "clear" })
    } catch {
      // Channel can be closed during unmount; ignore.
    }
  }, [storageKey])

  // 🔹 Init timer from storage
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!roomId) return

    const stored = localStorage.getItem(storageKey)

    if (!stored) {
      const startTime = Date.now()
      const data: StoredTimer = {
        startTime,
        duration: durationSeconds,
      }

      localStorage.setItem(storageKey, JSON.stringify(data))
      setIsNewSession(true)
      setTimeRemaining(durationSeconds)
      return
    }

    try {
      const parsed: StoredTimer = JSON.parse(stored)
      const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000)
      const remaining = Math.max(parsed.duration - elapsed, 0)

      setIsResumed(true)
      setTimeRemaining(remaining)

      if (remaining <= 0) {
        setIsCompleted(true)
        onComplete?.()
      }
    } catch {
      localStorage.removeItem(storageKey)
    }
  }, [roomId, storageKey, durationSeconds, onComplete])

  // 🔹 Tick every second
  useEffect(() => {
    if (isCompleted) return

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsCompleted(true)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isCompleted, onComplete])

  // 🔹 BroadcastChannel (browser-only)
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("BroadcastChannel" in window)) return

    const channel = new BroadcastChannel(channelName)
    broadcastChannelRef.current = channel

    channel.onmessage = (event) => {
      if (event.data?.type === "clear") {
        localStorage.removeItem(storageKey)
        setIsCompleted(true)
        setTimeRemaining(0)
      }
    }

    return () => {
      channel.close()
      if (broadcastChannelRef.current === channel) {
        broadcastChannelRef.current = null
      }
    }
  }, [channelName, storageKey])

  const progress =
      ((durationSeconds - timeRemaining) / durationSeconds) * 100

  const isLastTwoMinutes = timeRemaining <= 120 && timeRemaining > 0

  return {
    timeRemaining,
    progress,
    isNewSession,
    isResumed,
    isCompleted,
    isLastTwoMinutes,
    clearSession,
  }
}
