"use client"

/**
 * RefundRequestDebugger
 * ─────────────────────
 * Development-only overlay that intercepts and displays every
 * requestSubsidyRefund call triggered by a WAITING_REFUND transition.
 *
 * Usage — add once inside the root layout (or any parent):
 *   import { RefundRequestDebugger } from "@/components/debug/refund-request-debugger"
 *   <RefundRequestDebugger />
 *
 * The panel is rendered ONLY when process.env.NODE_ENV === "development".
 * It auto-hides after 30 s of inactivity and can be minimised.
 *
 * How it works:
 *   1. Patches window.__refundDebugLog (a simple event bus).
 *   2. Both quick-view-modal and kanban-view call window.__refundDebugLog()
 *      at every key checkpoint (see imports of this utility).
 *   3. The panel reads from a React state wired to that bus.
 */

import React from "react"
import { cn } from "@/lib/utils"
import { X, ChevronDown, ChevronUp, Bug, CheckCircle2, AlertCircle, Loader2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// ─── Public event-bus type ────────────────────────────────────────────────────

export type RefundDebugEvent =
  | { type: "dialog_opened";    projectId: string; eligibleCount: number }
  | { type: "dialog_confirmed"; projectId: string; amount: number; reason: string; eligibleIds: string[] }
  | { type: "status_updated";   projectId: string; newStatus: string }
  | { type: "mutation_fired";   subsidyId: string; amount: number; reason: string; source: "quick-view" | "kanban" }
  | { type: "mutation_success"; subsidyId: string; refundId: string; refundAmount: number }
  | { type: "mutation_error";   subsidyId: string; message: string }
  | { type: "history_logged";   projectId: string; message: string }
  | { type: "kanban_lazy_fetch_triggered"; projectId: string; amount: number }
  | { type: "kanban_project_loaded";       projectId: string; totalSubsidies: number; eligibleCount: number }

// Extend Window so TypeScript doesn't complain
declare global {
  interface Window {
    __refundDebugLog?: (event: RefundDebugEvent) => void
  }
}

// ─── Internal entry shape ─────────────────────────────────────────────────────

interface LogEntry {
  id: number
  ts: Date
  event: RefundDebugEvent
}

// ─── Icon / colour per event type ────────────────────────────────────────────

const EVENT_META: Record<
  RefundDebugEvent["type"],
  { label: string; color: string; icon: React.ElementType }
> = {
  dialog_opened:              { label: "Dialog opened",         color: "text-blue-500",   icon: Bug },
  dialog_confirmed:           { label: "Dialog confirmed",      color: "text-blue-600",   icon: CheckCircle2 },
  status_updated:             { label: "Status updated",        color: "text-green-600",  icon: CheckCircle2 },
  mutation_fired:             { label: "Mutation fired",        color: "text-orange-500", icon: Loader2 },
  mutation_success:           { label: "Mutation ✔ success",    color: "text-green-500",  icon: CheckCircle2 },
  mutation_error:             { label: "Mutation ✖ error",      color: "text-red-500",    icon: AlertCircle },
  history_logged:             { label: "History logged",        color: "text-purple-500", icon: Clock },
  kanban_lazy_fetch_triggered:{ label: "Kanban: lazy fetch",    color: "text-cyan-500",   icon: Loader2 },
  kanban_project_loaded:      { label: "Kanban: project loaded",color: "text-cyan-600",   icon: CheckCircle2 },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RefundRequestDebugger() {
  if (process.env.NODE_ENV !== "development") return null

  return <RefundRequestDebuggerInner />
}

let _seq = 0

function RefundRequestDebuggerInner() {
  const [entries, setEntries] = React.useState<LogEntry[]>([])
  const [minimised, setMinimised] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const inactivityTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const push = React.useCallback((event: RefundDebugEvent) => {
    const entry: LogEntry = { id: ++_seq, ts: new Date(), event }
    setEntries((prev) => [entry, ...prev].slice(0, 50))  // keep last 50
    setVisible(true)
    setMinimised(false)
    // Reset inactivity timer (hide after 30 s of no new events)
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    inactivityTimer.current = setTimeout(() => setVisible(false), 30_000)
  }, [])

  // Register global event bus once
  React.useEffect(() => {
    window.__refundDebugLog = push
    return () => { window.__refundDebugLog = undefined }
  }, [push])

  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[9999] w-[420px] rounded-xl border border-border shadow-2xl bg-background text-foreground overflow-hidden",
        "transition-all duration-200"
      )}
      style={{ maxHeight: minimised ? "48px" : "420px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/60 border-b border-border gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Bug className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <span className="text-xs font-semibold truncate">Refund Request Debug</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {entries.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setMinimised((v) => !v)}
            title={minimised ? "Expand" : "Minimise"}
          >
            {minimised
              ? <ChevronUp className="w-3.5 h-3.5" />
              : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => { setVisible(false); setEntries([]) }}
            title="Close & clear"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Log list */}
      {!minimised && (
        <div className="overflow-y-auto" style={{ maxHeight: "372px" }}>
          {entries.length === 0 ? (
            <p className="px-4 py-6 text-xs text-center text-muted-foreground">
              Waiting for WAITING_REFUND transition events…
            </p>
          ) : (
            entries.map((entry, idx) => (
              <LogRow key={entry.id} entry={entry} isFirst={idx === 0} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Single log row ───────────────────────────────────────────────────────────

function LogRow({ entry, isFirst }: { entry: LogEntry; isFirst: boolean }) {
  const [expanded, setExpanded] = React.useState(isFirst)
  const meta = EVENT_META[entry.event.type]
  const Icon = meta.icon

  const ts = entry.ts.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        type="button"
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", meta.color)} />
        <span className={cn("text-xs font-medium flex-1 truncate", meta.color)}>
          {meta.label}
        </span>
        <span className="text-[10px] text-muted-foreground flex-shrink-0 font-mono">{ts}</span>
        {expanded
          ? <ChevronUp className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          : <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3">
          <Separator className="mb-2" />
          <pre className="text-[10px] leading-relaxed text-muted-foreground whitespace-pre-wrap break-all font-mono bg-muted/40 rounded p-2 overflow-auto max-h-[120px]">
            {JSON.stringify(entry.event, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
