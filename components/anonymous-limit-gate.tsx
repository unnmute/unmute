"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface AnonymousLimitGateProps {
  isAuthenticated: boolean
  onAllowed: () => void
  onBlocked: () => void
}

export function AnonymousLimitGate({
  isAuthenticated,
  onAllowed,
  onBlocked,
}: AnonymousLimitGateProps) {
  const [status, setStatus] = useState<
    "loading" | "allowed" | "blocked" | "error"
  >("loading")
  const [remaining, setRemaining] = useState(3)
  const [fingerprint, setFingerprint] = useState<string | null>(null)

  // Get device fingerprint
  useEffect(() => {
    if (isAuthenticated) {
      // Authenticated users bypass the limit entirely
      setStatus("allowed")
      onAllowed()
      return
    }

    async function loadFingerprint() {
      try {
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs")
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        setFingerprint(result.visitorId)
      } catch {
        // If fingerprinting fails, allow access but don't track
        setStatus("allowed")
        onAllowed()
      }
    }

    loadFingerprint()
  }, [isAuthenticated, onAllowed])

  // Check join limit once we have a fingerprint
  useEffect(() => {
    if (!fingerprint || isAuthenticated) return

    async function checkLimit() {
      try {
        const response = await fetch(
          `/api/anonymous-limit?fingerprint=${fingerprint}`
        )
        const data = await response.json()

        if (data.blocked) {
          setStatus("blocked")
          setRemaining(0)
          onBlocked()
        } else {
          setRemaining(data.remaining)
          setStatus("allowed")
          onAllowed()
        }
      } catch {
        // On error, allow access
        setStatus("allowed")
        onAllowed()
      }
    }

    checkLimit()
  }, [fingerprint, isAuthenticated, onAllowed, onBlocked])

  // When allowed, increment the join count
  const incrementJoinCount = useCallback(async () => {
    if (!fingerprint || isAuthenticated) return

    try {
      await fetch("/api/anonymous-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
      })
    } catch {
      // Silently fail
    }
  }, [fingerprint, isAuthenticated])

  // Increment join count when allowed
  useEffect(() => {
    if (status === "allowed" && fingerprint && !isAuthenticated) {
      incrementJoinCount()
    }
  }, [status, fingerprint, isAuthenticated, incrementJoinCount])

  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f0f0f]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
          <p className="text-sm text-white/50">Checking access...</p>
        </motion.div>
      </div>
    )
  }

  if (status === "allowed" || isAuthenticated) {
    // Show a subtle remaining-joins notice for anonymous users
    if (!isAuthenticated && remaining <= 2 && remaining > 0) {
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="fixed left-1/2 top-4 z-[9999] -translate-x-1/2"
          >
            <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm text-amber-400 backdrop-blur-md border border-amber-500/20">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                {remaining === 1
                  ? "Last free session. Sign up to keep access."
                  : `${remaining} free sessions left. Sign up to keep access.`}
              </span>
              <Link
                href="/?auth=signup"
                className="ml-2 font-medium text-amber-300 underline underline-offset-2 hover:text-amber-200 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      )
    }
    return null
  }

  // Blocked state
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f0f0f]/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          className="mx-4 flex max-w-md flex-col items-center gap-6 rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 text-center shadow-2xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Free Sessions Used
            </h2>
            <p className="text-white/60 leading-relaxed">
              You{"'"}ve used all 3 free anonymous sessions. Create a free
              account to continue joining rooms with no limits.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Link
              href="/?auth=signup"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:brightness-110"
            >
              <LogIn className="h-4 w-4" />
              Create Free Account
            </Link>
            <Link
              href="/?auth=login"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              Already have an account? Sign in
            </Link>
            <Link
              href="/"
              className="mt-1 text-sm text-white/40 transition-colors hover:text-white/60"
            >
              Back to home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
