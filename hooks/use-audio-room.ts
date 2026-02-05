// "use client"

// import { useState, useEffect, useCallback, useRef } from "react"

// interface AudioRoomState {
//   isConnected: boolean
//   isConnecting: boolean
//   isMuted: boolean
//   audioEnabled: boolean
//   error: string | null
//   participantAudioLevels: Map<string, number>
// }

// interface UseAudioRoomReturn extends AudioRoomState {
//   connect: () => Promise<void>
//   disconnect: () => void
//   toggleMute: () => void
//   setMuted: (muted: boolean) => void
// }

// export function useAudioRoom(
//   roomName: string,
//   participantName: string
// ): UseAudioRoomReturn {
//   const [state, setState] = useState<AudioRoomState>({
//     isConnected: false,
//     isConnecting: false,
//     isMuted: true,
//     audioEnabled: false,
//     error: null,
//     participantAudioLevels: new Map(),
//   })

//   const roomRef = useRef<any>(null)
//   const localTrackRef = useRef<MediaStreamTrack | null>(null)

//   const connect = useCallback(async () => {
//     setState((prev) => ({ ...prev, isConnecting: true, error: null }))

//     try {
//       // Get LiveKit token from our API
//       const response = await fetch("/api/livekit/token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ roomName, participantName }),
//       })

//       const data = await response.json()

//       // If LiveKit is not configured, gracefully degrade
//       if (!data.audioEnabled) {
//         setState((prev) => ({
//           ...prev,
//           isConnecting: false,
//           audioEnabled: false,
//           error: data.message || "Audio not available",
//         }))
//         return
//       }

//       // Dynamic import LiveKit client
//       const { Room, RoomEvent, Track } = await import("livekit-client")

//       const room = new Room({
//         adaptiveStream: true,
//         dynacast: true,
//       })

//       roomRef.current = room

//       // Set up event listeners
//       room.on(RoomEvent.Connected, () => {
//         setState((prev) => ({
//           ...prev,
//           isConnected: true,
//           isConnecting: false,
//           audioEnabled: true,
//         }))
//       })

//       room.on(RoomEvent.Disconnected, () => {
//         setState((prev) => ({
//           ...prev,
//           isConnected: false,
//           audioEnabled: false,
//         }))
//       })

//       room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
//         if (track.kind === Track.Kind.Audio) {
//           // Attach audio to play
//           const audioElement = track.attach()
//           document.body.appendChild(audioElement)
//         }
//       })

//       room.on(RoomEvent.TrackUnsubscribed, (track) => {
//         track.detach().forEach((el) => el.remove())
//       })

//       room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
//         const levels = new Map<string, number>()
//         speakers.forEach((speaker) => {
//           levels.set(speaker.identity, speaker.audioLevel || 0)
//         })
//         setState((prev) => ({ ...prev, participantAudioLevels: levels }))
//       })

//       // Connect to room
//       await room.connect(data.wsUrl, data.token)

//       // Start with microphone muted
//       await room.localParticipant.setMicrophoneEnabled(false)
//     } catch (error) {
//       console.error("Failed to connect to audio room:", error)
//       setState((prev) => ({
//         ...prev,
//         isConnecting: false,
//         error: "Failed to connect to audio room",
//       }))
//     }
//   }, [roomName, participantName])

//   const disconnect = useCallback(() => {
//     if (roomRef.current) {
//       roomRef.current.disconnect()
//       roomRef.current = null
//     }
//     if (localTrackRef.current) {
//       localTrackRef.current.stop()
//       localTrackRef.current = null
//     }
//     setState((prev) => ({
//       ...prev,
//       isConnected: false,
//       audioEnabled: false,
//     }))
//   }, [])

//   const toggleMute = useCallback(async () => {
//     if (!roomRef.current) return

//     const newMuted = !state.isMuted
//     setState((prev) => ({ ...prev, isMuted: newMuted }))

//     try {
//       await roomRef.current.localParticipant.setMicrophoneEnabled(!newMuted)
//     } catch (error) {
//       console.error("Failed to toggle mute:", error)
//     }
//   }, [state.isMuted])

//   const setMuted = useCallback(async (muted: boolean) => {
//     if (!roomRef.current) return

//     setState((prev) => ({ ...prev, isMuted: muted }))

//     try {
//       await roomRef.current.localParticipant.setMicrophoneEnabled(!muted)
//     } catch (error) {
//       console.error("Failed to set mute:", error)
//     }
//   }, [])

//   // Clean up on unmount
//   useEffect(() => {
//     return () => {
//       disconnect()
//     }
//   }, [disconnect])

//   return {
//     ...state,
//     connect,
//     disconnect,
//     toggleMute,
//     setMuted,
//   }
// }old

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
  enableMic: () => Promise<void>
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
  const localTrackRef = useRef<MediaStreamTrack | null>(null)

  const connect = useCallback(async () => {
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
        return
      }

      // Dynamic import LiveKit client
      const { Room, RoomEvent, Track } = await import("livekit-client")

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      })

      roomRef.current = room

      // Set up event listeners
      room.on(RoomEvent.Connected, () => {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          audioEnabled: true,
        }))
      })

      room.on(RoomEvent.Disconnected, () => {
        setState((prev) => ({
          ...prev,
          isConnected: false,
          audioEnabled: false,
        }))
      })

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === Track.Kind.Audio) {
          // Attach audio to play
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

      // Connect to room
      await room.connect(data.wsUrl, data.token)
    } catch (error) {
      console.error("Failed to connect to audio room:", error)
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Failed to connect to audio room",
      }))
    }
  }, [roomName, participantName])

  const enableMic = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState((prev) => ({ ...prev, error: "Microphone not supported in this browser" }))
      return
    }

    try {
      if (!roomRef.current) {
        await connect()
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const [track] = stream.getAudioTracks()

      if (!track) {
        setState((prev) => ({ ...prev, error: "No microphone track available" }))
        return
      }

      localTrackRef.current = track
      track.enabled = true

      if (roomRef.current) {
        await roomRef.current.localParticipant.publishTrack(track)
      }

      setState((prev) => ({ ...prev, isMuted: false, error: null }))
    } catch (error) {
      console.error("Failed to enable microphone:", error)
      setState((prev) => ({ ...prev, error: "Microphone permission denied or unavailable" }))
    }
  }, [connect])

  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect()
      roomRef.current = null
    }
    if (localTrackRef.current) {
      localTrackRef.current.stop()
      localTrackRef.current = null
    }
    setState((prev) => ({
      ...prev,
      isConnected: false,
      audioEnabled: false,
    }))
  }, [])

  const toggleMute = useCallback(async () => {
    const newMuted = !state.isMuted

    if (!newMuted && !localTrackRef.current) {
      await enableMic()
      return
    }

    if (localTrackRef.current) {
      localTrackRef.current.enabled = !newMuted
    }

    setState((prev) => ({ ...prev, isMuted: newMuted }))
  }, [enableMic, state.isMuted])

  const setMuted = useCallback(async (muted: boolean) => {
    if (!muted && !localTrackRef.current) {
      await enableMic()
      return
    }

    if (localTrackRef.current) {
      localTrackRef.current.enabled = !muted
    }

    setState((prev) => ({ ...prev, isMuted: muted }))
  }, [enableMic])

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
    enableMic,
    toggleMute,
    setMuted,
  }
}

