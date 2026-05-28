"use client"

const STORAGE_KEY = "unmute_anonymous_id"
const ECHO_STORAGE_KEY = "unmute_anon_id"

export function getOrCreateAnonymousId() {
  if (typeof window === "undefined") return ""

  const existingId = localStorage.getItem(ECHO_STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)
  if (existingId) return existingId

  const newId = `anon_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem(ECHO_STORAGE_KEY, newId)
  return newId
}
