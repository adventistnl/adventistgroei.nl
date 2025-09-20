"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus
} from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { projectTranslations } from "@/lib/translations/projects"
import { 
  mockSubsidyRequests, 
  mockSubsidyActivities, 
  mockSubsidyReceipts,
  mockSubsidyStatuses
} from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"

export interface ActivityTableData {
  id: string
  subsidy_request_id: string
  name: string
  description: string
  budget_amount: number
  status: string
  created_at: string
  updated_at: string
  approvedAmount: number
  receiptsCount: number
  pendingAmount: number
}

interface ProjectActivitiesTableProps {
  project: ProjectTableData
  onEditActivity?: (activity: ActivityTableData) => void
  onDeleteActivity?: (activity: ActivityTableData) => void
  onAddActivity?: () => void
}

export function ProjectActivitiesTable({ 
  project, 
  onEditActivity, 
  onDeleteActivity, 
  onAddActivity 
}: ProjectActivitiesTableProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [selectedActivity, setSelectedActivity] = useState<ActivityTableData | null>(null)
  const [isReceiptsSheetOpen, setIsReceiptsSheetOpen] = useState(false)

  // Get project activities with calculated data
  const projectActivities: ActivityTableData[] = React.useMemo(() => {
    const subsidyRequests = mockSubsidyRequests.filter(req => req.project_id === project.id)
    const activities = subsidyRequests.flatMap(req => 
      mockSubsidyActivities.filter(act => act.subsidy_request_id === req.id)
    )

    return activities.map(activity => {
      const receipts = mockSubsidyReceipts.filter(rec => rec.subsidy_activities_id === activity.id)
      const approvedReceipts = receipts.filter(rec => rec.approved)
      const approvedAmount = approvedReceipts.reduce((sum, rec) => sum + rec.amount, 0)
      const pendingAmount = activity.budget_amount - approvedAmount

      return {
        ...activity,
        approvedAmount,
        receiptsCount: receipts.length,
        pendingAmount: Math.max(0, pendingAmount)
      }
    })
  }, [project.id])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { 
        label: "Aprovado", 
        className: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle
      },
      pending: { 
        label: "Pendente", 
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Clock
      },
      under_review: { 
        label: "Em Análise", 
        className: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Eye
      },
      rejected: { 
        label: "Rejeitado", 
        className: "bg-red-100 text-red-700 border-red-200",
        icon: AlertCircle
      },
      completed: { 
        label: "Concluído", 
        className: "bg-gray-100 text-gray-700 border-gray-200",
        icon: CheckCircle
      }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const handleViewReceipts = (activity: ActivityTableData) => {
    setSelectedActivity(activity)
    setIsReceiptsSheetOpen(true)
  }

  const getActivityReceipts = (activityId: string) => {
    return mockSubsidyReceipts.filter(rec => rec.subsidy_activities_id === activityId)
  }

  const columns: ColumnDef<ActivityTableData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t.details.activityName,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-sm">{row.original.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {row.original.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "budget",
      accessorKey: "budget_amount",
      header: t.details.activityBudget,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium">
            R$ {row.original.budget_amount.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Planejado
          </div>
        </div>
      ),
    },
    {
      id: "approved",
      header: t.details.approvedAmount,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-green-600">
            R$ {row.original.approvedAmount.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            {((row.original.approvedAmount / row.original.budget_amount) * 100).toFixed(0)}%
          </div>
        </div>
      ),
    },
    {
      id: "receipts",
      header: t.details.receiptsCount,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium">{row.original.receiptsCount}</div>
          <div className="text-xs text-muted-foreground">
            recibos
          </div>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t.details.activityStatus,
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleViewReceipts(row.original)}>
              <FileText className="w-4 h-4 mr-2" />
              {t.details.viewReceipts}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditActivity?.(row.original)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.details.editActivity}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDeleteActivity?.(row.original)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t.details.deleteActivity}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t.details.subsidyActivities}
            </CardTitle>
            <CardDescription>
              Lista detalhada das atividades de subsídio do projeto
            </CardDescription>
          </div>
          <Button onClick={onAddActivity} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            {t.details.addActivity}
          </Button>
        </CardHeader>
        <CardContent>
          {projectActivities.length > 0 ? (
            <DataTable
              columns={columns}
              data={projectActivities}
              searchKey="name"
              searchPlaceholder="Buscar atividades..."
              filterableColumns={[
                {
                  id: "status",
                  title: "Status",
                  options: [
                    { label: "Aprovado", value: "approved" },
                    { label: "Pendente", value: "pending" },
                    { label: "Em Análise", value: "under_review" },
                    { label: "Rejeitado", value: "rejected" },
                    { label: "Concluído", value: "completed" }
                  ]
                }
              ]}
            />
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {t.details.noActivities}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t.details.noActivitiesDesc}
              </p>
              <Button onClick={onAddActivity} className="gap-2">
                <Plus className="w-4 h-4" />
                {t.details.addActivity}
              </Button>
            </div>
          )}
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
                      <p className="font-medium">R$ {selectedActivity.budget_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Aprovado:</span>
                      <p className="font-medium text-green-600">R$ {selectedActivity.approvedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pendente:</span>
                      <p className="font-medium text-yellow-600">R$ {selectedActivity.pendingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedActivity.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Receipts List */}
              <div className="space-y-3">
                <h4 className="font-medium">Recibos ({selectedActivity.receiptsCount})</h4>
                {getActivityReceipts(selectedActivity.id).map((receipt, index) => (
                  <Card key={receipt.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            receipt.approved ? "bg-green-100" : "bg-yellow-100"
                          }`}>
                            <FileText className={`w-4 h-4 ${
                              receipt.approved ? "text-green-600" : "text-yellow-600"
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{receipt.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(receipt.receipt_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {receipt.amount.toLocaleString()}</p>
                          <Badge 
                            variant="outline" 
                            className={receipt.approved ? 
                              "text-green-600 border-green-200 bg-green-50" : 
                              "text-yellow-600 border-yellow-200 bg-yellow-50"
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
                    <p className="text-muted-foreground">Nenhum recibo encontrado</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
