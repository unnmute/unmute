"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BreathingCircle } from "@/components/breathing-circle"
import { ArrowUp, Minus, ArrowDown, Phone, Home, Heart, Coffee, Sparkles } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

// Note: Metadata cannot be exported from client components
// The page uses client-side rendering for dynamic content

function ReflectionContent() {
  const searchParams = useSearchParams()
  const emotion = searchParams.get("emotion") || "anxious"
  const sessionId = searchParams.get("sessionId")
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)
  const [showThankYou, setShowThankYou] = useState(false)
  const [feedbackNote, setFeedbackNote] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [donationComplete, setDonationComplete] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const emotionColors: Record<string, string> = {
    anxious: "from-purple-900/20",
    lonely: "from-blue-900/20",
    "burnt-out": "from-orange-900/20",
    "just-talk": "from-emerald-900/20",
  }

  const feedbackToScore: Record<string, { before: number; after: number } | null> = {
    lighter: { before: 2, after: 4 },
    same: { before: 3, after: 3 },
    heavier: { before: 3, after: 2 },
    skip: null,
  }

  const handleFeedback = async (feedback: string) => {
    setSelectedFeedback(feedback)
    
    // Save reflection to backend (skip if user chose to skip)
    if (sessionId && feedback !== "skip") {
      const scores = feedbackToScore[feedback]
      if (scores) {
        try {
          await fetch("/api/reflections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              feelingBefore: scores.before,
              feelingAfter: scores.after,
              feedbackNote: feedbackNote.trim() || null,
            }),
          })
        } catch (error) {
          console.error("Failed to save reflection:", error)
        }
      }
    }
    if (sessionId) {
      try {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            feeling: feedback,
            message: feedbackNote.trim() || null,
          }),
        })
      } catch (error) {
        console.error("Failed to save feedback:", error)
      }
    }
    
    setTimeout(() => setShowThankYou(true), 500)
  }

  const bgGradient = emotionColors[emotion] || emotionColors.anxious

  const donationAmounts = [
    { value: 49, label: "49", icon: Coffee, description: "A warm gesture" },
    { value: 99, label: "99", icon: Heart, description: "Spread kindness" },
    { value: 199, label: "199", icon: Sparkles, description: "Make a difference" },
  ]

  const handleDonation = async () => {
    const amount = selectedAmount || (customAmount ? parseInt(customAmount) : 0)
    if (!amount || amount < 1) return

    setIsProcessingPayment(true)

    try {
      // Create order
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, sessionId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const { orderId, keyId } = await response.json()

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "UNMUTE",
        description: "Supporting mental wellness for everyone",
        order_id: orderId,
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          // Verify payment
          await fetch("/api/donate", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          })
          setDonationComplete(true)
          setIsProcessingPayment(false)
        },
        prefill: {},
        theme: {
          color: "#18181b",
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false)
          },
        },
      }

      // @ts-expect-error Razorpay is loaded via script
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      setIsProcessingPayment(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <main className="min-h-screen bg-background relative overflow-hidden" role="main" aria-label="Session reflection">
        {/* Ambient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${bgGradient} via-transparent to-transparent pointer-events-none`}
        />

      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!showThankYou ? (
            <motion.div
              key="reflection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center max-w-md"
            >
              {/* Breathing Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <BreathingCircle emotion={emotion} />
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4 text-balance">
                  Thank you for showing up
                </h1>
                <p className="text-muted-foreground">
                  Being present takes courage. How are you feeling now?
                </p>
              </motion.div>

              {/* Feedback Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
              >
                {[
                  { id: "lighter", label: "Lighter", icon: ArrowUp, color: "text-emerald-400" },
                  { id: "same", label: "Same", icon: Minus, color: "text-muted-foreground" },
                  { id: "heavier", label: "Heavier", icon: ArrowDown, color: "text-orange-400" },
                  { id: "skip", label: "Skip", icon: null, color: "text-muted-foreground" },
                ].map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedFeedback === option.id
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFeedback(option.id)}
                      aria-label={`I feel ${option.label.toLowerCase()} after this session`}
                      aria-pressed={isSelected}
                      className={`
                        flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                        border transition-all duration-300
                        ${
                          isSelected
                            ? "bg-foreground text-background border-foreground"
                            : "bg-card/50 border-border hover:bg-card hover:border-muted-foreground/50 text-foreground"
                        }
                      `}
                    >
                      {Icon && <Icon className={`w-4 h-4 ${isSelected ? "" : option.color}`} aria-hidden="true" />}
                      <span className="font-medium">{option.label}</span>
                    </motion.button>
                  )
                })}
              </motion.div>

              {/* Feedback Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full mt-6"
              >
                <label htmlFor="feedback-note" className="block text-sm font-semibold text-foreground mb-2">
                  Anything you would like to share? (optional)
                </label>
                <textarea
                  id="feedback-note"
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Your thoughts, suggestions, or how we can improve..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-muted-foreground/50 resize-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleFeedback(selectedFeedback || "skip")}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium transition-all hover:opacity-90"
                  aria-label="Submit your reflection"
                >
                  Submit
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center max-w-md"
            >
              {/* Checkmark Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mb-8"
              >
                <motion.svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  />
                </motion.svg>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-light text-foreground mb-3"
              >
                Your presence matters
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground mb-8"
              >
                Every step you take toward your wellbeing counts.
              </motion.p>

              {/* Donation Section */}
              {!donationComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="w-full mb-6"
                >
                  <div className="bg-card/50 border border-border rounded-2xl p-6">
                    <div className="text-center mb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        UNMUTE is free for everyone, always. Your support helps us keep this space safe and accessible for those who need it most.
                      </p>
                    </div>

                    {/* Amount Selection */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {donationAmounts.map((amt) => {
                        const Icon = amt.icon
                        const isSelected = selectedAmount === amt.value
                        return (
                          <button
                            key={amt.value}
                            onClick={() => {
                              setSelectedAmount(amt.value)
                              setCustomAmount("")
                            }}
                            className={`
                              relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200
                              ${isSelected 
                                ? "bg-foreground text-background border-foreground" 
                                : "bg-card/50 border-border hover:border-muted-foreground/50 text-foreground"
                              }
                            `}
                          >
                            <Icon className="w-4 h-4 opacity-70" />
                            <span className="text-lg font-semibold">&#8377;{amt.label}</span>
                            <span className={`text-[10px] ${isSelected ? "text-background/70" : "text-muted-foreground"}`}>
                              {amt.description}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Custom Amount */}
                    <div className="mb-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">&#8377;</span>
                        <input
                          type="number"
                          placeholder="Enter custom amount"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value)
                            setSelectedAmount(null)
                          }}
                          className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-muted-foreground/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Donate Button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleDonation}
                      disabled={isProcessingPayment || (!selectedAmount && !customAmount)}
                      className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all
                        ${(selectedAmount || customAmount) && !isProcessingPayment
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                        }
                      `}
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4" />
                          Support UNMUTE
                        </>
                      )}
                    </motion.button>

                    <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
                      Secure payment powered by Razorpay
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">Thank you for your kindness</h3>
                  <p className="text-sm text-muted-foreground">
                    Your support helps us keep UNMUTE free and accessible for everyone.
                  </p>
                </motion.div>
              )}

              {/* Return Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-3 w-full"
              >
                <Link href="/" aria-label="Return to the home page to select another sanctuary">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-medium transition-all"
                  >
                    <Home className="w-4 h-4" aria-hidden="true" />
                    Return to Sanctuary
                  </motion.button>
                </Link>
                
                {!donationComplete && (
                  <Link href="/" className="text-center">
                    <span className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Skip for now
                    </span>
                  </Link>
                )}
              </motion.div>

              {/* Crisis Resources */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 pt-8 border-t border-border w-full"
              >
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Find a crisis helpline for immediate support (opens in new tab)"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>Need immediate support? Find a helpline</span>
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </main>
    </>
  )
}

export default function ReflectionPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </main>
      }
    >
      <ReflectionContent />
    </Suspense>
  )
}
