/**
 * project-kanban-rules.ts
 *
 * Centralised, declarative rule definitions for the Project Kanban board.
 *
 * ─── How to add a new rule ───────────────────────────────────────────────────
 *
 *   1. Add an entry to STATUS_TRANSITION_RULES below.
 *      Each entry needs three fields:
 *
 *        blocksGroup  — the target column ID that should be blocked
 *        reason       — a short camelCase key (used for error messages in the view)
 *        isBlocked    — (proj) => boolean  ← pure function, no side effects
 *
 *   2. That's it. No changes needed in kanban-board.tsx or project-kanban-view.tsx.
 *
 * ─── How to remove or temporarily disable a rule ────────────────────────────
 *
 *   Comment out or delete the entry from STATUS_TRANSITION_RULES.
 *
 * ─── How error messages are resolved ────────────────────────────────────────
 *
 *   project-kanban-view.tsx reads `rule.reason` from `getProjectBlockedRule()`
 *   and maps it to a translation key. Add the new key to
 *   lib/translations/projects.ts → `statusTransitions` block for all 3 languages.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *
 *   const moveRules = createProjectKanbanMoveRules({ userId: user.id, projects: localProjects })
 *   <KanbanBoard moveRules={moveRules} ... />
 */

import type { KanbanItem, KanbanMoveRule } from "@/components/ui/kanban-board"
import type { ProjectTableData } from "@/components/projects/projects-table"

// ─── Context ──────────────────────────────────────────────────────────────────

export interface ProjectKanbanRuleContext {
  /** Current authenticated user's ID */
  userId: string
  /** Optional: skip all restrictions for admin/dev roles */
  isAdmin?: boolean
  /** Currently loaded projects — used to compute per-card move validity instantly */
  projects?: ProjectTableData[]
}

// ─── Status order ─────────────────────────────────────────────────────────────

export const STATUS_ORDER = [
  "DRAFT",
  "OPEN_REQUEST",
  "IN_REVIEW",
  "ADJUSTMENTS_NEEDED",
  "IN_PROGRESS",
  "PENDING_RECEIPT",
  "WAITING_REFUND",
  "CONCLUDED",
  "OVERDUE",
] as const

export type ProjectStatus = typeof STATUS_ORDER[number]

// ─── Allowed Transitions (Synced with Backend) ───────────────────────────────
export const PROJECT_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['OPEN_REQUEST'],
  OPEN_REQUEST: ['IN_REVIEW', 'ADJUSTMENTS_NEEDED', 'IN_PROGRESS'],
  IN_REVIEW: ['IN_PROGRESS', 'ADJUSTMENTS_NEEDED'],
  ADJUSTMENTS_NEEDED: ['OPEN_REQUEST', 'IN_REVIEW'],
  IN_PROGRESS: ['PENDING_RECEIPT', 'WAITING_REFUND', 'OVERDUE', 'CONCLUDED'],
  PENDING_RECEIPT: ['WAITING_REFUND', 'OVERDUE', 'CONCLUDED'],
  WAITING_REFUND: ['CONCLUDED', 'OVERDUE'],
  OVERDUE: ['CONCLUDED'],
  CONCLUDED: []
};

// ─── Rule table ───────────────────────────────────────────────────────────────

/**
 * A single declarative transition rule.
 *
 * @field blocksGroup  - Target column ID this rule blocks.
 * @field reason       - camelCase key mapped to an error message in the view.
 * @field isBlocked    - Pure predicate; return `true` to block the move.
 */
export interface StatusTransitionRule {
  blocksGroup: string
  reason: string
  isBlocked: (proj: ProjectTableData) => boolean
}

/**
 * ─── ADD NEW RULES HERE ───────────────────────────────────────────────────────
 *
 * Order does not matter. Each rule is evaluated independently.
 */
export const STATUS_TRANSITION_RULES: StatusTransitionRule[] = [
  // ── No regression past OPEN_REQUEST ─────────────────────────────────────────
  {
    blocksGroup: "DRAFT",
    reason: "noRegressionPastOpenRequest",
    isBlocked: (proj) => {
      const idx = STATUS_ORDER.indexOf((proj.status ?? "DRAFT") as ProjectStatus)
      return idx >= STATUS_ORDER.indexOf("OPEN_REQUEST")
    },
  },

  // ── WAITING_REFUND requires at least one subsidy request ─────────────────────
  {
    blocksGroup: "WAITING_REFUND",
    reason: "noSubsidiesForRefund",
    isBlocked: (proj) => (proj.subsidyRequests ?? 0) === 0,
  },

  // ── CONCLUDED requires all activities to be completed ────────────────────────
  {
    blocksGroup: "CONCLUDED",
    reason: "incompleteActivities",
    isBlocked: (proj) => {
      const acts = (proj.activitiesData ?? []) as Array<{ status?: string }>
      return (
        acts.length > 0 &&
        acts.some((a) => (a.status ?? "").toUpperCase() !== "COMPLETED")
      )
    },
  },

  // ── Add more rules below this line ───────────────────────────────────────────
  // Example:
  // {
  //   blocksGroup: "IN_REVIEW",
  //   reason: "missingDocuments",
  //   isBlocked: (proj) => (proj.documents ?? 0) === 0,
  // },
]

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Returns all group IDs that `proj` cannot move into, based on the rule table.
 * Uses only already-loaded project data — no network requests.
 *
 * @example
 * const invalid = getProjectInvalidGroups(project)  // ["DRAFT", "CONCLUDED"]
 */
export function getProjectInvalidGroups(proj: ProjectTableData): string[] {
  const currentStatus = (proj.status || "DRAFT") as string;
  const allowed = PROJECT_TRANSITIONS[currentStatus] || [];
  
  const invalidGroups = new Set<string>();

  // Block states not allowed by the backend state machine
  STATUS_ORDER.forEach(status => {
    if (status !== currentStatus && !allowed.includes(status)) {
      invalidGroups.add(status);
    }
  });

  // Block states disallowed by specific business rules
  STATUS_TRANSITION_RULES.forEach((rule) => {
    if (rule.isBlocked(proj)) {
      invalidGroups.add(rule.blocksGroup);
    }
  });

  return Array.from(invalidGroups);
}

/**
 * Returns the first matching rule that blocks `proj` from moving to `toGroupId`,
 * or `undefined` if the move is allowed.
 *
 * Useful for resolving a typed error message in the view:
 * @example
 * const rule = getProjectBlockedRule(proj, "WAITING_REFUND")
 * if (rule) toast.error(t.statusTransitions[rule.reason])
 */
export function getProjectBlockedRule(
  proj: ProjectTableData,
  toGroupId: string
): StatusTransitionRule | undefined {
  const currentStatus = (proj.status || "DRAFT") as string;
  const allowed = PROJECT_TRANSITIONS[currentStatus] || [];
  
  if (toGroupId !== currentStatus && !allowed.includes(toGroupId)) {
    return {
      blocksGroup: toGroupId,
      reason: "invalidTransition",
      isBlocked: () => true
    }
  }

  return STATUS_TRANSITION_RULES.find(
    (rule) => rule.blocksGroup === toGroupId && rule.isBlocked(proj)
  )
}

// ─── Named drag/drop rule atoms ───────────────────────────────────────────────

/**
 * RULE: only the project owner can initiate a drag.
 * Reads `item.metadata.isUserOwner` set when building kanban items.
 */
export const onlyOwnerCanDragRule = (
  context: ProjectKanbanRuleContext
): KanbanMoveRule["canDragItem"] => {
  return (item: KanbanItem) => {
    if (context.isAdmin) return true
    return !!item.metadata?.isUserOwner
  }
}

/**
 * RULE: only the project owner can confirm a move, and the destination
 * group must pass all STATUS_TRANSITION_RULES.
 */
export const ownerAndValidDestinationRule = (
  context: ProjectKanbanRuleContext
): KanbanMoveRule["canMove"] => {
  return (_itemId, _from, toGroupId, item) => {
    if (context.isAdmin) return true
    if (!item?.metadata?.isUserOwner) return false
    if (!context.projects) return true
    const proj = context.projects.find((p) => p.id === item.id)
    if (!proj) return true
    return !getProjectInvalidGroups(proj).includes(toGroupId)
  }
}

/** RULE: concluded projects cannot be dragged out of their column. */
export const concludedLockedRule: KanbanMoveRule["disableDragFrom"] = ["CONCLUDED"]

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Composes all project-kanban rules into a single `KanbanMoveRule` object
 * ready to be passed to `<KanbanBoard moveRules={...} />`.
 *
 * To add a new rule, see STATUS_TRANSITION_RULES above.
 */
export function createProjectKanbanMoveRules(
  context: ProjectKanbanRuleContext
): KanbanMoveRule {
  return {
    // ── Group-level guards ───────────────────────────────────────────────────
    disableDragFrom: concludedLockedRule,

    // ── Per-item drag guard ──────────────────────────────────────────────────
    canDragItem: onlyOwnerCanDragRule(context),

    // ── Drop validation ──────────────────────────────────────────────────────
    canMove: ownerAndValidDestinationRule(context),

    // ── Visual: grey out invalid columns instantly on drag start ─────────────
    getDisabledGroupsForItem: (item: KanbanItem): string[] => {
      if (!item.metadata?.isUserOwner) return []
      if (!context.projects) return []
      const proj = context.projects.find((p) => p.id === item.id)
      if (!proj) return []
      return getProjectInvalidGroups(proj)
    },
  }
}
