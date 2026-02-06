"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type {
  Room,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  LocalTrackPublication,
} from "livekit-client"

interface AudioRoomState {
  isConnected: boolean
  isConnecting: boolean
  isMuted: boolean
  audioEnabled: boolean
  error: string | null
  participantAudioLevels: Map<string, number>
}

interface UseAudioRoomReturn extends AudioRoomState {
  connect: () => Promise<void>
  disconnect: () => void
  toggleMute: () => Promise<void>
  setMuted: (muted: boolean) => Promise<void>
}

// 🔓 Browser audio unlock helper
async function unlockAudioContext() {
  const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext

  if (!AudioContext) return

  const context = new AudioContext()
  if (context.state === "suspended") {
    await context.resume()
  }
}

export function useAudioRoom(
    roomName: string,
    participantName: string
): UseAudioRoomReturn {
  const [state, setState] = useState<AudioRoomState>({
    isConnected: false,
    isConnecting: false,
    isMuted: true,
    audioEnabled: false,
    error: null,
    participantAudioLevels: new Map(),
  })

  const roomRef = useRef<Room | null>(null)
  const connectingRef = useRef(false)

  const connect = useCallback(async () => {
    if (connectingRef.current || roomRef.current) return
    connectingRef.current = true

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      // 🔑 Fetch token
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, participantName }),
      })

      const data = await response.json()
      if (!data?.audioEnabled) {
        throw new Error(data?.message || "Audio not enabled")
      }

      // 🔓 MUST be triggered by user click
      await unlockAudioContext()

      const { Room, RoomEvent, Track } = await import("livekit-client")

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        autoSubscribe: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // ✅ Connected
      room.on(RoomEvent.Connected, () => {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          audioEnabled: true,
        }))
      })

      room.on(RoomEvent.Disconnected, () => {
        roomRef.current = null
        connectingRef.current = false
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          audioEnabled: false,
          isMuted: true,
        }))
      })

      // 🔊 Attach remote audio
      room.on(
          RoomEvent.TrackSubscribed,
          (
              track: RemoteTrack,
              _pub: RemoteTrackPublication,
              _participant: RemoteParticipant
          ) => {
            if (track.kind === Track.Kind.Audio) {
              const el = track.attach()
              el.autoplay = true
              el.muted = false
              el.playsInline = true
              document.body.appendChild(el)
            }
          }
      )

      room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
        track.detach().forEach((el) => el.remove())
      })

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const levels = new Map<string, number>()
        speakers.forEach((s) =>
            levels.set(s.identity, s.audioLevel ?? 0)
        )
        setState((prev) => ({
          ...prev,
          participantAudioLevels: levels,
        }))
      })

      room.on(
          RoomEvent.LocalTrackPublished,
          (_pub: LocalTrackPublication) => {
            setState((prev) => ({ ...prev, isMuted: false }))
          }
      )

      room.on(RoomEvent.TrackMuted, (pub, participant) => {
        if (participant.isLocal && pub.source === Track.Source.Microphone) {
          setState((prev) => ({ ...prev, isMuted: true }))
        }
      })

      room.on(RoomEvent.TrackUnmuted, (pub, participant) => {
        if (participant.isLocal && pub.source === Track.Source.Microphone) {
          setState((prev) => ({ ...prev, isMuted: false }))
        }
      })

      await room.connect(data.wsUrl, data.token)
      roomRef.current = room

      // Start muted
      await room.localParticipant.setMicrophoneEnabled(false)
      connectingRef.current = false
    } catch (err) {
      console.error("LiveKit connect failed:", err)
      connectingRef.current = false
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Failed to connect to audio room",
      }))
    }
  }, [roomName, participantName])

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect()
    roomRef.current = null
    connectingRef.current = false
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      audioEnabled: false,
      isMuted: true,
    }))
  }, [])

  const toggleMute = useCallback(async () => {
    if (!roomRef.current) return
    const nextMuted = !state.isMuted
    await roomRef.current.localParticipant.setMicrophoneEnabled(!nextMuted)
    setState((prev) => ({ ...prev, isMuted: nextMuted }))
  }, [state.isMuted])

  const setMuted = useCallback(async (muted: boolean) => {
    if (!roomRef.current) return
    await roomRef.current.localParticipant.setMicrophoneEnabled(!muted)
    setState((prev) => ({ ...prev, isMuted: muted }))
  }, [])

  useEffect(() => () => disconnect(), [disconnect])

  return {
    ...state,
    connect,
    disconnect,
    toggleMute,
    setMuted,
  }
}