import type { ProjectActivityData } from "@/components/projects/project-activities-table"
import type { SubsidyRequestItem, UploadedDocument } from "@/types/subsidy-request-modal.types"

// ─── Funding policies ─────────────────────────────────────────────────────────
export const FUNDING_POLICIES = {
  max_institution_percent: 65,
  max_institution_amount: 5000,
  min_church_percent: 35,
  default_church_percent: 35,
  default_institution_percent: 65,
}

// ─── File type detection ───────────────────────────────────────────────────────
export function getFileType(filename: string): "PDF" | "JPG" | "PNG" | "DOC" | "OTHER" {
  const ext = filename.split(".").pop()?.toUpperCase()
  if (ext === "PDF" || ext === "JPG" || ext === "PNG" || ext === "DOC") {
    return ext as "PDF" | "JPG" | "PNG" | "DOC"
  }
  return "OTHER"
}

// ─── Document type mapping ─────────────────────────────────────────────────────
export function mapDocumentTypeToApi(documentType: UploadedDocument["document_type"]): string {
  const map: Record<UploadedDocument["document_type"], string> = {
    INVOICE: "invoice",
    RECEIPT: "receipt",
    CONTRACT: "contract",
    PROOF_OF_PAYMENT: "proof_of_payment",
    OTHER: "other",
  }
  return map[documentType]
}

export function mapActivityDocumentType(type: string): UploadedDocument["document_type"] {
  const map: Record<string, UploadedDocument["document_type"]> = {
    invoice: "INVOICE",
    receipt: "RECEIPT",
    contract: "CONTRACT",
    proof_of_payment: "PROOF_OF_PAYMENT",
  }
  return map[type] ?? "OTHER"
}

// ─── Activity to item mapper (used when adding activities to a request) ────────
export function mapActivityToItem(
  activity: ProjectActivityData,
  availableBudget: number,
): SubsidyRequestItem {
  const preFilledAmount =
    activity.institution_requested_amount && activity.institution_requested_amount > 0
      ? Math.min(activity.institution_requested_amount, availableBudget)
      : 0

  const existingDocs: UploadedDocument[] = (activity.activity_documents || []).map((doc) => ({
    id: doc.id,
    file_name: doc.filename,
    file_type: getFileType(doc.filename),
    document_type: mapActivityDocumentType(doc.type),
    amount: 0,
    file_url: doc.file_url,
    isExpanded: false,
    origin: "ACTIVITY" as const,
  }))

  return {
    activity_id: activity.id,
    activity_name: activity.name,
    requested_amount: preFilledAmount,
    budget_amount: activity.budget_amount,
    institution_requested_amount: activity.institution_requested_amount,
    activity_documents: existingDocs,
    notes: "",
  }
}

// ─── Item from create-mode selected activities ────────────────────────────────
export function mapSelectedActivityToItem(activity: ProjectActivityData): SubsidyRequestItem {
  const existingDocs: UploadedDocument[] = (activity.activity_documents || []).map((doc) => ({
    id: doc.id,
    file_name: doc.filename,
    file_type: getFileType(doc.filename),
    document_type: mapActivityDocumentType(doc.type),
    amount: 0,
    file_url: doc.file_url,
    isExpanded: false,
    origin: "ACTIVITY" as const,
  }))

  return {
    activity_id: activity.id,
    activity_name: activity.name,
    requested_amount: activity.institution_requested_amount || 0,
    budget_amount: activity.budget_amount,
    institution_requested_amount: activity.institution_requested_amount,
    activity_documents: existingDocs,
    notes: "",
  }
}
