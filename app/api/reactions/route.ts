import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Force edge runtime for Cloudflare compatibility
export const runtime = "edge"

// POST: Send a reaction
export async function POST(request: Request) {
  const body = await request.json()
  const { roomId, sessionId, reactionType } = body

  if (!roomId || !sessionId || !reactionType) {
    return NextResponse.json(
      { error: "Room ID, session ID, and reaction type are required" },
      { status: 400 }
    )
  }

  const validReactions = ["heart", "wave", "peace"]
  if (!validReactions.includes(reactionType)) {
    return NextResponse.json(
      { error: "Invalid reaction type" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data: reaction, error } = await supabase
    .from("reactions")
    .insert({
      room_id: roomId,
      session_id: sessionId,
      reaction_type: reactionType,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reaction })
}

// GET: Get reactions for a room
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get("roomId")

  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Get reactions from the last minute
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()

  const { data: reactions, error } = await supabase
    .from("reactions")
    .select("*")
    .eq("room_id", roomId)
    .gte("created_at", oneMinuteAgo)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reactions })
}
