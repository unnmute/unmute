module.exports = [
"[project]/components/BotChat.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client"
// import { ArrowLeft, ArrowUp } from "lucide-react"
// import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
// import Link from "next/link"
// type ChatMessage = {
//   role: "user" | "assistant"
//   content: string
// }
// type MiraMemo = {
//   userName: string | null
//   leadEmotion: string | null
//   keyPeople: string[]
//   keySituations: string[]
//   copingStyle: "humor" | "silence" | "venting" | null
//   crisisDetected: boolean
// }
// type MessageAnalysis = ReturnType<typeof analyzeMessage>
// type CrisisStage = "idle" | "awaiting_follow_up"
// const OPENING_LINES = [
//   "Hey. I'm here. What's going on?",
//   "I've got time. What's on your mind?",
//   "This is a safe place. Start wherever feels right.",
//   "Hey. No pressure — just talk to me.",
//   "I'm listening. Wherever you want to begin.",
// ]
// const LIMIT_MESSAGE =
//   "We've been here a while together. I hope something shifted, even a little. Be gentle with yourself today. The Sanctuary rooms are here if you want to talk to someone real."
// const MAX_MESSAGES = 20
// const SEND_COOLDOWN_MS = 2000
// const INITIAL_MEMO: MiraMemo = {
//   userName: null,
//   leadEmotion: null,
//   keyPeople: [],
//   keySituations: [],
//   copingStyle: null,
//   crisisDetected: false,
// }
// function countWords(message: string) {
//   return message.trim().split(/\s+/).filter(Boolean).length
// }
// function getEmotionallyLoadedPhrase(message: string) {
//   const lower = message.toLowerCase()
//   const candidates = [
//     "empty",
//     "numb",
//     "invisible",
//     "worthless",
//     "exhausted",
//     "alone",
//     "stuck",
//     "broken",
//     "done",
//     "hopeless",
//     "pointless",
//     "tired",
//     "angry",
//     "afraid",
//     "lost",
//   ]
//   for (const candidate of candidates) {
//     if (lower.includes(candidate)) {
//       return message.match(new RegExp(candidate, "i"))?.[0] ?? candidate
//     }
//   }
//   const words = message
//     .replace(/[^\w\s'-]/g, " ")
//     .split(/\s+/)
//     .filter((word) => word.length > 4)
//   return words[0] ?? "that"
// }
// function buildSpiralResponse(message: string) {
//   const phrase = getEmotionallyLoadedPhrase(message)
//   return `${phrase}... that's the word that stood out to me. How long has that been sitting with you?`
// }
// const analyzeMessage = (message: string, history: ChatMessage[]) => {
//   const wordCount = countWords(message)
//   const previousUserMessages = history.filter((m) => m.role === "user").slice(-3)
//   const avgPrevLength =
//     previousUserMessages.length > 0
//       ? previousUserMessages.reduce((acc, m) => acc + countWords(m.content), 0) /
//         previousUserMessages.length
//       : wordCount
//   return {
//     wordCount,
//     isGuarded: wordCount < 5,
//     isVenting: wordCount > 80,
//     isSpiral: wordCount > 60,
//     gettingShorter: previousUserMessages.length > 0 && wordCount < avgPrevLength * 0.6,
//     gettingLonger: previousUserMessages.length > 0 && wordCount > avgPrevLength * 1.5,
//     hasAnger: /angry|furious|hate|awful|terrible|worst|done with/i.test(message),
//     hasDirectAngerAtMira:
//       /\b(mira|you|your|bot|ai)\b/i.test(message) &&
//       /\b(annoying|useless|stupid|fake|liar|worst|hate|shut up|leave me|stop)\b/i.test(message),
//     hasHumor: /haha|lol|lmao|funny|ironic|joke/i.test(message),
//     hasCrisis:
//       /suicide|kill myself|end it|don't want to exist|self harm|hurt myself|everyone would be fine without me|nobody would miss me|better off without me|don't want to be here|no point anymore|what's the point|tired of being alive|can't do this anymore|done with everything/i.test(
//         message
//       ),
//     asksIfReal:
//       /\b(are you real|real person|are you human|are you a human|are you ai|are you a bot|who are you really)\b/i.test(
//         message
//       ),
//     messageCount: history.filter((m) => m.role === "user").length + 1,
//   }
// }
// const buildContextNote = (analysis: MessageAnalysis) => {
//   const notes = []
//   if (analysis.isGuarded) notes.push("Person seems guarded — be extra gentle, ask nothing yet")
//   if (analysis.isVenting) notes.push("Person is venting heavily — mostly reflect, minimal questions")
//   if (analysis.gettingShorter) notes.push("Responses getting shorter — they may be withdrawing, slow down")
//   if (analysis.gettingLonger) notes.push("Opening up more — this is good, stay warm and curious")
//   if (analysis.hasAnger) notes.push("Anger detected — don't minimize it, hold space for it")
//   if (analysis.hasHumor) notes.push("Using humor — okay to be slightly lighter in response")
//   if (analysis.hasCrisis) notes.push("CRISIS SIGNALS DETECTED — follow crisis protocol immediately")
//   if (analysis.hasDirectAngerAtMira) notes.push("User is angry at Mira directly — one sentence, no defense")
//   if (analysis.isSpiral) notes.push("Long spiral detected — do not summarize; reflect one loaded phrase only")
//   if (analysis.asksIfReal) notes.push("Answer realness question honestly and warmly without dodging")
//   if (analysis.messageCount === 1) notes.push("First message — open gently, don't probe yet")
//   if (analysis.messageCount > 10) notes.push("Long conversation — you know them now, be more personal")
//   return notes.length > 0 ? `\n\n[CONVERSATION CONTEXT: ${notes.join(". ")}]` : ""
// }
// const buildPhraseLimitNote = (history: ChatMessage[]) => {
//   const assistantText = history
//     .filter((message) => message.role === "assistant")
//     .map((message) => message.content.toLowerCase())
//     .join(" ")
//   const notes = []
//   if ((assistantText.match(/\bit sounds like\b/g) || []).length >= 1) {
//     notes.push('Do not use "It sounds like" again in this conversation')
//   }
//   if ((assistantText.match(/\bi hear you\b/g) || []).length >= 1) {
//     notes.push('Do not use "I hear you" again in this conversation')
//   }
//   return notes.length > 0 ? `\n\n[STYLE LIMITS: ${notes.join(". ")}]` : ""
// }
// const buildMemoryNote = (memo: MiraMemo) => {
//   if (!memo.leadEmotion && !memo.userName && !memo.keyPeople.length && !memo.keySituations.length) {
//     return ""
//   }
//   const parts = []
//   if (memo.userName) parts.push(`Their name is ${memo.userName}`)
//   if (memo.leadEmotion) parts.push(`They came in feeling ${memo.leadEmotion}`)
//   if (memo.keyPeople.length) parts.push(`People mentioned: ${memo.keyPeople.join(", ")}`)
//   if (memo.keySituations.length) parts.push(`Situations: ${memo.keySituations.join(", ")}`)
//   if (memo.copingStyle) parts.push(`Coping style: ${memo.copingStyle}`)
//   if (memo.crisisDetected) parts.push("Crisis signal has appeared in this conversation")
//   return `\n\n[MIRA'S MEMORY: ${parts.join(". ")}]`
// }
// function uniqueList(items: string[]) {
//   return Array.from(new Set(items)).slice(0, 6)
// }
// function updateMiraMemo(currentMemo: MiraMemo, message: string, analysis: MessageAnalysis): MiraMemo {
//   const nameMatch = message.match(/\b(?:my name is|i'm|i am|call me)\s+([a-zA-Z][a-zA-Z'-]*)/i)
//   const personMatch = message.match(/\bmy\s+(mom|dad|friend|partner|boss|sister|brother)\s+([a-zA-Z][a-zA-Z'-]*)/i)
//   const emotionMatch = message.match(/\b(anxious|lonely|burned out|burnt out|sad|angry|numb|scared|overwhelmed|tired|empty|stressed|lost|hurt)\b/i)
//   const situationMatches = message.match(/\b(work|job|school|college|relationship|family|home|friendship|breakup|exam|money|marriage)\b/gi) ?? []
//   return {
//     userName: currentMemo.userName ?? nameMatch?.[1] ?? null,
//     leadEmotion: currentMemo.leadEmotion ?? emotionMatch?.[1]?.toLowerCase() ?? null,
//     keyPeople: uniqueList([
//       ...currentMemo.keyPeople,
//       ...(personMatch ? [`${personMatch[1]} ${personMatch[2]}`] : []),
//     ]),
//     keySituations: uniqueList([
//       ...currentMemo.keySituations,
//       ...situationMatches.map((situation) => situation.toLowerCase()),
//     ]),
//     copingStyle: analysis.hasHumor
//       ? "humor"
//       : analysis.isVenting
//         ? "venting"
//         : analysis.isGuarded
//           ? "silence"
//           : currentMemo.copingStyle,
//     crisisDetected: currentMemo.crisisDetected || analysis.hasCrisis,
//   }
// }
// function renderBotText(content: string) {
//   const crisisNumber = "9152987821"
//   const parts = content.split(crisisNumber)
//   if (parts.length === 1) {
//     return content
//   }
//   return parts.map((part, index) => (
//     <span key={`${part}-${index}`}>
//       {part}
//       {index < parts.length - 1 ? (
//         <a
//           href={`tel:${crisisNumber}`}
//           className="border-b border-violet-400/40 text-violet-300 no-underline transition-colors hover:text-violet-200"
//         >
//           {crisisNumber}
//         </a>
//       ) : null}
//     </span>
//   ))
// }
// function TypingIndicator() {
//   return (
//     <div className="flex items-center gap-1.5 px-1 py-3" aria-label="mira is typing">
//       {[0, 1, 2].map((dot) => (
//         <span
//           key={dot}
//           className="h-1.5 w-1.5 rounded-full bg-violet-300/55"
//           style={{
//             animation: "mira-dot-breathe 1.45s ease-in-out infinite",
//             animationDelay: `${dot * 220}ms`,
//           }}
//         />
//       ))}
//     </div>
//   )
// }
// function MiraLabel() {
//   return (
//     <div className="mb-2 flex items-center gap-2">
//       <span className="mira-presence" aria-hidden="true" />
//       <p className="text-[11px] font-light lowercase italic tracking-[0.18em] text-violet-300/70">
//         mira
//       </p>
//     </div>
//   )
// }
// export function BotChat() {
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [input, setInput] = useState("")
//   const [isResponding, setIsResponding] = useState(false)
//   const [isSendLocked, setIsSendLocked] = useState(false)
//   const [miraMemo, setMiraMemo] = useState<MiraMemo>(INITIAL_MEMO)
//   const [crisisStage, setCrisisStage] = useState<CrisisStage>("idle")
//   const scrollRef = useRef<HTMLDivElement>(null)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)
//   const cooldownRef = useRef<number | null>(null)
//   useEffect(() => {
//     const timeout = window.setTimeout(() => {
//       const openingLine = OPENING_LINES[Math.floor(Math.random() * OPENING_LINES.length)]
//       setMessages([{ role: "assistant", content: openingLine }])
//     }, 800)
//     return () => window.clearTimeout(timeout)
//   }, [])
//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     })
//   }, [messages, isResponding])
//   useEffect(() => {
//     return () => {
//       if (cooldownRef.current) {
//         window.clearTimeout(cooldownRef.current)
//       }
//     }
//   }, [])
//   const hasReachedLimit = messages.length >= MAX_MESSAGES
//   const canSend = input.trim().length > 0 && !isResponding && !isSendLocked && !hasReachedLimit
//   async function sendMessage() {
//     const content = input.trim()
//     if (!content || !canSend) {
//       return
//     }
//     const analysis = analyzeMessage(content, messages)
//     const nextMemo = updateMiraMemo(miraMemo, content, analysis)
//     const nextMessages: ChatMessage[] = [...messages, { role: "user", content }]
//     setMessages(nextMessages)
//     setMiraMemo(nextMemo)
//     setInput("")
//     setIsSendLocked(true)
//     cooldownRef.current = window.setTimeout(() => {
//       setIsSendLocked(false)
//       cooldownRef.current = null
//     }, SEND_COOLDOWN_MS)
//     if (nextMessages.length >= MAX_MESSAGES) {
//       return
//     }
//     if (crisisStage === "awaiting_follow_up") {
//       setMessages((current) => [
//         ...current,
//         {
//           role: "assistant",
//           content:
//             "I'm really glad you're talking to me. I want to make sure you have someone real too — iCall is free, confidential, and human: 9152987821. I'm still here with you.",
//         },
//       ])
//       setCrisisStage("idle")
//       textareaRef.current?.focus()
//       return
//     }
//     if (analysis.hasCrisis) {
//       setMessages((current) => [
//         ...current,
//         {
//           role: "assistant",
//           content:
//             "I need to pause here for a second. That thought — that everyone would be fine without you — I don't want to move past it. Are you safe right now?",
//         },
//       ])
//       setCrisisStage("awaiting_follow_up")
//       textareaRef.current?.focus()
//       return
//     }
//     if (analysis.hasDirectAngerAtMira) {
//       setMessages((current) => [
//         ...current,
//         {
//           role: "assistant",
//           content: "Fair enough. I'm still here if you want to keep going.",
//         },
//       ])
//       textareaRef.current?.focus()
//       return
//     }
//     if (analysis.asksIfReal) {
//       setMessages((current) => [
//         ...current,
//         {
//           role: "assistant",
//           content:
//             "I'm Mira — I'm an AI, not a human. But what you're feeling is real, and I'm genuinely built to listen, not just respond. What made you want to ask that?",
//         },
//       ])
//       textareaRef.current?.focus()
//       return
//     }
//     if (analysis.isSpiral) {
//       setMessages((current) => [
//         ...current,
//         {
//           role: "assistant",
//           content: buildSpiralResponse(content),
//         },
//       ])
//       textareaRef.current?.focus()
//       return
//     }
//     setIsResponding(true)
//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messages: nextMessages,
//           contextNote: `${buildContextNote(analysis)}${buildPhraseLimitNote(nextMessages)}`,
//           memoryNote: buildMemoryNote(nextMemo),
//         }),
//       })
//       if (!response.ok) {
//         throw new Error("Chat request failed")
//       }
//       const data = await response.json()
//       const reply = typeof data.reply === "string" ? data.reply : "I'm here. Say that one more time?"
//       setMessages((current) => [...current, { role: "assistant", content: reply }])
//     } catch {
//       setMessages((current) => [
//         ...current,
//         {
//           role: "assistant",
//           content: "I'm here, but something went quiet on my side. Could you try again in a moment?",
//         },
//       ])
//     } finally {
//       setIsResponding(false)
//       textareaRef.current?.focus()
//     }
//   }
//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     void sendMessage()
//   }
//   function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault()
//       void sendMessage()
//     }
//   }
//   return (
//     <main className="flex min-h-screen bg-background text-foreground">
//       <style jsx global>{`
//         @keyframes breathe {
//           0%,
//           100% {
//             opacity: 0.3;
//             transform: scale(1);
//           }
//           50% {
//             opacity: 0.7;
//             transform: scale(1.3);
//           }
//         }
//         @keyframes mira-dot-breathe {
//           0%,
//           100% {
//             opacity: 0.25;
//             transform: scale(0.9);
//           }
//           45% {
//             opacity: 0.75;
//             transform: scale(1.25);
//           }
//         }
//         .mira-presence {
//           width: 6px;
//           height: 6px;
//           background: rgba(139, 92, 246, 0.6);
//           border-radius: 50%;
//           animation: breathe 3s ease-in-out infinite;
//         }
//       `}</style>
//       <section className="mx-auto flex h-screen w-full max-w-3xl flex-col px-4 pt-8 sm:px-6 sm:pt-10">
//         <header className="shrink-0 pb-6">
//           <div className="mb-4 flex items-center justify-start">
//             <Link
//               href="/"
//               className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition hover:text-foreground"
//               aria-label="Return home"
//             >
//               <ArrowLeft className="h-4 w-4" aria-hidden="true" />
//             </Link>
//           </div>
//           <h1 className="text-base font-light tracking-wide text-muted-foreground/70 sm:text-lg">
//             You&apos;re not alone. Talk to me.
//           </h1>
//         </header>
//         <div
//           ref={scrollRef}
//           className="flex-1 overflow-y-auto overscroll-contain px-1 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//           aria-live="polite"
//         >
//           <div className="flex min-h-full flex-col justify-end gap-7">
//             {messages.map((message, index) =>
//               message.role === "user" ? (
//                 <div key={`${message.role}-${index}`} className="flex animate-in fade-in duration-200 justify-end">
//                   <p className="max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-secondary px-4 py-3 text-sm leading-6 text-foreground/90 sm:max-w-[70%]">
//                     {message.content}
//                   </p>
//                 </div>
//               ) : (
//                 <div key={`${message.role}-${index}`} className="max-w-[86%] animate-in fade-in duration-200 sm:max-w-[72%]">
//                   <MiraLabel />
//                   <p className="whitespace-pre-wrap text-[15px] font-light leading-7 text-foreground/85">
//                     {renderBotText(message.content)}
//                   </p>
//                 </div>
//               )
//             )}
//             {isResponding ? (
//               <div className="max-w-[86%] sm:max-w-[72%]">
//                 <MiraLabel />
//                 <TypingIndicator />
//               </div>
//             ) : null}
//             {hasReachedLimit ? (
//               <div className="mx-auto flex max-w-sm flex-col items-center px-4 pb-2 text-center">
//                 <p className="text-sm font-light leading-6 text-muted-foreground">
//                   {LIMIT_MESSAGE}
//                 </p>
//                 <Link
//                   href="/"
//                   className="mt-4 rounded-full border border-violet-300/25 bg-violet-300/10 px-5 py-2.5 text-sm font-medium text-violet-100 transition-colors hover:border-violet-200/45 hover:bg-violet-300/15"
//                 >
//                   Find a Sanctuary room →
//                 </Link>
//               </div>
//             ) : null}
//           </div>
//         </div>
//         <form
//           onSubmit={handleSubmit}
//           className="shrink-0 border-t border-border/70 bg-background/95 pb-5 pt-4"
//         >
//           <div className="flex items-end gap-2 rounded-2xl border border-border bg-card/60 px-3 py-2 focus-within:border-muted-foreground/50">
//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={(event) => setInput(event.target.value)}
//               onKeyDown={handleKeyDown}
//               rows={1}
//               disabled={hasReachedLimit}
//               placeholder="Say anything. This stays between us."
//               className="max-h-36 min-h-11 flex-1 resize-none bg-transparent py-3 text-base leading-6 text-foreground outline-none placeholder:text-muted-foreground/45 disabled:cursor-not-allowed disabled:opacity-50"
//             />
//             <button
//               type="submit"
//               disabled={!canSend}
//               aria-label="Send message"
//               className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
//             >
//               <ArrowUp className="h-4 w-4" strokeWidth={2} />
//             </button>
//           </div>
//         </form>
//       </section>
//     </main>
//   )
// }
__turbopack_context__.s([
    "BotChat",
    ()=>BotChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-ssr] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const OPENING_LINES = [
    "Hey. I'm here. What's going on?",
    "I've got time. What's on your mind?",
    "This is a safe place. Start wherever feels right.",
    "Hey. No pressure — just talk to me.",
    "I'm listening. Wherever you want to begin."
];
const LIMIT_MESSAGE = "We've been here a while together. I hope something shifted, even a little. Be gentle with yourself today. The Sanctuary rooms are here if you want to talk to someone real.";
const MAX_MESSAGES = 20;
const SEND_COOLDOWN_MS = 2000;
const INITIAL_MEMO = {
    userName: null,
    leadEmotion: null,
    keyPeople: [],
    keySituations: [],
    copingStyle: null,
    crisisDetected: false
};
function countWords(message) {
    return message.trim().split(/\s+/).filter(Boolean).length;
}
function getEmotionallyLoadedPhrase(message) {
    const lower = message.toLowerCase();
    const candidates = [
        "empty",
        "numb",
        "invisible",
        "worthless",
        "exhausted",
        "alone",
        "stuck",
        "broken",
        "done",
        "hopeless",
        "pointless",
        "tired",
        "angry",
        "afraid",
        "lost"
    ];
    for (const candidate of candidates){
        if (lower.includes(candidate)) {
            return message.match(new RegExp(candidate, "i"))?.[0] ?? candidate;
        }
    }
    const words = message.replace(/[^\w\s'-]/g, " ").split(/\s+/).filter((word)=>word.length > 4);
    return words[0] ?? "that";
}
function buildSpiralResponse(message) {
    const phrase = getEmotionallyLoadedPhrase(message);
    // Only return hardcoded spiral response if a real emotional word was found
    // Otherwise let the AI handle it naturally
    const hasEmotionalWord = [
        "empty",
        "numb",
        "invisible",
        "worthless",
        "exhausted",
        "alone",
        "stuck",
        "broken",
        "done",
        "hopeless",
        "pointless",
        "tired",
        "angry",
        "afraid",
        "lost"
    ].some((w)=>message.toLowerCase().includes(w));
    if (!hasEmotionalWord) return null;
    return `${phrase}... that's the word that stood out to me. How long has that been sitting with you?`;
}
const analyzeMessage = (message, history)=>{
    const wordCount = countWords(message);
    const previousUserMessages = history.filter((m)=>m.role === "user").slice(-3);
    const avgPrevLength = previousUserMessages.length > 0 ? previousUserMessages.reduce((acc, m)=>acc + countWords(m.content), 0) / previousUserMessages.length : wordCount;
    return {
        wordCount,
        isGuarded: wordCount < 5,
        isVenting: wordCount > 80,
        isSpiral: wordCount > 60,
        gettingShorter: previousUserMessages.length > 0 && wordCount < avgPrevLength * 0.6,
        gettingLonger: previousUserMessages.length > 0 && wordCount > avgPrevLength * 1.5,
        hasAnger: /angry|furious|hate|awful|terrible|worst|done with/i.test(message),
        hasDirectAngerAtMira: /\b(mira|you|your|bot|ai)\b/i.test(message) && /\b(annoying|useless|stupid|fake|liar|worst|hate|shut up|leave me|stop)\b/i.test(message),
        hasHumor: /haha|lol|lmao|funny|ironic|joke/i.test(message),
        hasCrisis: /suicide|kill myself|end it|don't want to exist|self harm|hurt myself|everyone would be fine without me|nobody would miss me|better off without me|don't want to be here|no point anymore|what's the point|tired of being alive|can't do this anymore|done with everything/i.test(message),
        asksIfReal: /\b(are you real|real person|are you human|are you a human|are you ai|are you a bot|who are you really|you a real|you human|you an ai|you actually real|actually a person|actually human)\b/i.test(message),
        messageCount: history.filter((m)=>m.role === "user").length + 1
    };
};
const buildContextNote = (analysis)=>{
    const notes = [];
    if (analysis.isGuarded) notes.push("Person seems guarded — be extra gentle, ask nothing yet");
    if (analysis.isVenting) notes.push("Person is venting heavily — mostly reflect, minimal questions");
    if (analysis.gettingShorter) notes.push("Responses getting shorter — they may be withdrawing, slow down");
    if (analysis.gettingLonger) notes.push("Opening up more — this is good, stay warm and curious");
    if (analysis.hasAnger) notes.push("Anger detected — don't minimize it, hold space for it");
    if (analysis.hasHumor) notes.push("Using humor — okay to be slightly lighter in response");
    if (analysis.hasCrisis) notes.push("CRISIS SIGNALS DETECTED — follow crisis protocol immediately");
    if (analysis.hasDirectAngerAtMira) notes.push("User is angry at Mira directly — one sentence, no defense");
    if (analysis.isSpiral) notes.push("Long spiral detected — do not summarize; reflect one loaded phrase only");
    if (analysis.asksIfReal) notes.push("Answer realness question honestly and warmly without dodging");
    if (analysis.messageCount === 1) notes.push("First message — open gently, don't probe yet");
    if (analysis.messageCount > 10) notes.push("Long conversation — you know them now, be more personal");
    return notes.length > 0 ? `\n\n[CONVERSATION CONTEXT: ${notes.join(". ")}]` : "";
};
const buildPhraseLimitNote = (history)=>{
    const assistantText = history.filter((message)=>message.role === "assistant").map((message)=>message.content.toLowerCase()).join(" ");
    const notes = [];
    if ((assistantText.match(/\bit sounds like\b/g) || []).length >= 1) {
        notes.push('Do not use "It sounds like" again in this conversation');
    }
    if ((assistantText.match(/\bi hear you\b/g) || []).length >= 1) {
        notes.push('Do not use "I hear you" again in this conversation');
    }
    return notes.length > 0 ? `\n\n[STYLE LIMITS: ${notes.join(". ")}]` : "";
};
const buildMemoryNote = (memo)=>{
    if (!memo.leadEmotion && !memo.userName && !memo.keyPeople.length && !memo.keySituations.length) {
        return "";
    }
    const parts = [];
    if (memo.userName) parts.push(`Their name is ${memo.userName}`);
    if (memo.leadEmotion) parts.push(`They came in feeling ${memo.leadEmotion}`);
    if (memo.keyPeople.length) parts.push(`People mentioned: ${memo.keyPeople.join(", ")}`);
    if (memo.keySituations.length) parts.push(`Situations: ${memo.keySituations.join(", ")}`);
    if (memo.copingStyle) parts.push(`Coping style: ${memo.copingStyle}`);
    if (memo.crisisDetected) parts.push("Crisis signal has appeared in this conversation");
    return `\n\n[MIRA'S MEMORY: ${parts.join(". ")}]`;
};
function uniqueList(items) {
    return Array.from(new Set(items)).slice(0, 6);
}
function updateMiraMemo(currentMemo, message, analysis) {
    const nameMatch = message.match(/\b(?:my name is|i'm|i am|call me)\s+([a-zA-Z][a-zA-Z'-]*)/i);
    const personMatch = message.match(/\bmy\s+(mom|dad|friend|partner|boss|sister|brother)\s+([a-zA-Z][a-zA-Z'-]*)/i);
    const emotionMatch = message.match(/\b(anxious|lonely|burned out|burnt out|sad|angry|numb|scared|overwhelmed|tired|empty|stressed|lost|hurt)\b/i);
    const situationMatches = message.match(/\b(work|job|school|college|relationship|family|home|friendship|breakup|exam|money|marriage)\b/gi) ?? [];
    return {
        userName: currentMemo.userName ?? nameMatch?.[1] ?? null,
        leadEmotion: currentMemo.leadEmotion ?? emotionMatch?.[1]?.toLowerCase() ?? null,
        keyPeople: uniqueList([
            ...currentMemo.keyPeople,
            ...personMatch ? [
                `${personMatch[1]} ${personMatch[2]}`
            ] : []
        ]),
        keySituations: uniqueList([
            ...currentMemo.keySituations,
            ...situationMatches.map((situation)=>situation.toLowerCase())
        ]),
        copingStyle: analysis.hasHumor ? "humor" : analysis.isVenting ? "venting" : analysis.isGuarded ? "silence" : currentMemo.copingStyle,
        crisisDetected: currentMemo.crisisDetected || analysis.hasCrisis
    };
}
function renderBotText(content) {
    const crisisNumber = "9152987821";
    const parts = content.split(crisisNumber);
    if (parts.length === 1) {
        return content;
    }
    return parts.map((part, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: [
                part,
                index < parts.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: `tel:${crisisNumber}`,
                    className: "border-b border-violet-400/40 text-violet-300 no-underline transition-colors hover:text-violet-200",
                    children: crisisNumber
                }, void 0, false, {
                    fileName: "[project]/components/BotChat.tsx",
                    lineNumber: 781,
                    columnNumber: 9
                }, this) : null
            ]
        }, `${part}-${index}`, true, {
            fileName: "[project]/components/BotChat.tsx",
            lineNumber: 778,
            columnNumber: 5
        }, this));
}
function TypingIndicator() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1.5 px-1 py-3",
        "aria-label": "mira is typing",
        children: [
            0,
            1,
            2
        ].map((dot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "h-1.5 w-1.5 rounded-full bg-violet-300/55",
                style: {
                    animation: "mira-dot-breathe 1.45s ease-in-out infinite",
                    animationDelay: `${dot * 220}ms`
                }
            }, dot, false, {
                fileName: "[project]/components/BotChat.tsx",
                lineNumber: 796,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/BotChat.tsx",
        lineNumber: 794,
        columnNumber: 5
    }, this);
}
function MiraLabel() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-2 flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mira-presence",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/components/BotChat.tsx",
                lineNumber: 812,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] font-light lowercase italic tracking-[0.18em] text-violet-300/70",
                children: "mira"
            }, void 0, false, {
                fileName: "[project]/components/BotChat.tsx",
                lineNumber: 813,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/BotChat.tsx",
        lineNumber: 811,
        columnNumber: 5
    }, this);
}
function BotChat() {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isResponding, setIsResponding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSendLocked, setIsSendLocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [miraMemo, setMiraMemo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(INITIAL_MEMO);
    const [crisisStage, setCrisisStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cooldownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timeout = window.setTimeout(()=>{
            const openingLine = OPENING_LINES[Math.floor(Math.random() * OPENING_LINES.length)];
            setMessages([
                {
                    role: "assistant",
                    content: openingLine
                }
            ]);
        }, 800);
        return ()=>window.clearTimeout(timeout);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [
        messages,
        isResponding
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (cooldownRef.current) {
                window.clearTimeout(cooldownRef.current);
            }
        };
    }, []);
    const hasReachedLimit = messages.length >= MAX_MESSAGES;
    const canSend = input.trim().length > 0 && !isResponding && !isSendLocked && !hasReachedLimit;
    async function sendMessage() {
        const content = input.trim();
        if (!content || !canSend) {
            return;
        }
        const analysis = analyzeMessage(content, messages);
        const nextMemo = updateMiraMemo(miraMemo, content, analysis);
        const nextMessages = [
            ...messages,
            {
                role: "user",
                content
            }
        ];
        setMessages(nextMessages);
        setMiraMemo(nextMemo);
        setInput("");
        setIsSendLocked(true);
        cooldownRef.current = window.setTimeout(()=>{
            setIsSendLocked(false);
            cooldownRef.current = null;
        }, SEND_COOLDOWN_MS);
        if (nextMessages.length >= MAX_MESSAGES) {
            return;
        }
        if (crisisStage === "awaiting_follow_up") {
            setMessages((current)=>[
                    ...current,
                    {
                        role: "assistant",
                        content: "I'm really glad you're talking to me. I want to make sure you have someone real too — iCall is free, confidential, and human: 9152987821. I'm still here with you."
                    }
                ]);
            setCrisisStage("idle");
            // Keep crisisDetected in memo so Mira stays aware for rest of conversation
            textareaRef.current?.focus();
            return;
        }
        if (analysis.hasCrisis) {
            setMessages((current)=>[
                    ...current,
                    {
                        role: "assistant",
                        content: "I need to pause here for a second. That thought — that everyone would be fine without you — I don't want to move past it. Are you safe right now?"
                    }
                ]);
            setCrisisStage("awaiting_follow_up");
            textareaRef.current?.focus();
            return;
        }
        if (analysis.hasDirectAngerAtMira) {
            setMessages((current)=>[
                    ...current,
                    {
                        role: "assistant",
                        content: "Fair enough. I'm still here if you want to keep going."
                    }
                ]);
            textareaRef.current?.focus();
            return;
        }
        if (analysis.asksIfReal) {
            setMessages((current)=>[
                    ...current,
                    {
                        role: "assistant",
                        content: "I'm Mira — I'm an AI, not a human. But what you're feeling is real, and I'm genuinely built to listen, not just respond. What made you want to ask that?"
                    }
                ]);
            textareaRef.current?.focus();
            return;
        }
        if (analysis.isSpiral) {
            const spiralReply = buildSpiralResponse(content);
            if (spiralReply) {
                setMessages((current)=>[
                        ...current,
                        {
                            role: "assistant",
                            content: spiralReply
                        }
                    ]);
                textareaRef.current?.focus();
                return;
            }
        // No emotional keyword found — fall through to AI with spiral context note
        }
        setIsResponding(true);
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: nextMessages,
                    contextNote: `${buildContextNote(analysis)}${buildPhraseLimitNote(nextMessages)}`,
                    memoryNote: buildMemoryNote(nextMemo)
                })
            });
            if (!response.ok) {
                throw new Error("Chat request failed");
            }
            const data = await response.json();
            const reply = typeof data.reply === "string" ? data.reply : "I'm here. Say that one more time?";
            setMessages((current)=>[
                    ...current,
                    {
                        role: "assistant",
                        content: reply
                    }
                ]);
        } catch  {
            setMessages((current)=>[
                    ...current,
                    {
                        role: "assistant",
                        content: "I'm here, but something went quiet on my side. Could you try again in a moment?"
                    }
                ]);
        } finally{
            setIsResponding(false);
            textareaRef.current?.focus();
        }
    }
    function handleSubmit(event) {
        event.preventDefault();
        void sendMessage();
    }
    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void sendMessage();
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "jsx-3571a20d6a097d98" + " " + "flex min-h-screen bg-background text-foreground",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "3571a20d6a097d98",
                children: "@keyframes breathe{0%,to{opacity:.3;transform:scale(1)}50%{opacity:.7;transform:scale(1.3)}}@keyframes mira-dot-breathe{0%,to{opacity:.25;transform:scale(.9)}45%{opacity:.75;transform:scale(1.25)}}.mira-presence{background:#8b5cf699;border-radius:50%;width:6px;height:6px;animation:3s ease-in-out infinite breathe}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-3571a20d6a097d98" + " " + "mx-auto flex h-screen w-full max-w-3xl flex-col px-4 pt-8 sm:px-6 sm:pt-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "jsx-3571a20d6a097d98" + " " + "shrink-0 pb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3571a20d6a097d98" + " " + "mb-4 flex items-center justify-start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition hover:text-foreground",
                                    "aria-label": "Return home",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "h-4 w-4",
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/components/BotChat.tsx",
                                        lineNumber: 1041,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/BotChat.tsx",
                                    lineNumber: 1036,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/BotChat.tsx",
                                lineNumber: 1035,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "jsx-3571a20d6a097d98" + " " + "text-base font-light tracking-wide text-muted-foreground/70 sm:text-lg",
                                children: "You're not alone. Talk to me."
                            }, void 0, false, {
                                fileName: "[project]/components/BotChat.tsx",
                                lineNumber: 1044,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/BotChat.tsx",
                        lineNumber: 1034,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: scrollRef,
                        "aria-live": "polite",
                        className: "jsx-3571a20d6a097d98" + " " + "flex-1 overflow-y-auto overscroll-contain px-1 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3571a20d6a097d98" + " " + "flex min-h-full flex-col justify-end gap-7",
                            children: [
                                messages.map((message, index)=>message.role === "user" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3571a20d6a097d98" + " " + "flex animate-in fade-in duration-200 justify-end",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-3571a20d6a097d98" + " " + "max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-secondary px-4 py-3 text-sm leading-6 text-foreground/90 sm:max-w-[70%]",
                                            children: message.content
                                        }, void 0, false, {
                                            fileName: "[project]/components/BotChat.tsx",
                                            lineNumber: 1058,
                                            columnNumber: 19
                                        }, this)
                                    }, `${message.role}-${index}`, false, {
                                        fileName: "[project]/components/BotChat.tsx",
                                        lineNumber: 1057,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3571a20d6a097d98" + " " + "max-w-[86%] animate-in fade-in duration-200 sm:max-w-[72%]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MiraLabel, {}, void 0, false, {
                                                fileName: "[project]/components/BotChat.tsx",
                                                lineNumber: 1064,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-3571a20d6a097d98" + " " + "whitespace-pre-wrap text-[15px] font-light leading-7 text-foreground/85",
                                                children: renderBotText(message.content)
                                            }, void 0, false, {
                                                fileName: "[project]/components/BotChat.tsx",
                                                lineNumber: 1065,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, `${message.role}-${index}`, true, {
                                        fileName: "[project]/components/BotChat.tsx",
                                        lineNumber: 1063,
                                        columnNumber: 17
                                    }, this)),
                                isResponding ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-3571a20d6a097d98" + " " + "max-w-[86%] sm:max-w-[72%]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MiraLabel, {}, void 0, false, {
                                            fileName: "[project]/components/BotChat.tsx",
                                            lineNumber: 1074,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingIndicator, {}, void 0, false, {
                                            fileName: "[project]/components/BotChat.tsx",
                                            lineNumber: 1075,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/BotChat.tsx",
                                    lineNumber: 1073,
                                    columnNumber: 15
                                }, this) : null,
                                hasReachedLimit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-3571a20d6a097d98" + " " + "mx-auto flex max-w-sm flex-col items-center px-4 pb-2 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-3571a20d6a097d98" + " " + "text-sm font-light leading-6 text-muted-foreground",
                                            children: LIMIT_MESSAGE
                                        }, void 0, false, {
                                            fileName: "[project]/components/BotChat.tsx",
                                            lineNumber: 1081,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/",
                                            className: "mt-4 rounded-full border border-violet-300/25 bg-violet-300/10 px-5 py-2.5 text-sm font-medium text-violet-100 transition-colors hover:border-violet-200/45 hover:bg-violet-300/15",
                                            children: "Find a Sanctuary room →"
                                        }, void 0, false, {
                                            fileName: "[project]/components/BotChat.tsx",
                                            lineNumber: 1084,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/BotChat.tsx",
                                    lineNumber: 1080,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/BotChat.tsx",
                            lineNumber: 1054,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/BotChat.tsx",
                        lineNumber: 1049,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "jsx-3571a20d6a097d98" + " " + "shrink-0 border-t border-border/70 bg-background/95 pb-5 pt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3571a20d6a097d98" + " " + "flex items-end gap-2 rounded-2xl border border-border bg-card/60 px-3 py-2 focus-within:border-muted-foreground/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    ref: textareaRef,
                                    value: input,
                                    onChange: (event)=>setInput(event.target.value),
                                    onKeyDown: handleKeyDown,
                                    rows: 1,
                                    disabled: hasReachedLimit,
                                    placeholder: "Say anything. This stays between us.",
                                    className: "jsx-3571a20d6a097d98" + " " + "max-h-36 min-h-11 flex-1 resize-none bg-transparent py-3 text-base leading-6 text-foreground outline-none placeholder:text-muted-foreground/45 disabled:cursor-not-allowed disabled:opacity-50"
                                }, void 0, false, {
                                    fileName: "[project]/components/BotChat.tsx",
                                    lineNumber: 1100,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: !canSend,
                                    "aria-label": "Send message",
                                    className: "jsx-3571a20d6a097d98" + " " + "mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                        className: "h-4 w-4",
                                        strokeWidth: 2
                                    }, void 0, false, {
                                        fileName: "[project]/components/BotChat.tsx",
                                        lineNumber: 1116,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/BotChat.tsx",
                                    lineNumber: 1110,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/BotChat.tsx",
                            lineNumber: 1099,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/BotChat.tsx",
                        lineNumber: 1095,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/BotChat.tsx",
                lineNumber: 1033,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/BotChat.tsx",
        lineNumber: 999,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=components_BotChat_tsx_51c28916._.js.map