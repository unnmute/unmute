import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  const body = await request.json()
  const answerId = String(body.answerId || "").trim()
  const anonymousId = String(body.anonymousId || "").trim()

  if (!answerId || !anonymousId) {
    return NextResponse.json({ error: "Answer ID and anonymous ID are required" }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: removedFelt, error: removeError } = await supabase
    .from("echo_felts")
    .delete()
    .eq("answer_id", answerId)
    .eq("anonymous_user_id", anonymousId)
    .select("id")

  if (removeError) {
    return NextResponse.json({ error: removeError.message }, { status: 500 })
  }

  let felt = false

  if (removedFelt && removedFelt.length > 0) {
    felt = false
  } else {
    const { error: insertError } = await supabase
      .from("echo_felts")
      .insert({ answer_id: answerId, anonymous_user_id: anonymousId })

    if (insertError) {
      // If a near-simultaneous request already inserted this row, treat it as "felt".
      if (insertError.code !== "23505") {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    felt = true
  }

  const { data: answer, error: answerError } = await supabase
    .from("echo_answers")
    .select("id, felt_count")
    .eq("id", answerId)
    .single()

  if (answerError) {
    return NextResponse.json({ error: answerError.message }, { status: 500 })
  }

  return NextResponse.json({ felt, answer })
}
