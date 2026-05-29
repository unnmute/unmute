// components/homepage-client.tsx
"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Mail, LogOut, User, X } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { EchoesPreview } from "./echoes-preview"
import { SanctuaryRules } from "./sanctuary-rules"

const LISTENER_POPUP_SEEN_KEY = "unmute_listener_popup_seen"

export function HomepageClient() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showListenerPopup, setShowListenerPopup] = useState(false)
  const supabase = createClient()
  const bookingUrl =
    process.env.NEXT_PUBLIC_LISTENER_BOOKING_URL ||
    "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/viewform"

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (localStorage.getItem(LISTENER_POPUP_SEEN_KEY) === "true") return

    const timer = setTimeout(() => {
      setShowListenerPopup(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const dismissListenerPopup = () => {
    localStorage.setItem(LISTENER_POPUP_SEEN_KEY, "true")
    setShowListenerPopup(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setAuthError(null)
    try {
      // Get the current origin for redirect
      const currentOrigin = window.location.origin
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${currentOrigin}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          skipBrowserRedirect: false,
        },
      })
      if (error) {
        if (error.message.includes("provider is not enabled")) {
          setAuthError("Google Sign-In is being configured. Please try again later or continue anonymously.")
        } else if (error.message.includes("localhost")) {
          setAuthError("OAuth redirect issue. Please ensure Supabase Site URL is configured correctly.")
        } else {
          setAuthError(error.message)
        }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setAuthError("Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <>
      {/* Header Auth Section */}
      <div className="flex items-center gap-4">
        <nav className="hidden items-center gap-3 sm:flex" aria-label="UNMUTE spaces">
          <Link
            href="/listen"
            className="rounded-full border border-teal-300 bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-900 shadow-[0_0_18px_rgba(20,184,166,0.08)] transition-all hover:border-teal-400 hover:bg-teal-200 hover:text-teal-950 dark:border-teal-300/25 dark:bg-teal-300/10 dark:text-teal-100 dark:hover:border-teal-200/45 dark:hover:bg-teal-300/15 dark:hover:text-white"
          >
            Meet Mira.
          </Link>
          <Link
            href="/echoes"
            className="rounded-full border border-rose-300 bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-900 shadow-[0_0_18px_rgba(244,63,94,0.08)] transition-all hover:border-rose-400 hover:bg-rose-200 hover:text-rose-950 dark:border-rose-300/25 dark:bg-rose-300/10 dark:text-rose-100 dark:hover:border-rose-200/45 dark:hover:bg-rose-300/15 dark:hover:text-white"
          >
            Echoes
          </Link>
          <Link
            href="/unsent"
            className="rounded-full border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 shadow-[0_0_18px_rgba(245,158,11,0.08)] transition-all hover:border-amber-400 hover:bg-amber-200 hover:text-amber-950 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-100 dark:hover:border-amber-200/45 dark:hover:bg-amber-300/15 dark:hover:text-white"
          >
            Unsent
          </Link>
        </nav>
        <ThemeToggle />
        
        {/* Auth Button */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border border-border hover:bg-secondary transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>
        )}
        {authError && (
          <div className="absolute top-full right-4 mt-2 p-3 bg-card border border-destructive/30 rounded-lg text-xs text-destructive max-w-xs shadow-lg z-[60]">
            <p className="font-medium mb-1">Sign-in unavailable</p>
            <p className="text-muted-foreground">{authError}</p>
            <p className="text-muted-foreground mt-2">You can still use the app anonymously - no sign-in required!</p>
          </div>
        )}
      </div>

      {/* EchoesPreview and Listener Popup */}
      <EchoesPreview />

      {showListenerPopup && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2px]">
          <button
            type="button"
            className="absolute inset-0"
            onClick={dismissListenerPopup}
            aria-label="Close listener booking popup"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-background/95 p-6 text-center shadow-2xl backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="listener-popup-title"
          >
            <button
              type="button"
              onClick={dismissListenerPopup}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <p id="listener-popup-title" className="pr-6 text-xl font-light leading-snug text-foreground">
              Want to talk to a real human listener?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free Private 30-min sessions available.
            </p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismissListenerPopup}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-teal-400/30 bg-teal-400/8 px-5 py-2.5 text-sm text-teal-500 transition-all hover:border-teal-400/50 hover:bg-teal-400/15 dark:text-teal-300"
            >
              Book a free first session →
            </a>
          </motion.div>
        </div>
      )}

      {/* Mobile Footer Navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 py-2 backdrop-blur-md sm:hidden"
        aria-label="UNMUTE mobile spaces"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <Link
            href="/listen"
            className="rounded-full border border-teal-300 bg-teal-100 px-2 py-2 text-center text-xs font-semibold text-teal-900 dark:border-teal-300/25 dark:bg-teal-300/10 dark:text-teal-100"
          >
            Meet Mira.
          </Link>
          <Link
            href="/echoes"
            className="rounded-full border border-rose-300 bg-rose-100 px-2 py-2 text-center text-xs font-semibold text-rose-900 dark:border-rose-300/25 dark:bg-rose-300/10 dark:text-rose-100"
          >
            Echoes
          </Link>
          <Link
            href="/unsent"
            className="rounded-full border border-amber-300 bg-amber-100 px-2 py-2 text-center text-xs font-semibold text-amber-900 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-100"
          >
            Unsent
          </Link>
        </div>
      </nav>
    </>
  )
}
