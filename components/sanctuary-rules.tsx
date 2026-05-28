"use client"

import { MiraCharacter } from "@/components/MiraCharacter"
import { motion } from "framer-motion"
import { Shield, Clock, Heart, DoorOpen } from "lucide-react"
import Link from "next/link"

const rules = [
  {
    icon: Shield,
    title: "No judgment",
    description: "This is a safe space for everyone",
  },
  {
    icon: Heart,
    title: "No advice unless asked",
    description: "Sometimes we just need to be heard",
  },
  {
    icon: Clock,
    title: "14-minute sessions",
    description: "Intentional, focused conversations",
  },
  {
    icon: DoorOpen,
    title: "Leave anytime",
    description: "You're always in control",
  },
]

export function SanctuaryRules() {
  const bookingUrl =
    process.env.NEXT_PUBLIC_LISTENER_BOOKING_URL ||
    "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/viewform"

  return (
    <div className="sticky top-24">
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
          Sanctuary Rules
        </h3>
        <div className="space-y-5">
          {rules.map((rule, index) => {
            const Icon = rule.icon
            return (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 text-muted-foreground">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {rule.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {rule.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center"
      >
        <p className="text-xs text-muted-foreground">
          All conversations are anonymous
          <br />
          and never recorded
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mt-8 flex flex-col items-center text-center"
      >
        <MiraCharacter />

        <div className="mt-5 flex items-center justify-center gap-3">
          <h2 className="text-2xl font-light text-foreground">Meet Mira.</h2>
        </div>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          She&apos;s your 2am friend always here to listen you.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["No advice", "No judgment", "No login"].map((t) => (
            <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <Link
          href="/listen"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/8 px-5 py-2.5 text-sm text-violet-400 transition-all hover:border-violet-400/50 hover:bg-violet-400/15"
        >
          Talk to Mira →
        </Link>

        <div className="mt-5 max-w-xs border-t border-border/60 pt-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Want to talk to a real human listener? Free Private 30-min sessions available to heal you.
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-full border border-teal-400/30 bg-teal-400/8 px-5 py-2.5 text-sm text-teal-500 transition-all hover:border-teal-400/50 hover:bg-teal-400/15 dark:text-teal-300"
          >
            Book a free first session →
          </a>
        </div>
      </motion.div>
    </div>
  )
}
