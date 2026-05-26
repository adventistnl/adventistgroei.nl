import type { ProjectActivityData } from "@/components/projects/project-activities-table"

// ─── Request type ──────────────────────────────────────────────────────────────
export type RequestType = "advance" | "without_document" | "with_document"

// ─── Document ─────────────────────────────────────────────────────────────────
export interface UploadedDocument {
  id: string
  file_name: string
  file_type: "PDF" | "JPG" | "PNG" | "DOC" | "OTHER"
  document_type: "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER"
  amount: number
  file_url: string
  isExpanded?: boolean
  origin?: "NEW" | "ACTIVITY" | "EXISTING_RECEIPT"
}

// ─── Item (activity + documents) ──────────────────────────────────────────────
export interface SubsidyRequestItem {
  activity_id: string
  activity_name: string
  requested_amount: number
  budget_amount: number
  /** Original institution-approved amount from the funding plan (used for MAX button) */
  institution_requested_amount?: number
  activity_documents: UploadedDocument[]
  notes: string
  existing_receipt_updates?: {
    receipt_id: string
    amount: number
    type: string
  }[]
}

// ─── Submitted form data ───────────────────────────────────────────────────────
export interface SubsidyRequestData {
  institution_id: string
  department_id?: string
  church_id?: string
  project_id: string
  requested_amount: number
  is_for_advance?: boolean
  request_type?: "WITH_DOCUMENT" | "WITHOUT_DOCUMENT" | "ADVANCE"
  advance_amount?: number
  notes: string
  items: SubsidyRequestItem[]
  /** Backend field available when editing an existing request */
  requester_id?: string
}

// ─── Modal props ───────────────────────────────────────────────────────────────
export interface RequestSubsidyModalProps {
  isOpen: boolean
  onClose: () => void
  selectedActivities: ProjectActivityData[]
  projectId: string
  institutionId?: string
  departmentId?: string
  churchId?: string
  churchDepartmentId?: string
  institutionName?: string
  departmentName?: string
  churchName?: string
  churchDepartmentName?: string
  departmentAllocatedBudget?: number
  departmentBudgetUsed?: number
  departmentBudgetYear?: number
  subsidyRequestId?: string
  onSubmit: (data: SubsidyRequestData) => Promise<string | void>
  allActivities?: ProjectActivityData[]
  initialData?: Partial<SubsidyRequestData> | null
  mode?: "create" | "edit"
  subsidizedActivityIds?: string[]
  availableBudget?: number
  subsidizedBudget?: number
  projectName?: string
  initialRequestType?: RequestType
  onAdvanceSubmit?: (advanceAmount: number) => Promise<void>
  totalAlreadyRequested?: number
  /** Current status of the subsidy request — locks the modal to read-only for terminal/locked statuses */
  subsidyRequestStatus?: string
  /** Called after the subsidy request is successfully deleted */
  onDeleteRequest?: () => void
  /** Project owner's user ID — used together with user identity to determine delete eligibility */
  projectOwnerId?: string
  /** Project co-owner's user ID — used together with user identity to determine delete eligibility */
  projectCoOwnerId?: string
}
