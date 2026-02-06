"use client"

import { useState, useEffect, useCallback, useRef } from "react"

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
  toggleMute: () => void
  setMuted: (muted: boolean) => void
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

  const roomRef = useRef<any>(null)
  const connectingRef = useRef(false)

  const connect = useCallback(async () => {
    // Prevent double-connect race condition
    if (connectingRef.current || roomRef.current) return
    connectingRef.current = true

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      // Get LiveKit token from our API
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, participantName }),
      })

      const data = await response.json()

      // If LiveKit is not configured, gracefully degrade
      if (!data.audioEnabled) {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          audioEnabled: false,
          error: data.message || "Audio not available",
        }))
        connectingRef.current = false
        return
      }

      // Dynamic import LiveKit client
      const { Room, RoomEvent, Track } = await import("livekit-client")

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Set up event listeners BEFORE connecting
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

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach()
          document.body.appendChild(audioElement)
        }
      })

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((el) => el.remove())
      })

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const levels = new Map<string, number>()
        speakers.forEach((speaker) => {
          levels.set(speaker.identity, speaker.audioLevel || 0)
        })
        setState((prev) => ({ ...prev, participantAudioLevels: levels }))
      })

      // Handle local track mute/unmute events to keep state in sync
      room.on(RoomEvent.LocalTrackPublished, () => {
        setState((prev) => ({ ...prev, isMuted: false }))
      })

      room.on(RoomEvent.TrackMuted, (publication, participant) => {
        if (participant.isLocal && publication.source === Track.Source.Microphone) {
          setState((prev) => ({ ...prev, isMuted: true }))
        }
      })

      room.on(RoomEvent.TrackUnmuted, (publication, participant) => {
        if (participant.isLocal && publication.source === Track.Source.Microphone) {
          setState((prev) => ({ ...prev, isMuted: false }))
        }
      })

      // Connect to room
      await room.connect(data.wsUrl, data.token)
      roomRef.current = room

      // Start with microphone muted (use LiveKit's built-in mic management)
      await room.localParticipant.setMicrophoneEnabled(false)
      connectingRef.current = false
    } catch (error) {
      console.error("Failed to connect to audio room:", error)
      connectingRef.current = false
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Failed to connect to audio room",
      }))
    }
  }, [roomName, participantName])

  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect()
      roomRef.current = null
    }
    connectingRef.current = false
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      audioEnabled: false,
      isMuted: true,
    }))
  }, [])

  // Use LiveKit's setMicrophoneEnabled for proper audio track management
  const toggleMute = useCallback(async () => {
    if (!roomRef.current) return

    const newMuted = !state.isMuted

    try {
      // LiveKit handles getUserMedia, track publishing, echo cancellation, etc.
      await roomRef.current.localParticipant.setMicrophoneEnabled(!newMuted)
      setState((prev) => ({ ...prev, isMuted: newMuted }))
    } catch (error) {
      console.error("Failed to toggle mute:", error)
      setState((prev) => ({ ...prev, error: "Microphone permission denied or unavailable" }))
    }
  }, [state.isMuted])

  const setMuted = useCallback(async (muted: boolean) => {
    if (!roomRef.current) return

    try {
      await roomRef.current.localParticipant.setMicrophoneEnabled(!muted)
      setState((prev) => ({ ...prev, isMuted: muted }))
    } catch (error) {
      console.error("Failed to set mute:", error)
    }
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    ...state,
    connect,
    disconnect,
    toggleMute,
    setMuted,
  }
}

