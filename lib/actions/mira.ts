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
export async function logMiraChat(anonymousId: string) {
  try {
    if (!anonymousId) {
      console.error("[v0] logMiraChat: anonymousId is required")
      return
    }

    const { error } = await supabase.from("mira_chats").insert({
      anonymous_id: anonymousId,
    })

    if (error) {
      console.error("[v0] logMiraChat failed:", error.message)
      return
    }

    console.log("[v0] Mira chat logged successfully")
  } catch (err) {
    console.error("[v0] logMiraChat error:", err)
  }
}
