"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Heart, DoorOpen } from "lucide-react"

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
    </div>
  )
}
