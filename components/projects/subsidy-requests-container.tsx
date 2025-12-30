"use client"

import * as React from "react"
import { Plus, Inbox } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { SubsidyRequestCard, SubsidyRequestCardData } from "./subsidy-request-card"
import { ViewSubsidyModal } from "@/components/modals/project/view-subsidy-modal"
import { RequestSubsidyModal } from "@/components/modals/project/request-subsidy-modal"
import { cn } from "@/lib/utils"

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
}

export function SubsidyRequestsContainer({
  subsidies,
  onAddSubsidy,
  onEditSubsidy,
  onDeleteSubsidy,
  onViewSubsidy,
  onDuplicateSubsidy,
  title,
  description,
  gridColSpan = "col-span-12",
  className,
  emptyStateTitle,
  emptyStateDescription,
}: SubsidyRequestsContainerProps) {
  const { t } = useTranslation()
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [selectedSubsidy, setSelectedSubsidy] = React.useState<SubsidyRequestCardData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedSubsidyForEdit, setSelectedSubsidyForEdit] = React.useState<SubsidyRequestCardData | null>(null)

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

  const handleEditSubsidy = (id: string) => {
    const subsidy = displaySubsidies.find(s => s.id === id)
    if (subsidy) {
      setSelectedSubsidyForEdit(subsidy)
      setIsEditModalOpen(true)
    }
    if (onEditSubsidy) onEditSubsidy(id)
  }

  // Build initialData for edit modal using real subsidy items
  const editInitialData = React.useMemo(() => {
    if (!selectedSubsidyForEdit) return null

    // Use real items from the subsidy if available
    const items = selectedSubsidyForEdit.items?.map(item => ({
      activity_id: item.activity_id,
      activity_name: item.activity_name,
      requested_amount: item.requested_amount,
      budget_amount: item.budget_amount,
      activity_documents: [], // Documents would need to be loaded separately
      notes: item.notes || ""
    })) || []

    console.log('📝 Building editInitialData:', {
      project_id: selectedSubsidyForEdit.project_id,
      institution_id: selectedSubsidyForEdit.institution_id,
      department_id: selectedSubsidyForEdit.department_id,
      church_id: selectedSubsidyForEdit.church_id,
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
  }, [selectedSubsidyForEdit])

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
      />

      {/* Edit Subsidy (reuses RequestSubsidyModal in edit mode) */}
      <RequestSubsidyModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedSubsidyForEdit(null) }}
        selectedActivities={[]}
        projectId={selectedSubsidyForEdit?.project_id || ""}
        institutionId={selectedSubsidyForEdit?.institution_id || ""}
        departmentId={selectedSubsidyForEdit?.department_id || ""}
        churchId={selectedSubsidyForEdit?.church_id || ""}
        institutionName={selectedSubsidyForEdit?.institution_name || ""}
        departmentName={selectedSubsidyForEdit?.department_name || ""}
        churchName={selectedSubsidyForEdit?.church_name || ""}
        initialData={editInitialData}
        mode="edit"
        onSubmit={(data) => {
          // For now, just close modal and call external callback if provided
          setIsEditModalOpen(false)
          setSelectedSubsidyForEdit(null)
          if (onEditSubsidy && selectedSubsidyForEdit) {
            onEditSubsidy(selectedSubsidyForEdit.id)
          }
        }}
        allActivities={[]}
      />
    </>
  )
}
