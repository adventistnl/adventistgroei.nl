"use client"

import * as React from "react"
import { MoreVertical, FileText, DollarSign, Archive, Info, Eye, Pencil, Trash2, Plus, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR, enUS, nl } from "date-fns/locale"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { WithPermission } from "@/hocs/with-permission"
import { useHasPermission } from "@/hooks/use-has-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AdvanceSubsidyBadge } from "@/components/ui/advance-subsidy-badge"
import { RefundStatusBadge } from "@/components/ui/refund-status-badge"

export interface SubsidyRequestCardData {
  id: string
  title: string
  requested_at: string | Date
  status: "pending" | "approved" | "rejected" | "in_review" | "closed" | "advanced_closed" | "waiting_refund"
  requested_amount: number
  approved_amount?: number
  rejection_reason?: string
  approved_at?: Date
  rejected_at?: Date
  archived?: boolean
  // Advance request fields
  is_for_advance?: boolean
  advance_amount?: number
  // IDs for editing
  project_id?: string
  institution_id?: string
  department_id?: string
  church_id?: string
  church_department_id?: string
  // Fields for editing
  description?: string
  requester_id?: string
  subsidy_statuses_id?: string
  // Display names
  institution_name?: string
  church_name?: string
  department_name?: string
  church_department_name?: string
  activities_count?: number
  total_budget?: number
  notes?: string
  items?: Array<{
    id: string
    activity_id: string
    activity_name: string
    requested_amount: number
    approved_amount: number
    budget_amount: number
    notes?: string
    activity?: {
      id: string
      name: string
      description?: string
      budget_amount: number
      status?: string
      priority?: string
      is_subsidized?: boolean
    }
  }>
  refund_amount?: number
  have_refund?: boolean
  refund_done?: boolean
}

interface SubsidyRequestCardProps {
  data: SubsidyRequestCardData
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onDuplicate?: (id: string) => void
  onArchive?: (id: string) => void
  onLinkActivity?: (id: string) => void
  className?: string
}

export function SubsidyRequestCard({
  data,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onArchive,
  onLinkActivity,
  className,
}: SubsidyRequestCardProps) {
  const { t, i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const contentDisabledClass = data.archived ? "opacity-60 pointer-events-none" : ""

  // Check if any action is available (for showing/hiding the menu button)
  const hasAnyPermission = useHasPermission(
    [
      PermissionResolverName.SubsidyRequest,
      PermissionResolverName.UpdateSubsidyRequest,
      PermissionResolverName.DeleteSubsidyRequest
    ],
    [],
    true // partial check - user needs at least one permission
  )

  const statusConfig: Record<
    SubsidyRequestCardData["status"],
    { label: string; className: string }
  > = {
    pending: { label: t('subsidy.status.pending') || t('subsidy.deleteRequest.statusLabels.pending') || "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
    approved: { label: t('subsidy.status.approved') || t('subsidy.deleteRequest.statusLabels.approved') || t('subsidy.approvedLower') || "Approved", className: "bg-green-50 text-green-700 border-green-200" },
    rejected: { label: t('subsidy.status.rejected') || t('subsidy.deleteRequest.statusLabels.rejected') || "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
    in_review: { label: t('subsidy.status.inReview') || t('subsidy.deleteRequest.statusLabels.in_review') || "In Review", className: "bg-blue-50 text-blue-700 border-blue-200" },
    closed: { label: t('subsidy.status.closed') || t('subsidy.deleteRequest.statusLabels.closed') || t('subsidy.closed') || "Closed", className: "bg-gray-50 text-gray-700 border-gray-200" },
    advanced_closed: { label: t('subsidy.status.advancedClosed') || "Advanced Closed", className: "bg-purple-50 text-purple-700 border-purple-200" },
    waiting_refund: { label: t('subsidy.status.waitingRefund') || "Waiting Refund", className: "bg-orange-50 text-orange-700 border-orange-200" },
  }

  // Use fallback for unknown status
  const currentStatus = statusConfig[data.status] || {
    label: data.status || 'Unknown',
    className: "bg-gray-50 text-gray-700 border-gray-200"
  }

  const formattedDate = React.useMemo(() => {
    const date = typeof data.requested_at === "string" ? new Date(data.requested_at) : data.requested_at
    const locale = i18n.language === 'en' ? enUS : i18n.language === 'nl' ? nl : ptBR
    return format(date, "dd MMM yyyy", { locale })
  }, [data.requested_at, i18n.language])

  const formattedAmount = React.useMemo(() => {
    return formatCurrency(data.requested_amount)
  }, [data.requested_amount, formatCurrency])

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-gray-300 hover:shadow-sm",
        onView ? "cursor-pointer" : "",
        className
      )}
      onClick={(e) => {
        // Prevent opening if clicking on interactive elements
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="button"]')) {
          return
        }
        if (onView) onView(data.id)
      }}
    >
      {/* Header: Icon + Title + Menu */}
      {/* Archived overlay indicator */}
      {data.archived && (
        <div className="absolute top-2 left-2 z-20">
          <div className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
            <Archive className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-2">
        {/* Left content (icon + title) - becomes inert when archived */}
        <div className={cn("flex items-start gap-2 flex-1 min-w-0", contentDisabledClass)}>
          {/* Icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <FileText className="h-4 w-4 text-gray-600" />
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="truncate text-xs font-semibold text-gray-900">{data.title}</h4>
            </div>
            {data.institution_name && (
              <p className="truncate text-[10px] text-gray-500">{data.institution_name}</p>
            )}
          </div>
        </div>

        {/* Three-dot menu (only if user has any permission) */}
        {hasAnyPermission && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onView && (
                <WithPermission requiredPermissions={[PermissionResolverName.SubsidyRequest]}>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(data.id); }}>
                    <Eye className="w-4 h-4 mr-2" />
                    {t('actions.view')}
                  </DropdownMenuItem>
                </WithPermission>
              )}
              {onEdit && (!data.is_for_advance || (data.items && data.items.length > 0)) && (
                <WithPermission requiredPermissions={[PermissionResolverName.UpdateSubsidyRequest, PermissionResolverName.CreateSubsidyRequest]}>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(data.id); }}>
                    <Pencil className="w-4 h-4 mr-2" />
                    {t('actions.edit')}
                  </DropdownMenuItem>
                </WithPermission>
              )}
              {/* Link Activity (Advance Requests only) - hide if already linked (has items) */}
              {data.is_for_advance && !data.archived && onLinkActivity && (!data.items || data.items.length === 0) && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onLinkActivity(data.id); }}>
                  <div className="flex items-center">
                    <Plus className="w-3 h-3 mr-2" />
                    {t('subsidy.linkActivity') || "Link Activity"}
                  </div>
                </DropdownMenuItem>
              )}

              {onDelete && (
                <WithPermission requiredPermissions={[PermissionResolverName.DeleteSubsidyRequest]}>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('actions.delete')}
                  </DropdownMenuItem>
                </WithPermission>
              )}

              {/* {onDuplicate && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(data.id); }}>
                    {t('actions.duplicate')}
                  </DropdownMenuItem>
                </>
              )} */}

              {/* Archive / Unarchive action */}
              {onArchive && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive && onArchive(data.id); }}>
                    <Archive className="w-3 h-3 mr-2" />
                    {data.archived ? t('actions.unarchive') : t('actions.archive')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Rest of content - disabled when archived */}
      <div className={cn("space-y-2", contentDisabledClass)}>
        {/* Date */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <span>{t("subsidy.requestedOn")}</span>
          <span className="font-medium text-gray-700">{formattedDate}</span>
        </div>

        {/* Status Badge + Amount in same row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] font-medium px-1.5 py-0.5", currentStatus.className)}>
              {currentStatus.label}
            </Badge>
            <AdvanceSubsidyBadge isForAdvance={data.is_for_advance} />
            <RefundStatusBadge
              haveRefund={data.have_refund}
              refundDone={data.refund_done}
            />
          </div>


          {/* Amount */}
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-gray-400" />
            <span className="text-sm font-bold text-gray-900">{formattedAmount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
