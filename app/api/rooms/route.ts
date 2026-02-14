import { createClient } from "@/lib/supabase/server"
import { getRoomConfig, isValidRoomId } from "@/lib/room-config"
import { NextResponse } from "next/server"

// Force edge runtime for Cloudflare compatibility
export const runtime = "edge"

// GET: Find or create an active room for a given emotion
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const emotion = searchParams.get("emotion")

  if (!emotion || !isValidRoomId(emotion)) {
    return NextResponse.json(
        { error: "Valid emotion is required" },
        { status: 400 }
    )
  }
  const roomConfig = getRoomConfig(emotion)

  const supabase = await createClient()

  // First, try to find an active room with available space
  const { data: existingRooms, error: findError } = await supabase
      .from("rooms")
      .select("*")
      .eq("emotion", emotion)
      .eq("is_active", true)
      .lt("participant_count", roomConfig.maxParticipants)
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
    // Optimistic-lock retry loop to enforce maxParticipants under concurrent joins.
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: currentRoom, error: roomError } = await supabase
          .from("rooms")
          .select("id, emotion, participant_count, is_active, expires_at")
          .eq("id", roomId)
          .single()

      if (roomError || !currentRoom) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 })
      }

      if (!currentRoom.is_active || new Date(currentRoom.expires_at) <= new Date()) {
        return NextResponse.json(
            { error: "Room is no longer active. Please try again." },
            { status: 409 },
        )
      }

      const roomConfig = getRoomConfig(currentRoom.emotion)
      const currentCount = currentRoom.participant_count || 0
      if (currentCount >= (roomConfig.maxParticipants ?? 10)) {
        return NextResponse.json(
            { error: `Room is full (${roomConfig.maxParticipants ?? 10} max).` },
            { status: 409 },
        )
      }


      const { data: updatedRoom, error: updateError } = await supabase
          .from("rooms")
          .update({ participant_count: currentCount + 1 })
          .eq("id", roomId)
          .eq("participant_count", currentCount)
          .select("id")
          .maybeSingle()

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      if (updatedRoom) {
        return NextResponse.json({ success: true })
      }
    }

    return NextResponse.json(
        { error: "Room is full. Please try joining again." },
        { status: 409 },
    )
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