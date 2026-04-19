"use client"

import React, { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ─── Types ─────────────────────────────────────────────────────────────────────

export type MentionOption =
  | { kind: "user"; id: string; name: string }
  | { kind: "status"; key: string; label: string; dotColor: string }

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  mentionOptions: MentionOption[]
  className?: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function MentionInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  mentionOptions,
  className,
}: MentionInputProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [query, setQuery] = useState("")
  const [triggerIndex, setTriggerIndex] = useState<number | null>(null)
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = mentionOptions.filter((o) => {
    const label = o.kind === "user" ? o.name : o.label
    return label.toLowerCase().includes(query.toLowerCase())
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    onChange(v)

    const pos = e.target.selectionStart ?? v.length
    const before = v.slice(0, pos)
    const atIdx = before.lastIndexOf("@")

    if (atIdx !== -1) {
      const fragment = before.slice(atIdx + 1)
      // Only trigger if no space in fragment (continuous @ word)
      if (!fragment.includes(" ")) {
        setTriggerIndex(atIdx)
        setQuery(fragment)
        setShowDropdown(true)
        setHighlighted(0)
        return
      }
    }

    setShowDropdown(false)
    setTriggerIndex(null)
  }

  const selectOption = (option: MentionOption) => {
    if (triggerIndex === null) return

    const mention =
      option.kind === "user"
        ? `@${option.name} `
        : `@status:${option.key} `

    const before = value.slice(0, triggerIndex)
    const after = value.slice(triggerIndex + 1 + query.length)
    onChange(before + mention + after)

    setShowDropdown(false)
    setTriggerIndex(null)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setHighlighted((h) => Math.max(h - 1, 0))
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        selectOption(filtered[highlighted])
        return
      }
      if (e.key === "Escape") {
        setShowDropdown(false)
        return
      }
    }
    onKeyDown?.(e)
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showDropdown])

  return (
    <div ref={containerRef} className="relative flex-1">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={cn("h-9 text-xs border-gray-300 dark:border-gray-700", className)}
      />

      {showDropdown && filtered.length > 0 && (
        <div className="absolute bottom-full mb-1 left-0 w-56 rounded-lg border bg-popover shadow-lg z-50 overflow-hidden">
          {/* Header hint */}
          <div className="px-3 py-1.5 border-b">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-medium">
              Mencionar
            </p>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.map((opt, i) => {
              const label = opt.kind === "user" ? opt.name : opt.label
              const isHighlighted = i === highlighted
              return (
                <button
                  key={opt.kind === "user" ? opt.id : `status-${opt.key}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    selectOption(opt)
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors",
                    isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                >
                  {opt.kind === "user" ? (
                    <>
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold uppercase text-foreground">
                        {opt.name[0]}
                      </span>
                      <span className="truncate font-medium">{label}</span>
                      <span className="text-muted-foreground text-[9px] ml-auto">user</span>
                    </>
                  ) : (
                    <>
                      <span className={cn("flex-shrink-0 w-2 h-2 rounded-full", (opt as Extract<MentionOption, { kind: "status" }>).dotColor)} />
                      <span className="truncate">{label}</span>
                      <span className="text-muted-foreground text-[9px] ml-auto">status</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
