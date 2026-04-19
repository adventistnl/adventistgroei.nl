"use client"

import { ArrowLeft, Phone } from "lucide-react"
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
  /** Called when "View Contact" is clicked */
  onViewContact?: () => void
  /** Called when "Back to Projects" is clicked */
  onBackToProjects?: () => void
}

/**
 * Reusable full-area overlay shown when a project is in OPEN_REQUEST status.
 * Mount this inside a `position: relative` wrapper — the overlay uses `absolute inset-0`.
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
}: OpenRequestOverlayProps) {
  if (!visible) return null

  return (
    <TooltipProvider>
      <div className="absolute inset-0 z-30 rounded-xl overflow-hidden">
        {/* Frosted backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

        {/* Centred card */}
        <div className="absolute inset-0 flex items-start justify-center pt-12 p-4">
          <div className="relative z-10 w-full max-w-xs bg-card border rounded-2xl shadow-xl overflow-hidden">

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

            {/* ── Footer — space-between ─── */}
            <div className="border-t px-4 py-3 flex items-center justify-between gap-2 bg-muted/20">
              {/* Back to Projects */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={onBackToProjects}
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">{t.backToProjects}</span>
                <span className="sm:hidden">{t.backToProjects}</span>
              </Button>

              {/* View Contact — Tooltip on mobile */}
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
                      <span className="hidden sm:inline">{t.viewContact}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="sm:hidden">
                    <p className="text-xs">{t.viewContact} · {ownerName}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
