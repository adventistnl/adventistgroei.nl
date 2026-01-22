"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, StatusBadgeVariant } from "@/components/ui/status-badge"
import { UseTable } from "@/components/ui/use-table"
import {
  Activity,
  MoreHorizontal,
  Trash2,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Wrench,
  Package,
  GraduationCap,
  DollarSign,
  Tag,
  CircleDollarSign,
  Wallet,
  Flag,
  Users
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import toast from "react-hot-toast"
import { ProjectTableData } from "@/components/projects/projects-table"
import { mockProjectActivities, getActivitiesByProjectId } from "@/data/mockData"
import { ActivityDetailsModal } from "@/components/modals/project/activity-details-modal"
import { DeleteActivityModal } from "@/components/modals/project/delete-activity-modal"
import { ActivityTags, PermissionResolverName } from "@/types/graphql-global-types"
import { projectTranslations } from "@/lib/translations/projects"
import { WithPermission } from "@/hocs/with-permission"
import { useHasPermission } from "@/hooks/use-has-permission"

// Schema-based interfaces
export interface ProjectActivityData {
  id: string
  project_id: string
  name: string
  description: string
  tags?: ActivityTags[]
  custom_tags?: string[]
  budget_amount: number
  deadline: string
  status: string
  priority: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
  completed_at?: string | null
  // Additional fields
  is_subsidized: boolean
  subsidy_amount?: number
  spent_amount?: number
  institution_requested_amount?: number
  // institution_requested_amount removed (duplicate)
  activity_funding?: Array<{
    id: string
    entity_contribution_amount: number
    entity_contribution_percent: number
    entity_type: string
    entity_id: string
  }>
  activity_documents?: Array<{
    id: string
    file_url: string
    filename: string
    type: string
    drive_file_id?: string
  }>
  // Múltiplos responsáveis via tabela de relacionamento
  assignees?: Array<{
    id: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
  // Array de IDs para envio de atualização
  assignee_ids?: string[]
  // Legacy: manter para compatibilidade
  assigned_users?: Array<{
    id: string
    name: string
    email?: string
    avatar?: string
    initials?: string
    role?: string
  }>
}

export interface SubsidyReceiptData {
  id: string
  project_activities_id: string
  file_path: string
  amount: number
  approved: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

interface ProjectActivitiesTableProps {
  project: ProjectTableData
  activities?: ProjectActivityData[] // Optional: if provided, use these activities instead of mock data
  subsidies?: Array<{
    id: string
    status: string  // 'pending' | 'approved' | 'rejected' | 'in_review' | 'closed'
    items?: Array<{
      id: string
      activity_id?: string
      project_activity_id?: string
      activity?: {
        id: string
      }
    }>
  }> // Subsidy data to check if activity can be deleted
  filterSubsidized?: boolean
  statusFilter?: string
  priorityFilter?: string
  tagFilter?: string
  searchQuery?: string
  onEditActivity?: (activity: ProjectActivityData) => void
  onDeleteActivity?: (activity: ProjectActivityData) => void
  onViewActivity?: (activity: ProjectActivityData) => void
  onUploadReceipt?: (activity: ProjectActivityData) => void
  onSaveActivity?: (data: Partial<ProjectActivityData>) => void
  institutionUsers?: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    role?: string
  }>
  enableRowSelection?: boolean
  selectedActivities?: ProjectActivityData[] // Controlled selection
  onSelectionChange?: (selectedActivities: ProjectActivityData[]) => void
  // Batch editing props
  batchEditFields?: any[]
  batchActions?: any[]
  batchPrimaryAction?: any
  batchSummary?: React.ReactNode
}

// Mock receipts data
const mockReceipts: SubsidyReceiptData[] = [
  {
    id: "rec-1",
    project_activities_id: "act-1",
    file_path: "/uploads/receipts/receipt-1.pdf",
    amount: 5000,
    approved: true,
    created_at: "2024-03-20T10:30:00Z",
    updated_at: "2024-03-21T14:20:00Z"
  },
  {
    id: "rec-2",
    project_activities_id: "act-1",
    file_path: "/uploads/receipts/receipt-2.pdf",
    amount: 3500,
    approved: false,
    created_at: "2024-04-05T16:15:00Z",
    updated_at: "2024-04-05T16:15:00Z"
  },
  {
    id: "rec-3",
    project_activities_id: "act-4",
    file_path: "/uploads/receipts/receipt-3.pdf",
    amount: 12000,
    approved: true,
    created_at: "2024-03-10T09:45:00Z",
    updated_at: "2024-03-12T11:30:00Z"
  }
]

export function ProjectActivitiesTable({
  project,
  activities,
  subsidies = [],
  filterSubsidized,
  statusFilter = "all",
  priorityFilter = "all",
  tagFilter = "all",
  searchQuery = "",
  onEditActivity,
  onDeleteActivity,
  onViewActivity,
  onUploadReceipt,
  onSaveActivity,
  institutionUsers = [],
  enableRowSelection = false,
  selectedActivities,
  onSelectionChange,
  batchEditFields,
  batchActions,
  batchPrimaryAction,
  batchSummary
}: ProjectActivitiesTableProps) {
  const { t, i18n } = useTranslation()
  const { selectedCurrency, formatCurrency } = useCurrency()
  const langKey = i18n.language as keyof typeof projectTranslations
  const pt = projectTranslations[langKey] || projectTranslations.en
  
  const [isViewActivityModalOpen, setIsViewActivityModalOpen] = useState(false)
  const [selectedActivityForView, setSelectedActivityForView] = useState<ProjectActivityData | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedActivityForDelete, setSelectedActivityForDelete] = useState<ProjectActivityData | null>(null)

  // Verificar permissões para exibir coluna de ações
  const hasUpdatePermission = useHasPermission([PermissionResolverName.UpdateProjectActivity])
  const hasDeletePermission = useHasPermission([PermissionResolverName.DeleteProjectActivity])
  const hasActionsPermission = hasUpdatePermission || hasDeletePermission

  // Get project activities - use provided activities or fallback to mock data
  const projectActivities = activities || (getActivitiesByProjectId(project.id) as ProjectActivityData[])

  // Filter activities based on subsidy status
  const currentActivities = filterSubsidized !== undefined 
    ? projectActivities.filter(activity => activity.is_subsidized === filterSubsidized)
    : projectActivities

  // Apply filters
  const filteredActivities = useMemo(() => {
    return currentActivities.filter((activity: ProjectActivityData) => {
      const matchesStatus = statusFilter === "all" || activity.status === statusFilter
      const matchesPriority = priorityFilter === "all" || activity.priority === priorityFilter
      const matchesTag = tagFilter === "all" || activity.tags?.includes(tagFilter as ActivityTags)
      const matchesSearch = searchQuery === "" || 
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesStatus && matchesPriority && matchesTag && matchesSearch
    })
  }, [currentActivities, statusFilter, priorityFilter, tagFilter, searchQuery])

  // Helper functions
  const getActivityTagIcon = (tag?: ActivityTags) => {
    if (!tag) return <Activity className="w-4 h-4" />

    switch (tag) {
      case ActivityTags.Reform: return <Wrench className="w-4 h-4" />
      case ActivityTags.Equipment: return <Wrench className="w-4 h-4" />
      case ActivityTags.Materials: return <Package className="w-4 h-4" />
      case ActivityTags.Training: return <GraduationCap className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getActivityTagLabel = (tag?: ActivityTags) => {
    if (!tag) return ''
    return pt.activityTags[tag] || tag
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "TODO": "To Do",
      "todo": "To Do",
      "IN_PROGRESS": pt.filters.inProgress,
      "in_progress": pt.filters.inProgress,
      "COMPLETED": pt.filters.completed,
      "completed": pt.filters.completed,
      "ON_HOLD": pt.filters.onHold,
      "on_hold": pt.filters.onHold
    }

    return labels[status] || status
  }

  // Monochromatic design - all elements use gray tones except subsidy indicator
  const getActivityTagColor = (tag?: ActivityTags) => {
    if (!tag) return "bg-gray-100 text-gray-800 border-gray-200"

    const colors: Record<ActivityTags, string> = {
      [ActivityTags.Reform]: 'bg-purple-50 text-purple-700 border-purple-200',
      [ActivityTags.Equipment]: 'bg-blue-50 text-blue-700 border-blue-200',
      [ActivityTags.Materials]: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      [ActivityTags.Training]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      [ActivityTags.Travel]: 'bg-green-50 text-green-700 border-green-200',
      [ActivityTags.Event]: 'bg-pink-50 text-pink-700 border-pink-200',
      [ActivityTags.Transport]: 'bg-orange-50 text-orange-700 border-orange-200',
      [ActivityTags.Marketing]: 'bg-red-50 text-red-700 border-red-200',
      [ActivityTags.Services]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      [ActivityTags.Feeding]: 'bg-gray-50 text-gray-700 border-gray-200',
      [ActivityTags.Accommodation]: 'bg-gray-50 text-gray-700 border-gray-200',
    }
    return colors[tag] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusVariant = (status: string): StatusBadgeVariant => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed": return "success"
      case "in_progress": return "info"
      case "todo": return "default"  // grey
      case "on_hold": return "neutral"
      default: return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed": return CheckCircle
      case "in_progress": return Clock
      case "todo":
      case "pending": return AlertCircle
      case "on_hold": return Settings
      default: return Activity
    }
  }

  const getPriorityVariant = (priority: string): StatusBadgeVariant => {
    const priorityLower = priority.toLowerCase()
    switch (priorityLower) {
      case "urgent": return "error"   // red
      case "high": return "warning"   // yellow
      case "medium": return "neutral" // brown
      case "low": return "default"    // grey
      default: return "default"
    }
  }
  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      "urgent": pt.filters.urgent,
      "high": pt.filters.high,
      "medium": pt.filters.medium,
      "low": pt.filters.low
    }
    return labels[priority.toLowerCase()] || priority
  }

  // Event handlers
  const handleManageActivity = (activity: ProjectActivityData) => {
    setSelectedActivityForView(activity)
    setIsViewActivityModalOpen(true)
  }

  const handleDeleteActivity = (activity: ProjectActivityData) => {
    setSelectedActivityForDelete(activity)
    setIsDeleteModalOpen(true)
  }



  // Table columns - Base columns sem actions
  const baseColumns: ColumnDef<ProjectActivityData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: pt.activitiesTable.activity,
      meta: {
        responsive: "always", // Always show this column
      },
      cell: ({ row }) => (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-left">{row.original.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2 text-left mt-1">
              {row.original.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "tags",
      accessorKey: "tags",
      header: pt.activitiesTable.category,
      meta: {
        responsive: "desktop", // Hide on mobile
      },
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags && row.original.tags.length > 0 ? (
            row.original.tags.map((tag: ActivityTags, index: number) => {
              const variant = tag === ActivityTags.Reform ? 'info' :
                             tag === ActivityTags.Equipment ? 'info' :
                             tag === ActivityTags.Materials ? 'info' :
                             tag === ActivityTags.Training ? 'success' : 'neutral'
              return (
                <StatusBadge
                  key={`${tag}-${index}`}
                  label={getActivityTagLabel(tag)}
                  variant={variant}
                  showDot={true}
                  size="sm"
                />
              )
            })
          ) : (
            <span className="text-xs text-muted-foreground">{pt.filters.sem_categoria}</span>
          )}
        </div>
      ),
    },
    {
      id: "subsidy_status",
      header: pt.activitiesTable.subsidy_status,
      meta: {
        responsive: "desktop", // Hide on mobile
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            row.original.is_subsidized 
              ? 'bg-green-100 border-2 border-green-300 dark:bg-green-950 dark:border-green-800' 
              : 'bg-gray-100 border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
          }`}>
            <span className={`text-sm font-bold ${
              row.original.is_subsidized ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
            }`}>
              {selectedCurrency.symbol}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "budget_amount",
      accessorKey: "budget_amount",
      header: pt.activitiesTable.budget,
      meta: {
        responsive: "desktop", // Hide on mobile
      },
      cell: ({ row }) => (
        <div className="font-medium">{formatCurrency(row.original.budget_amount)}</div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: pt.activitiesTable.status,
      meta: {
        responsive: "desktop", // Hide on mobile
      },
      cell: ({ row }) => (
        <StatusBadge
          label={getStatusLabel(row.original.status)}
          variant={getStatusVariant(row.original.status)}
          showDot={true}
          size="sm"
        />
      ),
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: pt.activitiesTable.priority,
      meta: {
        responsive: "desktop", // Hide on mobile
      },
      cell: ({ row }) => (
        <StatusBadge
          label={getPriorityLabel(row.original.priority)}
          variant={getPriorityVariant(row.original.priority)}
          icon={Flag}
          size="sm"
        />
      ),
    },
    {
      id: "assigned_users",
      header: pt.filters.assignees,
      meta: {
        responsive: "desktop", // Hide on mobile
      },
      cell: ({ row }) => {
        // Prioridade: assignees (nova estrutura) > assigned_users (legacy)
        let assignedUsers: Array<{ id: string; name: string; email?: string; avatar?: string; initials?: string; role?: string }> = []
        
        if (row.original.assignees && row.original.assignees.length > 0) {
          // Nova estrutura: assignees da tabela de relacionamento
          assignedUsers = row.original.assignees.map(a => ({
            id: a.user.id,
            name: a.user.name,
            email: a.user.email,
          }))
        } else if (row.original.assigned_users && row.original.assigned_users.length > 0) {
          // Legacy: assigned_users
          assignedUsers = row.original.assigned_users
        }
        
        const maxDisplay = 3
        const displayedUsers = assignedUsers.slice(0, maxDisplay)
        const remainingCount = assignedUsers.length - maxDisplay
        
        if (assignedUsers.length === 0) {
          return (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {pt.filters.none}
            </span>
          )
        }
        
        return (
          <div className="flex items-center -space-x-2">
            {displayedUsers.map((user, index) => (
              <TooltipProvider key={user.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar 
                      className="size-7 border-2 border-background cursor-pointer"
                      style={{ zIndex: displayedUsers.length - index }}
                    >
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-[9px] bg-muted text-foreground font-medium">
                        {user.initials || user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      {user.email && (
                        <p className="text-gray-400 text-[10px]">{user.email}</p>
                      )}
                      {user.role && (
                        <p className="text-gray-400 text-[10px]">{user.role}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {remainingCount > 0 && (
              <div className="size-7 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-background flex items-center justify-center">
                <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        )
      },
    },
  ]

  // Coluna de ações - apenas se tiver permissões
  const actionsColumn: ColumnDef<ProjectActivityData> = {
    id: "actions",
    header: pt.activitiesTable.actions,
    meta: {
      responsive: "always",
    },
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {hasUpdatePermission && (
            <DropdownMenuItem onClick={() => handleManageActivity(row.original)}>
              <Settings className="w-4 h-4 mr-2" />
              {pt.activitiesTable.manage_activity}
            </DropdownMenuItem>
          )}
          
          {hasUpdatePermission && hasDeletePermission && <DropdownMenuSeparator />}

          {hasDeletePermission && (
            <DropdownMenuItem 
              onClick={() => handleDeleteActivity(row.original)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {pt.activitiesTable.remove}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }

  // Combinar colunas condicionalmente
  const columns = hasActionsPermission 
    ? [...baseColumns, actionsColumn]
    : baseColumns

  return (
    <>
      <UseTable
        columns={columns}
        data={filteredActivities}
        showSearch={false}
        showColumnToggle={false}
        onRowClick={enableRowSelection ? undefined : handleManageActivity}
        enableRowSelection={enableRowSelection}
        selectedRows={selectedActivities}
        onSelectionChange={onSelectionChange}
        batchEditFields={batchEditFields}
        batchActions={batchActions}
        batchPrimaryAction={batchPrimaryAction}
        batchSummary={batchSummary}
        emptyMessage={
          filterSubsidized 
            ? (statusFilter !== "all" || priorityFilter !== "all" || tagFilter !== "all" || searchQuery !== ""
                ? pt.activitiesTable.adjust_filters
                : pt.activitiesTable.create_first_subsidized)
            : (statusFilter !== "all" || priorityFilter !== "all" || tagFilter !== "all" || searchQuery !== ""
                ? pt.activitiesTable.adjust_filters
                : pt.activitiesTable.create_first_non_subsidized)
        }
      />

      {/* View Activity Modal */}
      <ActivityDetailsModal
        isOpen={isViewActivityModalOpen}
        onClose={() => setIsViewActivityModalOpen(false)}
        activity={selectedActivityForView}
        project={project}
        institutionUsers={institutionUsers}
        onSave={(updatedActivity) => {
          if (onSaveActivity) {
            onSaveActivity(updatedActivity)
          }
          setIsViewActivityModalOpen(false)
        }}
      />

      {/* Delete Activity Modal */}
      <DeleteActivityModal
        isOpen={isDeleteModalOpen}
        onOpenChangeAction={setIsDeleteModalOpen}
        activity={selectedActivityForDelete}
        onSuccess={(deletedActivity) => {
          if (onDeleteActivity) {
            onDeleteActivity(deletedActivity)
          }
          setSelectedActivityForDelete(null)
        }}
      />
    </>
  )
}