"use client"

import { motion } from "framer-motion"
import { Bird, Cat, Fish, Rabbit, Squirrel } from "lucide-react"

interface ParticipantAvatarsProps {
  emotion: string
}

const emotionColors: Record<string, string> = {
  anxious: "border-purple-500/40",
  lonely: "border-blue-500/40",
  "burnt-out": "border-orange-500/40",
  "just-talk": "border-emerald-500/40",
}

const participants = [
  { id: 1, icon: Bird, isSpeaking: false },
  { id: 2, icon: Cat, isSpeaking: true },
  { id: 3, icon: Fish, isSpeaking: false },
  { id: 4, icon: Rabbit, isSpeaking: false },
  { id: 5, icon: Squirrel, isSpeaking: false },
]

export function ParticipantAvatars({ emotion }: ParticipantAvatarsProps) {
  const borderColor = emotionColors[emotion] || emotionColors.anxious

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-muted-foreground mb-4">
        {participants.length} anonymous listeners
      </p>
      <div className="flex items-center -space-x-3">
        {participants.map((participant, index) => {
          const Icon = participant.icon
          return (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
              className="relative"
            >
              <div
                className={`
                  w-12 h-12 rounded-full bg-card border-2 ${borderColor}
                  flex items-center justify-center
                  ${participant.isSpeaking ? "ring-2 ring-foreground/30 ring-offset-2 ring-offset-background" : ""}
                `}
              >
                <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              {participant.isSpeaking && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <span className="w-1 h-1 rounded-full bg-foreground" />
                  <span className="w-1 h-1 rounded-full bg-foreground" />
                  <span className="w-1 h-1 rounded-full bg-foreground" />
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
