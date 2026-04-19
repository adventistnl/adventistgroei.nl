// ─── Enums ────────────────────────────────────────────────────────────────────

export enum AdjustmentStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface AdjustmentTask {
  id: string
  adjustment_id: string
  title: string
  completed: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface AdjustmentHistoryUser {
  id: string
  name: string
}

export interface AdjustmentProjectHistory {
  id: string
  project_id: string
  comment?: string | null
  created_at: string
  user: AdjustmentHistoryUser
}

export interface ProjectAdjustment {
  id: string
  status: AdjustmentStatus
  created_at: string
  updated_at: string
  project_history?: AdjustmentProjectHistory | null
  tasks?: AdjustmentTask[]
}

// ─── Mutation inputs ──────────────────────────────────────────────────────────

export interface CreateAdjustmentInput {
  project_id: string
  comment?: string
  tasks?: { title: string; position?: number }[]
}

export interface UpdateAdjustmentStatusInput {
  id: string
  status: AdjustmentStatus
}

export interface AddAdjustmentTaskInput {
  adjustment_id: string
  title: string
  position?: number
}

export interface ToggleAdjustmentTaskInput {
  task_id: string
  completed: boolean
}
