import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { sessionId, feeling, message } = body

        if (!feeling && !message) {
            return NextResponse.json(
                { error: "At least feeling or message is required" },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        const { error } = await supabase.from("feedback").insert({
            session_id: sessionId || null,
            feeling,
            message: message?.trim() || null,
        })

        if (error) {
            console.error("Failed to save feedback:", error)
            return NextResponse.json(
                { error: "Failed to save feedback" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Feedback API error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}