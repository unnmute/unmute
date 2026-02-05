import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Force edge runtime for Cloudflare compatibility
export const runtime = "edge"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl

  // Use the origin from the request, accounting for proxies
  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin

  console.log("[v0] Auth callback - Origin:", origin)

  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  const next = searchParams.get("next") ?? "/"

  // Handle OAuth errors
  if (error) {
    console.error("[v0] OAuth error:", error, errorDescription)
    const errorUrl = new URL(`${origin}/auth/error`)
    errorUrl.searchParams.set("error", error)
    if (errorDescription) {
      errorUrl.searchParams.set("message", errorDescription)
    }
    return NextResponse.redirect(errorUrl.toString())
  }

  // Handle PKCE code exchange
  if (code) {
    console.log("[v0] Auth callback - Exchanging code for session")
    try {
      const supabase = await createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (!exchangeError) {
        console.log("[v0] Auth callback - Success! Redirecting to:", `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error("[v0] Code exchange error:", exchangeError)
      const errorUrl = new URL(`${origin}/auth/error`)
      errorUrl.searchParams.set("error", "code_exchange_failed")
      errorUrl.searchParams.set("message", exchangeError.message)
      return NextResponse.redirect(errorUrl.toString())
    } catch (err) {
      console.error("[v0] Unexpected error during code exchange:", err)
      const errorUrl = new URL(`${origin}/auth/error`)
      errorUrl.searchParams.set("error", "unexpected_error")
      errorUrl.searchParams.set("message", err instanceof Error ? err.message : "Unknown error")
      return NextResponse.redirect(errorUrl.toString())
    }
  }

  // If no code, redirect to auth confirm page which handles implicit flow (hash fragments)
  // Hash fragments are not sent to the server, so client-side handling is needed
  console.log("[v0] Auth callback - No code, redirecting to confirm page")
  return NextResponse.redirect(`${origin}/auth/confirm`)
}
