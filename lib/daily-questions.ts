export const ECHO_QUESTIONS = [
  "What's the one thing you keep almost saying out loud but swallow every time?",
  "Which version of you did you have to kill to survive this far?",
  "What would you do tomorrow if you knew no one would be disappointed?",
  "When did you last feel genuinely seen not just noticed?",
  "What emotion do you not have a word for but feel almost every day?",
  "Who taught you that asking for help was weakness?",
  "What are you secretly exhausted by that everyone thinks you're fine with?",
  "What part of your life are you living for someone who doesn't even notice?",
  "What do you wish someone had told you during the hardest year of your life?",
  "What feeling do you immediately try to escape the moment it shows up?",
  "What lie do you tell most convincingly to yourself?",
  "What would your body say if it could speak right now?",
  "What's the kindest thing anyone ever said to you that you still don't believe?",
  "What are you most afraid people would find boring about the real you?",
  "What's something you forgave someone for that you never told them you forgave?",
  "When you're alone and quiet, what thought shows up uninvited every time?",
  "What do you pretend not to care about because caring feels too risky?",
  "Who in your life would be shocked by how much you're actually struggling?",
  "What chapter of your life are you still not ready to talk about?",
  "What would you do differently if you weren't afraid of being misunderstood?",
  "What emotion do you only let yourself feel when you're completely alone?",
  "What's the most human thing about you that you try to hide?",
  "Who are you when nobody needs anything from you?",
  "What have you been grieving that nobody knows to comfort you for?",
  "What's the difference between who you are and who you've let people believe you are?",
  "What would feel like relief right now — even if it sounds selfish?",
  "What's the most honest thing you've said to a stranger that you'd never say to someone close?",
  "What are you waiting to feel before you let yourself be happy?",
  "What feeling have you been calling 'fine' for so long you forgot it has another name?",
  "If the version of you from 5 years ago could see you now — what would they feel?",
]

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

export function getQuestionIndex(date = new Date()) {
  return getDayOfYear(date) % ECHO_QUESTIONS.length
}

export function getTodaysQuestion(date = new Date()) {
  return ECHO_QUESTIONS[getQuestionIndex(date)]
}

export function extractResonanceWords(text: string, fallback = "quiet, present, human") {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "also",
    "because",
    "being",
    "could",
    "every",
    "feels",
    "from",
    "have",
    "just",
    "like",
    "more",
    "need",
    "really",
    "still",
    "that",
    "their",
    "there",
    "this",
    "today",
    "want",
    "with",
    "would",
    "your",
  ])

  const words = text
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 3 && !stopWords.has(word))

  const uniqueWords = Array.from(new Set(words)).slice(0, 3)
  if (uniqueWords.length >= 3) return uniqueWords.join(", ")

  return [...uniqueWords, ...fallback.split(", ").filter((word) => !uniqueWords.includes(word))]
    .slice(0, 3)
    .join(", ")
}
