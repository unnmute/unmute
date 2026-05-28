"use client"

export const getFingerprint = (): string => {
  if (typeof window === "undefined") return ""

  const stored = localStorage.getItem("unmute_device_fp")
  if (stored) return stored

  const signals = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}`,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.platform || "",
  ].join("|")

  let hash = 0
  for (let i = 0; i < signals.length; i++) {
    hash = (hash << 5) - hash + signals.charCodeAt(i)
    hash |= 0
  }

  const fp = Math.abs(hash).toString(36)
  localStorage.setItem("unmute_device_fp", fp)
  return fp
}
