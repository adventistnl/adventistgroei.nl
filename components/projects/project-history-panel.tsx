"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  MessageCircle,
  Trash2,
  Loader2,
  Send,
  User,
  AlertCircle,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format, isToday, isYesterday, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  useProjectHistory,
  buildCommentPayload,
} from "@/hooks/graphql/use-project-history"
import { ProjectHistoryType } from "@/types/project-history"
import {
  projectHistoryTranslations,
  ProjectHistoryI18n,
  formatHistoryEvent,
} from "@/lib/translations/project-history"

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProjectHistoryPanelProps {
  projectId: string
  /** Optional title shown in WS notifications sent to other users */
  projectTitle?: string
  /** Max height of the scrollable entries area (tailwind h-* value or px/rem) */
  maxHeight?: string
  /** Whether to show the comment input */
  allowComments?: boolean
  /**
   * Whether the current user is a collaborator (owner / co-owner / assignee).
   * When false the input is hidden and a locked label is shown instead.
   * Defaults to true for backward compatibility.
   */
  canComment?: boolean
  className?: string
}

// ─── Day separator ────────────────────────────────────────────────────────────────
function DaySeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({
  entry,
  tH,
  currentUserId,
  onDelete,
  deleting,
}: {
  entry: { id: string; type: string; comment?: string | null; field_name?: string | null; old_value?: string | null; new_value?: string | null; created_at: string; user: { id: string; name: string } }
  tH: ProjectHistoryI18n
  currentUserId?: string
  onDelete: (id: string) => void
  deleting: boolean
}) {
  const isComment = entry.type === ProjectHistoryType.COMMENT
  const isOwn = entry.user.id === currentUserId
  const timeLabel = format(new Date(entry.created_at), "dd/MM HH:mm", { locale: ptBR })

  const isAdjustmentNeeded = entry.type === ProjectHistoryType.ADJUSTMENT_NEEDED

  if (!isComment) {
    // System event — compact neutral row (no bubble)
    return (
      <div className="group relative">
        <div className="flex gap-3">
          <div
            className={cn(
              "flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center",
              isAdjustmentNeeded
                ? "border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/40"
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            )}
          >
            <AlertCircle
              className={cn(
                "w-3.5 h-3.5",
                isAdjustmentNeeded
                  ? "text-orange-500"
                  : "text-gray-500 dark:text-gray-400"
              )}
            />
          </div>
          <div className="flex-1 pb-3">
            <div
              className={cn(
                "rounded-lg p-3 mb-1",
                isAdjustmentNeeded
                  ? "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              )}
            >
              <p
                className={cn(
                  "text-[10px] font-medium mb-1 uppercase tracking-wide",
                  isAdjustmentNeeded
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {tH.panel.systemEvent}
              </p>
              <p
                className={cn(
                  "text-xs leading-relaxed",
                  isAdjustmentNeeded
                    ? "text-orange-800 dark:text-orange-200 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {formatHistoryEvent(entry, tH)}
              </p>
              {/* Justification block for ADJUSTMENT_NEEDED */}
              {isAdjustmentNeeded && entry.comment && (
                <div className="mt-2 pl-2 border-l-2 border-orange-300 dark:border-orange-600">
                  <p className="text-[10px] text-orange-700 dark:text-orange-300 italic leading-relaxed whitespace-pre-wrap">
                    {entry.comment}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
              <User className="w-3 h-3" />
              <span>{entry.user.name}</span>
              <span>•</span>
              <span>{timeLabel}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative">
      <div className={cn("flex gap-3", isOwn && "flex-row-reverse")}>
        {/* Avatar icon */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
          <MessageCircle className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        </div>

        {/* Bubble */}
        <div className={cn("flex-1 pb-3 max-w-[75%]", isOwn && "flex flex-col items-end")}>
          <div
            className={cn(
              "rounded-lg p-3 mb-1",
              isOwn
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            )}
          >
            <p className={cn(
              "text-[10px] font-medium mb-1 uppercase tracking-wide",
              isOwn ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"
            )}>
              {tH.panel.comment}
            </p>
            <p className={cn(
              "text-xs leading-relaxed",
              isOwn ? "text-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300"
            )}>
              {entry.comment}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
            <User className="w-3 h-3" />
            <span>{entry.user.name}</span>
            <span>•</span>
            <span>{timeLabel}</span>
            {isOwn && (
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                disabled={deleting}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 ml-1"
                aria-label={tH.panel.deleteLabel}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProjectHistoryPanel({
  projectId,
  projectTitle,
  maxHeight = "320px",
  allowComments = true,
  canComment = true,
  className,
}: ProjectHistoryPanelProps) {
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const tH =
    (projectHistoryTranslations as Record<string, ProjectHistoryI18n>)[i18n.language] ??
    projectHistoryTranslations.en

  const { entries, loading, logHistory, deleteEntry, creating, deleting } =
    useProjectHistory({ projectId, projectTitle })

  const [newMessage, setNewMessage] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sort ascending: oldest first → newest at bottom
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
    [entries]
  )

  // Build flat list with day separators interspersed
  const itemsWithSeparators = useMemo(() => {
    const result: Array<{ type: 'separator'; label: string; key: string } | { type: 'entry'; entry: typeof sortedEntries[0] }> = []
    let lastDate: Date | null = null

    for (const entry of sortedEntries) {
      const d = new Date(entry.created_at)
      if (!lastDate || !isSameDay(d, lastDate)) {
        let label: string
        if (isToday(d)) label = tH.panel.today
        else if (isYesterday(d)) label = tH.panel.yesterday
        else label = format(d, "dd/MM/yy", { locale: ptBR })
        result.push({ type: 'separator', label, key: `sep-${format(d, 'yyyy-MM-dd')}` })
        lastDate = d
      }
      result.push({ type: 'entry', entry })
    }
    return result
  }, [sortedEntries, tH.panel.today, tH.panel.yesterday])

  // Scroll to bottom: on first load and when entries change
  const scrollToBottom = (behavior: ScrollBehavior = "instant") => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  useEffect(() => {
    if (!loading) scrollToBottom("instant")
  }, [loading])

  useEffect(() => {
    scrollToBottom("smooth")
  }, [entries.length])

  const handleSend = async () => {
    const trimmed = newMessage.trim()
    if (!trimmed || creating) return
    await logHistory(buildCommentPayload(trimmed))
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    await deleteEntry(deletingId)
    setDeletingId(null)
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {tH.panel.title}
          </h3>
          {entries.length > 0 && (
            <Badge
              variant="default"
              className="h-5 min-w-5 flex items-center justify-center text-[10px] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
            >
              {entries.length}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ maxHeight, scrollbarWidth: "none" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <MessageCircle className="w-8 h-8 opacity-30" />
            <p className="text-sm">{tH.panel.noHistory}</p>
          </div>
        ) : (
          <div className="space-y-1 pb-1">
            {itemsWithSeparators.map((item) =>
              item.type === 'separator' ? (
                <DaySeparator key={item.key} label={item.label} />
              ) : (
                <MessageBubble
                  key={item.entry.id}
                  entry={item.entry}
                  tH={tH}
                  currentUserId={user?.id}
                  onDelete={(id) => setDeletingId(id)}
                  deleting={deleting}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* ── Input ───────────────────────────────────────────────────────── */}
      {allowComments && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {canComment ? (
            <div className="flex gap-2 items-center">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tH.panel.commentPlaceholder}
                disabled={creating}
                className="flex-1 h-9 text-xs border-gray-300 dark:border-gray-700"
              />
              <Button
                onClick={handleSend}
                disabled={creating || !newMessage.trim()}
                size="sm"
                className="h-9 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/60 border border-dashed border-border">
              <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground">
                {tH.panel.onlyCollaboratorsCanComment}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Delete confirm ───────────────────────────────────────────────── */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => { if (!open) setDeletingId(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tH.panel.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{tH.panel.deleteConfirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tH.panel.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {tH.panel.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
