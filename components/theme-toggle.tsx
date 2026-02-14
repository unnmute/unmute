"use client"

import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import { Sun, Moon, Monitor } from "lucide-react"

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-border bg-secondary/50" />
    )
  }

  const current = options.find((o) => o.value === theme) || options[2]
  const CurrentIcon = current.icon

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label={`Current theme: ${current.label}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <CurrentIcon className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-36 rounded-xl border border-border bg-popover p-1 shadow-lg"
          role="listbox"
          aria-label="Theme selection"
        >
          {options.map((option) => {
            const Icon = option.icon
            const isActive = theme === option.value
            return (
              <button
                key={option.value}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setTheme(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
