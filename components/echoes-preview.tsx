"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

interface EchoPreviewAnswer {
  id: string
  answer_text: string
  felt_count: number
}

export function EchoesPreview() {
  const [answers, setAnswers] = useState<EchoPreviewAnswer[]>([])

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const response = await fetch("/api/echoes")
        const data = await response.json()
        if (response.ok) {
          setAnswers((data.answers || []).slice(0, 3))
        }
      } catch {
        setAnswers([])
      }
    }

    loadPreview()
  }, [])

  const previewAnswers =
    answers.length > 0
      ? answers
      : [
          { id: "empty-1", answer_text: "The wall is waiting for today's first truth.", felt_count: 0 },
          { id: "empty-2", answer_text: "No names. No judgment. Just what is real.", felt_count: 0 },
          { id: "empty-3", answer_text: "Someone else may need the words you release.", felt_count: 0 },
        ]

  return (
    <section className="bg-secondary/35 border-y border-border/70">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Live</span>
            </div>
            <h2 className="max-w-2xl text-3xl font-light leading-tight text-foreground md:text-4xl">
              Every day, a question. Every answer, anonymous.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Thousands of people speak their truth here daily. No names. No judgment. Just honesty.
            </p>
          </div>
          <Link
            href="/echoes"
            className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            See today&apos;s wall →
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {previewAnswers.map((answer, index) => (
            <motion.article
              key={answer.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="min-h-32 rounded-2xl border border-border bg-card/70 p-5"
            >
              <p className="text-sm font-light leading-relaxed text-foreground/90">{answer.answer_text}</p>
              <p className="mt-5 text-xs text-muted-foreground">{answer.felt_count || 0} felt this</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

