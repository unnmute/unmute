"use client"

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import Link from "next/link"
import { Brain, Heart, Flame, MessageCircle } from "lucide-react"
import { ROOM_CONFIGS } from "@/lib/room-config"

const ROOM_ICONS = [Brain, Heart, Flame, MessageCircle]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants: Variants = {
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
        {ROOM_CONFIGS.map((room, index) => {
          const Icon = ROOM_ICONS[index] ?? MessageCircle
          return (
              <motion.div key={room.id} variants={itemVariants}>
                <Link
                    href={`/room/${room.id}`}
                    prefetch={false}
                    aria-label={`Enter the ${room.selectionLabel} sanctuary for ${room.selectionDescription}`}
                >
                  <article
                      className={`
                  relative overflow-hidden rounded-2xl p-6 md:p-8
                  bg-card border ${room.selectionCardBorderClass} ${room.selectionCardHoverBorderClass}
                  transition-all duration-300 cursor-pointer
                  group min-h-[160px] flex flex-col justify-between
                  hover:scale-[1.02] active:scale-[0.98]
                `}
                  >
                    {/* Background Gradient */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${room.selectionCardGradientClass} opacity-50 group-hover:opacity-80 transition-opacity duration-300`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className={`mb-4 ${room.selectionCardIconColorClass}`} aria-hidden="true">
                        <Icon className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground tracking-wide mb-2">
                        {room.selectionLabel}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {room.selectionDescription}
                      </p>
                    </div>

                    {/* Hover Indicator */}
                    <motion.div
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                    >
                      <div className={`text-xs ${room.selectionCardIconColorClass} flex items-center gap-1`}>
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
