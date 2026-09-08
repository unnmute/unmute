"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

/**
 * Log a Mira chat session to the mira_chats table
 * This is a non-blocking server action that tracks usage
 * @param anonymousId - Unique identifier for the chat session
 */
export async function logMiraTranscript(
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
  model = "qwen/qwen3.8-27b",
) {
  if (!sessionId || !userMessage || !assistantMessage) return

  const { error } = await supabase.from("mira_chat_transcripts").insert([
    { session_id: sessionId, user_role: "user", content: userMessage },
    { session_id: sessionId, user_role: "assistant", content: assistantMessage, model },
  ])

  if (error) {
    console.error("[v0] Mira transcript logging failed:", error.message)
  }
}
