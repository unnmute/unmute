import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET: Check if the current user has accepted terms
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ hasAcceptedTerms: false, isAuthenticated: false })
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("has_accepted_terms")
    .eq("user_id", user.id)
    .single()

  return NextResponse.json({
    hasAcceptedTerms: profile?.has_accepted_terms ?? false,
    isAuthenticated: true,
  })
}

// POST: Accept terms for the current authenticated user
export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Upsert: create profile if it doesn't exist, or update if it does
  const { error } = await supabase.from("user_profiles").upsert(
    {
      user_id: user.id,
      has_accepted_terms: true,
      terms_accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) {
    console.error("Error accepting terms:", error)
    return NextResponse.json({ error: "Failed to save acceptance" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
