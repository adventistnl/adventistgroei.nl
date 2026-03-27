"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, AlertTriangle, Info, MessageSquareWarning, Activity } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { projectTranslations } from "@/lib/translations/projects"
import { PROJECT_STATUS_CONFIG } from "@/components/projects/project-header"

// ─── Which transitions require a confirmation modal ──────────────────────────
// Add target statuses here to intercept moves TO them from any source status.
const STATUSES_REQUIRING_CONFIRMATION = new Set([
  "IN_PROGRESS",
  "OPEN_REQUEST",
  "IN_REVIEW",
  "ADJUSTMENTS_NEEDED",
  "PENDING_RECEIPT",
  "WAITING_REFUND",
  "CONCLUDED",
])

// ─── Statuses that require a written justification ───────────────────────────
const STATUSES_REQUIRING_JUSTIFICATION = new Set([
  "ADJUSTMENTS_NEEDED",
])

// ─── Statuses that show an activity @-mention textarea ───────────────────────
const STATUSES_WITH_ACTIVITY_MENTION = new Set([
  "PENDING_RECEIPT",
])

// ─── Statuses that show a numeric refund-amount field ────────────────────────
const STATUSES_WITH_REFUND_AMOUNT = new Set([
  "WAITING_REFUND",
])

/**
 * Returns true if dragging FROM `fromStatus` TO `toStatus` should show the
 * confirmation modal. Add statuses to STATUSES_REQUIRING_CONFIRMATION above.
 */
export function requiresTransitionConfirmation(
  fromStatus: string,
  toStatus: string
): boolean {
  if (fromStatus === toStatus) return false
  return STATUSES_REQUIRING_CONFIRMATION.has(toStatus)
}

// ─── Activity @-mention textarea ─────────────────────────────────────────────
function MentionTextarea({
  value,
  onChange,
  placeholder,
  activities,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  activities: { id: string; name: string; status?: string }[]
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [mentionQuery, setMentionQuery] = React.useState<string | null>(null)
  const [mentionStart, setMentionStart] = React.useState(0)
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  // Safe list: filter out entries without a name
  const safeActivities = React.useMemo(
    () => activities.filter((a) => typeof a.name === "string" && a.name.length > 0),
    [activities]
  )

  const filteredActivities = React.useMemo(() => {
    if (mentionQuery === null) return []
    const q = mentionQuery.toLowerCase()
    return safeActivities
      .filter((a) => a.name.toLowerCase().includes(q))
      .slice(0, 7)
  }, [mentionQuery, safeActivities])

  // Reset highlight when list changes
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredActivities.length])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    onChange(val)
    const cursorPos = e.target.selectionStart ?? val.length
    const textBeforeCursor = val.slice(0, cursorPos)
    const atMatch = textBeforeCursor.match(/@([^@\s]*)$/)
    if (atMatch) {
      setMentionQuery(atMatch[1])
      setMentionStart(cursorPos - atMatch[0].length)
    } else {
      setMentionQuery(null)
    }
  }

  const selectMention = React.useCallback((activity: { id: string; name: string }) => {
    const cursorPos = textareaRef.current?.selectionStart ?? value.length
    const before = value.slice(0, mentionStart)
    const after = value.slice(cursorPos)
    const newText = `${before}@${activity.name} ${after}`
    onChange(newText)
    setMentionQuery(null)
    setTimeout(() => {
      if (textareaRef.current) {
        const pos = mentionStart + activity.name.length + 2
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(pos, pos)
      }
    }, 0)
  }, [value, mentionStart, onChange])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery === null || filteredActivities.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((i) => Math.min(i + 1, filteredActivities.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      const target = filteredActivities[highlightedIndex]
      if (target) selectMention(target)
    } else if (e.key === "Escape") {
      setMentionQuery(null)
    }
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[90px] resize-none text-sm"
      />
      {mentionQuery !== null && filteredActivities.length > 0 && (
        <div className="absolute left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-md overflow-hidden">
          {filteredActivities.map((a, idx) => (
            <button
              key={a.id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); selectMention(a) }}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`flex items-center w-full px-3 py-1.5 text-sm gap-2 text-left transition-colors ${
                idx === highlightedIndex ? "bg-accent" : "hover:bg-accent/60"
              }`}
            >
              <Activity className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="truncate flex-1">{a.name}</span>
              {a.status && (
                <span className="text-[10px] text-muted-foreground capitalize">
                  {a.status.toLowerCase().replace(/_/g, " ")}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {mentionQuery !== null && filteredActivities.length === 0 && safeActivities.length === 0 && (
        <div className="absolute left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-md overflow-hidden">
          <p className="px-3 py-2 text-xs text-muted-foreground">No activities available</p>
        </div>
      )}
    </div>
  )
}

// ─── SubsidyRequest option shape ─────────────────────────────────────────────
export interface SubsidyRequestOption {
  id: string
  description?: string | null
  total_budget?: number | null
  approved_amount?: number | null
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface KanbanStatusTransitionModalProps {
  isOpen: boolean
  fromStatus: string
  toStatus: string
  projectTitle?: string
  /** Activities for @-mention autocomplete in PENDING_RECEIPT transitions */
  activities?: { id: string; name: string; status?: string }[]
  /** Currency symbol shown next to the refund amount input (WAITING_REFUND) */
  currencySymbol?: string
  /** Subsidy requests available for WAITING_REFUND transitions — selector shown when provided */
  subsidyRequests?: SubsidyRequestOption[]
  /** True while subsidies are being fetched — shows loading state in selector */
  isLoadingSubsidies?: boolean
  /**
   * Called when the user confirms the transition.
   * - ADJUSTMENTS_NEEDED: `justification` = reviewer's explanation
   * - PENDING_RECEIPT: `justification` = free text with @mentions
   * - WAITING_REFUND: `justification` = serialised refund amount ("150.00")
   * - Others: undefined
   */
  onConfirm: (justification?: string) => void
  onCancel: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export function KanbanStatusTransitionModal({
  isOpen,
  fromStatus,
  toStatus,
  projectTitle,
  activities = [],
  currencySymbol = "€",
  subsidyRequests,
  isLoadingSubsidies = false,
  onConfirm,
  onCancel,
}: KanbanStatusTransitionModalProps) {
  const { i18n } = useTranslation()
  const [confirmed, setConfirmed] = React.useState(false)
  const [justification, setJustification] = React.useState("")
  const [refundAmount, setRefundAmount] = React.useState<number | "">("")
  const [activitiesMention, setActivitiesMention] = React.useState("")
  const [selectedSubsidyId, setSelectedSubsidyId] = React.useState("")

  const requiresJustification = STATUSES_REQUIRING_JUSTIFICATION.has(toStatus)
  const requiresActivityMention = STATUSES_WITH_ACTIVITY_MENTION.has(toStatus)
  const requiresRefundAmount = STATUSES_WITH_REFUND_AMOUNT.has(toStatus)

  // Reset local state every time the modal opens
  React.useEffect(() => {
    if (isOpen) {
      setConfirmed(false)
      setJustification("")
      setRefundAmount("")
      setActivitiesMention("")
      setSelectedSubsidyId("")
    }
  }, [isOpen])

  const t =
    projectTranslations[i18n.language as keyof typeof projectTranslations] ||
    projectTranslations.en
  const tST = t.statusTransitions

  // Resolve human-readable status labels from global config
  const fromLabel =
    (t.status as Record<string, string>)?.[
      PROJECT_STATUS_CONFIG[fromStatus]?.labelKey ?? ""
    ] ?? fromStatus

  const toLabel =
    (t.status as Record<string, string>)?.[
      PROJECT_STATUS_CONFIG[toStatus]?.labelKey ?? ""
    ] ?? toStatus

  // Look up the transition-specific copy
  const transitionCopy =
    (tST?.transitions as Record<string, { title: string; description: string; consequence: string; warning: string }>)?.[toStatus]

  // For WAITING_REFUND: derive max amount from selected subsidy
  const selectedSubsidy = subsidyRequests?.find((s) => s.id === selectedSubsidyId)
  const maxRefundAmount = Number(selectedSubsidy?.total_budget ?? 0)

  // Confirm is enabled only when checkbox is ticked AND (if needed) justification is non-empty
  const canConfirm =
    confirmed &&
    (!requiresJustification || justification.trim().length > 0) &&
    (!requiresRefundAmount ||
      (
        selectedSubsidyId !== "" &&
        refundAmount !== "" &&
        refundAmount > 0 &&
        (maxRefundAmount <= 0 || refundAmount <= maxRefundAmount)
      )
    )

  const handleConfirm = () => {
    if (!canConfirm) return
    if (requiresJustification) {
      onConfirm(justification.trim())
    } else if (requiresActivityMention) {
      onConfirm(activitiesMention.trim() || undefined)
    } else if (requiresRefundAmount) {
      // Serialise subsidyId + amount as JSON so the kanban handler can use the selected subsidy directly
      onConfirm(JSON.stringify({ subsidyId: selectedSubsidyId, refundAmount }))
    } else {
      onConfirm(undefined)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Icon + title */}
          <div className="flex items-start gap-3 mb-1">
            <div className="mt-0.5 flex-shrink-0 rounded-md border border-border bg-muted p-2">
              {requiresJustification
                ? <MessageSquareWarning className="h-4 w-4 text-orange-500" />
                : <Info className="h-4 w-4 text-foreground" />
              }
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold leading-snug">
                {tST?.modalTitle ?? "Confirm Status Change"}
              </DialogTitle>
              {projectTitle && (
                <p className="mt-0.5 text-sm text-muted-foreground truncate">
                  {projectTitle}
                </p>
              )}
            </div>
          </div>

          {/* Status pill row: From → To */}
          <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
            <span className="font-medium text-foreground">{fromLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="font-semibold text-foreground">{toLabel}</span>
          </div>
        </DialogHeader>

        {/* Body */}
        {transitionCopy ? (
          <div className="space-y-4 py-1 text-sm">
            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {transitionCopy.description}
            </p>

            {/* Consequence */}
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
              <p className="text-foreground leading-relaxed">
                <strong className="font-semibold">{tST?.from ?? "Note"}:</strong>{" "}
                {transitionCopy.consequence}
              </p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-background px-3 py-2.5">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-foreground" />
              <p className="text-foreground leading-relaxed">
                <strong className="font-semibold">{transitionCopy.warning}</strong>
              </p>
            </div>
          </div>
        ) : (
          <p className="py-1 text-sm text-muted-foreground">
            {`${tST?.from ?? "From"} "${fromLabel}" ${tST?.to?.toLowerCase() ?? "to"} "${toLabel}".`}
          </p>
        )}

        {/* Justification field — ADJUSTMENTS_NEEDED */}
        {requiresJustification && (
          <div className="space-y-1.5">
            <Label htmlFor="adjustment-justification" className="text-sm font-medium text-foreground">
              {(tST as any)?.justificationLabel ?? "Justification"}
              <span className="ml-1 text-red-500">*</span>
            </Label>
            <Textarea
              id="adjustment-justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder={(tST as any)?.justificationPlaceholder ?? "Describe what needs to be adjusted\u2026"}
              className="min-h-[90px] resize-none text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              {(tST as any)?.justificationHint ?? "This message will be logged in the project history and shown as a banner to the project owner."}
            </p>
          </div>
        )}

        {/* Activity @-mention textarea — PENDING_RECEIPT */}
        {requiresActivityMention && (
          <div className="space-y-1.5">
            <Label htmlFor="activities-mention" className="text-sm font-medium text-foreground">
              {(tST as any)?.pendingReceiptActivitiesLabel ?? "Activities with pending receipts"}
            </Label>
            <MentionTextarea
              value={activitiesMention}
              onChange={setActivitiesMention}
              placeholder={(tST as any)?.pendingReceiptActivitiesPlaceholder ?? "Type @ to mention activities with pending receipts\u2026"}
              activities={activities}
            />
            <p className="text-[11px] text-muted-foreground">
              {(tST as any)?.pendingReceiptActivitiesHint ?? "Use @ to mention specific activities. This will be logged in the project history."}
            </p>
          </div>
        )}

        {/* Refund amount number input — WAITING_REFUND */}
        {requiresRefundAmount && (
          <div className="space-y-3">
            {/* Subsidy request selector */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                {(tST as any)?.selectSubsidyLabel ?? "Subsidy Request"}
                <span className="ml-1 text-red-500">*</span>
              </Label>
              {isLoadingSubsidies ? (
                <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin inline-block" />
                  {(tST as any)?.loadingSubsidies ?? "Loading subsidy requests…"}
                </div>
              ) : subsidyRequests && subsidyRequests.length === 0 ? (
                <div className="rounded-md border border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30 px-3 py-2.5 text-sm text-orange-800 dark:text-orange-200">
                  {(tST as any)?.noSubsidiesForRefund ??
                    "This project has no subsidy requests. Add one before requesting a refund."}
                </div>
              ) : (
                <Select
                  value={selectedSubsidyId}
                  onValueChange={setSelectedSubsidyId}
                  disabled={!subsidyRequests || subsidyRequests.length === 0}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={(tST as any)?.selectSubsidyPlaceholder ?? "Select a subsidy request…"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(subsidyRequests ?? []).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="truncate">
                          {s.description ?? s.id.slice(0, 8)}
                          {s.total_budget ? ` — ${currencySymbol} ${Number(s.total_budget).toFixed(2)}` : ""}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Refund amount — only shown once a subsidy is selected */}
            {selectedSubsidyId && (
              <div className="space-y-1.5">
                <Label htmlFor="refund-amount" className="text-sm font-medium text-foreground">
                  {(tST as any)?.refundAmountLabel ?? "Amount to be refunded"}
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground flex-shrink-0 w-5 text-center">
                    {currencySymbol}
                  </span>
                  <Input
                    id="refund-amount"
                    type="number"
                    min={0}
                    max={maxRefundAmount > 0 ? maxRefundAmount : undefined}
                    step={0.01}
                    value={refundAmount}
                    onChange={(e) =>
                      setRefundAmount(e.target.value === "" ? "" : parseFloat(e.target.value))
                    }
                    placeholder={(tST as any)?.refundAmountPlaceholder ?? "0.00"}
                    className="text-sm"
                  />
                </div>
                {maxRefundAmount > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    {(tST as any)?.refundAmountHint ?? "Enter the amount to be returned."}
                    {" "}
                    <span className="font-medium">
                      Max: {currencySymbol} {maxRefundAmount.toFixed(2)}
                    </span>
                  </p>
                )}
                {typeof refundAmount === "number" && maxRefundAmount > 0 && refundAmount > maxRefundAmount && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {(tST as any)?.refundAmountExceeded ??
                      `Amount cannot exceed ${currencySymbol} ${maxRefundAmount.toFixed(2)}.`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Confirmation checkbox */}
        <div
          className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2.5 transition-colors hover:bg-muted/40"
          onClick={() => setConfirmed((v) => !v)}
        >
          <Checkbox
            id="transition-confirm-checkbox"
            checked={confirmed}
            onCheckedChange={(v) => setConfirmed(!!v)}
            className="mt-0.5 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
          <label
            htmlFor="transition-confirm-checkbox"
            className="cursor-pointer text-sm text-foreground leading-relaxed select-none"
          >
            {tST?.confirmCheckbox ??
              "I understand the implications and want to proceed with this change"}
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
            {tST?.cancel ?? "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 sm:flex-none"
          >
            {tST?.confirm ?? "Confirm Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
