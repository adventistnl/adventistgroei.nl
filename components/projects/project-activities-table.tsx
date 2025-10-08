"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import {
  Activity,
  Plus,
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

import toast from "react-hot-toast"
import { ProjectTableData } from "@/components/projects/projects-table"
import { mockProjectActivities, getActivitiesByProjectId } from "@/data/mockData"
import { ActivityDetailsModal } from "@/components/modals/project/activity-details-modal"
import { DeleteActivityModal } from "@/components/modals/project/delete-activity-modal"

// Schema-based interfaces
export interface ProjectActivityData {
  id: string
  project_id: string
  name: string
  description: string
  activity_tag: "reforma" | "material" | "training"
  budget_amount: number
  status: string
  priority: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
  // Additional fields
  is_subsidized: boolean
  subsidy_amount?: number
  spent_amount?: number
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
  onAddActivity?: () => void
  onEditActivity?: (activity: ProjectActivityData) => void
  onDeleteActivity?: (activity: ProjectActivityData) => void
  onViewActivity?: (activity: ProjectActivityData) => void
  onUploadReceipt?: (activity: ProjectActivityData) => void
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
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onViewActivity,
  onUploadReceipt
}: ProjectActivitiesTableProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<"subsidized" | "non-subsidized">("subsidized")
  const [isViewActivityModalOpen, setIsViewActivityModalOpen] = useState(false)
  const [selectedActivityForView, setSelectedActivityForView] = useState<ProjectActivityData | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedActivityForDelete, setSelectedActivityForDelete] = useState<ProjectActivityData | null>(null)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")

  // Get project activities
  const projectActivities = getActivitiesByProjectId(project.id) as ProjectActivityData[]

  // Separate activities by subsidy status
  const subsidizedActivities = projectActivities.filter(activity => activity.is_subsidized)
  const nonSubsidizedActivities = projectActivities.filter(activity => !activity.is_subsidized)
  
  // Get current tab data
  const currentActivities = activeTab === "subsidized" ? subsidizedActivities : nonSubsidizedActivities

  // Apply filters
  const filteredActivities = useMemo(() => {
    return currentActivities.filter((activity: ProjectActivityData) => {
      const matchesStatus = statusFilter === "all" || activity.status === statusFilter
      const matchesPriority = priorityFilter === "all" || activity.priority === priorityFilter
      const matchesTag = tagFilter === "all" || activity.activity_tag === tagFilter
      
      return matchesStatus && matchesPriority && matchesTag
    })
  }, [currentActivities, statusFilter, priorityFilter, tagFilter])

  // Helper functions
  const getActivityTagIcon = (tag: string) => {
    switch (tag) {
      case "reforma": return <Wrench className="w-4 h-4" />
      case "material": return <Package className="w-4 h-4" />
      case "training": return <GraduationCap className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  // Monochromatic design - all elements use gray tones except subsidy indicator
  const getActivityTagColor = () => {
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-gray-600" />
      case "in_progress": return <Clock className="w-4 h-4 text-gray-600" />
      case "pending": return <AlertCircle className="w-4 h-4 text-gray-600" />
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

  const clearFilters = () => {
    setStatusFilter("all")
    setPriorityFilter("all")
    setTagFilter("all")
    toast.success(t('activities.table.filters_cleared'), { duration: 1500 })
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
            <div className="text-xs text-muted-foreground line-clamp-1">
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
          <span className="capitalize">{row.original.activity_tag}</span>
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
          <span className="capitalize">{row.original.status}</span>
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-600" />
                {t('activities.table.activity')} do Projeto
              </CardTitle>
              <CardDescription>
                Gerencie as atividades do projeto
              </CardDescription>
            </div>
            <Button onClick={onAddActivity}>
              <Plus className="w-4 h-4 mr-2" />
              {t('activities.table.new_activity')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "subsidized" | "non-subsidized")} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subsidized" className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-2.5 h-2.5 text-green-600" />
                </div>
                {t('activities.table.subsidized_tab')} ({subsidizedActivities.length})
              </TabsTrigger>
              <TabsTrigger value="non-subsidized" className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-2.5 h-2.5 text-gray-400" />
                </div>
                {t('activities.table.non_subsidized_tab')} ({nonSubsidizedActivities.length})
              </TabsTrigger>
            </TabsList>

            {/* Filters Section - positioned near columns */}
            <div className="flex justify-end items-center gap-4 mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder={t('activities.table.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder={t('activities.table.priority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder={t('activities.table.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="reforma">Reforma</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="training">Treinamento</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={clearFilters} className="h-8">
                {t('activities.table.clear_filters')}
              </Button>
            </div>

            <TabsContent value="subsidized" className="space-y-4">
              {filteredActivities.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={filteredActivities}
                  searchKey="name"
                  searchPlaceholder="Buscar atividades subsidiadas..."
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    {t('activities.table.no_subsidized_found')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {statusFilter !== "all" || priorityFilter !== "all" || tagFilter !== "all"
                      ? t('activities.table.adjust_filters')
                      : t('activities.table.create_first_subsidized')
                    }
                  </p>
                  <Button onClick={onAddActivity}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('activities.table.new_activity')}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="non-subsidized" className="space-y-4">
              {filteredActivities.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={filteredActivities}
                  searchKey="name"
                  searchPlaceholder="Buscar atividades não subsidiadas..."
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    {t('activities.table.no_non_subsidized_found')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {statusFilter !== "all" || priorityFilter !== "all" || tagFilter !== "all"
                      ? t('activities.table.adjust_filters')
                      : t('activities.table.create_first_non_subsidized')
                    }
                  </p>
                  <Button onClick={onAddActivity}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('activities.table.new_activity')}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>



      {/* View Activity Modal */}
      <ActivityDetailsModal
        isOpen={isViewActivityModalOpen}
        onClose={() => setIsViewActivityModalOpen(false)}
        activity={selectedActivityForView}
        project={project}
        onSave={(updatedActivity) => {
          console.log("Salvar atividade:", updatedActivity)
          toast.success("Atividade salva com sucesso!")
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