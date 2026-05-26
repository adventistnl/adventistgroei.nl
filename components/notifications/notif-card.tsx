"use client"

import { Check, Trash2, History } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR, enUS, nl, type Locale } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { type AppNotification } from "@/contexts/notifications-context"
import { NotifIcon } from "@/components/notifications/notif-icon"

const dateFnsLocale: Record<string, Locale> = {
  pt: ptBR,
  en: enUS,
  nl: nl,
}

export interface NotifCardProps {
  notification: AppNotification
  lang: string
  /** i18n label for the "Open history" button */
  labelViewHistory: string
  onMarkRead: (id: string) => void
  onRemove: (id: string) => void
  /** Called when user clicks the history button — opens project quick view on history tab */
  onOpenHistory: (projectId: string, projectTitle: string | undefined) => void
}

export function NotifCard({
  notification,
  lang,
  labelViewHistory,
  onMarkRead,
  onRemove,
  onOpenHistory,
}: NotifCardProps) {
  const locale = dateFnsLocale[lang] ?? enUS
  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), {
    addSuffix: true,
    locale,
  })

  const isProjectNotification =
    !!notification.projectId &&
    (notification.type === "project_message" || notification.type === "status_change")

  return (
    <div
      className={`group relative flex gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
        !notification.read
          ? "border-l-4 border-l-primary bg-muted/15"
          : "border-l-4 border-l-transparent opacity-70"
      }`}
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        <NotifIcon type={notification.type} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-10">
        <p className="text-xs font-semibold text-foreground leading-snug truncate">
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {notification.message}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] text-muted-foreground/70">{timeAgo}</span>
          {!notification.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          )}
        </div>

        {/* History button — only for project notifications */}
        {/* {isProjectNotification && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 h-6 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => onOpenHistory(notification.projectId!, notification.projectTitle)}
          >
            <History className="w-3 h-3" />
            {labelViewHistory}
          </Button>
        )} */}
      </div>

      {/* Hover actions — top-right corner */}
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-0.5">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => onMarkRead(notification.id)}
          >
            <Check className="w-3 h-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(notification.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
