"use client"

import { MessageCircle, Activity, BadgeDollarSign, FileText, UserPlus, UserMinus, AlertTriangle, Info } from "lucide-react"
import { type AppNotification } from "@/contexts/notifications-context"

interface NotifIconProps {
  type: AppNotification["type"]
  className?: string
}

export function NotifIcon({ type, className }: NotifIconProps) {
  switch (type) {
    case "PROJECT_MESSAGE":
      return <MessageCircle className={className ?? "w-4 h-4 text-purple-500 shrink-0"} />
    case "PROJECT_STATUS_CHANGED":
      return <Activity className={className ?? "w-4 h-4 text-blue-500 shrink-0"} />
    case "SUBSIDY_STATUS_CHANGED":
      return <BadgeDollarSign className={className ?? "w-4 h-4 text-green-500 shrink-0"} />
    case "SUBSIDY_DOCUMENT_UPDATED":
    case "DOCUMENT_ADDED":
      return <FileText className={className ?? "w-4 h-4 text-slate-500 shrink-0"} />
    case "SUBSIDY_DOCUMENT_VALIDATED":
      return <FileText className={className ?? "w-4 h-4 text-green-500 shrink-0"} />
    case "SUBSIDY_DOCUMENT_REJECTED":
      return <FileText className={className ?? "w-4 h-4 text-red-500 shrink-0"} />
    case "ANNUAL_BUDGET_CREATED":
      return <BadgeDollarSign className={className ?? "w-4 h-4 text-emerald-500 shrink-0"} />
    case "ANNUAL_BUDGET_CLOSED":
      return <BadgeDollarSign className={className ?? "w-4 h-4 text-slate-500 shrink-0"} />
    case "PROJECT_MEMBER_ADDED":
      return <UserPlus className={className ?? "w-4 h-4 text-indigo-500 shrink-0"} />
    case "PROJECT_MEMBER_REMOVED":
      return <UserMinus className={className ?? "w-4 h-4 text-red-500 shrink-0"} />
    case "SYSTEM_ALERT":
      return <AlertTriangle className={className ?? "w-4 h-4 text-amber-500 shrink-0"} />
    default:
      return <Info className={className ?? "w-4 h-4 text-muted-foreground shrink-0"} />
  }
}
