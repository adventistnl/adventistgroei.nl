// ─── Enum ─────────────────────────────────────────────────────────────────────
export enum ProjectHistoryType {
  COMMENT = "COMMENT",
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  BUDGET_UPDATED = "BUDGET_UPDATED",
  DEADLINE_UPDATED = "DEADLINE_UPDATED",
  OWNER_CHANGED = "OWNER_CHANGED",
  CO_OWNER_UPDATED = "CO_OWNER_UPDATED",
  DEPARTMENT_CHANGED = "DEPARTMENT_CHANGED",
  ACTIVITY_CREATED = "ACTIVITY_CREATED",
  ACTIVITY_UPDATED = "ACTIVITY_UPDATED",
  ACTIVITY_DELETED = "ACTIVITY_DELETED",
  SUBSIDY_CREATED = "SUBSIDY_CREATED",
  SUBSIDY_UPDATED = "SUBSIDY_UPDATED",
  SUBSIDY_DELETED = "SUBSIDY_DELETED",
  SUBSIDY_APPROVED = "SUBSIDY_APPROVED",
  SUBSIDY_REJECTED = "SUBSIDY_REJECTED",
  DELETED = "DELETED",
  RESTORED = "RESTORED",
  /**
   * Raised when a reviewer moves a project to ADJUSTMENTS_NEEDED and provides
   * a written justification of what needs to be corrected.
   *
   * metadata.adjustment_id  — same as entry.id (set by the server or optimistic cache)
   * comment                 — the reviewer-supplied justification text
   */
  ADJUSTMENT_NEEDED = "ADJUSTMENT_NEEDED",
  /**
   * Posted when the project owner acknowledges that the required adjustments
   * have been addressed and moves the project forward.
   *
   * metadata.resolves_adjustment_id — id of the ADJUSTMENT_NEEDED entry it closes
   */
  ADJUSTMENT_RESOLVED = "ADJUSTMENT_RESOLVED",
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface ProjectHistoryUser {
  id: string
  name: string
}

export interface ProjectHistoryAdjustmentTask {
  id: string
  title: string
  completed: boolean
  position: number
}

export interface ProjectHistoryAdjustmentRef {
  id: string
  status: string
  tasks?: ProjectHistoryAdjustmentTask[]
}

export interface ProjectHistoryEntry {
  id: string
  type: ProjectHistoryType
  comment?: string | null
  field_name?: string | null
  old_value?: string | null
  new_value?: string | null
  metadata?: Record<string, any> | null
  created_at: string
  user: ProjectHistoryUser
  /** Populated when type === ADJUSTMENT_NEEDED — links to the actual ProjectAdjustment entity */
  adjustment?: ProjectHistoryAdjustmentRef | null
}

export interface ProjectHistoryCreateInput {
  project_id: string
  type: ProjectHistoryType
  comment?: string
  field_name?: string
  old_value?: string
  new_value?: string
  metadata?: Record<string, any>
}
