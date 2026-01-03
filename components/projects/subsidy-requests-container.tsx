"use client"

import * as React from "react"
import { Plus, Inbox } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { SubsidyRequestCard, SubsidyRequestCardData } from "./subsidy-request-card"
import { ViewSubsidyModal } from "@/components/modals/project/view-subsidy-modal"
import { RequestSubsidyModal, SubsidyRequestData as SubsidyRequestFormData } from "@/components/modals/project/request-subsidy-modal"
import { useSubsidyReceipts, SubsidyReceipt } from "@/hooks/use-subsidy-receipts"
import { cn } from "@/lib/utils"
import type { ProjectActivityData } from "@/components/projects/project-activities-table"

interface SubsidyRequestsContainerProps {
  /** Array of subsidy request data */
  subsidies: SubsidyRequestCardData[]
  /** Callback when "Add Subsidy" button is clicked */
  onAddSubsidy?: () => void
  /** Callback when a card's edit action is triggered */
  onEditSubsidy?: (id: string) => void
  /** Callback when a card's delete action is triggered */
  onDeleteSubsidy?: (id: string) => void
  /** Callback when a card's view action is triggered */
  onViewSubsidy?: (id: string) => void
  /** Callback when a card's duplicate action is triggered */
  onDuplicateSubsidy?: (id: string) => void
  /** Callback to update a subsidy request */
  onUpdateSubsidy?: (id: string, data: SubsidyRequestFormData) => Promise<void>
  /** Optional title for the container */
  title?: string
  /** Optional description for the container */
  description?: string
  /** Grid column span (e.g., "col-span-12", "col-span-6") for responsive width control */
  gridColSpan?: string
  /** Optional custom className for the container */
  className?: string
  /** Empty state title override */
  emptyStateTitle?: string
  /** Empty state description override */
  emptyStateDescription?: string
  /** All activities for the project (for adding new items) */
  allActivities?: ProjectActivityData[]
  subsidizedActivityIds?: string[]
  onRefresh?: () => Promise<void>
}

export function SubsidyRequestsContainer({
  subsidies,
  onAddSubsidy,
  onEditSubsidy,
  onDeleteSubsidy,
  onViewSubsidy,
  onDuplicateSubsidy,
  onUpdateSubsidy,
  title,
  description,
  gridColSpan = "col-span-12",
  className,
  emptyStateTitle,
  emptyStateDescription,
  allActivities = [],
  subsidizedActivityIds = [],
  onRefresh,
}: SubsidyRequestsContainerProps) {
  const { t } = useTranslation()
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [selectedSubsidy, setSelectedSubsidy] = React.useState<SubsidyRequestCardData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedSubsidyForEdit, setSelectedSubsidyForEdit] = React.useState<SubsidyRequestCardData | null>(null)
  const [editReceipts, setEditReceipts] = React.useState<SubsidyReceipt[]>([])

  // Hook for fetching receipts
  const { fetchReceipts } = useSubsidyReceipts({
    subsidyRequestId: selectedSubsidyForEdit?.id,
  })

  // Sync selectedSubsidy when props.subsidies changes (e.g. after refresh)
  React.useEffect(() => {
    if (selectedSubsidy) {
      const updated = subsidies.find(s => s.id === selectedSubsidy.id)
      if (updated && updated.status !== selectedSubsidy.status) {
        setSelectedSubsidy({...updated})
      }
    }
  }, [subsidies, selectedSubsidy])

  // Usando dados reais passados via props
  const displaySubsidies = subsidies

  // Default translations
  const defaultTitle = title || t("subsidy.requests", "Solicitações de Subsídio")
  const defaultEmptyTitle = emptyStateTitle || t("subsidy.noRequests", "Nenhuma solicitação de subsídio")
  const defaultEmptyDescription = emptyStateDescription || t("subsidy.noRequestsDescription", "Comece criando uma nova solicitação.")

  // Handlers
  const handleViewSubsidy = (id: string) => {
    // Se existe callback do parent, usar o modal do parent
    if (onViewSubsidy) {
      onViewSubsidy(id)
      return
    }

    // Caso contrário, usar o modal interno do container
    const subsidy = displaySubsidies.find(s => s.id === id)
    if (subsidy) {
      setSelectedSubsidy(subsidy)
      setIsViewModalOpen(true)
    }
  }

  // Delete flow with confirm modal
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)
  const [subsidyPendingDelete, setSubsidyPendingDelete] = React.useState<SubsidyRequestCardData | null>(null)

  const handleRequestDelete = (id: string) => {
    const subsidy = displaySubsidies.find(s => s.id === id)
    if (!subsidy) return
    setSubsidyPendingDelete(subsidy)
    setIsConfirmDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (!subsidyPendingDelete) return
    // Only allow delete if NOT approved or in_review
    if (subsidyPendingDelete.status === "approved" || subsidyPendingDelete.status === "in_review") {
      // show info via toast and close modal
      setIsConfirmDeleteOpen(false)
      setSubsidyPendingDelete(null)
      return
    }

    // Call parent callback to handle actual deletion
    if (onDeleteSubsidy) onDeleteSubsidy(subsidyPendingDelete.id)
    setIsConfirmDeleteOpen(false)
    setSubsidyPendingDelete(null)
  }

  // Archive flow - call parent callback (archive is handled as a delete action)
  const handleArchive = (id: string) => {
    // TODO: Add onArchiveSubsidy callback prop if archive functionality is needed
    console.log('Archive subsidy:', id)
  }

  const handleEditSubsidy = async (id: string) => {
    const subsidy = displaySubsidies.find(s => s.id === id)
    if (subsidy) {
      setSelectedSubsidyForEdit(subsidy)

      // Fetch receipts for this subsidy request (pass ID directly since state hasn't updated yet)
      try {
        const receipts = await fetchReceipts(subsidy.id)
        console.log('📄 Loaded receipts for edit:', receipts)
        setEditReceipts(receipts || [])
      } catch (error) {
        console.error('Error fetching receipts:', error)
        setEditReceipts([])
      }

      setIsEditModalOpen(true)
    }
    if (onEditSubsidy) onEditSubsidy(id)
  }

  // Helper to get file type from filename
  const getFileType = (filename: string): "PDF" | "JPG" | "PNG" | "DOC" | "OTHER" => {
    const ext = filename.split('.').pop()?.toUpperCase()
    if (ext === "PDF" || ext === "JPG" || ext === "PNG" || ext === "DOC") {
      return ext as "PDF" | "JPG" | "PNG" | "DOC"
    }
    return "OTHER"
  }

  // Helper to map receipt type to document type
  const mapReceiptTypeToDocType = (type: string): "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER" => {
    const typeMap: Record<string, "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER"> = {
      'invoice': 'INVOICE',
      'receipt': 'RECEIPT',
      'contract': 'CONTRACT',
      'proof_of_payment': 'PROOF_OF_PAYMENT',
      'image': 'RECEIPT',
      'pdf': 'INVOICE',
    }
    return typeMap[type?.toLowerCase()] || 'OTHER'
  }

  // Build initialData for edit modal using real subsidy items
  const editInitialData = React.useMemo(() => {
    if (!selectedSubsidyForEdit) return null

    // Group receipts by activity_id
    const receiptsByActivity = editReceipts.reduce((acc, receipt) => {
      const activityId = receipt.project_activities_id
      if (!acc[activityId]) {
        acc[activityId] = []
      }
      acc[activityId].push(receipt)
      return acc
    }, {} as Record<string, SubsidyReceipt[]>)

    // Use real items from the subsidy if available
    const items = selectedSubsidyForEdit.items?.map(item => {
      // Get receipts for this activity
      const activityReceipts = receiptsByActivity[item.activity_id] || []

      // Transform receipts to activity_documents format
      const activity_documents = activityReceipts.map(receipt => ({
        id: receipt.id,
        file_name: receipt.filename,
        file_type: getFileType(receipt.filename),
        document_type: mapReceiptTypeToDocType(receipt.type),
        amount: receipt.amount || 0,
        file_url: receipt.file_url,
        isExpanded: false
      }))

      return {
        activity_id: item.activity_id,
        activity_name: item.activity_name,
        requested_amount: item.requested_amount,
        budget_amount: item.budget_amount,
        activity_documents,
        notes: item.notes || ""
      }
    }) || []

    console.log('📝 Building editInitialData:', {
      subsidyId: selectedSubsidyForEdit.id,
      project_id: selectedSubsidyForEdit.project_id,
      institution_id: selectedSubsidyForEdit.institution_id,
      department_id: selectedSubsidyForEdit.department_id,
      church_id: selectedSubsidyForEdit.church_id,
      rawItemsCount: selectedSubsidyForEdit.items?.length || 0,
      rawItems: selectedSubsidyForEdit.items,
      transformedItemsCount: items.length,
      receiptsCount: editReceipts.length,
      itemsWithDocs: items.filter(i => i.activity_documents.length > 0).length
    })

    return {
      project_id: selectedSubsidyForEdit.project_id || "",
      institution_id: selectedSubsidyForEdit.institution_id || "",
      department_id: selectedSubsidyForEdit.department_id || "",
      church_id: selectedSubsidyForEdit.church_id || "",
      requested_amount: selectedSubsidyForEdit.requested_amount,
      notes: selectedSubsidyForEdit.notes || "",
      items,
    }
  }, [selectedSubsidyForEdit, editReceipts])

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedSubsidy(null)
  }

  return (
    <>
      <div className={cn(gridColSpan, className,"mt-4")}>
      <div className="h-full flex flex-col space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        {/* Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{defaultTitle}</h3>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>

          {/* Add Button */}
          {onAddSubsidy && (
            <Button
              onClick={onAddSubsidy}
              size="sm"
              className="gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              {t("common.add", "Adicionar")}
            </Button>
          )}
        </div>

        {/* Cards Container */}
        {displaySubsidies.length === 0 ? (
          <div className="flex-1 min-h-0">
            <EmptyState
              icon={Inbox}
              title={defaultEmptyTitle}
              description={defaultEmptyDescription}
              fullHeight={true}
            />
          </div>
        ) : (
          <div className="relative flex-1 min-h-0">
            <div className="h-full flex flex-col gap-3 overflow-y-auto pr-2">
              {displaySubsidies.map((subsidy) => (
                <SubsidyRequestCard
                  key={subsidy.id}
                  data={subsidy}
                  onEdit={handleEditSubsidy}
                  onDelete={onDeleteSubsidy}
                  onView={handleViewSubsidy}
                  onDuplicate={onDuplicateSubsidy}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Info (optional) */}
        {displaySubsidies.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-[10px] text-gray-500 dark:text-gray-400 flex-shrink-0">
            <span>
              {displaySubsidies.length} {t("subsidy.requestCount", { 
                count: displaySubsidies.length,
                defaultValue: displaySubsidies.length === 1 ? "solicitação" : "solicitações" 
              })}
            </span>
            <span>
              {t("common.total", "Total")}:{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                }).format(displaySubsidies.reduce((sum, s) => sum + s.requested_amount, 0))}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>

      {/* View Subsidy Modal */}
      <ViewSubsidyModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        subsidy={selectedSubsidy}
        onSubsidyUpdated={async () => {
          // Trigger a refetch of the data
          if (onRefresh) {
            await onRefresh()
          }
        }}
      />

      {/* Edit Subsidy (reuses RequestSubsidyModal in edit mode) */}
      <RequestSubsidyModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedSubsidyForEdit(null); setEditReceipts([]) }}
        selectedActivities={[]}
        projectId={selectedSubsidyForEdit?.project_id || ""}
        institutionId={selectedSubsidyForEdit?.institution_id || ""}
        departmentId={selectedSubsidyForEdit?.department_id || ""}
        churchId={selectedSubsidyForEdit?.church_id || ""}
        institutionName={selectedSubsidyForEdit?.institution_name || ""}
        departmentName={selectedSubsidyForEdit?.department_name || ""}
        churchName={selectedSubsidyForEdit?.church_name || ""}
        subsidyRequestId={selectedSubsidyForEdit?.id}
        initialData={editInitialData}
        mode="edit"
        onSubmit={async (data) => {
          // Call update callback if provided
          if (onUpdateSubsidy && selectedSubsidyForEdit) {
            try {
              await onUpdateSubsidy(selectedSubsidyForEdit.id, data)
              console.log('✅ Subsidy updated successfully')
            } catch (error) {
              console.error('❌ Error updating subsidy:', error)
            }
          }

          setIsEditModalOpen(false)
          setSelectedSubsidyForEdit(null)
          setEditReceipts([])
        }}
        allActivities={allActivities}
        subsidizedActivityIds={subsidizedActivityIds}
      />
    </>
  )
}
