"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Waves, Feather } from "lucide-react"

interface Reaction {
  id: number
  type: "heart" | "wave" | "peace"
  x: number
}

const reactionConfig = {
  heart: {
    icon: Heart,
    label: "I feel this",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/40",
    iconColor: "text-pink-400",
    hoverBg: "hover:bg-pink-500/30",
  },
  wave: {
    icon: Waves,
    label: "Keep flowing",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/40",
    iconColor: "text-blue-400",
    hoverBg: "hover:bg-blue-500/30",
  },
  peace: {
    icon: Feather,
    label: "You're not alone",
    bgColor: "bg-slate-200/20",
    borderColor: "border-slate-300/40",
    iconColor: "text-slate-300",
    hoverBg: "hover:bg-slate-200/30",
  },
}

export function SilentReactions() {
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [nextId, setNextId] = useState(0)

  const sendReaction = (type: "heart" | "wave" | "peace") => {
    const newReaction: Reaction = {
      id: nextId,
      type,
      x: Math.random() * 60 - 30, // Random x offset
    }
    setReactions((prev) => [...prev, newReaction])
    setNextId((prev) => prev + 1)

    // Remove reaction after animation
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id))
    }, 2000)
  }

  return (
    <>
      {/* Floating Reactions */}
      <div className="fixed bottom-36 right-8 pointer-events-none">
        <AnimatePresence>
          {reactions.map((reaction) => {
            const config = reactionConfig[reaction.type]
            const Icon = config.icon
            return (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 1, y: 0, x: reaction.x, scale: 1 }}
                animate={{ opacity: 0, y: -120, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute bottom-0 right-6"
              >
                <Icon className={`w-6 h-6 ${config.iconColor}`} fill="currentColor" />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Reaction Buttons */}
      <div className="fixed bottom-24 right-4 md:right-8 flex flex-col gap-3">
        {(Object.keys(reactionConfig) as Array<keyof typeof reactionConfig>).map(
          (type) => {
            const config = reactionConfig[type]
            const Icon = config.icon
            return (
              <motion.button
                key={type}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => sendReaction(type)}
                className={`
                  group relative w-12 h-12 rounded-full
                  ${config.bgColor} ${config.borderColor} ${config.hoverBg}
                  border backdrop-blur-sm
                  flex items-center justify-center
                  transition-all duration-200
                `}
              >
                <Icon className={`w-5 h-5 ${config.iconColor}`} strokeWidth={1.5} />
                {/* Tooltip */}
                <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {config.label}
                </span>
              </motion.button>
            )
          }
        )}
      </div>
    </>
  )
}
