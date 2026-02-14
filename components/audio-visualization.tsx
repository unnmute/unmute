"use client"

import { motion } from "framer-motion"
import { getRoomConfig } from "@/lib/room-config"

interface AudioVisualizationProps {
  isActive: boolean
  emotion: string
}

export function AudioVisualization({ isActive, emotion }: AudioVisualizationProps) {
  const color = getRoomConfig(emotion).sessionColor
  const barCount = 40

  return (
      <div className="flex items-center justify-center gap-1 h-24 px-8">
        {[...Array(barCount)].map((_, i) => {
          const delay = i * 0.05
          const baseHeight = Math.sin((i / barCount) * Math.PI) * 0.8 + 0.2

          return (
              <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    backgroundColor: color,
                    opacity: isActive ? 0.8 : 0.2,
                  }}
                  animate={
                    isActive
                        ? {
                          height: [
                            `${baseHeight * 20}px`,
                            `${baseHeight * 80}px`,
                            `${baseHeight * 40}px`,
                            `${baseHeight * 60}px`,
                            `${baseHeight * 20}px`,
                          ],
                          opacity: [0.4, 0.9, 0.6, 0.8, 0.4],
                        }
                        : {
                          height: `${baseHeight * 15}px`,
                          opacity: 0.15,
                        }
                  }
                  transition={
                    isActive
                        ? {
                          repeat: Infinity,
                          duration: 1.5 + Math.random() * 0.5,
                          delay: delay,
                          ease: "easeInOut",
                        }
                        : {
                          duration: 0.5,
                        }
                  }
              />
          )
        })}
      </div>
  )
}
