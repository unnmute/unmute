import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Force edge runtime for Cloudflare compatibility
export const runtime = "edge"

// POST: Save a reflection
export async function POST(request: Request) {
  const body = await request.json()
  const { sessionId, feelingBefore, feelingAfter, gratitudeNote } = body

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: reflection, error } = await supabase
    .from("reflections")
    .insert({
      session_id: sessionId,
      feeling_before: feelingBefore,
      feeling_after: feelingAfter,
      gratitude_note: gratitudeNote || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reflection })
}
