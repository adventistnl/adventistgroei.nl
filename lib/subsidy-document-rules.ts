/**
 * lib/subsidy-document-rules.ts
 *
 * Factory for Subsidy-Request document (receipt) permission rules.
 *
 * Follows the same pattern as `lib/subsidy-kanban-rules.ts`:
 *   1. Declare a context interface (what the consumer must supply).
 *   2. Export a `createSubsidyDocumentRules(ctx)` factory that returns
 *      a ready-to-use `SubsidyDocumentPermissions` object.
 *
 * ─── Usage ─────────────────────────────────────────────────────────────────
 *
 *   const documentPerms = React.useMemo(() =>
 *     createSubsidyDocumentRules({
 *       isFinanceUser,
 *       isProjectOwner,
 *       isOwnerOrLeader,
 *       isRequester,
 *       currentStatus: activeSubsidy?.status || 'pending',
 *     }),
 *     [isFinanceUser, isProjectOwner, isOwnerOrLeader, isRequester, activeSubsidy?.status]
 *   )
 *
 * To change business rules, edit ONLY `createSubsidyDocumentRules` below.
 *
 * ─── Business rules (current configuration) ────────────────────────────────
 *
 * | Action          | Finance | Owner | Leader | Requester |
 * |-----------------|---------|-------|--------|-----------|
 * | validate ✅     |   ✅   |  ❌   |   ❌   |    ❌     |
 * | reject ✗        |   ✅   |  ❌   |   ❌   |    ❌     |
 * | delete 🗑       |   ✅   |  ✅   |   ❌   |    ❌     |
 * | upload 📎       |   ❌   |  ✅   |   ✅   |    ✅     |
 * | comment 💬      |   ✅   |  ✅   |   ✅   |    ✅     |
 * | unlink activity |   ❌   |  ✅   |   ❌   |    ❌     |
 *
 * Rationale:
 * - The **Institutional Leader** (Owner / Department Leader) is responsible for
 *   approving the SUBSIDY itself (status transitions in the Kanban).
 * - The **Finance Manager** is the internal approver of individual DOCUMENTS —
 *   they validate that receipts/invoices are correct before the subsidy closes.
 * - All actions are blocked when the subsidy is in a fully-locked status ('closed').
 */

// ─── Context interface ────────────────────────────────────────────────────────

export interface SubsidyDocumentRuleContext {
  /** True if logged-in user belongs to the Finance team */
  isFinanceUser: boolean
  /** True if logged-in user is the Project Owner of this subsidy */
  isProjectOwner: boolean
  /** True if logged-in user is the Project Owner OR Department Leader */
  isOwnerOrLeader: boolean
  /** True if logged-in user submitted the request */
  isRequester: boolean
  /** Current subsidy status (lowercase, e.g. 'pending', 'approved') */
  currentStatus: string
}

// ─── Permissions output ───────────────────────────────────────────────────────

export interface SubsidyDocumentPermissions {
  /** Can approve (validate ✅) a receipt/document */
  canValidate: boolean
  /** Can reject (✗) a receipt/document */
  canReject: boolean
  /** Can delete a receipt/document */
  canDelete: boolean
  /** Can upload new documents to an activity */
  canUpload: boolean
  /** Can post messages/comments */
  canComment: boolean
  /** Can unlink an activity from an ADVANCE subsidy */
  canUnlinkActivity: boolean
}

// ─── Locked statuses ──────────────────────────────────────────────────────────

/**
 * Statuses where ALL document mutations are blocked.
 * Note: 'advanced_closed' is intentionally excluded because it still expects
 * the requester to upload receipt documents before the subsidy can close.
 */
export const DOCUMENT_LOCKED_STATUSES = ['closed'] as const

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Returns a `SubsidyDocumentPermissions` object for the given context.
 * All permission logic is centralised here — no scattered `useMemo` checks.
 */
export function createSubsidyDocumentRules(
  ctx: SubsidyDocumentRuleContext
): SubsidyDocumentPermissions {
  const isLocked = (DOCUMENT_LOCKED_STATUSES as readonly string[]).includes(ctx.currentStatus)

  return {
    // ── Validate / Reject ────────────────────────────────────────────────────
    // Only Finance can internally approve/reject individual documents.
    // Owner/Leader approves the SUBSIDY (status), not individual receipts.
    canValidate: ctx.isFinanceUser && !isLocked,
    canReject:   ctx.isFinanceUser && !isLocked,

    // ── Delete ───────────────────────────────────────────────────────────────
    // Finance removes incorrect documents after validation.
    // Project Owner may also remove wrong documents before Finance review.
    canDelete: (ctx.isFinanceUser || ctx.isProjectOwner) && !isLocked,

    // ── Upload ───────────────────────────────────────────────────────────────
    // Requester, Project Owner, and Department Leader submit receipts/invoices.
    // Finance does NOT upload — they only validate what was submitted.
    canUpload: (ctx.isRequester || ctx.isOwnerOrLeader) && !isLocked,

    // ── Comment ──────────────────────────────────────────────────────────────
    // All roles can add comments and status messages at any time.
    canComment: true,

    // ── Unlink Activity (ADVANCE subsidies) ──────────────────────────────────
    // Only the Project Owner may unlink an activity (structural change to subsidy).
    canUnlinkActivity: ctx.isProjectOwner && !isLocked,
  }
}
