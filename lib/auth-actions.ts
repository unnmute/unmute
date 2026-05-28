"use server"

import { createClient } from "@/lib/supabase/server"

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  })

  if (error) {
    return { error: error.message }
  }

  return { url: data.url }
}
