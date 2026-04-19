"use client"

import { MessageCircle, GitBranch, Info } from "lucide-react"
import { type AppNotification } from "@/contexts/notifications-context"

interface NotifIconProps {
  type: AppNotification["type"]
  className?: string
}

export function NotifIcon({ type, className }: NotifIconProps) {
  if (type === "project_message")
    return <MessageCircle className={className ?? "w-4 h-4 text-blue-500 shrink-0"} />
  if (type === "status_change")
    return <GitBranch className={className ?? "w-4 h-4 text-orange-500 shrink-0"} />
  return <Info className={className ?? "w-4 h-4 text-muted-foreground shrink-0"} />
}
