"use client"

import { motion, AnimatePresence } from "framer-motion"
import { getRoomConfig } from "@/lib/room-config"

interface CountdownTimerProps {
  timeRemaining: number
  emotion: string
  progress?: number // 0 to 100 (percentage complete)
  isNewSession?: boolean
  isResumed?: boolean
  isCompleted?: boolean
  isLastTwoMinutes?: boolean
}

export function CountdownTimer({
                                 timeRemaining,
                                 emotion,
                                 progress = 0,
                                 isNewSession = false,
                                 isResumed = false,
                                 isCompleted = false,
                                 isLastTwoMinutes = false,
                               }: CountdownTimerProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const progressFraction = progress / 100 // Convert percentage to fraction
  const baseColor = getRoomConfig(emotion).sessionColor

  // Color changes to red in last 2 minutes
  const color = isLastTwoMinutes ? "#ef4444" : baseColor

  const circumference = 2 * Math.PI * 120 // radius of 120

  if (isCompleted) {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Background Circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-border"
            />
            {/* Full Progress Circle */}
            <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 8px #10b98140)" }}
            />
          </svg>

          {/* Completion Glow */}
          <motion.div
              className="absolute inset-4 rounded-full"
              style={{
                background: "radial-gradient(circle, #10b98120 0%, transparent 70%)",
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
          />

          {/* Completion Content */}
          <div className="relative z-10 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="text-4xl mb-2"
            >
              ✨
            </motion.div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-medium text-foreground"
            >
              Session Complete
            </motion.p>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground mt-1"
            >
              Take a breath...
            </motion.p>
          </div>
        </div>
    )
  }

  return (
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Status Indicator */}
        <AnimatePresence>
          {(isNewSession || isResumed) && (
              <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
                      isNewSession
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}
              >
                {isNewSession ? "New session" : `Resumed: ${minutes}:${String(seconds).padStart(2, "0")} left`}
              </motion.div>
          )}
        </AnimatePresence>

        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
          />
          {/* Progress Circle */}
          <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progressFraction)}
              style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
              transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Pulsing Glow Effect - more intense in last 2 minutes */}
        <motion.div
            className="absolute inset-4 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}${isLastTwoMinutes ? "20" : "10"} 0%, transparent 70%)`,
            }}
            animate={isLastTwoMinutes ? {
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.08, 1],
            } : {
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: isLastTwoMinutes ? 1.5 : 4,
              ease: "easeInOut",
            }}
        />

        {/* Time Display */}
        <div className="relative z-10 text-center">
          <motion.div
              key={timeRemaining}
              initial={{ scale: 1.05, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-5xl font-light tracking-tight transition-colors duration-300 ${
                  isLastTwoMinutes ? "text-red-400" : "text-foreground"
              }`}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </motion.div>
          <p className={`text-sm mt-2 transition-colors duration-300 ${
              isLastTwoMinutes ? "text-red-400/70" : "text-muted-foreground"
          }`}>
            {isLastTwoMinutes ? "almost there..." : "remaining"}
          </p>
        </div>

        {/* Ambient Dots */}
        {[...Array(8)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: color,
                  opacity: 0.4,
                  top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={isLastTwoMinutes ? {
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.8, 1.4, 0.8],
                } : {
                  opacity: [0.2, 0.5, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isLastTwoMinutes ? 1 : 3,
                  delay: i * 0.2,
                }}
            />
        ))}
      </div>
  )
}
