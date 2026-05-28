const ALIAS_WORDS = [
  "Amber",
  "Blue",
  "Coral",
  "Dawn",
  "Echo",
  "Fog",
  "Gold",
  "Haze",
  "Iris",
  "Jade",
  "Lune",
  "Mist",
  "Nova",
  "Opal",
  "Pearl",
]

export const generateAlias = (sessionId: string): string => {
  const hash = sessionId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const word = ALIAS_WORDS[hash % ALIAS_WORDS.length]
  const num = (hash % 90) + 10
  return `${word} ${num}`
}
