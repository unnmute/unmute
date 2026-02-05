"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"

export default function AuthConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const supabaseRef = useRef<SupabaseClient | null>(null)

  useEffect(() => {
    // Initialize Supabase client on client-side
    if (typeof window !== "undefined" && !supabaseRef.current) {
      supabaseRef.current = createClient()
    }
    
    const handleAuthCallback = async () => {
      const supabase = supabaseRef.current
      if (!supabase) {
        setStatus("error")
        setErrorMessage("Failed to initialize authentication client.")
        return
      }
      
      try {
        // Check if there's a hash fragment with tokens (implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        
        if (accessToken) {
          // Set the session from hash params
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          })
          
          if (error) {
            setStatus("error")
            setErrorMessage(error.message)
            return
          }
          
          setStatus("success")
          // Redirect to home after a short delay
          setTimeout(() => router.push("/"), 1000)
          return
        }

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setStatus("success")
          setTimeout(() => router.push("/"), 1000)
          return
        }

        // Check for error in URL
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get("error")
        if (error) {
          setStatus("error")
          setErrorMessage(urlParams.get("error_description") || urlParams.get("message") || error)
          return
        }

        // No tokens, no session - something went wrong
        setStatus("error")
        setErrorMessage("Authentication failed. Please try again.")
      } catch (err) {
        console.error("Auth callback error:", err)
        setStatus("error")
        setErrorMessage("An unexpected error occurred.")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        {status === "loading" && (
          <>
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Completing sign in...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-foreground font-medium">Signed in successfully!</p>
            <p className="text-muted-foreground text-sm mt-1">Redirecting...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-foreground font-medium">Sign in failed</p>
            <p className="text-muted-foreground text-sm mt-1">{errorMessage}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-foreground text-background rounded-full text-sm hover:bg-foreground/90 transition-colors"
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  )
}
