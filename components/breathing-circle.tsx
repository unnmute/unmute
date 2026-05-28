"use client"

import { motion } from "framer-motion"

interface BreathingCircleProps {
  emotion: string
}

const emotionColors: Record<string, string> = {
  anxious: "#a855f7",
  lonely: "#3b82f6",
  "burnt-out": "#f97316",
  "just-talk": "#10b981",
}

export function BreathingCircle({ emotion }: BreathingCircleProps) {
  const color = emotionColors[emotion] || emotionColors.anxious

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      />

      {/* Middle Ring */}
      <motion.div
        className="absolute w-36 h-36 rounded-full border"
        style={{ borderColor: `${color}30` }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Inner Circle */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          boxShadow: `0 0 40px ${color}30`,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      />

      {/* Center Dot */}
      <motion.div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      />

      {/* Breathing Text */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      >
        <span className="text-xs text-muted-foreground tracking-wider">
          breathe
        </span>
      </motion.div>
    </div>
  )
}
