import { createClient } from "@/lib/supabase/server"
import { ROOM_IDS } from "@/lib/room-config"
import { NextResponse } from "next/server"

// Force edge runtime for Cloudflare compatibility
export const runtime = "edge"

// GET: Get analytics summary
export async function GET() {
  const supabase = await createClient()

  // Get total sessions today
  const today = new Date().toISOString().split("T")[0]

  const { data: todaySessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("id, emotion, duration_seconds")
      .gte("joined_at", `${today}T00:00:00.000Z`)

  const { data: activeRooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id, emotion, participant_count")
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())

  const stats = {
    totalSessionsToday: todaySessions?.length || 0,
    activeRooms: activeRooms?.length || 0,
    totalParticipantsNow: activeRooms?.reduce((sum, r) => sum + r.participant_count, 0) || 0,
    sessionsByEmotion: Object.fromEntries(
        ROOM_IDS.map((emotion) => [
          emotion,
          todaySessions?.filter((session) => session.emotion === emotion).length || 0,
        ]),
    ),
  }

  return NextResponse.json({ stats })
}
