"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  DollarSign,
  User,
  Building,
  FileText,
  Upload,
  Activity,
  Clock,
  AlertTriangle,
  Eye,
  Filter
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { 
  mockSubsidyRequests, 
  mockSubsidyActivities, 
  mockSubsidyReceipts,
  mockSubsidyStatuses,
  mockChurches,
  mockUsers
} from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"

export interface SubsidyRequestData {
  id: string
  institution_id: string
  requester_id: string
  department_project_id: string
  church_id: string
  description: string
  total_budget: number
  subsidy_statuses_id: string
  created_at: string
  updated_at: string
  project_id: string
  completion_rate: number
  approved_amount: number
  pending_amount: number
  activities: ActivityData[]
}

export interface ActivityData {
  id: string
  subsidy_request_id: string
  name: string
  description: string
  budget_amount: number
  status: string
  created_at: string
  updated_at: string
  receipts: ReceiptData[]
  approvedAmount: number
  receiptsCount: number
  progressPercentage: number
}

export interface ReceiptData {
  id: string
  subsidy_activities_id: string
  file_path: string
  amount: number
  approved: boolean
  description: string
  receipt_date: string
  created_at: string
  updated_at: string
}

interface ProjectSubsidiesTableProps {
  project: ProjectTableData
  onAddSubsidy?: () => void
  onEditSubsidy?: (subsidy: SubsidyRequestData) => void
  onDeleteSubsidy?: (subsidy: SubsidyRequestData) => void
  onApproveSubsidy?: (subsidy: SubsidyRequestData) => void
  onRejectSubsidy?: (subsidy: SubsidyRequestData) => void
  onAddActivity?: (subsidy: SubsidyRequestData) => void
  onEditActivity?: (activity: ActivityData) => void
  onDeleteActivity?: (activity: ActivityData) => void
  onUploadReceipt?: (activity: ActivityData) => void
  onViewReceipts?: (activity: ActivityData) => void
}

export function ProjectSubsidiesTable({ 
  project, 
  onAddSubsidy,
  onEditSubsidy,
  onDeleteSubsidy,
  onApproveSubsidy,
  onRejectSubsidy,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onUploadReceipt,
  onViewReceipts
}: ProjectSubsidiesTableProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("all")
  const [hoveredSubsidy, setHoveredSubsidy] = useState<string | null>(null)

  // Transform and enrich subsidy data
  const subsidyData: SubsidyRequestData[] = React.useMemo(() => {
    const subsidies = mockSubsidyRequests.filter(req => req.project_id === project.id)
    
    return subsidies.map(subsidy => {
      const activities = mockSubsidyActivities.filter(act => act.subsidy_request_id === subsidy.id)
      
      const enrichedActivities: ActivityData[] = activities.map(activity => {
        const receipts = mockSubsidyReceipts.filter(rec => rec.subsidy_activities_id === activity.id)
        const approvedReceipts = receipts.filter(rec => rec.approved)
        const approvedAmount = approvedReceipts.reduce((sum, rec) => sum + rec.amount, 0)
        const progressPercentage = activity.budget_amount > 0 ? (approvedAmount / activity.budget_amount) * 100 : 0

        return {
          ...activity,
          receipts,
          approvedAmount,
          receiptsCount: receipts.length,
          progressPercentage: Math.min(100, progressPercentage)
        }
      })

      return {
        ...subsidy,
        activities: enrichedActivities
      }
    })
  }, [project.id])

  // Filter subsidies by tab
  const filteredSubsidies = React.useMemo(() => {
    switch (activeTab) {
      case "pending":
        return subsidyData.filter(s => s.subsidy_statuses_id === "1")
      case "approved":
        return subsidyData.filter(s => s.subsidy_statuses_id === "3")
      case "rejected":
        return subsidyData.filter(s => s.subsidy_statuses_id === "4")
      case "under_review":
        return subsidyData.filter(s => s.subsidy_statuses_id === "2")
      default:
        return subsidyData
    }
  }, [subsidyData, activeTab])

  const toggleRowExpansion = (subsidyId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(subsidyId)) {
      newExpanded.delete(subsidyId)
    } else {
      newExpanded.add(subsidyId)
    }
    setExpandedRows(newExpanded)
  }

  const getStatusBadge = (statusId: string) => {
    const status = mockSubsidyStatuses.find(s => s.id === statusId)
    if (!status) return null

    const statusConfig = {
      "1": { className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800", icon: Clock },
      "2": { className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800", icon: AlertTriangle },
      "3": { className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800", icon: CheckCircle },
      "4": { className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800", icon: XCircle },
      "5": { className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800", icon: CheckCircle }
    }

    const config = statusConfig[statusId as keyof typeof statusConfig] || statusConfig["1"]
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.name}
      </Badge>
    )
  }

  const getTabCounts = () => {
    return {
      all: subsidyData.length,
      pending: subsidyData.filter(s => s.subsidy_statuses_id === "1").length,
      under_review: subsidyData.filter(s => s.subsidy_statuses_id === "2").length,
      approved: subsidyData.filter(s => s.subsidy_statuses_id === "3").length,
      rejected: subsidyData.filter(s => s.subsidy_statuses_id === "4").length,
    }
  }

  const tabCounts = getTabCounts()

  const getRequesterName = (requesterId: string) => {
    const user = mockUsers.find(u => u.id === requesterId)
    return user?.name || "Usuário não encontrado"
  }

  const getChurchName = (churchId: string) => {
    const church = mockChurches.find(c => c.id === churchId)
    return church?.name || "Igreja não encontrada"
  }

  if (subsidyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {t.subsidy.subsidyRequests}
          </CardTitle>
          <CardDescription>
            Pedidos de subsídio para este projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {t.subsidy.noSubsidies}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t.subsidy.noSubsidiesDesc}
            </p>
            <Button onClick={onAddSubsidy} className="gap-2">
              <Plus className="w-4 h-4" />
              {t.subsidy.addSubsidy}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {t.subsidy.subsidyRequests}
          </CardTitle>
          <CardDescription>
            Gestão de subsídios e atividades do projeto
          </CardDescription>
        </div>
        <Button onClick={onAddSubsidy} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          {t.subsidy.addSubsidy}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              Todos ({tabCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pendente ({tabCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="under_review" className="text-xs">
              Análise ({tabCounts.under_review})
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs">
              Aprovado ({tabCounts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs">
              Rejeitado ({tabCounts.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredSubsidies.length === 0 ? (
              <div className="text-center py-16">
                <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {activeTab === "all" ? "Nenhum subsídio encontrado" : `Nenhum subsídio ${activeTab === "pending" ? "pendente" : activeTab === "approved" ? "aprovado" : activeTab === "rejected" ? "rejeitado" : "em análise"}`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all" ? "Este projeto ainda não possui pedidos de subsídio." : "Não há subsídios nesta categoria."}
                </p>
                {activeTab === "all" && (
                  <Button onClick={onAddSubsidy} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t.subsidy.addSubsidy}
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border bg-muted/30">
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Valor Solicitado</TableHead>
                      <TableHead className="text-center">Valor Alocado</TableHead>
                      <TableHead className="text-center">Progresso</TableHead>
                      <TableHead className="text-center w-[200px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubsidies.map((subsidy) => {
                      const isExpanded = expandedRows.has(subsidy.id)
                      const isHovered = hoveredSubsidy === subsidy.id
                      const allocatedBudget = subsidy.activities.reduce((sum, act) => sum + act.budget_amount, 0)
                      const canApprove = subsidy.subsidy_statuses_id === "1" || subsidy.subsidy_statuses_id === "2"
                      const canReject = subsidy.subsidy_statuses_id !== "4" && subsidy.subsidy_statuses_id !== "3"
                      
                      return (
                        <Collapsible key={subsidy.id} asChild>
                          <>
                            {/* Main Subsidy Row */}
                            <TableRow 
                              className="hover:bg-muted/50 transition-colors border-b border-border"
                              onMouseEnter={() => setHoveredSubsidy(subsidy.id)}
                              onMouseLeave={() => setHoveredSubsidy(null)}
                            >
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-primary/10"
                                  onClick={() => toggleRowExpansion(subsidy.id)}
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-primary" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-primary" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                        
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{subsidy.description}</div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {getRequesterName(subsidy.requester_id)}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {getChurchName(subsidy.church_id)}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                        
                            <TableCell className="text-center">
                              {getStatusBadge(subsidy.subsidy_statuses_id)}
                            </TableCell>
                            
                            <TableCell className="text-center">
                              <div className="font-medium text-primary">
                                R$ {subsidy.total_budget.toLocaleString()}
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-center">
                              <div>
                                <div className="font-medium text-green-600 dark:text-green-400">
                                  R$ {allocatedBudget.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {subsidy.activities.length} atividades
                                </div>
                              </div>
                            </TableCell>
                        
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <div className="relative w-12 h-12">
                                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                      className="text-muted stroke-2"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                      className="text-primary"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      fill="none"
                                      strokeDasharray={`${subsidy.completion_rate}, 100`}
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">
                                      {subsidy.completion_rate}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                        
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                {/* Apple-style Approve Button */}
                                {canApprove && (
                                  <div className="relative group">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className={cn(
                                        "h-8 transition-all duration-200 ease-in-out",
                                        isHovered ? "w-20 px-3" : "w-8 px-0",
                                        "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                      )}
                                      onClick={() => onApproveSubsidy?.(subsidy)}
                                    >
                                      <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                      <span className={cn(
                                        "ml-1 text-xs transition-opacity duration-200",
                                        isHovered ? "opacity-100" : "opacity-0 w-0"
                                      )}>
                                        Aprovar
                                      </span>
                                    </Button>
                                  </div>
                                )}
                                
                                {/* Apple-style Reject Button */}
                                {canReject && (
                                  <div className="relative group">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className={cn(
                                        "h-8 transition-all duration-200 ease-in-out",
                                        isHovered ? "w-20 px-3" : "w-8 px-0",
                                        "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      )}
                                      onClick={() => onRejectSubsidy?.(subsidy)}
                                    >
                                      <XCircle className="w-3 h-3 flex-shrink-0" />
                                      <span className={cn(
                                        "ml-1 text-xs transition-opacity duration-200",
                                        isHovered ? "opacity-100" : "opacity-0 w-0"
                                      )}>
                                        Rejeitar
                                      </span>
                                    </Button>
                                  </div>
                                )}
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => onEditSubsidy?.(subsidy)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      {t.subsidy.editSubsidy}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onAddActivity?.(subsidy)}>
                                      <Plus className="w-4 h-4 mr-2" />
                                      {t.activity.addActivity}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => onDeleteSubsidy?.(subsidy)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      {t.subsidy.deleteSubsidy}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>

                            {/* Expanded Activities Section */}
                            <CollapsibleContent asChild>
                              <TableRow>
                                <TableCell colSpan={7} className="p-0 bg-muted/20 dark:bg-muted/10">
                                <div className="p-6 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Activity className="w-4 h-4 text-primary" />
                                      <span className="text-sm font-medium text-primary">
                                        Atividades ({subsidy.activities.length})
                                      </span>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => onAddActivity?.(subsidy)}
                                      className="gap-2 text-primary border-primary/20 hover:bg-primary/5"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span className="hidden sm:inline">Nova Atividade</span>
                                    </Button>
                                  </div>
                              
                                  {subsidy.activities.length > 0 ? (
                                    <div className="space-y-3">
                                      {/* Activities Table Header - Hidden on mobile */}
                                      <div className="hidden md:grid md:grid-cols-12 gap-4 text-xs font-medium text-muted-foreground border-b border-border pb-2">
                                        <div className="col-span-4">Nome & Descrição</div>
                                        <div className="col-span-2 text-center">Orçamento</div>
                                        <div className="col-span-2 text-center">Upload Recibo</div>
                                        <div className="col-span-2 text-center">Ver Recibos</div>
                                        <div className="col-span-2 text-right">Ações</div>
                                      </div>
                                  
                                      {subsidy.activities.map((activity) => (
                                        <div key={activity.id} className="bg-background rounded-lg border border-border p-4 hover:shadow-sm transition-all">
                                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                            {/* Activity Info */}
                                            <div className="md:col-span-4">
                                              <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                  <Activity className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                  <div className="font-medium text-sm mb-1">{activity.name}</div>
                                                  <div className="text-xs text-muted-foreground line-clamp-2">
                                                    {activity.description}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* Budget Amount */}
                                            <div className="md:col-span-2 text-center">
                                              <div className="text-sm font-medium text-primary">
                                                R$ {activity.budget_amount.toLocaleString()}
                                              </div>
                                              <div className="text-xs text-muted-foreground">
                                                Orçamento
                                              </div>
                                            </div>
                                            
                                            {/* Upload Receipt */}
                                            <div className="md:col-span-2 text-center">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onUploadReceipt?.(activity)}
                                                className="gap-1 text-primary border-primary/20 hover:bg-primary/5"
                                              >
                                                <Upload className="w-3 h-3" />
                                                <span className="hidden sm:inline">Recibo</span>
                                              </Button>
                                            </div>
                                            
                                            {/* View Receipts */}
                                            <div className="md:col-span-2 text-center">
                                              {activity.receiptsCount > 0 ? (
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => onViewReceipts?.(activity)}
                                                  className="gap-1 text-primary hover:bg-primary/5"
                                                >
                                                  <Eye className="w-3 h-3" />
                                                  <span className="hidden sm:inline">Ver {activity.receiptsCount}</span>
                                                  <span className="sm:hidden">{activity.receiptsCount}</span>
                                                </Button>
                                              ) : (
                                                <span className="text-xs text-muted-foreground">Sem recibos</span>
                                              )}
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="md:col-span-2 text-right">
                                              <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                  </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                  <DropdownMenuItem onClick={() => onEditActivity?.(activity)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    {t.activity.editActivity}
                                                  </DropdownMenuItem>
                                                  <DropdownMenuSeparator />
                                                  <DropdownMenuItem 
                                                    onClick={() => onDeleteActivity?.(activity)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                  >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    {t.activity.deleteActivity}
                                                  </DropdownMenuItem>
                                                </DropdownMenuContent>
                                              </DropdownMenu>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 bg-background rounded-lg border border-dashed border-primary/20">
                                      <Activity className="w-8 h-8 text-primary/60 mx-auto mb-2" />
                                      <p className="text-sm text-primary/80 mb-3">
                                        Nenhuma atividade cadastrada
                                      </p>
                                      <Button 
                                        size="sm" 
                                        onClick={() => onAddActivity?.(subsidy)}
                                        className="gap-2"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Adicionar Primeira Atividade
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </CardContent>
    </Card>
  )
}