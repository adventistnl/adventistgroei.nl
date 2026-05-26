"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, AlertCircle, CheckCircle2, Lock, Loader2, Layers, DollarSign, WifiOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useCurrency } from "@/contexts/currency-context"
import { ProjectActivityData } from "@/components/projects/project-activities-table"
import { ActivityCard } from "@/components/shared/activity-card"
import type { SubsidyRequestCardData } from "@/components/projects/subsidy-request-card"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"
import { useActivityAllocation } from "@/hooks/graphql/use-activity-allocation"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActivitySubsidyRef {
  subsidyId: string
  subsidyTitle: string
  requestedAmount: number
  status: SubsidyRequestCardData["status"]
}

interface SelectActivitiesModalProps {
  isOpen: boolean
  onClose: () => void
  activities: ProjectActivityData[]
  onConfirm: (selectedActivities: ProjectActivityData[]) => void
  title?: string
  description?: string
  filterSubsidized?: boolean
  subsidizedActivityIds?: string[]
  /** All subsidy requests for the project — enriches activities with "already linked" info */
  subsidyRequests?: SubsidyRequestCardData[]
  /** ID of the subsidy currently being edited — its linked activities stay selectable */
  currentSubsidyId?: string
  /** Project ID — enables API fetch for budget allocation data when subsidyRequests is not provided */
  projectId?: string
}

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  pending:           "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  in_review:         "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  approved:          "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800",
  rejected:          "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  closed:            "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  advanced_closed:   "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  waiting_refund:    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  waiting_documents: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800",
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SelectActivitiesModal({
  isOpen,
  onClose,
  activities,
  onConfirm,
  title,
  description,
  filterSubsidized = true,
  subsidizedActivityIds = [],
  subsidyRequests,
  currentSubsidyId,
  projectId,
}: SelectActivitiesModalProps) {
  const { formatCurrency, selectedCurrency } = useCurrency()
  const { i18n } = useTranslation()
  const t = subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.modals
    ?? subsidyRequestTranslations.pt.modals

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // ─── Filter activities by filterSubsidized ──────────────────────────────────
  const filteredActivities = React.useMemo(
    () => filterSubsidized ? activities.filter(a => a.is_subsidized) : activities,
    [activities, filterSubsidized]
  )

  // ─── Activity budget map (activityId → budget_amount) for allocation hook ───
  const activityBudgets = React.useMemo(() => {
    const map: Record<string, number> = {}
    for (const a of filteredActivities) map[a.id] = a.budget_amount ?? 0
    return map
  }, [filteredActivities])

  // ─── Budget allocation: from API when projectId provided, or from prop ───────
  const { summaries: allocationSummaries, loading: allocationLoading, error: allocationError } = useActivityAllocation({
    projectId,
    existingRequests: subsidyRequests as Parameters<typeof useActivityAllocation>[0]["existingRequests"],
    currentSubsidyId,
    activityBudgets,
  })

  // ─── Build map: activityId → subsidy refs (excluding current subsidy) ───────
  const activitySubsidyMap = React.useMemo(() => {
    const map = new Map<string, ActivitySubsidyRef[]>()
    if (!subsidyRequests?.length) return map
    for (const subsidy of subsidyRequests) {
      if (subsidy.id === currentSubsidyId) continue
      for (const item of (subsidy.items ?? [])) {
        if (!item.activity_id) continue
        const existing = map.get(item.activity_id) ?? []
        map.set(item.activity_id, [
          ...existing,
          {
            subsidyId:       subsidy.id,
            subsidyTitle:    subsidy.title,
            requestedAmount: item.requested_amount,
            status:          subsidy.status,
          },
        ])
      }
    }
    return map
  }, [subsidyRequests, currentSubsidyId])

  // ─── Split activities into selectable vs already-requested ─────────────────
  const { selectableActivities, requestedActivities } = React.useMemo(() => {
    const selectable: ProjectActivityData[] = []
    const requested: ProjectActivityData[] = []
    for (const activity of filteredActivities) {
      if (activitySubsidyMap.has(activity.id)) {
        requested.push(activity)
      } else {
        selectable.push(activity)
      }
    }
    return { selectableActivities: selectable, requestedActivities: requested }
  }, [filteredActivities, activitySubsidyMap])

  // ─── Selectable = not in subsidizedActivityIds either ──────────────────────
  const freeActivities   = selectableActivities.filter(a => !subsidizedActivityIds.includes(a.id))
  const disabledActivities = selectableActivities.filter(a => subsidizedActivityIds.includes(a.id))

  const selectableCount = freeActivities.length

  // ─── Reset on close ────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isOpen) setSelectedIds(new Set())
  }, [isOpen])

  // ─── Toggle ────────────────────────────────────────────────────────────────
  const toggleActivity = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === selectableCount && selectableCount > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(freeActivities.map(a => a.id)))
    }
  }

  // ─── Confirm / Close ───────────────────────────────────────────────────────
  const handleConfirm = () => {
    onConfirm(freeActivities.filter(a => selectedIds.has(a.id)))
    setSelectedIds(new Set())
  }

  const handleClose = () => {
    setSelectedIds(new Set())
    onClose()
  }

  // ─── Total of selected ─────────────────────────────────────────────────────
  const selectedTotal = React.useMemo(
    () => freeActivities
      .filter(a => selectedIds.has(a.id))
      .reduce((sum, a) => sum + (a.institution_requested_amount || 0), 0),
    [freeActivities, selectedIds]
  )

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const allEmpty = filteredActivities.length === 0

  const modalTitle = title ?? t.addActivitiesTitle
  const modalDescription = description ?? t.addActivitiesDescription

  // ─── Typed helper to access new i18n keys safely ─────────────────────────
  const tExtra = t as unknown as Record<string, string>

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            {modalTitle}
          </DialogTitle>
          <DialogDescription className="text-sm">{modalDescription}</DialogDescription>
        </DialogHeader>

        {/* ── Allocation loading / error indicator ─────────────────────────── */}
        {allocationLoading && (
          <div className="flex items-center gap-2 px-1 py-1 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
            <Loader2 className="w-3 h-3 animate-spin" />
            {tExtra.loadingAllocation ?? "Carregando alocações..."}
          </div>
        )}
        {allocationError && !allocationLoading && (
          <div className="flex items-center gap-2 px-1 py-1 text-xs text-amber-600 dark:text-amber-400 flex-shrink-0">
            <WifiOff className="w-3 h-3" />
            {tExtra.allocationError ?? "Não foi possível carregar os dados de alocação"}
          </div>
        )}

        {/* ── Scrollable body ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-4">

          {allEmpty ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {t.noActivities}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {filterSubsidized ? t.noActivitiesSubsidized : t.noActivitiesGeneral}
              </p>
            </div>
          ) : (
            <>
              {/* ── Section 1: Available ────────────────────────────────────── */}
              {selectableActivities.length > 0 && (
                <div className="space-y-2">
                  {/* Section header */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {tExtra.availableSection ?? t.available}
                      <span className="ml-1.5 font-normal normal-case text-gray-400 dark:text-gray-500">
                        ({selectableCount})
                      </span>
                    </p>
                  </div>

                  {/* Select All row */}
                  {freeActivities.length > 0 && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedIds.size === selectableCount && selectableCount > 0}
                          onCheckedChange={toggleAll}
                          disabled={selectableCount === 0}
                          className="border-gray-400 dark:border-gray-500 data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-100 data-[state=checked]:border-gray-900 dark:data-[state=checked]:border-gray-100"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.selectAllAvailable}
                          <span className="ml-1.5 text-xs font-normal text-gray-500 dark:text-gray-400">
                            ({selectedIds.size}/{selectableCount})
                          </span>
                        </span>
                      </div>
                      {/* {selectedIds.size > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {formatCurrency(selectedTotal)}
                        </Badge>
                      )} */}
                    </div>
                  )}

                  {/* Free activities (selectable) with allocation chips */}
                  <div className="space-y-1.5">
                    {freeActivities.map(activity => {
                      const summary = allocationSummaries.get(activity.id)
                      const isFull = !!summary && summary.available <= 0
                      const countLabel = summary && summary.subsidyCount > 0
                        ? summary.subsidyCount === 1
                          ? tExtra.subsidyCount_one ?? "1 subsídio"
                          : (tExtra.subsidyCount_other ?? "{{count}} subsídios").replace("{{count}}", String(summary.subsidyCount))
                        : null
                      return (
                        <div key={activity.id}>
                          <ActivityCard
                            activity={activity}
                            isSelected={selectedIds.has(activity.id)}
                            onToggle={isFull ? undefined : toggleActivity}
                            showCheckbox
                            compact
                            isDisabled={isFull}
                            disabledReason={isFull ? (tExtra.fullyAllocated ?? "Totalmente alocado") : undefined}
                          />
                          {/* Allocation info chips */}
                          {summary && summary.subsidyCount > 0 && (
                            <div className="ml-[3.25rem] flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                                <Layers className="w-2.5 h-2.5" />
                                {countLabel}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                                <DollarSign className="w-2.5 h-2.5" />
                                {(tExtra.allocationSummary ?? "{{allocated}} de {{budget}}")
                                  .replace("{{allocated}}", formatCurrency(summary.allocated))
                                  .replace("{{budget}}", formatCurrency(summary.budget))}
                              </span>
                              <span className={cn(
                                "text-[10px] font-medium",
                                isFull ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"
                              )}>
                                {isFull
                                  ? (tExtra.fullyAllocated ?? "Totalmente alocado")
                                  : `${tExtra.budgetAvailable ?? "Disponível"}: ${formatCurrency(summary.available)}`}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Disabled activities (in subsidizedActivityIds but no subsidyRequests data) */}
                  {disabledActivities.length > 0 && (
                    <div className="space-y-1.5">
                      {disabledActivities.map(activity => (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          isSelected={false}
                          showCheckbox
                          compact
                          isDisabled
                          disabledReason={t.alreadyRequested}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Section 2: Already in a request ─────────────────────────── */}
              {requestedActivities.length > 0 && (
                <div className="space-y-2">
                  {/* Divider if both sections visible */}
                  {selectableActivities.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800" />
                  )}

                  {/* Section header */}
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {t.alreadyRequested}
                      <span className="ml-1.5 font-normal normal-case">
                        ({requestedActivities.length})
                      </span>
                    </p>
                  </div>

                  {/* Already-requested activity cards */}
                  <div className="space-y-1.5">
                    {requestedActivities.map(activity => {
                      const subsidyRefs = activitySubsidyMap.get(activity.id) ?? []
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-md bg-gray-50/60 dark:bg-gray-900/40 opacity-75"
                        >
                          {/* Subsidized indicator */}
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center",
                              activity.is_subsidized
                                ? "bg-green-100 border-2 border-green-300 dark:bg-green-950 dark:border-green-800"
                                : "bg-gray-100 border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                            )}>
                              <span className={cn(
                                "text-xs font-bold",
                                activity.is_subsidized
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-400 dark:text-gray-500"
                              )}>
                                {selectedCurrency.symbol}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Activity name + budget */}
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                {activity.name}
                              </p>
                              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex-shrink-0">
                                {formatCurrency(activity.budget_amount)}
                              </p>
                            </div>

                            {/* Subsidy refs */}
                            <div className="mt-1.5 space-y-1">
                              {subsidyRefs.map((ref, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                                  {/* Subsidy title */}
                                  <span className="text-xs text-gray-500 dark:text-gray-500 truncate max-w-[160px]" title={ref.subsidyTitle}>
                                    {ref.subsidyTitle}
                                  </span>
                                  {/* Status badge */}
                                  <span className={cn(
                                    "inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border",
                                    STATUS_STYLES[ref.status] ?? STATUS_STYLES.pending
                                  )}>
                                    {(t.statusLabels as Record<string, string>)[ref.status] ?? ref.status}
                                  </span>
                                  {/* Requested amount */}
                                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0">
                                    {t.requestedLabel}: <span className="font-medium text-gray-600 dark:text-gray-400">{formatCurrency(ref.requestedAmount)}</span>
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Allocation summary from hook */}
                            {(() => {
                              const summary = allocationSummaries.get(activity.id)
                              if (!summary || summary.subsidyCount === 0) return null
                              return (
                                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                                    <DollarSign className="w-2.5 h-2.5" />
                                    {(tExtra.allocationSummary ?? "{{allocated}} de {{budget}}")
                                      .replace("{{allocated}}", formatCurrency(summary.allocated))
                                      .replace("{{budget}}", formatCurrency(summary.budget))}
                                  </span>
                                  <span className="text-[10px] font-medium text-red-500 dark:text-red-400">
                                    {tExtra.fullyAllocated ?? "Totalmente alocado"}
                                  </span>
                                </div>
                              )
                            })()}

                            {/* Subsidy indicator badge */}
                            {activity.is_subsidized !== undefined && (
                              <div className="mt-1">
                                <span className={cn(
                                  "text-[10px] font-medium",
                                  activity.is_subsidized
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-400 dark:text-gray-500"
                                )}>
                                  {activity.is_subsidized ? t.subsidizedLabel : t.notSubsidizedLabel}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {selectedIds.size > 0 && (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span>
                  {selectedIds.size} {selectedIds.size === 1
                    ? (tExtra.activitySingular ?? "atividade")
                    : (tExtra.activityPlural ?? "atividades")}
                </span>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} size="sm">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedIds.size === 0}
              className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              {selectedIds.size > 0
                ? `${tExtra.confirmWithCount ?? "Confirmar"} (${selectedIds.size})`
                : tExtra.confirm ?? "Confirmar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
