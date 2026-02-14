"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Mic, MicOff, LogOut, ArrowLeft, VolumeX } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/hooks/use-session"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { useAudioRoom } from "@/hooks/use-audio-room"
import { usePersistentTimer } from "@/hooks/use-persistent-timer"
import { SilentReactionsSimple } from "@/components/SilentReactionsSimple"
import { CountdownTimer } from "@/components/countdown-timer"
import { RoomConnectionLoader } from "@/components/room-connection-loader"
import { TermsAndConditionsGate } from "@/components/terms-and-conditions-gate"
import { createClient } from "@/lib/supabase/client"

const emotionConfig: Record<string, { label: string; color: string; bgGradient: string }> = {
  anxious: {
    label: "Anxiety Sanctuary",
    color: "text-purple-400",
    bgGradient: "from-purple-900/20 via-transparent to-transparent",
  },
  lonely: {
    label: "Loneliness Sanctuary",
    color: "text-blue-400",
    bgGradient: "from-blue-900/20 via-transparent to-transparent",
  },
  "burnt-out": {
    label: "Burnout Sanctuary",
    color: "text-orange-400",
    bgGradient: "from-orange-900/20 via-transparent to-transparent",
  },
  "just-talk": {
    label: "Connection Sanctuary",
    color: "text-emerald-400",
    bgGradient: "from-emerald-900/20 via-transparent to-transparent",
  },
}

const emotionColors: Record<string, string> = {
  anxious: "#a855f7",
  lonely: "#3b82f6",
  "burnt-out": "#f97316",
  "just-talk": "#10b981",
}

export function RoomClient({ emotion }: { emotion: string }) {
  const safeEmotion =
    emotion && emotionConfig[emotion] ? emotion : "anxious"
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  
  // Generate a stable anonymous user ID
  // const anonymousUserId = useMemo(() => {
  //   if (typeof window === "undefined") return "user-ssr"
  //   const stored = sessionStorage.getItem("unmute-user-id")
  //   if (stored) return stored
  //   const newId = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  //   sessionStorage.setItem("unmute-user-id", newId)
  //   return newId
  // }, [])
  const [anonymousUserId, setAnonymousUserId] = useState<string | null>(null)
  useEffect(() => {
    const stored = sessionStorage.getItem("unmute-user-id")
    if (stored) {
      setAnonymousUserId(stored)
    } else {
      const newId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      sessionStorage.setItem("unmute-user-id", newId)
      setAnonymousUserId(newId)
    } }, [])

  
  // Backend session management
  const { room, session, isLoading, error, leaveRoom, sendReaction, joinRoom } = useSession(safeEmotion)
  // Realtime presence and reactions
  const { 
    participants, 
    reactions: realtimeReactions, 
    isConnected: isRealtimeConnected, 
    broadcastReaction,
    myAvatar,
    participantCount
  } = useRealtimeRoom(room?.id || null, anonymousUserId)
  
  // Handle session completion - redirect to reflection
  const handleSessionComplete = useCallback(async () => {
    await leaveRoom(14 * 60) // Full session duration
    router.push(`/reflection?emotion=${safeEmotion}&sessionId=${session?.id || ""}`)
  }, [router, safeEmotion, leaveRoom, session?.id])
  
  // Persistent timer that survives page refreshes
  const {
    timeRemaining,
    isNewSession,
    isResumed,
    isCompleted,
    progress,
    isLastTwoMinutes,
    clearSession,
  } = usePersistentTimer({
    roomId: room?.id || null,
    emotion: safeEmotion,
    onComplete: handleSessionComplete,
  })
  
  // Audio room (LiveKit)
  const audioRoomName = room?.id ? `unmute-${room.id}` : "unmute-default"
  const {
    isConnected: isAudioConnected,
    isConnecting: isAudioConnecting,
    isMuted: audioIsMuted,
    audioEnabled,
    error: audioError,
    connect: connectAudio,
    toggleMute: toggleAudioMute,
    participantAudioLevels,
  } = useAudioRoom(
    audioRoomName,
    myAvatar ? myAvatar.name : "anonymous" 
  )

  
  // Sync local mute state with audio hook
  useEffect(() => {
    setIsMuted(audioIsMuted)
  }, [audioIsMuted])
  
  // Handle mute toggle - connect first if needed, then toggle via LiveKit API
  const handleToggleMute = useCallback(async () => {
    if (!isAudioConnected && !isAudioConnecting) {
      // First click: connect to LiveKit room (mic starts muted)
      await connectAudio()
      return
    }
    if (isAudioConnecting) {
      // Still connecting, ignore clicks
      return
    }
    // Connected: toggle mic via LiveKit's setMicrophoneEnabled
    toggleAudioMute()
  }, [connectAudio, toggleAudioMute, isAudioConnected, isAudioConnecting])


  const config = emotionConfig[safeEmotion] || emotionConfig.anxious
  const color = emotionColors[safeEmotion] || emotionColors.anxious

  // Terms and Conditions gate state
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasAcceptedTermsDB, setHasAcceptedTermsDB] = useState(false)
  const [termsLoading, setTermsLoading] = useState(true)

  useEffect(() => {
    const checkTermsStatus = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          setIsAuthenticated(true)
          // Check if the user has already accepted terms in the database
          const response = await fetch("/api/terms")
          const data = await response.json()
          if (data.hasAcceptedTerms) {
            setHasAcceptedTermsDB(true)
            setTermsAccepted(true)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch {
        // If check fails, default to showing the gate
      } finally {
        setTermsLoading(false)
      }
    }
    checkTermsStatus()
  }, [])

  const handleTermsAccept = useCallback(() => {
    setTermsAccepted(true)
    if (isAuthenticated) {
      setHasAcceptedTermsDB(true)
    }
  }, [isAuthenticated])

  const handleTermsCancel = useCallback(() => {
    router.push("/")
  }, [router])
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const isConnected = isRealtimeConnected

  const handleLeave = async () => {
    const durationSeconds = 14 * 60 - timeRemaining
    await leaveRoom(durationSeconds)
    clearSession()
    router.push(`/reflection?emotion=${safeEmotion}&sessionId=${session?.id || ""}`)
  }

  // if (!mounted || isLoading) {
  //   return (
  //     <main className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-pulse text-muted-foreground mb-2">Loading sanctuary...</div>
  //         {isLoading && (
  //           <div className="text-xs text-muted-foreground/60">Finding your room</div>
  //         )}
  //       </div>
  //     </main>
  //   )
  // }

  // Determine connection loader visibility
  const isRoomConnecting = !mounted || !anonymousUserId || isLoading
  const hasConnectionError = !!error


  return (
      <>
        {/* Terms and Conditions Gate */}
        {!termsLoading && !termsAccepted && (
          <TermsAndConditionsGate
            isAuthenticated={isAuthenticated}
            hasAcceptedTerms={hasAcceptedTermsDB}
            onAccept={handleTermsAccept}
            onCancel={handleTermsCancel}
          />
        )}

        {/* Immersive connection loader overlay */}
        <RoomConnectionLoader
            emotion={safeEmotion}
            isConnecting={isRoomConnecting}
            hasError={hasConnectionError}
            errorMessage={error || undefined}
            onRetry={() => joinRoom()}
        />

        <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`} />
        
        {/* Floating ambient orbs */}
        <div 
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-[0.03] blur-3xl animate-pulse"
          style={{ backgroundColor: color, animationDuration: '8s' }}
        />
        <div 
          className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full opacity-[0.05] blur-3xl animate-pulse"
          style={{ backgroundColor: color, animationDuration: '6s', animationDelay: '2s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02] blur-3xl"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" prefetch={false} aria-label="Return to home page">
            <button
                className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors hover:scale-105 active:scale-95"
                aria-label="Go back to sanctuary selection"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </button>
            </Link>
            <h1 className={`text-lg font-medium ${config.color} animate-in fade-in slide-in-from-left-2 duration-300`} aria-live="polite">
              {config.label}
            </h1>
          </div>
          <div className="text-sm text-muted-foreground animate-in fade-in duration-500 delay-200">
            {isCompleted ? "Session complete" : "Session in progress"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-28 pb-36 flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* Countdown Timer with persistence */}
        <div className="mb-8 animate-in fade-in zoom-in-95 duration-500 delay-300">
          <CountdownTimer
            timeRemaining={timeRemaining}
            emotion={emotion}
            progress={progress}
            isNewSession={isNewSession}
            isResumed={isResumed}
            isCompleted={isCompleted}
            isLastTwoMinutes={isLastTwoMinutes}
          />
        </div>

        {/* Audio Visualization - Calming Wave */}
        {!isCompleted && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <div className="relative">
              {/* Glow effect behind bars */}
              <div 
                className="absolute inset-0 blur-2xl opacity-20 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="flex items-center justify-center gap-[3px] h-28 px-8 relative">
                {[...Array(32)].map((_, i) => {
                  const baseHeight = Math.sin((i / 32) * Math.PI) * 0.8 + 0.2
                  return (
                    <div
                      key={i}
                      className="w-1.5 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: isLastTwoMinutes ? "#ef4444" : color,
                        opacity: isMuted ? 0.2 : 0.7,
                        height: isMuted ? `${baseHeight * 20}px` : `${baseHeight * 50}px`,
                        animation: isMuted ? "none" : `audioBar 2s ease-in-out ${i * 0.08}s infinite`,
                        boxShadow: isMuted ? 'none' : `0 0 10px ${color}40`,
                      }}
                    />
                  )
                })}
              </div>
            </div>
            {/* Status text */}
            <p className="text-center text-xs text-muted-foreground/60 mt-3">
              {isMuted ? "Your mic is muted" : "Speaking..."}
            </p>
          </div>
        )}

        {/* Participant Avatars + Mic Controls */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          {/* Connection status badge */}
          {/* Live member count */}
          <div className="flex justify-start mb-6 w-full max-w-md mx-auto">
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs
              ${isRealtimeConnected 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }
            `}>
              <span className={`w-2 h-2 rounded-full ${isRealtimeConnected ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
              {isRealtimeConnected 
                ? `${participantCount} ${participantCount === 1 ? "soul" : "souls"} present`
                : "Joining sanctuary..."
              }
            </div>
          </div>
          
          {/* Row: participants + mic/leave */}
          <div className="flex flex-col items-center justify-center gap-24 max-w-md mx-auto sm:flex-row sm:items-center sm:gap-24">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {participants.length > 0 ? (
                participants.slice(0, 10).map((participant, index) => {
                  const audioLevel = participantAudioLevels.get(participant.username) || 0
                  const isSpeaking = audioLevel > 0.1
                  const isMe = participant.userId === anonymousUserId
                  return (
                    <div
                      key={participant.userId}
                      className={`
                        relative w-14 h-14 rounded-full flex items-center justify-center 
                        animate-in fade-in zoom-in duration-300 transition-all
                        ${isMe ? "ring-2 ring-offset-2 ring-offset-background" : ""}
                        ${isSpeaking ? "scale-110" : ""}
                      `}
                      style={{ 
                        backgroundColor: `${color}15`,
                        borderWidth: '2px',
                        borderColor: isMe ? color : `${color}30`,
                        ringColor: color,
                        animationDelay: `${600 + index * 100}ms`
                      }}
                      title={participant.username}
                    >
                      <span className="text-xl">{participant.emoji}</span>
                      {isMe && (
                        <span 
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: color, color: '#000' }}
                        >
                          You
                        </span>
                      )}
                      {isSpeaking && (
                        <span className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-50" />
                      )}
                    </div>
                  )
                })
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: `${color}15`, borderWidth: '2px', borderColor: color }}
                >
                  <span className="text-xl">{myAvatar?.emoji || "?"}</span>
                </div>
              )}
            </div>

            {!isCompleted && (
              <>
                {/* Main mic button */}
                <div className="relative">
                  <button
                    onClick={handleToggleMute}
                    disabled={!isConnected}
                    className={`
                      relative w-16 h-16 rounded-full flex items-center justify-center
                      transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg
                      ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}
                      ${
                        isMuted
                          ? "bg-card text-muted-foreground border-2 border-border"
                          : "text-background"
                      }
                    `}
                    style={{ 
                      backgroundColor: isMuted ? undefined : color,
                      boxShadow: isMuted ? undefined : `0 0 24px ${color}40`
                    }}
                    title={!isConnected ? "Connecting..." : isMuted ? "Unmute" : "Mute"}
                    aria-label={!isConnected ? "Connecting to audio" : isMuted ? "Unmute microphone" : "Mute microphone"}
                    aria-pressed={!isMuted}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" aria-hidden="true" /> : <Mic className="w-6 h-6" aria-hidden="true" />}
                    {!isMuted && (
                      <div
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ backgroundColor: color, opacity: 0.2 }}
                      />
                    )}
                    {isAudioConnecting && (
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground animate-spin" style={{ animationDuration: "2s" }} />
                    )}
                  </button>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                    {isMuted ? "Tap to speak" : "Tap to mute"}
                  </span>
                </div>

                {/* Leave button */}
                <button
                  onClick={handleLeave}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-300 border border-border/50 hover:border-border text-sm"
                  aria-label="Leave the sanctuary and go to reflection"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium">Leave Quietly</span>
                </button>
              </>
            )}
          </div>
          
          {!audioEnabled && audioError && (
            <p className="text-xs text-muted-foreground/60 mt-4 text-center flex items-center justify-center gap-1">
              <VolumeX className="w-3 h-3" />
              Audio unavailable - reactions only
            </p>
          )}
        </div>

        {/* Calming message */}
        <div className="mt-10 text-center max-w-sm mx-auto animate-in fade-in duration-500 delay-700">
          {isCompleted ? (
            <p className="text-muted-foreground">Taking you to reflection...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {isMuted 
                  ? "Take your time. Speak when you're ready."
                  : "We hear you. You're not alone."}
              </p>
              <p className="text-xs text-muted-foreground/50 mt-2">
                Everything shared here stays here.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Silent Reactions */}
      {!isCompleted && (
        <SilentReactionsSimple 
          onSendReaction={async (type) => {
            await sendReaction(type)
            await broadcastReaction(type)
          }} 
          realtimeReactions={realtimeReactions}
          myUserId={anonymousUserId}
        />
      )}

      <style jsx>{`
        @keyframes audioBar {
          0%, 100% { transform: scaleY(0.5); opacity: 0.4; }
          50% { transform: scaleY(1.5); opacity: 0.9; }
        }
      `}</style>
    </main>
      </>
  )
}
