import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

const MAX_ANONYMOUS_JOINS = 3

// GET: Check how many joins remain for this fingerprint
export async function GET(request: NextRequest) {
  const fingerprint = request.nextUrl.searchParams.get("fingerprint")

  if (!fingerprint || fingerprint.length < 10) {
    return NextResponse.json(
      { error: "Invalid fingerprint" },
      { status: 400 }
    )
  }

  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("anonymous_device_joins")
      .select("join_count")
      .eq("fingerprint", fingerprint)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found, which is fine
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    const joinCount = data?.join_count ?? 0
    const remaining = Math.max(0, MAX_ANONYMOUS_JOINS - joinCount)
    const blocked = joinCount >= MAX_ANONYMOUS_JOINS

    return NextResponse.json({ joinCount, remaining, blocked })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST: Increment join count for this fingerprint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fingerprint } = body

    if (!fingerprint || fingerprint.length < 10) {
      return NextResponse.json(
        { error: "Invalid fingerprint" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check current count first
    const { data: existing } = await supabase
      .from("anonymous_device_joins")
      .select("join_count")
      .eq("fingerprint", fingerprint)
      .single()

    const currentCount = existing?.join_count ?? 0

    if (currentCount >= MAX_ANONYMOUS_JOINS) {
      return NextResponse.json(
        { error: "Anonymous join limit reached", blocked: true },
        { status: 403 }
      )
    }

    // Upsert: insert or increment
    const { error } = await supabase.from("anonymous_device_joins").upsert(
      {
        fingerprint,
        join_count: currentCount + 1,
        last_joined_at: new Date().toISOString(),
      },
      { onConflict: "fingerprint" }
    )

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    const newCount = currentCount + 1
    const remaining = Math.max(0, MAX_ANONYMOUS_JOINS - newCount)

    return NextResponse.json({
      joinCount: newCount,
      remaining,
      blocked: newCount >= MAX_ANONYMOUS_JOINS,
    })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
