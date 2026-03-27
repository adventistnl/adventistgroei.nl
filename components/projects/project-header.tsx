"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useMutation } from "@apollo/client"
import { useProjectHistory, buildStatusChangedPayload } from "@/hooks/graphql/use-project-history"
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
  Church,
  ArrowBigDownDash,
  History,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ChatProjectRoom, type ChatProject } from "@/components/chat/chat-project-room"
import { useCurrency } from "@/contexts/currency-context"
import { useAuth } from "@/contexts/auth-context"
import toast from "react-hot-toast"
import { UPDATE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { ProjectStatus } from "@/types/graphql-global-types"

// ─── Status Configuration ────────────────────────────────────────────────────
// Single source of truth for every status. To add a new status:
//   1. Add its entry here
//   2. Add translation keys in lib/translations/projects.ts (EN / PT / NL)
// Everything else (select items, badge styles, dot colours, availability)
// is derived from this config automatically.

type StatusConditionPayload = {
  canSetConcluded: boolean
  isConcluded: boolean
}

export type StatusConfigEntry = {
  /** Key used to look up label in t.status */
  labelKey: string
  /** Tailwind classes for the trigger / badge chip */
  triggerClass: string
  /** Tailwind class for the small round dot indicator */
  dotColor: string
  /** Hex colour for the Kanban column left-border and header dot */
  kanbanColor: string
  /**
   * If present the status only appears in the dropdown when the predicate
   * returns true. Statuses without this are always available (unless the
   * project is CONCLUDED).
   */
  requiresCondition?: (payload: StatusConditionPayload) => boolean
}

/** Status entry with the label already resolved from i18n translations. */
export type ResolvedStatusEntry = Omit<StatusConfigEntry, 'labelKey'> & { label: string }

/** Ordered list – determines the visual order in the Kanban columns and the Select dropdown */
export const PROJECT_STATUS_ORDER: string[] = [
  'DRAFT',
  'OPEN_REQUEST',
  'IN_REVIEW',
  'ADJUSTMENTS_NEEDED',
  'IN_PROGRESS',
  'PENDING_RECEIPT',
  'WAITING_REFUND',
  'OVERDUE',
  'CONCLUDED',
]

export const PROJECT_STATUS_CONFIG: Record<string, StatusConfigEntry> = {
  // ── Gray / neutral ── starting point in the workflow
  DRAFT: {
    labelKey: 'draft',
    kanbanColor: '#6b7280',
    dotColor: 'bg-gray-500',
    triggerClass: 'bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-800/60 dark:text-gray-100 dark:border-gray-600',
  },
  // ── Sky blue ── open workflow request
  OPEN_REQUEST: {
    labelKey: 'openRequest',
    kanbanColor: '#0ea5e9',
    dotColor: 'bg-sky-500',
    triggerClass: 'bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-100 dark:border-sky-700',
  },
  // ── Blue ── under review / evaluation
  IN_REVIEW: {
    labelKey: 'inReview',
    kanbanColor: '#3b82f6',
    dotColor: 'bg-blue-500',
    triggerClass: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-700',
  },
  // ── Orange ── attention: corrections required
  ADJUSTMENTS_NEEDED: {
    labelKey: 'adjustmentsNeeded',
    kanbanColor: '#f97316',
    dotColor: 'bg-orange-500',
    triggerClass: 'bg-orange-50 text-orange-900 border-orange-200 dark:bg-orange-900/30 dark:text-orange-100 dark:border-orange-700',
  },
  // ── Green ── positive / active execution
  IN_PROGRESS: {
    labelKey: 'inProgress',
    kanbanColor: '#22c55e',
    dotColor: 'bg-green-500',
    triggerClass: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-700',
  },
  // ── Cyan ── process: awaiting receipt
  PENDING_RECEIPT: {
    labelKey: 'pendingReceipt',
    kanbanColor: '#06b6d4',
    dotColor: 'bg-cyan-500',
    triggerClass: 'bg-cyan-50 text-cyan-900 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-100 dark:border-cyan-700',
  },
  // ── Teal ── process: awaiting reimbursement
  WAITING_REFUND: {
    labelKey: 'waitingRefund',
    kanbanColor: '#14b8a6',
    dotColor: 'bg-teal-500',
    triggerClass: 'bg-teal-50 text-teal-900 border-teal-200 dark:bg-teal-900/30 dark:text-teal-100 dark:border-teal-700',
  },
  // ── Red ── critical: deadline passed / overdue
  OVERDUE: {
    labelKey: 'overdue',
    kanbanColor: '#ef4444',
    dotColor: 'bg-red-500',
    triggerClass: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-700',
  },
  // ── Dark green ── success: project fully concluded
  CONCLUDED: {
    labelKey: 'concluded',
    kanbanColor: '#16a34a',
    dotColor: 'bg-green-700',
    triggerClass: 'bg-green-50 text-green-900 border-green-300 dark:bg-green-900/40 dark:text-green-100 dark:border-green-700',
    requiresCondition: ({ canSetConcluded }) => canSetConcluded,
  },
}

/**
 * Returns a fully-resolved status config map where each entry has an
 * already-translated `label` field. Pass the translation object so labels
 * are always in the active locale.
 *
 * @example
 *   const config = getProjectStatusConfig(t_project)
 *   config['IN_PROGRESS'].label  // "In Progress" | "Em Andamento" | "In Uitvoering"
 */
export function getProjectStatusConfig(
  t: { status: Record<string, string> },
): Record<string, ResolvedStatusEntry> {
  return Object.fromEntries(
    PROJECT_STATUS_ORDER.map((key) => {
      const { labelKey, ...rest } = PROJECT_STATUS_CONFIG[key]
      return [key, { ...rest, label: t.status[labelKey] ?? key } satisfies ResolvedStatusEntry]
    }),
  )
}

interface ProjectCompletionData {
  allActivitiesCompleted: boolean
  allDocumentsValidated: boolean
  allSubsidiesCompleted: boolean
  totalActivities: number
  totalSubsidies: number
}

interface ProjectHeaderProps {
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
    requestContribution?: number
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
  /** Owner ID to identify and highlight the project owner */
  ownerId?: string
  /** Co-Owner ID to highlight the co-owner with a blue badge */
  coOwnerId?: string
  /** Callback to refetch project data after status update */
  onRefetch?: () => void
  /** Data about project completion status for status validation */
  completionData?: ProjectCompletionData
}

export function ProjectHeader({
  project,
  onEdit,
  onDelete,
  onCreateCommunication,
  onCreateEvent,
  variant = 'default',
  funding,
  fundingPolicies: fundingPoliciesProp,
  users = [],
  ownerId,
  coOwnerId,
  onRefetch,
  completionData,
}: ProjectHeaderProps) {
  const router = useRouter()
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { user } = useAuth()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const [isUserListModalOpen, setIsUserListModalOpen] = React.useState(false)

  const { logHistory } = useProjectHistory({ projectId: project.id, skipFetch: true })
  const [historyOpen, setHistoryOpen] = React.useState(false)

  // Check if current user is the project owner or co-owner
  const isCurrentUserOwner = !!(user?.id && ownerId && user.id === ownerId)
  const isCurrentUserCoOwner = !!(user?.id && coOwnerId && user.id === coOwnerId)

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

    // Co-owner can only change to OPEN_REQUEST
    if (!isCurrentUserOwner && isCurrentUserCoOwner) {
      if (newStatus !== 'OPEN_REQUEST') {
        toast.error(t.errors?.onlyOwnerCanEdit || "Only the project owner can edit the project status")
        return
      }
    } else if (!isCurrentUserOwner) {
      toast.error(t.errors?.onlyOwnerCanEdit || "Only the project owner can edit the project status")
      return
    }
    
    // Prevent invalid status changes
    if (isStatusDisabled(newStatus)) {
      if (newStatus === 'CONCLUDED') {
        toast.error(t.status?.cannotSetConcluded || 'Cannot conclude project: all activities, documents and subsidies must be completed first')
      } else {
        toast.error(t.status?.invalidStatusChange || 'Invalid status change')
      }
      return
    }

    // Prevent changing from CONCLUDED to any other status
    if (project.status === 'CONCLUDED' && newStatus !== 'CONCLUDED') {
      toast.error(t.status?.cannotModifyConcluded || 'Cannot modify a concluded project')
      return
    }
    
    try {
      const oldStatus = project.status
      await updateProjectStatus({
        variables: {
          id: project.id,
          status: newStatus,
        },
      })
      logHistory(buildStatusChangedPayload(oldStatus, newStatus))
    } catch (e) {
      // Error handled by onError callback
    }
  }

  // Helper function to check if project can be concluded
  const canSetConcluded = (): boolean => {
    // If already concluded, cannot change back
    if (project.status === 'CONCLUDED') return false
    
    // If no completion data provided, disable CONCLUDED status
    if (!completionData) return false
    
    // Check if all activities are completed
    const allActivitiesCompleted = completionData.totalActivities === 0 || completionData.allActivitiesCompleted
    
    // Check if all documents are validated
    const allDocumentsValidated = completionData.allDocumentsValidated
    
    // Check if all subsidies are completed
    const allSubsidiesCompleted = completionData.totalSubsidies === 0 || completionData.allSubsidiesCompleted
    
    return allActivitiesCompleted && allDocumentsValidated && allSubsidiesCompleted
  }

  // Helper function to check if a status option should be disabled
  const isStatusDisabled = (status: string): boolean => {
    // If project is concluded, cannot change to any other status
    if (project.status === 'CONCLUDED') {
      return status !== 'CONCLUDED'
    }
    
    // CONCLUDED is only enabled if all conditions are met
    if (status === 'CONCLUDED') {
      return !canSetConcluded()
    }
    
    return false
  }

  const isConcluded = project.status === 'CONCLUDED'

  // Build ChatProject shape from available header data for the history sheet
  const chatProject = React.useMemo((): ChatProject => {
    const ownerUser = users.find(u => u.id === ownerId)
    const coOwnerUser = coOwnerId && coOwnerId !== ownerId ? users.find(u => u.id === coOwnerId) : undefined
    const collabIds = new Set([ownerId, coOwnerId].filter(Boolean))
    const collaborators = users
      .filter(u => !collabIds.has(u.id))
      .map(u => ({ role: u.role ?? 'Member', user: { id: u.id, name: u.name, email: u.email } }))
    return {
      id: project.id,
      title: project.title,
      status: project.status ?? '',
      owner: ownerUser ? { id: ownerUser.id, name: ownerUser.name } : undefined,
      co_owner: coOwnerUser ? { id: coOwnerUser.id, name: coOwnerUser.name } : undefined,
      collaborators,
    }
  }, [project.id, project.title, project.status, users, ownerId, coOwnerId])

  // Available statuses derived from config + business rules
  const conditionPayload: StatusConditionPayload = {
    canSetConcluded: canSetConcluded(),
    isConcluded,
  }

  const availableStatuses = PROJECT_STATUS_ORDER.filter((status) => {
    const cfg = PROJECT_STATUS_CONFIG[status]
    if (!cfg) return false
    if (cfg.requiresCondition) return cfg.requiresCondition(conditionPayload)
    return true
  })

  /** Returns the i18n label for any status value */
  const getStatusLabel = (status: string): string =>
    (t.status as Record<string, string>)[PROJECT_STATUS_CONFIG[status]?.labelKey] || status

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
  const requestContribution = funding?.requestContribution || 0
  const subsidyBudget = funding?.subsidyBudget || 0
  const subsidyPercentage = funding?.subsidyPercentage ?? fundingPolicies.default_institution_percent

  const institutionPercent = totalBudget > 0 ? (requestContribution / totalBudget) * 100 : 0

  const exceedsInstitutionAmount = requestContribution > fundingPolicies.max_institution_amount
  const exceedsInstitutionPercent = institutionPercent > fundingPolicies.max_institution_percent
  const belowMinChurchPercent = totalBudget > 0 ? ((totalBudget - requestContribution) / totalBudget) * 100 < fundingPolicies.min_church_percent : false

  const handleBack = () => {
    router.push('/projects')
  }

  // Reorder users to show owner first and mark owner with special styling
  const orderedUsers = React.useMemo(() => {
    if (!ownerId || !users.length) return users
    
    const ownerIndex = users.findIndex(user => user.id === ownerId)
    if (ownerIndex === -1) return users
    
    const owner = { ...users[ownerIndex] }
    const otherUsers = users.filter((_, index) => index !== ownerIndex)
    
    // Mark owner with special properties for styling
    const ownerWithStyle = {
      ...owner,
      role: 'Owner', // Override role to show as Owner
      isOwner: true // Special flag for styling
    }
    
    return [ownerWithStyle, ...otherUsers]
  }, [users, ownerId])

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
          <span className="hidden sm:inline md:inline">{t.header.back}</span>
        </Button>
      </div>

      {/* Project Header */}
      <div className="flex flex-col sm:flex-col md:flex-row md:items-start gap-4 mb-2 border-b pb-4">
        {/* Avatar - Progressive sizing */}
        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg relative flex-shrink-0">
          <AvatarFallback className={cn("rounded-lg", variantAvatarBg)}>
            <Folder className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </AvatarFallback>

          {/* Variant icon overlay */}
          <div
            className={cn(
              "absolute -top-0.5 -right-0.5 sm:-top-0.5 sm:-right-0.5 md:-top-1 md:-right-1 w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white border-2",
              variantAvatarBg,
              variantAccent
            )}
            aria-hidden
          >
            {/* <Church className="w-2 h-2 sm:w-3 sm:h-3" /> */}
          </div>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-3 md:space-y-4">
          {/* Title Row - Stack on mobile, partial stack on tablet */}
          <div className="space-y-3 md:space-y-2">
            <div className="flex flex-col sm:flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold leading-tight">{project.title}</h1>
              
              {/* Users and Status - Stack on mobile, inline on tablet */}
              <div className="flex flex-col sm:flex-row sm:items-center md:flex-row md:items-center gap-2 sm:gap-2 md:gap-3">
                {/* Users Avatar Group */}
                <div className="flex justify-start sm:justify-start md:justify-end">
                  <UsersAvatarGroup 
                    users={orderedUsers}
                    maxDisplay={2}
                    size="md"
                    showLabel={false}
                    labelText={t.common.registeredUsers}
                    showAddButton={false}
                    onShowAllUsers={() => setIsUserListModalOpen(true)}
                    ownerUserId={ownerId}
                    coOwnerUserId={coOwnerId !== ownerId ? coOwnerId : undefined}
                  />
                </div>

                {/* Submit Request Button - For owner and co-owner when project is in DRAFT */}
                {(isCurrentUserOwner || isCurrentUserCoOwner) && project.status === 'DRAFT' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange('OPEN_REQUEST')}
                    disabled={isUpdatingStatus}
                    className={cn(
                      "relative overflow-hidden group inline-flex items-center gap-2",
                      "border border-border dark:border-border rounded-md",
                      "bg-transparent text-foreground dark:text-foreground",
                      "h-9 sm:h-9 md:h-8 px-3 text-sm font-medium whitespace-nowrap flex-shrink-0",
                      "transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {/* Fill bar — slides in from left on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-slate-900 dark:bg-slate-100 transition-[width] duration-500 ease-out"
                    />
                    {/* Content layer — always above the fill bar */}
                    <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-500 group-hover:text-white dark:group-hover:text-slate-900">
                      {isUpdatingStatus ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowBigDownDash className="h-4 w-4" />
                      )}
                      <span className="sm:inline">{t.status?.submitRequest || 'Submit Request'}</span>
                    </span>
                  </button>
                )}

                {/* Status - Full width on mobile, auto on tablet */}
                <div className="w-full sm:w-full md:w-auto">
                  {isCurrentUserOwner ? (
                    <Select
                      value={project.status}
                      onValueChange={handleStatusChange}
                      disabled={isConcluded || isUpdatingStatus}
                    >
                      <SelectTrigger 
                        className={cn(
                          "w-full sm:w-full md:w-auto md:min-w-[140px] h-9 sm:h-9 md:h-8 text-sm",
                          PROJECT_STATUS_CONFIG[project.status]?.triggerClass,
                          isConcluded && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {isUpdatingStatus ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SelectValue placeholder={getStatusLabel(project.status)} />
                        )}
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-950 border border-border shadow-md">
                        {/* Show current status even if it wouldn't be normally available */}
                        {!availableStatuses.includes(project.status) && (
                          <SelectItem 
                            value={project.status}
                            disabled
                            className="cursor-not-allowed opacity-50"
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", PROJECT_STATUS_CONFIG[project.status]?.dotColor ?? 'bg-gray-400')} />
                              {getStatusLabel(project.status)}
                            </div>
                          </SelectItem>
                        )}
                        {availableStatuses.map((status) => {
                          const isDisabled = isStatusDisabled(status)
                          const isCurrentStatus = project.status === status
                          const cfg = PROJECT_STATUS_CONFIG[status]
                          
                          return (
                            <SelectItem 
                              key={status} 
                              value={status}
                              disabled={isDisabled}
                              className={cn(
                                "cursor-pointer",
                                isCurrentStatus && "font-medium",
                                isDisabled && "cursor-not-allowed opacity-50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", cfg?.dotColor)} />
                                <span>{getStatusLabel(status)}</span>
                                {isDisabled && status === 'CONCLUDED' && (
                                  <span className="text-xs text-muted-foreground hidden md:inline">(Requer atividades e documentos completos)</span>
                                )}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge 
                      className={cn(
                        "w-full sm:w-full md:w-auto justify-center sm:justify-center md:justify-start h-9 sm:h-9 md:h-8 px-3 text-sm font-medium",
                        PROJECT_STATUS_CONFIG[project.status]?.triggerClass
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", PROJECT_STATUS_CONFIG[project.status]?.dotColor ?? 'bg-gray-400')} />
                        <span>{getStatusLabel(project.status)}</span>
                      </div>
                    </Badge>
                  )}
                </div>
                {/* Action Buttons - Owner: edit + delete; Co-Owner: edit only */}
                {(isCurrentUserOwner || isCurrentUserCoOwner) && (
                  <div className="flex justify-end sm:justify-end md:justify-start gap-2">
                    {/* Project History button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-auto"
                      onClick={() => setHistoryOpen(true)}
                      aria-label="Project history"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-auto">
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
                        {/* Delete is restricted to the owner only */}
                        {isCurrentUserOwner && onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={onDelete}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t.actions.delete}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description and Badges - Progressive layout */}
          <div className="w-full flex flex-col sm:flex-col md:flex-row md:items-start gap-3 sm:gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
                {project.description && (
                  <p className="text-sm sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                    {project.description.length > 180 
                      ? `${project.description.substring(0, 180)}...`
                      : project.description
                    }
                  </p>
                )}
            </div>
            <div className="flex flex-wrap sm:flex-wrap md:flex-nowrap gap-2 items-center sm:ml-0 md:ml-0">
              <Badge variant="outline" className="text-xs sm:text-xs md:text-sm">
                {getDepartmentName(project.department_id)}
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-xs md:text-sm font-medium">
                {formatCurrency(project.budget)}
              </Badge>
            </div>
          </div>
          
    

          {/* Funding summary & policy indicators - Progressive stacking */}
          { (totalBudget > 0 || subsidyBudget > 0 || requestContribution > 0) && (
            <div className="mt-4 space-y-3 sm:space-y-2 md:space-y-0 md:flex md:items-start md:gap-4">
              <div className="flex items-start sm:items-start md:items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full mt-0.5 sm:mt-0.5 md:mt-0 flex-shrink-0", variantAvatarBg)} aria-hidden />
                <div className="text-sm text-gray-700 space-y-2 sm:space-y-1 md:space-y-1">
                  <div className="flex flex-col sm:flex-col md:flex-row md:items-center gap-1 sm:gap-1 md:gap-2">
                    <span className="font-medium">{t.header.institution}:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formatCurrency(requestContribution)}</span>
                      <span className="text-xs text-gray-500">({institutionPercent.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-col md:flex-row md:items-center gap-1 sm:gap-1 md:gap-2">
                    <span className="font-medium">{t.header.totalBudgetLabel}:</span>
                    <span className="font-semibold">{formatCurrency(totalBudget)}</span>
                  </div>
                </div>
              </div>

              {/* Policy badges - Responsive wrapping */}
              <div className="flex flex-wrap gap-2 sm:gap-2 md:gap-2">
                {exceedsInstitutionAmount && (
                  <Badge variant="outline" className="text-red-600 border-red-200 text-xs">{t.header.policy.exceedsLimit}</Badge>
                )}
                {!exceedsInstitutionAmount && exceedsInstitutionPercent && (
                  <Badge variant="outline" className="text-amber-700 border-amber-200 text-xs">{t.header.policy.percentExceeds}</Badge>
                )}
                {!exceedsInstitutionAmount && !exceedsInstitutionPercent && (
                  <Badge variant="outline" className="text-green-700 border-green-200 text-xs">{t.header.policy.ok}</Badge>
                )}
                {belowMinChurchPercent && (
                  <Badge variant="outline" className="text-amber-700 border-amber-200 text-xs">{t.header.policy.churchBelowMin}</Badge>
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
        users={orderedUsers}
        ownerUserId={ownerId}
        coOwnerUserId={coOwnerId !== ownerId ? coOwnerId : undefined}
      />

      {/* Project History Sheet */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="right" className="w-[380px] sm:w-[420px] flex flex-col p-0">
          <SheetHeader className="px-5 pt-5 pb-3 shrink-0">
            <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
              <History className="w-4 h-4" />
              {project.title}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0 flex flex-col border-t">
            <ChatProjectRoom
              project={chatProject}
              canComment={isCurrentUserOwner || isCurrentUserCoOwner}
              onBack={() => setHistoryOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

