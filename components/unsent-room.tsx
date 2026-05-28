"use client"

import { MeTooButton } from "@/components/me-too-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { getOrCreateAnonymousId } from "@/lib/anonymous-id"
import { createClient } from "@/lib/supabase/client"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Loader2, Send } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"

interface UnsentLetter {
  id: string
  recipient_type: string | null
  opening_line: string | null
  anonymous_user_id?: string
  felt_count: number
  created_at: string
  feature?: "unsent"
}

const RECIPIENTS = [
  "someone I miss",
  "someone I loved",
  "my past self",
  "my future self",
  "a parent",
  "a friend",
  "someone who hurt me",
  "someone I never met",
]

function timeAgo(value: string) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return "just now"

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  return "today"
}

function getOpeningLine(text: string) {
  const firstSentence = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)[0]

  return firstSentence.slice(0, 200)
}

export function UnsentRoom() {
  const [anonymousId, setAnonymousId] = useState("")
  const [letters, setLetters] = useState<UnsentLetter[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState(RECIPIENTS[0])
  const [fullLetterText, setFullLetterText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState("")

  const supabase = useMemo(() => createClient(), [])

  const loadLetters = useCallback(async () => {
    const { data, error } = await supabase
      .from("unsent_public")
      .select("id, recipient_type, opening_line, felt_count, created_at")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      setMessage(error.message)
    } else {
      setLetters(data || [])
    }

    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    setAnonymousId(getOrCreateAnonymousId())
    loadLetters()
  }, [loadLetters])

  useEffect(() => {
    const channel = supabase
      .channel("unsent-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "echo_answers",
          filter: "feature=eq.unsent",
        },
        (payload) => {
          const newLetter = payload.new as {
            id: string
            recipient_type: string | null
            opening_line: string | null
            anonymous_user_id: string
            felt_count: number
            created_at: string
            feature: "unsent"
          }

          setLetters((current) => {
            if (current.some((letter) => letter.id === newLetter.id)) return current
            return [
              {
                id: newLetter.id,
                recipient_type: newLetter.recipient_type,
                opening_line: newLetter.opening_line,
                anonymous_user_id: newLetter.anonymous_user_id,
                felt_count: newLetter.felt_count,
                created_at: newLetter.created_at,
                feature: newLetter.feature,
              },
              ...current,
            ].slice(0, 50)
          })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "echo_answers",
          filter: "feature=eq.unsent",
        },
        (payload) => {
          const updatedLetter = payload.new as UnsentLetter
          setLetters((current) =>
            current.map((letter) =>
              letter.id === updatedLetter.id
                ? { ...letter, felt_count: updatedLetter.felt_count }
                : letter
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(() => setMessage(""), 3200)
    return () => window.clearTimeout(timeout)
  }, [message])

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedLetter = fullLetterText.replace(/\s+/g, " ").trim()
    if (!trimmedLetter || isSending) return

    const openingLine = getOpeningLine(trimmedLetter)
    setIsSending(true)

    const { data, error } = await supabase
      .from("echo_answers")
      .insert({
        feature: "unsent",
        recipient_type: selectedRecipient,
        answer_text: openingLine,
        opening_line: openingLine,
        full_letter: trimmedLetter,
        anonymous_user_id: anonymousId,
        question_index: null,
      })
      .select("id, recipient_type, opening_line, felt_count, created_at")
      .single()

    setIsSending(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setFullLetterText("")
    if (data) {
      setLetters((current) => {
        if (current.some((letter) => letter.id === data.id)) return current
        return [data, ...current].slice(0, 50)
      })
    }
  }

  const handleMeToo = async (letter: UnsentLetter) => {
    setLetters((current) =>
      current.map((item) =>
        item.id === letter.id ? { ...item, felt_count: item.felt_count + 1 } : item
      )
    )

    const { error: feltError } = await supabase
      .from("echo_felts")
      .insert({
        answer_id: letter.id,
        anonymous_user_id: anonymousId,
      })

    if (feltError) {
      const alreadyFelt = feltError.code === "23505"
      if (!alreadyFelt) {
        setMessage(feltError.message)
        await loadLetters()
        throw new Error(feltError.message)
      }
      await loadLetters()
      return
    }

    await supabase
      .from("echo_answers")
      .update({ felt_count: letter.felt_count + 1 })
      .eq("id", letter.id)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -left-24 top-0 z-0 h-[360px] w-[360px] rounded-full bg-[rgba(139,92,246,0.12)] blur-[70px] dark:bg-[rgba(139,92,246,0.07)]" />
      <div className="pointer-events-none absolute -right-16 top-40 z-0 h-[280px] w-[280px] rounded-full bg-[rgba(251,146,60,0.1)] blur-[65px] dark:bg-[rgba(251,146,60,0.05)]" />

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container relative z-20 mx-auto flex items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition hover:text-foreground"
            aria-label="Return home"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span className="text-sm font-medium tracking-[0.3em] text-muted-foreground">UNSENT</span>
          <ThemeToggle />
        </div>
      </header>

      <section className="container relative z-10 mx-auto px-4 pb-16 pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">The Unsent Room</p>
          <h1 className="text-3xl font-light leading-tight text-foreground/90 sm:text-5xl">
            Write what you never sent.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Your full letter is stored privately and never shown back. The room only sees the first line.
          </p>
        </div>

        <form onSubmit={handleSend} className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card/70 p-4 sm:p-5">
          <label htmlFor="recipient" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
            To
          </label>
          <select
            id="recipient"
            value={selectedRecipient}
            onChange={(event) => setSelectedRecipient(event.target.value)}
            className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none"
          >
            {RECIPIENTS.map((recipient) => (
              <option key={recipient} value={recipient}>
                {recipient}
              </option>
            ))}
          </select>

          <label htmlFor="letter" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Letter
          </label>
          <textarea
            id="letter"
            value={fullLetterText}
            onChange={(event) => setFullLetterText(event.target.value)}
            rows={8}
            maxLength={2000}
            placeholder="I never said this, but..."
            className="min-h-52 w-full resize-none border-0 bg-transparent text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Public preview: {getOpeningLine(fullLetterText) || "your first sentence will appear here"}
            </p>
            <button
              type="submit"
              disabled={!fullLetterText.trim() || isSending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {isSending ? "Releasing..." : "Leave it unsent"}
            </button>
          </div>
        </form>

        <div className="mx-auto mt-14 max-w-5xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Unsent wall</h2>
            <p className="text-[11px] tracking-[0.15em] text-amber-500">↑ {letters.length} letters</p>
          </div>
          <div className="mb-8 h-px bg-border/60" />

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Opening the room
            </div>
          ) : letters.length === 0 ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              The room is quiet. Leave the first unsent line.
            </div>
          ) : (
            <div style={{ columns: "3 280px", columnGap: "16px" }}>
              <AnimatePresence initial={false}>
                {letters.map((letter, index) => (
                  <motion.article
                    key={letter.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: Math.min(index * 0.05, 0.45) }}
                    className="mb-4 inline-block w-full break-inside-avoid rounded-2xl border border-border bg-card p-5 transition hover:border-amber-300/30 dark:bg-[#111111]"
                  >
                    <p className="mb-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      To {letter.recipient_type || "someone"}
                    </p>
                    <p className="text-lg font-light leading-relaxed text-foreground">
                      {letter.opening_line}
                    </p>
                    <div className="mt-8 flex items-end justify-between gap-4">
                      <MeTooButton
                        letterId={letter.id}
                        count={letter.felt_count || 0}
                        onFeel={() => handleMeToo(letter)}
                      />
                      <span className="shrink-0 text-[11px] text-muted-foreground/70">{timeAgo(letter.created_at)}</span>
                    </div>
                  </motion.article>
                ))}
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
    </main>
  )
}

