"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Receipt, RefreshCcwDot, ChevronDown, ChevronUp, Upload, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"

interface ReceiptStatusBannerProps {
  projectStatus?: string
  className?: string
}

export function ReceiptStatusBanner({ projectStatus, className }: ReceiptStatusBannerProps) {
  const { i18n } = useTranslation()
  const t =
    projectTranslations[i18n.language as keyof typeof projectTranslations] ??
    projectTranslations.en

  const [expanded, setExpanded] = React.useState(false)

  const isPendingReceipt = projectStatus === "PENDING_RECEIPT"
  const isWaitingRefund = projectStatus === "WAITING_REFUND"

  if (!isPendingReceipt && !isWaitingRefund) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tB: Record<string, any> = (t as any)?.receiptStatusBanner ?? {}
  const copy = isPendingReceipt ? tB?.pendingReceipt : tB?.waitingRefund

  const Icon = isPendingReceipt ? Receipt : RefreshCcwDot

  const colors = isPendingReceipt
    ? {
        border: "border-cyan-200 dark:border-cyan-800/60",
        bg: "bg-cyan-50 dark:bg-cyan-950/30",
        icon: "text-cyan-500 dark:text-cyan-400",
        title: "text-cyan-900 dark:text-cyan-100",
        meta: "text-cyan-700/80 dark:text-cyan-300/70",
        body: "border-cyan-200/60 bg-white/50 dark:border-cyan-800/40 dark:bg-black/10 text-cyan-900 dark:text-cyan-100",
        toggle: "text-cyan-600 hover:bg-cyan-100 dark:text-cyan-300 dark:hover:bg-cyan-900/40",
      }
    : {
        border: "border-teal-200 dark:border-teal-800/60",
        bg: "bg-teal-50 dark:bg-teal-950/30",
        icon: "text-teal-500 dark:text-teal-400",
        title: "text-teal-900 dark:text-teal-100",
        meta: "text-teal-700/80 dark:text-teal-300/70",
        body: "border-teal-200/60 bg-white/50 dark:border-teal-800/40 dark:bg-black/10 text-teal-900 dark:text-teal-100",
        toggle: "text-teal-600 hover:bg-teal-100 dark:text-teal-300 dark:hover:bg-teal-900/40",
      }

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden transition-all duration-200",
        colors.border,
        colors.bg,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="mt-0.5 flex-shrink-0">
          <Icon className={cn("h-4 w-4", colors.icon)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn("text-sm font-semibold", colors.title)}>
              {copy?.title}
            </p>

            <button
              onClick={() => setExpanded((v) => !v)}
              className={cn("rounded p-1", colors.toggle)}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded
                ? <ChevronUp className="h-3.5 w-3.5" />
                : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          <p className={cn("mt-0.5 text-[11px]", colors.meta)}>
            {copy?.description}
          </p>
        </div>
      </div>

      {/* Collapsible body */}
      {expanded && (
        <div className={cn("border-t px-4 py-3 space-y-2 text-sm", colors.body)}>
          <p className="flex items-center gap-2">
            <Upload className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
            {tB?.uploadReceiptsForActivities}
          </p>
          <p className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
            {tB?.viewEditActivity}
          </p>
          {copy?.actionNote && (
            <p className="text-xs opacity-60 pt-1">{copy.actionNote}</p>
          )}
        </div>
      )}
    </div>
  )
}
