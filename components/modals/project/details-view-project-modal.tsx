"use client"

import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import {
  Clock,
  DollarSign,
  ExternalLink,
  ListChecks,
  Loader2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Folder,
  CheckCircle2,
  AlertCircle,
  History,
  Bell,
  CalendarPlus,
  FileWarning,
  Lock,
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

import { GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { UPDATE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { BATCH_UPDATE_PROJECT_ACTIVITIES } from "@/graphql/mutations/PROJECT_ACTIVITY_MUTATIONS"
import { REQUEST_SUBSIDY_REFUND } from "@/graphql/mutations/REFUND_MUTATIONS"
import { SubsidyRequestOption } from "@/components/modals/project/kanban-status-transition-modal"
import { GET_PROJECTS_QUERY, GET_PROJECT_KPIS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { useProjectHistory, buildStatusChangedPayload, buildCommentPayload } from "@/hooks/graphql/use-project-history"
import { useProjectAdjustments } from "@/hooks/graphql/use-project-adjustments"
import {
  PROJECT_STATUS_CONFIG,
  PROJECT_STATUS_ORDER,
} from "@/components/projects/project-header"
import { projectTranslations } from "@/lib/translations/projects"
import { ProjectTableData } from "@/components/projects/projects-table"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { useAuth } from "@/contexts/auth-context"
import { useCurrency } from "@/contexts/currency-context"
import { ProjectHistoryPanel } from "@/components/projects/project-history-panel"
import { projectHistoryTranslations } from "@/lib/translations/project-history"
import { SpecialProjectBadge } from "@/components/projects/special-project-badge"

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuickViewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: ProjectTableData | null
  /** Called after a successful status update so the parent can refetch */
  onStatusUpdated?: () => void
  /** Open the modal on a specific tab. Defaults to 'activities'. */
  initialTab?: 'activities' | 'history'
}

// ─── Micro-component: ActivityRow ────────────────────────────────────────────

const ACTIVITY_STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-green-500",
  IN_PROGRESS: "bg-blue-500",
  PENDING: "bg-yellow-500",
  CANCELLED: "bg-red-500",
}

function ActivityRow({
  activity,
  formatCurrency,
}: {
  activity: any
  formatCurrency: (v: number) => string
}) {
  const dotColor =
    ACTIVITY_STATUS_COLORS[activity.status?.toUpperCase()] ?? "bg-gray-400"
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", dotColor)} />
        <span className="text-sm truncate">{activity.name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 text-xs text-muted-foreground">
        {activity.budget_amount > 0 && (
          <span className="font-medium text-foreground">
            {formatCurrency(Number(activity.budget_amount))}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Micro-component: KpiCard ─────────────────────────────────────────────────

interface KpiCardProps {
  id: string
  label: string
  value: string
  icon: React.ElementType
  sub?: string
  valueColor?: string
  loading?: boolean
}

function KpiCard({ label, value, icon: Icon, valueColor, loading }: KpiCardProps) {
  return (
    <div className="flex-shrink-0 w-[110px] rounded-lg border bg-card px-3 py-4 flex flex-col gap-1">
      <div className="flex items-center  gap-1 text-muted-foreground">
        <span className="text-[10px] truncate leading-none">{label}</span>
      </div>
      {loading ? (
        <Skeleton className="h-4 w-3/4 mt-0.5" />
      ) : (
        <p className={cn("text-sm font-semibold leading-none truncate", valueColor)}>
          {value}
        </p>
      )}
    </div>
  )
}

// ─── Micro-component: KpiCarousel ─────────────────────────────────────────────

interface KpiCarouselProps {
  items: KpiCardProps[]
  loading?: boolean
}

function KpiCarousel({ items, loading }: KpiCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(updateScrollState, 50)
    return () => clearTimeout(timer)
  }, [items, updateScrollState])

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 150 : -150, behavior: "smooth" })
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full border bg-background shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-2 overflow-x-auto -mx-5 px-5 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} loading={loading} />
        ))}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full border bg-background shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

// ─── Micro-component: ActivitiesSection ──────────────────────────────────────

interface ActivitiesSectionProps {
  activities: any[]
  completedActivities: number
  loading: boolean
  formatCurrency: (v: number) => string
  t: any
}

function ActivitiesSection({
  activities,
  completedActivities,
  loading,
  formatCurrency,
  t,
}: ActivitiesSectionProps) {
  return (
    <div className="space-y-2 min-h-[200px]">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <ListChecks className="w-3.5 h-3.5" />
          {t.table?.activities ?? "Activities"}
          {activities.length > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {completedActivities}/{activities.length}
            </Badge>
          )}
        </h3>
      </div>

      <div className="min-h-[200px] overflow-y-auto border rounded-lg p-4">
        {loading ? (
            <div className="min-h-[152px] overflow-hidden">
            <div className="px-3 divide-y divide-border">
                {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Skeleton className="h-2 w-2 rounded-full flex-shrink-0" />
                    <Skeleton className="h-3.5 w-40" />
                    </div>
                    <Skeleton className="h-5 w-16 flex-shrink-0" />
                </div>
                ))}
            </div>
            </div>
        ) : activities.length === 0 ? (
            <div className="min-h-[152px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ListChecks className="w-7 h-7 opacity-30" />
            <p className="text-xs">{t.table?.noActivities ?? "No activities registered"}</p>
            </div>
        ) : (
            <div className="rounded-lg border overflow-hidden">
            <div
                className="px-3 divide-y divide-border overflow-y-auto"
                style={{ maxHeight: "152px" }}
            >
                {activities.map((act) => (
                <ActivityRow key={act.id} activity={act} formatCurrency={formatCurrency} />
                ))}
            </div>
            </div>
        )}
      </div>

      
    </div>
  )
}

// ─── Micro-component: TeamSection ───────────────────────────────────────────

interface TeamMember {
  id: string
  name: string
  email?: string
}

interface TeamSectionProps {
  teamUsers: UserAvatarData[]
  ownerUserId?: string
  coOwnerUserId?: string
  loading: boolean
  t: any
}

function TeamSection({ teamUsers, ownerUserId, coOwnerUserId, loading, t }: TeamSectionProps) {

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-6 rounded-full" />
          ))}
        </div>
      ) : teamUsers.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          {t.table?.noCollaborators ?? "No collaborators"}
        </p>
      ) : (
        <UsersAvatarGroup
          users={teamUsers}
          maxDisplay={8}
          size="sm"
          showLabel={false}
          showAddButton={false}
          ownerUserId={ownerUserId}
          coOwnerUserId={coOwnerUserId}
        />
      )}
    </div>
  )
}

// ─── Micro-component: StatusSelector ─────────────────────────────────────────

interface StatusSelectorProps {
  isOwner: boolean
  pendingStatus: string | undefined
  onStatusChange: (v: string) => void
  saving: boolean
  kpis: any
  t: any
}

function StatusSelector({
  isOwner,
  pendingStatus,
  onStatusChange,
  saving,
  kpis,
  t,
}: StatusSelectorProps) {
  const currentCfg = PROJECT_STATUS_CONFIG[pendingStatus ?? "DRAFT"]

  if (!isOwner) {
    return (
      <Badge
        className={cn(
          "h-8 px-3 text-xs font-medium flex items-center gap-2 w-full justify-start",
          currentCfg?.triggerClass
        )}
      >
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", currentCfg?.dotColor ?? "bg-gray-400")} />
        {(t.status as Record<string, string>)?.[currentCfg?.labelKey] ?? pendingStatus}
      </Badge>
    )
  }

  return (
    <Select
      value={pendingStatus}
      onValueChange={onStatusChange}
      disabled={saving || pendingStatus === "CONCLUDED"}
    >
      <SelectTrigger
        className={cn(
          "h-8 text-xs w-full",
          currentCfg?.triggerClass,
          pendingStatus === "CONCLUDED" && "opacity-70 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-2">
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-950 border border-border shadow-md z-[300]">
        {!PROJECT_STATUS_ORDER.includes(pendingStatus ?? "") && pendingStatus && (
          <SelectItem value={pendingStatus} disabled className="opacity-50">
            {(t.status as Record<string, string>)?.[
              PROJECT_STATUS_CONFIG[pendingStatus]?.labelKey ?? ""
            ] ?? pendingStatus}
          </SelectItem>
        )}
        {PROJECT_STATUS_ORDER.map((s) => {
          const cfg = PROJECT_STATUS_CONFIG[s]
          const isCurrent = pendingStatus === s
          const isConcludedLocked =
            s === "CONCLUDED" &&
            kpis &&
            (kpis.totalActivities > 0 ? kpis.completionRate < 100 : false)
          return (
            <SelectItem
              key={s}
              value={s}
              disabled={!!isConcludedLocked}
              className={cn(
                isCurrent && "font-semibold",
                isConcludedLocked && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", cfg?.dotColor ?? "bg-gray-400")} />
                {(t.status as Record<string, string>)?.[cfg?.labelKey] ?? s}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

// ─── Micro-component: ModalHeader ────────────────────────────────────────────

interface ModalHeaderProps {
  title: string
  specialType?: any
}

function ModalHeader({ title, specialType }: ModalHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-6 pt-5 pb-4 border-b flex-shrink-0">
      <Folder className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
      <div className="flex items-center gap-3">
        <DialogTitle className="text-base font-semibold leading-tight line-clamp-2">
          {title}
        </DialogTitle>
        {specialType && (
          <SpecialProjectBadge type={specialType} className="flex-shrink-0" />
        )}
      </div>
    </div>
  )
}

// ─── Micro-component: ActionBar ──────────────────────────────────────────────

interface ActionBarProps {
  isOwner: boolean
  pendingStatus: string | undefined
  onStatusChange: (v: string) => void
  saving: boolean
  kpis: any
  t: any
  teamUsers: UserAvatarData[]
  ownerUserId?: string
  coOwnerUserId?: string
  loading: boolean
}

function ActionBar({ isOwner, pendingStatus, onStatusChange, saving, kpis, t, teamUsers, ownerUserId, coOwnerUserId, loading }: ActionBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 py-3 border-b flex-shrink-0 bg-muted/30">
      {/* Team avatars */}
      <div className="flex-shrink-0">
        <TeamSection
          teamUsers={teamUsers}
          ownerUserId={ownerUserId}
          coOwnerUserId={coOwnerUserId}
          loading={loading}
          t={t}
        />
      </div>

      {/* Status selector — fills remaining space, tooltip when non-owner */}
      <div className="flex-1 min-w-0 max-w-[200px]">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatusSelector
                  isOwner={isOwner}
                  pendingStatus={pendingStatus}
                  onStatusChange={onStatusChange}
                  saving={saving}
                  kpis={kpis}
                  t={t}
                />
              </div>
            </TooltipTrigger>
            {!isOwner && (
              <TooltipContent side="bottom" className="text-xs max-w-[220px] z-[300]">
                {t.errors?.onlyOwnerCanEdit ?? "Only the project owner can change the status"}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

// ─── Micro-component: AdjustmentJustificationDialog ──────────────────────────────
// Used when moving to ADJUSTMENTS_NEEDED from anywhere (footer button or status selector).
// Requires a non-empty justification text before the Confirm button becomes active.
interface AdjustmentJustificationDialogProps {
  open: boolean
  loading: boolean
  onConfirm: (justification: string) => void
  onCancel: () => void
  t: any
}

function AdjustmentJustificationDialog({
  open,
  loading,
  onConfirm,
  onCancel,
  t,
}: AdjustmentJustificationDialogProps) {
  const [justification, setJustification] = React.useState("")
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setJustification("")
      setChecked(false)
    }
  }, [open])

  const tST = (t as any).statusTransitions ?? {}
  const canConfirm = checked && justification.trim().length > 0

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onCancel() }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            {tST.transitions?.ADJUSTMENTS_NEEDED?.title ?? "Requesting Adjustments"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {tST.transitions?.ADJUSTMENTS_NEEDED?.description ?? "The project will be returned to the owner indicating that changes are required. Please describe what needs to be adjusted."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Justification textarea */}
        <div className="space-y-1.5 my-1">
          <Label htmlFor="qv-adjustment-justification" className="text-sm font-medium">
            {tST.justificationLabel ?? "Justification"}
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Textarea
            id="qv-adjustment-justification"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder={tST.justificationPlaceholder ?? "Describe what needs to be adjusted\u2026"}
            className="min-h-[100px] resize-none text-sm"
          />
          <p className="text-[11px] text-muted-foreground">
            {tST.justificationHint ?? "This message will be visible in the project history and shown as a notification banner to the project owner."}
          </p>
        </div>

        {/* Confirmation checkbox */}
        <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30 p-3">
          <Checkbox
            id="adj-confirm"
            checked={checked}
            onCheckedChange={(v) => setChecked(Boolean(v))}
            className="mt-0.5"
          />
          <label htmlFor="adj-confirm" className="text-xs leading-relaxed cursor-pointer select-none">
            {tST.confirmCheckbox ?? "I understand the implications and want to proceed with this change"}
          </label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading}>
            {tST.cancel ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(justification.trim())}
            disabled={!canConfirm || loading}
            className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
            {tST.confirm ?? "Confirm Change"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Micro-component: ConcludeConfirmDialog ──────────────────────────────────

interface ConcludeConfirmDialogProps {
  open: boolean
  loading: boolean
  activitiesCount: number
  onConfirm: () => void
  onCancel: () => void
  t: any
}

function ConcludeConfirmDialog({ open, loading, activitiesCount, onConfirm, onCancel, t }: ConcludeConfirmDialogProps) {
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    if (!open) setChecked(false)
  }, [open])

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onCancel() }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-destructive" />
            {t.status?.concludeProject ?? "Conclude Project"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {t.status?.concludeWarning ??
              "This action is irreversible. Once concluded, the project will be permanently locked and no further updates will be possible."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Auto-complete activities notice */}
        {activitiesCount > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800/60 dark:bg-blue-950/30 p-3 text-sm">
            <CheckCircle2 className="mt-0.5 w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
              <strong className="font-semibold">{activitiesCount}</strong>{" "}
              {t.status?.concludeAutoCompleteActivities ??
                `activit${activitiesCount === 1 ? "y" : "ies"} will be automatically marked as COMPLETED.`}
            </p>
          </div>
        )}

        {/* Subsidies note */}
        <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800/60 dark:bg-orange-950/30 p-3 text-sm">
          <AlertCircle className="mt-0.5 w-4 h-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
          <p className="text-orange-800 dark:text-orange-200 leading-relaxed">
            {t.status?.openSubsidies ??
              "All subsidies must be closed before concluding the project."}
          </p>
        </div>

        {/* Confirmation checkbox */}
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 my-2">
          <Checkbox
            id="conclude-confirm"
            checked={checked}
            onCheckedChange={(v) => setChecked(Boolean(v))}
            className="mt-0.5"
          />
          <label htmlFor="conclude-confirm" className="text-xs leading-relaxed cursor-pointer select-none">
            {t.status?.concludeCheckbox ??
              "I understand that this project will be permanently closed and cannot be reopened or modified."}
          </label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading}>
            {t.cancel ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!checked || loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
            {t.status?.concludeConfirm ?? "Conclude Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Micro-component: WaitingRefundDialog ────────────────────────────────────
// Used when moving to WAITING_REFUND: captures refund amount + reason and calls
// requestSubsidyRefund for every subsidy on the project (no status restriction).

interface WaitingRefundDialogProps {
  open: boolean
  loading: boolean
  subsidies: SubsidyRequestOption[]
  onConfirm: (subsidyId: string, amount: number, reason: string) => void
  onCancel: () => void
  t: any
}

function WaitingRefundDialog({
  open,
  loading,
  subsidies,
  onConfirm,
  onCancel,
  t,
}: WaitingRefundDialogProps) {
  const { formatCurrency } = useCurrency()
  const [amount, setAmount] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [checked, setChecked] = React.useState(false)
  const [selectedSubsidyId, setSelectedSubsidyId] = React.useState("")

  React.useEffect(() => {
    if (!open) {
      setAmount("")
      setReason("")
      setChecked(false)
      setSelectedSubsidyId("")
    }
  }, [open])

  const selectedSubsidy = subsidies.find((s) => s.id === selectedSubsidyId)
  const maxAmount = selectedSubsidy ? Number(selectedSubsidy.total_budget ?? 0) : 0
  const parsedAmount = parseFloat(amount)
  const amountExceedsMax = maxAmount > 0 && !isNaN(parsedAmount) && parsedAmount > maxAmount
  const canConfirm =
    checked &&
    selectedSubsidyId !== "" &&
    !isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    !amountExceedsMax &&
    reason.trim().length > 0

  const tST = (t as any).statusTransitions ?? {}

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onCancel() }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-500" />
            {tST.transitions?.WAITING_REFUND?.title ?? "Request Refund"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {tST.transitions?.WAITING_REFUND?.description ??
              "The project will move to Waiting Refund. Select a subsidy request and enter the refund amount."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {subsidies.length === 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30 p-3 text-sm">
            <AlertCircle className="mt-0.5 w-4 h-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
            <p className="text-orange-800 dark:text-orange-200 leading-relaxed">
              {tST.noSubsidiesFound ??
                "No subsidy requests found for this project. Add a subsidy request before requesting a refund."}
            </p>
          </div>
        )}

        {subsidies.length > 0 && (
          <>
            {/* Subsidy selector */}
            <div className="space-y-1.5 mt-1">
              <Label className="text-sm font-medium">
                {tST.selectSubsidy ?? "Subsidy Request"}
                <span className="ml-1 text-red-500">*</span>
              </Label>
              <Select value={selectedSubsidyId} onValueChange={setSelectedSubsidyId}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={tST.selectSubsidyPlaceholder ?? "Select a subsidy request…"} />
                </SelectTrigger>
                <SelectContent>
                  {subsidies.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center justify-between gap-4 w-full">
                        <span className="truncate">{s.description ?? s.id.slice(0, 8)}</span>
                        {s.total_budget != null && (
                          <span className="text-muted-foreground text-xs shrink-0">
                            {formatCurrency(Number(s.total_budget))}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Refund amount — only shown after subsidy selected */}
            {selectedSubsidyId !== "" && (
              <div className="space-y-1.5">
                <Label htmlFor="qv-refund-amount" className="text-sm font-medium">
                  {tST.refundAmount ?? "Refund Amount"}
                  <span className="ml-1 text-red-500">*</span>
                  {maxAmount > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (max: {formatCurrency(maxAmount)})
                    </span>
                  )}
                </Label>
                <Input
                  id="qv-refund-amount"
                  type="number"
                  min={0}
                  max={maxAmount > 0 ? maxAmount : undefined}
                  step={0.01}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`text-sm ${amountExceedsMax ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                />
                {amountExceedsMax && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {tST.amountExceedsMax ?? `Amount cannot exceed the subsidy total (${formatCurrency(maxAmount)})`}
                  </p>
                )}
              </div>
            )}

            {/* Reason textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="qv-refund-reason" className="text-sm font-medium">
                {tST.refundReason ?? "Reason"}
                <span className="ml-1 text-red-500">*</span>
              </Label>
              <Textarea
                id="qv-refund-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={tST.refundReasonPlaceholder ?? "Describe the reason for the refund request…"}
                className="min-h-[80px] resize-none text-sm"
              />
            </div>

            {/* Confirmation checkbox */}
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30 p-3">
              <Checkbox
                id="refund-confirm"
                checked={checked}
                onCheckedChange={(v) => setChecked(Boolean(v))}
                className="mt-0.5"
              />
              <label htmlFor="refund-confirm" className="text-xs leading-relaxed cursor-pointer select-none">
                {tST.confirmCheckbox ?? "I understand the implications and want to proceed with this change"}
              </label>
            </div>
          </>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading}>
            {tST.cancel ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(selectedSubsidyId, parsedAmount, reason.trim())}
            disabled={!canConfirm || loading || subsidies.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
            {tST.confirmRefund ?? "Request Refund"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Micro-component: ModalFooter ────────────────────────────────────────────

interface ModalFooterProps {
  onClose: () => void
  projectId: string
  router: ReturnType<typeof useRouter>
  t: any
  isOwner: boolean
  currentStatus: string | undefined
  onApproveProject: () => void
  onRequestAdjustments: () => void
  onSendReminder: () => void
  onConclude: () => void
  onExtendDeadline: () => void
  onMentionMissingReceipts: () => void
  approveLoading: boolean
  adjustmentLoading: boolean
  reminderLoading: boolean
  extendLoading: boolean
  concludeLoading: boolean
  receiptLoading: boolean
}

function ModalFooter({
  onClose, projectId, router, t, isOwner, currentStatus,
  onApproveProject, onRequestAdjustments, onSendReminder, onConclude,
  onExtendDeadline, onMentionMissingReceipts,
  approveLoading, adjustmentLoading, reminderLoading, extendLoading, concludeLoading, receiptLoading,
}: ModalFooterProps) {
  const viewProjectBtn = (
    <Button
      variant="outline"
      size="sm"
      className="h-8 px-3 text-xs gap-1.5"
      onClick={() => { onClose(); router.push(`/projects/${projectId}`) }}
    >
      <ExternalLink className="w-3.5 h-3.5" />
      {t.viewProject ?? "View Project"}
    </Button>
  )

  const adjustmentBtn = (
    <Button
      size="sm"
      variant="outline"
      className="h-8 px-3 text-xs gap-1.5 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
      onClick={onRequestAdjustments}
      disabled={adjustmentLoading || approveLoading}
    >
      {adjustmentLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5" />
      )}
      {t.status?.requestAdjustments ?? "Adjustment Needed"}
    </Button>
  )

  const concludeBtn = (
    <Button
      size="sm"
      variant="default"
      className="h-8 px-3 text-xs gap-1.5 bg-destructive hover:bg-destructive/90 text-white"
      onClick={onConclude}
      disabled={concludeLoading}
    >
      {concludeLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Lock className="w-3.5 h-3.5" />
      )}
      {t.status?.concludeProject ?? "Conclude"}
    </Button>
  )

  // Render right-side actions based on current status (only for owner)
  const renderActions = () => {
    if (!isOwner) return viewProjectBtn

    switch (currentStatus) {
      case "OPEN_REQUEST":
        return (
          <div className="flex items-center gap-2">
            {adjustmentBtn}
            <Button
              size="sm"
              variant="default"
              className="h-8 px-3 text-xs gap-1.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
              onClick={onApproveProject}
              disabled={approveLoading || adjustmentLoading}
            >
              {approveLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              {t.status?.approveProject ?? "Approve Project"}
            </Button>
          </div>
        )

      case "IN_PROGRESS":
        return (
          <div className="flex items-center gap-2">
            {adjustmentBtn}
            {viewProjectBtn}
          </div>
        )

      case "WAITING_REFUND":
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs gap-1.5"
              onClick={onSendReminder}
              disabled={reminderLoading}
            >
              {reminderLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Bell className="w-3.5 h-3.5" />
              )}
              {t.status?.sendReminder ?? "Send Reminder"}
            </Button>
            {concludeBtn}
          </div>
        )

      case "OVERDUE":
        return (
          <div className="flex items-center gap-2">
            {concludeBtn}
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-orange-700"
              onClick={onExtendDeadline}
              disabled={extendLoading}
            >
              {extendLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CalendarPlus className="w-3.5 h-3.5" />
              )}
              {t.status?.extendDeadline ?? "Extend +7 days"}
            </Button>
          </div>
        )

      case "PENDING_RECEIPT":
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs gap-1.5"
              onClick={onMentionMissingReceipts}
              disabled={receiptLoading}
            >
              {receiptLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileWarning className="w-3.5 h-3.5" />
              )}
              {t.status?.mentionMissingReceipts ?? "Mention Missing Receipts"}
            </Button>
            {concludeBtn}
          </div>
        )

      default:
        return viewProjectBtn
    }
  }

  return (
    <div className="px-6 py-3 border-t flex-shrink-0 flex items-center justify-between w-full gap-3">
      {/* Left: Cancel */}
      <Button variant="outline" size="sm" onClick={onClose} className="h-8 px-3 text-xs">
        {t.cancel ?? "Cancel"}
      </Button>

      {/* Right: context-aware actions */}
      {renderActions()}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DetailsViewProjectModal({
  isOpen,
  onClose,
  project,
  onStatusUpdated,
  initialTab,
}: QuickViewProjectModalProps) {
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const router = useRouter()

  const t =
    projectTranslations[i18n.language as keyof typeof projectTranslations] ??
    projectTranslations.en

  // originalStatus: the committed status (used to detect pending changes)
  const [originalStatus, setOriginalStatus] = React.useState<string | undefined>(project?.status)

  // Track which action triggered the mutation (for per-button loading)
  const [actionType, setActionType] = React.useState<
    'approve' | 'adjustment' | 'select' | 'reminder' | 'extend' | 'conclude' | 'receipt' | null
  >(null)

  // Conclude confirmation dialog
  const [concludeConfirmOpen, setConcludeConfirmOpen] = React.useState(false)

  // Adjustment justification dialog
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = React.useState(false)
  // Ref to carry justification text into updateStatus's onCompleted
  const pendingAdjustmentJustificationRef = React.useRef<string | null>(null)

  // Pending status transition for logging after onCompleted
  const pendingStatusRef = React.useRef<{ old: string; new: string } | null>(null)

  // Project history hook (write-only, no fetch)
  const { logHistory } = useProjectHistory({ projectId: project?.id ?? "", skipFetch: true })

  // Adjustment hook — used to create ProjectAdjustment entities for ADJUSTMENTS_NEEDED
  const { createAdjustment } = useProjectAdjustments(project?.id ?? null)
  // Body tab: Activities | History
  const [bodyTab, setBodyTab] = React.useState<'activities' | 'history'>('activities')

  // Reset tab when modal opens — use initialTab if provided
  React.useEffect(() => {
    if (isOpen) setBodyTab(initialTab ?? 'activities')
  }, [isOpen, initialTab])

  // Sync when project/modal changes
  React.useEffect(() => {
    setOriginalStatus(project?.status)
    setActionType(null)
  }, [project?.status, isOpen])

  // ── Fetch full project data ──────────────────────────────────────────────
  const { data, loading } = useQuery(GET_PROJECT_BY_ID_QUERY, {
    variables: { id: project?.id },
    skip: !isOpen || !project?.id,
    fetchPolicy: "network-only",
  })

  const fullProject = data?.project ?? null
  const kpis = fullProject?.kpis ?? null

  // ── Status update mutation (closes modal on success) ─────────────────────
  const [updateStatus, { loading: saving }] = useMutation(UPDATE_PROJECT_MUTATION, {
    refetchQueries: [
      { query: GET_PROJECTS_QUERY },
      { query: GET_PROJECT_KPIS_QUERY },
    ],
    onCompleted: () => {
      // Log status change in history
      if (pendingStatusRef.current) {
        // REMOVED: logHistory(buildStatusChangedPayload(pendingStatusRef.current.old, pendingStatusRef.current.new))
        // If the transition was to ADJUSTMENTS_NEEDED, create a real ProjectAdjustment entity
        if (
          pendingStatusRef.current.new === 'ADJUSTMENTS_NEEDED' &&
          pendingAdjustmentJustificationRef.current
        ) {
          console.log(
            "[QuickViewModal] ADJUSTMENTS_NEEDED → creating ProjectAdjustment",
            "projectId:", project?.id,
            "justification:", pendingAdjustmentJustificationRef.current,
          )
          createAdjustment({ comment: pendingAdjustmentJustificationRef.current })
          pendingAdjustmentJustificationRef.current = null
        }
        // If the transition was to WAITING_REFUND, fire requestSubsidyRefund for the selected subsidy
        if (pendingStatusRef.current.new === 'WAITING_REFUND' && pendingRefundRef.current) {
          const { subsidyId, amount, reason, refundType } = pendingRefundRef.current
          console.log(
            `%c[QuickView] updateStatus ✔ → firing requestSubsidyRefund for subsidyId: ${subsidyId}`,
            "color: #a855f7; font-weight: bold"
          )
          requestSubsidyRefundMutation({
            variables: { id: subsidyId, refundAmount: amount, refundType: refundType || 'TOTAL', reason, language: i18n.language as any },
          })
          const histMsg = `💰 Refund of ${formatCurrency(amount)} requested. Reason: ${reason}`
          logHistory(buildCommentPayload(histMsg))
          pendingRefundRef.current = null
        }
        pendingStatusRef.current = null
      }
      setOriginalStatus(undefined)
      setActionType(null)
      toast.success(t.status?.statusUpdated ?? "Status updated")
      onStatusUpdated?.()
      onClose()
    },
    onError: (err) => {
      const ext = err.graphQLErrors?.[0]?.extensions as any
      const code =
        ext?.context?.additional?.errorCode ??
        ext?.additional?.errorCode ??
        ext?.code

      let msg = err.message
      if (code === "PROJECT_IS_CONCLUDED")
        msg = t.status?.cannotModifyConcluded ?? msg
      else if (code === "PROJECT_HAS_INCOMPLETE_ACTIVITIES")
        msg = t.status?.incompleteActivities ?? msg
      else if (code === "PROJECT_HAS_UNVALIDATED_DOCUMENTS")
        msg = t.status?.unvalidatedDocuments ?? msg
      else if (code === "PROJECT_HAS_OPEN_SUBSIDIES")
        msg = t.status?.openSubsidies ?? msg

      // Revert pending status on error
      pendingStatusRef.current = null
      setActionType(null)
      toast.error(msg)
    },
  })

  // ── Extend deadline mutation (does NOT close modal) ───────────────────────
  const [extendDeadlineMutation, { loading: extendSaving }] = useMutation(UPDATE_PROJECT_MUTATION, {
    refetchQueries: [{ query: GET_PROJECTS_QUERY }],
    onError: (err) => {
      toast.error(t.status?.deadlineExtendError ?? "Failed to extend deadline")
      setActionType(null)
    },
  })

  // ── Batch complete activities (used when concluding a project) ────────────
  const [batchCompleteActivities] = useMutation(BATCH_UPDATE_PROJECT_ACTIVITIES, {
    onError: (err) => {
      console.error("[QuickView] batchCompleteActivities error:", err)
    },
  })

  // ── Waiting refund dialog state ───────────────────────────────────────────
  const [waitingRefundDialogOpen, setWaitingRefundDialogOpen] = React.useState(false)
  // Stores the selected subsidy ID, amount and reason for the onCompleted handler
  const pendingRefundRef = React.useRef<{
    subsidyId: string
    amount: number
    reason: string
    refundType?: string
  } | null>(null)

  // ── Request subsidy refund mutation ──────────────────────────────────────
  const [requestSubsidyRefundMutation] = useMutation(REQUEST_SUBSIDY_REFUND, {
    onCompleted: (data) => {
      const r = data?.requestSubsidyRefund
      console.groupCollapsed(
        `%c[QuickView] ✔ requestSubsidyRefund → subsidyId: ${r?.id}`,
        "color: #22c55e; font-weight: bold"
      )
      console.log("refund_amount:", r?.refund_amount)
      console.log("have_refund:", r?.have_refund)
      console.log("refund_done:", r?.refund_done)
      console.log("subsidy_status:", r?.subsidy_status)
      console.groupEnd()
      if (process.env.NODE_ENV === "development") {
        window.__refundDebugLog?.({
          type: "mutation_success",
          subsidyId: r?.id ?? "?",
          refundId: r?.id ?? "?",
          refundAmount: r?.refund_amount ?? 0,
        })
      }
    },
    onError: (err) => {
      console.error("[QuickView] requestSubsidyRefund error:", err)
      if (process.env.NODE_ENV === "development") {
        window.__refundDebugLog?.({ type: "mutation_error", subsidyId: "?", message: err.message })
      }
    },
  })

  const handleStatusChange = (newStatus: string) => {
    if (!project?.id || newStatus === originalStatus) return

    const isCurrentUserOwner =
      user?.id === project.owner_id || user?.id === project.owner?.id
    if (!isCurrentUserOwner) {
      toast.error(t.errors?.onlyOwnerCanEdit ?? "Only the project owner can change the status")
      return
    }

    if (originalStatus === "CONCLUDED" && newStatus !== "CONCLUDED") {
      toast.error(t.status?.cannotModifyConcluded ?? "Cannot modify a concluded project")
      return
    }

    // Intercept ADJUSTMENTS_NEEDED — must show justification dialog first
    if (newStatus === "ADJUSTMENTS_NEEDED") {
      setAdjustmentDialogOpen(true)
      return
    }

    // Intercept WAITING_REFUND — must have at least one subsidy to select
    if (newStatus === "WAITING_REFUND") {
      const subsidies = fullProject?.subsidies ?? []
      if (subsidies.length === 0) {
        toast.error(
          t.statusTransitions?.noSubsidiesError ??
            "This project has no subsidy requests. Add one before requesting a refund."
        )
        return
      }
      setWaitingRefundDialogOpen(true)
      return
    }

    // Fire mutation immediately — modal auto-closes on success
    pendingStatusRef.current = { old: originalStatus ?? project.status ?? "", new: newStatus }
    setActionType('select')
    updateStatus({ variables: { id: project.id, status: newStatus } })
  }

  const handleApproveProject = async () => {
    if (!project?.id) return
    pendingStatusRef.current = { old: originalStatus ?? project.status ?? "", new: 'IN_PROGRESS' }
    setActionType('approve')
    await updateStatus({ variables: { id: project.id, status: 'IN_PROGRESS' } })
  }

  const handleRequestAdjustments = async () => {
    if (!project?.id) return
    // Open justification dialog — actual mutation fires in handleAdjustmentConfirmed
    setAdjustmentDialogOpen(true)
  }

  // ── Called when the user submits the AdjustmentJustificationDialog ──────────
  const handleAdjustmentConfirmed = async (justification: string) => {
    if (!project?.id) return
    setAdjustmentDialogOpen(false)
    pendingAdjustmentJustificationRef.current = justification
    pendingStatusRef.current = { old: originalStatus ?? project.status ?? "", new: 'ADJUSTMENTS_NEEDED' }
    setActionType('adjustment')
    await updateStatus({ variables: { id: project.id, status: 'ADJUSTMENTS_NEEDED' } })
  }

  // ── Called when the user submits the WaitingRefundDialog ─────────────────
  const handleWaitingRefundConfirmed = async (subsidyId: string, amount: number, reason: string) => {
    if (!project?.id || !subsidyId) return
    setWaitingRefundDialogOpen(false)
    
    const subsidy = fullProject?.subsidies?.find((s: any) => s.id === subsidyId)
    const maxAmount = Number(subsidy?.total_budget ?? 0)
    const refundType = amount >= maxAmount ? 'TOTAL' : 'PARTIAL'

    pendingRefundRef.current = { subsidyId, amount, reason, refundType }
    pendingStatusRef.current = { old: originalStatus ?? project.status ?? "", new: 'WAITING_REFUND' }
    setActionType('select')
    await updateStatus({ variables: { id: project.id, status: 'WAITING_REFUND' } })
  }

  // ── Send Reminder (WAITING_REFUND) ───────────────────────────────────────
  const handleSendReminder = async () => {
    if (!project?.id) return
    setActionType('reminder')
    const coOwnerMention = coOwner ? `@${coOwner.name}` : ""
    const msg =
      t.status?.reminderMessage
        ? t.status.reminderMessage.replace('{{coOwner}}', coOwnerMention)
        : `🔔 Reminder: ${coOwnerMention ? `${coOwnerMention}, please` : "Please"} submit the pending refund documents so this project can be concluded.`
    try {
      await logHistory(buildCommentPayload(msg))
      toast.success(t.status?.reminderSent ?? "Reminder sent to the team")
    } catch {
      toast.error(t.status?.reminderError ?? "Failed to send reminder")
    } finally {
      setActionType(null)
    }
  }

  // ── Extend Deadline +7 days (OVERDUE) ────────────────────────────────
  const handleExtendDeadline = async () => {
    if (!project?.id) return
    setActionType('extend')
    const currentEnd = project.end_at ? new Date(project.end_at) : new Date()
    const newEnd = new Date(currentEnd.getTime() + 7 * 24 * 60 * 60 * 1000)
    const newEndIso = newEnd.toISOString()
    try {
      await extendDeadlineMutation({ variables: { id: project.id, end_at: newEndIso } })
      const formatted = newEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      await logHistory(buildCommentPayload(
        (t.status?.deadlineExtendedMsg ?? "📅 Deadline extended by 7 days. New end date: {{date}}.").replace('{{date}}', formatted)
      ))
      toast.success(t.status?.deadlineExtended ?? "Deadline extended by 7 days")
    } catch {
      // error handled by mutation's onError
    } finally {
      setActionType(null)
    }
  }

  // ── Conclude Project (WAITING_REFUND / OVERDUE / PENDING_RECEIPT) ─────────
  const handleConclude = () => {
    setConcludeConfirmOpen(true)
  }

  const handleConcludeConfirmed = async () => {
    if (!project?.id) return
    setActionType('conclude')
    pendingStatusRef.current = { old: originalStatus ?? project.status ?? "", new: 'CONCLUDED' }
    await updateStatus({ variables: { id: project.id, status: 'CONCLUDED' } })
    // Auto-complete all project activities after concluding
    const activityIds = (fullProject?.activities ?? []).map((a: any) => a.id).filter(Boolean)
    if (activityIds.length > 0) {
      await batchCompleteActivities({ variables: { ids: activityIds, status: 'COMPLETED' } })
    }
    setConcludeConfirmOpen(false)
  }

  // ── Mention Missing Receipts (PENDING_RECEIPT) ─────────────────────────
  const handleMentionMissingReceipts = async () => {
    if (!project?.id) return
    setActionType('receipt')
    // Identify activities that are not COMPLETED (still pending receipt)
    const pendingActivities = activities.filter(
      (a) => a.status?.toUpperCase() !== 'COMPLETED'
    )
    const activityList =
      pendingActivities.length > 0
        ? pendingActivities.map((a: any) => `\u2022 ${a.name}`).join('\n')
        : (t.status?.allActivitiesPending ?? "All activities are pending receipts.")

    const msg =
      t.status?.missingReceiptsMessage
        ? t.status.missingReceiptsMessage.replace('{{activities}}', activityList)
        : `The following activities are still missing receipts:\n${activityList}\n\nPlease upload the required documents to proceed.`
    try {
      await logHistory(buildCommentPayload(msg))
      toast.success(t.status?.receiptMentionSent ?? "Missing receipts mentioned in history")
    } catch {
      toast.error(t.status?.receiptMentionError ?? "Failed to post message")
    } finally {
      setActionType(null)
    }
  }

  const handleCancel = () => {
    setActionType(null)
    setConcludeConfirmOpen(false)
    onClose()
  }

  // ── Derived values ───────────────────────────────────────────────────────
  const isOwner =
    user?.id === project?.owner_id || user?.id === project?.owner?.id

  const activities: any[] = fullProject?.activities ?? []
  const subsidies: any[] = fullProject?.subsidies ?? []

  // Collaborators and co-owner derived from the API 'collaborators' resolve field
  type ApiCollaborator = { role: string; activity_ids?: string[]; user: TeamMember }
  const apiCollaborators: ApiCollaborator[] = React.useMemo(
    () =>
      ((fullProject?.collaborators ?? (project as any)?.collaborators ?? []) as ApiCollaborator[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fullProject?.collaborators, (project as any)?.collaborators]
  )

  const ownerUser: TeamMember | null = fullProject?.owner ?? null

  const coOwner: TeamMember | null = React.useMemo(
    () => apiCollaborators.find((c) => c.role === 'co_owner')?.user ?? null,
    [apiCollaborators]
  )

  const collaborators: TeamMember[] = React.useMemo(
    () => apiCollaborators.filter((c) => c.role === 'assignee').map((c) => c.user),
    [apiCollaborators]
  )

  // All collaborators as UserAvatarData — owner first, co-owner second, then assignees
  const teamUsers: UserAvatarData[] = React.useMemo(() => {
    const roleOrder: Record<string, number> = { owner: 0, co_owner: 1, assignee: 2 }
    return [...apiCollaborators]
      .sort((a, b) => (roleOrder[a.role] ?? 3) - (roleOrder[b.role] ?? 3))
      .filter((c) => c.user?.id && c.user?.name)
      .map((c) => ({
        id: c.user.id,
        name: c.user.name,
        email: c.user.email,
        role: c.role,
        isFinance: c.role === 'finance_manager' || c.role === 'finance',
        initials: c.user.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      }))
  }, [apiCollaborators])

  // Can comment = owner, co-owner or any assignee collaborator
  const canComment =
    isOwner ||
    coOwner?.id === user?.id ||
    collaborators.some((c) => c.id === user?.id)

  const completedActivities = activities.filter(
    (a) => a.status?.toUpperCase() === "COMPLETED"
  ).length
  const completionRate =
    activities.length > 0
      ? Math.round((completedActivities / activities.length) * 100)
      : 0

  const daysLeft = project?.end_at
    ? Math.ceil(
        (new Date(project.end_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null

  const totalSubsidyApproved = subsidies.reduce(
    (s, sub) => s + Number(sub.approved_amount ?? 0),
    0
  )

  // ── KPI data ─────────────────────────────────────────────────────────────
  const kpiItems: KpiCardProps[] = [
    {
      id: "total-budget",
      label: t.kpis?.totalBudget ?? "Total Budget",
      value: formatCurrency(Number(project?.budget ?? 0)),
      icon: DollarSign,
      sub: t.kpis?.subsidizedBudget
        ? `${formatCurrency(Number(project?.subsidized_budget ?? 0))} ${t.kpis.subsidizedBudget.toLowerCase()}`
        : undefined,
    },
    {
      id: "subsidized",
      label: t.kpis?.subsidizedBudget ?? "Subsidized",
      value: formatCurrency(Number(project?.subsidized_budget ?? 0)),
      icon: TrendingUp,
      sub: project?.budget
        ? `${Math.round(
            (Number(project?.subsidized_budget ?? 0) / Number(project?.budget)) * 100
          )}% ${t.kpis?.ofTotalBudget ?? "of total"}`
        : undefined,
    },
    {
      id: "activities",
      label: t.table?.activities ?? "Activities",
      value: loading ? "—" : `${completedActivities}/${activities.length}`,
      icon: ListChecks,
      sub: `${completionRate}% ${t.kpis?.completionRate ?? "complete"}`,
    },
    {
      id: "approved-subsidy",
      label: t.table?.subsidyAmount ?? "Approved Subsidy",
      value: formatCurrency(totalSubsidyApproved),
      icon: DollarSign,
      sub:
        subsidies.length > 0
          ? `${subsidies.length} ${t.table?.subsidyRequests ?? "requests"}`
          : undefined,
    },
    {
      id: "days-left",
      label:
        daysLeft !== null && daysLeft < 0
          ? (t.table?.daysOverdue ?? "Overdue")
          : (t.table?.daysLeft ?? "Days left"),
      value:
        daysLeft === null
          ? "—"
          : daysLeft < 0
          ? `${Math.abs(daysLeft)}d`
          : daysLeft === 0
          ? (t.table?.today ?? "Today")
          : `${daysLeft}d`,
      icon: Clock,
      valueColor:
        daysLeft !== null && daysLeft < 0
          ? "text-red-600"
          : daysLeft !== null && daysLeft <= 7
          ? "text-orange-500"
          : undefined,
    },
  ]

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent
        className="max-w-2xl w-full max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden"
        onInteractOutside={handleCancel}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <ModalHeader title={project.title} specialType={project.specialType} />

        {/* ── Action Bar ──────────────────────────────────────────────── */}
        <ActionBar
          isOwner={isOwner}
          pendingStatus={originalStatus}
          onStatusChange={handleStatusChange}
          saving={saving && actionType === 'select'}
          kpis={kpis}
          t={t}
          teamUsers={teamUsers}
          ownerUserId={ownerUser?.id ?? project?.owner_id}
          coOwnerUserId={coOwner?.id}
          loading={loading}
        />

        {/* ── Scrollable body ──────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
          <KpiCarousel items={kpiItems} loading={loading} />
          <Separator />

          {/* Tab switcher: Activities | History */}
          <div className="flex items-center gap-1 border-b border-border">
            <button
              type="button"
              onClick={() => setBodyTab('activities')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors",
                bodyTab === 'activities'
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <ListChecks className="w-3.5 h-3.5" />
              {t.table?.activities ?? "Activities"}
              {activities.length > 0 && (
                <span className="ml-0.5 text-[10px] bg-muted rounded px-1">
                  {completedActivities}/{activities.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setBodyTab('history')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors",
                bodyTab === 'history'
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="w-3.5 h-3.5" />
              {(projectHistoryTranslations[i18n.language] ?? projectHistoryTranslations.en).panel.title}
            </button>
          </div>

          {bodyTab === 'activities' ? (
            <ActivitiesSection
              activities={activities}
              completedActivities={completedActivities}
              loading={loading}
              formatCurrency={formatCurrency}
              t={t}
            />
          ) : (
            <ProjectHistoryPanel
              projectId={project.id}
              projectTitle={project.title}
              maxHeight="280px"
              allowComments
              canComment={canComment}
            />
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <ModalFooter
          onClose={handleCancel}
          projectId={project.id}
          router={router}
          t={t}
          isOwner={isOwner}
          currentStatus={originalStatus}
          onApproveProject={handleApproveProject}
          onRequestAdjustments={handleRequestAdjustments}
          onSendReminder={handleSendReminder}
          onConclude={handleConclude}
          onExtendDeadline={handleExtendDeadline}
          onMentionMissingReceipts={handleMentionMissingReceipts}
          approveLoading={saving && actionType === 'approve'}
          adjustmentLoading={saving && actionType === 'adjustment'}
          reminderLoading={actionType === 'reminder'}
          extendLoading={extendSaving || actionType === 'extend'}
          concludeLoading={saving && actionType === 'conclude'}
          receiptLoading={actionType === 'receipt'}
        />

        {/* ── Conclude Confirm Dialog ─────────────────────────────────── */}
        <ConcludeConfirmDialog
          open={concludeConfirmOpen}
          loading={saving && actionType === 'conclude'}
          activitiesCount={(fullProject?.activities ?? []).length}
          onConfirm={handleConcludeConfirmed}
          onCancel={() => setConcludeConfirmOpen(false)}
          t={t}
        />

        {/* ── Adjustment Justification Dialog ─────────────────────────── */}
        <AdjustmentJustificationDialog
          open={adjustmentDialogOpen}
          loading={saving && actionType === 'adjustment'}
          onConfirm={handleAdjustmentConfirmed}
          onCancel={() => setAdjustmentDialogOpen(false)}
          t={t}
        />

        {/* ── Waiting Refund Dialog ─────────────────────────────────────── */}
        <WaitingRefundDialog
          open={waitingRefundDialogOpen}
          loading={saving && actionType === 'select'}
          subsidies={(fullProject?.subsidies ?? []).map((s: any) => ({
            id: s.id,
            description: s.description,
            total_budget: s.total_budget,
            approved_amount: s.approved_amount,
          }))}
          onConfirm={handleWaitingRefundConfirmed}
          onCancel={() => setWaitingRefundDialogOpen(false)}
          t={t}
        />
      </DialogContent>
    </Dialog>
  )
}
