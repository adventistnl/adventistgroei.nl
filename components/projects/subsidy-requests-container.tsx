import * as React from "react"
import { Plus, Inbox } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { SubsidyRequestCard, SubsidyRequestCardData } from "./subsidy-request-card"
import { ViewSubsidyModal } from "@/components/modals/project/view-subsidy-modal"
import { RequestSubsidyModal, SubsidyRequestData as SubsidyRequestFormData } from "@/components/modals/project/request-subsidy-modal"
import { useCurrency } from "@/contexts/currency-context"
import { useInstitution } from "@/contexts/institution-context"
import { cn } from "@/lib/utils"
import type { ProjectActivityData } from "@/components/projects/project-activities-table"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { useAuth } from "@/contexts/auth-context"

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
  /** Institution name to display in the modal summary */
  institutionName?: string
  /** Department ID (institutional projects) */
  departmentId?: string
  /** Department name (institutional projects) */
  departmentName?: string
  /** Church ID (church projects) */
  churchId?: string
  /** Church name (church projects) */
  churchName?: string
  /** Church department ID (church projects) */
  churchDepartmentId?: string
  /** Church department name (church projects) */
  churchDepartmentName?: string
  /** When true, hides Add and Request Advance buttons (project is still in Draft state) */
  isDraft?: boolean
  /** Whether the current user is an owner or co-owner of the project */
  isOwnerOrCoOwner?: boolean
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
  institutionName: institutionNameProp,
  departmentId = "",
  departmentName = "",
  churchId = "",
  churchName = "",
  churchDepartmentId = "",
  churchDepartmentName = "",
  isDraft = false,
  isOwnerOrCoOwner = false,
}: SubsidyRequestsContainerProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { currentInstitutionData } = useInstitution()
  const { user } = useAuth()
  const institutionName = institutionNameProp || currentInstitutionData?.name || ""
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [selectedSubsidy, setSelectedSubsidy] = React.useState<SubsidyRequestCardData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)

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

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedSubsidy(null)
  }

  return (
    <>
      <div className={cn(gridColSpan, className, "h-full")}>
      <div className="bg-card text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start items-stretch justify-between gap-3 sm:gap-4 flex-shrink-0">
          <div className="space-y-0.5 flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{defaultTitle}</h3>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>}
          </div>
          <div className="flex gap-2 sm:flex-shrink-0">

          {/* Add button – hidden when project is still in Draft */}
          {!isDraft && onAddSubsidy && (
            <WithPermission requiredPermissions={[PermissionResolverName.CreateSubsidyRequest]}>
              <Button
                onClick={onAddSubsidy}
                size="sm"
                className="gap-1.5 sm:gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 flex-1 sm:flex-initial"
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{t("common.add")}</span>
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
            <div className="h-full max-h-[480px] flex flex-col gap-3 overflow-y-auto pr-2">
              {displaySubsidies.map((subsidy) => {
                const isRequester = subsidy.requester_id === user?.id
                const isEditable = (isRequester || isOwnerOrCoOwner) && ["pending", "in_review", "rejected", "adjustments_needed"].includes(subsidy.status)

                return <SubsidyRequestCard
                  key={subsidy.id}
                  data={subsidy}
                  onEdit={onEditSubsidy}
                  onDelete={!isEditable ? undefined : onDeleteSubsidy}
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
        allActivities={allActivities}
        onSubsidyUpdated={async () => {
          // Trigger a refetch of the data
          if (onRefresh) {
            await onRefresh()
          }
        }}
      />





    </>
  )
}
