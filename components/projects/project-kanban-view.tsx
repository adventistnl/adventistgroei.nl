"use client"

import React, { useMemo, useState, useCallback, useRef } from "react"
import { useMutation, useLazyQuery } from "@apollo/client"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import {
  Folder,
  Clock,
  Activity,
  MoreHorizontal,
  Building2,
  DollarSign,
  ExternalLink,
  Info,
} from "lucide-react"

import { KanbanBoard, KanbanGroup, KanbanItem, KanbanAction, KanbanMoveRule } from "@/components/ui/kanban-board"
import { ProjectTableData } from "@/components/projects/projects-table"
import {
  PROJECT_STATUS_ORDER,
  PROJECT_STATUS_CONFIG,
} from "@/components/projects/project-header"
import { projectTranslations } from "@/lib/translations/projects"
import { UPDATE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { CREATE_PROJECT_HISTORY } from "@/graphql/mutations/PROJECT_HISTORY_MUTATIONS"
import { CREATE_ADJUSTMENT } from "@/graphql/mutations/PROJECT_ADJUSTMENT_MUTATIONS"
import { BATCH_UPDATE_PROJECT_ACTIVITIES } from "@/graphql/mutations/PROJECT_ACTIVITY_MUTATIONS"
import { buildStatusChangedPayload, buildCommentPayload } from "@/hooks/graphql/use-project-history"
import { GET_PROJECTS_QUERY, GET_PROJECT_KPIS_QUERY, GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { REQUEST_SUBSIDY_REFUND } from "@/graphql/mutations/REFUND_MUTATIONS"
import { SubsidyRequestOption } from "@/components/modals/project/kanban-status-transition-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/contexts/currency-context"
import { useAuth } from "@/contexts/auth-context"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { createProjectKanbanMoveRules, getProjectInvalidGroups, getProjectBlockedRule } from "@/lib/project-kanban-rules"
import {
  KanbanStatusTransitionModal,
  requiresTransitionConfirmation,
} from "@/components/modals/project/kanban-status-transition-modal"
import toast from "react-hot-toast"

interface ProjectKanbanViewProps {
  projects: ProjectTableData[]
  departments?: any[]
  onView?: (project: ProjectTableData) => void
  onEdit?: (project: ProjectTableData) => void
  onQuickView?: (project: ProjectTableData) => void
}

export function ProjectKanbanView({
  projects,
  departments = [],
  onView,
  onEdit,
  onQuickView,
}: ProjectKanbanViewProps) {
  const { i18n } = useTranslation()
  const { formatCurrency, selectedCurrency } = useCurrency()
  const { user } = useAuth()
  const router = useRouter()

  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  // ── Pending transition (awaiting confirmation modal) ─────────────────────────
  type PendingTransition = { itemId: string; fromGroupId: string; toGroupId: string }
  const [pendingTransition, setPendingTransition] = useState<PendingTransition | null>(null)
  // Ref is updated SYNCHRONOUSLY so handleSaveChanges can read it in the same tick
  const pendingTransitionRef = useRef<PendingTransition | null>(null)

  // ── local optimistic state so the board re-renders instantly ────────────────
  const [localProjects, setLocalProjects] = useState<ProjectTableData[]>(projects)

  // Sync when parent data changes
  React.useEffect(() => {
    setLocalProjects(projects)
  }, [projects])

  // ── Move rules — project-aware, computed from already-loaded data ────────────
  const moveRules: KanbanMoveRule = useMemo(() => {
    const base = createProjectKanbanMoveRules({
      userId: user?.id ?? "",
      projects: localProjects,
    })

    return {
      ...base,
      // Custom error messages — resolved from each rule's `reason` field (i18n)
      getCanMoveErrorMessage: (itemId, _from, toGroupId, item) => {
        if (!item?.metadata?.isUserOwner) return undefined
        const proj = localProjects.find((p) => p.id === itemId)
        if (!proj) return undefined
        const rule = getProjectBlockedRule(proj, toGroupId)
        if (!rule) return undefined

        // Map rule.reason → translation key
        const errorMessages: Record<string, string | undefined> = {
          noSubsidiesForRefund:
            t.statusTransitions?.noSubsidiesError ??
            "This project has no subsidy requests. Add one before requesting a refund.",
          incompleteActivities:
            t.status?.incompleteActivities ??
            "All activities must be completed before concluding the project.",
          noRegressionPastOpenRequest:
            t.status?.cannotGoBackToDraft ??
            "Projects that have passed Open Request cannot return to Draft.",
        }

        return errorMessages[rule.reason]
      },
    }
  }, [user?.id, localProjects, t])

  // ── history mutation (write-only, silent on error) ───────────────────────────
  const [createHistory] = useMutation(CREATE_PROJECT_HISTORY, {
    onError: () => { /* intentionally silent */ },
  })
  // ── batch complete activities (fires on CONCLUDED) ───────────────────
  const [batchCompleteActivities] = useMutation(BATCH_UPDATE_PROJECT_ACTIVITIES, {
    onError: (err) => {
      console.error("[KanbanView] batchCompleteActivities error:", err)
    },
  })

  // ── Waiting refund: pre-fetch subsidies for the selector modal ──────────────
  const [pendingTransitionSubsidies, setPendingTransitionSubsidies] = useState<SubsidyRequestOption[]>([])
  const [loadingTransitionSubsidies, setLoadingTransitionSubsidies] = useState(false)

  const [requestSubsidyRefundMutation] = useMutation(REQUEST_SUBSIDY_REFUND, {
    onCompleted: (data) => {
      const r = data?.requestSubsidyRefund
      console.groupCollapsed(
        `%c[KanbanView] ✔ requestSubsidyRefund → subsidyId: ${r?.id}`,
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
      console.error("[KanbanView] requestSubsidyRefund error:", err)
      if (process.env.NODE_ENV === "development") {
        window.__refundDebugLog?.({ type: "mutation_error", subsidyId: "?", message: err.message })
      }
    },
  })

  const [fetchProjectForRefund, { data: refundProjectData }] = useLazyQuery(
    GET_PROJECT_BY_ID_QUERY,
    { fetchPolicy: "network-only" }
  )

  // Populate subsidy selector when lazy project data arrives; block if no subsidies
  React.useEffect(() => {
    if (!refundProjectData?.project) return
    const subsidies: SubsidyRequestOption[] = (refundProjectData.project.subsidies ?? []).map((s: any) => ({
      id: s.id,
      description: s.description,
      total_budget: s.total_budget,
      approved_amount: s.approved_amount,
    }))
    setPendingTransitionSubsidies(subsidies)
    setLoadingTransitionSubsidies(false)

    if (subsidies.length === 0) {
      const pending = pendingTransitionRef.current
      if (pending) {
        pendingTransitionRef.current = null
        setPendingTransition(null)
        setLocalProjects((prev) =>
          prev.map((p) => p.id === pending.itemId ? { ...p, status: pending.fromGroupId } : p)
        )
      }
      toast.error(
        t.statusTransitions?.noSubsidiesError ??
          "This project has no subsidy requests. Add one before requesting a refund."
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refundProjectData])

  // Pre-fetch subsidies when a WAITING_REFUND transition is pending
  React.useEffect(() => {
    if (pendingTransition?.toGroupId !== 'WAITING_REFUND') {
      setPendingTransitionSubsidies([])
      setLoadingTransitionSubsidies(false)
      return
    }
    setLoadingTransitionSubsidies(true)
    fetchProjectForRefund({ variables: { id: pendingTransition.itemId } })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTransition?.itemId, pendingTransition?.toGroupId])
  // ── adjustment mutation ───────────────────────────────────────────────────────
  const [createAdjustmentMutation] = useMutation(CREATE_ADJUSTMENT, {
    onError: (err) => {
      console.error("[KanbanView] createAdjustment error:", err)
    },
    onCompleted: (data) => {
      console.log(
        "[KanbanView] createAdjustment completed ✔",
        "id:", data?.createAdjustment?.id,
        "status:", data?.createAdjustment?.status,
        "comment:", data?.createAdjustment?.project_history?.comment,
      )
    },
  })

  const logStatusChange = useCallback(
    (projectId: string, fromStatus: string, toStatus: string, justification?: string) => {
      // 1. Log the status change entry (always)
      const statusPayload = buildStatusChangedPayload(fromStatus, toStatus)
      createHistory({
        variables: { data: { project_id: projectId, ...statusPayload } },
      })

      // 2. For ADJUSTMENTS_NEEDED, create a real ProjectAdjustment entity
      //    (not a raw history entry) so it has its own lifecycle + tasks.
      if (toStatus === "ADJUSTMENTS_NEEDED" && justification) {
        console.log(
          "[KanbanView] logStatusChange → creating ProjectAdjustment",
          "projectId:", projectId,
          "justification:", justification,
        )
        createAdjustmentMutation({
          variables: {
            data: { project_id: projectId, comment: justification },
          },
        })
      }

      // 3. For PENDING_RECEIPT, log the activities mention as a comment (if provided)
      if (toStatus === "PENDING_RECEIPT" && justification) {
        const msg = `Activities with pending receipts:\n${justification}`
        createHistory({
          variables: { data: { project_id: projectId, ...buildCommentPayload(msg) } },
        })
      }

      // 4. For WAITING_REFUND, log the refund amount as a comment (if provided)
      if (toStatus === "WAITING_REFUND" && justification) {
        let displayAmount = justification
        try {
          const parsed = JSON.parse(justification)
          const amount = parsed.refundAmount
          if (typeof amount === "number" && !isNaN(amount)) displayAmount = formatCurrency(amount)
        } catch {
          const raw = parseFloat(justification)
          if (!isNaN(raw)) displayAmount = formatCurrency(raw)
        }
        const msg = `Refund amount to be returned: ${displayAmount}`
        createHistory({
          variables: { data: { project_id: projectId, ...buildCommentPayload(msg) } },
        })
      }
    },
    [createHistory, createAdjustmentMutation, formatCurrency]
  )

  // ── mutation ─────────────────────────────────────────────────────────────────
  const [updateProjectStatus] = useMutation(UPDATE_PROJECT_MUTATION, {
    refetchQueries: [
      { query: GET_PROJECTS_QUERY },
      { query: GET_PROJECT_KPIS_QUERY },
    ],
    onCompleted: () => {
      toast.success(t.status?.statusUpdated || "Status updated")
    },
    onError: (err) => {
      let ext = (err.graphQLErrors?.[0]?.extensions as any)
      if (!ext && (err.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (err.networkError as any).result.errors[0].extensions
      }
      const errorCode =
        ext?.context?.additional?.errorCode ||
        ext?.additional?.errorCode ||
        ext?.code

      let msg = err.message
      if (errorCode === "PROJECT_IS_CONCLUDED")
        msg = t.status?.cannotModifyConcluded || "Cannot modify a concluded project"
      else if (errorCode === "PROJECT_HAS_INCOMPLETE_ACTIVITIES")
        msg = t.status?.incompleteActivities || "All activities must be completed first"
      else if (errorCode === "PROJECT_HAS_UNVALIDATED_DOCUMENTS")
        msg = t.status?.unvalidatedDocuments || "All documents must be validated first"
      else if (errorCode === "PROJECT_HAS_OPEN_SUBSIDIES")
        msg = t.status?.openSubsidies || "All subsidies must be closed first"

      toast.error(msg)
    },
  })

  // ── Kanban groups – one per status in the declared order ─────────────────────
  const kanbanGroups: KanbanGroup[] = useMemo(
    () =>
      PROJECT_STATUS_ORDER.map((statusKey) => {
        const cfg = PROJECT_STATUS_CONFIG[statusKey]
        const labelKey = cfg?.labelKey ?? statusKey.toLowerCase()
        const label =
          (t.status as Record<string, string>)?.[labelKey] ?? statusKey
        return {
          id: statusKey,
          name: label,
          color: cfg?.kanbanColor ?? "#6b7280",
        }
      }),
    [t]
  )

  // ── Kanban items ─────────────────────────────────────────────────────────────
  const kanbanItems: KanbanItem[] = useMemo(
    () =>
      localProjects.map((p) => {
        const dept = departments.find((d: any) => d.id === p.department_id)
        const daysLeft = Math.ceil(
          (new Date(p.end_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        const isUserOwner =
          user?.id === p.owner_id || user?.id === p.owner?.id

        const collaborators: Array<{ role: string; user: { id: string; name: string; email?: string } }> =
          (p.collaborators as any[]) ?? []

        const isUserMember =
          isUserOwner || collaborators.some((c) => c.user?.id === user?.id)

        const ownerId =
          collaborators.find((c) => c.role === "owner")?.user?.id ?? p.owner_id
        const coOwnerId =
          collaborators.find((c) => c.role === "co_owner")?.user?.id ?? p.co_owner_id ?? undefined

        // Build avatar list: owner first, then co-owner, then other collaborators
        const avatarUsers: UserAvatarData[] = [...collaborators]
          .sort((a, b) => {
            const order = { owner: 0, co_owner: 1 }
            return (
              (order[a.role as keyof typeof order] ?? 2) -
              (order[b.role as keyof typeof order] ?? 2)
            )
          })
          .map((c) => ({
            id: c.user.id,
            name: c.user.name,
            email: c.user.email,
            role: c.role,
            initials: c.user.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
          }))

        return {
          id: p.id,
          groupId: p.status || "DRAFT",
          title: p.title,
          description: dept?.name ?? "",
          metadata: {
            budget: formatCurrency(p.budget || 0),
            activities: p.activities ?? 0,
            daysLeft,
            isUserOwner,
            isUserMember,
            ownerId,
            coOwnerId,
            avatarUsers,
            end_at: p.end_at,
            start_at: p.start_at,
          },
        }
      }),
    [localProjects, departments, formatCurrency, user?.id]
  )

  // ── optimistic local move ────────────────────────────────────────────────────
  const handleItemMove = useCallback(
    (itemId: string, fromGroupId: string, toGroupId: string) => {
      // Always apply the optimistic move so the card visually relocates
      setLocalProjects((prev) =>
        prev.map((p) =>
          p.id === itemId ? { ...p, status: toGroupId } : p
        )
      )
      // If this transition requires explicit confirmation, store as pending.
      // The ref is updated SYNCHRONOUSLY here so handleSaveChanges (called in the
      // same JS tick by KanbanBoard) sees it immediately and skips the mutation.
      // The state update drives the modal visibility.
      if (requiresTransitionConfirmation(fromGroupId, toGroupId)) {
        const pt: PendingTransition = { itemId, fromGroupId, toGroupId }
        pendingTransitionRef.current = pt
        setPendingTransition(pt)
      }
    },
    []
  )

  // ── confirm a pending transition (user clicked "Confirm" in the modal) ──────
  const handleTransitionConfirm = useCallback(async (justification?: string) => {
    const pending = pendingTransitionRef.current
    if (!pending) return
    // Clear ref synchronously before the async mutation
    pendingTransitionRef.current = null
    setPendingTransition(null)
    try {
      await updateProjectStatus({ variables: { id: pending.itemId, status: pending.toGroupId } })
      logStatusChange(pending.itemId, pending.fromGroupId, pending.toGroupId, justification)
      // If project is being concluded, auto-complete all its activities
      if (pending.toGroupId === 'CONCLUDED') {
        const proj = localProjects.find((p) => p.id === pending.itemId)
        const activityIds = ((proj?.activitiesData ?? []) as Array<{ id: string }>)
          .map((a) => a.id)
          .filter(Boolean)
        if (activityIds.length > 0) {
          await batchCompleteActivities({ variables: { ids: activityIds, status: 'COMPLETED' } })
        }
      }
      // If project is moving to WAITING_REFUND, fire refund mutation with the selected subsidy
      if (pending.toGroupId === 'WAITING_REFUND' && justification) {
        try {
          const { subsidyId, refundAmount: rawAmount, refundType } = JSON.parse(justification)
          if (subsidyId && rawAmount > 0) {
            console.log(
              `%c[KanbanView] WAITING_REFUND — firing requestSubsidyRefund | subsidyId: ${subsidyId} | amount: ${rawAmount} | type: ${refundType}`,
              "color: #3b82f6; font-weight: bold"
            )
            requestSubsidyRefundMutation({
              variables: {
                id: subsidyId,
                refundAmount: rawAmount,
                refundType: refundType || 'TOTAL',
                reason: 'Refund requested via project status change to WAITING_REFUND',
                language: i18n.language as any,
              },
            })
            const histMsg = `💰 Refund of ${formatCurrency(rawAmount)} requested.`
            createHistory({
              variables: { data: { project_id: pending.itemId, ...buildCommentPayload(histMsg) } },
            })
          }
        } catch {
          console.warn("[KanbanView] WAITING_REFUND: could not parse justification JSON", justification)
        }
      }
    } catch {
      // Revert on error
      setLocalProjects((prev) =>
        prev.map((p) =>
          p.id === pending.itemId ? { ...p, status: pending.fromGroupId } : p
        )
      )
    }
  }, [updateProjectStatus, logStatusChange, localProjects, batchCompleteActivities])

  // ── cancel a pending transition (user clicked "Cancel" in the modal) ────────
  const handleTransitionCancel = useCallback(() => {
    const pending = pendingTransitionRef.current
    if (!pending) return
    // Clear ref synchronously before state update
    pendingTransitionRef.current = null
    setPendingTransition(null)
    // Revert the optimistic move
    setLocalProjects((prev) =>
      prev.map((p) =>
        p.id === pending.itemId ? { ...p, status: pending.fromGroupId } : p
      )
    )
  }, [])

  // ── save handler (fires after optimistic move) ─────────────────────────────
  const handleSaveChanges = useCallback(
    async (
      changes: Array<{ itemId: string; fromGroupId: string; toGroupId: string }>
    ) => {
      for (const { itemId, fromGroupId, toGroupId } of changes) {
        // Skip changes that are pending confirmation — the modal confirm handler saves them
        const pending = pendingTransitionRef.current
        if (pending?.itemId === itemId && pending?.toGroupId === toGroupId) continue

        // Guard: concluded projects cannot be moved
        if (fromGroupId === "CONCLUDED") {
          toast.error(
            t.status?.cannotModifyConcluded ?? "Cannot modify a concluded project"
          )
          // Revert
          setLocalProjects((prev) =>
            prev.map((p) =>
              p.id === itemId ? { ...p, status: fromGroupId } : p
            )
          )
          continue
        }

        try {
          await updateProjectStatus({
            variables: { id: itemId, status: toGroupId },
          })
          logStatusChange(itemId, fromGroupId, toGroupId)
        } catch {
          // Revert on error
          setLocalProjects((prev) =>
            prev.map((p) =>
              p.id === itemId ? { ...p, status: fromGroupId } : p
            )
          )
        }
      }
    },
    [updateProjectStatus, logStatusChange, t]
  )

  // ── actions ──────────────────────────────────────────────────────────────────
  const kanbanActions: KanbanAction[] = useMemo(
    () => [
      {
        id: "quick-view",
        label: t.table?.details ?? "Details",
        icon: Info,
        showInItem: true,
        onClick: (_group, item) => {
          if (!item) return
          const proj = localProjects.find((p) => p.id === item.id)
          if (proj && onQuickView) onQuickView(proj)
        },
      },
      {
        id: "open",
        label: t.viewProject ?? "Open Project",
        icon: ExternalLink,
        showInItem: true,
        onClick: (_group, item) => {
          if (!item) return
          const proj = localProjects.find((p) => p.id === item.id)
          if (proj && onView) {
            onView(proj)
          } else if (proj) {
            router.push(`/projects/${proj.id}`)
          }
        },
      },
    ],
    [localProjects, onView, onQuickView, router, t]
  )

  // ── custom item renderer ─────────────────────────────────────────────────────
  const renderKanbanItem = (
    item: KanbanItem,
    group: KanbanGroup,
    dragHandlers?: any
  ) => {
    const daysLeft = item.metadata?.daysLeft as number
    const isExpired = daysLeft < 0
    const isUrgent = daysLeft >= 0 && daysLeft <= 7
    const isUserMember = !!item.metadata?.isUserMember
    const isUserOwner = !!item.metadata?.isUserOwner
    const avatarUsers: UserAvatarData[] = (item.metadata?.avatarUsers as UserAvatarData[]) ?? []
    const ownerId = item.metadata?.ownerId as string | undefined
    const coOwnerId = item.metadata?.coOwnerId as string | undefined

    const daysLabel =
      daysLeft < 0
        ? (t.table?.daysOverdue ?? "-{{days}}d").replace(
            "{{days}}",
            Math.abs(daysLeft).toString()
          )
        : daysLeft === 0
        ? (t.table?.today ?? "Today")
        : (t.table?.daysRemaining ?? "{{days}}d").replace(
            "{{days}}",
            daysLeft.toString()
          )

    const daysColor = isExpired
      ? "text-red-600 dark:text-red-400"
      : isUrgent
      ? "text-orange-600 dark:text-orange-400"
      : "text-muted-foreground"

    return (
      <div
        {...dragHandlers}
        className={[
          "bg-card border border-l-4 border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer mb-2 last:mb-0 group",
          !isUserMember ? "opacity-50" : "",
        ].join(" ").trim()}
        style={{ borderLeftColor: group.color }}
        onClick={(e) => {
          if (
            (e.target as HTMLElement).closest("button") ||
            (e.target as HTMLElement).closest('[role="button"]')
          )
            return
          const proj = localProjects.find((p) => p.id === item.id)
          if (proj && onView) {
            onView(proj)
          } else if (proj) {
            router.push(`/projects/${proj.id}`)
          }
        }}
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: group.color + "22" }}
            >
              <Folder className="w-3 h-3" style={{ color: group.color }} />
            </div>
            <p className="text-sm font-semibold leading-tight line-clamp-2">
              {item.title}
            </p>
          </div>

          {/* Actions dropdown — visible only to members */}
          {isUserMember && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              {kanbanActions
                .filter((a) => a.showInItem)
                .map((action) => {
                  const Icon = action.icon
                  return (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick(group, item)
                      }}
                      className={
                        action.variant === "destructive"
                          ? "text-destructive"
                          : ""
                      }
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </DropdownMenuItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>

        {/* Department */}
        {item.description && (
          <div className="flex items-center gap-1 mb-2">
            <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              {item.description}
            </span>
          </div>
        )}

        {/* Collaborator avatars (owner + co-owner first, then others) */}
        {avatarUsers.length > 0 && (
          <div className="mb-2">
            <UsersAvatarGroup
              users={avatarUsers}
              maxDisplay={3}
              size="sm"
              showLabel={false}
              showAddButton={false}
              ownerUserId={ownerId}
              coOwnerUserId={coOwnerId}
            />
          </div>
        )}

        {/* Footer row: budget + activities + days left */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          {/* Budget — visible only to the project owner */}
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-muted-foreground" />
            {isUserOwner ? (
              <span className="text-xs font-medium text-foreground">
                {item.metadata?.budget as string}
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground select-none blur-sm">
                ••••
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Activities count */}
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {item.metadata?.activities as number}
              </span>
            </div>

            {/* Days left / overdue */}
            <div className={`flex items-center gap-1 ${daysColor}`}>
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs font-medium whitespace-nowrap">
                {daysLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Resolve project title and activities for the modal
  const pendingProjectTitle = pendingTransition
    ? localProjects.find((p) => p.id === pendingTransition.itemId)?.title
    : undefined

  const pendingProjectActivities = React.useMemo(() => {
    if (!pendingTransition) return []
    const proj = localProjects.find((p) => p.id === pendingTransition.itemId)
    const acts = (proj?.activitiesData ?? []) as Array<{ id: string; name: string; status?: string }>
    return acts.map((a) => ({ id: a.id, name: a.name, status: a.status }))
  }, [pendingTransition, localProjects])

  return (
    <>
      <KanbanBoard
        groups={kanbanGroups}
        items={kanbanItems}
        actions={kanbanActions}
        moveRules={moveRules}
        enableDragDrop
        onItemMove={handleItemMove}
        onSaveChanges={handleSaveChanges}
        renderItem={renderKanbanItem}
        className="min-h-[600px]"
      />

      {/* Status transition confirmation modal */}
      <KanbanStatusTransitionModal
        isOpen={!!pendingTransition}
        fromStatus={pendingTransition?.fromGroupId ?? ""}
        toStatus={pendingTransition?.toGroupId ?? ""}
        projectTitle={pendingProjectTitle}
        activities={pendingProjectActivities}
        currencySymbol={selectedCurrency.symbol}
        subsidyRequests={pendingTransition?.toGroupId === 'WAITING_REFUND' ? pendingTransitionSubsidies : undefined}
        isLoadingSubsidies={loadingTransitionSubsidies}
        onConfirm={handleTransitionConfirm}
        onCancel={handleTransitionCancel}
      />
    </>
  )
}
