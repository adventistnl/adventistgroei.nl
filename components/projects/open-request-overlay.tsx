"use client"

import { Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface OpenRequestOverlayTranslations {
  title: string
  description: string
  projectLabel: string
  departmentLabel?: string
  reviewerLabel: string
  viewContact: string
  backToProjects: string
  statusBadge: string
  budgetLabel: string
  subsidizedBudgetLabel?: string
  approveProject?: string
  adjustmentsNeeded?: string
  approveSuccess?: string
  adjustmentsSuccess?: string
}

export interface OpenRequestOverlayProps {
  /** Whether to show the overlay */
  visible: boolean
  projectTitle: string
  departmentName?: string
  ownerName?: string
  /** Formatted total budget string (e.g. "€ 12.000") — caller handles formatting */
  formattedBudget?: string
  /** Formatted subsidized budget from KPIs */
  subsidizedBudget?: string
  /** Users to display in the avatar group */
  users?: UserAvatarData[]
  /** ID of the project owner for avatar highlight */
  ownerUserId?: string
  /** ID of co-owner for avatar highlight */
  coOwnerUserId?: string
  translations: OpenRequestOverlayTranslations
  /** Called when "View Contact" is clicked (non-reviewer) */
  onViewContact?: () => void
  /** Called when "Back to Projects" is clicked */
  onBackToProjects?: () => void
  /** When true, shows Approve + Adjustments Needed buttons instead of View Contact */
  isReviewer?: boolean
  /** Called when reviewer clicks "Approve" */
  onApprove?: () => Promise<void>
  /** Called when reviewer clicks "Adjustments Needed" */
  onRequestAdjustments?: () => Promise<void>
  /** Whether an approval/adjustment action is in progress */
  isReviewLoading?: boolean
}

/**
 * Inline card shown when a project is in OPEN_REQUEST / IN_REVIEW status.
 * Rendered in the page flow, below the Project Header.
 */
export function OpenRequestOverlay({
  visible,
  projectTitle,
  departmentName,
  ownerName,
  formattedBudget,
  subsidizedBudget,
  users = [],
  ownerUserId,
  coOwnerUserId,
  translations: t,
  onViewContact,
  onBackToProjects,
  isReviewer = false,
  onApprove,
  onRequestAdjustments,
  isReviewLoading = false,
}: OpenRequestOverlayProps) {
  if (!visible) return null

  return (
    <TooltipProvider>
      {/* Centred card — inline in the page layout */}
      <div className="flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-sm bg-card border rounded-2xl shadow-xl overflow-hidden">

            {/* ── Header ─── */}
            <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2">
              {/* Status pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
                <span className="text-[11px] font-medium text-sky-700 dark:text-sky-400 whitespace-nowrap">
                  {t.statusBadge}
                </span>
              </div>

              {/* Avatars */}
              {users.length > 0 && (
                <UsersAvatarGroup
                  users={users}
                  maxDisplay={3}
                  size="sm"
                  showLabel={false}
                  showAddButton={false}
                  ownerUserId={ownerUserId}
                  coOwnerUserId={coOwnerUserId}
                />
              )}
            </div>

            {/* ── Body ─── */}
            <div className="px-4 pb-4 space-y-3">
              {/* Project title */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  {t.projectLabel}
                </p>
                <p className="text-sm font-semibold text-foreground leading-tight truncate">
                  {projectTitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.description}
              </p>

              {/* Budget values */}
              {(formattedBudget || subsidizedBudget) && (
                <div className="flex items-center gap-4 py-1">
                  {formattedBudget && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground">{t.budgetLabel}</p>
                      <p className="text-sm font-semibold text-foreground tabular-nums">{formattedBudget}</p>
                    </div>
                  )}
                  {formattedBudget && subsidizedBudget && (
                    <div className="w-px h-7 bg-border shrink-0" />
                  )}
                  {subsidizedBudget && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground">{t.subsidizedBudgetLabel ?? 'Subsidy Request'}</p>
                      <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 tabular-nums">{subsidizedBudget}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reviewer row */}
              {ownerName && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.reviewerLabel}</span>
                  <span className="font-medium text-foreground truncate max-w-[55%] text-right">
                    {ownerName}
                  </span>
                </div>
              )}
            </div>

            {/* ── Footer ─── */}
            <div className="border-t px-4 py-3 bg-muted/20">
              {isReviewer ? (
                /* Reviewer actions: Approve + Adjustments Needed */
                <div className="flex items-center gap-2 w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs gap-1.5 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                    onClick={onRequestAdjustments}
                    disabled={isReviewLoading}
                  >
                    {isReviewLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <AlertCircle className="w-3 h-3 shrink-0" />
                    )}
                    <span className="truncate">{t.adjustmentsNeeded ?? 'Adjustments Needed'}</span>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs gap-1.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                    onClick={onApprove}
                    disabled={isReviewLoading}
                  >
                    {isReviewLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                    )}
                    <span className="truncate">{t.approveProject ?? 'Approve'}</span>
                  </Button>
                </div>
              ) : (
                /* Non-reviewer: View Contact button only */
                <div className="flex items-center justify-end">
                  {onViewContact && ownerName && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1.5"
                          onClick={onViewContact}
                        >
                          <Phone className="w-3 h-3" />
                          <span>{t.viewContact}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">{t.viewContact} · {ownerName}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>

        </div>
      </div>
    </TooltipProvider>
  )
}
