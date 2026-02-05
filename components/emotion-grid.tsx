"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Brain, Heart, Flame, MessageCircle } from "lucide-react"

const emotions = [
  {
    id: "anxious",
    label: "ANXIOUS",
    description: "Racing thoughts, worry, unease",
    icon: Brain,
    gradient: "from-purple-600/20 via-purple-500/10 to-transparent",
    borderColor: "border-purple-500/30",
    hoverBorder: "hover:border-purple-400/60",
    iconColor: "text-purple-400",
  },
  {
    id: "lonely",
    label: "LONELY",
    description: "Isolated, disconnected, longing",
    icon: Heart,
    gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
    borderColor: "border-blue-500/30",
    hoverBorder: "hover:border-blue-400/60",
    iconColor: "text-blue-400",
  },
  {
    id: "burnt-out",
    label: "BURNT OUT",
    description: "Exhausted, depleted, overwhelmed",
    icon: Flame,
    gradient: "from-orange-600/20 via-orange-500/10 to-transparent",
    borderColor: "border-orange-500/30",
    hoverBorder: "hover:border-orange-400/60",
    iconColor: "text-orange-400",
  },
  {
    id: "just-talk",
    label: "JUST WANT TO TALK",
    description: "Need to be heard, share, connect",
    icon: MessageCircle,
    gradient: "from-emerald-600/20 via-emerald-500/10 to-transparent",
    borderColor: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-400/60",
    iconColor: "text-emerald-400",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

export function EmotionGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {emotions.map((emotion) => {
        const Icon = emotion.icon
        return (
          <motion.div key={emotion.id} variants={itemVariants}>
            <Link 
              href={`/room/${emotion.id}`} 
              prefetch={false}
              aria-label={`Enter the ${emotion.label} sanctuary for ${emotion.description}`}
            >
            <article
                className={`
                  relative overflow-hidden rounded-2xl p-6 md:p-8
                  bg-card border ${emotion.borderColor} ${emotion.hoverBorder}
                  transition-all duration-300 cursor-pointer
                  group min-h-[160px] flex flex-col justify-between
                  hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${emotion.gradient} opacity-50 group-hover:opacity-80 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`mb-4 ${emotion.iconColor}`} aria-hidden="true">
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground tracking-wide mb-2">
                    {emotion.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {emotion.description}
                  </p>
                </div>

                {/* Hover Indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                >
                  <div className={`text-xs ${emotion.iconColor} flex items-center gap-1`}>
                    <span>Enter sanctuary</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </motion.div>
              </article>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
