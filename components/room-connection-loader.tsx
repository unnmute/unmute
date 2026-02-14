"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw } from "lucide-react"

const emotionLoaderConfig: Record<
    string,
    { label: string; gradientFrom: string; gradientTo: string; pulseColor: string; ringColor: string }
> = {
  anxious: {
    label: "Anxiety Sanctuary",
    gradientFrom: "from-purple-950",
    gradientTo: "to-background",
    pulseColor: "bg-purple-500",
    ringColor: "ring-purple-500/20",
  },
  lonely: {
    label: "Loneliness Sanctuary",
    gradientFrom: "from-blue-950",
    gradientTo: "to-background",
    pulseColor: "bg-blue-500",
    ringColor: "ring-blue-500/20",
  },
  "burnt-out": {
    label: "Burnout Sanctuary",
    gradientFrom: "from-orange-950",
    gradientTo: "to-background",
    pulseColor: "bg-orange-500",
    ringColor: "ring-orange-500/20",
  },
  "just-talk": {
    label: "Connection Sanctuary",
    gradientFrom: "from-emerald-950",
    gradientTo: "to-background",
    pulseColor: "bg-emerald-500",
    ringColor: "ring-emerald-500/20",
  },
}

const CONNECTION_TIMEOUT_MS = 15000

interface RoomConnectionLoaderProps {
  emotion: string
  isConnecting: boolean
  hasError: boolean
  errorMessage?: string
  onRetry: () => void
}

export function RoomConnectionLoader({
                                       emotion,
                                       isConnecting,
                                       hasError,
                                       errorMessage,
                                       onRetry,
                                     }: RoomConnectionLoaderProps) {
  const [timedOut, setTimedOut] = useState(false)
  const config = emotionLoaderConfig[emotion] || emotionLoaderConfig.anxious

  // 15-second timeout
  useEffect(() => {
    if (!isConnecting) {
      setTimedOut(false)
      return
    }
    const timer = setTimeout(() => setTimedOut(true), CONNECTION_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [isConnecting])

  const showError = hasError || timedOut
  const visible = isConnecting || showError

  return (
      <AnimatePresence>
        {visible && (
            <motion.div
                key="room-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl"
            >
              {/* Gradient background */}
              <div
                  className={absolute inset-0 bg-gradient-to-b ${config.gradientFrom} ${config.gradientTo} opacity-80}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
                {/* Breathing pulse rings */}
                {!showError && (
                    <div className="relative flex items-center justify-center w-40 h-40">
                      {/* Outer ring */}
                      <motion.div
                          className={absolute inset-0 rounded-full ${config.pulseColor} opacity-[0.06]}
                          animate={{ scale: [1, 1.35, 1], opacity: [0.06, 0.02, 0.06] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {/* Middle ring */}
                      <motion.div
                          className={absolute inset-4 rounded-full ${config.pulseColor} opacity-[0.1]}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.04, 0.1] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4,
                          }}
                      />
                      {/* Inner ring */}
                      <motion.div
                          className={absolute inset-8 rounded-full ${config.pulseColor} opacity-[0.15]}
                          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.06, 0.15] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.8,
                          }}
                      />
                      {/* Center dot */}
                      <motion.div
                          className={w-4 h-4 rounded-full ${config.pulseColor} opacity-60}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                )}

                {/* Error state */}
                {showError && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center ring-1 ring-destructive/20">
                        <span className="text-2xl text-destructive">!</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-foreground font-medium text-lg">
                          {"We're having trouble connecting."}
                        </p>
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                          {errorMessage || "This might be a temporary issue. Let's try again."}
                        </p>
                      </div>
                      <button
                          onClick={onRetry}
                          className="flex items-center gap-2 px-6 py-3 rounded-full bg-card text-foreground border border-border hover:bg-secondary transition-colors text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </button>
                    </motion.div>
                )}

                {/* Connecting state text */}
                {!showError && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="space-y-3"
                    >
                      <p className="text-foreground font-medium text-lg tracking-tight">
                        Connecting you to a safe space...
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Hold on. Your room is getting ready.
                      </p>
                    </motion.div>
                )}
              </div>
            </motion.div>
        )}
      </AnimatePresence>
  )
}