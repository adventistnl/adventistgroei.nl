"use client"

import * as React from "react"
import { Plus, Inbox } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { SubsidyRequestCard, SubsidyRequestCardData } from "./subsidy-request-card"
import { ViewSubsidyModal } from "@/components/modals/project/view-subsidy-modal"
import { RequestSubsidyModal } from "@/components/modals/project/request-subsidy-modal"
import { ConfirmDeleteSubsidyModal } from "@/components/modals/project/confirm-delete-subsidy-modal"
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

  // ==================== MOCK DATA - PARA TESTES ====================
  // Dados mockados ATIVOS para testes - Comente o bloco abaixo para usar dados reais
  const mockSubsidies: SubsidyRequestCardData[] = [
    {
      id: "mock-1",
      title: "Reforma do Templo Principal",
      requested_amount: 15000,
      approved_amount: 12000,
      status: "approved",
      requested_at: new Date("2024-11-15"),
      approved_at: new Date("2024-11-20"),
      activities_count: 5,
      total_budget: 20000,
    },
    {
      id: "mock-2",
      title: "Equipamentos para Escola Sabatina",
      requested_amount: 8000,
      approved_amount: 0,
      status: "pending",
      requested_at: new Date("2024-12-01"),
      activities_count: 3,
      total_budget: 10000,
    },
    {
      id: "mock-3",
      title: "Materiais para Programa de Jovens",
      requested_amount: 5000,
      approved_amount: 0,
      status: "rejected",
      requested_at: new Date("2024-10-10"),
      rejected_at: new Date("2024-10-25"),
      activities_count: 2,
      total_budget: 6000,
    },
  ]
  
  // MOCK ATIVO - Usando dados mockados em vez dos dados reais
  const [displaySubsidies, setDisplaySubsidies] = React.useState<SubsidyRequestCardData[]>(mockSubsidies)
  // Para usar dados reais, inicialize o estado com `subsidies` (ou remova este estado)
  // ================================================================

  // Default translations
  const defaultTitle = title || t("subsidy.requests", "Solicitações de Subsídio")
  const defaultEmptyTitle = emptyStateTitle || t("subsidy.noRequests", "Nenhuma solicitação de subsídio")
  const defaultEmptyDescription = emptyStateDescription || t("subsidy.noRequestsDescription", "Comece criando uma nova solicitação.")

  // Handlers
  const handleViewSubsidy = (id: string) => {
    const subsidy = displaySubsidies.find(s => s.id === id)
    if (subsidy) {
      setSelectedSubsidy(subsidy)
      setIsViewModalOpen(true)
    }
    // Também chama o callback original se existir
    if (onViewSubsidy) {
      onViewSubsidy(id)
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
      // keep modal open as informational - but we use confirm modal's deletable=false
      setIsConfirmDeleteOpen(false)
      setSubsidyPendingDelete(null)
      return
    }

    setDisplaySubsidies(prev => prev.filter(s => s.id !== subsidyPendingDelete.id))
    setIsConfirmDeleteOpen(false)
    setSubsidyPendingDelete(null)
    if (onDeleteSubsidy) onDeleteSubsidy(subsidyPendingDelete.id)
  }

  // Archive flow - mark archived in local state
  const handleArchive = (id: string) => {
    setDisplaySubsidies(prev => prev.map(s => s.id === id ? ({ ...s, archived: !s.archived } as any) : s))
  }

  const handleEditSubsidy = (id: string) => {
    const subsidy = displaySubsidies.find(s => s.id === id)
    if (subsidy) {
      setSelectedSubsidyForEdit(subsidy)
      setIsEditModalOpen(true)
    }
    if (onEditSubsidy) onEditSubsidy(id)
  }

  // Build initialData for edit modal using available subsidy details (falls back to sensible defaults)
  const editInitialData = React.useMemo(() => {
    if (!selectedSubsidyForEdit) return null

    const anySub: any = selectedSubsidyForEdit
    const activitiesCount = anySub.activities_count || 0
    const totalBudget = anySub.total_budget || 0
    const requested = anySub.requested_amount || 0

    const items = activitiesCount > 0
      ? Array.from({ length: activitiesCount }).map((_, i) => ({
          activity_id: `${selectedSubsidyForEdit.id}-act-${i+1}`,
          activity_name: `Atividade ${i+1}`,
          requested_amount: Math.round(requested / activitiesCount),
          budget_amount: Math.round(totalBudget / activitiesCount),
          activity_documents: [],
          notes: ""
        }))
      : []

    return {
      project_id: selectedSubsidyForEdit.id,
      institution_id: "",
      department_id: "",
      church_id: "",
      requested_amount: requested,
      notes: anySub.notes || "",
      items,
    }
  }, [selectedSubsidyForEdit])

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedSubsidy(null)
  }

  return (
    <>
      <div className={cn(gridColSpan, className, "h-full")}>
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
                  onDelete={handleRequestDelete}
                  onView={handleViewSubsidy}
                  onDuplicate={undefined}
                  onArchive={handleArchive}
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
        projectId={selectedSubsidyForEdit?.id || ""}
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

      {/* Confirm Delete Modal */}
      <ConfirmDeleteSubsidyModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => { setIsConfirmDeleteOpen(false); setSubsidyPendingDelete(null) }}
        onConfirm={confirmDelete}
        deletable={!!subsidyPendingDelete && subsidyPendingDelete.status !== "approved" && subsidyPendingDelete.status !== "in_review"}
        title={subsidyPendingDelete ? `Excluir ${subsidyPendingDelete.title}` : undefined}
        description={subsidyPendingDelete && (subsidyPendingDelete.status === "approved" || subsidyPendingDelete.status === "in_review") ? "Esta solicitação não pode ser excluída pois já está em análise ou aprovada." : undefined}
      />
    </>
  )
}
