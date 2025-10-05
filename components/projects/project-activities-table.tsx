"use client"

import React, { useState, useMemo } from "react"
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
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Upload,
  FileText,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import toast from "react-hot-toast"
import { ProjectTableData } from "@/components/projects/projects-table"
import { mockProjectActivities, getActivitiesByProjectId } from "@/data/mockData"
import { ActivityOverlayModal } from "@/components/modals/project/activity-overlay-modal"

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
  const [isLoading, setIsLoading] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ProjectActivityData | null>(null)
  const [isReceiptsSheetOpen, setIsReceiptsSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"subsidized" | "non-subsidized">("subsidized")
  const [isViewActivityModalOpen, setIsViewActivityModalOpen] = useState(false)
  const [selectedActivityForView, setSelectedActivityForView] = useState<ProjectActivityData | null>(null)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

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
      const matchesSearch = searchQuery === "" || 
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesStatus && matchesPriority && matchesTag && matchesSearch
    })
  }, [currentActivities, statusFilter, priorityFilter, tagFilter, searchQuery])

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

  // Get receipts for activity
  const getActivityReceipts = (activityId: string) => {
    return mockReceipts.filter(receipt => receipt.project_activities_id === activityId)
  }

  // Event handlers
  const handleViewActivity = (activity: ProjectActivityData) => {
    setSelectedActivityForView(activity)
    setIsViewActivityModalOpen(true)
  }

  const handleEditActivity = (activity: ProjectActivityData) => {
    if (onEditActivity) {
      onEditActivity(activity)
    } else {
      toast.success(`Editando: ${activity.name}`, { duration: 2000 })
    }
  }

  const handleDeleteActivity = (activity: ProjectActivityData) => {
    if (onDeleteActivity) {
      onDeleteActivity(activity)
    } else {
      toast.success(`Removendo: ${activity.name}`, { duration: 2000 })
    }
  }

  const handleUploadReceipt = (activity: ProjectActivityData) => {
    if (onUploadReceipt) {
      onUploadReceipt(activity)
    } else {
      toast.success(`Upload de recibo para: ${activity.name}`, { duration: 2000 })
    }
  }

  const handleViewReceipts = (activity: ProjectActivityData) => {
    setSelectedActivity(activity)
    setIsReceiptsSheetOpen(true)
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setPriorityFilter("all")
    setTagFilter("all")
    setSearchQuery("")
    toast.success("Filtros limpos", { duration: 1500 })
  }

  // Table columns
  const columns: ColumnDef<ProjectActivityData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Atividade",
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
      header: "Categoria",
      cell: ({ row }) => (
        <Badge variant="outline" className={`${getActivityTagColor()} flex items-center gap-1 w-fit`}>
          {getActivityTagIcon(row.original.activity_tag)}
          <span className="capitalize">{row.original.activity_tag}</span>
        </Badge>
      ),
    },
    {
      id: "subsidy_status",
      header: "Subsídio",
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
      header: "Orçamento",
      cell: ({ row }) => (
        <div className="font-medium">{formatCurrency(row.original.budget_amount)}</div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
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
      header: "Prioridade",
      cell: ({ row }) => (
        <Badge variant="outline" className={`${getPriorityColor()} capitalize w-fit`}>
          {row.original.priority}
        </Badge>
      ),
    },
    {
      id: "receipts",
      header: "Recibos",
      cell: ({ row }) => {
        const receipts = getActivityReceipts(row.original.id)
        const approvedCount = receipts.filter(r => r.approved).length
        return (
          <div className="text-center">
            <div className="font-medium">{receipts.length}</div>
            {approvedCount > 0 && (
              <div className="text-xs text-green-600">
                {approvedCount} aprovados
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleViewActivity(row.original)}>
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewReceipts(row.original)}>
              <FileText className="w-4 h-4 mr-2" />
              Ver Recibos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleUploadReceipt(row.original)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Recibo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditActivity(row.original)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteActivity(row.original)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remover
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
                Atividades do Projeto
              </CardTitle>
              <CardDescription>
                Gerencie as atividades e seus respectivos recibos
              </CardDescription>
            </div>
            <Button onClick={onAddActivity}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Atividade
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
                Subsidiadas ({subsidizedActivities.length})
              </TabsTrigger>
              <TabsTrigger value="non-subsidized" className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-2.5 h-2.5 text-gray-400" />
                </div>
                Não Subsidiadas ({nonSubsidizedActivities.length})
              </TabsTrigger>
            </TabsList>

            {/* Filters Section */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar atividade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 h-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder="Status" />
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
                  <SelectValue placeholder="Prioridade" />
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
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="reforma">Reforma</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="training">Treinamento</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={clearFilters} className="h-8">
                Limpar
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
                    Nenhuma atividade subsidiada encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || tagFilter !== "all"
                      ? "Ajuste os filtros para ver mais atividades."
                      : "Comece criando a primeira atividade subsidiada do projeto."
                    }
                  </p>
                  <Button onClick={onAddActivity}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Atividade
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
                    Nenhuma atividade não subsidiada encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || tagFilter !== "all"
                      ? "Ajuste os filtros para ver mais atividades."
                      : "Comece criando a primeira atividade não subsidiada do projeto."
                    }
                  </p>
                  <Button onClick={onAddActivity}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Atividade
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Receipts Sheet */}
      <Sheet open={isReceiptsSheetOpen} onOpenChange={setIsReceiptsSheetOpen}>
        <SheetContent className="sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recibos da Atividade
            </SheetTitle>
            <SheetDescription>
              {selectedActivity?.name}
            </SheetDescription>
          </SheetHeader>
          
          {selectedActivity && (
            <div className="mt-6 space-y-4">
              {/* Activity Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Resumo da Atividade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Orçamento:</span>
                      <p className="font-medium">{formatCurrency(selectedActivity.budget_amount)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="mt-1">
                        <Badge variant="outline" className={getStatusColor()}>
                          {selectedActivity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Receipts List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    Recibos ({getActivityReceipts(selectedActivity.id).length})
                  </h4>
                  <Button size="sm" onClick={() => handleUploadReceipt(selectedActivity)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                
                {getActivityReceipts(selectedActivity.id).map((receipt) => (
                  <Card key={receipt.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            receipt.approved ? "bg-green-100" : "bg-orange-100"
                          }`}>
                            <FileText className={`w-4 h-4 ${
                              receipt.approved ? "text-green-600" : "text-orange-600"
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Recibo #{receipt.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(receipt.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(receipt.amount)}</p>
                          <Badge 
                            variant="outline" 
                            className={receipt.approved ? 
                              "text-green-600 border-green-200 bg-green-50" : 
                              "text-orange-600 border-orange-200 bg-orange-50"
                            }
                          >
                            {receipt.approved ? "Aprovado" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {getActivityReceipts(selectedActivity.id).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-4">Nenhum recibo encontrado</p>
                    <Button onClick={() => handleUploadReceipt(selectedActivity)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Primeiro Recibo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* View Activity Modal */}
      <ActivityOverlayModal
        isOpen={isViewActivityModalOpen}
        onClose={() => setIsViewActivityModalOpen(false)}
        activity={selectedActivityForView}
        onEdit={(activity: ProjectActivityData) => {
          console.log("Editar atividade:", activity)
          setSelectedActivityForView(null)
          setIsViewActivityModalOpen(false)
          toast.success("Modal de edição seria aberta aqui")
        }}
      />
    </>
  )
}