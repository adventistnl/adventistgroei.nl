"use client"

/**
 * AdjustmentNotificationBanner
 * ─────────────────────────────
 * Shows the most recent ADJUSTMENT_NEEDED history entry when the project is
 * in ADJUSTMENTS_NEEDED status. The "Mark as Resolved" button moves the
 * project to IN_REVIEW and logs an ADJUSTMENT_RESOLVED history entry.
 *
 * Only the project owner / co-owner sees the action buttons.
 */

import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import type { Locale } from "date-fns"
import { ptBR, enUS, nl as nlLocale } from "date-fns/locale"
import { useMutation } from "@apollo/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  useProjectHistory,
  buildAdjustmentResolvedPayload,
  buildStatusChangedPayload,
} from "@/hooks/graphql/use-project-history"
import { ProjectHistoryType } from "@/types/project-history"
import { UPDATE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { projectTranslations } from "@/lib/translations/projects"

interface AdjustmentNotificationBannerProps {
  projectId: string
  /** Current project status — banner only renders when ADJUSTMENTS_NEEDED */
  projectStatus?: string
  /** Whether the current user is the project owner / co-owner */
  isOwnerOrCoOwner: boolean
  /** Called after a successful resolve so the parent can refetch */
  onResolved?: () => void
  className?: string
}

// ─── date-fns locale map ──────────────────────────────────────────────────────
const LOCALE_MAP: Record<string, Locale> = { pt: ptBR, en: enUS, nl: nlLocale }

// ─── Main export ──────────────────────────────────────────────────────────────
export function AdjustmentNotificationBanner({
  projectId,
  projectStatus,
  isOwnerOrCoOwner,
  onResolved,
  className,
}: AdjustmentNotificationBannerProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const t =
    projectTranslations[lang as keyof typeof projectTranslations] ??
    projectTranslations.en
  const locale = LOCALE_MAP[lang] ?? enUS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tA: Record<string, any> = (t as any)?.adjustments ?? {}

  const [expanded, setExpanded] = React.useState(true)
  const [resolving, setResolving] = React.useState(false)

  // History (read) + logHistory (write)
  const { entries, loading, logHistory } = useProjectHistory({ projectId })

  // Update project status mutation
  const [updateProjectStatus] = useMutation(UPDATE_PROJECT_MUTATION, {
    refetchQueries: [{ query: GET_PROJECT_BY_ID_QUERY, variables: { id: projectId } }],
    onCompleted: () => {
      console.log("[AdjustmentBanner] project status updated → IN_REVIEW")
      onResolved?.()
    },
  })

  // Find the most recent ADJUSTMENT_NEEDED entry
  const latestAdjustment = React.useMemo(() => {
    return [...entries]
      .filter((e) => e.type === ProjectHistoryType.ADJUSTMENT_NEEDED)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0] ?? null
  }, [entries])

  // Only render when project is in ADJUSTMENTS_NEEDED status
  const isActive =
    projectStatus === "ADJUSTMENTS_NEEDED" && latestAdjustment !== null

  const formattedDate = React.useMemo(() => {
    if (!latestAdjustment) return ""
    try {
      return format(new Date(latestAdjustment.created_at), "PPp", { locale })
    } catch {
      return latestAdjustment.created_at
    }
  }, [latestAdjustment, locale])

  if (loading || !isActive || !latestAdjustment) return null

  const handleResolve = async () => {
    setResolving(true)
    console.log(
      "[AdjustmentBanner] resolving →",
      latestAdjustment.id,
      "→ IN_REVIEW"
    )
    try {
      // 1) Move project to IN_REVIEW
      await updateProjectStatus({ variables: { id: projectId, status: "IN_REVIEW" } })
      // 2) Log ADJUSTMENT_RESOLVED history entry
      await logHistory(buildAdjustmentResolvedPayload(latestAdjustment.id))
      // 3) REMOVED: logHistory(buildStatusChangedPayload("ADJUSTMENTS_NEEDED", "IN_REVIEW"))
    } finally {
      setResolving(false)
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800/60 dark:bg-orange-950/30 overflow-hidden transition-all duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="mt-0.5 flex-shrink-0">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">
              {tA.bannerTitle ?? "Adjustment Required"}
            </p>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Action button — only for owner / co-owner */}
              {isOwnerOrCoOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={resolving}
                  onClick={handleResolve}
                  className="h-7 gap-1.5 border-orange-300 bg-white/80 text-orange-800 text-xs hover:bg-orange-100 dark:border-orange-700 dark:bg-transparent dark:text-orange-200 dark:hover:bg-orange-900/40"
                >
                  {resolving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {tA.markResolved ?? "Mark as Resolved"}
                </Button>
              )}

              <button
                onClick={() => setExpanded((v) => !v)}
                className="rounded p-1 text-orange-600 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/40"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Meta: requester + date */}
          <p className="mt-0.5 text-[11px] text-orange-700/80 dark:text-orange-300/70">
            {tA.requestedBy ?? "Requested by"}{" "}
            <strong className="font-medium">
              {latestAdjustment.user?.name ?? "—"}
            </strong>
            {" · "}
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Justification (collapsible) */}
      {expanded && latestAdjustment.comment && (
        <div className="border-t border-orange-200/60 bg-white/50 px-4 py-3 dark:border-orange-800/40 dark:bg-black/10">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-orange-900 dark:text-orange-100">
            {latestAdjustment.comment}
          </p>
        </div>
      )}
    </div>
  )
}
