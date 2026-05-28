"use client"

import { FeltItButton } from "@/components/felt-it-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { getOrCreateAnonymousId } from "@/lib/anonymous-id"
import { getLocalDateKey } from "@/lib/daily-questions"
import { createClient } from "@/lib/supabase/client"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface EchoAnswer {
  id: string
  question_index: number
  answer_text: string
  anonymous_user_id: string
  felt_count: number
  created_at: string
}

function timeAgo(value: string) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return "just now"

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  return "today"
}

export function EchoesWall() {
  const [anonymousId, setAnonymousId] = useState("")
  const [question, setQuestion] = useState("")
  const [questionDate, setQuestionDate] = useState("")
  const [questionIndex, setQuestionIndex] = useState<number | null>(null)
  const [answers, setAnswers] = useState<EchoAnswer[]>([])
  const [answerText, setAnswerText] = useState("")
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(false)

  const wallRef = useRef<HTMLDivElement | null>(null)
  const supabase = useMemo(() => createClient(), [])

  const loadEchoes = useCallback(async () => {
    const response = await fetch("/api/echoes")
    const data = await response.json()

    if (response.ok) {
      setQuestion(data.question)
      setQuestionDate(data.questionDate)
      setQuestionIndex(data.questionIndex)
      setAnswers(data.answers || [])
    } else {
      setMessage(data.error || "Echoes are quiet right now.")
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    const id = getOrCreateAnonymousId()
    const today = getLocalDateKey()
    setAnonymousId(id)
    setHasAnsweredToday(localStorage.getItem(`unmute_echoed_${today}`) === "true")
    loadEchoes()
  }, [loadEchoes])

  useEffect(() => {
    if (questionIndex === null || !questionDate) return

    const channel = supabase
      .channel(`echoes:${questionDate}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "echo_answers",
          filter: "feature=eq.echo",
        },
        (payload) => {
          const newAnswer = payload.new as EchoAnswer
          if (newAnswer.question_index !== questionIndex) return
          if (getLocalDateKey(new Date(newAnswer.created_at)) !== questionDate) return

          setAnswers((current) => {
            if (current.some((answer) => answer.id === newAnswer.id)) return current
            return [newAnswer, ...current]
          })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "echo_answers",
          filter: "feature=eq.echo",
        },
        (payload) => {
          const updatedAnswer = payload.new as EchoAnswer
          if (updatedAnswer.question_index !== questionIndex) return
          if (getLocalDateKey(new Date(updatedAnswer.created_at)) !== questionDate) return

          setAnswers((current) =>
            current.map((answer) => (answer.id === updatedAnswer.id ? updatedAnswer : answer))
          )
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "echo_answers",
          filter: "feature=eq.echo",
        },
        (payload) => {
          const oldAnswer = payload.old as Pick<EchoAnswer, "id">
          setAnswers((current) => current.filter((answer) => answer.id !== oldAnswer.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [questionDate, questionIndex, supabase])

  useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(() => setMessage(""), 3000)
    return () => window.clearTimeout(timeout)
  }, [message])

  const scrollToWall = () => {
    wallRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handlePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedAnswer = answerText.replace(/\s+/g, " ").trim()
    if (!trimmedAnswer || isPosting || hasAnsweredToday) return

    setIsPosting(true)
    const response = await fetch("/api/echoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anonymousId, answerText: trimmedAnswer }),
    })
    const data = await response.json()
    setIsPosting(false)

    if (!response.ok) {
      setMessage(data.error || "Your Echo could not be released.")
      return
    }

    localStorage.setItem(`unmute_echoed_${data.questionDate}`, "true")
    setHasAnsweredToday(true)
    setAnswerText("")
    setAnswers((current) => {
      if (current.some((answer) => answer.id === data.answer.id)) return current
      return [data.answer, ...current]
    })
    window.setTimeout(scrollToWall, 120)
  }

  const handleFeel = async (answer: EchoAnswer, nextHasFelt: boolean) => {
    const delta = nextHasFelt ? 1 : -1
    setAnswers((current) =>
      current.map((item) =>
        item.id === answer.id ? { ...item, felt_count: Math.max((item.felt_count || 0) + delta, 0) } : item
      )
    )

    const response = await fetch("/api/echoes/resonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answerId: answer.id, anonymousId }),
    })
    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error || "That feeling did not save.")
      await loadEchoes()
      throw new Error(data.error || "Felt it failed")
    }

    const nextCount = data?.answer?.felt_count
    if (typeof nextCount === "number") {
      setAnswers((current) =>
        current.map((item) =>
          item.id === answer.id ? { ...item, felt_count: nextCount } : item
        )
      )
    }
  }

  const handleDelete = async (answer: EchoAnswer) => {
    setDeletingIds((current) => new Set(current).add(answer.id))

    const response = await fetch("/api/echoes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answerId: answer.id, anonymousId }),
    })
    const data = await response.json()

    if (!response.ok) {
      setDeletingIds((current) => {
        const next = new Set(current)
        next.delete(answer.id)
        return next
      })
      setMessage(data.error || "Your Echo could not be removed.")
      return
    }

    setConfirmingDeleteId(null)
    setAnswers((current) => current.filter((item) => item.id !== answer.id))
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -left-20 -top-24 z-0 h-[350px] w-[350px] rounded-full bg-[rgba(139,92,246,0.14)] blur-[70px] animate-[drift_14s_ease-in-out_infinite] dark:bg-[rgba(139,92,246,0.07)]" />
      <div className="pointer-events-none absolute -right-16 top-[120px] z-0 h-[280px] w-[280px] rounded-full bg-[rgba(251,146,60,0.12)] blur-[60px] animate-[drift_14s_ease-in-out_infinite] [animation-delay:-4s] dark:bg-[rgba(251,146,60,0.05)]" />
      <div className="pointer-events-none absolute bottom-20 left-[35%] z-0 h-[220px] w-[220px] rounded-full bg-[rgba(99,179,237,0.1)] blur-[50px] animate-[drift_14s_ease-in-out_infinite] [animation-delay:-8s] dark:bg-[rgba(99,179,237,0.04)]" />
      <div className="pointer-events-none absolute left-[15%] top-[20%] z-[1] h-1.5 w-1.5 rounded-full bg-[rgba(251,146,60,0.75)] shadow-[0_0_14px_rgba(251,146,60,0.45)] animate-[shimmer_3s_ease-in-out_infinite] dark:h-1 dark:w-1 dark:bg-[rgba(251,146,60,0.5)]" />
      <div className="pointer-events-none absolute left-[78%] top-[45%] z-[1] h-1.5 w-1.5 rounded-full bg-[rgba(251,146,60,0.75)] shadow-[0_0_14px_rgba(251,146,60,0.45)] animate-[shimmer_3s_ease-in-out_infinite] [animation-delay:-0.8s] dark:h-1 dark:w-1 dark:bg-[rgba(251,146,60,0.5)]" />
      <div className="pointer-events-none absolute left-[42%] top-[68%] z-[1] h-1.5 w-1.5 rounded-full bg-[rgba(251,146,60,0.75)] shadow-[0_0_14px_rgba(251,146,60,0.45)] animate-[shimmer_3s_ease-in-out_infinite] [animation-delay:-1.6s] dark:h-1 dark:w-1 dark:bg-[rgba(251,146,60,0.5)]" />
      <div className="pointer-events-none absolute left-[22%] top-[82%] z-[1] h-1.5 w-1.5 rounded-full bg-[rgba(251,146,60,0.75)] shadow-[0_0_14px_rgba(251,146,60,0.45)] animate-[shimmer_3s_ease-in-out_infinite] [animation-delay:-2.4s] dark:h-1 dark:w-1 dark:bg-[rgba(251,146,60,0.5)]" />

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container relative z-20 mx-auto flex items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition hover:text-foreground"
            aria-label="Return home"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span className="text-sm font-medium tracking-[0.3em] text-muted-foreground">ECHOES</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] animate-[livePulse_2s_ease-in-out_infinite]" />
              <span className="text-[11px] lowercase text-muted-foreground dark:text-[rgba(255,255,255,0.3)]">live</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="container relative z-10 mx-auto px-4 pb-12 pt-20">
        <div className="mx-auto max-w-[600px] text-center">
          <div className="question-label mx-auto mb-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground dark:text-[rgba(255,255,255,0.25)]">
            <span className="h-px w-10 bg-current opacity-30" />
            <span>today&apos;s question</span>
            <span className="h-px w-10 bg-current opacity-30" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-light leading-[1.4] text-foreground/85 sm:text-[36px]"
          >
            {question || "Loading today's question..."}
          </motion.h1>
          <p className="mt-5 text-[13px] text-muted-foreground">
            {answers.length} {answers.length === 1 ? "person spoke" : "people spoke"} today
          </p>

          <div className="mx-auto mt-9 max-w-2xl">
            {hasAnsweredToday ? (
              <button
                type="button"
                onClick={scrollToWall}
                className="rounded-full border border-border bg-secondary/60 px-5 py-3 text-sm text-foreground/80 transition hover:bg-secondary"
              >
                See what someone like you said →
              </button>
            ) : (
              <form onSubmit={handlePost} className="rounded-2xl border border-border bg-card/50 p-4 text-left">
                <textarea
                  value={answerText}
                  onChange={(event) => setAnswerText(event.target.value)}
                  maxLength={180}
                  rows={4}
                  placeholder="Say it here. No one knows it's you."
                  className="min-h-28 w-full resize-none border-0 bg-transparent text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
                  aria-label="Anonymous Echo answer"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground/60">{answerText.length}/180</span>
                  <button
                    type="submit"
                    disabled={!answerText.trim() || isPosting}
                    className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isPosting ? "Releasing..." : "Release it"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mb-0 mt-12 h-px bg-border/70" />

        <div ref={wallRef} className="mt-12 scroll-mt-24">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Today&apos;s Wall</h2>
            <p className={`text-[11px] tracking-[0.15em] ${answers.length > 0 ? "text-amber-500" : "text-muted-foreground"}`}>
              ↑ {answers.length} echoes today
            </p>
          </div>
          <div className="mb-8 h-px bg-border/60" />

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Gathering today&apos;s Echoes
            </div>
          ) : answers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-200/70 animate-pulse" />
              <p className="text-sm text-muted-foreground">The wall is silent. Be the first to speak.</p>
            </div>
          ) : (
            <div
              style={
                answers.length < 3
                  ? { maxWidth: "480px", margin: "0 auto", padding: "0 16px" }
                  : { columns: "3 280px", columnGap: "16px", padding: "0 16px" }
              }
            >
              <AnimatePresence initial={false}>
                {answers.map((answer, index) => {
                  const isMine = answer.anonymous_user_id === anonymousId
                  const isConfirming = confirmingDeleteId === answer.id
                  const isDeleting = deletingIds.has(answer.id)

                  return (
                    <motion.article
                      key={answer.id}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: isDeleting ? 0 : 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 12, height: 0, marginBottom: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.45), duration: 0.28 }}
                      className="relative z-10 border bg-card transition-all duration-200 ease-out hover:border-[rgba(255,180,50,0.2)] hover:shadow-[0_0_20px_rgba(255,180,50,0.05)] dark:bg-[#111111]"
                      style={{
                        breakInside: "avoid",
                        marginBottom: "16px",
                        display: "inline-block",
                        width: "100%",
                        borderRadius: "16px",
                        padding: "20px",
                        minHeight: "120px",
                        animation: "floatUp 0.6s ease both",
                        animationDelay: `${index * 0.07}s`,
                      }}
                    >
                      {isMine && (
                        <div className="absolute right-3 top-3">
                          {isConfirming ? (
                            <div className="rounded-xl border border-border bg-background/95 p-3 text-right">
                              <p className="mb-2 text-xs text-muted-foreground">Remove your echo?</p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(answer)}
                                  disabled={isDeleting}
                                  className="rounded-full bg-foreground px-3 py-1 text-xs text-background disabled:opacity-50"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmingDeleteId(null)}
                                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmingDeleteId(answer.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/60 transition hover:bg-secondary hover:text-foreground"
                              aria-label="Delete your Echo"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      )}

                      <p className={`font-light leading-relaxed text-foreground ${isMine ? "pr-10" : ""} ${answer.answer_text.length < 80 ? "text-xl" : "text-base"}`}>
                        {answer.answer_text}
                      </p>
                      <div className="mt-8 flex items-end justify-between gap-4">
                        <FeltItButton
                          answerId={answer.id}
                          count={answer.felt_count || 0}
                          onFeel={(nextHasFelt) => handleFeel(answer, nextHasFelt)}
                          className="mt-0"
                        />
                        <span className="shrink-0 text-[11px] text-muted-foreground/70">{timeAgo(answer.created_at)}</span>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground"
            role="status"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        @keyframes drift {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-10px) translateX(5px);
          }
          66% {
            transform: translateY(5px) translateX(-8px);
          }
        }

        @keyframes livePulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes floatUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes feltPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.6);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(251, 146, 60, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(251, 146, 60, 0);
          }
        }

        @keyframes shimmer {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </main>
  )
}
