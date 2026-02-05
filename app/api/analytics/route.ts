import { createClient } from "@/lib/supabase/server"
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
    sessionsByEmotion: {
      anxious: todaySessions?.filter((s) => s.emotion === "anxious").length || 0,
      lonely: todaySessions?.filter((s) => s.emotion === "lonely").length || 0,
      "burnt-out": todaySessions?.filter((s) => s.emotion === "burnt-out").length || 0,
      "just-talk": todaySessions?.filter((s) => s.emotion === "just-talk").length || 0,
    },
  }

  return NextResponse.json({ stats })
}
