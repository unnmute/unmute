import { NextResponse } from "next/server"
import { SignJWT } from "jose"

// Force edge runtime for Cloudflare compatibility
export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { roomName, participantName } = await request.json()

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET

    // If LiveKit is not configured, return a flag indicating audio is unavailable
    if (!apiKey || !apiSecret) {
      return NextResponse.json({ 
        audioEnabled: false,
        message: "Live audio not configured. Set LIVEKIT_API_KEY and LIVEKIT_API_SECRET to enable."
      })
    }

    // Generate LiveKit token manually using jose (avoids livekit-server-sdk bundling issues)
    const now = Math.floor(Date.now() / 1000)
    const exp = now + 3600 // 1 hour expiry
    
    const claims = {
      iss: apiKey,
      sub: participantName,
      nbf: now,
      exp: exp,
      jti: participantName,
      video: {
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      },
      metadata: "",
      name: participantName,
    }

    const secret = new TextEncoder().encode(apiSecret)
    const token = await new SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(now)
      .setExpirationTime(exp)
      .sign(secret)
    
    return NextResponse.json({ 
      token,
      audioEnabled: true,
      wsUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL
    })
  } catch (error) {
    console.error("LiveKit token error:", error)
    return NextResponse.json({ 
      audioEnabled: false,
      message: "Failed to generate audio token"
    }, { status: 200 }) // Return 200 so app continues working
  }
}
