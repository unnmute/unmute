import { NextResponse } from "next/server"

export const runtime = "edge"

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

    // Create order using Razorpay API
    const auth = btoa64(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)
    
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: `unmute_donation_${Date.now()}`,
        notes: {
          purpose: "UNMUTE Donation",
          ...notes,
        },
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text()
      console.error("Razorpay order creation failed:", errorData)
      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 500 }
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

// POST: Verify payment (optional - for recording successful donations)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // In production, verify the signature using crypto
    // const crypto = require('crypto')
    // const generated_signature = crypto
    //   .createHmac('sha256', RAZORPAY_KEY_SECRET)
    //   .update(razorpay_order_id + "|" + razorpay_payment_id)
    //   .digest('hex')
    // const isValid = generated_signature === razorpay_signature

    // For now, just acknowledge the payment
    console.log("Payment received:", {
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
