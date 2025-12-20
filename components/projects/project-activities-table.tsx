"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  DollarSign
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
import { ActivityTags } from "@/types/graphql-global-types"

// Schema-based interfaces
export interface ProjectActivityData {
  id: string
  project_id: string
  name: string
  description: string
  activity_tag?: ActivityTags
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
  tags?: string[]
  custom_tags?: string[]
  owner_id?: string
  owner?: {
    id: string
    name: string
    email: string
  }
  activity_funding?: Array<{
    id: string
    entity_contribution_amount: number
    entity_contribution_percent: number
    entity_type: string
    entity_id: string
  }>
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
  const { t } = useTranslation()
  const [isViewActivityModalOpen, setIsViewActivityModalOpen] = useState(false)
  const [selectedActivityForView, setSelectedActivityForView] = useState<ProjectActivityData | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedActivityForDelete, setSelectedActivityForDelete] = useState<ProjectActivityData | null>(null)

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
      const matchesTag = tagFilter === "all" || activity.activity_tag === tagFilter
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

    const labels: Record<ActivityTags, string> = {
      [ActivityTags.Reform]: 'Reforma',
      [ActivityTags.Equipment]: 'Equipamento',
      [ActivityTags.Materials]: 'Material',
      [ActivityTags.Training]: 'Treinamento',
      [ActivityTags.Travel]: 'Viagem',
      [ActivityTags.Event]: 'Evento',
      [ActivityTags.Transport]: 'Transporte',
      [ActivityTags.Marketing]: 'Marketing',
      [ActivityTags.Services]: 'Serviços',
      [ActivityTags.Feeding]: 'Alimentação',
      [ActivityTags.Accommodation]: 'Acomodação',
    }

    return labels[tag] || tag
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "TODO": "Pendente",
      "todo": "Pendente",
      "IN_PROGRESS": "Em Andamento",
      "in_progress": "Em Andamento",
      "COMPLETED": "Concluído",
      "completed": "Concluído",
      "ON_HOLD": "Em Espera",
      "on_hold": "Em Espera"
    }

    return labels[status] || status
  }

  // Monochromatic design - all elements use gray tones except subsidy indicator
  const getActivityTagColor = () => {
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed": return <CheckCircle className="w-4 h-4 text-gray-600" />
      case "in_progress": return <Clock className="w-4 h-4 text-gray-600" />
      case "todo":
      case "pending": return <AlertCircle className="w-4 h-4 text-gray-600" />
      case "on_hold": return <Settings className="w-4 h-4 text-gray-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getPriorityColor = () => {
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(amount)
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

  // Table columns
  const columns: ColumnDef<ProjectActivityData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t('activities.table.activity'),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground max-w-xs truncate line-clamp-2">
              {row.original.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "activity_tag",
      accessorKey: "activity_tag",
      header: t('activities.table.category'),
      cell: ({ row }) => (
        <Badge variant="outline" className={`${getActivityTagColor()} flex items-center gap-1 w-fit`}>
          {getActivityTagIcon(row.original.activity_tag)}
          <span className="capitalize">{getActivityTagLabel(row.original.activity_tag)}</span>
        </Badge>
      ),
    },
    {
      id: "subsidy_status",
      header: t('activities.table.subsidy_status'),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            row.original.is_subsidized 
              ? 'bg-green-100 border-2 border-green-300' 
              : 'bg-gray-100 border-2 border-gray-300'
          }`}>
            <DollarSign className={`w-4 h-4 ${
              row.original.is_subsidized ? 'text-green-600' : 'text-gray-400'
            }`} />
          </div>
        </div>
      ),
    },
    {
      id: "budget_amount",
      accessorKey: "budget_amount",
      header: t('activities.table.budget'),
      cell: ({ row }) => (
        <div className="font-medium">{formatCurrency(row.original.budget_amount)}</div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t('activities.table.status'),
      cell: ({ row }) => (
        <Badge variant="outline" className={`${getStatusColor()} flex items-center gap-1 w-fit`}>
          {getStatusIcon(row.original.status)}
          <span>{getStatusLabel(row.original.status)}</span>
        </Badge>
      ),
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: t('activities.table.priority'),
      cell: ({ row }) => (
        <Badge variant="outline" className={`${getPriorityColor()} capitalize w-fit`}>
          {row.original.priority}
        </Badge>
      ),
    },
    {
      id: "assigned_users",
      header: "Responsáveis",
      cell: ({ row }) => {
        const assignedUsers = row.original.assigned_users || []
        const maxDisplay = 3
        const displayedUsers = assignedUsers.slice(0, maxDisplay)
        const remainingCount = assignedUsers.length - maxDisplay
        
        if (assignedUsers.length === 0) {
          return (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Nenhum
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
                      <AvatarFallback className="text-[9px] bg-gradient-to-br from-blue-500 to-purple-500 text-white">
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
    {
      id: "actions",
      header: t('activities.table.actions'),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleManageActivity(row.original)}>
              <Settings className="w-4 h-4 mr-2" />
              {t('activities.table.manage_activity')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteActivity(row.original)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('activities.table.remove')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

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
                ? t('activities.table.adjust_filters')
                : t('activities.table.create_first_subsidized'))
            : (statusFilter !== "all" || priorityFilter !== "all" || tagFilter !== "all" || searchQuery !== ""
                ? t('activities.table.adjust_filters')
                : t('activities.table.create_first_non_subsidized'))
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