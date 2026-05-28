import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Force edge runtime for Cloudflare compatibility
export const runtime = "edge"

// GET: Find or create an active room for a given emotion
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const emotion = searchParams.get("emotion")
  const allowedEmotions = new Set(["anxious", "lonely", "burnt-out", "just-talk"])

  if (!emotion || !allowedEmotions.has(emotion)) {
    return NextResponse.json(
      { error: "Valid emotion is required" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // First, try to find an active room with available space
  const { data: existingRooms, error: findError } = await supabase
    .from("rooms")
    .select("*")
    .eq("emotion", emotion)
    .eq("is_active", true)
    .lt("participant_count", 10)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)

  if (!findError && existingRooms && existingRooms.length > 0) {
    return NextResponse.json({ room: existingRooms[0] })
  }

  // No available room found, create a new one
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

  const { data: newRoom, error: createError } = await supabase
    .from("rooms")
    .insert({
      emotion,
      expires_at: expiresAt.toISOString(),
      is_active: true,
      participant_count: 0,
    })
    .select()
    .single()

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  return NextResponse.json({ room: newRoom })
}

// POST: Join a room (increment participant count)
export async function POST(request: Request) {
  const body = await request.json()
  const { roomId, action } = body

  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
  }

  const supabase = await createClient()

  if (action === "join") {
    // Get current room and increment participant count
    const { data: currentRoom } = await supabase
      .from("rooms")
      .select("participant_count")
      .eq("id", roomId)
      .single()

    if (currentRoom) {
      const { error: updateError } = await supabase
        .from("rooms")
        .update({ participant_count: (currentRoom.participant_count || 0) + 1 })
        .eq("id", roomId)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  }

  if (action === "leave") {
    // Decrement participant count
    const { data: currentRoom } = await supabase
      .from("rooms")
      .select("participant_count")
      .eq("id", roomId)
      .single()

    if (currentRoom && currentRoom.participant_count > 0) {
      await supabase
        .from("rooms")
        .update({ participant_count: currentRoom.participant_count - 1 })
        .eq("id", roomId)
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
