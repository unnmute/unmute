"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface FeltItButtonProps {
  answerId: string
  count: number
  onFeel: (nextHasFelt: boolean) => Promise<void>
  className?: string
}

export function FeltItButton({ answerId, count, onFeel, className = "mt-6" }: FeltItButtonProps) {
  const [hasFelt, setHasFelt] = useState(false)
  const [isFeeling, setIsFeeling] = useState(false)
  const storageKey = `unmute_felt_${answerId}`

  useEffect(() => {
    setHasFelt(localStorage.getItem(storageKey) === "true")
  }, [storageKey])

  const handleFeel = async () => {
    if (isFeeling) return

    const nextHasFelt = !hasFelt
    setIsFeeling(true)
    if (nextHasFelt) {
      localStorage.setItem(storageKey, "true")
    } else {
      localStorage.removeItem(storageKey)
    }
    setHasFelt(nextHasFelt)
    try {
      await onFeel(nextHasFelt)
    } catch {
      if (hasFelt) {
        localStorage.setItem(storageKey, "true")
      } else {
        localStorage.removeItem(storageKey)
      }
      setHasFelt(hasFelt)
    }
    setIsFeeling(false)
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <motion.button
        whileTap={{ scale: 0.96 }}
        animate={hasFelt ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.45 }}
        onClick={handleFeel}
        disabled={isFeeling}
        className={`
          inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition
          ${hasFelt ? "animate-[feltPulse_0.5s_ease]" : ""}
          ${
            hasFelt
              ? "border-amber-200/40 bg-amber-300/10 text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.12)]"
              : "border-border bg-background/40 text-muted-foreground hover:border-amber-200/30 hover:text-amber-100"
          }
          disabled:cursor-default
        `}
        aria-label={hasFelt ? "You felt this too" : "Felt it"}
      >
        <span aria-hidden="true" className={hasFelt ? "animate-pulse" : ""}>
          🫀
        </span>
        <span>{hasFelt ? "You felt this too" : "Felt it"}</span>
      </motion.button>
      <span className="text-xs text-muted-foreground">
        {count} {count === 1 ? "felt this" : "felt this"}
      </span>
    </div>
  )
}
