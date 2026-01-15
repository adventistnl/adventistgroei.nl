"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useMutation } from "@apollo/client"
import {
  ArrowLeft,
  MoreVertical,
  Folder,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  Sprout,
  Plus,
  DollarSign,
  UserPlus,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { ProjectTableData } from "@/components/projects/projects-table"
import { mockDepartments } from "@/data/mockData"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { UserListModal } from "@/components/shared/user-list-modal"
import { useCurrency } from "@/contexts/currency-context"
import toast from "react-hot-toast"
import { UPDATE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { ProjectStatus } from "@/types/graphql-global-types"

interface ProjectHeaderMinimalProps {
  project: ProjectTableData
  onEdit?: () => void
  onDelete?: () => void
  onCreateCommunication?: () => void
  onCreateEvent?: () => void
  /**
   * Variant controls a small visual treatment for special project types.
   * - 'default' : normal folder avatar
   * - 'churchPlanting' : sprout icon + green accent
   * - 'special' : plus icon + orange accent
   */
  variant?: 'default' | 'churchPlanting' | 'special'
  /** Optional funding snapshot to render contribution summary and validate policies */
  funding?: {
    totalBudget?: number
    subsidyBudget?: number
    institutionContribution?: number
    subsidyPercentage?: number
  }
  /** Optional override for funding policies (defaults provided) */
  fundingPolicies?: Partial<{
    max_institution_percent: number
    max_institution_amount: number
    min_church_percent: number
    default_church_percent: number
    default_institution_percent: number
  }>
  /** Users registered in the project */
  users?: UserAvatarData[]
  /** Callback to refetch project data after status update */
  onRefetch?: () => void
}

export function ProjectHeaderMinimal({
  project,
  onEdit,
  onDelete,
  onCreateCommunication,
  onCreateEvent,
  variant = 'default',
  funding,
  fundingPolicies: fundingPoliciesProp,
  users = [],
  onRefetch,
}: ProjectHeaderMinimalProps) {
  const router = useRouter()
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const [isUserListModalOpen, setIsUserListModalOpen] = React.useState(false)

  // Mutation for updating project status
  const [updateProjectStatus, { loading: isUpdatingStatus }] = useMutation(UPDATE_PROJECT_MUTATION, {
    onCompleted: () => {
      toast.success(t.status?.statusUpdated || 'Status updated successfully')
      onRefetch?.()
    },
    onError: (err) => {
      // Extract extensions from different possible paths (same pattern as subsidy-approvals-manager)
      let ext = (err.graphQLErrors?.[0]?.extensions as any);
      if (!ext && (err.networkError as any)?.result?.errors?.[0]?.extensions) {
        ext = (err.networkError as any).result.errors[0].extensions;
      }
      const errorCode = ext?.context?.additional?.errorCode || ext?.additional?.errorCode || ext?.code;
      
      let errorMessage = err.message
      
      if (errorCode === 'PROJECT_IS_CONCLUDED') {
        errorMessage = t.status?.cannotModifyConcluded || 'Cannot modify a concluded project'
      } else if (errorCode === 'PROJECT_HAS_INCOMPLETE_ACTIVITIES') {
        errorMessage = t.status?.incompleteActivities || 'All activities must be completed before concluding'
      } else if (errorCode === 'PROJECT_HAS_UNVALIDATED_DOCUMENTS') {
        errorMessage = t.status?.unvalidatedDocuments || 'All documents must be validated before concluding'
      } else if (errorCode === 'PROJECT_HAS_OPEN_SUBSIDIES') {
        errorMessage = t.status?.openSubsidies || 'All subsidies must be closed before concluding'
      }
      
      toast.error(errorMessage)
    },
  })

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === project.status) return
    
    try {
      await updateProjectStatus({
        variables: {
          id: project.id,
          status: newStatus,
        },
      })
    } catch (e) {
      // Error handled by onError callback
    }
  }

  // Available statuses for selection
  // EXPIRED is included for display but the dropdown will be disabled for expired projects
  const availableStatuses = [
    ProjectStatus.Draft,
    ProjectStatus.InProgress,
    ProjectStatus.InReview,
    ProjectStatus.OnHold,
    ProjectStatus.Expired,
    ProjectStatus.Concluded,
  ]

  // Check if project is concluded or expired (read-only for concluded, warning for expired)
  const isConcluded = project.status === 'CONCLUDED'
  const isExpired = project.status === 'EXPIRED'

  // Status colors for backend statuses
  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-50 text-gray-900 border-gray-200",
    IN_PROGRESS: "bg-green-50 text-green-900 border-green-200",
    IN_REVIEW: "bg-blue-50 text-blue-900 border-blue-200",
    ON_HOLD: "bg-amber-50 text-amber-900 border-amber-200",
    EXPIRED: "bg-red-50 text-red-900 border-red-200",
    CONCLUDED: "bg-slate-50 text-slate-900 border-slate-200",
  }

  // Get status label from translations
  const getStatusLabel = (status: string): string => {
    const statusLabels: Record<string, string> = {
      DRAFT: t.status?.draft || 'Draft',
      IN_PROGRESS: t.status?.inProgress || 'In Progress',
      IN_REVIEW: t.status?.inReview || 'In Review',
      ON_HOLD: t.status?.onHold || 'On Hold',
      EXPIRED: t.status?.expired || 'Expired',
      CONCLUDED: t.status?.concluded || 'Concluded',
    }
    return statusLabels[status] || status
  }

  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(d => d.id === departmentId)
    return department?.name || departmentId
  }

  // Variant visual configuration
  const variantConfig: Record<string, { icon: any; accent: string; avatarBg: string }> = {
    default: { icon: Folder, accent: 'border-gray-200', avatarBg: 'bg-gray-900' },
    churchPlanting: { icon: Sprout, accent: 'border-green-500', avatarBg: 'bg-green-600' },
    special: { icon: Plus, accent: 'border-orange-500', avatarBg: 'bg-orange-600' },
  }

  const activeVariant = variant || 'default'
  const VariantIcon = variantConfig[activeVariant].icon
  const variantAccent = variantConfig[activeVariant].accent
  const variantAvatarBg = variantConfig[activeVariant].avatarBg

  // Default funding policy values (can be overridden via props)
  const DEFAULT_FUNDING_POLICIES = {
    max_institution_percent: 65,
    max_institution_amount: 5000,
    min_church_percent: 35,
    default_church_percent: 35,
    default_institution_percent: 65,
  }

  const fundingPolicies = { ...DEFAULT_FUNDING_POLICIES, ...(fundingPoliciesProp || {}) }

  // Funding snapshot (may be partial)
  const totalBudget = funding?.totalBudget || 0
  const institutionContribution = funding?.institutionContribution || 0
  const subsidyBudget = funding?.subsidyBudget || 0
  const subsidyPercentage = funding?.subsidyPercentage ?? fundingPolicies.default_institution_percent

  const institutionPercent = totalBudget > 0 ? (institutionContribution / totalBudget) * 100 : 0

  const exceedsInstitutionAmount = institutionContribution > fundingPolicies.max_institution_amount
  const exceedsInstitutionPercent = institutionPercent > fundingPolicies.max_institution_percent
  const belowMinChurchPercent = totalBudget > 0 ? ((totalBudget - institutionContribution) / totalBudget) * 100 < fundingPolicies.min_church_percent : false

  const handleBack = () => {
    router.push('/projects')
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.header.back}
        </Button>

        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {t.actions.editProject}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onCreateCommunication && (
                <DropdownMenuItem onClick={onCreateCommunication}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t.actions.createCommunication}
                </DropdownMenuItem>
              )}
              {onCreateEvent && (
                <DropdownMenuItem onClick={onCreateEvent}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {t.actions.createEvent}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t.header.delete}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Minimalist Project Header */}
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16 rounded-lg relative">
          <AvatarFallback className={cn("rounded-lg", variantAvatarBg)}>
            <Folder className="w-8 h-8 text-white" />
          </AvatarFallback>

          {/* Variant icon overlay (small) positioned top-right of avatar */}
          <div
            className={cn(
              "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white border-2",
              variantAvatarBg,
              variantAccent
            )}
            aria-hidden
          >
            <VariantIcon className="w-3.5 h-3.5" />
          </div>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Title and Users Row */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <h1 className="text-3xl font-bold flex-1">{project.title}</h1>
            
            {/* Users Avatar Group - Top Right */}
            <div className="flex items-center gap-2">
              <UsersAvatarGroup 
                users={users}
                maxDisplay={3}
                size="md"
                showLabel={true}
                labelText={t.common.registeredUsers}
                showAddButton={false}
                onShowAllUsers={() => setIsUserListModalOpen(true)}
              />

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t.actions.editProject}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onDelete}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir projeto
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            </div>
          </div>
          
          {project.description && (
            <p className="text-muted-foreground mb-3">{project.description}</p>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status Dropdown */}
            <Select
              value={project.status}
              onValueChange={handleStatusChange}
              disabled={isConcluded || isUpdatingStatus}
            >
              <SelectTrigger 
                className={cn(
                  "w-auto min-w-[140px] h-8 text-sm",
                  statusColors[project.status] || statusColors.DRAFT,
                  isConcluded && "opacity-60 cursor-not-allowed"
                )}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SelectValue placeholder={getStatusLabel(project.status)} />
                )}
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem 
                    key={status} 
                    value={status}
                    className={cn(
                      "cursor-pointer",
                      project.status === status && "font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'DRAFT' && "bg-gray-500",
                        status === 'IN_PROGRESS' && "bg-green-500",
                        status === 'IN_REVIEW' && "bg-blue-500",
                        status === 'ON_HOLD' && "bg-amber-500",
                        status === 'EXPIRED' && "bg-red-500",
                        status === 'CONCLUDED' && "bg-slate-500",
                      )} />
                      {getStatusLabel(status)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">
              {getDepartmentName(project.department_id)}
            </Badge>
            <Badge variant="outline">
              {formatCurrency(project.budget)}
            </Badge>
          </div>

          {/* Funding summary & policy indicators (optional) */}
          { (totalBudget > 0 || subsidyBudget > 0 || institutionContribution > 0) && (
            <div className="mt-3 flex items-center gap-3">
              <div className={cn("w-3 h-3 rounded-full", variantAvatarBg)} aria-hidden />
              <div className="text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t.header.institution}:</span>
                  <span>{formatCurrency(institutionContribution)}</span>
                  <span className="text-xs text-gray-500">({institutionPercent.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">{t.header.totalBudgetLabel}:</span>
                  <span>{formatCurrency(totalBudget)}</span>
                </div>
              </div>

              <div className="ml-2 flex items-center gap-2">
                {exceedsInstitutionAmount && (
                  <Badge variant="outline" className="text-red-600 border-red-200">{t.header.policy.exceedsLimit}</Badge>
                )}
                {!exceedsInstitutionAmount && exceedsInstitutionPercent && (
                  <Badge variant="outline" className="text-amber-700 border-amber-200">{t.header.policy.percentExceeds}</Badge>
                )}
                {!exceedsInstitutionAmount && !exceedsInstitutionPercent && (
                  <Badge variant="outline" className="text-green-700 border-green-200">{t.header.policy.ok}</Badge>
                )}
                {belowMinChurchPercent && (
                  <Badge variant="outline" className="text-amber-700 border-amber-200">{t.header.policy.churchBelowMin}</Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User List Modal */}
      <UserListModal 
        isOpen={isUserListModalOpen}
        onClose={() => setIsUserListModalOpen(false)}
        users={users}
      />
    </div>
  )
}

