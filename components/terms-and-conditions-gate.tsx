"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TermsAndConditionsGateProps {
  isAuthenticated: boolean
  hasAcceptedTerms: boolean
  onAccept: () => void
  onCancel: () => void
}

export function TermsAndConditionsGate({
  isAuthenticated,
  hasAcceptedTerms,
  onAccept,
  onCancel,
}: TermsAndConditionsGateProps) {
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If authenticated and already accepted, don't show
  if (isAuthenticated && hasAcceptedTerms) {
    return null
  }

  const handleAccept = async () => {
    if (!agreed) return

    setIsSubmitting(true)

    if (isAuthenticated) {
      try {
        const response = await fetch("/api/terms", { method: "POST" })
        if (!response.ok) {
          console.error("Failed to save terms acceptance")
          setIsSubmitting(false)
          return
        }
      } catch {
        console.error("Error saving terms acceptance")
        setIsSubmitting(false)
        return
      }
    }

    onAccept()
    setIsSubmitting(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        aria-labelledby="terms-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] shadow-2xl"
        >
          {/* Subtle top glow */}
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="p-6 sm:p-8">
            {/* Title */}
            <h2
              id="terms-title"
              className="text-xl sm:text-2xl font-semibold text-[#f0f0f0] mb-2 tracking-tight"
            >
              Before You Enter
            </h2>
            <p className="text-sm text-[#888] mb-5 leading-relaxed">
              Unmute is a peer-support space, not a medical or emergency service.
            </p>

            {/* Scrollable Content */}
            <div className="max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
              <div className="space-y-3 text-sm text-[#b0b0b0] leading-relaxed">
                <p className="text-[#ccc] font-medium">
                  By entering, you confirm that:
                </p>
                <ul className="space-y-2.5 pl-1">
                  {[
                    "You are 18 years or older.",
                    "You understand this is not professional medical or psychiatric advice.",
                    "If you are in crisis, you will contact emergency services.",
                    "You will not post abusive, hateful, illegal, or harmful content.",
                    "You are responsible for what you share.",
                    "Conversations may be moderated for safety.",
                    "You agree to our Terms & Privacy Policy.",
                    "These terms are governed by the laws of India.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-indigo-400/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 mt-6 cursor-pointer group select-none">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only peer"
                  aria-label="I understand and agree to the above"
                />
                <div className="h-5 w-5 rounded-md border border-[#333] bg-[#1a1a1a] transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500/20 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0f0f0f] group-hover:border-[#444]" />
                <svg
                  className="absolute h-3 w-3 text-indigo-400 opacity-0 peer-checked:opacity-100 transition-opacity"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8.5l3.5 3.5 6.5-8" />
                </svg>
              </div>
              <span className="text-sm text-[#999] group-hover:text-[#bbb] transition-colors">
                I understand and agree to the above.
              </span>
            </label>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#888] bg-[#1a1a1a] border border-[#2a2a2a] hover:bg-[#222] hover:text-[#aaa] hover:border-[#333] transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={!agreed || isSubmitting}
                className="flex-1 relative px-4 py-2.5 rounded-xl text-sm font-medium text-[#f0f0f0] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden group"
                style={{
                  background: agreed
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "#1a1a1a",
                  border: agreed
                    ? "1px solid rgba(129, 140, 248, 0.3)"
                    : "1px solid #2a2a2a",
                }}
              >
                {/* Hover glow */}
                {agreed && (
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(99,102,241,0.3)" }} />
                )}
                <span className="relative">
                  {isSubmitting ? "Entering..." : "Enter Room"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </AnimatePresence>
  )
}
