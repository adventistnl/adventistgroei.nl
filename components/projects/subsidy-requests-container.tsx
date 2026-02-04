import * as React from "react"
import { Plus, Inbox, Banknote } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@apollo/client"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { SubsidyRequestCard, SubsidyRequestCardData } from "./subsidy-request-card"
import { ViewSubsidyModal } from "@/components/modals/project/view-subsidy-modal"
import { RequestSubsidyModal, SubsidyRequestData as SubsidyRequestFormData } from "@/components/modals/project/request-subsidy-modal"
import { RequestAdvanceModal } from "@/components/modals/project/request-advance-modal"
import { useSubsidyReceipts, SubsidyReceipt } from "@/hooks/use-subsidy-receipts"
import { useCurrency } from "@/contexts/currency-context"
import { cn } from "@/lib/utils"
import type { ProjectActivityData } from "@/components/projects/project-activities-table"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { CREATE_ADVANCE_REQUEST } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"
import { toast } from "sonner"

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
  /** Callback when "Link Activity" is clicked on an advance request */
  onLinkActivity?: (id: string) => void
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
  projectSubsidizedBudget?: number
  projectId?: string
  projectName?: string
}

export function SubsidyRequestsContainer({
  subsidies,
  onAddSubsidy,
  onEditSubsidy,
  onDeleteSubsidy,
  onViewSubsidy,
  onDuplicateSubsidy,
  onUpdateSubsidy,
  onLinkActivity,
  title,
  description,
  gridColSpan = "col-span-12",
  className,
  emptyStateTitle,
  emptyStateDescription,
  allActivities = [],
  subsidizedActivityIds = [],
  onRefresh,
  projectSubsidizedBudget = 0,
  projectId,
  projectName,
}: SubsidyRequestsContainerProps) {
  const { t, i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [selectedSubsidy, setSelectedSubsidy] = React.useState<SubsidyRequestCardData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)

  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = React.useState(false)

  // Mutation for advance request
  const [createAdvanceRequest] = useMutation(CREATE_ADVANCE_REQUEST)



  // Usando dados reais passados via props
  const displaySubsidies = subsidies

  // Default translations
  const defaultTitle = title || t("subsidy.requestsTitle")
  const defaultEmptyTitle = emptyStateTitle || t("subsidy.noRequests")
  const defaultEmptyDescription = emptyStateDescription || t("subsidy.noRequestsDescription")

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
    if (onEditSubsidy) onEditSubsidy(id)
  }



  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedSubsidy(null)
  }

  return (
    <>
      <div className={cn(gridColSpan, className, "h-full")}>
      <div className="bg-card text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{defaultTitle}</h3>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          <div className="flex gap-2">

          {/* Advance Button */}
          <WithPermission requiredPermissions={[PermissionResolverName.CreateSubsidyRequest]}>
              <Button
                onClick={() => setIsAdvanceModalOpen(true)}
                size="sm"
                variant="outline"
                className="gap-2"
                disabled={displaySubsidies.some(s => s.is_for_advance && s.status !== 'rejected')}
                title={displaySubsidies.some(s => s.is_for_advance && s.status !== 'rejected') ? t("subsidy.advanceAlreadyExists") : ""}
              >
                <Banknote className="h-4 w-4" />
                {t("subsidyRequest.advance.button")}
              </Button>
          </WithPermission>

          {/* Add Button */}
          {onAddSubsidy && (
            <WithPermission requiredPermissions={[PermissionResolverName.CreateSubsidyRequest]}>
              <Button
                onClick={onAddSubsidy}
                size="sm"
                className="gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
              >
                <Plus className="h-4 w-4" />
                {t("common.add")}
              </Button>
            </WithPermission>
          )}
          </div>
        </div>

        {/* Cards Container */}
        {displaySubsidies.length === 0 ? (
          <div className="flex-1">
            <EmptyState
              icon={Inbox}
              title={defaultEmptyTitle}
              description={defaultEmptyDescription}
              fullHeight={true}
            />
          </div>
        ) : (
          <div className="relative flex-1 overflow-hidden">
            <div className="h-full max-h-[280px] flex flex-col gap-3 overflow-y-auto pr-2">
              {displaySubsidies.map((subsidy) => {
                const isApprovedOrClosed = subsidy.status === "approved" || subsidy.status === "closed"

                return <SubsidyRequestCard
                  key={subsidy.id}
                  data={subsidy}
                  onEdit={isApprovedOrClosed ? undefined : onEditSubsidy}
                  onDelete={isApprovedOrClosed ? undefined : onDeleteSubsidy}
                  onView={handleViewSubsidy}
                  onDuplicate={onDuplicateSubsidy}
                  onLinkActivity={onLinkActivity}
                />
              })}
            </div>
          </div>
        )}

        {/* Footer Info (optional) */}
        {displaySubsidies.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-[10px] text-gray-500 dark:text-gray-400 flex-shrink-0">
            <span>
              {displaySubsidies.length === 1 
                ? t("requestCount_one") || "1 request"
                : t("requestCount_other")?.replace("{{count}}", displaySubsidies.length.toString()) || `${displaySubsidies.length} requests`
              }
            </span>
            <span>
              {t("common.total")}:{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {formatCurrency(displaySubsidies.filter(s => s.status !== 'rejected').reduce((sum, s) => sum + s.requested_amount, 0))}
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




      {/* Request Advance Modal */}
      <RequestAdvanceModal
        isOpen={isAdvanceModalOpen}
        onClose={() => setIsAdvanceModalOpen(false)}
        onSubmit={async (advanceAmount: number) => {
          if (!projectId) return
          
          try {
            await createAdvanceRequest({
              variables: {
                projectId,
                advanceAmount,
                language: i18n.language?.toLowerCase() || 'en'
              }
            })
            toast.success(t("subsidyRequest.advance.success"))
            if (onRefresh) {
              await onRefresh()
            }
          } catch (error) {
            console.error('Error creating advance request:', error)
            throw error
          }
        }}
        subsidizedBudget={projectSubsidizedBudget}
        projectName={projectName}
      />
    </>
  )
}
