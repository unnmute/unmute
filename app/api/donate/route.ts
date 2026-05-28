import { NextResponse } from "next/server"

export const runtime = "nodejs"


// Razorpay API credentials - Replace with your actual keys
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID"
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_KEY_SECRET"

// Base64 encode for Edge runtime (Buffer not available)
function btoa64(str: string): string {
  return btoa(str)
}

// POST: Create a Razorpay order for donation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency = "INR", notes = {} } = body

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Valid amount is required (minimum 1)" },
        { status: 400 }
      )
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100)

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
          { error: "Razorpay keys are missing" },
          { status: 500 }
      )
    }

    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)

    const payload = {
      amount: Number(amountInPaise),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        purpose: "UNMUTE Donation",
      },
    }

    console.log("Razorpay payload:", payload)
    console.log("Razorpay headers:", {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "PostmanRuntime/7.36.0",
    })

    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "PostmanRuntime/7.36.0", // 👈 mimic Postman
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    })





    if (!orderResponse.ok) {
      console.error("STATUS:", orderResponse.status)
      console.error("HEADERS:", Object.fromEntries(orderResponse.headers))
      const errorText = await orderResponse.text()

      return NextResponse.json(
          {
            error: "Razorpay order failed",
            status: orderResponse.status,
            body: errorText || null,
          },
          { status: orderResponse.status }
      )
    }



    const order = await orderResponse.json()

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Donation API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT: Verify payment signature before acknowledging
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification fields" },
        { status: 400 }
      )
    }

    // Verify the Razorpay signature using Web Crypto API (Edge-compatible)
    const message = `${razorpay_order_id}|${razorpay_payment_id}`
    const encoder = new TextEncoder()

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(RAZORPAY_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message)
    )

    const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    if (generatedSignature !== razorpay_signature) {
      console.error("Payment signature mismatch", {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      })
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    console.log("Payment verified successfully:", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}
