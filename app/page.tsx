"use client"

import { EmotionGrid } from "@/components/emotion-grid"
import { SanctuaryRules } from "@/components/sanctuary-rules"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {Mail, LogOut, User, InstagramIcon} from "lucide-react"
import Image from "next/image"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function HomePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

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
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
              <Image
                src="/unmute-icon.jpeg"
                alt="UNMUTE logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              UNMUTE
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <span className="text-sm text-muted-foreground hidden sm:block">Anonymous. Safe. Healing.</span>
            
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
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 container mx-auto px-4 py-8" aria-label="Emotional support sanctuaries">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Section - Hero + Emotion Grid */}
          <div className="flex-1">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left mb-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 text-balance leading-tight">
                Anonymous Emotional Support
                <br />
                <span className="text-muted-foreground">Without Judgment</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Choose how you&apos;re feeling. Join a sanctuary with others who understand. Talk freely, stay anonymous, leave feeling lighter.
              </p>
            </motion.div>

            {/* Emotion Selection Grid */}
            <nav aria-label="Emotional support categories">
              <h2 className="sr-only">Choose Your Emotional Sanctuary</h2>
              <EmotionGrid />
            </nav>
          </div>

          {/* Right Section - Sanctuary Rules */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:w-80"
          >
            <SanctuaryRules />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border"  role="contentinfo">
        <div className="container mx-auto px-4 py-3">
          {/* Disclaimers */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
            <p className="text-xs text-muted-foreground">
              <strong>Crisis Support:</strong> If you&apos;re in crisis, please reach out to a{" "}
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
                aria-label="Find a crisis helpline near you"
              >
                crisis helpline
              </a>
            </p>

            {/* Contact Links */}
            <div className="flex flex-col gap-2">
              <a
                  href="mailto:unnmute@gmail.com"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email UNMUTE support"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                unnmute@gmail.com
              </a>

              <a
                  href="https://instagram.com/unmuteai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Visit UNMUTE Instagram profile"
              >
                <InstagramIcon className="w-3.5 h-3.5" aria-hidden="true" />
                @unmuteai
              </a>
            </div>
          </div>
          
          {/* Trust & Safety Disclaimers */}
          <div className="border-t border-border/50 pt-2 mt-2">
            <p className="text-[10px] text-muted-foreground/70 text-center">
              UNMUTE is a peer support community, not a medical service. All conversations are anonymous. 
              We do not provide professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
