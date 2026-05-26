/**
 * lib/subsidy-kanban-rules.ts
 *
 * Factory for Subsidy-Request Kanban move rules.
 *
 * Follows the same pattern as `lib/project-kanban-rules.ts`:
 *   1. Declare a context interface (what the consumer must supply).
 *   2. Export a `createSubsidyKanbanMoveRules(ctx)` factory that returns
 *      a ready-to-use `KanbanMoveRule` object.
 *
 * ─── Usage ─────────────────────────────────────────────────────────────────
 *
 *   const { canChangeStatus, getStatusChangeError } = useSubsidyStatusRules()
 *   const moveRules = useMemo(
 *     () => createSubsidyKanbanMoveRules({
 *       isFinanceUser,
 *       canApproveSubsidy,
 *       canManagePostApproved,
 *       canChangeStatus,
 *       getStatusError: getStatusChangeError,
 *     }),
 *     [isFinanceUser, canApproveSubsidy, canManagePostApproved, canChangeStatus, getStatusChangeError]
 *   )
 *
 * To change business rules, edit SUBSIDY_TRANSITIONS in
 * `hooks/use-subsidy-status-rules.ts` — no need to touch this file.
 */

import type { KanbanItem, KanbanMoveRule } from "@/components/ui/kanban-board"
import type { SubsidyStatusContext, UserRoleContext } from "@/hooks/use-subsidy-status-rules"

// ─── All possible status column IDs ──────────────────────────────────────────

export const ALL_SUBSIDY_STATUSES = [
  "pending",
  "in_review",
  "approved",
  "rejected",
  "advanced_closed",
  "waiting_documents",
  "waiting_refund",
  "closed",
] as const

export type SubsidyKanbanStatus = (typeof ALL_SUBSIDY_STATUSES)[number]

/** Statuses from which a card cannot be dragged by anyone */
export const LOCKED_DRAG_STATUSES: SubsidyKanbanStatus[] = ["closed"]

// ─── Context interface ────────────────────────────────────────────────────────

export interface SubsidyKanbanRuleContext {
  /** True if the logged-in user belongs to the Finance team */
  isFinanceUser: boolean
  /**
   * Returns true if the logged-in user may act on pre-approved subsidies
   * (i.e. is the project owner OR department leader).
   */
  canApproveSubsidy: (subsidy: any) => boolean
  /**
   * Returns true if the logged-in user may act on post-approved subsidies
   * (typically only Finance users).
   */
  canManagePostApproved: (subsidy: any) => boolean
  /**
   * State-machine + role validation.
   * Matches `useSubsidyStatusRules().canChangeStatus`.
   */
  canChangeStatus: (
    from: string,
    to: string,
    ctx: SubsidyStatusContext,
    roleCtx: UserRoleContext
  ) => boolean
  /**
   * Returns a human-readable error string when a transition is blocked, or null.
   * Matches `useSubsidyStatusRules().getStatusChangeError`.
   */
  getStatusError: (
    from: string,
    to: string,
    ctx: SubsidyStatusContext,
    roleCtx: UserRoleContext
  ) => string | null
}

// ─── Internal helper ──────────────────────────────────────────────────────────

function buildStatusContext(subsidy: any): {
  statusCtx: SubsidyStatusContext
  roleCtxFor: (ctx: SubsidyKanbanRuleContext) => UserRoleContext
} {
  const hasPending = (subsidy.receipts ?? []).some(
    (r: any) => !r.is_validated && !r.is_deleted
  )
  const hasRejected = (subsidy.receipts ?? []).some(
    (r: any) => r.is_validated && !r.approved && !r.is_deleted
  )
  return {
    statusCtx: {
      is_for_advance: subsidy.is_for_advance,
      have_refund: subsidy.have_refund,
      refund_done: subsidy.refund_done,
      hasPendingDocuments: hasPending,
      hasRejectedDocuments: hasRejected,
    },
    roleCtxFor: (ctx) => ({
      isFinanceUser: ctx.isFinanceUser,
      isOwnerOrLeader: ctx.canApproveSubsidy(subsidy),
    }),
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Returns a `KanbanMoveRule` object for any Subsidy-Request kanban.
 * Pass the result directly to `<KanbanBoard moveRules={...} />`.
 */
export function createSubsidyKanbanMoveRules(
  ctx: SubsidyKanbanRuleContext
): KanbanMoveRule {
  return {
    // ── 1. Hard lock: "closed" items cannot be dragged by anyone ─────────────
    disableDragFrom: LOCKED_DRAG_STATUSES,

    // ── 2. Per-item drag guard (role-based) ──────────────────────────────────
    canDragItem: (item: KanbanItem): boolean => {
      const subsidy = item.metadata?.subsidyData
      if (!subsidy) return true

      const from = item.groupId

      // Finance users can initiate a drag on any non-locked item
      if (ctx.isFinanceUser) return true

      // Pre-approved: only project owner / department leader
      if (["pending", "in_review"].includes(from)) {
        return ctx.canApproveSubsidy(subsidy)
      }

      // Post-approved: only Finance (already handled above → deny for others)
      if (
        ["approved", "advanced_closed", "waiting_documents", "waiting_refund", "rejected"].includes(from)
      ) {
        return ctx.canManagePostApproved(subsidy)
      }

      return true
    },

    // ── 3. Drop validation: state-machine + role check ───────────────────────
    canMove: (itemId, fromGroupId, toGroupId, item): boolean => {
      const subsidy = item?.metadata?.subsidyData
      if (!subsidy) return true
      const { statusCtx, roleCtxFor } = buildStatusContext(subsidy)
      return ctx.canChangeStatus(fromGroupId, toGroupId, statusCtx, roleCtxFor(ctx))
    },

    // ── 4. Human-readable error for blocked drops ─────────────────────────────
    getCanMoveErrorMessage: (itemId, fromGroupId, toGroupId, item): string | undefined => {
      const subsidy = item?.metadata?.subsidyData
      if (!subsidy) return undefined
      const { statusCtx, roleCtxFor } = buildStatusContext(subsidy)
      return ctx.getStatusError(fromGroupId, toGroupId, statusCtx, roleCtxFor(ctx)) ?? undefined
    },

    // ── 5. Visual: grey out invalid target columns instantly on drag start ────
    getDisabledGroupsForItem: (item: KanbanItem): string[] => {
      const subsidy = item.metadata?.subsidyData
      if (!subsidy) return []
      const { statusCtx, roleCtxFor } = buildStatusContext(subsidy)
      const roleCtx = roleCtxFor(ctx)
      return ALL_SUBSIDY_STATUSES.filter((status) => {
        if (status === item.groupId) return false // current column is always valid
        return !ctx.canChangeStatus(item.groupId, status, statusCtx, roleCtx)
      })
    },
  }
}
