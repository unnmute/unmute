import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Force edge runtime for Cloudflare compatibility
export const runtime = "edge"

// POST: Create a new session
export async function POST(request: Request) {
  const body = await request.json()
  const { roomId, anonymousId, emotion } = body

  if (!roomId || !anonymousId || !emotion) {
    return NextResponse.json(
      { error: "Room ID, anonymous ID, and emotion are required" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data: session, error } = await supabase
    .from("sessions")
    .insert({
      room_id: roomId,
      anonymous_id: anonymousId,
      emotion,
      joined_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ session })
}

// PATCH: End a session
export async function PATCH(request: Request) {
  const body = await request.json()
  const { sessionId, durationSeconds } = body

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: session, error } = await supabase
    .from("sessions")
    .update({
      left_at: new Date().toISOString(),
      duration_seconds: durationSeconds || 0,
    })
    .eq("id", sessionId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ session })
}
