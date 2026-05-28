"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Mic, MicOff, LogOut, ArrowLeft, VolumeX, Flag } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/hooks/use-session"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { useAudioRoom } from "@/hooks/use-audio-room"
import { usePersistentTimer } from "@/hooks/use-persistent-timer"
import { SilentReactionsSimple } from "@/components/SilentReactionsSimple"
import { CountdownTimer } from "@/components/countdown-timer"
import { createClient } from "@/lib/supabase/client"
import { getFingerprint } from "@/lib/fingerprint"

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

type ReportReason = "harassment" | "hate_speech" | "inappropriate_content" | "self_harm_concern" | "other"

type ReportTarget = {
  id: string
  room_alias: string | null
}

const REPORT_REASONS: Array<{ id: ReportReason; label: string }> = [
  { id: "harassment", label: "Harassment" },
  { id: "hate_speech", label: "Hate speech" },
  { id: "inappropriate_content", label: "Inappropriate" },
  { id: "self_harm_concern", label: "Safety concern" },
  { id: "other", label: "Other" },
]

export function RoomClient({ emotion }: { emotion: string }) {
  const safeEmotion =
    emotion && emotionConfig[emotion] ? emotion : "anxious"
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showArrival, setShowArrival] = useState(false)
  const [firstTimerMessage, setFirstTimerMessage] = useState<"visible" | "exiting" | null>(null)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [showSessionOptions, setShowSessionOptions] = useState(false)
  const [showReportSheet, setShowReportSheet] = useState(false)
  const [reportStep, setReportStep] = useState<1 | 2>(1)
  const [reportTargets, setReportTargets] = useState<ReportTarget[]>([])
  const [selectedReportTarget, setSelectedReportTarget] = useState<ReportTarget | null>(null)
  const [selectedReportReason, setSelectedReportReason] = useState<ReportReason | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)
  const [reportToast, setReportToast] = useState<string | null>(null)
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const previousParticipantCount = useRef(0)
  const sessionCompletionHandled = useRef(false)
  
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
  const {
    room,
    session,
    leaveRoom,
    sendReaction,
    freeLimitReached,
    freeSessionLimit,
    signInWithGoogle,
  } = useSession(safeEmotion)
  
  // Realtime presence and reactions
  const { 
    participants, 
    reactions: realtimeReactions, 
    isConnected: isRealtimeConnected, 
    broadcastReaction,
    myAvatar,
    participantCount
  } = useRealtimeRoom(room?.id || null, anonymousUserId)
  
  // Handle session completion
  const handleSessionComplete = useCallback(async () => {
    if (sessionCompletionHandled.current) return
    sessionCompletionHandled.current = true
    setSessionEnded(true)
    await leaveRoom(14 * 60) // Full session duration
  }, [leaveRoom])
  
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
  
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setFirstTimerMessage("visible")
    }, 2000)
    const fadeOutTimer = setTimeout(() => {
      setFirstTimerMessage("exiting")
    }, 32000)
    const removeTimer = setTimeout(() => {
      setFirstTimerMessage(null)
    }, 35000)

    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  useEffect(() => {
    const previous = previousParticipantCount.current

    if (previous > 0 && participantCount > previous) {
      setShowArrival(true)
      const timer = setTimeout(() => {
        setShowArrival(false)
      }, 3500)

      previousParticipantCount.current = participantCount
      return () => clearTimeout(timer)
    }

    previousParticipantCount.current = participantCount
  }, [participantCount])

  useEffect(() => {
    if (!sessionEnded && !isCompleted) return

    const timer = setTimeout(() => {
      setShowSessionOptions(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionEnded, isCompleted])

  useEffect(() => {
    if (!mounted) return

    const checkBanStatus = async () => {
      const fingerprint = getFingerprint()
      if (!fingerprint) return
      const supabase = createClient()

      const { data, error } = await supabase
        .from("anonymous_device_joins")
        .select("is_banned")
        .eq("fingerprint", fingerprint)
        .maybeSingle()

      if (!error && data?.is_banned === true) {
        router.replace("/banned")
      }
    }

    checkBanStatus()
    const interval = setInterval(checkBanStatus, 5000)
    return () => clearInterval(interval)
  }, [mounted, router])

  useEffect(() => {
    if (!showReportSheet || !room?.id || !session?.id) return

    const loadReportTargets = async () => {
      setReportError(null)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("sessions")
        .select("id, room_alias")
        .eq("room_id", room.id)
        .neq("id", session.id)
        .neq("anonymous_id", getFingerprint())
        .is("left_at", null)

      if (error) {
        setReportError("Could not load people in this room.")
        return
      }

      setReportTargets(data || [])
    }

    loadReportTargets()
  }, [showReportSheet, room?.id, session?.id])

  const isConnected = isRealtimeConnected

  const handleLeave = async () => {
    const durationSeconds = 14 * 60 - timeRemaining
    await leaveRoom(durationSeconds)
    clearSession()
    router.push(`/reflection?emotion=${safeEmotion}&sessionId=${session?.id || ""}`)
  }

  const openReportSheet = () => {
    setReportStep(1)
    setReportTargets([])
    setSelectedReportTarget(null)
    setSelectedReportReason(null)
    setReportError(null)
    setShowReportSheet(true)
  }

  const closeReportSheet = () => {
    setShowReportSheet(false)
    setReportStep(1)
    setSelectedReportTarget(null)
    setSelectedReportReason(null)
    setReportError(null)
  }

  const submitReport = async () => {
    if (!room?.id || !selectedReportTarget || !selectedReportReason) return

    setIsSubmittingReport(true)
    setReportError(null)
    const supabase = createClient()

    const { data: sessionWithFp, error: sessionError } = await supabase
      .from("sessions")
      .select("room_alias, anonymous_id")
      .eq("id", selectedReportTarget.id)
      .single()

    if (sessionError || !sessionWithFp?.anonymous_id) {
      setIsSubmittingReport(false)
      setReportError("Could not submit this report.")
      return
    }

    const { error } = await supabase.from("reports").insert({
      reporter_fingerprint: getFingerprint(),
      reported_fingerprint: sessionWithFp.anonymous_id,
      reported_alias: sessionWithFp.room_alias || selectedReportTarget.room_alias || "Unknown soul",
      room_id: room.id,
      reason: selectedReportReason,
    })

    setIsSubmittingReport(false)

    if (error) {
      if (error.code === "23505" || error.message.toLowerCase().includes("one_report_per_pair_per_room")) {
        setReportError("You've already reported this person.")
        return
      }

      setReportError("Could not submit this report.")
      return
    }

    closeReportSheet()
    setReportToast("Report submitted. Thank you for keeping this safe.")
    setTimeout(() => {
      setReportToast(null)
    }, 3000)
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
  
  if (!mounted || !anonymousUserId) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-muted/50 to-muted/20 animate-pulse" />
          <div className="text-muted-foreground">
            Preparing your sanctuary...
          </div>
        </div>
      </main>
    )
  }

  if (freeLimitReached) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`} />
          <div
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05] blur-3xl"
            style={{ backgroundColor: color }}
          />
        </div>

        <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card/80 p-6 text-center shadow-2xl backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/50">
            Free Sessions Used
          </p>
          <h1 className="mt-4 text-2xl font-light text-foreground">
            You&apos;ve used all {freeSessionLimit} free anonymous sessions.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Sign in to continue joining rooms with no limits.
          </p>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Sign in with Google
          </button>
          <Link
            href="/"
            prefetch={false}
            className="mt-4 inline-flex text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
          >
            Return home
          </Link>
        </div>
      </main>
    )
  }


  return (
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
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link href="/" prefetch={false} aria-label="Return to home page">
            <button
                className="shrink-0 p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors hover:scale-105 active:scale-95"
                aria-label="Go back to sanctuary selection"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </button>
            </Link>
            <h1 className={`truncate text-base font-medium sm:text-lg ${config.color} animate-in fade-in slide-in-from-left-2 duration-300`} aria-live="polite">
              {config.label}
            </h1>
          </div>
          <div className="shrink-0 text-sm text-muted-foreground animate-in fade-in duration-500 delay-200">
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">{isCompleted ? "Session complete" : "Session in progress"}</span>
              {!isCompleted && (
                <button
                  type="button"
                  onClick={openReportSheet}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/70 text-muted-foreground shadow-sm transition-all hover:border-destructive/40 hover:text-destructive sm:h-8 sm:w-8"
                  aria-label="Report someone in this room"
                  title="Report"
                >
                  <Flag className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-40 flex min-h-screen flex-col items-center justify-start md:justify-center md:pt-28 md:pb-36 relative z-10">
        {/* Countdown Timer with persistence */}
        <div className="mt-8 mb-5 animate-in fade-in zoom-in-95 duration-500 delay-300 md:mt-0 md:mb-8">
          <CountdownTimer
            timeRemaining={timeRemaining}
            emotion={emotion}
            progress={progress}
            isNewSession={isNewSession}
            isResumed={isResumed}
            isCompleted={isCompleted}
            isLastTwoMinutes={isLastTwoMinutes}
            showArrival={showArrival}
          />
          {firstTimerMessage && !isCompleted && !sessionEnded && (
            <p
              className={`mt-5 text-center text-xs text-muted-foreground/30 transition-opacity duration-1000 ${
                firstTimerMessage === "visible" ? "opacity-100" : "opacity-0"
              }`}
            >
              Anonymous. Not recorded. Just present.
            </p>
          )}
        </div>

        {/* Mobile connection status badge */}
        <div className="mb-5 flex w-full max-w-md justify-center md:hidden">
          <div className={`
            inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs
            ${isRealtimeConnected
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
            }
          `}>
            <span className={`h-2 w-2 rounded-full ${isRealtimeConnected ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
            {isRealtimeConnected
              ? `${participantCount} ${participantCount === 1 ? "soul" : "souls"} present`
              : "Joining sanctuary..."
            }
          </div>
        </div>

        {/* Audio Visualization - Calming Wave */}
        {!isCompleted && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 md:mb-8">
            <div className="relative">
              {/* Glow effect behind bars */}
              <div 
                className="absolute inset-0 blur-2xl opacity-20 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="relative flex h-20 items-center justify-center gap-[3px] px-4 md:h-28 md:px-8">
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
          <div className="mb-6 hidden w-full max-w-md justify-start md:flex">
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
          <div className="mx-auto flex max-w-md items-center justify-center gap-4 md:gap-24">
            <div className="hidden items-center justify-center gap-2 flex-wrap md:flex">
              <div className="flex flex-col items-center">
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
                {session?.room_alias && (
                  <p className="mt-3 text-[11px] text-muted-foreground/40">
                    You are {session.room_alias}
                  </p>
                )}
              </div>
            </div>

            {!isCompleted && (
              <>
                {/* Main mic button */}
                <div className="relative">
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground">
                    {isMuted ? "tap when you're ready" : "Tap to mute"}
                  </span>
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
          {isCompleted || sessionEnded ? (
            <p className="text-muted-foreground">Taking a breath...</p>
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

      {reportToast && (
        <div className="fixed left-1/2 top-24 z-[130] -translate-x-1/2 rounded-full border border-border bg-card/95 px-4 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur-md">
          {reportToast}
        </div>
      )}

      {showReportSheet && !isCompleted && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[110] bg-black/30 backdrop-blur-[1px]"
            onClick={closeReportSheet}
            aria-label="Close report sheet"
          />
          <div className="fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-md rounded-2xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-md sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
            {reportStep === 1 ? (
              <div>
                <p className="text-sm font-medium text-foreground">Who are you reporting?</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {reportTargets.length > 0 ? (
                    reportTargets.map((target) => (
                      <button
                        key={target.id}
                        type="button"
                        onClick={() => {
                          setSelectedReportTarget(target)
                          setReportStep(2)
                          setReportError(null)
                        }}
                        className="rounded-full border border-border bg-card/40 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-border/80 hover:bg-card hover:text-foreground"
                      >
                        {target.room_alias || "Unknown soul"}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground/60">No one else is currently in this room.</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setReportStep(1)
                    setSelectedReportReason(null)
                    setReportError(null)
                  }}
                  className="mb-4 text-xs text-muted-foreground/60 hover:text-muted-foreground"
                >
                  ← Back
                </button>
                <p className="text-sm font-medium text-foreground">What&apos;s happening?</p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  Reporting {selectedReportTarget?.room_alias || "Unknown soul"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {REPORT_REASONS.map((reason) => (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => setSelectedReportReason(reason.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        selectedReportReason === reason.id
                          ? "border-destructive/50 bg-destructive/10 text-destructive"
                          : "border-border bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground"
                      }`}
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={submitReport}
                  disabled={!selectedReportReason || isSubmittingReport}
                  className="mt-5 w-full rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive transition-all hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmittingReport ? "Submitting..." : "Submit report"}
                </button>
              </div>
            )}

            {reportError && (
              <p className="mt-4 text-xs text-destructive/90">{reportError}</p>
            )}
          </div>
        </>
      )}

      {(isCompleted || sessionEnded) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/98 backdrop-blur-sm animate-session-complete">
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <p className="text-3xl font-light text-foreground/90 sm:text-4xl">
              This session is complete.
            </p>
            <p className="mt-4 text-sm text-muted-foreground/70 sm:text-base">
              You showed up for someone today.
            </p>

            {showSessionOptions && (
              <div className="mt-10 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700 sm:flex-row">
                <Link
                  href="/"
                  prefetch={false}
                  className="rounded-full border border-border bg-card/50 px-5 py-2.5 text-sm text-muted-foreground transition-all hover:border-border/80 hover:bg-card hover:text-foreground"
                >
                  Return home
                </Link>
                <Link
                  href="/"
                  prefetch={false}
                  className="rounded-full border px-5 py-2.5 text-sm transition-all hover:scale-[1.01]"
                  style={{
                    borderColor: `${color}55`,
                    backgroundColor: `${color}14`,
                    color,
                  }}
                >
                  Join another room
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes audioBar {
          0%, 100% { transform: scaleY(0.5); opacity: 0.4; }
          50% { transform: scaleY(1.5); opacity: 0.9; }
        }
        @keyframes session-complete {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-session-complete {
          animation: session-complete 1s ease forwards;
        }
      `}</style>
    </main>
  )
}
