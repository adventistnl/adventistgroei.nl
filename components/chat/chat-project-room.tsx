"use client"

import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  AlertCircle,
  Trash2,
  Send,
  Bot,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useProjectHistory, buildCommentPayload } from "@/hooks/graphql/use-project-history"
import { ProjectHistoryType } from "@/types/project-history"
import {
  projectHistoryTranslations,
  type ProjectHistoryI18n,
  formatHistoryEvent,
} from "@/lib/translations/project-history"
import {
  chatTranslations,
  type ChatI18n,
} from "@/lib/translations/chat"
import { MentionInput, type MentionOption } from "./mention-input"
import {
  PROJECT_STATUS_CONFIG,
  PROJECT_STATUS_ORDER,
} from "@/components/projects/project-header"
import { UsersAvatarGroup, type UserAvatarData } from "@/components/shared/users-avatar-group"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChatProject {
  id: string
  title: string
  status: string
  owner?: { id: string; name: string } | null
  co_owner?: { id: string; name: string } | null
  collaborators: Array<{
    role: string
    user: { id: string; name: string; email?: string }
  }>
}

interface ChatProjectRoomProps {
  project: ChatProject
  canComment: boolean
  onBack: () => void
}

// ─── Day separator ───────────────────────────────────────────────────────────

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}

// ─── Mention renderer ────────────────────────────────────────────────────────

// ─── Status changed row with colored dots ────────────────────────────────────

function StatusChangedRow({
  entry,
  tH,
}: {
  entry: HistoryEntry
  tH: ProjectHistoryI18n
}) {
  const oldCfg = entry.old_value ? PROJECT_STATUS_CONFIG[entry.old_value] : null
  const newCfg = entry.new_value ? PROJECT_STATUS_CONFIG[entry.new_value] : null
  const oldLabel = entry.old_value ? (tH.values[entry.old_value] ?? entry.old_value) : ""
  const newLabel = entry.new_value ? (tH.values[entry.new_value] ?? entry.new_value) : ""

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className="font-medium">{tH.types.STATUS_CHANGED}</span>
      {entry.old_value && (
        <>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-background border border-border/60">
            {oldCfg && (
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", oldCfg.dotColor)} />
            )}
            <span className="text-[10px] font-medium">{oldLabel}</span>
          </span>
          <span className="text-muted-foreground">→</span>
        </>
      )}
      {entry.new_value && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-background border border-border/60">
          {newCfg && (
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", newCfg.dotColor)} />
          )}
          <span className="text-[10px] font-medium">{newLabel}</span>
        </span>
      )}
    </div>
  )
}

// ─── Mention renderer ────────────────────────────────────────────────────────

function RenderMessage({ text }: { text: string }) {
  const parts = text.split(/(@\S+)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("@status:")) {
          const key = part.slice(8)
          const cfg = PROJECT_STATUS_CONFIG[key]
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-muted text-[10px] font-medium align-middle"
            >
              {cfg && <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dotColor)} />}
              {key}
            </span>
          )
        }
        if (part.startsWith("@")) {
          return (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

// ─── Message bubble ──────────────────────────────────────────────────────────

type HistoryEntry = {
  id: string
  type: string
  comment?: string | null
  field_name?: string | null
  old_value?: string | null
  new_value?: string | null
  created_at: string
  user: { id: string; name: string }
  adjustment?: {
    id: string
    status: string
    tasks?: { id: string; title: string; completed: boolean; position: number }[]
  } | null
}

function ChatBubble({
  entry,
  tH,
  tC,
  currentUserId,
  onDelete,
  deleting,
}: {
  entry: HistoryEntry
  tH: ProjectHistoryI18n
  tC: ChatI18n
  currentUserId?: string
  onDelete: (id: string) => void
  deleting: boolean
}) {
  const isComment = entry.type === ProjectHistoryType.COMMENT
  const isOwn = entry.user.id === currentUserId
  const timeLabel = format(new Date(entry.created_at), "HH:mm", { locale: ptBR })

  const isAdjustmentNeeded = entry.type === ProjectHistoryType.ADJUSTMENT_NEEDED
  const isAdjustmentResolved = entry.type === ("ADJUSTMENT_RESOLVED" as string)
  const isStatusChange = entry.type === ProjectHistoryType.STATUS_CHANGED

  // System event — styled bot bubble
  if (!isComment) {
    return (
      <div className="flex gap-2 px-1 py-1.5">
        {/* Bot avatar */}
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center self-start mt-0.5",
            isAdjustmentNeeded
              ? "bg-orange-100 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700"
              : isAdjustmentResolved
              ? "bg-green-100 dark:bg-green-950/40 border-green-300 dark:border-green-700"
              : "bg-muted border-border"
          )}
        >
          {isAdjustmentNeeded ? (
            <AlertTriangle className="w-3 h-3 text-orange-500" />
          ) : isAdjustmentResolved ? (
            <CheckCircle2 className="w-3 h-3 text-green-500" />
          ) : (
            <Bot className="w-3 h-3 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* System label + time */}
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={cn(
                "text-[9px] font-semibold uppercase tracking-wide",
                isAdjustmentNeeded
                  ? "text-orange-600 dark:text-orange-400"
                  : isAdjustmentResolved
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              )}
            >
              {tH.panel.systemEvent}
            </span>
            <span className="text-[9px] text-muted-foreground">{timeLabel}</span>
          </div>

          {/* Bubble */}
          <div
            className={cn(
              "rounded-xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed",
              isAdjustmentNeeded
                ? "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800"
                : isAdjustmentResolved
                ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                : "bg-muted/60 border border-border/40"
            )}
          >
            {/* Main event text */}
            {isStatusChange ? (
              <StatusChangedRow entry={entry} tH={tH} />
            ) : (
              <span
                className={cn(
                  "text-[11px]",
                  isAdjustmentNeeded
                    ? "text-orange-800 dark:text-orange-200 font-medium"
                    : isAdjustmentResolved
                    ? "text-green-800 dark:text-green-200 font-medium"
                    : "text-muted-foreground"
                )}
              >
                {formatHistoryEvent(entry, tH)}
              </span>
            )}

            {/* Justification block for ADJUSTMENT_NEEDED */}
            {isAdjustmentNeeded && entry.comment && (
              <div className="mt-2 pl-2 border-l-2 border-orange-300 dark:border-orange-600">
                <p className="text-[10px] text-orange-700 dark:text-orange-300 italic leading-relaxed">
                  {entry.comment}
                </p>
              </div>
            )}

            {/* Adjustment status badge + task checklist */}
            {isAdjustmentNeeded && entry.adjustment && (
              <div className="mt-2 space-y-1.5">
                {/* Status badge */}
                <span
                  className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                    entry.adjustment.status === "OPEN"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
                      : entry.adjustment.status === "IN_PROGRESS"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                  )}
                >
                  {entry.adjustment.status === "OPEN"
                    ? "Open"
                    : entry.adjustment.status === "IN_PROGRESS"
                    ? "In Progress"
                    : "Resolved"}
                </span>

                {/* Task checklist (read-only) */}
                {(entry.adjustment.tasks ?? []).length > 0 && (
                  <ul className="space-y-1 mt-1">
                    {(entry.adjustment.tasks ?? [])
                      .slice()
                      .sort((a, b) => a.position - b.position)
                      .map((task) => (
                        <li key={task.id} className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "inline-block w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center",
                              task.completed
                                ? "bg-orange-400 border-orange-400"
                                : "border-orange-300 dark:border-orange-600"
                            )}
                          >
                            {task.completed && (
                              <svg viewBox="0 0 10 10" className="w-2 h-2 text-white fill-current">
                                <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                              </svg>
                            )}
                          </span>
                          <span
                            className={cn(
                              "text-[10px]",
                              task.completed
                                ? "line-through text-orange-400 dark:text-orange-500"
                                : "text-orange-700 dark:text-orange-300"
                            )}
                          >
                            {task.title}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}

            {/* Optional note for ADJUSTMENT_RESOLVED */}
            {isAdjustmentResolved && entry.comment && (
              <div className="mt-2 pl-2 border-l-2 border-green-300 dark:border-green-600">
                <p className="text-[10px] text-green-700 dark:text-green-300 italic leading-relaxed">
                  {entry.comment}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("group flex gap-2 px-1", isOwn && "flex-row-reverse")}>
      {/* Avatar */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-[9px] font-bold uppercase self-end mb-4 text-foreground">
        {entry.user.name[0]}
      </div>

      <div className={cn("flex flex-col max-w-[80%]", isOwn && "items-end")}>
        {/* Sender label */}
        <p className={cn("text-[9px] text-muted-foreground mb-0.5", isOwn && "text-right")}>
          {isOwn ? tC.room.you : entry.user.name}
        </p>

        {/* Bubble */}
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-xs leading-relaxed break-words",
            isOwn
              ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
          )}
        >
          <RenderMessage text={entry.comment ?? ""} />
        </div>

        {/* Time + delete */}
        <div className={cn("flex items-center gap-1 mt-0.5", isOwn && "flex-row-reverse")}>
          <span className="text-[9px] text-muted-foreground">{timeLabel}</span>
          {isOwn && (
            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              disabled={deleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-1"
              aria-label={tH.panel.deleteLabel}
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function ChatProjectRoom({ project, canComment, onBack }: ChatProjectRoomProps) {
  const { i18n } = useTranslation()
  const { user } = useAuth()

  const tH =
    (projectHistoryTranslations as Record<string, ProjectHistoryI18n>)[i18n.language] ??
    projectHistoryTranslations.en

  const tC = chatTranslations[i18n.language?.split("-")[0]] ?? chatTranslations.en

  const { entries, loading, logHistory, deleteEntry, creating, deleting } =
    useProjectHistory({ projectId: project.id, projectTitle: project.title })

  const [newMessage, setNewMessage] = React.useState("")
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // ── Build mention options ─────────────────────────────────────────────────
  const mentionOptions = useMemo<MentionOption[]>(() => {
    const users: MentionOption[] = []
    const seen = new Set<string>()

    const push = (u: { id: string; name: string } | null | undefined) => {
      if (!u || seen.has(u.id) || u.id === user?.id) return
      seen.add(u.id)
      users.push({ kind: "user", id: u.id, name: u.name })
    }

    push(project.owner)
    push(project.co_owner)
    project.collaborators.forEach((c) => push(c.user))

    const statuses: MentionOption[] = PROJECT_STATUS_ORDER.map((key) => {
      const cfg = PROJECT_STATUS_CONFIG[key]
      return {
        kind: "status" as const,
        key,
        label: key,
        dotColor: cfg?.dotColor ?? "bg-gray-400",
      }
    })

    return [...users, ...statuses]
  }, [project, user?.id])

  // ── Sort entries oldest → newest ─────────────────────────────────────────
  const sorted = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    [entries]
  )

  // ── Build items with day separators ──────────────────────────────────────
  const items = useMemo(() => {
    type SepItem = { type: "sep"; label: string; key: string }
    type EntryItem = { type: "entry"; entry: (typeof sorted)[0] }
    const result: Array<SepItem | EntryItem> = []
    let lastDate: Date | null = null

    for (const entry of sorted) {
      const d = new Date(entry.created_at)
      if (!lastDate || !isSameDay(d, lastDate)) {
        const label = isToday(d)
          ? tH.panel.today
          : isYesterday(d)
          ? tH.panel.yesterday
          : format(d, "dd/MM/yy", { locale: ptBR })
        result.push({ type: "sep", label, key: `sep-${format(d, "yyyy-MM-dd")}` })
        lastDate = d
      }
      result.push({ type: "entry", entry })
    }
    return result
  }, [sorted, tH.panel.today, tH.panel.yesterday])

  // ── Auto scroll to bottom ─────────────────────────────────────────────────
  React.useEffect(() => {
    if (!loading && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [loading])

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries.length])

  // ── Handlers ─────────────────────────────────────────────────────────────
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

  // ── Build participant list for UsersAvatarGroup ─────────────────────────
  const participants = useMemo<UserAvatarData[]>(() => {
    const list: UserAvatarData[] = []
    const seen = new Set<string>()

    const push = (
      u: { id: string; name: string; email?: string } | null | undefined,
      role: string
    ) => {
      if (!u || seen.has(u.id)) return
      seen.add(u.id)
      list.push({ id: u.id, name: u.name, email: u.email, role })
    }

    push(project.owner, tC.list.roles.owner)
    push(project.co_owner, tC.list.roles.coOwner)
    project.collaborators.forEach((c) => push(c.user, tC.list.roles.collaborator))

    return list
  }, [project, tC.list.roles])

  return (
    <div className="flex flex-col h-full">
      {/* ── Room header ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0 bg-muted/30">
        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate leading-tight">{project.title}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <UsersAvatarGroup
              users={participants}
              maxDisplay={5}
              size="sm"
              showAddButton={false}
              ownerUserId={project.owner?.id}
              coOwnerUserId={project.co_owner?.id}
            />
            <span className="text-[10px] text-muted-foreground">
              {tC.room.participants(participants.length)}
            </span>
          </div>
        </div>
        {entries.length > 0 && (
          <Badge variant="secondary" className="text-[10px] tabular-nums flex-shrink-0">
            {entries.length}
          </Badge>
        )}
      </div>

      {/* ── Messages ──────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
            <MessageCircle className="w-7 h-7 opacity-30" />
            <p className="text-xs">{tC.room.noMessages}</p>
          </div>
        ) : (
          <div className="space-y-0.5 pb-1">
            {items.map((item) =>
              item.type === "sep" ? (
                <DaySeparator key={item.key} label={item.label} />
              ) : (
                <ChatBubble
                  key={item.entry.id}
                  entry={item.entry}
                  tH={tH}
                  tC={tC}
                  currentUserId={user?.id}
                  onDelete={(id) => setDeletingId(id)}
                  deleting={deleting}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* ── Input ─────────────────────────────────────────────────────── */}
      <div className="px-3 pb-3 pt-2 border-t shrink-0">
        {canComment ? (
          <div className="flex gap-2 items-center">
            <MentionInput
              value={newMessage}
              onChange={setNewMessage}
              onKeyDown={handleKeyDown}
              placeholder={`${tH.panel.commentPlaceholder} — ${tC.room.mentionHint} @ ${tC.room.mentionHintAt}`}
              disabled={creating}
              mentionOptions={mentionOptions}
            />
            <Button
              onClick={handleSend}
              disabled={creating || !newMessage.trim()}
              size="sm"
              aria-label={tC.room.sendAriaLabel}
              className="h-9 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 disabled:opacity-50 flex-shrink-0"
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
            <span className="text-[11px] text-muted-foreground">
              {tH.panel.onlyCollaboratorsCanComment}
            </span>
          </div>
        )}
        {canComment && (
          <p className="text-[9px] text-muted-foreground mt-1 px-0.5">
            {tC.room.mentionHint}{" "}
            <span className="font-mono bg-muted px-0.5 rounded">{tC.room.mentionHintAt}</span>{" "}
            ·{" "}
            <span className="font-mono bg-muted px-0.5 rounded">{tC.room.mentionHintStatus}</span>
          </p>
        )}
      </div>

      {/* ── Delete confirm ────────────────────────────────────────────── */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tH.panel.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{tH.panel.deleteConfirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tH.panel.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deletingId) {
                  await deleteEntry(deletingId)
                  setDeletingId(null)
                }
              }}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {tH.panel.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
