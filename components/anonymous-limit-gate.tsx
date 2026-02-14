"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { signInWithGoogle } from "@/lib/auth-actions"

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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground/80" />
          <p className="text-sm text-muted-foreground">Checking access...</p>
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
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          className="mx-4 flex max-w-md flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center shadow-2xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Free Sessions Used
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You{"'"}ve used all 3 free anonymous sessions. Create a free
              account to continue joining rooms with no limits.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <button
              onClick={async () => {
                const result = await signInWithGoogle()
                if (result.url) {
                  window.location.href = result.url
                }
              }}
              className="flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:shadow-lg"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
            <Link
              href="/"
              className="mt-1 text-center text-sm text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              Back to home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
