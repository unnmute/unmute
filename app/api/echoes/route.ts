import { getLocalDateKey, getQuestionIndex, getTodaysQuestion } from "@/lib/daily-questions"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = "edge"

const MAX_ANSWER_LENGTH = 180

export async function GET() {
  const supabase = await createClient()
  const now = new Date()
  const questionDate = getLocalDateKey(now)
  const questionIndex = getQuestionIndex(now)
  const question = getTodaysQuestion(now)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  const { data: answers, error } = await supabase
    .from("echo_answers")
    .select("*")
    .eq("feature", "echo")
    .eq("question_index", questionIndex)
    .gte("created_at", startOfToday.toISOString())
    .lt("created_at", startOfTomorrow.toISOString())
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ question, questionDate, questionIndex, answers: answers || [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const anonymousId = String(body.anonymousId || "").trim()
  const answerText = String(body.answerText || "").replace(/\s+/g, " ").trim()

  if (!anonymousId || !answerText) {
    return NextResponse.json({ error: "Anonymous ID and answer are required" }, { status: 400 })
  }

  if (answerText.length > MAX_ANSWER_LENGTH) {
    return NextResponse.json({ error: "Keep your Echo under 180 characters" }, { status: 400 })
  }

  const supabase = await createClient()
  const now = new Date()
  const questionDate = getLocalDateKey(now)
  const questionIndex = getQuestionIndex(now)
  const question = getTodaysQuestion(now)

  const { data: answer, error } = await supabase
    .from("echo_answers")
    .insert({
      anonymous_user_id: anonymousId,
      answer_text: answerText,
      feature: "echo",
      question_index: questionIndex,
      felt_count: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ answer, question, questionDate, questionIndex })
}

export async function DELETE(request: Request) {
  const body = await request.json()
  const answerId = String(body.answerId || "").trim()
  const anonymousId = String(body.anonymousId || "").trim()

  if (!answerId || !anonymousId) {
    return NextResponse.json({ error: "Answer ID and anonymous ID are required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: deleted, error } = await supabase.rpc("delete_echo_answer", {
    answer_id: answerId,
    requester_anonymous_user_id: anonymousId,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!deleted) {
    return NextResponse.json({ error: "Echo not found or not yours" }, { status: 403 })
  }

  return NextResponse.json({ success: true })
}
